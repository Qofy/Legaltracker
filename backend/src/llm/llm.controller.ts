import { Controller, Post, Body, HttpException, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { LlmService } from './llm.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CasesService } from '../cases/cases.service';

@Controller('llm')
@UseGuards(JwtAuthGuard)
export class LlmController {
  constructor(
    private readonly llmService: LlmService,
    private readonly casesService: CasesService,
  ) {}

  @Post('generate')
  async generate(
    @Body() body: { 
      prompt: string; 
      response_json_schema?: any; 
      add_context_from_internet?: boolean;
      case_ids?: string[];
      case_data?: any[];
    },
    @Request() req,
  ) {
    try {
      let prompt = body.prompt || '';

      // If case IDs were provided, fetch them and build a concise context
      const summaries: string[] = [];

      if (body.case_ids && body.case_ids.length > 0) {
        for (const caseId of body.case_ids) {
          try {
            const caseItem = await this.casesService.findOne(caseId, req.user);
            const assigned = caseItem.assigned_lawyer ? caseItem.assigned_lawyer.full_name || caseItem.assigned_lawyer.email : 'Unassigned';
            const owners = (caseItem.owners || []).map(o => o.full_name || o.email).join(', ') || 'None';
            const customers = (caseItem.customers || []).map(c => c.full_name || c.email).join(', ') || 'None';

            // Truncate long fields to keep prompt size reasonable
            const desc = caseItem.description ? String(caseItem.description).slice(0, 1200) : '';

            summaries.push(`Case ID: ${caseItem.id}\nTitle: ${caseItem.title}\nCase Number: ${caseItem.case_number || 'N/A'}\nStatus: ${caseItem.status || 'N/A'}\nDue Date: ${caseItem.due_date || 'N/A'}\nAssigned Lawyer: ${assigned}\nOwners: ${owners}\nCustomers: ${customers}\nDescription (truncated): ${desc}`);
          } catch (err) {
            // Skip cases the user cannot access
            console.warn(`Skipping case ${caseId}:`, err.message || err);
          }
        }
      }

      // If raw case data was provided from client, include a sanitized summary as well
      if (body.case_data && Array.isArray(body.case_data)) {
        for (const cd of body.case_data) {
          const desc = cd.description ? String(cd.description).slice(0, 1200) : '';
          summaries.push(`Case (client-provided) ID: ${cd.id || 'N/A'}\nTitle: ${cd.title || 'N/A'}\nStatus: ${cd.status || 'N/A'}\nDue Date: ${cd.due_date || 'N/A'}\nAssigned Lawyer: ${cd.assigned_lawyer?.full_name || cd.assigned_lawyer || 'Unassigned'}\nDescription (truncated): ${desc}`);
        }
      }

      if (summaries.length > 0) {
        const context = `CONTEXT: The user has selected the following cases:\n\n${summaries.join('\n\n---\n\n')}\n\nPlease use this context to answer the user's question. Do not hallucinate details beyond what's provided.`;
        // Prepend context to the prompt so LLM sees case info first
        prompt = `${context}\n\nUser Question:\n${prompt}`;
      }

      const response = await this.llmService.generate(
        prompt, 
        body.response_json_schema
      );
      return { response };
    } catch (error) {
      throw new HttpException(
        { message: error.message || 'LLM service error' },
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }
}
