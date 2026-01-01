import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ChatMessagesService } from './chat-messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('chat-messages')
@UseGuards(JwtAuthGuard)
export class ChatMessagesController {
  constructor(private readonly chatMessagesService: ChatMessagesService) {}

  @Get('case/:caseId')
  async findByCaseId(
    @Param('caseId') caseId: string,
    @Query('limit') limit: number = 100,
    @Request() req
  ) {
    return await this.chatMessagesService.findByCaseId(caseId, req.user, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return await this.chatMessagesService.findOne(id, req.user);
  }

  @Post()
  async create(@Body() createDto: any, @Request() req) {
    return await this.chatMessagesService.create(createDto, req.user);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any, @Request() req) {
    return await this.chatMessagesService.update(id, updateDto, req.user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    await this.chatMessagesService.remove(id, req.user);
    return { message: 'Chat message deleted successfully' };
  }
}
