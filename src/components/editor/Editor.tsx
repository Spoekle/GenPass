'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  setPasswordOptions,
  getPasswordOptions,
  importOptionsFromFile,
  exportOptionsToFile,
} from '@/helper/Passwords/Editor';
import { Button } from '@/components/ui/Button';
import { useAlert } from '@/context/AlertContext';
import { MobileWordList } from '@/components/editor/MobileWordList';
import type { Option } from '@/types';
import { FaFileImport, FaFileExport, FaPlus, FaTimes, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

export const Editor: React.FC = () => {
  const [options, setOptions] = useState<Option[]>(() => getPasswordOptions());
  const [newOption, setNewOption] = useState('');
  const [newWeight, setNewWeight] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const { addAlert } = useAlert();

  const saveAndSetOptions = useCallback((newOpts: Option[]) => {
    setOptions(newOpts);
    setPasswordOptions(newOpts);
  }, []);

  const addOption = () => {
    const trimmed = newOption.trim();
    if (!trimmed) {
      addAlert('Please enter a word', 'error');
      return;
    }

    if (options.some((opt) => opt.option.toLowerCase() === trimmed.toLowerCase())) {
      addAlert('This word already exists in your list', 'alert');
      return;
    }

    const updated = [...options, { option: trimmed, weight: Math.max(1, Math.min(5, newWeight)) }];
    saveAndSetOptions(updated);
    setNewOption('');
    setNewWeight(3);
    addAlert(`Added "${trimmed}" to your word list`, 'success');
  };

  const removeOption = (index: number) => {
    const removedWord = options[index]?.option;
    const updated = options.filter((_, i) => i !== index);
    saveAndSetOptions(updated);
    if (removedWord) {
      addAlert(`Removed "${removedWord}"`, 'alert');
    }
  };

  const updateWeight = (index: number, newW: number) => {
    const clamped = Math.max(1, Math.min(5, newW));
    const updated = options.map((opt, i) => (i === index ? { ...opt, weight: clamped } : opt));
    saveAndSetOptions(updated);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importOptionsFromFile(file, (imported) => {
        saveAndSetOptions(imported);
        addAlert(`Successfully imported ${imported.length} words`, 'success');
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'application/json') {
      importOptionsFromFile(file, (imported) => {
        saveAndSetOptions(imported);
        addAlert(`Successfully imported ${imported.length} words`, 'success');
      });
    } else {
      addAlert('Please drop a valid JSON file', 'error');
    }
  };

  const handleExport = () => {
    if (options.length === 0) {
      addAlert('Word list is empty. Nothing to export.', 'alert');
      return;
    }
    exportOptionsToFile(options);
    addAlert('Word list exported to JSON', 'success');
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto py-12 px-4 max-w-5xl"
    >
      <motion.div variants={itemVariants} className="glass-card shadow-xl mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Custom Word List Editor</h1>
            <p className="text-sm text-gray-300">
              Add and weight custom words to personalize your generated passwords.
            </p>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <label className="cursor-pointer flex-1 sm:flex-none">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <span className="glass-button text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 py-2 px-3 rounded-lg border border-white/10 hover:border-white/20">
                <FaFileImport />
                <span>Import JSON</span>
              </span>
            </label>

            <Button
              onClick={handleExport}
              variant="secondary"
              className="text-xs sm:text-sm flex items-center space-x-2 py-2 px-3 flex-1 sm:flex-none justify-center"
            >
              <FaFileExport />
              <span>Export JSON</span>
            </Button>
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-4 text-center transition-all duration-200 mb-6 ${
            isDragging
              ? 'border-indigo-400 bg-indigo-500/10'
              : 'border-white/10 bg-white/5 hover:border-white/20'
          }`}
        >
          <p className="text-xs sm:text-sm text-gray-300">
            Drag & drop a <span className="text-indigo-400 font-mono">passwordOptions.json</span> file here to import
          </p>
        </div>

        {/* Add Word Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addOption();
          }}
          className="glass-dark p-4 rounded-xl flex flex-col sm:flex-row gap-3 items-center"
        >
          <input
            type="text"
            placeholder="Enter word (e.g., galaxy)"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            className="w-full sm:flex-1 glass-input text-white text-sm"
          />

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-start">
            <label htmlFor="newWeight" className="text-xs text-gray-300 font-medium whitespace-nowrap">
              Weight (1-5):
            </label>
            <input
              id="newWeight"
              type="number"
              min={1}
              max={5}
              value={newWeight}
              onChange={(e) => setNewWeight(parseInt(e.target.value, 10) || 1)}
              className="w-16 glass-input text-center text-sm py-1.5"
            />
          </div>

          <Button
            type="submit"
            variant="success"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 py-2.5 px-5 text-sm"
          >
            <FaPlus />
            <span>Add Word</span>
          </Button>
        </form>
      </motion.div>

      {/* Desktop Word List */}
      <motion.div variants={itemVariants} className="hidden md:block glass-card shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Configured Words</h2>
          <span className="text-xs font-semibold px-3 py-1 bg-neutral-800 rounded-full text-indigo-300 border border-neutral-700">
            {options.length} {options.length === 1 ? 'word' : 'words'}
          </span>
        </div>

        {options.length === 0 ? (
          <div className="text-center py-12 text-gray-400 border border-neutral-800 rounded-xl bg-neutral-900/40">
            <span className="text-4xl block mb-2">📚</span>
            <p className="text-base font-medium">Your custom word list is currently empty.</p>
            <p className="text-xs text-gray-500 mt-1">Add your own favorite words above or import a word list.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <AnimatePresence>
              {options.map((opt, index) => (
                <motion.div
                  key={`${opt.option}-${index}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-neutral-900/70 border border-neutral-800 rounded-lg p-3 flex items-center justify-between shadow-sm hover:border-neutral-700 transition-colors"
                >
                  <span className="text-white font-medium text-sm truncate mr-2" title={opt.option}>
                    {opt.option}
                  </span>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center bg-neutral-800 rounded border border-neutral-700">
                      <button
                        type="button"
                        onClick={() => updateWeight(index, opt.weight - 1)}
                        disabled={opt.weight <= 1}
                        className="px-1.5 py-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Decrease weight"
                      >
                        <FaArrowDown className="text-xs" />
                      </button>
                      <span className="px-2 text-xs font-bold text-indigo-300">
                        {opt.weight}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateWeight(index, opt.weight + 1)}
                        disabled={opt.weight >= 5}
                        className="px-1.5 py-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Increase weight"
                      >
                        <FaArrowUp className="text-xs" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="p-1.5 rounded-md bg-red-500/15 hover:bg-red-500/25 text-red-300 transition-colors"
                      aria-label={`Remove ${opt.option}`}
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Mobile Word List Drawer */}
      <MobileWordList
        options={options}
        removeOption={removeOption}
        updateWeight={updateWeight}
      />
    </motion.div>
  );
};

export default Editor;
