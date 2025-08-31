import React, { forwardRef, useImperativeHandle } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, useCarousel } from '@/components/ui/carousel';
import { useIsMobile } from '@/hooks/use-mobile';

interface StoreItem {
  name: string;
  price: number;
  rarity: string;
  image: string;
}

interface StoreCarouselProps {
  items: StoreItem[];
  renderItem: (item: StoreItem, idx: number) => React.ReactNode;
  desktopMode?: boolean;
}

export interface StoreCarouselRef {
  scrollToPrevious: () => void;
  scrollToNext: () => void;
}

const StoreCarousel = forwardRef<StoreCarouselRef, StoreCarouselProps>(({ items, renderItem, desktopMode = false }, ref) => {
  const isMobile = useIsMobile();
  const isDesktopLayout = !isMobile || desktopMode;
  const itemsPerSlide = isDesktopLayout ? 4 : 4;
  
  // Group items into sets for display
  const itemGroups = [];
  for (let i = 0; i < items.length; i += itemsPerSlide) {
    itemGroups.push(items.slice(i, i + itemsPerSlide));
  }

  if (itemGroups.length <= 1) {
    // If only one group, show in regular grid without carousel
    return (
      <div className={isDesktopLayout ? "grid grid-cols-4 gap-4" : "grid grid-cols-2 gap-3"}>
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
            <div className={isDesktopLayout ? "grid grid-cols-4 gap-4" : "grid grid-cols-2 gap-3"}>
              {group.map((item, idx) => renderItem(item, groupIdx * itemsPerSlide + idx))}
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