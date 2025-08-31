import React, { forwardRef, useImperativeHandle } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, useCarousel } from '@/components/ui/carousel';

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

export interface StoreCarouselRef {
  scrollToPrevious: () => void;
  scrollToNext: () => void;
}

const StoreCarousel = forwardRef<StoreCarouselRef, StoreCarouselProps>(({ items, renderItem }, ref) => {
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

  const CarouselWithRef = () => {
    const { scrollPrev, scrollNext } = useCarousel();
    
    useImperativeHandle(ref, () => ({
      scrollToPrevious: scrollPrev,
      scrollToNext: scrollNext,
    }));

    return null;
  };

  return (
    <Carousel className="w-full">
      <CarouselWithRef />
      <CarouselContent>
        {itemGroups.map((group, groupIdx) => (
          <CarouselItem key={groupIdx}>
            <div className="grid grid-cols-2 gap-3">
              {group.map((item, idx) => renderItem(item, groupIdx * 4 + idx))}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* Hidden navigation buttons for DOM queries */}
      <CarouselPrevious className="hidden" />
      <CarouselNext className="hidden" />
    </Carousel>
  );
});

export default StoreCarousel;