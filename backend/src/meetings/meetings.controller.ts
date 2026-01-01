import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('meetings')
@UseGuards(JwtAuthGuard)
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Get()
  async findAll(@Request() req, @Query('case_id') caseId?: string) {
    return await this.meetingsService.findAll(req.user, caseId);
  }

  @Get('upcoming')
  async findUpcoming(@Request() req, @Query('case_id') caseId?: string) {
    return await this.meetingsService.findUpcoming(req.user, caseId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return await this.meetingsService.findOne(id, req.user);
  }

  @Post()
  async create(@Body() createDto: any, @Request() req) {
    return await this.meetingsService.create(createDto, req.user);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any, @Request() req) {
    return await this.meetingsService.update(id, updateDto, req.user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    await this.meetingsService.remove(id, req.user);
    return { message: 'Meeting deleted successfully' };
  }
}
