import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationsService } from './invitations.service';
import { InvitationsController } from './invitations.controller';
import { Invitation } from './invitation.entity';
import { User } from '../users/user.entity';
import { CasesModule } from '../cases/cases.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invitation, User]),
    CasesModule,
  ],
  controllers: [InvitationsController],
  providers: [InvitationsService],
  exports: [InvitationsService],
})
export class InvitationsModule {}
