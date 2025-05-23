
import React, { useRef } from 'react';
import SocialLinks from '@/components/SocialLinks';
import OrientationPrompt from '@/components/OrientationPrompt';
import CloudinaryPlayer from '@/components/CloudinaryPlayer';

// Cloudinary player configuration
const CLOUDINARY_CONFIG = {
  cloudName: 'drqvsqsot',
  publicId: 'LCS_TEASER_1_1_wlqwnc',
  profile: 'cld-default'
};

const Index = () => {

  const playerRef = useRef<any>(null);

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;
  };

  const playVideo = () => {
    if (playerRef.current) {
      playerRef.current.play();
    }
  };

  const pauseVideo = () => {
    if (playerRef.current) {
      playerRef.current.pause();
    }
  };

  const toggleMute = () => {
    if (playerRef.current) {
      const currentlyMuted = playerRef.current.muted();
      playerRef.current.muted(!currentlyMuted);
    }
  };

  return <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Cloudinary Player Background */}
      <CloudinaryPlayer cloudName={CLOUDINARY_CONFIG.cloudName} publicId={CLOUDINARY_CONFIG.publicId} profile={CLOUDINARY_CONFIG.profile} onPlayerReady={handlePlayerReady} />
      
      {/* Mobile Orientation Prompt */}
      <OrientationPrompt />
      
      {/* Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Game Title/Logo (if needed) */}
        <div className="flex-grow flex items-center justify-center">
          {/* Optional: Add your game logo/title here */}
        </div>
        
        {/* Social Links positioned in the bottom third */}
        <div className="pb-12">
          <SocialLinks className="animate-fade-in" />
          
          {/* Copyright info */}
          <div className="text-center mt-6 text-sm text-white/60 my-[20px]">
            © 2024 DeHub Games
          </div>
        </div>
      </div>
    </div>;
};

export default Index;
