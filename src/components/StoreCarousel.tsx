import React, { forwardRef, useImperativeHandle, useEffect, useRef } from 'react';
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
  onScrollBlocked?: () => void;
}

export interface StoreCarouselRef {
  scrollToPrevious: () => void;
  scrollToNext: () => void;
}

const StoreCarousel = forwardRef<StoreCarouselRef, StoreCarouselProps>(({ items, renderItem, desktopMode = false, onScrollBlocked }, ref) => {
  const isMobile = useIsMobile();
  const isDesktopLayout = !isMobile || desktopMode;
  const itemsPerSlide = 3;

  // Group items into sets for display
  const itemGroups = [];
  for (let i = 0; i < items.length; i += itemsPerSlide) {
    itemGroups.push(items.slice(i, i + itemsPerSlide));
  }

  if (itemGroups.length <= 1) {
    // If only one group, show in regular grid without carousel
    return (
      <div className={isDesktopLayout ? "grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-3 gap-4" : "grid grid-cols-1 gap-4"}>
        {items.map((item, idx) => renderItem(item, idx))}
      </div>
    );
  }

  const CarouselWithRef = () => {
    const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();

    useImperativeHandle(ref, () => ({
      scrollToPrevious: () => {
        if (!canScrollPrev) {
          onScrollBlocked?.();
        } else {
          scrollPrev();
        }
      },
      scrollToNext: () => {
        if (!canScrollNext) {
          onScrollBlocked?.();
        } else {
          scrollNext();
        }
      },
    }));

    return null;
  };

  return (
    <Carousel className="w-full">
      <CarouselWithRef />
      <CarouselContent>
        {itemGroups.map((group, groupIdx) => (
          <CarouselItem key={groupIdx}>
            <div className={isDesktopLayout ? "grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-3 gap-4" : "grid grid-cols-1 gap-4"}>
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