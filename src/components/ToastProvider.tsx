import { AnimatePresence, m } from 'framer-motion';
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { Check, Info, X, XOctagon } from 'lucide-react';
import { motionSprings } from '../motion/tokens';

type ToastKind = 'success' | 'error' | 'info';

interface ToastInput {
  type: ToastKind;
  title: string;
  message: string;
}

interface ToastRecord extends ToastInput {
  id: number;
}

interface ToastContextValue {
  showToast: (toast: ToastInput) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);
let nextToastId = 0;

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  const showToast = (toast: ToastInput) => {
    const record = { ...toast, id: ++nextToastId };
    setToasts((current) => [...current.slice(-2), record]);
  };

  useEffect(() => {
    const timers = toasts.map((toast) =>
      window.setTimeout(
        () => setToasts((current) => current.filter((item) => item.id !== toast.id)),
        4200,
      ),
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [toasts]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-stack" aria-label="Notifications" aria-live="polite">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const Icon =
              toast.type === 'success' ? Check : toast.type === 'error' ? XOctagon : Info;
            return (
              <m.div
                className={`toast toast--${toast.type}`}
                key={toast.id}
                layout
                role={toast.type === 'error' ? 'alert' : 'status'}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ ...motionSprings.snappy, layout: motionSprings.snappy }}
              >
                <Icon aria-hidden="true" size={18} />
                <div>
                  <p className="toast-title">{toast.title}</p>
                  <p className="toast-message">{toast.message}</p>
                </div>
                <button
                  aria-label="Dismiss notification"
                  className="toast-dismiss"
                  onClick={() =>
                    setToasts((current) => current.filter((item) => item.id !== toast.id))
                  }
                  type="button"
                >
                  <X aria-hidden="true" size={16} />
                </button>
              </m.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue['showToast'] {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context.showToast;
}
