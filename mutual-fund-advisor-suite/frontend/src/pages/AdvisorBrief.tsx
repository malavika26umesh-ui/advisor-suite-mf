import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowSquareOut, Warning } from '@phosphor-icons/react';
import { Badge, Button, Card, Skeleton, TopicPill } from '../components/ui';
import { advisorService } from '../services/advisor.service';
import { useToast } from '../components/ui/Toast';
import type { MeetingQueueItem, PreMeetingBrief } from '../types';

const SOON_THRESHOLD_MS = 30 * 60 * 1000;

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString('en-IN', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdvisorBrief() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [brief, setBrief] = useState<PreMeetingBrief | null>(null);
  const [meeting, setMeeting] = useState<MeetingQueueItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const [briefData, allMeetings] = await Promise.all([
          advisorService.getBrief(Number(id)),
          advisorService.getMeetings(),
        ]);
        setBrief(briefData);
        setMeeting(allMeetings.find((m) => m.id === Number(id)) ?? null);
      } catch {
        addToast('Could not load this brief.', 'error');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleComplete = async () => {
    if (!id) return;
    setCompleting(true);
    try {
      await advisorService.completeMeeting(Number(id));
      addToast('Meeting marked complete.', 'success');
      navigate('/advisor');
    } catch {
      addToast('Could not mark this meeting complete.', 'error');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 max-w-[720px]">
        <Skeleton variant="text" width="240px" height="16px" />
        <Skeleton variant="card" height="120px" />
        <Skeleton variant="card" height="280px" />
      </div>
    );
  }

  if (!brief) {
    return <p className="text-[14px] text-neutral-500">This brief could not be found.</p>;
  }

  const startsSoon =
    meeting && new Date(meeting.slot_datetime).getTime() - Date.now() <= SOON_THRESHOLD_MS &&
    new Date(meeting.slot_datetime).getTime() - Date.now() > -SOON_THRESHOLD_MS;

  return (
    <div className="max-w-[720px] flex flex-col gap-6">
      <nav aria-label="Breadcrumb" className="text-[13px] text-neutral-500">
        <Link to="/advisor" className="hover:text-brand-teal transition-colors">
          Meeting Queue
        </Link>
        <span className="mx-1.5">›</span>
        <span className="text-neutral-700 font-medium">Pre-Meeting Brief: {brief.booking_code}</span>
      </nav>

      <Card variant="default" className="flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="font-mono text-[18px] font-bold text-brand-navy">{brief.booking_code}</span>
          {meeting && <Badge status={meeting.status} />}
        </div>
        {meeting && (
          <p className="text-[14px] text-neutral-600">{formatDateTime(meeting.slot_datetime)}</p>
        )}
        {startsSoon && (
          <div className="flex items-center gap-2 rounded-lg bg-[#FFF8E1] border border-disclaimer-border px-3 py-2">
            <Warning size={15} weight="fill" className="text-disclaimer-border shrink-0" aria-hidden="true" />
            <p className="text-[13px] text-neutral-700">Meeting starts soon</p>
          </div>
        )}
      </Card>

      <Card variant="default" className="flex flex-col">
        <BriefSection label="Topic Category">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-source-badge-bg text-source-badge-text text-[13px] font-semibold capitalize">
            {brief.topic_category.replace('_', ' ')}
          </span>
        </BriefSection>

        <BriefSection label="Investor's Context">
          {brief.investor_context ? (
            <div className="bg-neutral-50 rounded-xl px-4 py-3 max-w-[480px]">
              <p className="text-[14px] text-neutral-700 italic leading-relaxed">"{brief.investor_context}"</p>
            </div>
          ) : (
            <p className="text-[13px] text-neutral-400">Not shared</p>
          )}
        </BriefSection>

        <BriefSection label="FAQ Queries from Session">
          {brief.session_faq_queries.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {brief.session_faq_queries.map((q, idx) => (
                <TopicPill key={`${q}-${idx}`} label={q} selected={false} onClick={() => {}} />
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-neutral-400">None recorded</p>
          )}
        </BriefSection>

        <BriefSection label="Pulse Top Theme">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[14px] text-neutral-700">{brief.pulse_top_theme ?? 'Not yet available'}</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 text-[11px] font-medium">
              Common context — not investor-specific
            </span>
          </div>
        </BriefSection>

        <BriefSection label="Relevant Articles" last>
          {brief.relevant_education_articles.length > 0 ? (
            <div className="flex flex-col gap-2">
              {brief.relevant_education_articles.map((article) => (
                <Link
                  key={article.slug}
                  to={`/education/${article.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-[14px] font-medium text-brand-teal hover:underline"
                >
                  {article.title}
                  <ArrowSquareOut size={13} aria-hidden="true" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-neutral-400">No matching articles</p>
          )}
        </BriefSection>
      </Card>

      <div className="rounded-lg bg-neutral-100 px-4 py-3">
        <p className="text-[12px] text-neutral-500 leading-relaxed">
          This brief does not contain: PAN, Aadhaar, folio number, portfolio details, or
          AI-generated advisory recommendations.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="primary" onClick={handleComplete} loading={completing}>
          Mark as Complete
        </Button>
        <Button variant="secondary" onClick={() => navigate('/advisor')}>
          Reschedule
        </Button>
        <Button variant="ghost" onClick={() => navigate('/advisor')}>
          Back to Queue
        </Button>
      </div>
    </div>
  );
}

interface BriefSectionProps {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}

const BriefSection: React.FC<BriefSectionProps> = ({ label, children, last }) => (
  <div className={['py-5', last ? '' : 'border-b border-[#F3F4F6]'].join(' ')}>
    <p className="text-[12px] font-semibold text-neutral-400 uppercase tracking-wide mb-2">{label}</p>
    {children}
  </div>
);
