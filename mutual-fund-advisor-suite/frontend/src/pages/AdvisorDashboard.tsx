import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChartBar, CheckCircle } from '@phosphor-icons/react';
import { Badge, Button, Card, Modal, Skeleton, TopicPill } from '../components/ui';
import { advisorService } from '../services/advisor.service';
import { api } from '../services/api';
import { useToast } from '../components/ui/Toast';
import type { AdvisorSlotItem, BookingStatus, MeetingQueueItem } from '../types';

const STATUS_FILTERS: { label: string; value: BookingStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Rescheduled', value: 'rescheduled' },
  { label: 'Cancelled', value: 'cancelled' },
];

const TOPIC_OPTIONS = ['all', 'factual', 'educational', 'advice_seeking', 'edge'];

const ROWS_PER_PAGE = 10;

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdvisorDashboard() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [meetings, setMeetings] = useState<MeetingQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pulseTheme, setPulseTheme] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [topicFilter, setTopicFilter] = useState('all');
  const [page, setPage] = useState(1);

  const [completeTarget, setCompleteTarget] = useState<MeetingQueueItem | null>(null);
  const [completing, setCompleting] = useState(false);

  const [rescheduleTarget, setRescheduleTarget] = useState<MeetingQueueItem | null>(null);
  const [openSlots, setOpenSlots] = useState<AdvisorSlotItem[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [rescheduling, setRescheduling] = useState(false);

  const loadMeetings = async () => {
    setLoading(true);
    try {
      const data = await advisorService.getMeetings({
        status: statusFilter === 'all' ? undefined : statusFilter,
        date: dateFilter || undefined,
        topic: topicFilter === 'all' ? undefined : topicFilter,
      });
      setMeetings(data);
    } catch {
      addToast('Could not load the meeting queue.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, dateFilter, topicFilter]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<{ top_themes?: string[] }>('/pulse/current');
        setPulseTheme(res.data?.top_themes?.[0] ?? null);
      } catch {
        setPulseTheme(null);
      }
    })();
  }, []);

  useEffect(() => setPage(1), [statusFilter, dateFilter, topicFilter]);

  const paginated = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    return meetings.slice(start, start + ROWS_PER_PAGE);
  }, [meetings, page]);
  const totalPages = Math.max(1, Math.ceil(meetings.length / ROWS_PER_PAGE));

  const openReschedule = async (meeting: MeetingQueueItem) => {
    setRescheduleTarget(meeting);
    setSelectedSlotId(null);
    setRescheduleReason('');
    try {
      const slots = await advisorService.getSlots();
      setOpenSlots(slots.filter((s) => !s.is_blocked && !s.booking_code));
    } catch {
      setOpenSlots([]);
    }
  };

  const handleRescheduleConfirm = async () => {
    if (!rescheduleTarget || !selectedSlotId) return;
    setRescheduling(true);
    try {
      await advisorService.rescheduleMeeting(rescheduleTarget.id, selectedSlotId, rescheduleReason || 'Advisor-initiated reschedule');
      addToast(`${rescheduleTarget.booking_code} rescheduled.`, 'success');
      setRescheduleTarget(null);
      loadMeetings();
    } catch {
      addToast('Could not reschedule this meeting.', 'error');
    } finally {
      setRescheduling(false);
    }
  };

  const handleCompleteConfirm = async () => {
    if (!completeTarget) return;
    setCompleting(true);
    try {
      await advisorService.completeMeeting(completeTarget.id);
      addToast(`${completeTarget.booking_code} marked complete.`, 'success');
      setCompleteTarget(null);
      loadMeetings();
    } catch {
      addToast('Could not mark this meeting complete.', 'error');
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {pulseTheme && (
        <Card variant="default" className="bg-[#EFF6FF] border border-info-500/20 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ChartBar size={20} weight="bold" className="text-info-500 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-[14px] text-neutral-700">
              This week's top investor theme: <strong>{pulseTheme}</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/advisor/pulse')}
            className="text-[13px] font-semibold text-brand-teal underline hover:text-teal-700 transition-colors shrink-0"
          >
            Read full Pulse →
          </button>
        </Card>
      )}

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <TopicPill
              key={f.value}
              label={f.label}
              selected={statusFilter === f.value}
              onClick={() => setStatusFilter(f.value)}
            />
          ))}
        </div>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          aria-label="Filter by date"
          className="h-9 rounded-lg border border-neutral-200 px-3 text-[13px] text-neutral-700 outline-none focus:border-brand-teal"
        />
        <select
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          aria-label="Filter by topic"
          className="h-9 rounded-lg border border-neutral-200 px-3 text-[13px] text-neutral-700 outline-none focus:border-brand-teal capitalize"
        >
          {TOPIC_OPTIONS.map((t) => (
            <option key={t} value={t} className="capitalize">
              {t === 'all' ? 'All topics' : t.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Meeting queue */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="card" height="56px" />
          ))}
        </div>
      ) : meetings.length === 0 ? (
        <p className="text-[14px] text-neutral-500 text-center py-12">No meetings match these filters.</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-neutral-100">
            <table className="w-full text-left">
              <thead className="bg-neutral-50 text-[12px] font-semibold text-neutral-500 uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3">Booking Code</th>
                  <th className="px-4 py-3">Topic</th>
                  <th className="px-4 py-3">Scheduled Time</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {paginated.map((m) => (
                  <tr key={m.id} className="text-[13px]">
                    <td className="px-4 py-3 font-mono font-semibold text-brand-navy">{m.booking_code}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-source-badge-bg text-source-badge-text text-[11px] font-semibold capitalize">
                        {m.topic_category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{formatDateTime(m.slot_datetime)}</td>
                    <td className="px-4 py-3">
                      <Badge status={m.status} />
                    </td>
                    <td className="px-4 py-3">
                      <MeetingRowActions meeting={m} onComplete={() => setCompleteTarget(m)} onReschedule={() => openReschedule(m)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col gap-3">
            {paginated.map((m) => (
              <Card key={m.id} variant="default" className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-brand-navy text-[14px]">{m.booking_code}</span>
                  <Badge status={m.status} />
                </div>
                <div className="flex items-center justify-between text-[13px] text-neutral-600">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-source-badge-bg text-source-badge-text text-[11px] font-semibold capitalize">
                    {m.topic_category.replace('_', ' ')}
                  </span>
                  <span>{formatDateTime(m.slot_datetime)}</span>
                </div>
                <MeetingRowActions meeting={m} onComplete={() => setCompleteTarget(m)} onReschedule={() => openReschedule(m)} stacked />
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 text-[13px]">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-neutral-200 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-neutral-500">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-neutral-200 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={!!completeTarget}
        onClose={() => setCompleteTarget(null)}
        title="Mark this meeting complete?"
      >
        <p className="text-[14px] text-neutral-600 mb-5">
          This will mark <strong>{completeTarget?.booking_code}</strong> as completed and send the
          investor a feedback request email.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setCompleteTarget(null)} fullWidth>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCompleteConfirm} loading={completing} fullWidth>
            <CheckCircle size={16} weight="bold" aria-hidden="true" />
            Yes, mark complete
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={!!rescheduleTarget}
        onClose={() => setRescheduleTarget(null)}
        title={`Reschedule ${rescheduleTarget?.booking_code ?? ''}`}
      >
        {openSlots.length === 0 ? (
          <p className="text-[14px] text-neutral-500 mb-5">No open slots available to reschedule into.</p>
        ) : (
          <div role="radiogroup" aria-label="Available slots" className="flex flex-col gap-2 mb-4 max-h-[240px] overflow-y-auto">
            {openSlots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                role="radio"
                aria-checked={selectedSlotId === slot.id}
                onClick={() => setSelectedSlotId(slot.id)}
                className={[
                  'text-left px-4 py-2.5 rounded-lg border text-[13px]',
                  selectedSlotId === slot.id
                    ? 'border-brand-teal bg-[#F0FAFB]'
                    : 'border-neutral-200 hover:border-neutral-300',
                ].join(' ')}
              >
                {formatDateTime(slot.start_time)}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setRescheduleTarget(null)} fullWidth>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleRescheduleConfirm}
            loading={rescheduling}
            disabled={!selectedSlotId}
            fullWidth
          >
            Confirm new time
          </Button>
        </div>
      </Modal>
    </div>
  );
}

interface MeetingRowActionsProps {
  meeting: MeetingQueueItem;
  onComplete: () => void;
  onReschedule: () => void;
  stacked?: boolean;
}

const MeetingRowActions: React.FC<MeetingRowActionsProps> = ({ meeting, onComplete, onReschedule, stacked }) => {
  const navigate = useNavigate();
  const canComplete = meeting.status === 'confirmed' || meeting.status === 'rescheduled';
  const canReschedule = meeting.status === 'confirmed' || meeting.status === 'rescheduled';

  return (
    <div className={['flex gap-3', stacked ? 'flex-col' : 'items-center'].join(' ')}>
      <button
        type="button"
        onClick={() => navigate(`/advisor/brief/${meeting.id}`)}
        className="text-[13px] font-semibold text-brand-teal underline hover:text-teal-700 transition-colors text-left"
      >
        View Brief
      </button>
      {canReschedule && (
        <button
          type="button"
          onClick={onReschedule}
          className="text-[13px] font-medium text-neutral-500 underline hover:text-neutral-700 transition-colors text-left"
        >
          Reschedule
        </button>
      )}
      {canComplete && (
        <button
          type="button"
          onClick={onComplete}
          className="text-[13px] font-semibold text-success-500 border border-success-500 rounded-md px-2.5 py-1 hover:bg-success-50 transition-colors"
        >
          Complete
        </button>
      )}
    </div>
  );
};
