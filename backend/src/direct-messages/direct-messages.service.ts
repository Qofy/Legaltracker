import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DirectMessage } from './direct-message.entity';
import { User } from '../users/user.entity';

@Injectable()
export class DirectMessagesService {
  constructor(
    @InjectRepository(DirectMessage)
    private directMessagesRepository: Repository<DirectMessage>,
  ) {}

  async create(data: any, user: User): Promise<DirectMessage> {
    const message = this.directMessagesRepository.create({
      content: data.content,
      message_type: data.message_type || 'text',
      sender_id: user.id,
      recipient_id: data.recipient_id,
    });

    return await this.directMessagesRepository.save(message);
  }

  async findConversation(userId: string, otherUserId: string): Promise<DirectMessage[]> {
    return await this.directMessagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.recipient', 'recipient')
      .where(
        '(message.sender_id = :userId AND message.recipient_id = :otherUserId) OR (message.sender_id = :otherUserId AND message.recipient_id = :userId)',
        { userId, otherUserId }
      )
      .orderBy('message.created_at', 'ASC')
      .getMany();
  }

  async findAllConversations(userId: string): Promise<DirectMessage[]> {
    return await this.directMessagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.recipient', 'recipient')
      .where('message.sender_id = :userId OR message.recipient_id = :userId', { userId })
      .orderBy('message.created_at', 'DESC')
      .getMany();
  }

  async markAsRead(messageId: string, user: User): Promise<DirectMessage> {
    const message = await this.directMessagesRepository.findOne({
      where: { id: messageId },
    });

    if (!message) {
      throw new Error('Message not found');
    }

    // Only the recipient can mark as read
    if (message.recipient_id !== user.id) {
      throw new Error('Unauthorized');
    }

    message.is_read = true;
    return await this.directMessagesRepository.save(message);
  }
}
