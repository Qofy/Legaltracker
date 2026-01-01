import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { User } from '../users/user.entity';
import { Case } from '../cases/case.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Case)
    private casesRepository: Repository<Case>,
  ) {}

  // Check if user can access a comment (through case access)
  async canAccessComment(commentId: string, user: User): Promise<boolean> {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
      relations: ['case', 'case.owners', 'case.customers', 'case.shared_users'],
    });

    if (!comment) return false;

    if (user.user_type === 'admin') return true;

    const caseItem = comment.case;
    const isOwner = caseItem.owners?.some(owner => owner.id === user.id);
    const isCustomer = caseItem.customers?.some(customer => customer.id === user.id);
    const isShared = caseItem.shared_users?.some(sharedUser => sharedUser.id === user.id);

    return isOwner || isCustomer || isShared;
  }

  // Check if user can edit a comment
  async canEditComment(commentId: string, user: User): Promise<boolean> {
    if (user.user_type === 'admin') return true;

    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
      relations: ['author'],
    });

    if (!comment) return false;

    // Only the author can edit their comment
    return comment.author?.id === user.id;
  }

  async create(createCommentDto: any, user: User): Promise<Comment> {
    const { case_id, content } = createCommentDto;

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
      throw new ForbiddenException('You do not have permission to comment on this case');
    }

    const newComment = this.commentsRepository.create({
      content,
      case_id,
      author: user,
      author_id: user.id,
    }) as unknown as Comment;

    return await this.commentsRepository.save(newComment);
  }

  async findAll(user: User, filters?: any): Promise<Comment[]> {
    const queryBuilder = this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.case', 'case')
      .leftJoinAndSelect('case.owners', 'owner')
      .leftJoinAndSelect('case.customers', 'customer')
      .leftJoinAndSelect('case.shared_users', 'shared_user')
      .leftJoinAndSelect('comment.author', 'author');

    // Apply RLS based on case access
    if (user.user_type !== 'admin') {
      queryBuilder.where(
        '(owner.id = :userId OR customer.id = :userId OR shared_user.id = :userId)',
        { userId: user.id }
      );
    }

    // Apply filters
    if (filters?.case_id) {
      queryBuilder.andWhere('comment.case_id = :case_id', { case_id: filters.case_id });
    }
    if (filters?.author_id) {
      queryBuilder.andWhere('comment.author_id = :author_id', { author_id: filters.author_id });
    }

    queryBuilder.orderBy('comment.created_date', 'DESC');

    return await queryBuilder.getMany();
  }

  async findOne(id: string, user: User): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['case', 'case.owners', 'case.customers', 'case.shared_users', 'author'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const hasAccess = await this.canAccessComment(id, user);
    if (!hasAccess) {
      throw new ForbiddenException('You do not have permission to access this comment');
    }

    return comment;
  }

  async update(id: string, updateCommentDto: any, user: User): Promise<Comment> {
    const canEdit = await this.canEditComment(id, user);
    if (!canEdit) {
      throw new ForbiddenException('You do not have permission to edit this comment');
    }

    const comment = await this.findOne(id, user);
    const { content } = updateCommentDto;

    // Update comment content
    comment.content = content;

    return await this.commentsRepository.save(comment);
  }

  async remove(id: string, user: User): Promise<void> {
    const canEdit = await this.canEditComment(id, user);
    if (!canEdit) {
      throw new ForbiddenException('You do not have permission to delete this comment');
    }

    const comment = await this.findOne(id, user);
    await this.commentsRepository.remove(comment);
  }
}
