import React, { useState, useRef, useCallback } from "react";
import { StoreItem } from "@/context/storeData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Filter, Layers } from "lucide-react";
import StoreCarousel, { StoreCarouselRef } from "@/components/StoreCarousel";
import StoreItemCard from "./storeItemCard";

const StoreCategoryCard = ({
  title,
  items,
  onItemClick,
  carouselRef,
  desktopMode,
  category='',
  shaking = false
}: {
  title: string;
  items: any[];
  onItemClick: (item: StoreItem) => void;
  carouselRef: React.RefObject<StoreCarouselRef>;
  desktopMode?: boolean;
  category?: string;
  shaking?: boolean;
}) => {
  const [isShaking, setIsShaking] = useState(false);

  const handleScrollBlocked = useCallback(() => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  }, []);

  const shouldShake = shaking || isShaking;

  return (
    <Card id={category} className={`bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden ${shouldShake ? 'animate-shake' : ''}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
          linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
        `,
        backgroundSize: '4px 4px'
      }} />

      <CardHeader className="relative z-10 sm:pb-0">
        <CardTitle className="flex items-center justify-between text-white">
          <span>{title}</span>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => carouselRef.current?.scrollToPrevious()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => carouselRef.current?.scrollToNext()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10">
        <StoreCarousel
          ref={carouselRef}
          desktopMode={desktopMode}
          items={items}
          onScrollBlocked={handleScrollBlocked}
          renderItem={(item, idx) => (
            <StoreItemCard key={idx} item={item} onClick={onItemClick} />
          )}
        />
      </CardContent>
    </Card>
  );
};


export default StoreCategoryCard;