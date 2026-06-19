import React from 'react';
import {
  Buildings,
  Lightbulb,
  Receipt,
  ArrowsLeftRight,
  ShieldCheck,
} from '@phosphor-icons/react';
import type { EducationCategory } from '../../../types';

export interface SectionMeta {
  category: EducationCategory;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const SECTION_META: SectionMeta[] = [
  {
    category: 'fund_categories',
    title: 'Fund Categories',
    description: 'What each SEBI-defined scheme category actually means.',
    icon: <Buildings size={24} weight="bold" className="text-brand-navy" />,
  },
  {
    category: 'key_concepts',
    title: 'Key Concepts',
    description: 'NAV, SIP, AUM, and the other terms you will see everywhere.',
    icon: <Lightbulb size={24} weight="bold" className="text-brand-teal" />,
  },
  {
    category: 'fee_education',
    title: 'Fees & Costs',
    description: 'TER, exit load, stamp duty, STT — what you actually pay.',
    icon: <Receipt size={24} weight="bold" className="text-brand-saffron" />,
  },
  {
    category: 'investor_processes',
    title: 'Investor Processes',
    description: 'Step-by-step: starting a SIP, redeeming, KYC, and more.',
    icon: <ArrowsLeftRight size={24} weight="bold" className="text-brand-navy" />,
  },
  {
    category: 'investor_rights',
    title: 'Investor Rights',
    description: 'What every mutual fund investor is entitled to.',
    icon: <ShieldCheck size={24} weight="bold" className="text-[#2D8653]" />,
  },
];

export const SECTION_META_BY_CATEGORY: Record<EducationCategory, SectionMeta> =
  SECTION_META.reduce((acc, section) => {
    acc[section.category] = section;
    return acc;
  }, {} as Record<EducationCategory, SectionMeta>);

// The backend only stores `category: fund_categories` for all 19 fund-category
// articles — the Equity/Debt/Hybrid/Solution-Oriented split is a presentation-only
// grouping derived from the (stable, seed-defined) slugs, not stored server-side.
const DEBT_SLUGS = new Set([
  'liquid-funds',
  'overnight-funds',
  'ultra-short-duration-funds',
  'short-duration-funds',
  'corporate-bond-funds',
  'banking-and-psu-funds',
]);
const HYBRID_SLUGS = new Set([
  'aggressive-hybrid-funds',
  'balanced-advantage-funds',
  'multi-asset-allocation-funds',
]);
const SOLUTION_SLUGS = new Set(['retirement-funds', 'childrens-funds']);

export function fundTypePill(slug: string): 'Equity' | 'Debt' | 'Hybrid' | 'Solution-Oriented' {
  if (DEBT_SLUGS.has(slug)) return 'Debt';
  if (HYBRID_SLUGS.has(slug)) return 'Hybrid';
  if (SOLUTION_SLUGS.has(slug)) return 'Solution-Oriented';
  return 'Equity';
}

export function formatReviewedDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
