import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface ConfiguratorTeaserProps {
  onStartConfigurator: () => void;
}

const ANGLES = [
  {
    id: 'front',
    label: 'Front angle',
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBe858Ja3S-ob6MT2_P7lvhpZyqT_m3CkVcWgTAxePFTEfEYSGxvvnD5DKBFUcoVo5XRRGhHVRtYgnxX2NxJYzfj758VPNEqsqAHDkzEL6UzquU5eLohO14uSPBUXwxb6V9OafX9Rl9JWYsRCYD4hRO39Pn0IMX1iFj4_vU9Hv27QZ0vrhLMrNBVJHVIIfYaeYhCfT32l2cswKm2OvFwFY9Du1Z9gpn2tzyUzJd5jWtuetqkBqEhgGc',
    full: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByRmagqDLz3me9007IvPuHCUpEn2XfvnWc4IpjtaiZ0EIKmff5BNc2kcxFv7hS26R_5w-83Jd62W8rVdXTpEliajv60y3II3hdiurMX1MfOMPgIekiQU7rQJu-TimLch4cTgeakOKwgmiOdR-T6J0LhAZh8NhWcFo99_tsIEB2vYgmNvrMHwm97m_S2PovHF52gxwqyXYpLuuQHd_IeBuPnB9pp8PmwpqNfePtnqHTYJUpACPX9chS'
  },
  {
    id: 'side',
    label: 'Side angle',
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpkUDs2sFFOuomkKXYaHmrGM8HZdANjNs82GBqBom244dI9qn-_YnfSYwCasZXkRdQ9qrBD1sRPBIw5_ZBTeMsbTC4d9t419UGHLZmUVKFyAsOb_u68ZEPi6US5MZVneB64nHlVF1ZfiXJo4ARdcm-R0sypmCit3TLHteHVJCzIuHPgVdDBjMjXbo0tO7e2LJrPOmxuLS0OY2ugcGCp-0O-skJ9AiN1u6gWZmENdnu1ib2dSUJOgRg',
    full: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpkUDs2sFFOuomkKXYaHmrGM8HZdANjNs82GBqBom244dI9qn-_YnfSYwCasZXkRdQ9qrBD1sRPBIw5_ZBTeMsbTC4d9t419UGHLZmUVKFyAsOb_u68ZEPi6US5MZVneB64nHlVF1ZfiXJo4ARdcm-R0sypmCit3TLHteHVJCzIuHPgVdDBjMjXbo0tO7e2LJrPOmxuLS0OY2ugcGCp-0O-skJ9AiN1u6gWZmENdnu1ib2dSUJOgRg'
  },
  {
    id: 'rear',
    label: 'Rear angle',
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF5wfVyaIEmqVsYLkWBZ8aocfEOxZQZRFoXc167xRbSlE3Eqkyj1NZLi3Im_L1kcqot_Koqadont0hhB28ciyn9kfmXLsKehMa_FacAYjPtkpASpP8_9HiHQPwD7UihVPSE9R_bGk5rQXVKeEToI9_03V97HcxBQ2U-mynjSFpPSouPvUIWuKFyueM5sH1iubI-tVFAr566aXwZXPpIxECZpQSiJt5DqT3AOFzkyB8ITtcBGO2nH87',
    full: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF5wfVyaIEmqVsYLkWBZ8aocfEOxZQZRFoXc167xRbSlE3Eqkyj1NZLi3Im_L1kcqot_Koqadont0hhB28ciyn9kfmXLsKehMa_FacAYjPtkpASpP8_9HiHQPwD7UihVPSE9R_bGk5rQXVKeEToI9_03V97HcxBQ2U-mynjSFpPSouPvUIWuKFyueM5sH1iubI-tVFAr566aXwZXPpIxECZpQSiJt5DqT3AOFzkyB8ITtcBGO2nH87'
  },
  {
    id: 'interior',
    label: 'Interior angle',
    thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOJiLCKaW4hETw3WqEn2Ew0foPejYC_p_VoGh8Yvsa9xDynX55Fde3RmiCQysO1jaujzPNLzCAjskJtcNYHSTdGBjJsZg5s1oeAYUEXD3o5urVUmVPC9I-tN6x9ucr2NG5CdvSyRlmVX85_lHalW3fvmrtbtsAsDCMlPBO_g2LLrlY2sw5NiU_Lion_R0K_rovaoRUf3Hq_KT_6mfrvQ7i4LJ1iMaBOJv0AvS7LiRtLPMu65w6NABF',
    full: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOJiLCKaW4hETw3WqEn2Ew0foPejYC_p_VoGh8Yvsa9xDynX55Fde3RmiCQysO1jaujzPNLzCAjskJtcNYHSTdGBjJsZg5s1oeAYUEXD3o5urVUmVPC9I-tN6x9ucr2NG5CdvSyRlmVX85_lHalW3fvmrtbtsAsDCMlPBO_g2LLrlY2sw5NiU_Lion_R0K_rovaoRUf3Hq_KT_6mfrvQ7i4LJ1iMaBOJv0AvS7LiRtLPMu65w6NABF'
  }
];

export const ConfiguratorTeaser: React.FC<ConfiguratorTeaserProps> = ({ onStartConfigurator }) => {
  const [selectedAngle, setSelectedAngle] = useState(ANGLES[0]);

  return (
    <section className="py-24 bg-white text-neutral-900 border-t border-gray-200" id="configurator">
      <div className="max-w-[1536px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Interactive Vehicle Visualizer Preview */}
          <div className="lg:col-span-6 flex gap-4">
            {/* Thumbnail Angles Bar */}
            <div className="flex flex-col gap-2 shrink-0">
              {ANGLES.map((angle) => (
                <button
                  key={angle.id}
                  onClick={() => setSelectedAngle(angle)}
                  className={`w-16 h-12 rounded overflow-hidden focus:outline-none transition cursor-pointer ${
                    selectedAngle.id === angle.id
                      ? 'border-2 border-[#1c69d4] ring-2 ring-[#1c69d4]/20'
                      : 'border border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100'
                  }`}
                  aria-label={angle.label}
                >
                  <img alt={angle.label} className="w-full h-full object-cover" src={angle.thumb} />
                </button>
              ))}
            </div>

            {/* Main Visualizer Canvas Preview */}
            <div className="flex-1 bg-gray-100 rounded-sm overflow-hidden border border-gray-200 relative group flex items-center justify-center min-h-[340px]">
              <img
                alt="BMW Configurator Preview Model"
                className="w-full h-full object-cover max-h-[380px] transition-opacity duration-300"
                src={selectedAngle.full}
              />
              <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-semibold text-gray-700 shadow-sm pointer-events-none">
                360° Interactive Ready
              </div>
            </div>
          </div>

          {/* Center: Action & Headline */}
          <div className="lg:col-span-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#1c69d4] block mb-2">
              Build Your BMW
            </span>
            <h2 className="text-3xl font-black text-neutral-900 tracking-tight mb-3 font-display">
              Configurator
            </h2>
            <p className="text-xs text-neutral-600 mb-8 leading-relaxed">
              Create your perfect BMW in just a few steps.
            </p>

            <button
              onClick={onStartConfigurator}
              className="inline-flex items-center gap-2 bg-[#1c69d4] hover:bg-[#0053b8] text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded shadow-sm transition cursor-pointer"
            >
              <span>Start Configurator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Step Progress Timeline */}
          <div className="lg:col-span-3 space-y-4 border-l lg:border-neutral-200 lg:pl-6 pl-0">
            {/* Step 1 */}
            <div className="flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-full border border-[#1c69d4] text-[#1c69d4] font-bold text-xs flex items-center justify-center shrink-0 bg-blue-50/50">
                1
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-900">Select Model</div>
                <div className="text-[11px] text-neutral-500">
                  Choose your BMW, body style and trim.
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-full border border-neutral-300 text-neutral-700 font-bold text-xs flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-900">Customize Exterior</div>
                <div className="text-[11px] text-neutral-500">
                  Colors, wheels, trims and more.
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-full border border-neutral-300 text-neutral-700 font-bold text-xs flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-900">Design Interior</div>
                <div className="text-[11px] text-neutral-500">
                  Upholstery, trim, seats and technology.
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-full border border-neutral-300 text-neutral-700 font-bold text-xs flex items-center justify-center shrink-0">
                4
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-900">Add Packages & Options</div>
                <div className="text-[11px] text-neutral-500">Make it uniquely yours.</div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-full border border-neutral-300 text-neutral-700 font-bold text-xs flex items-center justify-center shrink-0">
                5
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-900">Review & Get Your Price</div>
                <div className="text-[11px] text-neutral-500">Save, share or find a dealer.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
