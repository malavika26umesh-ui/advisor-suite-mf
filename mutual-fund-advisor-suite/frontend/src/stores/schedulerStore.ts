import { create } from 'zustand';
import type { AvailableSlot, BookingResponse, TopicClassifyResponse } from '../types';

export type SchedulerStep = 1 | 2 | 3 | 4 | 5 | 6;

interface SchedulerState {
  currentStep: SchedulerStep;
  pulseTheme: string | null;
  voiceTranscript: string;
  topicCategory: TopicClassifyResponse['topic_category'] | null;
  selectedSlot: AvailableSlot | null;
  investorContext: string;
  investorEmail: string;
  booking: BookingResponse | null;
  isLoading: boolean;
  sessionId: string;

  setStep: (step: SchedulerStep) => void;
  goNext: () => void;
  goBack: () => void;
  setPulseTheme: (theme: string | null) => void;
  setVoiceTranscript: (transcript: string) => void;
  setTopicCategory: (category: TopicClassifyResponse['topic_category'] | null) => void;
  setSelectedSlot: (slot: AvailableSlot | null) => void;
  setInvestorContext: (context: string) => void;
  setInvestorEmail: (email: string) => void;
  setBooking: (booking: BookingResponse | null) => void;
  setIsLoading: (loading: boolean) => void;
  reset: () => void;
}

function generateSessionId(): string {
  return `sched-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

const initialState = {
  currentStep: 1 as SchedulerStep,
  pulseTheme: null,
  voiceTranscript: '',
  topicCategory: null,
  selectedSlot: null,
  investorContext: '',
  investorEmail: '',
  booking: null,
  isLoading: false,
};

export const useSchedulerStore = create<SchedulerState>((set, get) => ({
  ...initialState,
  sessionId: generateSessionId(),

  setStep: (step) => set({ currentStep: step }),
  goNext: () => {
    const next = Math.min(get().currentStep + 1, 6) as SchedulerStep;
    set({ currentStep: next });
  },
  goBack: () => {
    const prev = Math.max(get().currentStep - 1, 1) as SchedulerStep;
    set({ currentStep: prev });
  },
  setPulseTheme: (theme) => set({ pulseTheme: theme }),
  setVoiceTranscript: (transcript) => set({ voiceTranscript: transcript }),
  setTopicCategory: (category) => set({ topicCategory: category }),
  setSelectedSlot: (slot) => set({ selectedSlot: slot }),
  setInvestorContext: (context) => set({ investorContext: context }),
  setInvestorEmail: (email) => set({ investorEmail: email }),
  setBooking: (booking) => set({ booking }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  reset: () => set({ ...initialState, sessionId: generateSessionId() }),
}));
