import React from 'react';
import { MapPin, Calendar, FileText, Mail, ArrowRight } from 'lucide-react';

interface QuickServicesBarProps {
  onSelectService: (service: 'dealers' | 'test-drive' | 'quote' | 'contact') => void;
}

export const QuickServicesBar: React.FC<QuickServicesBarProps> = ({ onSelectService }) => {
  return (
    <section className="bg-[#050709] border-t border-neutral-800 text-white" id="services">
      <div className="max-w-[1536px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-neutral-800">
        {/* Service 1: Find a Dealer */}
        <button
          onClick={() => onSelectService('dealers')}
          className="p-8 flex items-center justify-between group hover:bg-neutral-900/60 transition text-left cursor-pointer w-full"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center text-[#1c69d4] group-hover:border-[#1c69d4] transition shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold block text-white">Find a Dealer</span>
              <span className="text-xs text-gray-400">Locate your nearest BMW center.</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </button>

        {/* Service 2: Book a Test Drive */}
        <button
          onClick={() => onSelectService('test-drive')}
          className="p-8 flex items-center justify-between group hover:bg-neutral-900/60 transition text-left cursor-pointer w-full"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center text-[#1c69d4] group-hover:border-[#1c69d4] transition shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold block text-white">Book a Test Drive</span>
              <span className="text-xs text-gray-400">Feel the difference.</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </button>

        {/* Service 3: Get a Quote */}
        <button
          onClick={() => onSelectService('quote')}
          className="p-8 flex items-center justify-between group hover:bg-neutral-900/60 transition text-left cursor-pointer w-full"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center text-[#1c69d4] group-hover:border-[#1c69d4] transition shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold block text-white">Get a Quote</span>
              <span className="text-xs text-gray-400">Your dream BMW, your terms.</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </button>

        {/* Service 4: Contact Us */}
        <button
          onClick={() => onSelectService('contact')}
          className="p-8 flex items-center justify-between group hover:bg-neutral-900/60 transition text-left cursor-pointer w-full"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center text-[#1c69d4] group-hover:border-[#1c69d4] transition shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold block text-white">Contact Us</span>
              <span className="text-xs text-gray-400">We're here to help.</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </button>
      </div>
    </section>
  );
};
