import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingsService } from './meetings.service';
import { MeetingsController } from './meetings.controller';
import { Meeting } from './meeting.entity';
import { User } from '../users/user.entity';
import { CasesModule } from '../cases/cases.module';

@Module({
  imports: [TypeOrmModule.forFeature([Meeting, User]), CasesModule],
  controllers: [MeetingsController],
  providers: [MeetingsService],
  exports: [MeetingsService],
})
export class MeetingsModule {}
