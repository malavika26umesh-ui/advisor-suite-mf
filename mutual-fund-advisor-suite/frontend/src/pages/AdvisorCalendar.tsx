import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from '@phosphor-icons/react';
import { Button, Modal, Skeleton } from '../components/ui';
import { advisorService } from '../services/advisor.service';
import { useToast } from '../components/ui/Toast';
import type { AdvisorSlotItem, MeetingQueueItem } from '../types';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const ALL_DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Returns an ISO 8601 datetime string in *local* time without a timezone
 * suffix (e.g. "2026-06-22T10:00:00").  We deliberately avoid
 * Date.toISOString() because that converts to UTC, which causes the backend
 * (SQLite, naive datetimes) to store the wrong time, and the frontend then
 * re-renders the slot at the wrong hour in the calendar grid.
 */
function toLocalISOString(d: Date): string {
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}:00`
  );
}

function getWeekDates(): Date[] {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sun
  // On a weekend, "this week's" Mon–Fri is already in the past — show the
  // upcoming work week instead, so the calendar isn't showing a dead view.
  let mondayOffset: number;
  if (dayOfWeek === 0) mondayOffset = 1;
  else if (dayOfWeek === 6) mondayOffset = 2;
  else mondayOffset = 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function getTimeSlots(): string[] {
  const slots: string[] = [];
  for (let hour = 8; hour < 19; hour++) {
    slots.push(`${pad(hour)}:00`);
    slots.push(`${pad(hour)}:30`);
  }
  return slots;
}

interface CellInfo {
  slot: AdvisorSlotItem;
  meetingId?: number;
}

export default function AdvisorCalendar() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [slots, setSlots] = useState<AdvisorSlotItem[]>([]);
  const [meetings, setMeetings] = useState<MeetingQueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [fromTime, setFromTime] = useState('10:00');
  const [toTime, setToTime] = useState('10:30');
  const [isRecurring, setIsRecurring] = useState(false);
  const [saving, setSaving] = useState(false);

  const weekDates = useMemo(() => getWeekDates(), []);
  const timeSlots = useMemo(() => getTimeSlots(), []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [slotData, meetingData] = await Promise.all([
        advisorService.getSlots(),
        advisorService.getMeetings(),
      ]);
      setSlots(slotData);
      setMeetings(meetingData);
    } catch {
      addToast('Could not load your calendar.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cellMap = useMemo(() => {
    const map = new Map<string, CellInfo>();
    const meetingByCode = new Map(meetings.map((m) => [m.booking_code, m.id]));
    for (const slot of slots) {
      const start = new Date(slot.start_time);
      const key = `${dateKey(start)}T${pad(start.getHours())}:${pad(start.getMinutes())}`;
      map.set(key, {
        slot,
        meetingId: slot.booking_code ? meetingByCode.get(slot.booking_code) : undefined,
      });
    }
    return map;
  }, [slots, meetings]);

  const handleAddSlot = async () => {
    if (selectedDays.length === 0 || !fromTime || !toTime) return;

    const [fh, fm] = fromTime.split(':').map(Number);
    const [th, tm] = toTime.split(':').map(Number);
    if (th * 60 + tm <= fh * 60 + fm) {
      addToast('End time must be after start time.', 'error');
      return;
    }

    setSaving(true);
    try {
      for (const dayLabel of selectedDays) {
        const dayIndex = ALL_DAY_LABELS.indexOf(dayLabel);
        const base = new Date(weekDates[0]);
        base.setDate(weekDates[0].getDate() + dayIndex);

        const start = new Date(base);
        start.setHours(fh, fm, 0, 0);
        const end = new Date(base);
        end.setHours(th, tm, 0, 0);

        // Use local-time ISO strings (no 'Z' suffix) so the backend stores
        // the exact local hour rather than the UTC-converted equivalent.
        await advisorService.createSlot({
          start_time: toLocalISOString(start),
          end_time: toLocalISOString(end),
          is_recurring: isRecurring,
        });
      }
      addToast('Availability added.', 'success');
      setModalOpen(false);
      setSelectedDays([]);
      loadData();
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      addToast(detail ? `Could not add time block: ${detail}` : 'Could not add this time block. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4 text-[12px]">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm border-l-[3px] border-brand-teal bg-[#F0FAFB]" />
            Open
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm border-l-[3px] border-brand-navy bg-[#EFF6FF]" />
            Booked
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[repeating-linear-gradient(45deg,#e5e7eb,#e5e7eb_4px,#f3f4f6_4px,#f3f4f6_8px)]" />
            Blocked
          </span>
        </div>
        <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
          <Plus size={15} weight="bold" aria-hidden="true" />
          Add time block
        </Button>
      </div>

      {loading ? (
        <Skeleton variant="card" height="500px" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-100">
          <div className="min-w-[640px]">
            {/* Day header */}
            <div className="grid grid-cols-[64px_repeat(5,1fr)] border-b border-neutral-100 bg-neutral-50">
              <div />
              {weekDates.map((d, i) => (
                <div key={dateKey(d)} className="px-2 py-2 text-center">
                  <p className="text-[12px] font-semibold text-neutral-700">{DAY_LABELS[i]}</p>
                  <p className="text-[11px] text-neutral-400">
                    {d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
              ))}
            </div>

            {/* Time rows */}
            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-[64px_repeat(5,1fr)] border-b border-neutral-50">
                <div className="px-2 py-2 text-[11px] text-neutral-400 text-right">{time}</div>
                {weekDates.map((d) => {
                  const key = `${dateKey(d)}T${time}`;
                  const cell = cellMap.get(key);
                  if (!cell) {
                    return <div key={key} className="border-l border-neutral-50 min-h-[36px]" />;
                  }
                  if (cell.slot.is_blocked) {
                    return (
                      <div
                        key={key}
                        className="border-l border-neutral-100 min-h-[36px] flex items-center justify-center text-[11px] text-neutral-500 bg-[repeating-linear-gradient(45deg,#e5e7eb,#e5e7eb_4px,#f3f4f6_4px,#f3f4f6_8px)]"
                      >
                        Blocked
                      </div>
                    );
                  }
                  if (cell.slot.booking_code) {
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => cell.meetingId && navigate(`/advisor/brief/${cell.meetingId}`)}
                        className="border-l-[3px] border-brand-navy bg-[#EFF6FF] min-h-[36px] flex items-center justify-center text-[11px] font-mono font-semibold text-brand-navy hover:bg-[#E0F0FF] transition-colors"
                      >
                        {cell.slot.booking_code}
                      </button>
                    );
                  }
                  return (
                    <div
                      key={key}
                      className="border-l-[3px] border-brand-teal bg-[#F0FAFB] min-h-[36px] flex items-center justify-center text-[11px] font-medium text-brand-teal"
                    >
                      Open
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add time block">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-[13px] font-medium text-neutral-700 mb-2">Days</p>
            <div className="flex flex-wrap gap-2">
              {ALL_DAY_LABELS.map((day) => {
                const selected = selectedDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() =>
                      setSelectedDays((prev) =>
                        selected ? prev.filter((d) => d !== day) : [...prev, day]
                      )
                    }
                    className={[
                      'w-10 h-10 rounded-full text-[12px] font-semibold border',
                      selected
                        ? 'bg-brand-navy text-white border-brand-navy'
                        : 'bg-white text-neutral-600 border-neutral-200',
                    ].join(' ')}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-[13px] font-medium text-neutral-700" htmlFor="from-time">
                From
              </label>
              <input
                id="from-time"
                type="time"
                value={fromTime}
                onChange={(e) => setFromTime(e.target.value)}
                className="mt-1.5 w-full h-11 rounded-lg border border-neutral-200 px-3 text-[14px] outline-none focus:border-brand-teal"
              />
            </div>
            <div className="flex-1">
              <label className="text-[13px] font-medium text-neutral-700" htmlFor="to-time">
                To
              </label>
              <input
                id="to-time"
                type="time"
                value={toTime}
                onChange={(e) => setToTime(e.target.value)}
                className="mt-1.5 w-full h-11 rounded-lg border border-neutral-200 px-3 text-[14px] outline-none focus:border-brand-teal"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-[13px] text-neutral-700">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="w-4 h-4 accent-brand-teal"
            />
            Repeat weekly
          </label>

          <div className="flex gap-3 mt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)} fullWidth>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddSlot}
              loading={saving}
              disabled={selectedDays.length === 0}
              fullWidth
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
