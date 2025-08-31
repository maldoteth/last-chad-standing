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
    <div className="relative">
      <Carousel className="w-full">
        {itemGroups.length > 1 && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10 hidden md:flex items-center space-x-2">
            <CarouselPrevious className="static translate-y-0 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 h-6 w-6" />
            <div className="flex space-x-1">
              {itemGroups.map((_, idx) => (
                <div key={idx} className="w-1.5 h-1.5 rounded-full bg-white/30" />
              ))}
            </div>
            <CarouselNext className="static translate-y-0 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 h-6 w-6" />
          </div>
        )}
        <CarouselContent>
          {itemGroups.map((group, groupIdx) => (
            <CarouselItem key={groupIdx}>
              <div className="grid grid-cols-2 gap-3">
                {group.map((item, idx) => renderItem(item, groupIdx * 4 + idx))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {itemGroups.length > 1 && (
          <div className="flex justify-center items-center mt-4 space-x-2 md:hidden">
            <CarouselPrevious className="static translate-y-0 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 h-8 w-8" />
            <div className="flex space-x-1">
              {itemGroups.map((_, idx) => (
                <div key={idx} className="w-2 h-2 rounded-full bg-white/30" />
              ))}
            </div>
            <CarouselNext className="static translate-y-0 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 h-8 w-8" />
          </div>
        )}
      </Carousel>
    </div>
  );
};

export default StoreCarousel;