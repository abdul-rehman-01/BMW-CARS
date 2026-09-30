import React, { useState, useMemo } from 'react';
import { dealerService } from '../../services/dealerService';
import { Dealer } from '../../types';
import { Search, MapPin, Phone, Mail, Clock, Star, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface DealerLocatorProps {
  onBookTestDriveAtDealer: (dealerId: string) => void;
  onContactDealer: (dealerId: string) => void;
}

export const DealerLocator: React.FC<DealerLocatorProps> = ({
  onBookTestDriveAtDealer,
  onContactDealer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedDealerId, setSelectedDealerId] = useState<string>(dealerService.getAllDealers()[0]?.id || '');

  const cities = ['All', ...dealerService.getCities()];

  const filteredDealers = useMemo(() => {
    return dealerService.getAllDealers().filter((d) => {
      if (selectedCity !== 'All' && d.city !== selectedCity) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          d.name.toLowerCase().includes(q) ||
          d.city.toLowerCase().includes(q) ||
          d.address.toLowerCase().includes(q) ||
          d.postalCode.includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [searchQuery, selectedCity]);

  const activeDealer = filteredDealers.find((d) => d.id === selectedDealerId) || filteredDealers[0];

  return (
    <div className="pt-24 pb-20 bg-[#080a0c] text-white min-h-screen">
      <div className="max-w-[1536px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="py-8 border-b border-white/10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1c69d4] block mb-2">
            BMW Retail Network
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Find an Authorized BMW Center
          </h1>
          <p className="text-sm text-gray-400 mt-2 max-w-xl">
            Locate premier BMW sales, certified service centers, and reserve personal test drives with certified client advisors.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="py-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by city, center name, or zip code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0f141c] border border-white/15 rounded-lg pl-10 pr-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#1c69d4]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 hidden sm:inline">City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-[#0f141c] border border-white/15 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-[#1c69d4] cursor-pointer"
            >
              {cities.map((c) => (
                <option key={c} value={c} className="bg-[#0f141c]">
                  {c === 'All' ? 'All Regions' : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content Layout: List on Left, Map/Focus on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Dealer Cards List */}
          <div className="lg:col-span-5 space-y-4 max-h-[720px] overflow-y-auto custom-scroll pr-2">
            {filteredDealers.length === 0 ? (
              <div className="p-8 text-center bg-[#0f141c] rounded-lg border border-white/10 text-gray-400 text-xs">
                No BMW centers found matching "{searchQuery}".
              </div>
            ) : (
              filteredDealers.map((dealer) => {
                const isSelected = activeDealer?.id === dealer.id;
                return (
                  <div
                    key={dealer.id}
                    onClick={() => setSelectedDealerId(dealer.id)}
                    className={`p-5 rounded-lg border transition cursor-pointer flex flex-col justify-between gap-4 ${
                      isSelected
                        ? 'bg-[#121926] border-[#1c69d4] shadow-md ring-1 ring-[#1c69d4]'
                        : 'bg-[#0f141c] border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-bold text-white font-display">
                          {dealer.name}
                        </h3>
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold shrink-0">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{dealer.rating}</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs text-gray-300">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#1c69d4] shrink-0" />
                          <span>
                            {dealer.address}, {dealer.city}, {dealer.region} {dealer.postalCode}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{dealer.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="text-[11px] text-gray-400">{dealer.hours}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onContactDealer(dealer.id);
                        }}
                        className="text-xs font-semibold text-gray-300 hover:text-white"
                      >
                        Contact Details
                      </button>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          onBookTestDriveAtDealer(dealer.id);
                        }}
                        leftIcon={<Calendar className="w-3.5 h-3.5" />}
                      >
                        Book Test Drive
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Interactive Map Canvas Simulation on Right */}
          <div className="lg:col-span-7 bg-[#0f141c] border border-white/10 rounded-lg overflow-hidden sticky top-28 space-y-4 p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#1c69d4]">
                Interactive Center Map
              </span>
              <span className="text-xs text-gray-400">
                {filteredDealers.length} Authorized Locations
              </span>
            </div>

            {/* Stylized Map Surface with GPS Nodes */}
            <div className="relative w-full h-[400px] bg-[#0a0d14] rounded-lg border border-white/10 overflow-hidden flex items-center justify-center p-6">
              {/* Map grid lines */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Pins representation */}
              {filteredDealers.map((d, idx) => {
                const isActive = activeDealer?.id === d.id;
                // Distributed visual offsets for demo map representation
                const leftPos = 20 + ((idx * 27) % 60);
                const topPos = 20 + ((idx * 33) % 60);

                return (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDealerId(d.id)}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all cursor-pointer group ${
                      isActive ? 'z-20 scale-125' : 'z-10 hover:scale-110'
                    }`}
                    style={{ left: `${leftPos}%`, top: `${topPos}%` }}
                    title={d.name}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shadow-xl border ${
                        isActive
                          ? 'bg-[#1c69d4] border-white text-white'
                          : 'bg-black/80 border-white/30 text-gray-300 group-hover:text-white'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>
                    {isActive && (
                      <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/20 whitespace-nowrap shadow-lg">
                        {d.city}
                      </div>
                    )}
                  </button>
                );
              })}

              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded text-[11px] text-gray-400 border border-white/10">
                BMW Certified Retailer Network (US & Global Hubs)
              </div>
            </div>

            {/* Selected Dealer Summary Highlight */}
            {activeDealer && (
              <div className="bg-[#080a0c] border border-white/10 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white">{activeDealer.name}</div>
                  <div className="text-xs text-gray-400">
                    {activeDealer.address}, {activeDealer.city}, {activeDealer.region} {activeDealer.postalCode}
                  </div>
                  <div className="text-xs text-[#1c69d4] font-semibold">{activeDealer.phone}</div>
                </div>

                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onBookTestDriveAtDealer(activeDealer.id)}
                  leftIcon={<Calendar className="w-3.5 h-3.5" />}
                >
                  Book at this Center
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
