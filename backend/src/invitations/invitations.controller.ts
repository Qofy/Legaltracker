import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('invitations')
@UseGuards(JwtAuthGuard)
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post()
  create(@Body() createInvitationDto: any, @Request() req) {
    return this.invitationsService.create(createInvitationDto, req.user);
  }

  @Get()
  findAll(@Request() req, @Query() filters: any) {
    return this.invitationsService.findAll(req.user, filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.invitationsService.findOne(id, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvitationDto: any, @Request() req) {
    return this.invitationsService.update(id, updateInvitationDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.invitationsService.remove(id, req.user);
  }
}
