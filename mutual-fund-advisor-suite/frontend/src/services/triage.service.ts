import axios from 'axios';
import type { TriageResult } from '../stores/queryBuilderStore';

export const triageService = {
  async classifyQuery(query: string, sessionId: string): Promise<TriageResult> {
    const response = await axios.post<TriageResult>('/api/triage/classify', {
      query,
      session_id: sessionId
    });
    return response.data;
  }
};
