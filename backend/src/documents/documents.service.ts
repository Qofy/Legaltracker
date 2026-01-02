import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Document } from './document.entity';
import { User } from '../users/user.entity';
import { Case } from '../cases/case.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Case)
    private casesRepository: Repository<Case>,
  ) {}

  // Check if user can access a document (through case access)
  async canAccessDocument(documentId: string, user: User): Promise<boolean> {
    const document = await this.documentsRepository.findOne({
      where: { id: documentId },
      relations: ['case', 'case.owners', 'case.customers', 'case.shared_users', 'visible_to_users'],
    });

    if (!document) return false;

    if (user.user_type === 'admin') return true;

    // Check case access
    const caseItem = document.case;
    const isOwner = caseItem.owners?.some(owner => owner.id === user.id);
    const isCustomer = caseItem.customers?.some(customer => customer.id === user.id);
    const isShared = caseItem.shared_users?.some(sharedUser => sharedUser.id === user.id);
    const hasCaseAccess = isOwner || isCustomer || isShared;

    if (!hasCaseAccess) return false;

    // Check document-level visibility
    if (document.visibility_type === 'public') return true;
    if (document.visibility_type === 'case_members') return hasCaseAccess;
    if (document.visibility_type === 'lawyers_only') return user.user_type === 'admin' || user.user_type === 'lawyer';
    if (document.visibility_type === 'specific_users') {
      return document.visible_to_users?.some(u => u.id === user.id);
    }

    return false;
  }

  // Check if user can edit a document
  async canEditDocument(documentId: string, user: User): Promise<boolean> {
    if (user.user_type === 'admin') return true;

    const document = await this.documentsRepository.findOne({
      where: { id: documentId },
      relations: ['case', 'case.owners', 'uploaded_by'],
    });

    if (!document) return false;

    // Document can be edited by case owners or the uploader
    const isOwner = document.case.owners?.some(owner => owner.id === user.id);
    const isUploader = document.uploaded_by?.id === user.id;

    return isOwner || isUploader;
  }

  async create(createDocumentDto: any, user: User): Promise<Document> {
    const { case_id, visible_to_user_ids, ...documentData } = createDocumentDto;

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
      throw new ForbiddenException('You do not have permission to add documents to this case');
    }

    const newDocument = this.documentsRepository.create({
      ...documentData,
      case_id,
      uploaded_by: user,
    }) as unknown as Document;

    // Set visible to users if specified
    if (visible_to_user_ids && visible_to_user_ids.length > 0) {
      const users = await this.usersRepository.findBy({ id: In(visible_to_user_ids) });
      newDocument.visible_to_users = users;
    }

    return await this.documentsRepository.save(newDocument);
  }

  async findAll(user: User, filters?: any): Promise<Document[]> {
    console.log('DocumentsService.findAll called for user:', user.id, user.user_type);
    
    // For debugging - let's temporarily return all documents for non-admin users
    // and filter properly in the frontend
    if (user.user_type !== 'admin') {
      console.log('Temporary: returning all documents for debugging');
      const allDocs = await this.documentsRepository.find({
        relations: ['case', 'uploaded_by'],
        order: { created_date: 'DESC' }
      });
      console.log(`Found ${allDocs.length} total documents in database`);
      return allDocs;
    }

    const queryBuilder = this.documentsRepository
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.case', 'case')
      .leftJoinAndSelect('case.owners', 'owner')
      .leftJoinAndSelect('case.customers', 'customer')
      .leftJoinAndSelect('case.shared_users', 'shared_user')
      .leftJoinAndSelect('document.uploaded_by', 'uploaded_by')
      .leftJoinAndSelect('document.visible_to_users', 'visible_to_user');

    // Apply filters
    if (filters?.case_id) {
      queryBuilder.andWhere('document.case_id = :case_id', { case_id: filters.case_id });
    }
    if (filters?.document_type) {
      queryBuilder.andWhere('document.document_type = :document_type', { document_type: filters.document_type });
    }
    if (filters?.is_confidential !== undefined) {
      queryBuilder.andWhere('document.is_confidential = :is_confidential', { is_confidential: filters.is_confidential });
    }
    if (filters?.search) {
      queryBuilder.andWhere(
        '(document.file_name LIKE :search OR document.description LIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    queryBuilder.orderBy('document.created_date', 'DESC');

    console.log('Generated SQL query:', queryBuilder.getSql());
    console.log('Query parameters:', queryBuilder.getParameters());
    
    const results = await queryBuilder.getMany();
    console.log(`Found ${results.length} documents for admin user ${user.id}`);
    
    return results;
  }

  async findOne(id: string, user: User): Promise<Document> {
    const document = await this.documentsRepository.findOne({
      where: { id },
      relations: ['case', 'case.owners', 'case.customers', 'case.shared_users', 'uploaded_by', 'visible_to_users'],
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const hasAccess = await this.canAccessDocument(id, user);
    if (!hasAccess) {
      throw new ForbiddenException('You do not have permission to access this document');
    }

    return document;
  }

  async update(id: string, updateDocumentDto: any, user: User): Promise<Document> {
    const canEdit = await this.canEditDocument(id, user);
    if (!canEdit) {
      throw new ForbiddenException('You do not have permission to edit this document');
    }

    const document = await this.findOne(id, user);
    const { visible_to_user_ids, ...documentData } = updateDocumentDto;

    // Update document data
    Object.assign(document, documentData);

    // Update visible to users if provided
    if (visible_to_user_ids !== undefined) {
      const users = await this.usersRepository.findBy({ id: In(visible_to_user_ids) });
      document.visible_to_users = users;
    }

    return await this.documentsRepository.save(document);
  }

  async remove(id: string, user: User): Promise<void> {
    const canEdit = await this.canEditDocument(id, user);
    if (!canEdit) {
      throw new ForbiddenException('You do not have permission to delete this document');
    }

    const document = await this.findOne(id, user);
    await this.documentsRepository.remove(document);
  }
}
