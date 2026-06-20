import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { CheckCircle, XCircle, Info, X } from '@phosphor-icons/react';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  variant: ToastVariant;
  action?: { label: string; onClick: () => void };
}

interface ToastContextValue {
  addToast: (message: string, variant?: ToastVariant, action?: { label: string; onClick: () => void }) => void;
}

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | null>(null);

// ─────────────────────────────────────────────
// useToast hook
// ─────────────────────────────────────────────
export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used inside <ToastProvider>');
  }
  return ctx;
};

// ─────────────────────────────────────────────
// Variant config
// ─────────────────────────────────────────────
const VARIANT_CONFIG: Record<
  ToastVariant,
  { icon: React.ReactNode; classes: string; label: string }
> = {
  success: {
    icon: <CheckCircle size={18} weight="fill" aria-hidden="true" />,
    classes: 'bg-success-50 border-success-500 text-success-500',
    label: 'Success',
  },
  error: {
    icon: <XCircle size={18} weight="fill" aria-hidden="true" />,
    classes: 'bg-error-50 border-error-500 text-error-500',
    label: 'Error',
  },
  info: {
    icon: <Info size={18} weight="fill" aria-hidden="true" />,
    classes: 'bg-info-50 border-info-500 text-info-500',
    label: 'Info',
  },
};

// ─────────────────────────────────────────────
// Single Toast item
// ─────────────────────────────────────────────
interface ToastItemProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const config = VARIANT_CONFIG[toast.variant];
  const [visible, setVisible] = useState(false);

  // Slide-up entrance
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={[
        'flex items-start gap-3 px-4 py-3 rounded-lg border shadow-level-2',
        'min-w-[280px] max-w-sm',
        'transition-all duration-200',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        config.classes,
      ].join(' ')}
    >
      <span className="shrink-0 mt-0.5">{config.icon}</span>
      <div className="flex-1 flex flex-col gap-1">
        <p className="text-[14px] font-medium">{toast.message}</p>
        {toast.action && (
          <button
            type="button"
            onClick={() => {
              toast.action!.onClick();
              onDismiss(toast.id);
            }}
            className="text-[13px] font-bold text-left hover:underline w-fit opacity-90 hover:opacity-100"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current rounded"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────
// ToastProvider + container
// ─────────────────────────────────────────────
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const t = timers.current.get(id);
    if (t) {
      clearTimeout(t);
      timers.current.delete(id);
    }
  }, []);

  const addToast = useCallback(
    (message: string, variant: ToastVariant = 'info', action?: { label: string; onClick: () => void }) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { id, message, variant, action }]);
      const timer = setTimeout(() => dismiss(id), 4000);
      timers.current.set(id, timer);
    },
    [dismiss],
  );

  // Cleanup on unmount
  useEffect(() => {
    const timerMap = timers.current;
    return () => {
      timerMap.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Portal-like fixed container */}
      <div
        aria-label="Notifications"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 items-end"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Named export for the Toast component (in case it's needed standalone)
export const Toast = ToastItem;

export default ToastProvider;
