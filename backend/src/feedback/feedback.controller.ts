import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('feedback')
@UseGuards(JwtAuthGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  // Bug Reports
  @Post('bug-reports')
  createBugReport(@Body() createBugReportDto: any, @Request() req) {
    return this.feedbackService.createBugReport(createBugReportDto, req.user);
  }

  @Get('bug-reports')
  findAllBugReports(@Request() req, @Query() filters: any) {
    return this.feedbackService.findAllBugReports(req.user, filters);
  }

  @Get('bug-reports/:id')
  findOneBugReport(@Param('id') id: string, @Request() req) {
    return this.feedbackService.findOneBugReport(id, req.user);
  }

  @Patch('bug-reports/:id')
  updateBugReport(@Param('id') id: string, @Body() updateBugReportDto: any, @Request() req) {
    return this.feedbackService.updateBugReport(id, updateBugReportDto, req.user);
  }

  @Delete('bug-reports/:id')
  removeBugReport(@Param('id') id: string, @Request() req) {
    return this.feedbackService.removeBugReport(id, req.user);
  }

  // Feature Requests
  @Post('feature-requests')
  createFeatureRequest(@Body() createFeatureRequestDto: any, @Request() req) {
    return this.feedbackService.createFeatureRequest(createFeatureRequestDto, req.user);
  }

  @Get('feature-requests')
  findAllFeatureRequests(@Request() req, @Query() filters: any) {
    return this.feedbackService.findAllFeatureRequests(req.user, filters);
  }

  @Get('feature-requests/:id')
  findOneFeatureRequest(@Param('id') id: string, @Request() req) {
    return this.feedbackService.findOneFeatureRequest(id, req.user);
  }

  @Patch('feature-requests/:id')
  updateFeatureRequest(@Param('id') id: string, @Body() updateFeatureRequestDto: any, @Request() req) {
    return this.feedbackService.updateFeatureRequest(id, updateFeatureRequestDto, req.user);
  }

  @Delete('feature-requests/:id')
  removeFeatureRequest(@Param('id') id: string, @Request() req) {
    return this.feedbackService.removeFeatureRequest(id, req.user);
  }

  @Post('feature-requests/:id/vote')
  voteFeatureRequest(@Param('id') id: string, @Request() req) {
    return this.feedbackService.voteFeatureRequest(id, req.user);
  }
}
