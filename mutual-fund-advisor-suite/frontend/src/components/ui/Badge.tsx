import React from 'react';

export type BadgeStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'rescheduled';

export interface BadgeProps {
  status: BadgeStatus;
  className?: string;
}

const STATUS_CONFIG: Record<
  BadgeStatus,
  { bg: string; text: string; label: string }
> = {
  confirmed: {
    bg: 'bg-success-50',
    text: 'text-success-500',
    label: 'Confirmed',
  },
  pending: {
    bg: 'bg-warning-50',
    text: 'text-warning-500',
    label: 'Pending',
  },
  cancelled: {
    bg: 'bg-error-50',
    text: 'text-error-500',
    label: 'Cancelled',
  },
  completed: {
    bg: 'bg-neutral-50',
    text: 'text-neutral-400',
    label: 'Completed',
  },
  rescheduled: {
    bg: 'bg-info-50',
    text: 'text-info-500',
    label: 'Rescheduled',
  },
};

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={[
        'inline-flex items-center px-2.5 py-0.5 rounded text-[12px] font-semibold',
        config.bg,
        config.text,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {config.label}
    </span>
  );
};

export default Badge;
