'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface CustomCheckboxProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, onChange, label }) => {
  return (
    <motion.label
      className="flex items-center cursor-pointer font-bold text-white select-none w-full"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <motion.span
        className={`
          flex items-center justify-center w-full px-4 py-3
          backdrop-blur-sm rounded-lg transition-all duration-300
          ${checked
            ? 'bg-indigo-500/30 border border-indigo-500/50 shadow-md shadow-indigo-500/10'
            : 'bg-white/5 border border-white/10 hover:border-white/20'}
        `}
        animate={{
          scale: checked ? [1, 1.03, 1] : 1,
          transition: { duration: 0.2, ease: 'easeInOut' }
        }}
      >
        <span className="relative flex items-center text-sm font-medium">
          {checked && (
            <motion.span
              className="absolute -left-5 text-indigo-300 font-bold"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
            >
              ✓
            </motion.span>
          )}
          <span>{label}</span>
        </span>
      </motion.span>
    </motion.label>
  );
};

export default CustomCheckbox;
