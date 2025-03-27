'use client';

import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative max-w-lg w-full mx-4 glass bg-white/10 border border-white/20 rounded-xl shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="text-lg font-medium text-white/90">{title}</h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white/90 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
} 