'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { AlertType } from '@/types';

interface AlertProps {
  message: string;
  type: AlertType;
  onClose: () => void;
}

export const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getStyles = () => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-red-500/20 backdrop-blur-md',
          border: 'border-red-500/50',
          text: 'text-red-200',
          icon: '✕',
          shadow: 'shadow-red-500/20'
        };
      case 'success':
        return {
          bg: 'bg-green-500/20 backdrop-blur-md',
          border: 'border-green-500/50',
          text: 'text-green-200',
          icon: '✓',
          shadow: 'shadow-green-500/20'
        };
      case 'alert':
      default:
        return {
          bg: 'bg-indigo-500/20 backdrop-blur-md',
          border: 'border-indigo-500/50',
          text: 'text-indigo-200',
          icon: 'ℹ',
          shadow: 'shadow-indigo-500/20'
        };
    }
  };

  const styles = getStyles();

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 30, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg border shadow-lg ${styles.bg} ${styles.border} ${styles.shadow} max-w-md pointer-events-auto`}
    >
      <span className="font-bold text-lg select-none">{styles.icon}</span>
      <p className={`text-sm font-medium ${styles.text} flex-1`}>{message}</p>
      <button
        onClick={onClose}
        className="text-white/60 hover:text-white transition-colors p-1 text-sm font-bold"
        aria-label="Close notification"
      >
        ✕
      </button>
    </motion.div>
  );
};

export default Alert;
