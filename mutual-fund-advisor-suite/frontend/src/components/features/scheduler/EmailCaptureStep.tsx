import React, { useState } from 'react';
import { Button, Input } from '../../ui';
import { useSchedulerStore } from '../../../stores/schedulerStore';
import { schedulerService } from '../../../services/scheduler.service';
import { useToast } from '../../ui/Toast';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const EmailCaptureStep: React.FC = () => {
  const { addToast } = useToast();
  const {
    investorEmail,
    setInvestorEmail,
    selectedSlot,
    topicCategory,
    investorContext,
    sessionId,
    setBooking,
    setIsLoading,
    isLoading,
    goNext,
  } = useSchedulerStore();
  const [touched, setTouched] = useState(false);

  const isValidEmail = EMAIL_REGEX.test(investorEmail.trim());
  const showError = touched && investorEmail.trim().length > 0 && !isValidEmail;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValidEmail || !selectedSlot) return;

    setIsLoading(true);
    try {
      const booking = await schedulerService.createBooking({
        slot_id: selectedSlot.id,
        topic_category: topicCategory ?? 'edge',
        session_id: sessionId,
        email: investorEmail.trim(),
        context: investorContext.trim() || null,
      });
      setBooking(booking);
      goNext();
    } catch (err: any) {
      addToast(err.response?.data?.detail || 'Could not confirm your booking. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <h2 className="font-heading text-[18px] font-semibold text-neutral-900 text-center">
        Where should we send your confirmation?
      </h2>

      <Input
        label="Email address"
        type="email"
        value={investorEmail}
        onChange={(e) => setInvestorEmail(e.target.value)}
        onBlur={() => setTouched(true)}
        error={showError ? 'Please enter a valid email address.' : undefined}
        placeholder="you@example.com"
        autoComplete="email"
      />

      <p className="text-[12px] text-neutral-500 leading-relaxed">
        We'll only use this to send your confirmation email and a brief feedback request after
        your call. Not for marketing. Not shared with third parties.
      </p>

      <Button
        type="submit"
        variant="primary"
        disabled={!isValidEmail || isLoading}
        loading={isLoading}
        fullWidth
      >
        Confirm Booking →
      </Button>
    </form>
  );
};

export default EmailCaptureStep;
