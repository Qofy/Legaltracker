import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GuestPass } from './guest-pass.entity';
import { User } from '../users/user.entity';
import { CasesService } from '../cases/cases.service';
import * as crypto from 'crypto';

@Injectable()
export class GuestPassesService {
  constructor(
    @InjectRepository(GuestPass)
    private guestPassesRepository: Repository<GuestPass>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private casesService: CasesService,
  ) {}

  private generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async create(createGuestPassDto: any, user: User): Promise<GuestPass> {
    const { case_id, email, access_level, expires_at } = createGuestPassDto;

    // Check if user has access to the case
    const hasAccess = await this.casesService.canAccessCase(case_id, user);
    if (!hasAccess) {
      throw new ForbiddenException('You do not have permission to create guest passes for this case');
    }

    const newGuestPass = this.guestPassesRepository.create({
      token: this.generateToken(),
      case_id,
      email,
      access_level: access_level || 'view_only',
      expires_at: expires_at || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
      created_by_id: user.id,
      is_active: true,
    });

    return await this.guestPassesRepository.save(newGuestPass);
  }

  async findAll(user: User, filters?: any): Promise<GuestPass[]> {
    const queryBuilder = this.guestPassesRepository
      .createQueryBuilder('guest_pass')
      .leftJoinAndSelect('guest_pass.case', 'case')
      .leftJoinAndSelect('case.owners', 'owner')
      .leftJoinAndSelect('case.customers', 'customer')
      .leftJoinAndSelect('case.shared_users', 'shared_user')
      .leftJoinAndSelect('guest_pass.created_by', 'created_by');

    // Apply RLS - user must have access to the case
    if (user.user_type !== 'admin') {
      queryBuilder.where(
        '(owner.id = :userId OR customer.id = :userId OR shared_user.id = :userId)',
        { userId: user.id }
      );
    }

    // Apply filters
    if (filters?.case_id) {
      queryBuilder.andWhere('guest_pass.case_id = :case_id', { case_id: filters.case_id });
    }
    if (filters?.is_active !== undefined) {
      queryBuilder.andWhere('guest_pass.is_active = :is_active', { is_active: filters.is_active });
    }
    if (filters?.email) {
      queryBuilder.andWhere('guest_pass.email = :email', { email: filters.email });
    }

    queryBuilder.orderBy('guest_pass.created_date', 'DESC');

    return await queryBuilder.getMany();
  }

  async findOne(id: string, user: User): Promise<GuestPass> {
    const guestPass = await this.guestPassesRepository.findOne({
      where: { id },
      relations: ['case', 'case.owners', 'case.customers', 'case.shared_users', 'created_by'],
    });

    if (!guestPass) {
      throw new NotFoundException('Guest pass not found');
    }

    // Check if user has access to the case
    const hasAccess = await this.casesService.canAccessCase(guestPass.case_id, user);
    if (!hasAccess) {
      throw new ForbiddenException('You do not have permission to access this guest pass');
    }

    return guestPass;
  }

  async update(id: string, updateGuestPassDto: any, user: User): Promise<GuestPass> {
    const guestPass = await this.findOne(id, user);

    // Check if user can edit (must have case access)
    const hasAccess = await this.casesService.canAccessCase(guestPass.case_id, user);
    if (!hasAccess) {
      throw new ForbiddenException('You do not have permission to update this guest pass');
    }

    Object.assign(guestPass, updateGuestPassDto);
    return await this.guestPassesRepository.save(guestPass);
  }

  async remove(id: string, user: User): Promise<void> {
    const guestPass = await this.findOne(id, user);

    // Check if user can delete (must have case access)
    const hasAccess = await this.casesService.canAccessCase(guestPass.case_id, user);
    if (!hasAccess) {
      throw new ForbiddenException('You do not have permission to delete this guest pass');
    }

    await this.guestPassesRepository.remove(guestPass);
  }

  async validateToken(token: string): Promise<GuestPass> {
    const guestPass = await this.guestPassesRepository.findOne({
      where: { token },
      relations: ['case', 'created_by'],
    });

    if (!guestPass) {
      throw new NotFoundException('Guest pass not found');
    }

    if (!guestPass.is_active) {
      throw new BadRequestException('Guest pass is inactive');
    }

    if (new Date() > new Date(guestPass.expires_at)) {
      throw new BadRequestException('Guest pass has expired');
    }

    return guestPass;
  }
}
