import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

interface StoreItem {
  name: string;
  price: number;
  rarity: string;
  image: string;
}

interface StoreCarouselProps {
  items: StoreItem[];
  renderItem: (item: StoreItem, idx: number) => React.ReactNode;
}

const StoreCarousel: React.FC<StoreCarouselProps> = ({ items, renderItem }) => {
  console.log("StoreCarousel rendered with", items.length, "items");
  // Group items into sets of 4 for 2x2 grid display
  const itemGroups = [];
  for (let i = 0; i < items.length; i += 4) {
    itemGroups.push(items.slice(i, i + 4));
  }

  if (itemGroups.length <= 1) {
    // If 4 or fewer items, show in regular grid without carousel
    return (
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, idx) => renderItem(item, idx))}
      </div>
    );
  }

  return (
    <Carousel className="w-full relative">
      <CarouselContent>
        {itemGroups.map((group, groupIdx) => (
          <CarouselItem key={groupIdx}>
            <div className="grid grid-cols-2 gap-3">
              {group.map((item, idx) => renderItem(item, groupIdx * 4 + idx))}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      
      {/* Navigation controls - positioned for both mobile and desktop */}
      {itemGroups.length > 1 && (
        <>
          <CarouselPrevious className="absolute left-2 top-[-8px] md:top-[-8px] z-10 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 h-8 w-8" />
          <CarouselNext className="absolute right-2 top-[-8px] md:top-[-8px] z-10 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 h-8 w-8" />
          
          {/* Dots indicator for mobile */}
          <div className="flex md:hidden justify-center items-center mt-4">
            <div className="flex space-x-1">
              {itemGroups.map((_, idx) => (
                <div key={idx} className="w-2 h-2 rounded-full bg-white/30" />
              ))}
            </div>
          </div>
        </>
      )}
    </Carousel>
  );
};

export default StoreCarousel;