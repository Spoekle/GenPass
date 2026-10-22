'use client';

import React from 'react';
import { motion } from 'framer-motion';

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
      damping: 12,
    },
  },
};

export const PrivacyStatement: React.FC = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto py-12 px-4 max-w-4xl"
    >
      <motion.div variants={itemVariants} className="glass-card shadow-xl">
        <motion.h1
          className="text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
          whileHover={{ scale: 1.01 }}
        >
          Privacy Statement
        </motion.h1>

        <motion.p variants={itemVariants} className="mb-6 leading-relaxed text-white/90 text-base">
          This Privacy Statement explains how GenPass manages and protects your privacy.
          We value your trust and are committed to safeguarding your privacy while you use this application.
        </motion.p>

        <motion.div variants={itemVariants} className="mb-6 glass-dark p-6 rounded-xl border border-white/5">
          <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            100% Client-Side Architecture
          </h2>
          <p className="leading-relaxed text-white/90 text-sm sm:text-base">
            GenPass is designed and built to operate completely inside your web browser. All password generation,
            custom word list operations, and cryptographic entropy calculations execute locally on your device.
            No password, word list, or sensitive parameter is ever transmitted across the network or stored on any server.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6 glass-dark p-6 rounded-xl border border-white/5">
          <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Local Storage Usage
          </h2>
          <p className="leading-relaxed text-white/90 text-sm sm:text-base">
            GenPass uses your browser&apos;s local storage solely to remember non-sensitive user preferences (such as your chosen segment counts,
            custom word lists, and toggles) for your convenience. All locally stored data stays on your device and is never shared, exported,
            or accessed by any third party.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6 glass-dark p-6 rounded-xl border border-white/5">
          <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            No Cookies or Analytics
          </h2>
          <p className="leading-relaxed text-white/90 text-sm sm:text-base">
            We do not use advertising cookies, tracking pixels, telemetry, or analytics software. Your sessions are private, anonymous,
            and untracked.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-dark p-6 rounded-xl border border-white/5">
          <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Contact & Source Code
          </h2>
          <p className="leading-relaxed text-white/90 text-sm sm:text-base">
            GenPass is fully open-source. You can inspect the source code, verify all cryptographic routines, and contribute on{' '}
            <a
              href="https://github.com/Spoekle/genpass"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline font-medium"
            >
              GitHub
            </a>.
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PrivacyStatement;
