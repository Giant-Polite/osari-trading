// /src/components/PremiumToast.tsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, AlertCircle, ShoppingBag } from "lucide-react";

export interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: "success" | "error" | "info";
  duration?: number;
  onClose: (id: string) => void;
}

export const PremiumToast = ({
  id,
  title,
  description,
  variant = "success",
  duration = 3000,
  onClose,
}: ToastProps) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
    }, 50);

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [id, duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(id), 300);
  };

  const variants = {
    success: {
      gradient: "from-orange-500 via-amber-500 to-orange-500",
      bgGradient: "from-orange-50 to-amber-50",
      icon: ShoppingBag,
      iconBg: "from-orange-500 to-amber-500",
    },
    error: {
      gradient: "from-red-500 via-pink-500 to-red-500",
      bgGradient: "from-red-50 to-pink-50",
      icon: AlertCircle,
      iconBg: "from-red-500 to-pink-500",
    },
    info: {
      gradient: "from-blue-500 via-cyan-500 to-blue-500",
      bgGradient: "from-blue-50 to-cyan-50",
      icon: CheckCircle,
      iconBg: "from-blue-500 to-cyan-500",
    },
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ x: 400, opacity: 0, scale: 0.8 }}
      animate={
        isExiting ? { x: 400, opacity: 0, scale: 0.8 } : { x: 0, opacity: 1, scale: 1 }
      }
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className="relative group"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-r ${config.gradient} rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity animate-toast-glow`}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl border border-white/50 overflow-hidden min-w-[320px] max-w-md">
        <div className={`h-1 bg-gradient-to-r ${config.gradient}`} />

        <div className={`bg-gradient-to-br ${config.bgGradient} p-4`}>
          <div className="flex items-start gap-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.1,
              }}
              className={`flex-shrink-0 p-2.5 bg-gradient-to-br ${config.iconBg} rounded-xl shadow-lg`}
            >
              <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
            </motion.div>

            <div className="flex-1 min-w-0 pt-0.5">
              <motion.h4
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-gray-900 mb-1 pr-6"
                style={{ fontWeight: 700, fontSize: "0.9375rem" }}
              >
                {title}
              </motion.h4>
              {description && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm text-gray-600 leading-relaxed"
                >
                  {description}
                </motion.p>
              )}
            </div>

            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="flex-shrink-0 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        <div className="h-1 bg-gray-200/50 overflow-hidden">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: `${progress}%` }}
            className={`h-full bg-gradient-to-r ${config.gradient}`}
            style={{ transition: "width 0.05s linear" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}

export const ToastContainer = ({ toasts, onClose }: ToastContainerProps) => {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <PremiumToast {...toast} onClose={onClose} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};
