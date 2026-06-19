import React from 'react';

export type CardVariant = 'default' | 'feature' | 'brief';

export interface CardProps {
  variant?: CardVariant;
  hover?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const variantBase: Record<CardVariant, string> = {
  default: 'bg-white rounded-xl shadow-level-1 p-6',
  feature:
    'bg-white rounded-2xl border border-neutral-200 p-6 cursor-pointer transition-all duration-150 hover:border-brand-teal hover:bg-[#F0FAFB]',
  brief: 'bg-white border-l-4 border-brand-saffron rounded-r-xl p-6 shadow-level-1',
};

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  hover = false,
  children,
  className = '',
  onClick,
}) => {
  const hoverClass =
    variant === 'default' && hover ? 'hover:shadow-level-2 transition-shadow duration-150' : '';

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') onClick();
            }
          : undefined
      }
      className={[variantBase[variant], hoverClass, className].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  );
};

export default Card;
