import React from 'react';

export type SkeletonVariant = 'text' | 'card' | 'badge';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string;
  height?: string;
  className?: string;
}

const variantDefaults: Record<SkeletonVariant, { width: string; height: string; rounded: string }> =
  {
    text: { width: 'w-full', height: 'h-4', rounded: 'rounded' },
    card: { width: 'w-full', height: 'h-32', rounded: 'rounded-xl' },
    badge: { width: 'w-16', height: 'h-6', rounded: 'rounded' },
  };

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
}) => {
  const defaults = variantDefaults[variant];

  return (
    <span
      role="status"
      aria-label="Loading…"
      className={[
        'block',
        'bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100',
        'bg-[length:200%_100%]',
        'animate-shimmer',
        width ?? defaults.width,
        height ?? defaults.height,
        defaults.rounded,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
};

export default Skeleton;
