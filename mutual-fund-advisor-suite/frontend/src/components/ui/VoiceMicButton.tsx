import React from 'react';
import { Microphone } from '@phosphor-icons/react';

export type VoiceMicState = 'idle' | 'listening' | 'processing';

// ─────────────────────────────────────────────
// Waveform sub-component (5 animated bars)
// ─────────────────────────────────────────────
export const Waveform: React.FC = () => (
  <div
    className="flex items-end justify-center gap-1 h-8"
    aria-hidden="true"
    role="presentation"
  >
    {[0, 1, 2, 3, 4].map((i) => (
      <span
        key={i}
        className="w-1 rounded-full bg-brand-teal animate-mic-pulse"
        style={{
          // Stagger each bar's animation phase
          animationDelay: `${i * 120}ms`,
          // Different resting heights for natural look
          height: ['60%', '90%', '100%', '80%', '55%'][i],
        }}
      />
    ))}
  </div>
);

// ─────────────────────────────────────────────
// Main VoiceMicButton
// ─────────────────────────────────────────────
const STATE_LABELS: Record<VoiceMicState, string> = {
  idle: 'Tap to speak',
  listening: 'Listening…',
  processing: 'Processing…',
};

export interface VoiceMicButtonProps {
  state: VoiceMicState;
  onToggle: () => void;
  className?: string;
}

export const VoiceMicButton: React.FC<VoiceMicButtonProps> = ({
  state,
  onToggle,
  className = '',
}) => {
  const isListening = state === 'listening';
  const isProcessing = state === 'processing';

  return (
    <div className={['flex flex-col items-center gap-3', className].filter(Boolean).join(' ')}>
      {/* Pulse rings wrapper */}
      <div className="relative flex items-center justify-center">
        {/* Outer pulsing ring — only in listening state */}
        {isListening && (
          <>
            <span
              aria-hidden="true"
              className="absolute w-24 h-24 rounded-full bg-brand-teal/20 animate-mic-pulse"
              style={{ animationDuration: '800ms' }}
            />
            <span
              aria-hidden="true"
              className="absolute w-20 h-20 rounded-full bg-brand-teal/30 animate-mic-pulse"
              style={{ animationDuration: '800ms', animationDelay: '200ms' }}
            />
          </>
        )}

        {/* Main 72px circle button */}
        <button
          type="button"
          onClick={onToggle}
          disabled={isProcessing}
          aria-label={STATE_LABELS[state]}
          aria-pressed={isListening}
          className={[
            'relative z-10 flex items-center justify-center w-[72px] h-[72px] rounded-full',
            'border-2 transition-all duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-teal',
            'disabled:cursor-wait',
            isListening
              ? 'bg-brand-teal border-brand-teal text-white'
              : isProcessing
                ? 'bg-neutral-100 border-neutral-200 text-neutral-400'
                : 'bg-white border-neutral-200 text-brand-teal hover:border-brand-teal hover:bg-teal-50',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <Microphone
            size={28}
            weight={isListening ? 'fill' : 'regular'}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Label */}
      <span className="text-[13px] text-neutral-600">{STATE_LABELS[state]}</span>

      {/* Waveform — visible only when listening */}
      {isListening && <Waveform />}
    </div>
  );
};

export default VoiceMicButton;
