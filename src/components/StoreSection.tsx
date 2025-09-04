import React, { forwardRef } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/spotlight-card";
import { useIsMobile } from "@/hooks/use-mobile";
import StoreCarousel, { StoreCarouselRef } from "@/components/StoreCarousel";
import { StoreItem } from "@/hooks/useStore";

interface StoreSectionProps {
  category: string;
  items: StoreItem[];
  selectedRarity: string;
  onItemClick: (item: StoreItem) => void;
  desktopMode?: boolean;
}

const StoreSection = forwardRef<StoreCarouselRef, StoreSectionProps>(
  ({ category, items, selectedRarity, onItemClick, desktopMode = false }, ref) => {
    const isMobile = useIsMobile();

    // Filter items by rarity
    const filterItemsByRarity = (items: StoreItem[]) => {
      if (selectedRarity === "all") return items;
      return items.filter(item => item.rarity === selectedRarity);
    };

    const filteredItems = filterItemsByRarity(items);

    return (
      <StoreCarousel 
        ref={ref} 
        desktopMode={desktopMode}
        items={filteredItems.map(item => ({
          name: item.name,
          price: item.price,
          rarity: item.rarity,
          image: item.image_url || "/placeholder.svg"
        }))} 
        renderItem={(item, idx) => {
          const storeItem = filteredItems[idx];
          return (
            <GlowCard key={idx} className="cursor-pointer">
              <div className={desktopMode ? "p-4" : "p-3"}>
                <div 
                  className={`aspect-square bg-gray-800/50 rounded-lg mb-${desktopMode ? '3' : '2'} overflow-hidden cursor-pointer ${category === 'emotes' ? 'flex items-center justify-center' : ''}`}
                  onClick={() => storeItem && onItemClick(storeItem)}
                >
                  {category === 'emotes' && (item.image.startsWith('/') || item.image.startsWith('http')) ? 
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" 
                    /> :
                    category === 'emotes' ? 
                    <div className="text-4xl hover:scale-110 transition-transform duration-300">{item.image}</div> :
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" 
                    />
                  }
                </div>
                <h3 className={`font-semibold ${desktopMode ? 'text-sm mb-2' : 'text-xs mb-1'} text-white`}>
                  {item.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <img 
                      src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" 
                      alt="LCS Coin" 
                      className={desktopMode ? "w-4 h-4" : "w-3 h-3"} 
                    />
                    <span className={`${desktopMode ? 'text-sm' : 'text-xs'} font-bold text-white`}>
                      {item.price.toLocaleString()}
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className={`bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 ${desktopMode ? 'text-xs h-7 px-3' : 'text-xs h-6 px-2'}`}
                    onClick={() => storeItem && onItemClick(storeItem)}
                  >
                    <ShoppingBag className={`${isMobile && !desktopMode ? 'h-3 w-3' : 'mr-1 h-2 w-2'}`} />
                    {(desktopMode || !isMobile) && "Buy"}
                  </Button>
                </div>
              </div>
            </GlowCard>
          );
        }}
      />
    );
  }
);

StoreSection.displayName = "StoreSection";

export default StoreSection;