import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessagesService } from './chat-messages.service';
import { ChatMessagesController } from './chat-messages.controller';
import { ChatMessage } from './chat-message.entity';
import { CasesModule } from '../cases/cases.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessage]), CasesModule],
  controllers: [ChatMessagesController],
  providers: [ChatMessagesService],
  exports: [ChatMessagesService],
})
export class ChatMessagesModule {}
