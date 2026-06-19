import React from 'react';

export interface TopicPillProps {
  label: string;
  icon?: React.ReactNode;
  sublabel?: string;
  selected?: boolean;
  onClick: () => void;
  className?: string;
  id?: string;
}

export const TopicPill: React.FC<TopicPillProps> = ({
  label,
  icon,
  sublabel,
  selected = false,
  onClick,
  className = '',
  id,
}) => (
  <button
    id={id}
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    className={[
      'inline-flex items-center gap-1.5 h-8 px-[14px] rounded-full',
      'text-[13px] font-medium transition-all duration-150',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-brand-teal',
      selected
        ? 'bg-brand-navy text-white border-transparent'
        : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    {icon && <span className="shrink-0 text-base">{icon}</span>}
    <span>{label}</span>
    {sublabel && (
      <span className={`text-[11px] ${selected ? 'text-white/70' : 'text-neutral-400'}`}>
        {sublabel}
      </span>
    )}
  </button>
);

export default TopicPill;
