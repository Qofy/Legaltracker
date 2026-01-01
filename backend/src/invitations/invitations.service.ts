import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invitation } from './invitation.entity';
import { User } from '../users/user.entity';
import { CasesService } from '../cases/cases.service';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(Invitation)
    private invitationsRepository: Repository<Invitation>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private casesService: CasesService,
  ) {}

  async create(createInvitationDto: any, user: User): Promise<Invitation> {
    const { case_id, email, expires_at } = createInvitationDto;

    // Check if user has access to the case
    const hasAccess = await this.casesService.canAccessCase(case_id, user);
    if (!hasAccess) {
      throw new ForbiddenException('You do not have permission to invite users to this case');
    }

    const newInvitation = this.invitationsRepository.create({
      email,
      case_id,
      invited_by_id: user.id,
      expires_at: expires_at || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
      status: 'pending',
    });

    return await this.invitationsRepository.save(newInvitation);
  }

  async findAll(user: User, filters?: any): Promise<Invitation[]> {
    const queryBuilder = this.invitationsRepository
      .createQueryBuilder('invitation')
      .leftJoinAndSelect('invitation.case', 'case')
      .leftJoinAndSelect('case.owners', 'owner')
      .leftJoinAndSelect('case.customers', 'customer')
      .leftJoinAndSelect('case.shared_users', 'shared_user')
      .leftJoinAndSelect('invitation.invited_by', 'invited_by');

    // Apply RLS - user must have access to the case
    if (user.user_type !== 'admin') {
      queryBuilder.where(
        '(owner.id = :userId OR customer.id = :userId OR shared_user.id = :userId)',
        { userId: user.id }
      );
    }

    // Apply filters
    if (filters?.case_id) {
      queryBuilder.andWhere('invitation.case_id = :case_id', { case_id: filters.case_id });
    }
    if (filters?.status) {
      queryBuilder.andWhere('invitation.status = :status', { status: filters.status });
    }
    if (filters?.email) {
      queryBuilder.andWhere('invitation.email = :email', { email: filters.email });
    }

    queryBuilder.orderBy('invitation.created_date', 'DESC');

    return await queryBuilder.getMany();
  }

  async findOne(id: string, user: User): Promise<Invitation> {
    const invitation = await this.invitationsRepository.findOne({
      where: { id },
      relations: ['case', 'case.owners', 'case.customers', 'case.shared_users', 'invited_by'],
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    // Check if user has access to the case
    const hasAccess = await this.casesService.canAccessCase(invitation.case_id, user);
    if (!hasAccess) {
      throw new ForbiddenException('You do not have permission to access this invitation');
    }

    return invitation;
  }

  async update(id: string, updateInvitationDto: any, user: User): Promise<Invitation> {
    const invitation = await this.findOne(id, user);

    // Check if user can edit (must have case access)
    const hasAccess = await this.casesService.canAccessCase(invitation.case_id, user);
    if (!hasAccess) {
      throw new ForbiddenException('You do not have permission to update this invitation');
    }

    Object.assign(invitation, updateInvitationDto);
    return await this.invitationsRepository.save(invitation);
  }

  async remove(id: string, user: User): Promise<void> {
    const invitation = await this.findOne(id, user);

    // Check if user can delete (must have case access)
    const hasAccess = await this.casesService.canAccessCase(invitation.case_id, user);
    if (!hasAccess) {
      throw new ForbiddenException('You do not have permission to delete this invitation');
    }

    await this.invitationsRepository.remove(invitation);
  }
}
