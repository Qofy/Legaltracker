import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { Document } from './document.entity';
import { User } from '../users/user.entity';
import { Case } from '../cases/case.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document, User, Case])],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
