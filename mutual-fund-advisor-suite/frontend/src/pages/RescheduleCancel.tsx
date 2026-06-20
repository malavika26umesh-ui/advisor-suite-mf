import React, { useState } from 'react';
import { Button, Card, Input, Modal } from '../components/ui';
import { SlotSelectionStep } from '../components/features/scheduler';
import { schedulerService } from '../services/scheduler.service';
import { useToast } from '../components/ui/Toast';
import type { AvailableSlot, BookingResponse } from '../types';

type ViewMode = 'lookup' | 'details' | 'reschedule';

export default function RescheduleCancel() {
  const { addToast } = useToast();
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [mode, setMode] = useState<ViewMode>('lookup');
  const [loading, setLoading] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    setLoading(true);
    try {
      const result = await schedulerService.getBooking(code.trim().toUpperCase(), email.trim());
      setBooking(result);
      setMode('details');
    } catch {
      setBooking(null);
      setLookupError('We could not find a booking with that code and email combination.');
    } finally {
      setLoading(false);
    }
  };

  const handleRescheduleSlot = async (slot: AvailableSlot) => {
    try {
      const updated = await schedulerService.rescheduleBooking(
        booking!.booking_code,
        slot.id,
        email.trim()
      );
      setBooking(updated);
      setMode('details');
      addToast('Your booking has been rescheduled.', 'success');
    } catch (err: any) {
      addToast(err.response?.data?.detail || 'Could not reschedule. Please try again.', 'error');
    }
  };

  const handleCancelConfirm = async () => {
    if (!booking) return;
    setCancelling(true);
    try {
      await schedulerService.cancelBooking(booking.booking_code, email.trim());
      setBooking({ ...booking, status: 'cancelled' });
      setCancelModalOpen(false);
      addToast('Your booking has been cancelled.', 'success');
    } catch (err: any) {
      addToast(err.response?.data?.detail || 'Could not cancel. Please try again.', 'error');
    } finally {
      setCancelling(false);
    }
  };

  const slotDate = booking
    ? new Date(booking.slot_datetime).toLocaleString('en-IN', {
        weekday: 'long',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div className="max-w-[560px] mx-auto px-6 py-10">
      <h1 className="font-heading text-[24px] font-bold text-neutral-900 mb-6 text-center">
        Manage Your Booking
      </h1>

      {mode === 'lookup' && (
        <form onSubmit={handleLookup} className="flex flex-col gap-4">
          <Input
            label="Booking Code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="MF-XXXX"
            className="font-mono uppercase tracking-widest"
            required
          />
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          {lookupError && (
            <p role="alert" className="text-[13px] text-error-500">
              {lookupError}
            </p>
          )}
          <Button type="submit" variant="primary" loading={loading} fullWidth>
            Look up booking
          </Button>
        </form>
      )}

      {mode === 'details' && booking && (
        <div className="flex flex-col gap-5">
          <Card variant="default" className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-[13px] text-neutral-500">Booking Code</span>
              <span className="text-[13px] font-mono font-semibold text-neutral-800">{booking.booking_code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[13px] text-neutral-500">Topic</span>
              <span className="text-[13px] font-semibold text-neutral-800 capitalize">
                {booking.topic_category.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[13px] text-neutral-500">Advisor</span>
              <span className="text-[13px] font-semibold text-neutral-800">{booking.advisor_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[13px] text-neutral-500">When</span>
              <span className="text-[13px] font-semibold text-neutral-800">{slotDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[13px] text-neutral-500">Status</span>
              <span className="text-[13px] font-semibold text-success-500 capitalize">{booking.status}</span>
            </div>
          </Card>

          {booking.status !== 'cancelled' && (
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setMode('reschedule')} fullWidth>
                Reschedule
              </Button>
              <Button variant="destructive" onClick={() => setCancelModalOpen(true)} fullWidth>
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}

      {mode === 'reschedule' && booking && (
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setMode('details')}
            className="self-start text-[13px] font-medium text-neutral-500 hover:text-brand-teal transition-colors"
          >
            ← Back to booking details
          </button>
          <SlotSelectionStep onContinue={handleRescheduleSlot} continueLabel="Confirm new time →" />
        </div>
      )}

      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel this booking?"
      >
        <p className="text-[14px] text-neutral-600 mb-5">
          This will cancel your call with {booking?.advisor_name}. You'll need to book again if
          you change your mind.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setCancelModalOpen(false)} fullWidth>
            Keep booking
          </Button>
          <Button variant="destructive" onClick={handleCancelConfirm} loading={cancelling} fullWidth>
            Yes, cancel it
          </Button>
        </div>
      </Modal>
    </div>
  );
}
