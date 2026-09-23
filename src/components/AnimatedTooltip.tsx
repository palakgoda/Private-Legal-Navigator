/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Info } from 'lucide-react';

interface AnimatedTooltipProps {
  content: string;
  title?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children?: React.ReactNode;
  iconOnly?: boolean;
}

export const AnimatedTooltip: React.FC<AnimatedTooltipProps> = ({
  content,
  title,
  position = 'top',
  children,
  iconOnly = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsVisible(false);
      }
    };
    if (isVisible) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isVisible]);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children ? (
        children
      ) : (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(!isVisible);
          }}
          className="p-1 rounded-full text-slate-400 hover:text-amber-700 hover:bg-amber-50 transition-colors focus:outline-hidden focus:ring-2 focus:ring-amber-500/40"
          aria-label={title || 'More information'}
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      )}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: position === 'top' ? 4 : position === 'bottom' ? -4 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: position === 'top' ? 4 : position === 'bottom' ? -4 : 0 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute z-50 ${positionClasses[position]} w-64 sm:w-72 p-3 bg-slate-900 text-slate-100 rounded-2xl shadow-xl border border-slate-700/80 text-xs pointer-events-auto`}
            role="tooltip"
          >
            {title && (
              <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>{title}</span>
              </div>
            )}
            <p className="text-slate-200 leading-relaxed font-normal">{content}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
