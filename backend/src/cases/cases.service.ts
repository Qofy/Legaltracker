import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Case } from './case.entity';
import { User } from '../users/user.entity';

@Injectable()
export class CasesService {
  constructor(
    @InjectRepository(Case)
    private casesRepository: Repository<Case>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Helper method to build RLS WHERE clause
  private buildRlsWhere(userId: string, userType: string) {
    if (userType === 'admin' || userType === 'lawyer') {
      // Lawyers and admins can see all cases they own or are shared with
      return [
        { owners: { id: userId } },
        { shared_users: { id: userId } },
      ];
    } else if (userType === 'customer') {
      // Customers can only see cases where they are customers
      return [
        { customers: { id: userId } },
      ];
    }
    return [];
  }

  // Check if user can access a case
  async canAccessCase(caseId: string, user: User): Promise<boolean> {
    const caseItem = await this.casesRepository.findOne({
      where: { id: caseId },
      relations: ['owners', 'customers', 'shared_users'],
    });

    if (!caseItem) return false;

    if (user.user_type === 'admin') return true;

    const isOwner = caseItem.owners?.some(owner => owner.id === user.id);
    const isCustomer = caseItem.customers?.some(customer => customer.id === user.id);
    const isShared = caseItem.shared_users?.some(sharedUser => sharedUser.id === user.id);

    return isOwner || isCustomer || isShared;
  }

  // Check if user can edit a case
  async canEditCase(caseId: string, user: User): Promise<boolean> {
    if (user.user_type === 'admin') return true;

    const caseItem = await this.casesRepository.findOne({
      where: { id: caseId },
      relations: ['owners'],
    });

    if (!caseItem) return false;

    return caseItem.owners?.some(owner => owner.id === user.id);
  }

  async create(createCaseDto: any, user: User): Promise<Case> {
    const { customer_ids, owner_ids, shared_with_users, ...caseData } = createCaseDto;

    const newCase = this.casesRepository.create(caseData);

    // Set owners
    if (owner_ids && owner_ids.length > 0) {
      newCase.owners = await this.usersRepository.findByIds(owner_ids);
    } else {
      newCase.owners = [user]; // Default to current user as owner
    }

    // Set customers
    if (customer_ids && customer_ids.length > 0) {
      newCase.customers = await this.usersRepository.findByIds(customer_ids);
    }

    // Set shared users
    if (shared_with_users && shared_with_users.length > 0) {
      newCase.shared_users = await this.usersRepository.findByIds(shared_with_users);
    }

    return await this.casesRepository.save(newCase);
  }

  async findAll(user: User, filters?: any): Promise<Case[]> {
    const queryBuilder = this.casesRepository
      .createQueryBuilder('case')
      .leftJoinAndSelect('case.owners', 'owner')
      .leftJoinAndSelect('case.customers', 'customer')
      .leftJoinAndSelect('case.shared_users', 'shared_user');

    // Apply RLS
    if (user.user_type === 'admin' || user.user_type === 'lawyer') {
      queryBuilder.where('owner.id = :userId OR shared_user.id = :userId', { userId: user.id });
    } else if (user.user_type === 'customer') {
      queryBuilder.where('customer.id = :userId', { userId: user.id });
    }

    // Apply filters
    if (filters?.status) {
      queryBuilder.andWhere('case.status = :status', { status: filters.status });
    }
    if (filters?.priority) {
      queryBuilder.andWhere('case.priority = :priority', { priority: filters.priority });
    }
    if (filters?.case_type) {
      queryBuilder.andWhere('case.case_type = :case_type', { case_type: filters.case_type });
    }
    if (filters?.search) {
      queryBuilder.andWhere(
        '(case.title LIKE :search OR case.case_number LIKE :search OR case.description LIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    queryBuilder.orderBy('case.updated_date', 'DESC');

    return await queryBuilder.getMany();
  }

  async findOne(id: string, user: User): Promise<Case> {
    const caseItem = await this.casesRepository.findOne({
      where: { id },
      relations: ['owners', 'customers', 'shared_users'],
    });

    if (!caseItem) {
      throw new NotFoundException('Case not found');
    }

    const hasAccess = await this.canAccessCase(id, user);
    if (!hasAccess) {
      throw new ForbiddenException('You do not have permission to access this case');
    }

    return caseItem;
  }

  async update(id: string, updateCaseDto: any, user: User): Promise<Case> {
    const canEdit = await this.canEditCase(id, user);
    if (!canEdit) {
      throw new ForbiddenException('You do not have permission to edit this case');
    }

    const caseItem = await this.findOne(id, user);
    const { customer_ids, owner_ids, shared_with_users, ...caseData } = updateCaseDto;

    // Update case data
    Object.assign(caseItem, caseData);

    // Update relations if provided
    if (customer_ids !== undefined) {
      caseItem.customers = await this.usersRepository.findByIds(customer_ids);
    }
    if (owner_ids !== undefined) {
      caseItem.owners = await this.usersRepository.findByIds(owner_ids);
    }
    if (shared_with_users !== undefined) {
      caseItem.shared_users = await this.usersRepository.findByIds(shared_with_users);
    }

    return await this.casesRepository.save(caseItem);
  }

  async remove(id: string, user: User): Promise<void> {
    const canEdit = await this.canEditCase(id, user);
    if (!canEdit) {
      throw new ForbiddenException('You do not have permission to delete this case');
    }

    const caseItem = await this.findOne(id, user);
    await this.casesRepository.remove(caseItem);
  }

  async shareCase(id: string, userIds: string[], user: User): Promise<Case> {
    const canEdit = await this.canEditCase(id, user);
    if (!canEdit) {
      throw new ForbiddenException('You do not have permission to share this case');
    }

    const caseItem = await this.findOne(id, user);
    const usersToShare = await this.usersRepository.findByIds(userIds);

    caseItem.shared_users = [
      ...(caseItem.shared_users || []),
      ...usersToShare.filter(u => !caseItem.shared_users?.some(su => su.id === u.id))
    ];

    return await this.casesRepository.save(caseItem);
  }
}
