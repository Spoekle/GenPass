'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, MotionStyle } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';

export const Navbar: React.FC = () => {
  const navRef = useRef<HTMLDivElement>(null);
  const [underlineStyle, setUnderlineStyle] = useState<MotionStyle>({});
  const pathname = usePathname();

  useEffect(() => {
    const activeLink = navRef.current?.querySelector('.active-nav-link') as HTMLElement | null;
    if (activeLink) {
      const { offsetLeft, offsetWidth } = activeLink;
      setUnderlineStyle({
        left: offsetLeft,
        width: offsetWidth,
        background: '#6366f1',
        height: '2px',
        position: 'absolute',
        bottom: -4,
        borderRadius: '1px',
      });
    } else {
      setUnderlineStyle({ width: 0 });
    }
  }, [pathname]);

  const isGeneratorActive = pathname === '/generator' || pathname === '/';
  const isEditorActive = pathname === '/editor';

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      className="fixed top-0 left-0 right-0 w-full z-50 backdrop-blur-md bg-black/60 border-b border-white/5 text-white shadow-md"
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link href="/generator" className="inline-flex items-center space-x-2">
          <motion.div
            className="flex items-center space-x-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.img
              src="/images/logo_500px.png"
              alt="GenPass Logo"
              width={32}
              height={32}
              className="w-8 h-8 rounded-md"
              initial={{ rotate: -5 }}
              animate={{ rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            />
            <span className="hidden sm:block text-lg font-semibold tracking-wide text-white">
              GenPass
            </span>
          </motion.div>
        </Link>

        <div className="relative flex space-x-2 sm:space-x-4 items-center" ref={navRef}>
          <Link
            href="/generator"
            className={`z-20 px-3 py-1.5 font-medium transition-all duration-200 ${
              isGeneratorActive ? 'active-nav-link text-white' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <motion.span whileHover={{ y: -1 }} className="inline-block text-sm sm:text-base">
              Generator
            </motion.span>
          </Link>

          <Link
            href="/editor"
            className={`z-20 px-3 py-1.5 font-medium transition-all duration-200 ${
              isEditorActive ? 'active-nav-link text-white' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <motion.span whileHover={{ y: -1 }} className="inline-block text-sm sm:text-base">
              Editor
            </motion.span>
          </Link>

          <motion.a
            href="https://github.com/Spoekle/genpass"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-neutral-300 hover:text-white transition duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="GitHub Repository"
          >
            <FaGithub className="text-2xl" />
          </motion.a>

          <motion.div
            className="absolute bottom-0"
            style={underlineStyle}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
