import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, EnvelopeSimple } from '@phosphor-icons/react';
import { BookingCodeDisplay, Card } from '../../ui';
import { useSchedulerStore } from '../../../stores/schedulerStore';

export const ConfirmationStep: React.FC = () => {
  const { booking, investorEmail } = useSchedulerStore();

  if (!booking) {
    return (
      <p className="text-[14px] text-neutral-500 text-center">
        Something went wrong — we couldn't find your booking details.
      </p>
    );
  }

  const slotDate = new Date(booking.slot_datetime).toLocaleString('en-IN', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div
        className="w-16 h-16 rounded-full bg-success-50 flex items-center justify-center animate-checkmark-pop"
      >
        <CheckCircle size={36} weight="fill" className="text-success-500" aria-hidden="true" />
      </div>

      <h2 className="font-heading text-[22px] font-bold text-neutral-900">
        You're booked!
      </h2>

      <BookingCodeDisplay code={booking.booking_code} />

      <Card variant="default" className="w-full text-left flex flex-col gap-2">
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

      <div className="w-full flex items-start gap-2 rounded-lg bg-[#F0FAF4] border border-success-500/30 px-4 py-3">
        <EnvelopeSimple size={16} className="text-success-500 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-[13px] text-neutral-700 text-left">
          A confirmation email has been sent to <strong>{investorEmail}</strong>
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
        <Link to="/" className="text-[14px] font-semibold text-brand-teal underline hover:text-teal-700 transition-colors">
          Return to Home
        </Link>
        <Link to="/education" className="text-[14px] font-semibold text-brand-teal underline hover:text-teal-700 transition-colors">
          Browse Education Hub →
        </Link>
      </div>
    </div>
  );
};

export default ConfirmationStep;
