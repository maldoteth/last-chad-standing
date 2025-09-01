import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedPlayerImageProps {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
}

export const OptimizedPlayerImage: React.FC<OptimizedPlayerImageProps> = ({
  src,
  alt,
  className = "w-full h-full object-cover",
  onLoad,
  onError,
  priority = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    // Create image element for preloading
    const img = new Image();
    
    const handleLoad = () => {
      setIsLoaded(true);
      setImageSrc(src);
      onLoad?.();
    };

    const handleError = () => {
      setHasError(true);
      onError?.();
    };

    img.onload = handleLoad;
    img.onerror = handleError;
    
    // Set loading priority
    if (priority) {
      img.loading = 'eager';
    }
    
    img.src = src;

    // Cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, onLoad, onError, priority]);

  if (hasError) {
    return (
      <div className={`${className} bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center`}>
        <div className="text-gray-500 text-xs">Failed to load</div>
      </div>
    );
  }

  if (!isLoaded || !imageSrc) {
    return <Skeleton className={className} />;
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
};