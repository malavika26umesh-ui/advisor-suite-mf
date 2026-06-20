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

// ── Voice Appointment Scheduler (Sprint 11 backend / Sprint 12 frontend) ───

export interface AvailableSlot {
  id: number;
  advisor_id: number;
  advisor_name: string;
  start_time: string;
  end_time: string;
}

export interface BookingCreate {
  slot_id: number;
  topic_category: string;
  session_id: string;
  email: string;
  context?: string | null;
}

export interface BookingResponse {
  id: number;
  booking_code: string;
  advisor_name: string;
  topic_category: string;
  status: string;
  slot_datetime: string;
}

export interface PiiCheckResponse {
  has_pii: boolean;
  matched_type: string | null;
  deflection_message: string | null;
}

export interface TopicClassifyResponse {
  topic_category: 'factual' | 'educational' | 'advice_seeking' | 'edge';
}

// ── Advisor Dashboard (Sprint 13 backend / Sprint 14 frontend) ─────────────

export type BookingStatus = 'confirmed' | 'cancelled' | 'completed' | 'rescheduled';

export interface AdvisorProfile {
  id: number;
  email: string;
  name: string;
  sebi_registration_number: string;
  is_active: boolean;
}

export interface MeetingQueueItem {
  id: number;
  booking_code: string;
  topic_category: string;
  slot_datetime: string;
  status: BookingStatus;
  brief_preview_available: boolean;
}

export interface EducationArticleRef {
  title: string;
  slug: string;
}

export interface PreMeetingBrief {
  booking_code: string;
  topic_category: string;
  investor_context: string | null;
  session_faq_queries: string[];
  pulse_top_theme: string | null;
  relevant_education_articles: EducationArticleRef[];
}

export interface AdvisorSlotItem {
  id: number;
  advisor_id: number;
  start_time: string;
  end_time: string;
  is_blocked: boolean;
  booking_code?: string | null;
}
