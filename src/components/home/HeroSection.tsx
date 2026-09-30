import React, { useState, useEffect } from 'react';
import { ArrowRight, Pause, Play } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (view: string, params?: { modelSlug?: string }) => void;
}

const HERO_SLIDES = [
  {
    modelName: 'BMW 5 Series',
    modelSlug: '5-series',
    badge: 'BMW 5 SERIES',
    headline: 'Performance.\nLuxury. Innovation.',
    subhead: 'At BMW, we build more than cars. We create driving experiences that inspire.',
    price: '$56,900',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzxCgYD6Z4Kg62aPPG1eAXnP69tg0WECrs2rOx1vunXmTcq_Poi5DaQFaTDyx6GL6sOPHSuorYGSlh1wLCcmzMriQCU-epJA0g9sRMvhEAb1qE37CIIG4x17vm4lRQESVF3QMlchcxdN4N5dtxLchDHeIvKQXA5-vVJh409r_-Wtk2UokpwGSDPyspGenE6jQcSRdyW-LyxSgQbPNSCaS7D-ezrEZ5SkQ14FUOEpSZv1lp8qLqZdkI',
  },
  {
    modelName: 'BMW i5 / iX',
    modelSlug: 'i5-ix',
    badge: 'ALL-ELECTRIC i5',
    headline: 'Electric Pulse.\nUncompromised.',
    subhead: 'Next-generation electric dynamics with up to 372 miles of pure range and iconic Hans Zimmer soundscapes.',
    price: '$67,900',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByZ1kqgML7LG4u95gSX21UnuwV89hDPSJrhTpb15q3yaI7ByCsixv0fYlNDRUmwtIZ1NIY93nwuzqhK-JQ7bd5ZyQ4mosv-6BUepBQoJ3MTOj6UqPJHDKFCHl0sDa110dF-0BOXM4zPfshCG9Tfjof-ZgpugYYWkJW8Fbogf7rvPjK-j9qeMlWp7tUmHNGPodA1tPgqUMRgPEIapNsEL6j4JLM31jm2bU55JMyGsoKsX1iuzvz1RpU',
  },
  {
    modelName: 'The New BMW X5',
    modelSlug: 'x5',
    badge: 'BMW X5 SAV',
    headline: 'Commanding Power.\nUnlimited Horizon.',
    subhead: 'The benchmark of luxury SAVs. Experience Plug-in Hybrid freedom with up to 50 miles electric range.',
    price: '$65,900',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkUvBiPhkon5I2eDNgD6JY3HpA2t2_vNiMz3_tGo6zPH12BUI5H04XLgXNivnQbqfWxico_vdPW5_d0OfHPdKZVA5meoXZmugF3s95qtsO7Plieswwg5SG9HmeDha6Sq2U3l8Upyb8nXQ04-WeI32RmhvABbLJrsQZ6ZtZJ0Lq2h3aqViAUdMmnKUBw4qsQnGKd_ByKc3CSvznHRjw39PiO7wb7KApA0U1g1bH2TzLAXO_o7Z7knPT',
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const slide = HERO_SLIDES[currentSlideIndex];

  return (
    <section className="relative min-h-[92vh] flex items-end pb-20 pt-32 overflow-hidden bg-[#0a0d12]">
      {/* Hero Background Visual with crossfade */}
      <div className="absolute inset-0 z-0">
        <img
          key={slide.image}
          alt={`${slide.modelName} visual background`}
          className="w-full h-full object-cover object-[center_42%] transition-opacity duration-1000 animate-fadeIn"
          src={slide.image}
        />
        {/* Dramatic Atmospheric Gradient Mask */}
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Centered Car Floating Badge Marker */}
      <div className="absolute top-[48%] left-[64%] -translate-x-1/2 -translate-y-1/2 hidden lg:flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 border border-white/20 rounded text-[11px] font-semibold tracking-wider text-gray-200 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1c69d4] animate-ping" />
        <span>{slide.badge}</span>
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-[1536px] w-full mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-end justify-between gap-10">
        {/* Text & CTA Block */}
        <div className="max-w-2xl">
          <p className="text-[12px] uppercase font-bold tracking-[0.25em] text-gray-300 mb-3.5">
            The Ultimate Driving Machine.
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5 leading-[1.08] whitespace-pre-line font-display">
            {slide.headline}
          </h1>
          <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed mb-9 max-w-xl">
            {slide.subhead}
          </p>

          {/* CTAs Group */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate('models')}
              className="inline-flex items-center justify-center gap-2 bg-[#1c69d4] hover:bg-[#0053b8] text-white text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded transition-all duration-200 cursor-pointer shadow-lg"
            >
              <span>Explore Models</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('configurator', { modelSlug: slide.modelSlug })}
              className="inline-flex items-center justify-center gap-2 bg-black/40 hover:bg-white/10 backdrop-blur-sm border border-white/30 hover:border-white text-white text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded transition-all duration-200 cursor-pointer"
            >
              <span>Build Your BMW</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('test-drive')}
              className="inline-flex items-center justify-center gap-2 bg-transparent hover:text-white text-gray-300 border border-white/20 hover:border-white/50 text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded transition-all duration-200 cursor-pointer"
            >
              <span>Book a Test Drive</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Bottom-Right Info & Slider Controls */}
        <div className="w-full lg:w-auto flex flex-col items-start lg:items-end gap-3 text-right">
          <div className="flex items-center gap-2 text-xs text-gray-300 mb-1">
            <div className="text-right">
              <span className="font-bold text-white tracking-wide block">{slide.modelName}</span>
              <span className="text-gray-400 text-[11px]">Starting from {slide.price}</span>
            </div>
            <button
              onClick={() => setIsPaused(!isPaused)}
              aria-label={isPaused ? 'Play slide rotation' : 'Pause slide rotation'}
              className="ml-3 p-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Carousel Dots Indicator */}
          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`rounded-full transition-all cursor-pointer ${
                  currentSlideIndex === idx
                    ? 'w-6 h-2 bg-white'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
