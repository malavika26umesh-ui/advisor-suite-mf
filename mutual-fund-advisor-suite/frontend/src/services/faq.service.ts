import { api } from "./api";
import type { FAQResponse, FeeExplainerContent } from "../types";

export const faqService = {
  async queryFAQ(query: string, sessionId: string): Promise<FAQResponse> {
    const response = await api.post<FAQResponse>("/faq/query", {
      query,
      session_id: sessionId,
    });
    return response.data;
  },

  async getFeeExplainer(): Promise<FeeExplainerContent> {
    const response = await api.get<FeeExplainerContent>("/faq/fee-explainer");
    return response.data;
  },

  async getCoveredSchemes(): Promise<string[]> {
    const response = await api.get<string[]>("/faq/covered-schemes");
    return response.data;
  },
};
