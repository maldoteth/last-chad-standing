import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import SocialLinks from '@/components/SocialLinks';

const STORAGE_KEY = 'lcs_landing_seen';

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
  const [isMuted, setIsMuted] = useState(true);
  const [showMain, setShowMain] = useState(false);
  const [closing, setClosing] = useState(false);
  const introRef = useRef<HTMLVideoElement>(null);
  const mainRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!visible) return;
    const mainVideo = mainRef.current;
    if (mainVideo) {
      mainVideo.load();
    }
  }, [visible]);

  const handleIntroEnd = () => {
    setShowMain(true);
    mainRef.current?.play().catch(() => {});
  };

  const handleEnter = () => {
    setClosing(true);
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, 'true');
      setVisible(false);
    }, 500);
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (introRef.current) introRef.current.muted = newMuted;
    if (mainRef.current) mainRef.current.muted = newMuted;
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-end bg-black transition-transform duration-500 ease-in-out ${closing ? '-translate-y-full' : 'translate-y-0'}`}
    >
      {/* Top-right buttons */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
        <button
          onClick={toggleMute}
          className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
        </button>
        <button
          onClick={handleEnter}
          className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Main Video */}
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

      {/* Intro Video */}
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

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

      {/* Bottom CTAs */}
      <div className="relative z-10 flex flex-col items-center pb-8 px-4" onClick={(e) => {
        const target = e.target as HTMLElement;
        const link = target.closest('[aria-label]');
        if (link) {
          const label = link.getAttribute('aria-label');
          if (label === 'Game' || label === 'Documentation') {
            handleEnter();
          }
        }
      }}>
        <SocialLinks />
      </div>
    </div>
  );
};

export default LandingOverlay;
