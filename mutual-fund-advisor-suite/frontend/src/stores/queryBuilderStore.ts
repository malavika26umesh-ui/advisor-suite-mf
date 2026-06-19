import { create } from 'zustand';

export type IntentSelection = 'specific_question' | 'learn' | 'advisor' | null;

export interface TriageResult {
  bucket: 'factual' | 'educational' | 'advice_seeking' | 'edge';
  confidence: number;
  routing_destination: 'faq' | 'education' | 'booking' | 'escalation';
  scheme_out_of_scope: boolean;
  scheme_name_detected: string | null;
  escalation_flag: boolean;
}

interface QueryBuilderState {
  currentStep: 1 | 2 | 3;
  intentSelection: IntentSelection;
  topicSelection: string | null;
  freeTextQuery: string;
  triageResult: TriageResult | null;
  isLoading: boolean;
  
  setStep: (step: 1 | 2 | 3) => void;
  setIntent: (intent: IntentSelection) => void;
  setTopic: (topic: string | null) => void;
  setFreeText: (query: string) => void;
  setTriageResult: (result: TriageResult | null) => void;
  setIsLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useQueryBuilderStore = create<QueryBuilderState>((set) => ({
  currentStep: 1,
  intentSelection: null,
  topicSelection: null,
  freeTextQuery: '',
  triageResult: null,
  isLoading: false,

  setStep: (step) => set({ currentStep: step }),
  setIntent: (intent) => set({ intentSelection: intent }),
  setTopic: (topic) => set({ topicSelection: topic }),
  setFreeText: (query) => set({ freeTextQuery: query }),
  setTriageResult: (result) => set({ triageResult: result }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  reset: () => set({
    currentStep: 1,
    intentSelection: null,
    topicSelection: null,
    freeTextQuery: '',
    triageResult: null,
    isLoading: false
  })
}));
