import { api } from './api';
import type {
  AdvisorProfile,
  AdvisorSlotItem,
  BookingStatus,
  MeetingQueueItem,
  PreMeetingBrief,
} from '../types';

export interface MeetingQueueFilters {
  status?: BookingStatus;
  date?: string;
  topic?: string;
}

export const advisorService = {
  async requestOtp(email: string): Promise<void> {
    await api.post('/advisor/auth/request-otp', { email });
  },

  async verifyOtp(email: string, otp: string): Promise<string> {
    const response = await api.post<{ token: string }>('/advisor/auth/verify-otp', { email, otp });
    return response.data.token;
  },

  async getMe(): Promise<AdvisorProfile> {
    const response = await api.get<AdvisorProfile>('/advisor/me');
    return response.data;
  },

  async getMeetings(filters: MeetingQueueFilters = {}): Promise<MeetingQueueItem[]> {
    const response = await api.get<MeetingQueueItem[]>('/advisor/meetings', { params: filters });
    return response.data;
  },

  async getBrief(id: number): Promise<PreMeetingBrief> {
    const response = await api.get<PreMeetingBrief>(`/advisor/meetings/${id}/brief`);
    return response.data;
  },

  async confirmMeeting(id: number): Promise<void> {
    await api.put(`/advisor/meetings/${id}/confirm`);
  },

  async completeMeeting(id: number): Promise<void> {
    await api.put(`/advisor/meetings/${id}/complete`);
  },

  async rescheduleMeeting(id: number, newSlotId: number, reason: string): Promise<void> {
    await api.put(`/advisor/meetings/${id}/reschedule`, { new_slot_id: newSlotId, reason });
  },

  async getSlots(): Promise<AdvisorSlotItem[]> {
    const response = await api.get<AdvisorSlotItem[]>('/advisor/slots');
    return response.data;
  },

  async createSlot(payload: {
    start_time: string;
    end_time: string;
    is_recurring: boolean;
  }): Promise<AdvisorSlotItem> {
    const response = await api.post<AdvisorSlotItem>('/advisor/slots', payload);
    return response.data;
  },
};
