import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: any, @Request() req) {
    return this.commentsService.create(createCommentDto, req.user);
  }

  @Get()
  findAll(@Request() req, @Query() filters: any) {
    return this.commentsService.findAll(req.user, filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.commentsService.findOne(id, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: any, @Request() req) {
    return this.commentsService.update(id, updateCommentDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.commentsService.remove(id, req.user);
  }
}
