import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { AnnotationsService } from './annotations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('annotations')
@UseGuards(JwtAuthGuard)
export class AnnotationsController {
  constructor(private readonly annotationsService: AnnotationsService) {}

  @Post()
  create(@Body() createAnnotationDto: any, @Request() req) {
    return this.annotationsService.create(createAnnotationDto, req.user);
  }

  @Get()
  findAll(@Request() req, @Query() filters: any) {
    return this.annotationsService.findAll(req.user, filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.annotationsService.findOne(id, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAnnotationDto: any, @Request() req) {
    return this.annotationsService.update(id, updateAnnotationDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.annotationsService.remove(id, req.user);
  }
}
