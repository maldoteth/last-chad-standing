
import React, { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';

interface CloudinaryPlayerProps {
  cloudName: string;
  publicId: string;
  profile: string;
}

const CloudinaryPlayer = ({ cloudName, publicId, profile }: CloudinaryPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsUserInteraction, setNeedsUserInteraction] = useState(true);
  
  // Construct the Cloudinary player URL with autoplay parameter
  const playerUrl = `https://player.cloudinary.com/embed/?cloud_name=${cloudName}&public_id=${publicId}&profile=${profile}&autoplay=true`;
  
  // Handle iframe load complete
  const handleIframeLoad = () => {
    console.log('Cloudinary player loaded');
    setIsLoading(false);
  };

  // Handle play button click to initiate playback
  const handlePlayClick = () => {
    setNeedsUserInteraction(false);
    
    // Reload the iframe to trigger autoplay after user interaction
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentSrc;
        }
      }, 100);
    }
  };

  // Check if user interaction is needed based on browser autoplay policies
  useEffect(() => {
    // Most mobile browsers and some desktop browsers require user interaction for autoplay
    // We'll default to showing the play button, which will be hidden once playback starts
    const checkAutoplaySupport = async () => {
      try {
        // Create a test video element
        const video = document.createElement('video');
        video.muted = true;
        video.setAttribute('playsinline', '');
        video.src = 'data:video/mp4;base64,AAAAIGZ0eXBtcDQyAAAAAG1wNDJtcDQxaXNvbWF2YzEAAATKbW9vdgAAAGxtdmhkAAAAANLEP5XSxD+VAAB1MAAAdU4AAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAACFpb2RzAAAAABCAgIAQAE////9//w6AgIAEAAAAAQAABDV0cmFrAAAAXHRraGQAAAAH0sQ/ldLEP5UAAAABAAAAAAAAdU4AAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAIAAAACAAAAAABsW1kaWEAAAAgbWRoZAAAAADSxD+V0sQ/lQAAVcQAAK1lAAAAAAAAAABIaGRscgAAAAAAAAAAc291bgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABtaW5mAAAAEHNtaGQAAAAAAAAAAAAAAAAAACQAAAAAAAEAAAAAAUoBAAAAAAAlZGluZQAAABxlbmMAAAAAAAAAAAAAAAAAAAIAAAAAAAAACQAAAAAAAAHDbWQxYQAAACBtZGhkAAAAANLEP5XSxD+VAAB1MAAAdU4AAAAAAAAAJGZ0cmUAAAAAAAAAAAB2aWRlAAAAAAAAAAAAAAAAAAAAAHViZHRhAAAAG25hbQAAAAAAAAAAAAAAAAAAAAAEAE0AQwBPAE0AAQAXAQ==';
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
          await playPromise;
          // If playback started successfully, autoplay is supported
          setNeedsUserInteraction(false);
        }
      } catch (error) {
        // Autoplay was prevented, user interaction is needed
        console.log('Autoplay not supported, showing play button');
        setNeedsUserInteraction(true);
      }
    };
    
    checkAutoplaySupport();
  }, []);

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
        src={needsUserInteraction ? '' : playerUrl}
        className="absolute inset-0 w-full h-full" 
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        onLoad={handleIframeLoad}
        title="Cloudinary Player"
        frameBorder="0"
        loading="eager"
      ></iframe>
      
      {needsUserInteraction && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/70 cursor-pointer"
          onClick={handlePlayClick}
        >
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Play size={36} className="text-white ml-1" />
          </div>
          <p className="absolute bottom-1/4 text-white text-lg font-medium">Click to play</p>
        </div>
      )}
      
      {/* Dark overlay to improve text visibility */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />
    </div>
  );
};

export default CloudinaryPlayer;
