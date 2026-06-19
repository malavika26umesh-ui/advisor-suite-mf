
import { Link, useNavigate } from 'react-router-dom';
import {
  MagnifyingGlass,
  BookOpen,
  CalendarBlank,
  ShieldCheck,
  LinkSimple,
  Warning,
  ArrowRight,
} from '@phosphor-icons/react';
import { Button, Card, TopicPill, DisclaimerBlock } from '../components/ui';


// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────
const HOW_IT_WORKS = [
  {
    icon: <MagnifyingGlass size={28} weight="bold" className="text-brand-teal" />,
    title: 'Ask a Question',
    description:
      'Ask anything about mutual fund fees, NAV, processes, or regulations. Get a concise, source-cited answer instantly.',
    id: 'hiw-ask',
  },
  {
    icon: <BookOpen size={28} weight="bold" className="text-brand-navy" />,
    title: 'Learn at Your Pace',
    description:
      'Explore our Education Hub — from what a flexi-cap fund is, to how SIPs work and what TER means.',
    id: 'hiw-learn',
  },
  {
    icon: <CalendarBlank size={28} weight="bold" className="text-brand-saffron" />,
    title: 'Book an Advisor',
    description:
      'Need personalised advice? Book a call with a SEBI-registered advisor directly from the platform.',
    id: 'hiw-book',
  },
];

const TRUST_BAR_ITEMS = [
  {
    icon: <LinkSimple size={18} className="text-brand-teal" aria-hidden="true" />,
    label: 'Source-cited answers',
  },
  {
    icon: <ShieldCheck size={18} className="text-brand-teal" aria-hidden="true" />,
    label: 'No investment advice',
  },
  {
    icon: <Warning size={18} className="text-brand-teal" aria-hidden="true" />,
    label: 'SEBI-compliant',
  },
];

interface FeaturedTopic {
  label: string;
  slug: string;
}

const FEATURED_TOPICS: FeaturedTopic[] = [
  { label: 'Fees & Charges', slug: 'fees' },
  { label: 'Scheme Details', slug: 'scheme-details' },
  { label: 'How SIPs Work', slug: 'sip' },
  { label: 'Tax on Mutual Funds', slug: 'tax' },
];

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="font-body">

      {/* ══ HERO SECTION ════════════════════════════ */}
      <section
        aria-labelledby="hero-headline"
        className="bg-white border-b border-neutral-100"
      >
        <div className="max-w-max-width mx-auto px-6 py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-8">

            {/* Left column — 55% */}
            <div className="w-full md:w-[55%] flex flex-col gap-6">
              {/* Tag chip */}
              <span className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-info-50 text-info-500 text-[12px] font-semibold tracking-wide">
                <ShieldCheck size={13} weight="fill" aria-hidden="true" />
                SEBI-Compliant · AMFI-Grounded
              </span>

              {/* Headline */}
              <h1
                id="hero-headline"
                className="font-heading text-[32px] md:text-[40px] font-bold text-neutral-900 leading-[1.2]"
              >
                Clear, factual information about mutual funds —{' '}
                <span className="text-brand-teal">no advice, no guesswork.</span>
              </h1>

              {/* Subheadline */}
              <p className="text-[16px] text-neutral-600 leading-relaxed max-w-[520px]">
                Get source-cited answers from official AMFI, SEBI, and AMC documents. Understand
                fees, schemes, and regulations — without being sold anything.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Link to="/query-builder">
                  <Button variant="primary" size="md" id="hero-cta-question">
                    Start with a Question
                    <ArrowRight size={16} aria-hidden="true" />
                  </Button>
                </Link>
                <Link to="/education">
                  <Button variant="secondary" size="md" id="hero-cta-education">
                    Browse Education Hub
                  </Button>
                </Link>
              </div>

              {/* Trust bar */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
                {TRUST_BAR_ITEMS.map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    {item.icon}
                    <span className="text-[13px] text-neutral-600 font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column — 45% decorative panel */}
            <div className="w-full md:w-[45%] flex justify-center md:justify-end">
              <div className="relative w-full max-w-[380px]">
                {/* Decorative FAQ card mockup */}
                <div className="bg-white rounded-2xl shadow-level-3 p-6 border border-neutral-100">
                  <div className="flex items-center gap-2 mb-4">
                    <MagnifyingGlass size={18} className="text-brand-teal" aria-hidden="true" />
                    <span className="text-[13px] font-medium text-neutral-500">Sample query</span>
                  </div>
                  <p className="text-[15px] font-semibold text-neutral-800 mb-4">
                    "What is the exit load for Parag Parikh Flexi Cap Fund?"
                  </p>
                  <div className="bg-neutral-50 rounded-lg p-4 mb-3">
                    <p className="text-[13px] text-neutral-700 leading-relaxed">
                      The exit load for Parag Parikh Flexi Cap Fund is <strong>2%</strong> if
                      redeemed within 365 days, <strong>1%</strong> if redeemed between 366–730
                      days, and <strong>Nil</strong> after 730 days (for up to 10% of units).
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-source-badge-bg text-source-badge-text text-[11px] font-semibold">
                      SID
                    </span>
                    <span className="text-[11px] text-neutral-400">Source: Scheme Information Document</span>
                  </div>
                  {/* Mini disclaimer */}
                  <div className="mt-3 flex gap-2 px-3 py-2 rounded bg-disclaimer-bg border-l-2 border-disclaimer-border">
                    <Warning size={13} className="text-disclaimer-border shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-[11px] text-neutral-600 leading-relaxed">
                      Factual information only. Not investment advice.
                    </p>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-level-2 px-4 py-2.5 flex items-center gap-2 border border-neutral-100">
                  <ShieldCheck size={16} weight="fill" className="text-success-500" aria-hidden="true" />
                  <span className="text-[12px] font-semibold text-neutral-700">SEBI-Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ════════════════════════════ */}
      <section
        aria-labelledby="how-it-works-heading"
        className="py-16 md:py-20 bg-neutral-50"
      >
        <div className="max-w-max-width mx-auto px-6">
          <div className="text-center mb-12">
            <h2
              id="how-it-works-heading"
              className="font-heading text-[28px] font-bold text-neutral-900 mb-3"
            >
              How It Works
            </h2>
            <p className="text-[16px] text-neutral-600 max-w-[480px] mx-auto">
              Three ways to get clarity on mutual funds — no signup, no personal data collected.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((item, idx) => (
              <Card key={item.id} variant="default" hover className="flex flex-col gap-4">
                {/* Icon circle */}
                <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center">
                  {item.icon}
                </div>
                {/* Step number */}
                <span className="text-[12px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Step {idx + 1}
                </span>
                <h3 className="font-heading text-[18px] font-semibold text-neutral-900">
                  {item.title}
                </h3>
                <p className="text-[14px] text-neutral-600 leading-relaxed">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURED TOPICS STRIP ═══════════════════ */}
      <section
        aria-labelledby="topics-heading"
        className="py-12 bg-[#F0FAFB]"
      >
        <div className="max-w-max-width mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h2
                id="topics-heading"
                className="font-heading text-[20px] font-semibold text-neutral-900 mb-1"
              >
                Popular Topics
              </h2>
              <p className="text-[14px] text-neutral-600">Jump to any topic in the FAQ Centre</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {FEATURED_TOPICS.map((topic) => (
                <TopicPill
                  key={topic.slug}
                  id={`topic-pill-${topic.slug}`}
                  label={topic.label}
                  selected={false}
                  onClick={() => navigate(`/faq?topic=${topic.slug}`)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ COMPLIANCE FOOTER STRIP ═════════════════ */}
      <section
        aria-label="Compliance and regulatory information"
        className="bg-disclaimer-bg border-t border-disclaimer-border/30 py-6"
      >
        <div className="max-w-max-width mx-auto px-6">
          <DisclaimerBlock variant="primary" showBookingCta onBookingCtaClick={() => navigate('/schedule')} />
        </div>
      </section>
    </div>
  );
}
