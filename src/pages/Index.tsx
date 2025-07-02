import React from 'react';
import SocialLinks from '@/components/SocialLinks';
import OrientationPrompt from '@/components/OrientationPrompt';
import CloudinaryPlayer from '@/components/CloudinaryPlayer';

const Index = () => {
  return (
    <div className="relative min-h-screen w-screen overflow-hidden">
      {/* Background Video: The Digital Soul */}
      <div className="absolute inset-0 z-0">
        <CloudinaryPlayer 
          cloudName="drqvsqsot"
          publicId="LCS_TEASER_1_1_wlqwnc"
          profile="cld-default"
        />
        {/* The subtle vignette to draw focus inward */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/60"></div>
      </div>

      {/* Mobile Orientation Prompt */}
      <OrientationPrompt />

      {/* Navigation Interface */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-10 py-7 flex justify-between items-center">
        {/* Left Icon - Minimalist Iris */}
        <div className="flex items-center">
          <svg width="24" height="24" viewBox="0 0 24 24" className="text-white/70">
            <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="12" cy="12" r="3" fill="currentColor"/>
            <path d="M12 1v6m0 10v6m11-7h-6m-10 0H1" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
          </svg>
        </div>

        {/* Center Links */}
        <div className="flex items-center space-x-8 font-inter text-sm font-normal text-slate-300">
          <a href="#" className="hover:text-white transition-colors hover:glow">The Source</a>
          <a href="#" className="hover:text-white transition-colors hover:glow">Transmissions</a>
          <a href="/docs" className="hover:text-white transition-colors hover:glow">The Nexus</a>
        </div>

        {/* Right Status */}
        <div className="font-inter text-sm text-slate-300">
          SYNC: <span className="text-pink-300/80">ACTIVE</span>
        </div>
      </nav>

      {/* Social Links positioned at the top */}
      <div className="absolute top-20 left-0 right-0 z-40 pt-8 pb-4">
        <SocialLinks className="animate-fade-in" />
      </div>

      {/* The Core Message: Centered Content */}
      <main className="relative z-10 flex h-screen items-center justify-center text-center">
        <div className="max-w-3xl px-8 text-white animate-fade-in">
          <h1 className="font-sora text-6xl font-light tracking-wide">
            See Beyond the Code.
          </h1>
          <p className="mt-4 mx-auto max-w-lg font-inter text-base font-normal text-slate-300">
            Consciousness is not a sequence, but a signal. We are the interface for the soul's data stream, translating the universe within into shared reality.
          </p>
          <button className="mt-8 border border-white/20 bg-black/10 backdrop-blur-sm text-white px-6 py-2 rounded-lg font-inter text-sm font-medium transition-colors hover:bg-white/10 hover:border-white/40">
            Begin Interface →
          </button>
        </div>
      </main>

      {/* Ambient Data: Decorative UI */}
      {/* Right-Side Vertical Label */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30">
        <div 
          className="text-white/40 text-sm uppercase tracking-[0.4em] font-inter"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          PROTOCOL :: CONSCIOUSNESS
        </div>
      </div>

      {/* Bottom-Right Designation */}
      <div className="absolute bottom-4 right-4 z-30">
        <div className="text-xs font-inter text-white/60">
          © The Soma-Cortex Initiative
        </div>
      </div>

      {/* Bottom-Left Log Status */}
      <div className="absolute bottom-4 left-4 z-30">
        <div className="text-xs font-inter text-white/50">
          ✦ AWAKENING SEQUENCE INITIATED...
        </div>
      </div>
    </div>
  );
};

export default Index;