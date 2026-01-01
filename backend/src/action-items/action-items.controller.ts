import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ActionItemsService } from './action-items.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('action-items')
@UseGuards(JwtAuthGuard)
export class ActionItemsController {
  constructor(private readonly actionItemsService: ActionItemsService) {}

  @Post()
  create(@Body() createActionItemDto: any, @Request() req) {
    return this.actionItemsService.create(createActionItemDto, req.user);
  }

  @Get()
  findAll(@Request() req, @Query() filters: any) {
    return this.actionItemsService.findAll(req.user, filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.actionItemsService.findOne(id, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActionItemDto: any, @Request() req) {
    return this.actionItemsService.update(id, updateActionItemDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.actionItemsService.remove(id, req.user);
  }
}
