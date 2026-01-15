'use client';

import React, { useState, useEffect } from 'react';
import { Theme } from '../utils/themes';

interface BootSequenceProps {
  theme: Theme;
  onComplete: () => void;
}

const BOOT_LINES = [
  "INITIALIZING BIOS...",
  "CHECKING SYSTEM MEMORY... 64TB OK",
  "LOADING KERNEL MODULES...",
  "MOUNTING VFS [ENCRYPTED]...",
  "ESTABLISHING SECURE UPLINK...",
  "AUTHENTICATING USER: gurukrishnaa...",
  "ACCESS GRANTED.",
  "STARTING SHELL..."
];

const BootSequence: React.FC<BootSequenceProps> = ({ theme, onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= BOOT_LINES.length) {
      const timeout = setTimeout(onComplete, 800); // Slight pause at end
      return () => clearTimeout(timeout);
    }

    // Random delay for realism
    const delay = Math.random() * 300 + 100;
    
    const timeout = setTimeout(() => {
      setLines(prev => [...prev, BOOT_LINES[currentIndex]]);
      setCurrentIndex(prev => prev + 1);
    }, delay);

    return () => clearTimeout(timeout);
  }, [currentIndex, onComplete]);

  return (
    <div className={`w-full h-full p-8 font-mono ${theme.text} flex flex-col justify-start`}>
      {lines.map((line, i) => (
        <div key={i} className="mb-1">
          <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString()}]</span>
          <span>{line}</span>
        </div>
      ))}
      <div className="animate-pulse mt-2">_</div>
    </div>
  );
};

export default BootSequence;
