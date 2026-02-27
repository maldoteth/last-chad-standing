import React, { useState, useEffect, useRef } from 'react';
import SocialLinks from '@/components/SocialLinks';

const STORAGE_KEY = 'lcs_landing_seen';

const LandingOverlay = () => {
  const [visible, setVisible] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<'intro' | 'main'>('intro');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setVisible(true);
    }
  }, []);

  const handleIntroEnd = () => {
    setCurrentVideo('main');
  };

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
      {/* Intro Video - plays once first */}
      {currentVideo === 'intro' && (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onEnded={handleIntroEnd}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        >
          <source src="/videos/landing-intro.mp4" type="video/mp4" />
        </video>
      )}

      {/* Main Video - loops after intro */}
      {currentVideo === 'main' && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        >
          <source src="/videos/landing-overlay.mp4" type="video/mp4" />
        </video>
      )}

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
