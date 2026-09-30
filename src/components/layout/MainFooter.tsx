import React from 'react';
import { BMWLogo } from '../common/BMWLogo';
import { Youtube, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';

interface MainFooterProps {
  onNavigate: (view: string) => void;
}

export const MainFooter: React.FC<MainFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-black text-gray-400 pt-16 pb-12 border-t border-neutral-900 text-xs">
      <div className="max-w-[1536px] mx-auto px-6 lg:px-12">
        {/* Footer Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-16 border-b border-neutral-900">
          {/* BMW Brand Identity Column */}
          <div className="lg:col-span-1 space-y-4">
            <BMWLogo size={42} />
            <div>
              <span className="font-bold text-white tracking-widest text-sm block">BMW</span>
              <span className="text-[11px] text-gray-500">The Ultimate Driving Machine.</span>
            </div>
          </div>

          {/* Col 2: Models */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Models</h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => onNavigate('models')} className="hover:text-white transition">
                  All Vehicles
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('models')} className="hover:text-white transition">
                  Sedans & Coupes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('models')} className="hover:text-white transition">
                  Sports Activity Vehicles (SUVs)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('models')} className="hover:text-white transition">
                  BMW i (Electric)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('models')} className="hover:text-white transition">
                  BMW M High Performance
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Shopping Tools */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Shopping Tools</h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => onNavigate('configurator')} className="hover:text-white transition">
                  Build Your BMW
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('compare')} className="hover:text-white transition">
                  Compare Vehicles
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dealers')} className="hover:text-white transition">
                  Find a Dealer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('test-drive')} className="hover:text-white transition">
                  Book a Test Drive
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Owners & Service */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Owners</h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => onNavigate('account')} className="hover:text-white transition">
                  My BMW Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dealers')} className="hover:text-white transition">
                  Service & Maintenance
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('configurator')} className="hover:text-white transition">
                  Saved Builds
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-white transition text-[#1c69d4]">
                  Admin CMS Panel
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Discover BMW */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Discover BMW</h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => onNavigate('experience')} className="hover:text-white transition">
                  Innovation & Design
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('experience')} className="hover:text-white transition">
                  Sustainability Roadmap
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('experience')} className="hover:text-white transition">
                  Motorsport Heritage
                </button>
              </li>
            </ul>
          </div>

          {/* Col 6: Contact & Socials */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-2 text-[11px] mb-6">
              <li>
                <button onClick={() => onNavigate('dealers')} className="hover:text-white transition">
                  Find a Center
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition">
                  Customer Assistance
                </button>
              </li>
            </ul>
            <div className="mt-4">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-2.5">
                Connect
              </span>
              <div className="flex items-center gap-3 text-gray-400">
                <a
                  href="#youtube"
                  aria-label="YouTube"
                  className="hover:text-white transition p-1"
                  onClick={(e) => e.preventDefault()}
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href="#instagram"
                  aria-label="Instagram"
                  className="hover:text-white transition p-1"
                  onClick={(e) => e.preventDefault()}
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#facebook"
                  aria-label="Facebook"
                  className="hover:text-white transition p-1"
                  onClick={(e) => e.preventDefault()}
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="#twitter"
                  aria-label="Twitter"
                  className="hover:text-white transition p-1"
                  onClick={(e) => e.preventDefault()}
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#linkedin"
                  aria-label="LinkedIn"
                  className="hover:text-white transition p-1"
                  onClick={(e) => e.preventDefault()}
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Legal and Copyright Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-4">
          <p>© 2026 BMW of North America, LLC. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => alert('Privacy Policy: Customer data is processed securely with consent for showroom demonstration purposes.')} className="hover:text-gray-300 transition">
              Privacy
            </button>
            <button onClick={() => alert('Legal Notice: Specifications, standard features and options are subject to demonstration terms.')} className="hover:text-gray-300 transition">
              Legal
            </button>
            <button onClick={() => alert('Cookies Settings: Essential digital showroom preferences are maintained locally.')} className="hover:text-gray-300 transition">
              Cookies
            </button>
            <button onClick={() => onNavigate('models')} className="hover:text-gray-300 transition">
              Sitemap
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
