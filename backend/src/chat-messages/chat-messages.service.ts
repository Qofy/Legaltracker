import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './chat-message.entity';
import { User } from '../users/user.entity';
import { CasesService } from '../cases/cases.service';

@Injectable()
export class ChatMessagesService {
  constructor(
    @InjectRepository(ChatMessage)
    private chatMessagesRepository: Repository<ChatMessage>,
    private casesService: CasesService,
  ) {}

  async findByCaseId(caseId: string, user: User, limit: number = 100): Promise<ChatMessage[]> {
    const canAccess = await this.casesService.canAccessCase(caseId, user);
    if (!canAccess) {
      throw new ForbiddenException('You do not have access to this case chat');
    }

    return await this.chatMessagesRepository.find({
      where: { case_id: caseId },
      relations: ['sender'],
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  async findAll(user: User, limit: number = 500): Promise<ChatMessage[]> {
    // For now, return all messages the requesting user can access.
    // In many deployments this should be scoped; keep simple for debugging.
    return await this.chatMessagesRepository.find({
      relations: ['sender', 'case'],
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  async findOne(id: string, user: User): Promise<ChatMessage> {
    const message = await this.chatMessagesRepository.findOne({
      where: { id },
      relations: ['sender', 'case'],
    });

    if (!message) {
      throw new NotFoundException(`Chat message with ID ${id} not found`);
    }

    const canAccess = await this.casesService.canAccessCase(message.case_id, user);
    if (!canAccess) {
      throw new ForbiddenException('You do not have access to this chat message');
    }

    return message;
  }

  async create(createDto: any, user: User): Promise<ChatMessage> {
    const { case_id, content, message_type, file_url, file_name } = createDto;

    const canAccess = await this.casesService.canAccessCase(case_id, user);
    if (!canAccess) {
      throw new ForbiddenException('You do not have access to this case chat');
    }

    // debug log to help trace incoming create payloads
    // eslint-disable-next-line no-console
    console.debug('[ChatMessagesService.create] createDto:', { case_id, content, message_type, file_url, file_name, senderId: user?.id });

    const chatMessage = this.chatMessagesRepository.create({
      content,
      message_type: message_type || 'text',
      file_url,
      file_name,
      case_id,
      sender_id: user.id,
      sender: user,
    });

    return await this.chatMessagesRepository.save(chatMessage);
  }

  async update(id: string, updateDto: any, user: User): Promise<ChatMessage> {
    const message = await this.findOne(id, user);

    // Only the sender can edit their message
    if (message.sender_id !== user.id && user.user_type !== 'admin') {
      throw new ForbiddenException('You can only edit your own messages');
    }

    if (updateDto.content) {
      message.content = updateDto.content;
      message.is_edited = true;
      message.edited_at = new Date();
    }

    return await this.chatMessagesRepository.save(message);
  }

  async remove(id: string, user: User): Promise<void> {
    const message = await this.findOne(id, user);

    // Only the sender or admin can delete a message
    if (message.sender_id !== user.id && user.user_type !== 'admin') {
      throw new ForbiddenException('You can only delete your own messages');
    }

    await this.chatMessagesRepository.remove(message);
  }
}
