import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChartBar,
  ChatCircleText,
  CheckCircle,
  Lightbulb,
  WarningCircle,
} from '@phosphor-icons/react';
import { api } from '../services/api';
import { Skeleton } from '../components/ui';

interface PulseReport {
  id: number;
  week_start_date: string;
  top_themes: string[];
  user_quotes: string[];
  key_observation: string;
  fee_spotlight_term: string;
  product_recommendations: string[];
  corpus_refresh_version: number | null;
  corpus_refresh_confirmed_at: string | null;
  created_at: string;
  sections_1_4_word_count: number;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdvisorPulse() {
  const navigate = useNavigate();
  const [report, setReport] = useState<PulseReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<PulseReport>('/pulse/current');
        setReport(res.data);
      } catch (err: any) {
        const detail = err?.response?.data?.detail;
        if (err?.response?.status === 404) {
          setError('No Pulse report has been generated yet. Trigger a run via the admin panel.');
        } else {
          setError(detail || 'Could not load the Pulse report. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Back navigation */}
      <button
        type="button"
        onClick={() => navigate('/advisor')}
        className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-500 hover:text-neutral-800 transition-colors self-start"
      >
        <ArrowLeft size={15} weight="bold" aria-hidden="true" />
        Back to Dashboard
      </button>

      {/* Page title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-info-500/10 flex items-center justify-center shrink-0">
          <ChartBar size={20} weight="bold" className="text-info-500" aria-hidden="true" />
        </div>
        <div>
          <h1 className="font-heading text-[22px] font-bold text-neutral-900">Product Pulse</h1>
          {report && (
            <p className="text-[13px] text-neutral-500">
              Week of {formatDate(report.week_start_date)} · Generated {formatDate(report.created_at)}
            </p>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col gap-4">
          <Skeleton variant="card" height="120px" />
          <Skeleton variant="card" height="180px" />
          <Skeleton variant="card" height="160px" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex items-start gap-3 p-5 rounded-xl border border-error-500 bg-error-50">
          <WarningCircle size={20} weight="bold" className="text-error-500 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-[14px] text-error-500">{error}</p>
        </div>
      )}

      {/* Report content */}
      {!loading && report && (
        <div className="flex flex-col gap-5">

          {/* Top Themes */}
          <section className="rounded-xl border border-neutral-100 bg-white p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <ChartBar size={18} weight="bold" className="text-brand-teal" aria-hidden="true" />
              <h2 className="font-heading text-[15px] font-semibold text-neutral-800">Top Investor Themes This Week</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {report.top_themes.length > 0 ? (
                report.top_themes.map((theme, i) => (
                  <span
                    key={theme}
                    className={[
                      'px-3 py-1.5 rounded-full text-[13px] font-semibold border',
                      i === 0
                        ? 'bg-brand-teal text-white border-brand-teal'
                        : 'bg-white text-neutral-700 border-neutral-200',
                    ].join(' ')}
                  >
                    {i === 0 && <span className="mr-1">🏆</span>}
                    {theme}
                  </span>
                ))
              ) : (
                <p className="text-[13px] text-neutral-400">No themes detected this week.</p>
              )}
            </div>
          </section>

          {/* Key Observation */}
          <section className="rounded-xl border border-info-500/20 bg-[#EFF6FF] p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Lightbulb size={18} weight="bold" className="text-info-500" aria-hidden="true" />
              <h2 className="font-heading text-[15px] font-semibold text-neutral-800">Key Observation</h2>
            </div>
            <p className="text-[14px] text-neutral-700 leading-relaxed">{report.key_observation}</p>
            {report.fee_spotlight_term && (
            <div className="mt-1 flex items-center gap-2">
                <span className="text-[12px] font-semibold text-info-500 uppercase tracking-wide">Fee Spotlight:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-info-50 text-info-500 text-[12px] font-semibold">
                  {report.fee_spotlight_term}
                </span>
              </div>
            )}
          </section>

          {/* User Quotes */}
          {report.user_quotes.length > 0 && (
            <section className="rounded-xl border border-neutral-100 bg-white p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <ChatCircleText size={18} weight="bold" className="text-brand-saffron" aria-hidden="true" />
                <h2 className="font-heading text-[15px] font-semibold text-neutral-800">
                  What Investors Are Saying
                </h2>
              </div>
              <div className="flex flex-col gap-3">
                {report.user_quotes.slice(0, 5).map((quote, i) => (
                  <blockquote
                    key={i}
                    className="pl-4 border-l-[3px] border-brand-saffron/40 text-[13px] text-neutral-600 italic leading-relaxed"
                  >
                    "{quote}"
                  </blockquote>
                ))}
              </div>
            </section>
          )}

          {/* Product Recommendations */}
          {report.product_recommendations.length > 0 && (
            <section className="rounded-xl border border-neutral-100 bg-white p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} weight="bold" className="text-success-500" aria-hidden="true" />
                <h2 className="font-heading text-[15px] font-semibold text-neutral-800">
                  Product Recommendations
                </h2>
              </div>
              <ul className="flex flex-col gap-3">
                {report.product_recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-success-50 text-success-500 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-[13px] text-neutral-700 leading-relaxed">{rec}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Footer metadata */}
          <div className="text-[11px] text-neutral-400 text-right">
            Report ID #{report.id}
            {report.corpus_refresh_version != null &&
              ` · Corpus v${report.corpus_refresh_version}`}
            {' · '}
            {report.sections_1_4_word_count} words
          </div>
        </div>
      )}
    </div>
  );
}
