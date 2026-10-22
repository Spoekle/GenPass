'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Alert } from '@/components/ui/Alert';
import type { AlertItem, AlertType } from '@/types';

interface AlertContextProps {
  addAlert: (message: string, type: AlertType) => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const useAlert = (): AlertContextProps => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const removeAlert = useCallback((id: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const addAlert = useCallback((message: string, type: AlertType) => {
    const id = Date.now() + Math.random();
    setAlerts((prev) => [...prev, { message, type, id }]);
  }, []);

  return (
    <AlertContext.Provider value={{ addAlert }}>
      {children}
      <div 
        aria-live="polite"
        className="fixed top-20 right-4 z-50 space-y-3 flex flex-col items-end pointer-events-none"
      >
        <AnimatePresence>
          {alerts.map((alert) => (
            <Alert
              key={alert.id}
              message={alert.message}
              type={alert.type}
              onClose={() => removeAlert(alert.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </AlertContext.Provider>
  );
};
