import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionItemsService } from './action-items.service';
import { ActionItemsController } from './action-items.controller';
import { ActionItem } from './action-item.entity';
import { User } from '../users/user.entity';
import { Case } from '../cases/case.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActionItem, User, Case])],
  controllers: [ActionItemsController],
  providers: [ActionItemsService],
  exports: [ActionItemsService],
})
export class ActionItemsModule {}
