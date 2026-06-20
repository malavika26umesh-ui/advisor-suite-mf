import React, { useEffect, useState } from 'react';
import { ChatCircleText, Lightbulb, LockSimple } from '@phosphor-icons/react';
import { Button, Card, Input, VoiceMicButton } from '../../ui';
import { useVoiceInput } from '../../../hooks/useVoiceInput';
import { useSchedulerStore } from '../../../stores/schedulerStore';
import { api } from '../../../services/api';

export const GreetingStep: React.FC = () => {
  const { pulseTheme, setPulseTheme, setVoiceTranscript, goNext } = useSchedulerStore();
  const { isListening, transcript, startListening, stopListening, error, isSupported } =
    useVoiceInput();
  const [textFallback, setTextFallback] = useState('');

  useEffect(() => {
    const greetingText = "Hi! I can help you book a call with a SEBI-registered advisor. What would you like to talk about?";
    const msg = new SpeechSynthesisUtterance(greetingText);
    window.speechSynthesis.speak(msg);

    return () => window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<{ theme: string }>('/pulse/current-theme');
        setPulseTheme(res.data?.theme ?? null);
      } catch {
        // Sprint 15/16 endpoint may not exist yet — generic greeting is fine.
        setPulseTheme(null);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
      if (transcript.trim()) {
        setVoiceTranscript(transcript.trim());
        goNext();
      }
    } else {
      window.speechSynthesis.cancel();
      startListening();
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textFallback.trim()) return;
    setVoiceTranscript(textFallback.trim());
    goNext();
  };

  return (
    <div className="flex flex-col gap-6">
      {pulseTheme && (
        <div className="rounded-lg bg-[#EFF6FF] border border-info-500/30 px-4 py-3 flex items-start gap-2">
          <Lightbulb size={16} weight="fill" className="text-info-500 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-[13px] text-neutral-700">
            This week, many investors are asking about: <strong>{pulseTheme}</strong>
          </p>
        </div>
      )}

      <Card variant="default" className="flex flex-col items-center gap-5 py-10">
        <div className="w-16 h-16 rounded-full bg-brand-navy flex items-center justify-center">
          <ChatCircleText size={28} weight="fill" className="text-white" aria-hidden="true" />
        </div>

        <div className="relative max-w-[420px] bg-neutral-50 rounded-xl px-5 py-4">
          <p className="text-[15px] text-neutral-800 text-center leading-relaxed">
            Hi! I can help you book a call with a SEBI-registered advisor. What would you like to
            talk about?
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 group relative">
          <VoiceMicButton
            state={isListening ? 'listening' : 'idle'}
            onToggle={handleMicToggle}
          />
          {isListening ? (
             <div className="flex flex-col items-center gap-2">
               <p className="text-[13px] font-medium text-brand-saffron animate-pulse">
                 Listening... Tap microphone again to stop.
               </p>
               {transcript && (
                 <p className="text-[14px] text-neutral-600 text-center italic mt-2 px-4">
                   "{transcript}"
                 </p>
               )}
             </div>
          ) : (
            <>
              <p className="text-[13px] text-neutral-500">Tap to Speak</p>
              <div className="absolute top-full mt-2 hidden group-hover:block w-max max-w-[220px] bg-neutral-800 text-white text-[12px] px-3 py-2 rounded-md z-10 text-center shadow-lg">
                Click the microphone to start speaking. Click it again when you're finished.
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-800 rotate-45" />
              </div>
            </>
          )}
        </div>

        {!isSupported && (
          <p className="text-[12px] text-neutral-400 text-center max-w-[320px]">
            Voice input isn't supported in this browser — please use the text box below.
          </p>
        )}
        {error && <p role="alert" className="text-[12px] text-error-500">{error}</p>}

        <div className="w-full flex items-center gap-3 max-w-[420px]">
          <div className="flex-1 h-px bg-neutral-200" />
          <span className="text-[12px] text-neutral-400">or</span>
          <div className="flex-1 h-px bg-neutral-200" />
        </div>

        <form onSubmit={handleTextSubmit} className="w-full max-w-[420px] flex flex-col gap-3">
          <Input
            placeholder="Type what you'd like to discuss..."
            value={textFallback}
            onChange={(e) => setTextFallback(e.target.value)}
            aria-label="Describe what you'd like to discuss"
          />
          <Button type="submit" variant="primary" disabled={!textFallback.trim()} fullWidth>
            Continue
          </Button>
        </form>
      </Card>

      <div className="flex items-start gap-2 px-1">
        <LockSimple size={14} className="text-neutral-400 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-[12px] text-neutral-500">
          Please don't share account numbers, PAN, Aadhaar, or portfolio details here.
        </p>
      </div>
    </div>
  );
};

export default GreetingStep;
