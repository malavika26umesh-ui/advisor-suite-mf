import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChartBar, ClockCounterClockwise, FileText, ShieldCheck } from '@phosphor-icons/react';
import { Button, Input } from '../components/ui';
import { useAdvisorAuth } from '../hooks/useAdvisorAuth';
import { useToast } from '../components/ui/Toast';

const VALUE_PROPS = [
  {
    icon: <FileText size={20} weight="bold" className="text-white" aria-hidden="true" />,
    text: 'Pre-meeting briefs with zero PII — never PAN, Aadhaar, or account details',
  },
  {
    icon: <ClockCounterClockwise size={20} weight="bold" className="text-white" aria-hidden="true" />,
    text: 'Your full meeting queue and availability calendar in one place',
  },
  {
    icon: <ShieldCheck size={20} weight="bold" className="text-white" aria-hidden="true" />,
    text: 'Every investor query routed through SEBI-compliant triage',
  },
];

const RESEND_COOLDOWN_SECONDS = 30;

export default function AdvisorLogin() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { requestOTP, verifyOTP, isAuthenticated } = useAdvisorAuth();

  const [phase, setPhase] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (isAuthenticated) navigate('/advisor');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await requestOTP(email.trim());
      setPhase('otp');
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      addToast('OTP sent to your registered email.', 'success');
    } catch (err: any) {
      addToast(err.response?.data?.detail || 'Could not send OTP. Please check your email.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    try {
      await requestOTP(email.trim());
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      addToast('OTP resent.', 'success');
    } catch {
      addToast('Could not resend OTP.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim().length !== 6) return;
    setLoading(true);
    try {
      const success = await verifyOTP(email.trim(), otp.trim());
      if (success) {
        navigate('/advisor');
      } else {
        addToast('Invalid or expired OTP. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-navy flex-col justify-between p-12">
        <div className="flex items-center gap-2">
          <ChartBar size={28} weight="bold" className="text-brand-saffron" aria-hidden="true" />
          <span className="font-heading text-[20px] font-bold text-white">
            AdvisorSuite<span className="text-brand-saffron"> MF</span>
          </span>
        </div>

        <div className="flex flex-col gap-6">
          {VALUE_PROPS.map((item) => (
            <div key={item.text} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <p className="text-[15px] text-white/90 leading-relaxed pt-1.5">{item.text}</p>
            </div>
          ))}
        </div>

        <p className="text-[12px] text-white/50">For SEBI-registered Investment Advisors only.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-[400px] flex flex-col gap-6">
          <div className="flex items-center gap-2 lg:hidden self-center mb-2">
            <ChartBar size={24} weight="bold" className="text-brand-saffron" aria-hidden="true" />
            <span className="font-heading text-[18px] font-bold text-neutral-900">
              AdvisorSuite<span className="text-brand-saffron"> MF</span>
            </span>
          </div>

          <h1 className="font-heading text-[26px] font-bold text-neutral-900 text-center">
            Advisor Log In
          </h1>

          {phase === 'email' && (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
              <Input
                label="Registered email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="advisor@advisorsuite.mf"
                autoComplete="email"
                required
              />
              <Button type="submit" variant="primary" loading={loading} disabled={!email.trim()} fullWidth>
                Send OTP
              </Button>
            </form>
          )}

          {phase === 'otp' && (
            <form onSubmit={handleVerify} className="flex flex-col gap-4">
              <Input
                label={`6-digit code sent to ${email}`}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="••••••"
                inputMode="numeric"
                maxLength={6}
                className="font-mono text-center text-[22px] tracking-[0.5em]"
                autoFocus
                required
              />
              <Button type="submit" variant="primary" loading={loading} disabled={otp.length !== 6} fullWidth>
                Log In
              </Button>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="self-center text-[13px] font-medium text-brand-teal underline hover:text-teal-700 disabled:text-neutral-400 disabled:no-underline transition-colors"
              >
                {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
              </button>
            </form>
          )}

          <p className="text-[12px] text-neutral-400 text-center">
            Sessions time out after 30 minutes of inactivity for your security.
          </p>
        </div>
      </div>
    </div>
  );
}
