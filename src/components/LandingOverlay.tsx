import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import SocialLinks from '@/components/SocialLinks';

const STORAGE_KEY = 'lcs_landing_seen';

const LandingOverlay = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setVisible(true);
    }
  }, []);

  const handleEnter = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-end bg-black">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/LCS_TEASER_1.mp4" type="video/mp4" />
      </video>

      {/* Gradient fade at bottom for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

      {/* Bottom CTAs */}
      <div className="relative z-10 flex flex-col items-center gap-6 pb-12 px-4">
        <SocialLinks />
        <Button
          onClick={handleEnter}
          size="lg"
          className="px-12 py-6 text-lg font-bold rounded-full bg-white text-black hover:bg-white/90 transition-all hover:scale-105"
        >
          Enter App
        </Button>
      </div>
    </div>
  );
};

export default LandingOverlay;
