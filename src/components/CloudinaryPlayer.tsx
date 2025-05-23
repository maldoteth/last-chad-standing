import React, { useEffect, useRef, useState } from 'react';

interface CloudinaryPlayerProps {
  cloudName: string;
  publicId: string;
  profile: string;
  onPlayerReady?: (player: any) => void;
}

declare global {
  interface Window {
    cloudinary: any;
  }
}

const CloudinaryPlayer = ({ cloudName, publicId, profile, onPlayerReady }: CloudinaryPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load Cloudinary SDK if not already loaded
    if (!window.cloudinary) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/cloudinary-core/cloudinary-core-shrinkwrap.min.js';
      script.async = true;
      script.onload = initializePlayer;
      document.body.appendChild(script);
    } else {
      initializePlayer();
    }

    return () => {
      // Clean up player
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [cloudName, publicId, profile]);

  const initializePlayer = () => {
    const player = window.cloudinary.videoPlayer(videoRef.current!, {
      cloud_name: cloudName,
      publicId: publicId,
      profile: profile,
      autoplay: true,
      muted: true,
      controls: true,
      playsinline: true
    });

    playerRef.current = player;

    player.on('loadedmetadata', () => {
      console.log('Cloudinary player ready');
      setIsLoading(false);
      if (onPlayerReady) onPlayerReady(player);
    });

    player.on('error', (error: any) => {
      console.error('Player error:', error);
    });
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
          <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
          <p className="text-white text-sm mt-4">Loading video...</p>
        </div>
      )}
      
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full"
        playsInline
      />
      
      {/* Dark overlay to improve text visibility */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />
    </div>
  );
};

export default CloudinaryPlayer;