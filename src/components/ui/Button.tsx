'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface ButtonProps {
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'amber';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  type = 'button',
  children,
  className = '',
  variant = 'primary',
  disabled = false,
}) => {
  const baseStyle = 'glass-button font-bold py-2 px-4 rounded-lg cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'border-indigo-500/30 bg-indigo-500/20 hover:bg-indigo-500/30 text-white',
    secondary: 'border-purple-500/30 bg-purple-500/20 hover:bg-purple-500/30 text-white',
    success: 'border-green-500/30 bg-green-500/20 hover:bg-green-500/30 text-white',
    danger: 'border-red-500/30 bg-red-500/20 hover:bg-red-500/30 text-white',
    amber: 'border-amber-500/30 bg-amber-500/20 hover:bg-amber-500/30 text-white',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      whileHover={!disabled ? { scale: 1.03, boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)' } : undefined}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.button>
  );
};

export default Button;
