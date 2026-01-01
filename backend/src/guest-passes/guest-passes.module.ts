import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestPassesService } from './guest-passes.service';
import { GuestPassesController } from './guest-passes.controller';
import { GuestPass } from './guest-pass.entity';
import { User } from '../users/user.entity';
import { CasesModule } from '../cases/cases.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GuestPass, User]),
    CasesModule,
  ],
  controllers: [GuestPassesController],
  providers: [GuestPassesService],
  exports: [GuestPassesService],
})
export class GuestPassesModule {}
