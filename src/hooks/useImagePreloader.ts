import { useEffect, useState } from 'react';

interface PreloadedImage {
  src: string;
  loaded: boolean;
  error: boolean;
}

interface UseImagePreloaderReturn {
  preloadedImages: Map<string, PreloadedImage>;
  isPreloading: boolean;
  preloadProgress: number;
}

export const useImagePreloader = (imageSources: string[]): UseImagePreloaderReturn => {
  const [preloadedImages, setPreloadedImages] = useState<Map<string, PreloadedImage>>(new Map());
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);

  useEffect(() => {
    if (imageSources.length === 0) return;

    setIsPreloading(true);
    const imageMap = new Map<string, PreloadedImage>();
    let loadedCount = 0;

    // Initialize all images as not loaded
    imageSources.forEach(src => {
      imageMap.set(src, { src, loaded: false, error: false });
    });

    setPreloadedImages(new Map(imageMap));

    const preloadImage = (src: string): Promise<void> => {
      return new Promise((resolve) => {
        // Check if image is already cached
        const img = new Image();
        
        const onLoad = () => {
          imageMap.set(src, { src, loaded: true, error: false });
          loadedCount++;
          setPreloadProgress((loadedCount / imageSources.length) * 100);
          setPreloadedImages(new Map(imageMap));
          resolve();
        };

        const onError = () => {
          imageMap.set(src, { src, loaded: false, error: true });
          loadedCount++;
          setPreloadProgress((loadedCount / imageSources.length) * 100);
          setPreloadedImages(new Map(imageMap));
          resolve();
        };

        img.onload = onLoad;
        img.onerror = onError;
        
        // Check if image is already complete (cached)
        if (img.complete && img.naturalHeight !== 0) {
          onLoad();
        } else {
          img.src = src;
        }
      });
    };

    // Preload images in batches to avoid overwhelming the browser
    const batchSize = 5;
    const preloadBatch = async (startIndex: number) => {
      const batch = imageSources.slice(startIndex, startIndex + batchSize);
      await Promise.all(batch.map(preloadImage));
      
      if (startIndex + batchSize < imageSources.length) {
        // Small delay between batches to prevent blocking
        setTimeout(() => preloadBatch(startIndex + batchSize), 50);
      } else {
        setIsPreloading(false);
      }
    };

    preloadBatch(0);

  }, [imageSources]);

  return {
    preloadedImages,
    isPreloading,
    preloadProgress
  };
};