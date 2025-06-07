
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
  return (
    <div className="relative bg-black text-white overflow-hidden">
      {/* Cloudinary Player Background */}
      <CloudinaryPlayer 
        cloudName={CLOUDINARY_CONFIG.cloudName} 
        publicId={CLOUDINARY_CONFIG.publicId} 
        profile={CLOUDINARY_CONFIG.profile} 
      />
      
      {/* Mobile Orientation Prompt */}
      <OrientationPrompt />
      
      {/* Content Container - Changed positioning to avoid blocking player controls */}
      <div className="relative z-10 flex flex-col h-screen pointer-events-none">
        {/* Social Links positioned at the top */}
        <div className="pt-8 pb-4 pointer-events-auto">
          <SocialLinks className="animate-fade-in" />
        </div>
        
        {/* Spacer to push content to bottom third */}
        <div className="flex-grow"></div>
        
        {/* Game Title positioned in the bottom third */}
        <div className="flex items-center justify-center pb-16 pointer-events-auto">
          <img 
            src="/lovable-uploads/f654d26f-b781-41e0-9155-bb36713c7513.png" 
            alt="Last Chad Standing"
            className="w-full max-w-2xl px-8 animate-fade-in"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
