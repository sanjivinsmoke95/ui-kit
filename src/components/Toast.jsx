import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

const ToastContext = createContext(null);
const icons = {
  success: <CheckCircle2 className="h-4 w-4 text-success" aria-hidden />,
  error: <AlertCircle className="h-4 w-4 text-danger" aria-hidden />,
  info: <Info className="h-4 w-4 text-accent-text" aria-hidden />,
};

/** Wrap the app once, then call `const toast = useToast(); toast({ title, description, type })`. */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const toast = useCallback(
    ({ title, description, type = 'success', duration = 4000 }) => {
      const id = crypto.randomUUID();
      setToasts((t) => [...t, { id, title, description, type }]);
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );
  const value = useMemo(() => toast, [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-20 right-4 z-toast flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6 lg:bottom-6">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              role="status"
              className="pointer-events-auto flex items-start gap-3 rounded-lg border border-line bg-surface p-4 shadow-pop"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
            >
              <span className="mt-0.5">{icons[t.type]}</span>
              <div className="min-w-0 flex-1">
                <p className="t-small font-medium">{t.title}</p>
                {t.description && <p className="t-caption mt-0.5 text-fg-2">{t.description}</p>}
              </div>
              <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss notification" className="rounded-sm p-0.5 text-fg-3 transition hover:text-fg">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
