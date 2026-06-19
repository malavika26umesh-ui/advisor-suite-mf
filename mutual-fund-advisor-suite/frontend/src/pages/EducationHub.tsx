import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  MagnifyingGlass,
  Warning,
  ArrowRight,
  X,
} from '@phosphor-icons/react';
import { Card, Skeleton } from '../components/ui';
import { SECTION_META, fundTypePill } from '../components/features/education/educationMeta';
import { educationService } from '../services/education.service';
import { EDUCATION_COMPLIANCE_STRIP } from '../utils/compliance';
import type {
  EducationArticleSummary,
  EducationCategory,
  EducationSearchResult,
  EducationSectionSummary,
} from '../types';

export default function EducationHub() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [sections, setSections] = useState<EducationSectionSummary[]>([]);
  const [articles, setArticles] = useState<EducationArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<EducationSearchResult[] | null>(null);
  const [searching, setSearching] = useState(false);

  const [highlighted, setHighlighted] = useState<EducationCategory | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    (async () => {
      try {
        const [sectionData, articleData] = await Promise.all([
          educationService.getSections(),
          educationService.getArticles(),
        ]);
        setSections(sectionData);
        setArticles(articleData);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ?category= deep link: scroll to that section and briefly highlight it.
  useEffect(() => {
    const category = searchParams.get('category') as EducationCategory | null;
    if (!category || loading) return;

    const node = sectionRefs.current[category];
    if (node) {
      node.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setHighlighted(category);
      const timer = setTimeout(() => setHighlighted(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, loading]);

  const articlesByCategory = useMemo(() => {
    const grouped: Record<string, EducationArticleSummary[]> = {};
    for (const article of articles) {
      grouped[article.category] = grouped[article.category] || [];
      grouped[article.category].push(article);
    }
    for (const list of Object.values(grouped)) {
      list.sort((a, b) => a.section_order - b.section_order);
    }
    return grouped;
  }, [articles]);

  const sectionCount = (category: EducationCategory) =>
    sections.find((s) => s.category === category)?.article_count ?? 0;

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearching(true);
    try {
      const results = await educationService.search(trimmed);
      setSearchResults(results);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSearchResults(null);
  };

  return (
    <div className="font-body">
      {/* ══ HERO ════════════════════════════ */}
      <section
        aria-labelledby="education-hero-headline"
        className="bg-gradient-to-br from-brand-navy to-brand-teal py-14 md:py-16"
      >
        <div className="max-w-max-width mx-auto px-6 flex flex-col items-center text-center gap-5">
          <h1
            id="education-hero-headline"
            className="font-heading text-[28px] md:text-[36px] font-bold text-white leading-tight"
          >
            Education Hub
          </h1>
          <p className="text-white/80 text-[15px] max-w-[560px]">
            Every article is sourced from SEBI circulars, AMFI data, and fund SID/KIM documents.
            No opinions. No comparisons. Just facts.
          </p>

          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-[560px] h-[52px] bg-white rounded-xl shadow-level-2 flex items-center overflow-hidden"
          >
            <div className="pl-4 pr-2 text-neutral-400 shrink-0">
              <MagnifyingGlass size={20} weight="bold" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the Education Hub — e.g. exit load, NAV, SIP..."
              className="flex-1 bg-transparent border-none outline-none text-neutral-800 text-[15px] font-body font-medium placeholder-neutral-400 h-full py-2"
            />
            {searchResults && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X size={18} weight="bold" />
              </button>
            )}
            <button
              type="submit"
              disabled={!query.trim() || searching}
              className="h-full px-6 bg-brand-saffron hover:bg-amber-600 disabled:opacity-50 text-white font-heading text-sm font-semibold shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <div className="max-w-max-width mx-auto px-6">
        {/* ══ SEARCH RESULTS ════════════════════════════ */}
        {searchResults && (
          <section aria-label="Search results" className="py-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-[20px] font-semibold text-neutral-900">
                {searchResults.length > 0
                  ? `${searchResults.length} result${searchResults.length === 1 ? '' : 's'} for "${query}"`
                  : `No results for "${query}"`}
              </h2>
              <button
                type="button"
                onClick={clearSearch}
                className="text-[13px] font-semibold text-brand-teal hover:underline"
              >
                Clear search
              </button>
            </div>

            {searching ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[1, 2].map((i) => (
                  <Skeleton key={i} variant="card" height="120px" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {searchResults.map((result) => (
                  <Card
                    key={result.slug}
                    variant="feature"
                    onClick={() => navigate(`/education/${result.slug}`)}
                  >
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-source-badge-bg text-source-badge-text text-[11px] font-semibold mb-2">
                      {SECTION_META.find((s) => s.category === result.category)?.title ?? result.category}
                    </span>
                    <h3 className="font-heading text-[16px] font-semibold text-neutral-900 mb-1.5">
                      {result.title}
                    </h3>
                    <p className="text-[13px] text-neutral-600 leading-relaxed mb-2">
                      {result.excerpt}…
                    </p>
                    <span className="text-[13px] font-semibold text-brand-teal">Read more →</span>
                  </Card>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ══ SECTIONS ════════════════════════════ */}
        {!searchResults && (
          <>
            {/* Section 1 — Fund Categories */}
            <EducationSection
              meta={SECTION_META[0]}
              count={sectionCount('fund_categories')}
              highlighted={highlighted === 'fund_categories'}
              sectionRef={(el) => (sectionRefs.current['fund_categories'] = el)}
              loading={loading}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {articlesByCategory.fund_categories?.map((article) => (
                  <Card
                    key={article.slug}
                    variant="feature"
                    onClick={() => navigate(`/education/${article.slug}`)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      {SECTION_META[0].icon}
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-[11px] font-semibold">
                        {fundTypePill(article.slug)}
                      </span>
                    </div>
                    <h3 className="font-heading text-[15px] font-semibold text-neutral-900 mb-1.5">
                      {article.title}
                    </h3>
                    <p className="text-[12px] text-neutral-400">SEBI categorization framework</p>
                  </Card>
                ))}
              </div>
            </EducationSection>

            {/* Section 2 — Key Concepts */}
            <EducationSection
              meta={SECTION_META[1]}
              count={sectionCount('key_concepts')}
              highlighted={highlighted === 'key_concepts'}
              sectionRef={(el) => (sectionRefs.current['key_concepts'] = el)}
              loading={loading}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {articlesByCategory.key_concepts?.map((article) => (
                  <Card
                    key={article.slug}
                    variant="feature"
                    onClick={() => navigate(`/education/${article.slug}`)}
                  >
                    <div className="mb-3">{SECTION_META[1].icon}</div>
                    <h3 className="font-heading text-[15px] font-semibold text-neutral-900">
                      {article.title}
                    </h3>
                  </Card>
                ))}
              </div>
            </EducationSection>

            {/* Section 3 — Fees & Costs */}
            <EducationSection
              meta={SECTION_META[2]}
              count={sectionCount('fee_education')}
              highlighted={highlighted === 'fee_education'}
              sectionRef={(el) => (sectionRefs.current['fee_education'] = el)}
              loading={loading}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {articlesByCategory.fee_education?.map((article) => (
                  <Card
                    key={article.slug}
                    variant="feature"
                    onClick={() => navigate(`/education/${article.slug}`)}
                    className="relative"
                  >
                    {article.most_misunderstood && (
                      <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning-50 text-warning-500 text-[11px] font-semibold">
                        <Warning size={12} weight="fill" aria-hidden="true" />
                        Most misunderstood
                      </span>
                    )}
                    <div className="mb-3">{SECTION_META[2].icon}</div>
                    <h3 className="font-heading text-[15px] font-semibold text-neutral-900">
                      {article.title}
                    </h3>
                  </Card>
                ))}
              </div>
            </EducationSection>

            {/* Section 4 — Investor Processes */}
            <EducationSection
              meta={SECTION_META[3]}
              count={sectionCount('investor_processes')}
              highlighted={highlighted === 'investor_processes'}
              sectionRef={(el) => (sectionRefs.current['investor_processes'] = el)}
              loading={loading}
            >
              <div className="flex flex-col md:flex-row md:flex-wrap items-stretch gap-4">
                {articlesByCategory.investor_processes?.map((article, idx) => (
                  <React.Fragment key={article.slug}>
                    <Card
                      variant="feature"
                      onClick={() => navigate(`/education/${article.slug}`)}
                      className="flex-1 min-w-[200px]"
                    >
                      <span className="text-[12px] font-semibold text-neutral-400 uppercase tracking-wider">
                        Step {idx + 1}
                      </span>
                      <h3 className="font-heading text-[15px] font-semibold text-neutral-900 mt-1">
                        {article.title}
                      </h3>
                    </Card>
                    {idx < (articlesByCategory.investor_processes?.length ?? 0) - 1 && (
                      <ArrowRight
                        size={20}
                        weight="bold"
                        className="hidden md:flex text-neutral-300 self-center shrink-0"
                        aria-hidden="true"
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </EducationSection>

            {/* Section 5 — Investor Rights */}
            <EducationSection
              meta={SECTION_META[4]}
              count={sectionCount('investor_rights')}
              highlighted={highlighted === 'investor_rights'}
              sectionRef={(el) => (sectionRefs.current['investor_rights'] = el)}
              loading={loading}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {articlesByCategory.investor_rights?.map((article) => (
                  <Card
                    key={article.slug}
                    variant="feature"
                    onClick={() => navigate(`/education/${article.slug}`)}
                  >
                    <div className="mb-3">{SECTION_META[4].icon}</div>
                    <h3 className="font-heading text-[15px] font-semibold text-neutral-900">
                      {article.title}
                    </h3>
                  </Card>
                ))}
              </div>
            </EducationSection>
          </>
        )}
      </div>

      {/* ══ COMPLIANCE STRIP ════════════════════════════ */}
      <section
        aria-label="Compliance and regulatory information"
        className="bg-disclaimer-bg border-t border-disclaimer-border/30 py-6"
      >
        <div className="max-w-max-width mx-auto px-6 text-center">
          <p className="text-disclaimer text-neutral-600 leading-[1.55]">
            {EDUCATION_COMPLIANCE_STRIP}
          </p>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────
// Section wrapper — shared heading + highlight behaviour
// ─────────────────────────────────────────────
interface EducationSectionProps {
  meta: { category: EducationCategory; title: string; description: string };
  count: number;
  highlighted: boolean;
  sectionRef: (el: HTMLDivElement | null) => void;
  loading: boolean;
  children: React.ReactNode;
}

function EducationSection({ meta, count, highlighted, sectionRef, loading, children }: EducationSectionProps) {
  return (
    <section
      id={meta.category}
      ref={sectionRef}
      aria-labelledby={`${meta.category}-heading`}
      className={[
        'py-10 transition-all duration-500 rounded-2xl',
        highlighted ? 'ring-2 ring-brand-teal ring-offset-4' : '',
      ].join(' ')}
    >
      <div className="mb-6">
        <h2
          id={`${meta.category}-heading`}
          className="font-heading text-[22px] font-bold text-neutral-900 mb-1"
        >
          {meta.title}
          {!loading && <span className="ml-2 text-[14px] font-normal text-neutral-400">({count})</span>}
        </h2>
        <p className="text-[14px] text-neutral-600">{meta.description}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="card" height="140px" />
          ))}
        </div>
      ) : (
        children
      )}
    </section>
  );
}
