
import React from 'react';
import VideoBackground from '@/components/VideoBackground';
import SocialLinks from '@/components/SocialLinks';
import OrientationPrompt from '@/components/OrientationPrompt';

// Using direct Google Drive download link
const TRAILER_VIDEO_URL = 'https://drive.google.com/uc?export=download&id=1kcVK_cO7ZIuwMk9bR2hvaZZ28g_eBi56';

const Index = () => {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Video Background */}
      <VideoBackground videoUrl={TRAILER_VIDEO_URL} />
      
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
            © 2024 Your Game Studio. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
