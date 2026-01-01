import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Annotation } from './annotation.entity';
import { User } from '../users/user.entity';
import { Document } from '../documents/document.entity';

@Injectable()
export class AnnotationsService {
  constructor(
    @InjectRepository(Annotation)
    private annotationsRepository: Repository<Annotation>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
  ) {}

  // Check if user can access an annotation (through document/case access)
  async canAccessAnnotation(annotationId: string, user: User): Promise<boolean> {
    const annotation = await this.annotationsRepository.findOne({
      where: { id: annotationId },
      relations: ['document', 'document.case', 'document.case.owners', 'document.case.customers', 'document.case.shared_users', 'document.visible_to_users'],
    });

    if (!annotation) return false;

    if (user.role === 'admin') return true;

    // Check document access first
    const document = annotation.document;
    const caseItem = document.case;
    const isOwner = caseItem.owners?.some(owner => owner.id === user.id);
    const isCustomer = caseItem.customers?.some(customer => customer.id === user.id);
    const isShared = caseItem.shared_users?.some(sharedUser => sharedUser.id === user.id);
    const hasCaseAccess = isOwner || isCustomer || isShared;

    if (!hasCaseAccess) return false;

    // Check document-level visibility
    if (document.visibility_type === 'public') return true;
    if (document.visibility_type === 'case_members') return hasCaseAccess;
    if (document.visibility_type === 'lawyers_only') return user.role === 'admin' || user.role === 'lawyer';
    if (document.visibility_type === 'specific_users') {
      return document.visible_to_users?.some(u => u.id === user.id);
    }

    return false;
  }

  // Check if user can edit an annotation
  async canEditAnnotation(annotationId: string, user: User): Promise<boolean> {
    if (user.role === 'admin') return true;

    const annotation = await this.annotationsRepository.findOne({
      where: { id: annotationId },
      relations: ['author'],
    });

    if (!annotation) return false;

    // Only the author can edit their annotation
    return annotation.author?.id === user.id;
  }

  async create(createAnnotationDto: any, user: User): Promise<Annotation> {
    const { document_id, content, page_number, position_x, position_y } = createAnnotationDto;

    // Verify user has access to the document
    const document = await this.documentsRepository.findOne({
      where: { id: document_id },
      relations: ['case', 'case.owners', 'case.customers', 'case.shared_users', 'visible_to_users'],
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const caseItem = document.case;
    const isOwner = caseItem.owners?.some(owner => owner.id === user.id);
    const isCustomer = caseItem.customers?.some(customer => customer.id === user.id);
    const isShared = caseItem.shared_users?.some(sharedUser => sharedUser.id === user.id);
    const hasCaseAccess = isOwner || isCustomer || isShared;

    if (!hasCaseAccess && user.role !== 'admin') {
      throw new ForbiddenException('You do not have permission to annotate this document');
    }

    // Check document visibility
    let hasDocumentAccess = false;
    if (document.visibility_type === 'public') hasDocumentAccess = true;
    else if (document.visibility_type === 'case_members') hasDocumentAccess = hasCaseAccess;
    else if (document.visibility_type === 'lawyers_only') hasDocumentAccess = user.role === 'admin' || user.role === 'lawyer';
    else if (document.visibility_type === 'specific_users') {
      hasDocumentAccess = document.visible_to_users?.some(u => u.id === user.id);
    }

    if (!hasDocumentAccess && user.role !== 'admin') {
      throw new ForbiddenException('You do not have permission to annotate this document');
    }

    const newAnnotation = this.annotationsRepository.create({
      content,
      document_id,
      page_number,
      position_x,
      position_y,
      author: user,
      author_id: user.id,
    });

    return await this.annotationsRepository.save(newAnnotation);
  }

  async findAll(user: User, filters?: any): Promise<Annotation[]> {
    const queryBuilder = this.annotationsRepository
      .createQueryBuilder('annotation')
      .leftJoinAndSelect('annotation.document', 'document')
      .leftJoinAndSelect('document.case', 'case')
      .leftJoinAndSelect('case.owners', 'owner')
      .leftJoinAndSelect('case.customers', 'customer')
      .leftJoinAndSelect('case.shared_users', 'shared_user')
      .leftJoinAndSelect('annotation.author', 'author')
      .leftJoinAndSelect('document.visible_to_users', 'visible_to_user');

    // Apply RLS based on case access
    if (user.role !== 'admin') {
      queryBuilder.where(
        '(owner.id = :userId OR customer.id = :userId OR shared_user.id = :userId)',
        { userId: user.id }
      );

      // Additional visibility filtering for non-admins
      queryBuilder.andWhere(
        '(document.visibility_type = :public OR document.visibility_type = :case_members OR (document.visibility_type = :specific AND visible_to_user.id = :userId) OR (document.visibility_type = :lawyers AND :userRole IN (:...lawyerRoles)))',
        {
          public: 'public',
          case_members: 'case_members',
          specific: 'specific_users',
          lawyers: 'lawyers_only',
          userId: user.id,
          userRole: user.role,
          lawyerRoles: ['admin', 'lawyer'],
        }
      );
    }

    // Apply filters
    if (filters?.document_id) {
      queryBuilder.andWhere('annotation.document_id = :document_id', { document_id: filters.document_id });
    }
    if (filters?.author_id) {
      queryBuilder.andWhere('annotation.author_id = :author_id', { author_id: filters.author_id });
    }
    if (filters?.page_number) {
      queryBuilder.andWhere('annotation.page_number = :page_number', { page_number: filters.page_number });
    }

    queryBuilder.orderBy('annotation.created_date', 'DESC');

    return await queryBuilder.getMany();
  }

  async findOne(id: string, user: User): Promise<Annotation> {
    const annotation = await this.annotationsRepository.findOne({
      where: { id },
      relations: ['document', 'document.case', 'document.case.owners', 'document.case.customers', 'document.case.shared_users', 'document.visible_to_users', 'author'],
    });

    if (!annotation) {
      throw new NotFoundException('Annotation not found');
    }

    const hasAccess = await this.canAccessAnnotation(id, user);
    if (!hasAccess) {
      throw new ForbiddenException('You do not have permission to access this annotation');
    }

    return annotation;
  }

  async update(id: string, updateAnnotationDto: any, user: User): Promise<Annotation> {
    const canEdit = await this.canEditAnnotation(id, user);
    if (!canEdit) {
      throw new ForbiddenException('You do not have permission to edit this annotation');
    }

    const annotation = await this.findOne(id, user);
    const { content, page_number, position_x, position_y } = updateAnnotationDto;

    // Update annotation data
    if (content !== undefined) annotation.content = content;
    if (page_number !== undefined) annotation.page_number = page_number;
    if (position_x !== undefined) annotation.position_x = position_x;
    if (position_y !== undefined) annotation.position_y = position_y;

    return await this.annotationsRepository.save(annotation);
  }

  async remove(id: string, user: User): Promise<void> {
    const canEdit = await this.canEditAnnotation(id, user);
    if (!canEdit) {
      throw new ForbiddenException('You do not have permission to delete this annotation');
    }

    const annotation = await this.findOne(id, user);
    await this.annotationsRepository.remove(annotation);
  }
}
