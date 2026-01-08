import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { User } from '../users/user.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async sendMessage(messageData: {
    from_email?: string;
    to_email?: string;
    from_role: string;
    to_role: string;
    subject: string;
    content: string;
    from_user_id?: string;
    to_user_id?: string;
    message_type?: string;
    report_data?: string;
    file_attachment?: any;
  }, currentUser?: User): Promise<Message> {
    const message = this.messagesRepository.create({
      ...messageData,
      from_user_id: messageData.from_user_id || currentUser?.id,
      file_attachment: messageData.file_attachment ? JSON.stringify(messageData.file_attachment) : null,
      status: 'new'
    });
    
    return this.messagesRepository.save(message);
  }

  async getUserMessages(userId: string): Promise<Message[]> {
    return this.messagesRepository.find({
      where: [
        { from_user_id: userId },
        { to_user_id: userId }
      ],
      relations: ['from_user', 'to_user'],
      order: { created_date: 'DESC' }
    });
  }

  async getReportsForAdmin(filters: {
    message_type?: string;
    from_user_id?: string;
    status?: string;
  } = {}): Promise<Message[]> {
    const queryBuilder = this.messagesRepository.createQueryBuilder('message')
      .leftJoinAndSelect('message.from_user', 'from_user')
      .where('message.to_role = :toRole', { toRole: 'admin' })
      .andWhere('message.message_type IN (:...types)', { types: ['report', 'case_report'] });

    if (filters.message_type) {
      queryBuilder.andWhere('message.message_type = :messageType', { messageType: filters.message_type });
    }

    if (filters.from_user_id) {
      queryBuilder.andWhere('message.from_user_id = :fromUserId', { fromUserId: filters.from_user_id });
    }

    if (filters.status) {
      queryBuilder.andWhere('message.status = :status', { status: filters.status });
    }

    return queryBuilder
      .orderBy('message.created_date', 'DESC')
      .getMany();
  }

  async updateMessageStatus(messageId: string, status: string): Promise<Message> {
    const message = await this.messagesRepository.findOne({ where: { id: messageId } });
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    
    message.status = status;
    return this.messagesRepository.save(message);
  }
}