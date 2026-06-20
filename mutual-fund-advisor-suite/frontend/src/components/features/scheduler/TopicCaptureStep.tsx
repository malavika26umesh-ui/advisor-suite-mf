import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Warning } from '@phosphor-icons/react';
import { Button, Card, Input, VoiceMicButton } from '../../ui';
import { useVoiceInput } from '../../../hooks/useVoiceInput';
import { useSchedulerStore } from '../../../stores/schedulerStore';
import { schedulerService } from '../../../services/scheduler.service';
import { useToast } from '../../ui/Toast';

export const TopicCaptureStep: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const {
    voiceTranscript,
    setVoiceTranscript,
    topicCategory,
    setTopicCategory,
    sessionId,
    goNext,
  } = useSchedulerStore();
  const { isListening, transcript, startListening, stopListening, isSupported } = useVoiceInput();
  const [textFallback, setTextFallback] = useState('');
  const [classifying, setClassifying] = useState(false);

  const hasPrefilledTranscript = voiceTranscript.trim().length > 0;

  useEffect(() => {
    if (hasPrefilledTranscript) {
      classify(voiceTranscript);
    } else if (isSupported) {
      startListening();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const classify = async (text: string) => {
    setClassifying(true);
    try {
      const result = await schedulerService.classifyTopic(text, sessionId);
      setTopicCategory(result.topic_category);
    } catch {
      addToast('Could not classify your topic — proceeding to booking.', 'info');
      setTopicCategory('edge');
    } finally {
      setClassifying(false);
    }
  };

  const handleStop = () => {
    stopListening();
    const finalTranscript = transcript.trim();
    if (finalTranscript) {
      setVoiceTranscript(finalTranscript);
      classify(finalTranscript);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textFallback.trim()) return;
    setVoiceTranscript(textFallback.trim());
    classify(textFallback.trim());
  };

  const liveTranscript = hasPrefilledTranscript ? voiceTranscript : transcript;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-heading text-[18px] font-semibold text-neutral-900 text-center">
        Tell me what you'd like to discuss
      </h2>

      {!hasPrefilledTranscript && isSupported && (
        <Card variant="default" className="flex flex-col items-center gap-4 py-8">
          <div className="flex flex-col items-center gap-2 group relative">
            <VoiceMicButton state={isListening ? 'listening' : 'idle'} onToggle={handleStop} />
            {isListening ? (
              <p className="text-[13px] font-medium text-brand-saffron animate-pulse">
                Listening... Tap microphone again to stop.
              </p>
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
        </Card>
      )}

      {!isSupported && !hasPrefilledTranscript && (
        <form onSubmit={handleTextSubmit} className="flex flex-col gap-3">
          <Input
            placeholder="Describe what you'd like to discuss..."
            value={textFallback}
            onChange={(e) => setTextFallback(e.target.value)}
            aria-label="Describe what you'd like to discuss"
          />
          <Button type="submit" variant="primary" disabled={!textFallback.trim()} fullWidth>
            Continue
          </Button>
        </form>
      )}

      {liveTranscript && (
        <Card variant="default" className="bg-neutral-50">
          <p className="text-[12px] font-semibold text-neutral-400 uppercase tracking-wide mb-2">
            Transcript
          </p>
          <p className="text-[14px] text-neutral-800 leading-relaxed">{liveTranscript}</p>
        </Card>
      )}

      {classifying && <p className="text-[13px] text-neutral-500 text-center">Classifying…</p>}

      {topicCategory === 'factual' && (
        <div role="alert" className="rounded-lg border border-warning-500 bg-[#FEF3C7] p-5">
          <div className="flex items-start gap-3 mb-3">
            <Warning size={20} weight="fill" className="shrink-0 mt-0.5 text-warning-500" aria-hidden="true" />
            <p className="text-[14px] font-semibold text-neutral-800">
              This sounds like something our FAQ Centre might answer — try that first?
            </p>
          </div>
          <div className="flex flex-wrap gap-3 ml-8">
            <Button variant="primary" size="sm" onClick={() => navigate('/faq')}>
              Take me to FAQ
            </Button>
            <Button variant="secondary" size="sm" onClick={goNext}>
              I'd still like to speak to an advisor
            </Button>
          </div>
        </div>
      )}

      {topicCategory && topicCategory !== 'factual' && (
        <Button variant="primary" onClick={goNext} fullWidth>
          Continue to booking →
        </Button>
      )}
    </div>
  );
};

export default TopicCaptureStep;
