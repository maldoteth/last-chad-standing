
import React, { useEffect, useRef, useState } from 'react';

interface CloudinaryPlayerProps {
  cloudName: string;
  publicId: string;
  profile: string;
}

const CloudinaryPlayer = ({ cloudName, publicId, profile }: CloudinaryPlayerProps) => {
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load Cloudinary SDK script dynamically
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/cloudinary-video-player@1.9.9/dist/cld-video-player.min.js';
    script.async = true;
    
    script.onload = () => {
      if (playerContainerRef.current && window.cloudinary) {
        // Clear any existing content in the container
        playerContainerRef.current.innerHTML = '';
        
        // Create a new video element
        const videoElement = document.createElement('video');
        videoElement.id = 'cloudinary-player';
        videoElement.className = 'cld-video-player cld-fluid';
        playerContainerRef.current.appendChild(videoElement);
        
        // Initialize the player
        const player = window.cloudinary.videoPlayer('cloudinary-player', {
          cloud_name: cloudName,
          controls: true,
          autoplayMode: 'always',
        });
        
        // Load the video
        player.source(publicId, {
          sourceTypes: ['hls'],
          transformation: {
            streaming_profile: profile
          }
        });
        
        // Handle player events
        player.on('started', () => {
          console.log('Video playback started');
          setIsLoading(false);
        });
        
        player.on('error', (error: any) => {
          console.error('Cloudinary player error:', error);
        });
      }
    };
    
    script.onerror = () => {
      console.error('Failed to load Cloudinary player SDK');
    };
    
    document.head.appendChild(script);
    
    // Load CSS for the player
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/cloudinary-video-player@1.9.9/dist/cld-video-player.min.css';
    document.head.appendChild(link);
    
    // Cleanup function
    return () => {
      document.head.removeChild(script);
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [cloudName, publicId, profile]);
  
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
          <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
          <p className="text-white text-sm mt-4">Loading video...</p>
        </div>
      )}
      
      <div 
        ref={playerContainerRef}
        className="absolute inset-0 w-full h-full"
      ></div>
      
      {/* Dark overlay to improve text visibility */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />
    </div>
  );
};

// Add type declaration for Cloudinary SDK
declare global {
  interface Window {
    cloudinary: {
      videoPlayer: (
        elementId: string, 
        options: {
          cloud_name: string;
          controls: boolean;
          autoplayMode: string;
        }
      ) => {
        source: (
          publicId: string, 
          options: {
            sourceTypes: string[];
            transformation: {
              streaming_profile: string;
            };
          }
        ) => void;
        on: (event: string, callback: (error?: any) => void) => void;
      };
    };
  }
}

export default CloudinaryPlayer;
