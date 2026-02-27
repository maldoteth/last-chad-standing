import React, { useState, useEffect } from 'react';
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
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-end bg-black cursor-pointer"
      onClick={handleEnter}
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      >
        <source src="/videos/landing-overlay.mp4" type="video/mp4" />
      </video>

      {/* Gradient fade at bottom for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

      {/* Bottom CTAs */}
      <div className="relative z-10 flex flex-col items-center pb-8 px-4" onClick={(e) => e.stopPropagation()}>
        <SocialLinks />
      </div>
    </div>
  );
};

export default LandingOverlay;
