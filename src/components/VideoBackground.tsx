
import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface VideoBackgroundProps {
  videoUrl: string;
}

const VideoBackground = ({ videoUrl }: VideoBackgroundProps) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle video initialization and loading progress
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      
      // Add event listeners to track video loading states
      const handleCanPlay = () => {
        console.log('Video can play now');
        setIsLoading(false);
        setLoadProgress(100);
      };
      
      const handleProgress = () => {
        if (videoRef.current && videoRef.current.buffered.length > 0 && videoRef.current.duration) {
          // Calculate the percentage of video loaded
          const bufferedEnd = videoRef.current.buffered.end(0);
          const duration = videoRef.current.duration;
          const percent = Math.floor((bufferedEnd / duration) * 100);
          setLoadProgress(percent);
        }
      };
      
      const handleError = (e: any) => {
        console.error('Video loading error:', e);
        setHasError(true);
        setIsLoading(false);
      };
      
      videoRef.current.addEventListener('canplay', handleCanPlay);
      videoRef.current.addEventListener('progress', handleProgress);
      videoRef.current.addEventListener('error', handleError);
      
      // Set an interval to periodically check the loading progress
      const progressInterval = setInterval(() => {
        handleProgress();
      }, 500);
      
      // Attempt autoplay
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Autoplay prevented:', error);
        });
      }
      
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('canplay', handleCanPlay);
          videoRef.current.removeEventListener('progress', handleProgress);
          videoRef.current.removeEventListener('error', handleError);
          clearInterval(progressInterval);
        }
      };
    }
  }, [videoRef, isMuted]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
          <div className="w-64 mb-4">
            <Progress value={loadProgress} className="h-2" />
          </div>
          <p className="text-white text-sm">{loadProgress}% loaded</p>
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-red-500 text-center p-4">
            <p>Error loading video.</p>
            <p className="text-sm mt-2">Please check the video URL and try again.</p>
          </div>
        </div>
      )}
      
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
      
      {!isLoading && !hasError && (
        <div className="absolute bottom-4 right-4 z-10">
          <button 
            onClick={toggleMute}
            className="bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
      )}
      
      {/* Dark overlay to improve text visibility */}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
};

export default VideoBackground;
