import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { BugReport } from './bug-report.entity';
import { FeatureRequest } from './feature-request.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BugReport, FeatureRequest, User])],
  controllers: [FeedbackController],
  providers: [FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
