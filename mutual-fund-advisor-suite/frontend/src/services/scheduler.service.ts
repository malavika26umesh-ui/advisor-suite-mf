import { api } from './api';
import type {
  AvailableSlot,
  BookingCreate,
  BookingResponse,
  PiiCheckResponse,
  TopicClassifyResponse,
} from '../types';

export const schedulerService = {
  async getSlots(): Promise<AvailableSlot[]> {
    const response = await api.get<AvailableSlot[]>('/scheduler/slots');
    return response.data;
  },

  async createBooking(payload: BookingCreate): Promise<BookingResponse> {
    const response = await api.post<BookingResponse>('/scheduler/bookings', payload);
    return response.data;
  },

  async classifyTopic(text: string, sessionId: string): Promise<TopicClassifyResponse> {
    const response = await api.post<TopicClassifyResponse>('/scheduler/classify-topic', {
      text,
      session_id: sessionId,
    });
    return response.data;
  },

  async checkPii(text: string): Promise<PiiCheckResponse> {
    const response = await api.post<PiiCheckResponse>('/scheduler/pii-check', { text });
    return response.data;
  },

  async transcribeAudio(blob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append('file', blob, 'recording.webm');
    const response = await api.post<{ transcript: string }>('/scheduler/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.transcript;
  },

  async getBooking(code: string, email: string): Promise<BookingResponse> {
    const response = await api.get<BookingResponse>(`/scheduler/bookings/${code}`, {
      params: { email },
    });
    return response.data;
  },

  async rescheduleBooking(
    code: string,
    newSlotId: number,
    email: string
  ): Promise<BookingResponse> {
    const response = await api.put<BookingResponse>(`/scheduler/bookings/${code}/reschedule`, {
      new_slot_id: newSlotId,
      email,
    });
    return response.data;
  },

  async cancelBooking(code: string, email: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/scheduler/bookings/${code}`, {
      params: { email },
    });
    return response.data;
  },
};
