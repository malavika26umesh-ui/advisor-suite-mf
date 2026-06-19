import React from 'react';
import { ArrowSquareOut } from '@phosphor-icons/react';

export type SourceType = 'AMFI' | 'SEBI' | 'SID' | 'KIM' | 'AMC Factsheet';

export interface SourceBadgeProps {
  source: SourceType | string;
  href: string;
  className?: string;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ source, href, className = '' }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={[
      'inline-flex items-center gap-1 px-2 py-0.5 rounded',
      'bg-source-badge-bg text-source-badge-text',
      'text-[12px] font-semibold',
      'hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-info-500',
      'transition-opacity duration-150 hover:opacity-80',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    aria-label={`Source: ${source} (opens in new tab)`}
  >
    {source}
    <ArrowSquareOut size={12} aria-hidden="true" />
  </a>
);

export default SourceBadge;
