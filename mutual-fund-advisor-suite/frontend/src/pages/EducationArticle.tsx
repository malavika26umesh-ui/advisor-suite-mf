import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { CaretRight, CaretDown } from '@phosphor-icons/react';
import { Card, DisclaimerBlock, Skeleton, SourceBadge } from '../components/ui';
import { FeeExplainerPanel } from '../components/features/faq/FeeExplainerPanel';
import {
  SECTION_META_BY_CATEGORY,
  formatReviewedDate,
} from '../components/features/education/educationMeta';
import { educationService } from '../services/education.service';
import top20Schemes from '../data/top20_schemes.json';
import type { EducationArticleDetail, EducationArticleSummary } from '../types';

interface Heading {
  level: 2 | 3;
  text: string;
  id: string;
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  const lines = markdown.split('\n');
  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.*)$/);
    if (match) {
      const level = match[1].length as 2 | 3;
      const text = match[2].trim();
      headings.push({ level, text, id: slugifyHeading(text) });
    }
  }
  return headings;
}

function schemeNameById(id: number | null): string | null {
  if (id === null) return null;
  return top20Schemes.schemes.find((s) => s.id === id)?.name ?? null;
}

export default function EducationArticle() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [article, setArticle] = useState<EducationArticleDetail | null>(null);
  const [related, setRelated] = useState<EducationArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    (async () => {
      try {
        const [articleData, relatedData] = await Promise.all([
          educationService.getArticle(slug),
          educationService.getRelated(slug),
        ]);
        setArticle(articleData);
        setRelated(relatedData);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const headings = useMemo(() => (article ? extractHeadings(article.body_markdown) : []), [article]);
  const showPerformanceDisclaimer = useMemo(
    () => !!slug && (slug.includes('nav') || slug.includes('returns')),
    [slug]
  );
  const schemeExampleName = article ? schemeNameById(article.scheme_example_id) : null;

  if (loading) {
    return (
      <div className="max-w-max-width mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[70%_30%] gap-10">
        <div className="flex flex-col gap-4">
          <Skeleton variant="text" width="40%" height="16px" />
          <Skeleton variant="text" width="70%" height="32px" />
          <Skeleton variant="card" height="300px" />
        </div>
        <Skeleton variant="card" height="240px" />
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="max-w-max-width mx-auto px-6 py-16 text-center">
        <h1 className="font-heading text-[24px] font-bold text-neutral-900 mb-3">
          Article not found
        </h1>
        <p className="text-neutral-600 mb-6">
          This article may have been moved or unpublished.
        </p>
        <Link to="/education" className="text-brand-teal font-semibold hover:underline">
          ← Back to Education Hub
        </Link>
      </div>
    );
  }

  const sectionMeta = SECTION_META_BY_CATEGORY[article.category];

  const tocAndRelated = (
    <>
      {headings.length > 0 && (
        <div>
          <h2 className="text-[12px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            On this page
          </h2>
          <ul className="flex flex-col gap-1.5">
            {headings.map((h) => (
              <li key={h.id} className={h.level === 3 ? 'pl-3' : ''}>
                <a
                  href={`#${h.id}`}
                  className="text-[13px] text-neutral-600 hover:text-brand-teal transition-colors"
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {related.length > 0 && (
        <div>
          <h2 className="text-[12px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            Related Articles
          </h2>
          <div className="flex flex-col gap-2">
            {related.map((r) => (
              <button
                key={r.slug}
                type="button"
                onClick={() => navigate(`/education/${r.slug}`)}
                className="text-left text-[13px] font-medium text-neutral-700 hover:text-brand-teal hover:underline transition-colors"
              >
                {r.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="max-w-max-width mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] text-neutral-500 mb-6">
        <Link to="/education" className="hover:text-brand-teal transition-colors">
          Education Hub
        </Link>
        <CaretRight size={11} aria-hidden="true" />
        <Link
          to={`/education?category=${article.category}`}
          className="hover:text-brand-teal transition-colors"
        >
          {sectionMeta?.title ?? article.category}
        </Link>
        <CaretRight size={11} aria-hidden="true" />
        <span className="text-neutral-700 font-medium truncate max-w-[240px]">{article.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-10">
        {/* ══ MAIN COLUMN ════════════════════════════ */}
        <div className="flex flex-col gap-6 min-w-0">
          {/* Header */}
          <header className="flex flex-col gap-3">
            <span className="inline-flex items-center self-start px-2.5 py-0.5 rounded-full bg-source-badge-bg text-source-badge-text text-[11px] font-semibold">
              {sectionMeta?.title ?? article.category}
            </span>
            <h1 className="font-heading text-[26px] md:text-[32px] font-bold text-neutral-900 leading-tight">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              {article.source_citations.map((citation, idx) => (
                <SourceBadge key={`${citation.url}-${idx}`} source={citation.label} href={citation.url} />
              ))}
            </div>
            <p className="text-[13px] text-neutral-400">
              Last reviewed: {formatReviewedDate(article.last_reviewed_date)}
            </p>
          </header>

          {/* Mobile TOC + Related accordion */}
          {(headings.length > 0 || related.length > 0) && (
            <div className="lg:hidden border border-neutral-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setTocOpen((o) => !o)}
                className="w-full flex items-center justify-between px-4 py-3 bg-neutral-50 text-[13px] font-semibold text-neutral-700"
                aria-expanded={tocOpen}
              >
                On this page &amp; related articles
                <CaretDown
                  size={14}
                  className={`transition-transform ${tocOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
              {tocOpen && <div className="px-4 py-4 flex flex-col gap-5">{tocAndRelated}</div>}
            </div>
          )}

          {/* Body */}
          <article className="prose-article">
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <h2
                    id={slugifyHeading(String(children))}
                    className="font-heading text-[20px] font-bold text-neutral-900 mt-8 mb-3 scroll-mt-24"
                  >
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3
                    id={slugifyHeading(String(children))}
                    className="font-heading text-[17px] font-semibold text-neutral-900 mt-6 mb-2 scroll-mt-24"
                  >
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-[15px] text-neutral-700 leading-[1.7] mb-4">{children}</p>
                ),
                blockquote: ({ children }) => (
                  <div className="my-5 pl-4 pr-3 py-3 border-l-4 border-brand-teal bg-[#F0FAFB] rounded-r-lg text-[14px] text-neutral-700 leading-relaxed [&>p]:mb-0">
                    {children}
                  </div>
                ),
                pre: ({ children }) => <>{children}</>,
                code: ({ children }) => {
                  const text = String(children);
                  if (text.includes('\n')) {
                    const lines = text.replace(/\n$/, '').split('\n');
                    const [title, ...rest] = lines;
                    return (
                      <div className="my-5 rounded-lg border-2 border-dashed border-neutral-300 p-4 bg-neutral-50">
                        <span className="inline-block mb-2 px-2 py-0.5 rounded bg-neutral-200 text-neutral-600 text-[11px] font-semibold uppercase tracking-wide">
                          Example{schemeExampleName ? ` · ${schemeExampleName}` : ''}
                        </span>
                        <p className="text-[13px] font-semibold text-neutral-800 mb-1">{title}</p>
                        <p className="text-[13px] text-neutral-600 leading-relaxed whitespace-pre-wrap">
                          {rest.join('\n').trim()}
                        </p>
                      </div>
                    );
                  }
                  return (
                    <code className="px-1 py-0.5 bg-neutral-100 rounded text-[13px] font-mono">
                      {children}
                    </code>
                  );
                },
              }}
            >
              {article.body_markdown}
            </ReactMarkdown>
          </article>

          {/* Disclaimers — always shown, never suppressed */}
          <div className="flex flex-col gap-3">
            <DisclaimerBlock variant="primary" />
            {showPerformanceDisclaimer && <DisclaimerBlock variant="performance" />}
          </div>

          {/* CTA strip */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 border-t border-neutral-100">
            <Link
              to="/faq"
              className="text-[14px] font-semibold text-brand-teal underline hover:text-teal-700 transition-colors"
            >
              Still have questions? Ask in FAQ Centre →
            </Link>
            <Link
              to="/schedule"
              className="text-[14px] font-semibold text-brand-teal underline hover:text-teal-700 transition-colors"
            >
              Book a call with an advisor →
            </Link>
          </div>
        </div>

        {/* ══ SIDEBAR (desktop only) ════════════════════════════ */}
        <aside className="hidden lg:flex lg:flex-col gap-6 self-start sticky top-6">
          {(headings.length > 0 || related.length > 0) && (
            <Card variant="default" className="flex flex-col gap-5">
              {tocAndRelated}
            </Card>
          )}
          <FeeExplainerPanel />
        </aside>

        {/* Mobile: Fee Explainer stacks below the article */}
        <div className="lg:hidden">
          <FeeExplainerPanel />
        </div>
      </div>
    </div>
  );
}
