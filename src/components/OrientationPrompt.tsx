
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const OrientationPrompt = () => {
  const isMobile = useIsMobile();
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    // Check on mount and when window resizes
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!isMobile || !isPortrait) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="text-white text-center p-4">
        <div className="mb-6">
          <div className="w-20 h-36 mx-auto border-2 border-white rounded-lg relative">
            <div className="w-2 h-2 bg-white rounded-full absolute top-2 left-1/2 transform -translate-x-1/2"></div>
            {/* Phone animation */}
            <div className="absolute inset-2 flex items-center justify-center animate-pulse">
              <div className="rotate-90 transform origin-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="64" 
                  height="64" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="animate-bounce"
                >
                  <path d="M13 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z"></path>
                  <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Rotate Your Device</h2>
        <p className="text-white/80">For the best experience, please rotate your device to landscape mode.</p>
      </div>
    </div>
  );
};

export default OrientationPrompt;
