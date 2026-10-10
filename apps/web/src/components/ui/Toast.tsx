'use client';

import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';
import { CheckCircle, XCircle, Info, AlertCircle, AlertTriangle, X } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
}

interface ToastContextValue {
  toasts: ToastItem[];
  addToast: (variant: ToastVariant, title: string, description?: string) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const icons: Record<ToastVariant, ReactNode> = {
  success: <CheckCircle className="h-4 w-4 text-success-500" />,
  error: <XCircle className="h-4 w-4 text-danger-500" />,
  info: <Info className="h-4 w-4 text-brand-500" />,
  warning: <AlertCircle className="h-4 w-4 text-warning-500" />,
};

const colors: Record<ToastVariant, string> = {
  success: 'bg-success-50 border-success-200 text-success-700',
  error: 'bg-danger-50 border-danger-200 text-danger-700',
  info: 'bg-brand-50 border-brand-200 text-brand-700',
  warning: 'bg-warning-50 border-warning-200 text-warning-700',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((variant: ToastVariant, title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, variant, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(() => ({ toasts, addToast, dismissToast }), [toasts, addToast, dismissToast]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastViewport() {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-auto" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 rounded-lg border px-4 py-3 shadow-elevated ${colors[toast.variant]}`}
        >
          <div className="flex-shrink-0">{icons[toast.variant]}</div>
          <div className="flex-1 text-sm font-medium">{toast.title}</div>
          {toast.description && <p className="text-xs opacity-80">{toast.description}</p>}
          <button
            className="flex-shrink-0 rounded p-1 hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
            aria-label="Dismiss notification"
            onClick={() => dismissToast(toast.id)}
          >
            <X className="h-4 w-4 opacity-50" />
          </button>
        </div>
      ))}
    </div>
  );
}
