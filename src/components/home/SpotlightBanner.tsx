import React from 'react';
import { ArrowRight, Zap, Gauge, DollarSign } from 'lucide-react';

interface SpotlightBannerProps {
  onLearnMore: (slug: string) => void;
  onConfigure: (slug: string) => void;
}

export const SpotlightBanner: React.FC<SpotlightBannerProps> = ({
  onLearnMore,
  onConfigure,
}) => {
  return (
    <section className="relative bg-neutral-950 py-24 overflow-hidden border-t border-neutral-800">
      <div className="max-w-[1536px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Copy & Offer Button */}
        <div className="lg:col-span-4 z-10">
          <span className="text-xs font-bold tracking-widest text-[#1c69d4] uppercase block mb-3">
            Special Offer
          </span>
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-white mb-4 leading-tight font-display">
            The New
            <br />
            BMW X5
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-8 max-w-sm">
            Power, space and technology — all in one.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onLearnMore('x5')}
              className="inline-flex items-center gap-2 bg-[#1c69d4] hover:bg-[#0053b8] text-white text-xs font-bold uppercase tracking-wider px-7 py-3.5 rounded transition duration-200 cursor-pointer shadow-md"
            >
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onConfigure('x5')}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold uppercase tracking-wider px-5 py-3.5 rounded transition duration-200 cursor-pointer"
            >
              <span>Build X5</span>
            </button>
          </div>
        </div>

        {/* Center Column: Featured Vehicle Image with Plate Badge */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="relative w-full">
            <img
              alt="The New BMW X5 Front View"
              className="w-full h-auto object-cover rounded drop-shadow-2xl"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAL_y3dO3zwJUfTpFnN7oWYLE118YGZt7_nyUn6-vfR0G3dWn7qTs6vmjL6f1SO9hV22eqdvbURF56-IdcidlNZ7bwgln6rwxPfGPfv4542lxVHb50kCS6jAupy3CZ2SFOiskLDDsW5Po_v9YN-uy5h95JZKWzY1ThMmJsfBMp9oNZT_mZmYghCUxLAfhq5ejcviFIpcNC465l2DAiuDhAq96DozPhvgV5KKNiyq3RKFMd5YG7LrHQ"
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm px-4 py-1 border border-neutral-700 rounded text-[11px] font-bold text-gray-200 tracking-wider">
              BMW X5
            </div>
          </div>
        </div>

        {/* Right Column: HUD Spec Metric Badges */}
        <div className="lg:col-span-3 space-y-3.5">
          {/* Stat Item 1 */}
          <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded p-4 flex items-center gap-4 hover:border-neutral-700 transition">
            <div className="w-10 h-10 rounded-full bg-[#1c69d4]/10 flex items-center justify-center text-[#1c69d4] shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Up to 50 miles</div>
              <div className="text-[11px] text-gray-400">electric range (Plug-in Hybrid)</div>
            </div>
          </div>

          {/* Stat Item 2 */}
          <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded p-4 flex items-center gap-4 hover:border-neutral-700 transition">
            <div className="w-10 h-10 rounded-full bg-[#1c69d4]/10 flex items-center justify-center text-[#1c69d4] shrink-0">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white tabular-nums">0–100 km/h</div>
              <div className="text-[11px] text-gray-400">in 4.8 seconds</div>
            </div>
          </div>

          {/* Stat Item 3 */}
          <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded p-4 flex items-center gap-4 hover:border-neutral-700 transition">
            <div className="w-10 h-10 rounded-full bg-[#1c69d4]/10 flex items-center justify-center text-[#1c69d4] shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Starting from</div>
              <div className="text-[11px] text-gray-200 font-semibold tabular-nums">$65,900</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
