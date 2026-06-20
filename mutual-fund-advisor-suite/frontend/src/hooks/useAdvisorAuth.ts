import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdvisorAuthStore } from '../stores/advisorAuthStore';
import { advisorService } from '../services/advisor.service';
import { useToast } from '../components/ui/Toast';

const SESSION_DURATION_MS = 30 * 60 * 1000;
const WARNING_THRESHOLD_SECONDS = 5 * 60;

export function useAdvisorAuth() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { token, advisor, sessionTimeRemaining, setSession, setAdvisor, logout: logoutStore, tick } =
    useAdvisorAuthStore();
  const warnedRef = useRef(false);

  // Ticking countdown — only meaningful while a session exists.
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [token, tick]);

  // 5-minute warning + auto-logout at zero.
  useEffect(() => {
    if (!token) return;
    if (sessionTimeRemaining <= WARNING_THRESHOLD_SECONDS && sessionTimeRemaining > 0 && !warnedRef.current) {
      warnedRef.current = true;
      addToast('Your session will expire in 5 minutes.', 'info');
    }
    if (sessionTimeRemaining <= 0) {
      logoutStore();
      navigate('/advisor/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionTimeRemaining, token]);

  // Fetch the advisor's own profile once authenticated.
  useEffect(() => {
    if (token && !advisor) {
      advisorService.getMe().then(setAdvisor).catch(() => {});
    }
  }, [token, advisor, setAdvisor]);

  const requestOTP = async (email: string): Promise<void> => {
    await advisorService.requestOtp(email);
  };

  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    try {
      const newToken = await advisorService.verifyOtp(email, otp);
      setSession(newToken, Date.now() + SESSION_DURATION_MS);
      warnedRef.current = false;
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    logoutStore();
    navigate('/advisor/login');
  };

  return {
    advisor,
    isAuthenticated: !!token,
    requestOTP,
    verifyOTP,
    logout,
    sessionTimeRemaining,
  };
}

export default useAdvisorAuth;
