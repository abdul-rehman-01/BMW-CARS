import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface ExperienceShowcaseProps {
  onExploreTechnology?: () => void;
}

const EXPERIENCE_ITEMS = [
  {
    id: 'exp-m',
    title: 'M Performance',
    tagline: 'Born on the track. Built for the road.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZBqfm5P7KcnFPodq56ja-a6IKo82oAq9YJZnndv2LWC1sWu-vbKpoNJ7mQoVx0GOcgLzeqCTLcGqQTxABNYbRRfORvGOKiqqneVbi_WYqwyKhYbwvIXrphZSdtGn0k32VCGd8OG3XlFhdYsppRB3ohyLSMChJBYps3gueFwJ_xIrvIBRTSNJrAUyI3Mu5S5mmYVhutCI7hQAMxZUejyWC3ZGK1OSFqhQV8ypWZL_q1_UqG6AFKzZ-',
    description: 'Every BMW M model is engineered through intense motorsport trials at the Nürburgring Nordschleife. High-revving engines, quad-exhaust acoustics, and chassis tuned to millimeter precision deliver unadulterated adrenaline on everyday roads.',
    highlights: ['Adaptive M Suspension with active dampening', 'M Carbon Ceramic Braking Systems', 'M Differential with active torque distribution']
  },
  {
    id: 'exp-ev',
    title: 'Electric Vehicles',
    tagline: 'Sustainable mobility for a brighter future.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUWTk_RKZ48OY_APheJ2fgdRErdOvSkQQFUkXIBKFik6cCFUFYOB_n1LwXSDI-rDgK1MUaqN3cnbkqciZMPQf47wnJTXJJJHqVBmSwrCGi8LxEyaaFWTUiGhYxjmy5Bh7U3klkJ5pDF0NJRmG_KH8_F5DOGibH6xRUNJm5MM9AR2seODffEDUz_10j36MV9SRDS3rXUci1OWUcFhO-U4zEAkWXcHX68xbR32a71PcgNw-aOfqrZZC5',
    description: 'BMW i represents the fusion of electrified dynamics with circular design. Manufactured using 100% renewable electricity and secondary recycled aluminum, delivering seamless DC high-speed charging and whisper-quiet power.',
    highlights: ['Up to 372 miles EPA estimated range', 'High-power DC charging (10% to 80% in ~28 min)', 'IconicSounds Electric composed with Hans Zimmer']
  },
  {
    id: 'exp-tech',
    title: 'Innovative Technology',
    tagline: 'Smarter. Safer. More connected.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIWTEmIxIrWgZNNqtKTFPHKcNqT7lM6phapVK4XcSOCzV4x4Agx2mlRAAvykTuMrw9oTDtD3NYDMbIRm0ix8qfM1z6DtreEkP7ak7FAcijz7NyF_HUEnhHNtz7XWGKYQq3GWtMh7Mps-bi96Z3aQTph6GzOL2OaCm4u9u9jDv0F0WIcPpiySp_OygCr-tYaqb02eeYK36F95r61dp0t2jCUTh2TQBBDJBaRnZ1nASlzYHGvDJD-fhw',
    description: 'The BMW Curved Display unites instrument telemetry and multimedia into a driver-centric cockpit. Powered by BMW Operating System 8.5 with QuickSelect zero-layer navigation and continuous Over-the-Air remote software updates.',
    highlights: ['BMW Intelligent Personal Voice Assistant', 'AirConsole in-car gaming while parked', '5G eSIM connectivity and digital key plus']
  },
  {
    id: 'exp-luxury',
    title: 'Luxury Interiors',
    tagline: 'Crafted for comfort. Designed for you.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCckBkTGYXNMjwoLbwkYTE5E2x2oqfpk0_ioLSGjA3OqEANDb_D3jTu_2-8T20sNXUbRVnBm3d3V5I7S64yCbEyjqvC2SaxunrbKBNxzWdehnsNQKnObMEXMYCIJlFPPVZjhPZ1pypyqDK30ehHmRYrZknoE7ZsF9NF_dkSpxlq4NWWMwkZCoa8FXSUvPF9JWM1k25iJNmrB8o6fesIs3orYhMWAbV6SrBkTMCpquwFEEK6vkcaGNlj',
    description: 'Artisanal attention to every stitch. Hand-selected Merino and Veganza leathers, sculpted open-pore woods, crystal glass faceted controls, and ambient contour lighting that reacts dynamically to drive modes.',
    highlights: ['Panoramic Sky Lounge LED glass roof', 'CraftedClarity faceted crystal gear selector', 'Active seat ventilation and massage programs']
  },
  {
    id: 'exp-assist',
    title: 'Driver Assistance',
    tagline: 'More confidence in every mile.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB46JXWJkvoCkgy1TlfttoAksyF00MRnBq2uH8ivRu6TMx8xKpfOcqsvjFIwqx_X-VOlCM0or-ur65GT3qRZu2fwC5iXsQlo7oNi-NjnXraErS_Svjfp-OhZ6xbnQG50JYKadZCwdQI3nbQT5brS94V39FayeEswtDYh1ohYk_EsmWYl-frbwGYXwLrnAu2OIxuMYbjaIe3SUSPUbXJk8TF_QAH0Q8ks4sPQqsqZ16UMXnrC6wTL6zL',
    description: 'Level 2+ Highway Assistant permits hands-free driving on designated divided highways up to 85 mph. Featuring the world\'s first eye-activated lane change function: glancing at the side mirror confirms safe lane maneuvers.',
    highlights: ['Hands-Free Highway Assistant up to 85 mph', 'Active Lane Change with eye confirmation', 'Remote Control Smartphone Parking Assist']
  }
];

export const ExperienceShowcase: React.FC<ExperienceShowcaseProps> = () => {
  const [selectedItem, setSelectedItem] = useState<typeof EXPERIENCE_ITEMS[0] | null>(null);

  return (
    <>
      <section className="py-24 bg-[#0a0c10] border-t border-gray-900" id="experience">
        <div className="max-w-[1536px] mx-auto px-6 lg:px-12">
          {/* Section Title & Subheading */}
          <div className="mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#1c69d4] block mb-2">
              The BMW Experience
            </span>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-white mb-3 font-display">
              More Than Just a Car
            </h2>
            <p className="text-sm text-gray-400 max-w-xl">
              Advanced technology. Unmatched performance. A driving experience like no other.
            </p>
          </div>

          {/* 5-Column Feature Cards Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {EXPERIENCE_ITEMS.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group relative rounded overflow-hidden bg-neutral-900 border border-neutral-800 transition duration-300 hover:border-[#1c69d4]/70 cursor-pointer flex flex-col justify-between"
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={item.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-80" />
                </div>

                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-base font-bold text-white mb-1.5 font-display">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{item.tagline}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs font-bold text-[#1c69d4]">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedItem && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedItem(null)}
          title={selectedItem.title}
          maxWidth="2xl"
        >
          <div className="space-y-5">
            <div className="h-56 rounded-lg overflow-hidden relative">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#1c69d4] font-bold">
                {selectedItem.tagline}
              </span>
              <p className="text-sm text-gray-300 leading-relaxed">
                {selectedItem.description}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#1c69d4]" />
                Key Innovations
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-300">
                {selectedItem.highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1c69d4]" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 flex justify-end">
              <Button size="sm" variant="primary" onClick={() => setSelectedItem(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
