
import React, { useEffect, useRef, useState } from 'react';

interface CloudinaryPlayerProps {
  cloudName: string;
  publicId: string;
  profile: string;
}

const CloudinaryPlayer = ({ cloudName, publicId, profile }: CloudinaryPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Construct the Cloudinary player URL with proper control parameters
  const playerUrl = `https://player.cloudinary.com/embed/?cloud_name=${cloudName}&public_id=${publicId}&profile=${profile}&autoplay=true&muted=true&controls=true&show_controls=true&fluid=false&hide_context_menu=false&interaction=true`;
  
  // Handle iframe load complete
  const handleIframeLoad = () => {
    console.log('Cloudinary player loaded');
    setIsLoading(false);
    
    // Additional debugging for iframe interaction
    if (iframeRef.current) {
      console.log('Iframe element:', iframeRef.current);
      console.log('Iframe computed style:', window.getComputedStyle(iframeRef.current));
    }
  };

  // Prevent iframe from interfering with parent page mutations
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      // Ensure iframe is properly isolated but clickable
      iframe.setAttribute('data-lovable-ignore', 'true');
      
      // Add click event listener to debug interactions
      const handleIframeClick = (e: Event) => {
        console.log('Iframe clicked:', e);
      };
      
      iframe.addEventListener('click', handleIframeClick);
      
      return () => {
        iframe.removeEventListener('click', handleIframeClick);
      };
    }
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20 pointer-events-auto">
          <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
          <p className="text-white text-sm mt-4">Loading video...</p>
        </div>
      )}
      
      <iframe 
        ref={iframeRef}
        src={playerUrl}
        className="absolute inset-0 w-full h-full z-10 pointer-events-auto" 
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write; web-share; camera; microphone"
        onLoad={handleIframeLoad}
        title="Cloudinary Player"
        loading="eager"
        data-lovable-ignore="true"
        style={{ 
          pointerEvents: 'auto',
          border: 'none',
          outline: 'none',
          touchAction: 'auto'
        }}
        sandbox="allow-scripts allow-same-origin allow-presentation allow-forms allow-pointer-lock allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
};

export default CloudinaryPlayer;
