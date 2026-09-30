import React, { useState } from 'react';
import { BMWLogo } from '../common/BMWLogo';
import { Search, User as UserIcon, Menu, X, ChevronRight, ShieldCheck } from 'lucide-react';
import { User } from '../../types';

interface MainHeaderProps {
  currentView: string;
  onNavigate: (view: string, params?: { modelSlug?: string }) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenSearch: () => void;
}

export const MainHeader: React.FC<MainHeaderProps> = ({
  currentView,
  onNavigate,
  currentUser,
  onOpenAuth,
  onOpenSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Models', view: 'models' },
    { label: 'Build Your BMW', view: 'configurator' },
    { label: 'Compare', view: 'compare' },
    { label: 'Find a Dealer', view: 'dealers' },
    { label: 'Discover BMW', view: 'experience' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#080a0c]/90 backdrop-blur-md border-b border-white/10 transition-all duration-300">
        <div className="max-w-[1536px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          {/* Left side: Brand Logo and Title */}
          <div className="flex items-center gap-8 lg:gap-12">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3.5 group text-left cursor-pointer focus:outline-none"
              aria-label="BMW Home"
            >
              <BMWLogo />
              <span className="text-xl font-bold tracking-widest text-white uppercase hidden sm:inline-block font-sans">
                BMW
              </span>
            </button>

            {/* Desktop Navigation Items */}
            <nav
              aria-label="Main Navigation"
              className="hidden lg:flex items-center gap-7 text-[13px] tracking-wider uppercase font-medium text-gray-200"
            >
              {navLinks.map((item) => {
                const isActive = currentView === item.view;
                return (
                  <button
                    key={item.view}
                    onClick={() => handleNavClick(item.view)}
                    className={`py-2 transition-colors relative cursor-pointer ${
                      isActive
                        ? 'text-white font-semibold'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1c69d4] rounded-full" />
                    )}
                  </button>
                );
              })}

              {/* Admin Quick Switcher */}
              <button
                onClick={() => handleNavClick('admin')}
                className={`py-2 flex items-center gap-1.5 transition-colors cursor-pointer text-xs ${
                  currentView === 'admin'
                    ? 'text-blue-400 font-semibold'
                    : 'text-gray-400 hover:text-blue-300'
                }`}
                title="Content Management & Test Drives"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </nav>
          </div>

          {/* Right Utility Actions */}
          <div className="flex items-center gap-3 sm:gap-4 text-gray-300">
            {/* Search Action */}
            <button
              onClick={onOpenSearch}
              aria-label="Search models and tools"
              className="p-2 hover:text-white transition-colors rounded-full hover:bg-white/10 cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Profile / MyBMW */}
            <button
              onClick={onOpenAuth}
              aria-label="User Account"
              className="flex items-center gap-2 p-1.5 sm:px-3 hover:text-white transition-colors rounded-full hover:bg-white/10 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-gray-200 text-xs font-bold">
                {currentUser ? currentUser.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
              </div>
              {currentUser && (
                <span className="hidden md:inline-block text-xs font-semibold text-gray-200 truncate max-w-[120px]">
                  {currentUser.name}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open Navigation Menu"
              className="p-2 lg:hidden hover:text-white transition-colors rounded-full hover:bg-white/10 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden pt-20 bg-[#080a0c]/98 backdrop-blur-xl flex flex-col justify-between p-6 overflow-y-auto">
          <div className="space-y-4">
            <div className="text-[11px] uppercase tracking-widest text-[#1c69d4] font-bold px-2">
              Navigation
            </div>
            <div className="space-y-1">
              {navLinks.map((item) => (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className="w-full flex items-center justify-between p-3.5 rounded text-left text-sm font-semibold uppercase tracking-wider text-gray-200 hover:text-white hover:bg-white/5 transition"
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>
              ))}

              <button
                onClick={() => handleNavClick('admin')}
                className="w-full flex items-center justify-between p-3.5 rounded text-left text-sm font-semibold uppercase tracking-wider text-blue-400 hover:bg-white/5 transition"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin & CMS Console</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 space-y-3">
            <button
              onClick={() => {
                onOpenAuth();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 px-4 bg-white/10 rounded text-center text-xs font-bold uppercase tracking-wider text-white hover:bg-white/20 transition"
            >
              {currentUser ? `Signed in as ${currentUser.name}` : 'Sign In / My BMW'}
            </button>
            <button
              onClick={() => handleNavClick('configurator')}
              className="w-full py-3 px-4 bg-[#1c69d4] rounded text-center text-xs font-bold uppercase tracking-wider text-white hover:bg-[#0053b8] transition"
            >
              Build Your BMW
            </button>
          </div>
        </div>
      )}
    </>
  );
};
