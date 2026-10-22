'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
  return (
    <motion.footer
      className="w-full backdrop-blur-md bg-black/70 border-t border-white/5 text-white py-4 z-40 shadow-lg mt-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 gap-3">
        <div className="flex flex-wrap items-center justify-center text-sm text-neutral-400">
          <span>© {new Date().getFullYear()} Grabs Software. All rights reserved.</span>
          <span className="mx-2 hidden sm:inline">•</span>
          <Link
            href="/privacy"
            className="text-neutral-300 hover:text-white underline underline-offset-2 transition-colors duration-200"
          >
            Privacy Statement
          </Link>
        </div>

        <div className="text-xs text-neutral-400 flex items-center">
          <span>Powered by</span>
          <a
            href="https://grabssoftware.com"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 text-indigo-400 hover:text-indigo-300 transition-colors duration-200 font-medium"
          >
            Grabs Software
          </a>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
