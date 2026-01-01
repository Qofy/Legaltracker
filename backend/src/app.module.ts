import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { LlmModule } from './llm/llm.module';
import { CasesModule } from './cases/cases.module';
import { DocumentsModule } from './documents/documents.module';
import { CommentsModule } from './comments/comments.module';
import { ActionItemsModule } from './action-items/action-items.module';
import { AnnotationsModule } from './annotations/annotations.module';
import { MeetingsModule } from './meetings/meetings.module';
import { ChatMessagesModule } from './chat-messages/chat-messages.module';
import { InvitationsModule } from './invitations/invitations.module';
import { GuestPassesModule } from './guest-passes/guest-passes.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'better-sqlite3',
        database: configService.get('DB_DATABASE') || 'legalhub.db',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Set to false in production
        logging: false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    MessagesModule,
    LlmModule,
    CasesModule,
    DocumentsModule,
    CommentsModule,
    ActionItemsModule,
    AnnotationsModule,
    MeetingsModule,
    ChatMessagesModule,
    InvitationsModule,
    GuestPassesModule,
    FeedbackModule,
  ],
})
export class AppModule {}
