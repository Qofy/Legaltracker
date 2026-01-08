import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { GuestPassesService } from './guest-passes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('guest-passes')
export class GuestPassesController {
  constructor(private readonly guestPassesService: GuestPassesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createGuestPassDto: any, @Request() req) {
    return this.guestPassesService.create(createGuestPassDto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req, @Query() filters: any) {
    return this.guestPassesService.findAll(req.user, filters);
  }

  @Get('validate/:token')
  async validateToken(@Param('token') token: string) {
    try {
      const guestPass = await this.guestPassesService.validateToken(token);
      return {
        valid: true,
        guestPass: guestPass,
        message: 'Valid guest pass'
      };
    } catch (error) {
      return {
        valid: false,
        message: error.message || 'Invalid guest pass'
      };
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Request() req) {
    return this.guestPassesService.findOne(id, req.user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateGuestPassDto: any, @Request() req) {
    return this.guestPassesService.update(id, updateGuestPassDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.guestPassesService.remove(id, req.user);
  }
}
