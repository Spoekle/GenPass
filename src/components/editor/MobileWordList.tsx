'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp, FaArrowDown, FaTimes } from 'react-icons/fa';
import type { Option } from '@/types';

interface MobileWordListProps {
  options: Option[];
  removeOption: (index: number) => void;
  updateWeight: (index: number, newWeight: number) => void;
}

export const MobileWordList: React.FC<MobileWordListProps> = ({
  options,
  removeOption,
  updateWeight,
}) => {
  const [isListOpen, setIsListOpen] = useState(false);

  const toggleList = () => {
    setIsListOpen((prev) => !prev);
  };

  const increaseWeight = (index: number, currentWeight: number) => {
    if (currentWeight < 5) {
      updateWeight(index, currentWeight + 1);
    }
  };

  const decreaseWeight = (index: number, currentWeight: number) => {
    if (currentWeight > 1) {
      updateWeight(index, currentWeight - 1);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 w-full block md:hidden pb-12">
      <div className="relative">
        <motion.button
          onClick={toggleList}
          className={`
            w-full flex items-center justify-center py-3 px-4 
            bg-neutral-900 text-white font-medium space-x-2
            border-t border-neutral-700 shadow-2xl
            ${isListOpen ? 'rounded-t-none' : 'rounded-t-xl'}
          `}
          whileHover={{ backgroundColor: 'rgba(38, 38, 38, 1)' }}
          whileTap={{ scale: 0.98 }}
        >
          {isListOpen ? (
            <>
              <FaArrowDown className="mr-2 text-indigo-400" />
              <span>Hide Word List</span>
              <FaArrowDown className="ml-2 text-indigo-400" />
            </>
          ) : (
            <>
              <FaArrowUp className="mr-2 text-indigo-400" />
              <span>Show Word List ({options.length})</span>
              <FaArrowUp className="ml-2 text-indigo-400" />
            </>
          )}
        </motion.button>

        <AnimatePresence>
          {isListOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="w-full bg-neutral-900/95 backdrop-blur-md border-x border-neutral-700"
              style={{ maxHeight: '70vh', overflowY: 'auto' }}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white">Word List</h2>
                  <div className="px-3 py-1 rounded-full bg-neutral-800 text-white text-xs font-medium">
                    {options.length} {options.length === 1 ? 'word' : 'words'}
                  </div>
                </div>

                <div className="space-y-2">
                  {options.length === 0 ? (
                    <div className="text-center text-gray-400 border-2 border-dashed border-neutral-700 p-6 bg-neutral-800/50 rounded-lg flex flex-col items-center">
                      <span className="text-2xl mb-2">📝</span>
                      <p className="text-sm">No words added yet.</p>
                      <p className="text-xs text-gray-500">Add words above to get started!</p>
                    </div>
                  ) : (
                    options.map((opt, index) => (
                      <div
                        key={index}
                        className="bg-neutral-800/80 border border-neutral-700/80 rounded-lg p-3 flex items-center justify-between"
                      >
                        <span className="text-white font-medium text-sm truncate max-w-[140px]">
                          {opt.option}
                        </span>

                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400 text-xs">Weight:</span>
                          <div className="flex items-center bg-neutral-700 rounded-lg">
                            <button
                              type="button"
                              onClick={() => decreaseWeight(index, opt.weight)}
                              disabled={opt.weight <= 1}
                              className={`p-1.5 rounded-l-lg ${opt.weight <= 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-neutral-600'}`}
                              aria-label="Decrease weight"
                            >
                              <FaArrowDown className="text-white text-xs" />
                            </button>

                            <span className="px-2 text-white text-xs font-bold">
                              {opt.weight}
                            </span>

                            <button
                              type="button"
                              onClick={() => increaseWeight(index, opt.weight)}
                              disabled={opt.weight >= 5}
                              className={`p-1.5 rounded-r-lg ${opt.weight >= 5 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-neutral-600'}`}
                              aria-label="Increase weight"
                            >
                              <FaArrowUp className="text-white text-xs" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="p-1.5 rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/30 ml-1"
                            aria-label={`Remove ${opt.option}`}
                          >
                            <FaTimes className="text-xs" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MobileWordList;
