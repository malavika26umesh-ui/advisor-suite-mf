import React from 'react';
import { Link } from 'react-router-dom';
import { ChartBar } from '@phosphor-icons/react';
import {
  PRIMARY_DISCLAIMER,
  PERFORMANCE_DISCLAIMER,
} from '../../utils/compliance';

const FOOTER_LINKS = [
  { label: 'FAQ Centre', to: '/faq' },
  { label: 'Education Hub', to: '/education' },
  { label: 'Book Advisor Call', to: '/schedule' },
];

const META_LINKS = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Sources & Corpus', to: '/sources' },
];

export const Footer: React.FC = () => (
  <footer className="bg-brand-navy text-white" aria-label="Site footer">
    {/* ── Main footer ──────────────────────────────── */}
    <div className="max-w-max-width mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Column 1 — Logo + tagline */}
        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded w-fit"
            aria-label="AdvisorSuite MF — Home"
          >
            <ChartBar size={22} weight="bold" className="text-brand-saffron" aria-hidden="true" />
            <span className="font-heading font-bold text-[17px] leading-none">
              AdvisorSuite<span className="text-brand-saffron"> MF</span>
            </span>
          </Link>
          <p className="text-[12px] text-white/60 leading-relaxed max-w-[220px]">
            Factual. Regulated. Clear.
            <br />
            SEBI-compliant mutual fund information platform.
          </p>
        </div>

        {/* Column 2 — Nav links */}
        <div>
          <p className="text-[11px] uppercase tracking-wider font-semibold text-white/40 mb-4">
            Navigate
          </p>
          <ul className="flex flex-col gap-2.5" role="list">
            {FOOTER_LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-[14px] text-white/80 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 — Meta links */}
        <div>
          <p className="text-[11px] uppercase tracking-wider font-semibold text-white/40 mb-4">
            Legal &amp; Resources
          </p>
          <ul className="flex flex-col gap-2.5" role="list">
            {META_LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-[14px] text-white/80 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    {/* ── Compliance bottom strip ───────────────────── */}
    <div className="border-t border-white/10">
      <div className="max-w-max-width mx-auto px-6 py-5">
        <p className="text-[12px] text-white/60 leading-relaxed mb-2">
          {PRIMARY_DISCLAIMER}
        </p>
        <p className="text-[12px] text-white/60 leading-relaxed mb-4">
          {PERFORMANCE_DISCLAIMER}
        </p>
        <p className="text-[11px] text-white/40 text-center">
          SEBI-compliant fintech platform · Content sourced from AMFI, SEBI, and AMC documents
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
