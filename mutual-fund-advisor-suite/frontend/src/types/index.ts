export interface FAQAnswer {
  answer_text: string;
  source_badges: string[];
  source_urls: string[];
  has_nav_data?: boolean;
  clarification_needed?: boolean;
  clarification_question?: string | null;
}

export interface FAQResponse {
  status: 'answered' | 'out_of_scope' | 'advice_deflected' | 'no_answer' | 'clarification_needed';
  answer: FAQAnswer | null;
  out_of_scope_scheme: string | null;
  session_log_id: string | null;
}

export interface FeeExplainerContent {
  version: number;
  fee_term: string;
  bullets: string[];
  source_links: string[];
  updated_at: string;
}

// ── Education Hub (Sprint 9 backend / Sprint 10 frontend) ──────────────────

export type EducationCategory =
  | 'fund_categories'
  | 'key_concepts'
  | 'fee_education'
  | 'investor_processes'
  | 'investor_rights';

export interface EducationCitation {
  label: string;
  url: string;
  citation_text: string;
}

export interface EducationSectionSummary {
  category: EducationCategory;
  article_count: number;
}

export interface EducationArticleSummary {
  slug: string;
  title: string;
  category: EducationCategory;
  section_order: number;
  most_misunderstood: boolean;
  scheme_example_id: number | null;
}

export interface EducationArticleDetail {
  slug: string;
  title: string;
  category: EducationCategory;
  section_order: number;
  body_markdown: string;
  source_citations: EducationCitation[];
  last_reviewed_date: string;
  version: number;
  scheme_example_id: number | null;
  most_misunderstood: boolean;
}

export interface EducationSearchResult {
  slug: string;
  title: string;
  category: EducationCategory;
  excerpt: string;
}
