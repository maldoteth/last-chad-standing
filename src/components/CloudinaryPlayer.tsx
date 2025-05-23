import React, { useEffect, useRef, useState } from 'react';

interface CloudinaryPlayerProps {
  cloudName: string;
  publicId: string;
  profile: string;
}

const CloudinaryPlayer = ({ cloudName, publicId, profile }: CloudinaryPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Construct the Cloudinary player URL with autoplay parameter and controls enabled
  const playerUrl = `https://player.cloudinary.com/embed/?cloud_name=${cloudName}&public_id=${publicId}&profile=${profile}&autoplay=true&muted=true&controls=true&show_controls=true`;
  
  // Handle iframe load complete
  const handleIframeLoad = () => {
    console.log('Cloudinary player loaded');
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20">
          <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
          <p className="text-white text-sm mt-4">Loading video...</p>
        </div>
      )}
      
      {/* Dark overlay with reduced opacity */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      
      <iframe 
        ref={iframeRef}
        src={playerUrl}
        className="absolute inset-0 w-full h-full z-10" 
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        onLoad={handleIframeLoad}
        title="Cloudinary Player"
        frameBorder="0"
        loading="eager"
      ></iframe>
    </div>
  );
};

export default CloudinaryPlayer;
