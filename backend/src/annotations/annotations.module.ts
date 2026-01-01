import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnotationsService } from './annotations.service';
import { AnnotationsController } from './annotations.controller';
import { Annotation } from './annotation.entity';
import { User } from '../users/user.entity';
import { Document } from '../documents/document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Annotation, User, Document])],
  controllers: [AnnotationsController],
  providers: [AnnotationsService],
  exports: [AnnotationsService],
})
export class AnnotationsModule {}
