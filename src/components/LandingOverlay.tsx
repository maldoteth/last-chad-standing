import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import SocialLinks from '@/components/SocialLinks';

const STORAGE_KEY = 'lcs_landing_seen';

// Check synchronously to avoid flash
const hasSeenLanding = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

const LandingOverlay = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(() => location.pathname === '/' && !hasSeenLanding());
  const [showMain, setShowMain] = useState(false);
  const introRef = useRef<HTMLVideoElement>(null);
  const mainRef = useRef<HTMLVideoElement>(null);

  // Preload the main video as soon as component mounts
  useEffect(() => {
    if (!visible) return;
    const mainVideo = mainRef.current;
    if (mainVideo) {
      mainVideo.load();
    }
  }, [visible]);

  const handleIntroEnd = () => {
    // Only switch to main video AFTER intro fully finishes
    setShowMain(true);
    mainRef.current?.play().catch(() => {});
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
      {/* Main Video - always mounted, hidden until intro ends */}
      <video
        ref={mainRef}
        loop
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${showMain ? 'opacity-100' : 'opacity-0'}`}
      >
        <source src="/videos/landing-overlay.mp4" type="video/mp4" />
      </video>

      {/* Intro Video - stays visible until it fully ends */}
      {!showMain && (
        <video
          ref={introRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          
          onEnded={handleIntroEnd}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        >
          <source src="/videos/landing-intro.mp4" type="video/mp4" />
        </video>
      )}

      {/* Gradient fade at bottom for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

      {/* Bottom CTAs */}
      <div className="relative z-10 flex flex-col items-center pb-8 px-4" onClick={(e) => {
        e.stopPropagation();
        // Check if the clicked element or its parent is the Game link
        const target = e.target as HTMLElement;
        const link = target.closest('a, [aria-label]');
        if (link && (link.getAttribute('aria-label') === 'Game' || link.closest('[aria-label="Game"]'))) {
          e.preventDefault();
          handleEnter();
        }
      }}>
        <SocialLinks />
      </div>
    </div>
  );
};

export default LandingOverlay;
