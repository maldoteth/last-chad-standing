
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
  const progressIntervalRef = useRef<number | null>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Reset and start a simulated loading progress
  const startSimulatedProgress = () => {
    // Clear any existing interval
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
    }
    
    setLoadProgress(0);
    let simulatedProgress = 0;
    
    progressIntervalRef.current = window.setInterval(() => {
      // Simulate progress with diminishing returns (faster at start, slower as it approaches 90%)
      const increment = Math.max(1, 10 * (1 - simulatedProgress / 100));
      simulatedProgress = Math.min(90, simulatedProgress + increment);
      setLoadProgress(simulatedProgress);
    }, 300);
  };

  // Handle video initialization and loading progress
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      
      // Start simulated progress immediately
      startSimulatedProgress();
      
      // Add event listeners to track video loading states
      const handleCanPlay = () => {
        console.log('Video can play now');
        
        // Clear simulated progress interval
        if (progressIntervalRef.current) {
          window.clearInterval(progressIntervalRef.current);
        }
        
        setIsLoading(false);
        setLoadProgress(100);
      };
      
      const handleLoadStart = () => {
        console.log('Video load started');
        setIsLoading(true);
      };
      
      const handleLoadedData = () => {
        console.log('Video data loaded');
        setLoadProgress(70); // Set to at least 70% when we have some data
      };
      
      const handleProgress = () => {
        if (videoRef.current && videoRef.current.buffered.length > 0 && videoRef.current.duration) {
          try {
            // Calculate the percentage of video loaded
            const bufferedEnd = videoRef.current.buffered.end(0);
            const duration = videoRef.current.duration;
            const percent = Math.floor((bufferedEnd / duration) * 100);
            
            // Only update if the calculated percentage is valid and higher than current
            if (!isNaN(percent) && percent > loadProgress) {
              setLoadProgress(percent);
            }
          } catch (e) {
            console.error('Error calculating buffer progress:', e);
          }
        }
      };
      
      const handleError = (e: any) => {
        console.error('Video loading error:', e);
        setHasError(true);
        setIsLoading(false);
        
        // Clear simulated progress interval
        if (progressIntervalRef.current) {
          window.clearInterval(progressIntervalRef.current);
        }
      };
      
      videoRef.current.addEventListener('loadstart', handleLoadStart);
      videoRef.current.addEventListener('canplay', handleCanPlay);
      videoRef.current.addEventListener('loadeddata', handleLoadedData);
      videoRef.current.addEventListener('progress', handleProgress);
      videoRef.current.addEventListener('error', handleError);
      
      // Attempt autoplay
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Autoplay prevented:', error);
          // Auto-retry after a short delay
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.play().catch(e => console.error('Retry autoplay failed:', e));
            }
          }, 1000);
        });
      }
      
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('loadstart', handleLoadStart);
          videoRef.current.removeEventListener('canplay', handleCanPlay);
          videoRef.current.removeEventListener('loadeddata', handleLoadedData);
          videoRef.current.removeEventListener('progress', handleProgress);
          videoRef.current.removeEventListener('error', handleError);
        }
        
        // Clear interval on unmount
        if (progressIntervalRef.current) {
          window.clearInterval(progressIntervalRef.current);
        }
      };
    }
  }, [videoRef, isMuted, loadProgress]);

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
        preload="auto"
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
