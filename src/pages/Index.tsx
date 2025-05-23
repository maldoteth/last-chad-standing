import React from 'react';
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
  return <div className="relative bg-black text-white overflow-hidden">
      {/* Cloudinary Player Background */}
      <CloudinaryPlayer cloudName={CLOUDINARY_CONFIG.cloudName} publicId={CLOUDINARY_CONFIG.publicId} profile={CLOUDINARY_CONFIG.profile} />
      
      {/* Mobile Orientation Prompt */}
      <OrientationPrompt />
      
      {/* Content Container - Changed positioning to avoid blocking player controls */}
      <div className="relative z-10 flex flex-col h-screen pointer-events-none">
        {/* Game Title/Logo (if needed) */}
        <div className="flex-grow flex items-center justify-center">
          {/* Optional: Add your game logo/title here */}
        </div>
        
        {/* Social Links positioned to avoid player controls - Added mb-20 for more bottom margin */}
        <div className="pb-12 mb-20 pointer-events-auto">
          <SocialLinks className="animate-fade-in" />
          
          {/* Copyright info */}
          
        </div>
      </div>
    </div>;
};
export default Index;