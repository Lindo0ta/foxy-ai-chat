// src/app/components/FoxyAlert.tsx
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface FoxyAlertProps {
  message: string;
  duration?: number; // en segundos
  onClose?: () => void;
}

export const FoxyAlert = ({ message, duration = 15, onClose }: FoxyAlertProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!isVisible) return;

    const interval = 100; // ms
    const totalSteps = (duration * 1000) / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const remaining = 100 - (currentStep / totalSteps) * 100;
      setProgress(Math.max(0, remaining));

      if (currentStep >= totalSteps) {
        setIsVisible(false);
        clearInterval(timer);
        onClose?.();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [duration, isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full md:max-w-md animate-slide-up">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Barra de progreso */}
        <div className="h-1 bg-gray-200 dark:bg-gray-700">
          <div 
            className="h-full bg-gradient-to-r from-foxy-orange to-foxy-red transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-4 flex items-start gap-3">
          {/* Logo Foxy */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-foxy-orange to-foxy-red flex items-center justify-center text-white font-bold text-lg shadow-lg">
            🦊
          </div>

          {/* Mensaje */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
              {message}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {Math.ceil(progress / (100 / duration))}s restantes
            </p>
          </div>

          {/* Botón cerrar */}
          <button
            onClick={() => {
              setIsVisible(false);
              onClose?.();
            }}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Cerrar alerta"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};