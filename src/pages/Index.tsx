
import React from 'react';
import SocialLinks from '@/components/SocialLinks';
import OrientationPrompt from '@/components/OrientationPrompt';
import CloudinaryPlayer from '@/components/CloudinaryPlayer';

// Cloudinary player configuration
const CLOUDINARY_CONFIG = {
  cloudName: 'drqvsqsot',
  publicId: 'LCS_TEASER_1_1_wlqwnc',
  profile: '' // Remove the profile since it's causing errors
};

const Index = () => {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Cloudinary Player Background */}
      <CloudinaryPlayer 
        cloudName={CLOUDINARY_CONFIG.cloudName}
        publicId={CLOUDINARY_CONFIG.publicId}
        profile={CLOUDINARY_CONFIG.profile}
      />
      
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
          
          {/* Optional: Add game copyright or other info */}
          <div className="text-center mt-6 text-sm text-white/60">
            © 2024 DeHub Games. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
