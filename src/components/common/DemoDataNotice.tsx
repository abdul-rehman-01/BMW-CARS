import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

export const DemoDataNotice: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside
      aria-label="Demonstration Notice"
      className="bg-[#0b1018] border-b border-white/10 px-4 py-2 text-[11px] text-gray-400 flex items-center justify-between z-40 relative"
    >
      <div className="max-w-[1536px] mx-auto w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-[#1c69d4] shrink-0" />
          <span>
            <strong className="text-gray-200">Demonstration Showcase:</strong> This platform is a functional digital showroom concept for automotive retail, configuration, and dealer reservations. Vehicle details and options reflect demonstration specifications.
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-gray-400 hover:text-white shrink-0 p-1"
          aria-label="Dismiss notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
