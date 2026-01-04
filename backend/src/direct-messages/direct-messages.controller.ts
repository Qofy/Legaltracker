import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { DirectMessagesService } from './direct-messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('direct-messages')
@UseGuards(JwtAuthGuard)
export class DirectMessagesController {
  constructor(private readonly directMessagesService: DirectMessagesService) {}

  @Post()
  async create(@Body() createDto: any, @Request() req) {
    return await this.directMessagesService.create(createDto, req.user);
  }

  @Get('conversation/:otherUserId')
  async findConversation(
    @Param('otherUserId') otherUserId: string,
    @Request() req
  ) {
    return await this.directMessagesService.findConversation(req.user.id, otherUserId);
  }

  @Get()
  async findAllConversations(@Request() req) {
    return await this.directMessagesService.findAllConversations(req.user.id);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req) {
    return await this.directMessagesService.markAsRead(id, req.user);
  }
}
