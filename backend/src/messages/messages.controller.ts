import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, Query, Patch } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Message } from './message.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async sendMessage(
    @Body() messageData: {
      to_email?: string;
      to_role: string;
      subject: string;
      content: string;
      to_user_id?: string;
      message_type?: string;
      report_data?: string;
      file_attachment?: any;
    },
    @Request() req
  ): Promise<Message> {
    const { user } = req;
    
    const messagePayload = {
      from_email: user.email,
      to_email: messageData.to_email,
      from_role: user.user_type,
      to_role: messageData.to_role,
      subject: messageData.subject,
      content: messageData.content,
      to_user_id: messageData.to_user_id,
      message_type: messageData.message_type || 'message',
      report_data: messageData.report_data,
      file_attachment: messageData.file_attachment
    };
    
    console.log('[Messages] Storing message:', messagePayload);
    
    return this.messagesService.sendMessage(messagePayload, user);
  }

  @Get()
  async getMessages(
    @Request() req,
    @Query('to_role') toRole?: string,
    @Query('message_type') messageType?: string,
    @Query('from_user_id') fromUserId?: string,
    @Query('status') status?: string
  ): Promise<Message[]> {
    const { user } = req;
    
    // If admin is requesting reports
    if (user.user_type === 'admin' && toRole === 'admin' && (messageType === 'report' || messageType === 'case_report' || messageType === 'report,case_report')) {
      const filters: any = {};
      
      if (messageType && messageType !== 'report,case_report') {
        filters.message_type = messageType;
      }
      if (fromUserId) filters.from_user_id = fromUserId;
      if (status) filters.status = status;
      
      return this.messagesService.getReportsForAdmin(filters);
    }
    
    // Default: get user's messages
    return this.messagesService.getUserMessages(user.id);
  }

  @Patch(':id')
  async updateMessage(
    @Param('id') id: string,
    @Body() updateData: { status?: string },
    @Request() req
  ): Promise<Message> {
    if (updateData.status) {
      return this.messagesService.updateMessageStatus(id, updateData.status);
    }
    throw new Error('No valid update fields provided');
  }
}