import { Module } from '@nestjs/common';
import { LlmController } from './llm.controller';
import { LlmService } from './llm.service';
import { CasesModule } from '../cases/cases.module';

@Module({
  imports: [CasesModule],
  controllers: [LlmController],
  providers: [LlmService],
  exports: [LlmService]
})
export class LlmModule {}
