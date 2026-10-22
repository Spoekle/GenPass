'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getCustomOptions,
  getStandardOptions,
  generatePassword,
  generateAdvancedPassword,
} from '@/helper/Passwords/GeneratePass';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { CustomCheckbox } from '@/components/ui/CustomCheckbox';
import { useAlert } from '@/context/AlertContext';
import { safeLocalStorage } from '@/utils/storage';
import {
  FaShieldAlt,
  FaKey,
  FaLock,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
  FaCopy,
  FaDownload,
} from 'react-icons/fa';

const STORAGE_KEY = 'genpassOptions';

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

export const Generator: React.FC = () => {
  const { addAlert } = useAlert();

  const [password, setPassword] = useState('');
  const [passwordFileURL, setPasswordFileURL] = useState<string>('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);

  // Initialize options from safeLocalStorage lazily
  const [numOptions, setNumOptions] = useState<number>(() => {
    return safeLocalStorage.getJSON<Record<string, number>>(STORAGE_KEY, {}).numOptions ?? 2;
  });
  const [passwordLength, setPasswordLength] = useState<number>(() => {
    return safeLocalStorage.getJSON<Record<string, number>>(STORAGE_KEY, {}).passwordLength ?? 12;
  });
  const [segmentCount, setSegmentCount] = useState<number>(() => {
    return safeLocalStorage.getJSON<Record<string, number>>(STORAGE_KEY, {}).segmentCount ?? 3;
  });
  const [useSegments, setUseSegments] = useState<boolean>(() => {
    return safeLocalStorage.getJSON<Record<string, boolean>>(STORAGE_KEY, {}).useSegments ?? true;
  });
  const [useCustomList, setUseCustomList] = useState<boolean>(() => {
    return safeLocalStorage.getJSON<Record<string, boolean>>(STORAGE_KEY, {}).useCustomList ?? false;
  });
  const [replaceChars, setReplaceChars] = useState<boolean>(() => {
    return safeLocalStorage.getJSON<Record<string, boolean>>(STORAGE_KEY, {}).replaceChars ?? true;
  });
  const [isAdvanced, setIsAdvanced] = useState<boolean>(() => {
    return safeLocalStorage.getJSON<Record<string, boolean>>(STORAGE_KEY, {}).isAdvanced ?? false;
  });
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(() => {
    return safeLocalStorage.getJSON<Record<string, boolean>>(STORAGE_KEY, {}).includeNumbers ?? false;
  });
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(() => {
    return safeLocalStorage.getJSON<Record<string, boolean>>(STORAGE_KEY, {}).includeSymbols ?? false;
  });
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(() => {
    return safeLocalStorage.getJSON<Record<string, boolean>>(STORAGE_KEY, {}).includeUppercase ?? false;
  });
  const [passwordAmount, setPasswordAmount] = useState<number>(() => {
    return safeLocalStorage.getJSON<Record<string, number>>(STORAGE_KEY, {}).passwordAmount ?? 1;
  });

  // Save options on change
  useEffect(() => {
    safeLocalStorage.setJSON(STORAGE_KEY, {
      numOptions,
      passwordLength,
      segmentCount,
      useSegments,
      useCustomList,
      replaceChars,
      isAdvanced,
      includeNumbers,
      includeSymbols,
      includeUppercase,
      passwordAmount,
    });
  }, [
    numOptions,
    passwordLength,
    segmentCount,
    useSegments,
    useCustomList,
    replaceChars,
    isAdvanced,
    includeNumbers,
    includeSymbols,
    includeUppercase,
    passwordAmount,
  ]);

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (passwordFileURL) {
        URL.revokeObjectURL(passwordFileURL);
      }
    };
  }, [passwordFileURL]);

  const calculatePasswordStrength = useCallback((pwdString: string): string => {
    const pwd = pwdString.split('\n')[0] || '';
    if (!pwd) return '';

    let strength = 0;
    if (pwd.length >= 12) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[a-z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
    if (new Set(pwd.split('')).size >= pwd.length * 0.7) strength += 1;

    switch (strength) {
      case 0:
      case 1:
      case 2:
        return 'Very Weak';
      case 3:
        return 'Weak';
      case 4:
        return 'Moderate';
      case 5:
        return 'Strong';
      case 6:
        return 'Very Strong';
      default:
        return 'Strong';
    }
  }, []);

  const handleGeneratePassword = () => {
    setIsGenerating(true);
    try {
      let pass: string;
      if (isAdvanced) {
        pass = generateAdvancedPassword(
          useSegments,
          segmentCount,
          passwordLength,
          includeNumbers,
          includeSymbols,
          includeUppercase,
          passwordAmount
        );
      } else {
        const standardOptions = getStandardOptions();
        const customOptions = useCustomList ? getCustomOptions() : [];
        const allOptions = [...standardOptions, ...customOptions];
        pass = generatePassword(allOptions, numOptions, replaceChars, passwordAmount);
      }

      setPassword(pass);
      setPasswordStrength(calculatePasswordStrength(pass));
      addAlert('Password(s) generated successfully', 'success');

      if (passwordFileURL) {
        URL.revokeObjectURL(passwordFileURL);
      }
      const blob = new Blob([pass], { type: 'text/plain' });
      setPasswordFileURL(URL.createObjectURL(blob));
    } catch (error) {
      console.error('Error generating password:', error);
      addAlert('Failed to generate password', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const fallbackCopyToClipboard = (text: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        addAlert('Password(s) copied to clipboard!', 'success');
      } else {
        addAlert('Failed to copy password', 'error');
      }
    } catch (err) {
      console.error('Fallback copy failed:', err);
      addAlert('Failed to copy password', 'error');
    }
  };

  const handleCopyPassword = async () => {
    if (!password) return;
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      try {
        await navigator.clipboard.writeText(password);
        addAlert('Password(s) copied to clipboard!', 'success');
      } catch (err) {
        console.error('Clipboard writeText failed:', err);
        fallbackCopyToClipboard(password);
      }
    } else {
      fallbackCopyToClipboard(password);
    }
  };

  const toggleHowItWorks = () => {
    setShowHowItWorks((prev) => !prev);
    if (showSecurity) setShowSecurity(false);
  };

  const toggleSecurity = () => {
    setShowSecurity((prev) => !prev);
    if (showHowItWorks) setShowHowItWorks(false);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto py-12 px-4 max-w-6xl"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="glass-card shadow-xl mb-8 text-center">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4 text-white"
          whileHover={{ scale: 1.01 }}
        >
          Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-100">GenPass</span>
        </motion.h1>
        <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
          A secure, privacy-focused password generator that creates memorable yet strong passwords entirely on your device.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-2">
          <motion.div
            className="flex items-center px-4 py-2 bg-neutral-800/80 border border-neutral-700/60 rounded-full text-gray-300 text-sm"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(38, 38, 38, 0.9)' }}
          >
            <FaShieldAlt className="mr-2 text-indigo-400" /> Cryptographically Secure
          </motion.div>
          <motion.div
            className="flex items-center px-4 py-2 bg-neutral-800/80 border border-neutral-700/60 rounded-full text-gray-300 text-sm"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(38, 38, 38, 0.9)' }}
          >
            <FaKey className="mr-2 text-indigo-400" /> 100% Client-side Processing
          </motion.div>
          <motion.div
            className="flex items-center px-4 py-2 bg-neutral-800/80 border border-neutral-700/60 rounded-full text-gray-300 text-sm"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(38, 38, 38, 0.9)' }}
          >
            <FaLock className="mr-2 text-indigo-400" /> Zero Server Storage
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Generator Controls */}
        <motion.div variants={itemVariants} className="glass-card shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Password Generator</h2>
            <Button
              onClick={() => setIsAdvanced(!isAdvanced)}
              variant="secondary"
              className="text-xs sm:text-sm"
            >
              {isAdvanced ? 'Simple Mode' : 'Advanced Mode'}
            </Button>
          </div>

          {/* Amount of Passwords */}
          <div className="mb-6 glass-dark p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="passwordAmount" className="text-white text-sm font-medium">
                Number of Passwords
              </label>
              <span className="text-indigo-400 font-bold text-sm">{passwordAmount}</span>
            </div>
            <input
              id="passwordAmount"
              type="number"
              min={1}
              max={100}
              value={passwordAmount}
              onChange={(e) => setPasswordAmount(Math.max(1, Math.min(100, parseInt(e.target.value, 10) || 1)))}
              className="w-full glass-input text-white text-sm"
            />
          </div>

          {isAdvanced ? (
            <div>
              <div className="glass-dark p-4 rounded-lg mb-4 space-y-4">
                <CustomCheckbox
                  checked={useSegments}
                  onChange={() => setUseSegments(!useSegments)}
                  label="Use Segments"
                />

                {useSegments ? (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white text-sm font-medium">Amount of segments</span>
                      <span className="text-indigo-400 font-bold text-sm">{segmentCount}</span>
                    </div>
                    <Slider
                      value={segmentCount}
                      min={2}
                      max={6}
                      onChange={setSegmentCount}
                      ariaLabel="Amount of segments"
                    />
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white text-sm font-medium">Password Length</span>
                      <span className="text-indigo-400 font-bold text-sm">{passwordLength}</span>
                    </div>
                    <Slider
                      value={passwordLength}
                      min={8}
                      max={32}
                      onChange={setPasswordLength}
                      ariaLabel="Password Length"
                    />
                  </div>
                )}
              </div>

              <div className="glass-dark p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <CustomCheckbox
                    checked={includeNumbers}
                    onChange={() => setIncludeNumbers(!includeNumbers)}
                    label="Include Numbers"
                  />
                  <CustomCheckbox
                    checked={includeSymbols}
                    onChange={() => setIncludeSymbols(!includeSymbols)}
                    label="Include Symbols"
                  />
                  <CustomCheckbox
                    checked={includeUppercase}
                    onChange={() => setIncludeUppercase(!includeUppercase)}
                    label="Uppercase Letters"
                  />
                </div>
              </div>

              <Button
                onClick={handleGeneratePassword}
                variant="success"
                className="w-full py-3 text-base font-bold shadow-lg"
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Password(s)'}
              </Button>
            </div>
          ) : (
            <div>
              <div className="glass-dark p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-white text-sm font-medium">Number of words</span>
                  <span className="text-indigo-400 font-bold text-sm">{numOptions}</span>
                </div>
                <Slider
                  value={numOptions}
                  min={1}
                  max={5}
                  onChange={setNumOptions}
                  ariaLabel="Number of words"
                />
              </div>

              <div className="glass-dark p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <CustomCheckbox
                    checked={useCustomList}
                    onChange={() => setUseCustomList(!useCustomList)}
                    label="Use Custom Words"
                  />
                  <CustomCheckbox
                    checked={replaceChars}
                    onChange={() => setReplaceChars(!replaceChars)}
                    label="Special Characters"
                  />
                </div>
              </div>

              <Button
                onClick={handleGeneratePassword}
                variant="success"
                className="w-full py-3 text-base font-bold shadow-lg"
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Password(s)'}
              </Button>
            </div>
          )}
        </motion.div>

        {/* Results & Information */}
        <motion.div variants={itemVariants}>
          {password ? (
            <motion.div
              className="glass-card shadow-xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">Generated Password(s):</h2>

              <motion.pre
                className="max-h-[50vh] overflow-y-auto bg-neutral-900/80 backdrop-blur-sm border border-neutral-700/80 text-white font-mono font-medium py-4 px-5 rounded-lg whitespace-pre-wrap select-all text-sm sm:text-base leading-relaxed"
                whileHover={{
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
                }}
              >
                {password}
              </motion.pre>

              <div className="flex items-center mt-5 mb-2 gap-2">
                <Button
                  onClick={handleCopyPassword}
                  variant="primary"
                  className="flex-1 py-3 flex items-center justify-center space-x-2"
                >
                  <FaCopy className="h-4 w-4" />
                  <span className="font-bold">Copy to Clipboard</span>
                </Button>

                {passwordFileURL && (
                  <a
                    href={passwordFileURL}
                    download="passwords.txt"
                    className="p-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg text-white transition-colors duration-200 flex items-center justify-center cursor-pointer"
                    title="Download as text file"
                  >
                    <FaDownload className="h-4 w-4" />
                    <span className="sr-only">Download Password(s)</span>
                  </a>
                )}
              </div>

              {passwordStrength && (
                <motion.div
                  className={`mt-4 text-sm sm:text-base font-bold py-2 px-4 rounded-lg text-center border ${
                    passwordStrength === 'Very Weak' || passwordStrength === 'Weak'
                      ? 'bg-red-500/15 border-red-500/30 text-red-300'
                      : passwordStrength === 'Moderate'
                      ? 'bg-yellow-500/15 border-yellow-500/30 text-yellow-300'
                      : 'bg-green-500/15 border-green-500/30 text-green-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  Password Strength: {passwordStrength}
                </motion.div>
              )}
            </motion.div>
          ) : (
            <div className="space-y-4">
              {/* How GenPass Works Accordion */}
              <div className="glass-card shadow-xl">
                <div
                  className="flex justify-between items-center cursor-pointer py-1"
                  onClick={toggleHowItWorks}
                >
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <FaInfoCircle className="mr-3 text-indigo-400" /> How GenPass Works
                  </h2>
                  {showHowItWorks ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                </div>

                <AnimatePresence>
                  {showHowItWorks && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 space-y-3 text-gray-300 text-sm leading-relaxed border-t border-white/5 pt-4">
                        <p>
                          GenPass generates strong yet memorable passwords using a unique approach that combines random words with special characters. Unlike traditional random string generators, GenPass creates passwords that are easier to remember but still cryptographically sound.
                        </p>

                        <h3 className="text-white font-bold text-sm">Two Operating Modes:</h3>

                        <div className="pl-3 border-l-2 border-indigo-500/40 space-y-1">
                          <h4 className="font-semibold text-white">Simple Mode:</h4>
                          <p>Combines multiple random words from standard or custom dictionaries, optionally substituting characters with symbols for added security.</p>
                        </div>

                        <div className="pl-3 border-l-2 border-purple-500/40 space-y-1">
                          <h4 className="font-semibold text-white">Advanced Mode:</h4>
                          <p>Generates high-entropy character sequences with configurable segments, numbers, symbols, and uppercase letters.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Security Features Accordion */}
              <div className="glass-card shadow-xl">
                <div
                  className="flex justify-between items-center cursor-pointer py-1"
                  onClick={toggleSecurity}
                >
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <FaShieldAlt className="mr-3 text-indigo-400" /> Security & Privacy
                  </h2>
                  {showSecurity ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                </div>

                <AnimatePresence>
                  {showSecurity && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 space-y-3 text-gray-300 text-sm leading-relaxed border-t border-white/5 pt-4">
                        <ul className="list-disc pl-5 space-y-2">
                          <li>
                            <strong className="text-white">Client-side Processing:</strong> All password generation executes locally in your browser. Passwords never travel across the network.
                          </li>
                          <li>
                            <strong className="text-white">Web Crypto API:</strong> Uses <code className="text-xs bg-neutral-800 px-1 py-0.5 rounded text-indigo-300">crypto.getRandomValues</code> with rejection sampling to eliminate modulo bias.
                          </li>
                          <li>
                            <strong className="text-white">No Tracking:</strong> Zero analytics, cookies, or remote storage. Custom wordlists remain in your browser&apos;s local storage.
                          </li>
                        </ul>

                        <div className="mt-3 bg-neutral-900/60 p-3 rounded-lg border border-neutral-800 text-xs text-neutral-300 italic">
                          &ldquo;The most secure password is one you can actually remember. GenPass creates passwords that balance memorability with security.&rdquo;
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Generator;
