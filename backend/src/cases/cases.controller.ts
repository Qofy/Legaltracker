import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { CasesService } from './cases.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cases')
@UseGuards(JwtAuthGuard)
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Post()
  create(@Body() createCaseDto: any, @Request() req) {
    return this.casesService.create(createCaseDto, req.user);
  }

  @Get()
  findAll(@Request() req, @Query() filters: any) {
    return this.casesService.findAll(req.user, filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.casesService.findOne(id, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCaseDto: any, @Request() req) {
    return this.casesService.update(id, updateCaseDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.casesService.remove(id, req.user);
  }

  @Post(':id/share')
  shareCase(@Param('id') id: string, @Body('userIds') userIds: string[], @Request() req) {
    return this.casesService.shareCase(id, userIds, req.user);
  }
}
