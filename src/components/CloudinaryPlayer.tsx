
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
  const playerUrl = `https://player.cloudinary.com/embed/?cloud_name=${cloudName}&public_id=${publicId}&profile=${profile}&autoplay=true&muted=true&controls=true&show_controls=true&fluid=false&hide_context_menu=false`;
  
  // Handle iframe load complete
  const handleIframeLoad = () => {
    console.log('Cloudinary player loaded');
    setIsLoading(false);
  };

  // Prevent iframe from interfering with parent page mutations
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      // Ensure iframe is properly isolated
      iframe.setAttribute('data-lovable-ignore', 'true');
    }
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20">
          <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
          <p className="text-white text-sm mt-4">Loading video...</p>
        </div>
      )}
      
      <iframe 
        ref={iframeRef}
        src={playerUrl}
        className="absolute inset-0 w-full h-full z-10" 
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write"
        onLoad={handleIframeLoad}
        title="Cloudinary Player"
        loading="eager"
        data-lovable-ignore="true"
        style={{ 
          pointerEvents: 'auto',
          border: 'none',
          outline: 'none'
        }}
        sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
      />
    </div>
  );
};

export default CloudinaryPlayer;
