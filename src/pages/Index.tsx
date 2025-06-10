
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
        {/* Game Title in top left */}
        <div className="absolute top-4 left-4 pointer-events-auto">
          <img 
            src="/lovable-uploads/048eb62f-cb05-478b-a60a-5dc0bb43b721.png" 
            alt="Last Chad Standing"
            className="h-16 md:h-20 lg:h-24 w-auto animate-fade-in"
          />
        </div>
        
        {/* Social Links positioned at the top */}
        <div className="pt-8 pb-4 pointer-events-auto">
          <SocialLinks className="animate-fade-in" />
        </div>
        
        {/* Game Title/Logo (if needed) */}
        <div className="flex-grow flex items-center justify-center">
          {/* Optional: Add your game logo/title here */}
        </div>
      </div>
    </div>
  );
};

export default Index;
