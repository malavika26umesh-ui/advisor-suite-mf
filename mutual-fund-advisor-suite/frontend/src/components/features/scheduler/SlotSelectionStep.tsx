import React, { useEffect, useState } from 'react';
import { CalendarBlank } from '@phosphor-icons/react';
import { Button, Skeleton } from '../../ui';
import { useSchedulerStore } from '../../../stores/schedulerStore';
import { schedulerService } from '../../../services/scheduler.service';
import type { AvailableSlot } from '../../../types';
import { useToast } from '../../ui/Toast';

function formatSlot(slot: AvailableSlot): { day: string; time: string } {
  const start = new Date(slot.start_time);
  const day = start.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });
  const time = start.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return { day, time };
}

interface SlotSelectionStepProps {
  /** Allows reuse on the RescheduleCancel page, which doesn't use the scheduler store flow. */
  onContinue?: (slot: AvailableSlot) => void;
  continueLabel?: string;
}

export const SlotSelectionStep: React.FC<SlotSelectionStepProps> = ({
  onContinue,
  continueLabel = 'Continue →',
}) => {
  const { selectedSlot, setSelectedSlot, goNext } = useSchedulerStore();
  const { addToast } = useToast();
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await schedulerService.getSlots();
        setSlots(data);
      } catch {
        addToast('Could not load available slots. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinue = () => {
    if (!selectedSlot) return;
    if (onContinue) {
      onContinue(selectedSlot);
    } else {
      goNext();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-heading text-[18px] font-semibold text-neutral-900 text-center">
        Choose a time that works for you
      </h2>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="card" height="72px" />
          ))}
        </div>
      ) : slots.length === 0 ? (
        <p className="text-[14px] text-neutral-500 text-center">
          No slots are available right now. Please check back later.
        </p>
      ) : (
        <div role="radiogroup" aria-label="Available time slots" className="flex flex-col gap-3">
          {slots.map((slot) => {
            const { day, time } = formatSlot(slot);
            const isSelected = selectedSlot?.id === slot.id;
            return (
              <button
                key={slot.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedSlot(slot)}
                className={[
                  'flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left transition-colors duration-150',
                  isSelected
                    ? 'bg-[#F0FAFB] border-brand-teal'
                    : 'bg-white border-neutral-200 hover:border-neutral-300',
                ].join(' ')}
              >
                <CalendarBlank
                  size={22}
                  weight={isSelected ? 'fill' : 'regular'}
                  className={isSelected ? 'text-brand-teal' : 'text-neutral-400'}
                  aria-hidden="true"
                />
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-neutral-900">{day}</p>
                  <p className="text-[13px] text-neutral-500">{time} IST · {slot.advisor_name}</p>
                </div>
                <span
                  className={[
                    'w-5 h-5 rounded-full border-2 shrink-0',
                    isSelected ? 'border-brand-teal bg-brand-teal' : 'border-neutral-300',
                  ].join(' ')}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
      )}

      <Button variant="primary" disabled={!selectedSlot} onClick={handleContinue} fullWidth>
        {continueLabel}
      </Button>
    </div>
  );
};

export default SlotSelectionStep;
