

import { ArrowSquareOut } from '@phosphor-icons/react';
import { Card } from '../components/ui';
import { PRIMARY_DISCLAIMER, PERFORMANCE_DISCLAIMER } from '../utils/compliance';
import schemesData from '../data/top20_schemes.json';

// The backend JSON is the canonical source. We import it statically here so
// the Sources page works without a live API (the API endpoint is added in Sprint 7).
// In production the table is also available at GET /api/faq/covered-schemes.

interface Scheme {
  id: number;
  name: string;
  category: string;
  amc: string;
  aliases: string[];
}

const schemes: Scheme[] = schemesData.schemes;

const SOURCE_SECTIONS = [
  {
    id: 'amfi',
    title: 'AMFI (Association of Mutual Funds in India)',
    href: 'https://www.amfiindia.com',
    description:
      'Scheme Information Documents (SID), Key Information Memoranda (KIM), NAV data, Total Expense Ratios (TER), and all AMFI-mandated disclosures for every covered scheme.',
    types: ['Scheme Information Document (SID)', 'Key Information Memorandum (KIM)', 'NAV History', 'TER Data'],
  },
  {
    id: 'sebi',
    title: 'SEBI (Securities and Exchange Board of India)',
    href: 'https://www.sebi.gov.in',
    description:
      'SEBI circulars, master circulars on mutual fund regulations, investor rights guidelines, and risk-o-meter guidelines.',
    types: ['SEBI Circulars', 'Master Circulars', 'Risk-o-meter Guidelines', 'Investor Charter'],
  },
  {
    id: 'amc',
    title: 'AMC Factsheets & Fund Documents',
    href: 'https://www.amfiindia.com/mutual-fund',
    description:
      'Monthly factsheets published by each AMC, containing portfolio holdings, fund manager commentary, and return data for our 20 covered schemes.',
    types: ['Monthly Factsheets', 'Portfolio Holdings', 'Fund Manager Commentary'],
  },
  {
    id: 'mfapi',
    title: 'mfapi.in — Open NAV Data',
    href: 'https://www.mfapi.in',
    description:
      'An open API aggregating real-time and historical NAV data from AMFI. Used for NAV display and historical data in our platform.',
    types: ['Real-time NAV', 'Historical NAV Data'],
  },
];

export default function Sources() {
  return (
    <div className="bg-neutral-50 min-h-screen font-body">

      {/* ── Page header ───────────────────────────── */}
      <div className="bg-white border-b border-neutral-100 py-10">
        <div className="max-w-max-width mx-auto px-6">
          <h1 className="font-heading text-[28px] font-bold text-neutral-900 mb-2">
            Sources &amp; Corpus Transparency
          </h1>
          <p className="text-[16px] text-neutral-600 max-w-[600px]">
            Every answer on this platform is sourced from official regulatory and AMC documents.
            Here is exactly where our information comes from.
          </p>
        </div>
      </div>

      <div className="max-w-max-width mx-auto px-6 py-12 flex flex-col gap-12">

        {/* ── Source sections ────────────────────── */}
        <section aria-labelledby="sources-heading">
          <h2
            id="sources-heading"
            className="font-heading text-[22px] font-semibold text-neutral-900 mb-6"
          >
            Our Information Sources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SOURCE_SECTIONS.map((src) => (
              <Card key={src.id} variant="default" className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-heading text-[16px] font-semibold text-neutral-900">
                    {src.title}
                  </h3>
                  <a
                    href={src.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1 text-[12px] text-brand-teal hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal rounded"
                    aria-label={`Visit ${src.title} (opens in new tab)`}
                  >
                    Visit site
                    <ArrowSquareOut size={12} aria-hidden="true" />
                  </a>
                </div>
                <p className="text-[13px] text-neutral-600 leading-relaxed">
                  {src.description}
                </p>
                <ul className="flex flex-wrap gap-1.5 mt-1" role="list">
                  {src.types.map((t) => (
                    <li
                      key={t}
                      className="px-2 py-0.5 rounded bg-neutral-100 text-[11px] font-medium text-neutral-600"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>

        {/* ── Top 20 schemes table ───────────────── */}
        <section aria-labelledby="schemes-heading">
          <div className="flex items-center justify-between mb-5 gap-4">
            <div>
              <h2
                id="schemes-heading"
                className="font-heading text-[22px] font-semibold text-neutral-900 mb-1"
              >
                Covered Schemes (Top 20)
              </h2>
              <p className="text-[14px] text-neutral-600">
                Our corpus covers these 20 schemes. Queries about other schemes will return an
                out-of-scope response.
              </p>
            </div>
            <a
              href="https://www.amfiindia.com"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1 text-[13px] text-brand-teal hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal rounded"
            >
              AMFI rankings <ArrowSquareOut size={13} aria-hidden="true" />
            </a>
          </div>

          {/* Table wrapper for horizontal scroll on mobile */}
          <div className="overflow-x-auto rounded-xl shadow-level-1">
            <table className="w-full text-left border-collapse bg-white" role="table">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-100">
                  <th
                    scope="col"
                    className="px-5 py-3 text-[11px] font-semibold text-neutral-600 uppercase tracking-wider"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-[11px] font-semibold text-neutral-600 uppercase tracking-wider"
                  >
                    Fund Name
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-[11px] font-semibold text-neutral-600 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-[11px] font-semibold text-neutral-600 uppercase tracking-wider"
                  >
                    AMC
                  </th>
                </tr>
              </thead>
              <tbody>
                {schemes.map((scheme, idx) => (
                  <tr
                    key={scheme.id}
                    className={[
                      'border-b border-neutral-50 hover:bg-neutral-50 transition-colors duration-150',
                    ].join(' ')}
                  >
                    <td className="px-5 py-3.5 text-[13px] text-neutral-400 font-mono">
                      {String(idx + 1).padStart(2, '0')}
                    </td>
                    <td className="px-5 py-3.5 text-[14px] font-medium text-neutral-800">
                      {scheme.name}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex px-2 py-0.5 rounded bg-neutral-100 text-[12px] font-medium text-neutral-600">
                        {scheme.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-neutral-600">
                      {scheme.amc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Refresh policy ────────────────────── */}
        <section aria-labelledby="refresh-heading">
          <h2
            id="refresh-heading"
            className="font-heading text-[22px] font-semibold text-neutral-900 mb-4"
          >
            Data Refresh Policy
          </h2>
          <Card variant="brief" className="max-w-2xl">
            <ul className="flex flex-col gap-3 text-[14px] text-neutral-700 leading-relaxed">
              <li>
                <strong className="text-neutral-900">NAV Data:</strong> Updated nightly from mfapi.in,
                sourced from AMFI's official NAV feed.
              </li>
              <li>
                <strong className="text-neutral-900">Scheme Documents (SID/KIM):</strong> Refreshed
                whenever AMFI publishes an amendment. Typically quarterly or on any scheme change.
              </li>
              <li>
                <strong className="text-neutral-900">TER / Fee Data:</strong> Updated monthly from
                AMC factsheets. Our Product Pulse feature (available to advisors) highlights fee
                changes.
              </li>
              <li>
                <strong className="text-neutral-900">SEBI Circulars:</strong> Manually reviewed and
                ingested within 5 business days of publication.
              </li>
            </ul>
          </Card>
        </section>

        {/* ── Compliance notices ────────────────── */}
        <section aria-label="Compliance notices" className="flex flex-col gap-3">
          <div className="flex gap-3 px-4 py-3 rounded-r-lg bg-disclaimer-bg border-l-4 border-disclaimer-border">
            <p className="text-[13px] text-neutral-600 leading-[1.55]">{PRIMARY_DISCLAIMER}</p>
          </div>
          <div className="flex gap-3 px-4 py-3 rounded-r-lg bg-disclaimer-bg border-l-4 border-disclaimer-border">
            <p className="text-[13px] text-neutral-600 leading-[1.55]">{PERFORMANCE_DISCLAIMER}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
