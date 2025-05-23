import React, { useEffect, useRef, useState } from 'react';

interface CloudinaryPlayerProps {
  cloudName: string;
  publicId: string;
  profile: string;
}

const CloudinaryPlayer = ({ cloudName, publicId, profile }: CloudinaryPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [player, setPlayer] = useState<any>(null);
  
  // Construct the Cloudinary player URL with autoplay parameter
  const playerUrl = `https://player.cloudinary.com/embed/?cloud_name=${cloudName}&public_id=${publicId}&profile=${profile}&autoplay=true&muted=true`;
  
  // Handle iframe load complete
  const handleIframeLoad = () => {
    console.log('Cloudinary player loaded');
    setIsLoading(false);
    
    // Initialize Cloudinary player
    if (iframeRef.current) {
      const cloudinaryPlayer = (window as any).cloudinary?.createPlayer(iframeRef.current);
      if (cloudinaryPlayer) {
        setPlayer(cloudinaryPlayer);
      }
    }
  };

  // Toggle mute status
  const toggleMute = () => {
    if (player) {
      const newMuteStatus = !isMuted;
      player.mute(newMuteStatus);
      setIsMuted(newMuteStatus);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
          <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
          <p className="text-white text-sm mt-4">Loading video...</p>
        </div>
      )}
      
      <iframe 
        ref={iframeRef}
        src={playerUrl}
        className="absolute inset-0 w-full h-full" 
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        onLoad={handleIframeLoad}
        title="Cloudinary Player"
        frameBorder="0"
        loading="eager"
      ></iframe>
      
      {/* Dark overlay to improve text visibility */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* Mute toggle button */}
      {!isLoading && (
        <button
          onClick={toggleMute}
          className="absolute bottom-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
};

export default CloudinaryPlayer;
