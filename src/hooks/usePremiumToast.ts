// /src/hooks/usePremiumToast.ts
import { useState, useCallback } from "react";
import { ToastProps } from "@/components/PremiumToast";

type ShowToastInput = Omit<ToastProps, "onClose" | "id"> & { id?: string };

export const usePremiumToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((toast: ShowToastInput) => {
    const id = toast.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const toastWithId: ToastProps = {
      id,
      title: toast.title,
      description: toast.description,
      variant: toast.variant,
      duration: toast.duration ?? 3000,
      onClose: removeToast,
    };
    setToasts((prev) => [...prev, toastWithId]);
    return id;
  }, [removeToast]);

  return { toasts, showToast, removeToast };
};

export type { ToastProps };
