import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActionItem } from './action-item.entity';
import { User } from '../users/user.entity';
import { Case } from '../cases/case.entity';

@Injectable()
export class ActionItemsService {
  constructor(
    @InjectRepository(ActionItem)
    private actionItemsRepository: Repository<ActionItem>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Case)
    private casesRepository: Repository<Case>,
  ) {}

  // Check if user can access an action item (through case access)
  async canAccessActionItem(actionItemId: string, user: User): Promise<boolean> {
    const actionItem = await this.actionItemsRepository.findOne({
      where: { id: actionItemId },
      relations: ['case', 'case.owners', 'case.customers', 'case.shared_users'],
    });

    if (!actionItem) return false;

    if (user.user_type === 'admin') return true;

    const caseItem = actionItem.case;
    const isOwner = caseItem.owners?.some(owner => owner.id === user.id);
    const isCustomer = caseItem.customers?.some(customer => customer.id === user.id);
    const isShared = caseItem.shared_users?.some(sharedUser => sharedUser.id === user.id);

    return isOwner || isCustomer || isShared;
  }

  // Check if user can edit an action item
  async canEditActionItem(actionItemId: string, user: User): Promise<boolean> {
    if (user.user_type === 'admin') return true;

    const actionItem = await this.actionItemsRepository.findOne({
      where: { id: actionItemId },
      relations: ['case', 'case.owners', 'created_by'],
    });

    if (!actionItem) return false;

    // Action item can be edited by case owners or the creator
    const isOwner = actionItem.case.owners?.some(owner => owner.id === user.id);
    const isCreator = actionItem.created_by?.id === user.id;

    return isOwner || isCreator;
  }

  async create(createActionItemDto: any, user: User): Promise<ActionItem> {
    const { case_id, assigned_to_id, ...actionItemData } = createActionItemDto;

    // Verify user has access to the case
    const caseItem = await this.casesRepository.findOne({
      where: { id: case_id },
      relations: ['owners', 'customers', 'shared_users'],
    });

    if (!caseItem) {
      throw new NotFoundException('Case not found');
    }

    const isOwner = caseItem.owners?.some(owner => owner.id === user.id);
    const isCustomer = caseItem.customers?.some(customer => customer.id === user.id);
    const isShared = caseItem.shared_users?.some(sharedUser => sharedUser.id === user.id);

    if (!isOwner && !isCustomer && !isShared && user.user_type !== 'admin') {
      throw new ForbiddenException('You do not have permission to create action items for this case');
    }

    const newActionItem = this.actionItemsRepository.create({
      ...actionItemData,
      case_id,
      created_by: user,
      created_by_id: user.id,
    }) as unknown as ActionItem;

    // Assign to user if specified
    if (assigned_to_id) {
      const assignedUser = await this.usersRepository.findOne({ where: { id: assigned_to_id } });
      if (assignedUser) {
        newActionItem.assigned_to = assignedUser;
        newActionItem.assigned_to_id = assigned_to_id;
      }
    }

    return await this.actionItemsRepository.save(newActionItem);
  }

  async findAll(user: User, filters?: any): Promise<ActionItem[]> {
    const queryBuilder = this.actionItemsRepository
      .createQueryBuilder('action_item')
      .leftJoinAndSelect('action_item.case', 'case')
      .leftJoinAndSelect('case.owners', 'owner')
      .leftJoinAndSelect('case.customers', 'customer')
      .leftJoinAndSelect('case.shared_users', 'shared_user')
      .leftJoinAndSelect('action_item.assigned_to', 'assigned_to')
      .leftJoinAndSelect('action_item.created_by', 'created_by');

    // Apply RLS based on case access
    if (user.user_type !== 'admin') {
      queryBuilder.where(
        '(owner.id = :userId OR customer.id = :userId OR shared_user.id = :userId)',
        { userId: user.id }
      );
    }

    // Apply filters
    if (filters?.case_id) {
      queryBuilder.andWhere('action_item.case_id = :case_id', { case_id: filters.case_id });
    }
    if (filters?.status) {
      queryBuilder.andWhere('action_item.status = :status', { status: filters.status });
    }
    if (filters?.assigned_to_id) {
      queryBuilder.andWhere('action_item.assigned_to_id = :assigned_to_id', { assigned_to_id: filters.assigned_to_id });
    }
    if (filters?.created_by_id) {
      queryBuilder.andWhere('action_item.created_by_id = :created_by_id', { created_by_id: filters.created_by_id });
    }

    queryBuilder.orderBy('action_item.due_date', 'ASC');

    return await queryBuilder.getMany();
  }

  async findOne(id: string, user: User): Promise<ActionItem> {
    const actionItem = await this.actionItemsRepository.findOne({
      where: { id },
      relations: ['case', 'case.owners', 'case.customers', 'case.shared_users', 'assigned_to', 'created_by'],
    });

    if (!actionItem) {
      throw new NotFoundException('Action item not found');
    }

    const hasAccess = await this.canAccessActionItem(id, user);
    if (!hasAccess) {
      throw new ForbiddenException('You do not have permission to access this action item');
    }

    return actionItem;
  }

  async update(id: string, updateActionItemDto: any, user: User): Promise<ActionItem> {
    const canEdit = await this.canEditActionItem(id, user);
    if (!canEdit) {
      throw new ForbiddenException('You do not have permission to edit this action item');
    }

    const actionItem = await this.findOne(id, user);
    const { assigned_to_id, ...actionItemData } = updateActionItemDto;

    // Update action item data
    Object.assign(actionItem, actionItemData);

    // Update assigned to if specified
    if (assigned_to_id !== undefined) {
      if (assigned_to_id) {
        const assignedUser = await this.usersRepository.findOne({ where: { id: assigned_to_id } });
        if (assignedUser) {
          actionItem.assigned_to = assignedUser;
          actionItem.assigned_to_id = assigned_to_id;
        }
      } else {
        actionItem.assigned_to = null;
        actionItem.assigned_to_id = null;
      }
    }

    return await this.actionItemsRepository.save(actionItem);
  }

  async remove(id: string, user: User): Promise<void> {
    const canEdit = await this.canEditActionItem(id, user);
    if (!canEdit) {
      throw new ForbiddenException('You do not have permission to delete this action item');
    }

    const actionItem = await this.findOne(id, user);
    await this.actionItemsRepository.remove(actionItem);
  }
}
