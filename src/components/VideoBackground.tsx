
import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface VideoBackgroundProps {
  videoUrl: string;
}

const VideoBackground = ({ videoUrl }: VideoBackgroundProps) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle video initialization
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      // Attempt autoplay
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Autoplay prevented:', error);
        });
      }
    }
  }, [videoRef]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <video 
        ref={videoRef}
        className="absolute min-h-full min-w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div className="absolute bottom-4 right-4 z-10">
        <button 
          onClick={toggleMute}
          className="bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>
      
      {/* Dark overlay to improve text visibility */}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
};

export default VideoBackground;
