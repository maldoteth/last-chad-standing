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
  
  // Construct the Cloudinary player URL with autoplay parameter
  const playerUrl = `https://player.cloudinary.com/embed/?cloud_name=${cloudName}&public_id=${publicId}&profile=${profile}&autoplay=true&muted=true`;
  
  useEffect(() => {
    // Listen for messages from the Cloudinary player iframe
    const handleMessage = (event: MessageEvent) => {
      // Check if the message is from Cloudinary player
      if (event.origin.includes('cloudinary.com')) {
        try {
          const data = JSON.parse(event.data);
          
          // Handle play/pause events
          if (data.event === 'play' || data.event === 'pause') {
            // Toggle mute state when play/pause button is clicked
            if (iframeRef.current) {
              const newMuteState = !isMuted;
              iframeRef.current.contentWindow?.postMessage(
                JSON.stringify({
                  method: 'mute',
                  value: newMuteState
                }),
                '*'
              );
              setIsMuted(newMuteState);
            }
          }
        } catch (error) {
          console.error('Error parsing Cloudinary player message:', error);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isMuted]);

  // Handle iframe load complete
  const handleIframeLoad = () => {
    console.log('Cloudinary player loaded');
    setIsLoading(false);
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
    </div>
  );
};

export default CloudinaryPlayer;
