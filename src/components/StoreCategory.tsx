import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ShoppingBag, Coins, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface StoreItem {
  name: string;
  price: number;
  rarity: string;
  image: string;
}

interface StoreCategoryProps {
  title: string;
  items: StoreItem[];
  onPurchase?: (item: StoreItem) => void;
  itemsPerPage?: number;
}

export const StoreCategory = ({ title, items, onPurchase, itemsPerPage = 8 }: StoreCategoryProps) => {
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + itemsPerPage, items.length));
  }, [items.length, itemsPerPage]);

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  const handlePurchase = (item: StoreItem) => {
    if (onPurchase) {
      onPurchase(item);
    } else {
      toast({
        title: "Coming Soon",
        description: "Purchases coming soon!",
        duration: 3000
      });
    }
  };

  const PurchaseButton = ({ item }: { item: StoreItem }) => {
    if (isMobile) {
      return (
        <Drawer>
          <DrawerTrigger asChild>
            <Button size="sm" variant="secondary" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-6 px-2">
              <ShoppingBag className="h-3 w-3 mr-1" />
              Buy
            </Button>
          </DrawerTrigger>
          <DrawerContent className="bg-black/10 backdrop-blur-md border-t border-white/20 text-white transition-all duration-300">
            <DrawerHeader>
              <DrawerTitle className="text-white text-center">Purchase {item.name}</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 space-y-3">
              <Button 
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20" 
                onClick={() => handlePurchase(item)}
              >
                <Coins className="mr-2 h-4 w-4" />
                Buy With Coins
              </Button>
              <Button 
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20" 
                onClick={() => toast({
                  title: "Coming Soon",
                  description: "Card payments coming soon!",
                  duration: 3000
                })}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Buy with Card
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white">
                  Cancel
                </Button>
              </DrawerClose>
            </div>
          </DrawerContent>
        </Drawer>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="secondary" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-7 px-3">
            Buy
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-full bg-black/10 backdrop-blur-md border border-white/20 text-white z-50">
          <DropdownMenuItem 
            onClick={() => handlePurchase(item)} 
            className="flex items-center space-x-2 cursor-pointer text-white hover:bg-gradient-to-br hover:from-gray-800/30 hover:via-black/20 hover:to-gray-900/40 hover:backdrop-blur-md transition-all duration-300"
          >
            <Coins className="w-4 h-4" />
            <span>Buy With Coins</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => toast({
              title: "Coming Soon",
              description: "Card payments coming soon!",
              duration: 3000
            })} 
            className="flex items-center space-x-2 cursor-pointer text-white hover:bg-gradient-to-br hover:from-gray-800/30 hover:via-black/20 hover:to-gray-900/40 hover:backdrop-blur-md transition-all duration-300"
          >
            <CreditCard className="w-4 h-4" />
            <span>Buy with Card</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
          linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
        `,
        backgroundSize: '4px 4px'
      }} />
      
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center justify-between text-white">
          <span>{title}</span>
          <Badge variant="secondary">{items.length} items</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <Carousel 
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-1">
            {visibleItems.map((item, idx) => (
              <CarouselItem key={idx} className={`pl-1 ${isMobile ? 'basis-1/2' : 'basis-1/4'} min-w-0`}>
                <Card className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white border border-gray-600/50 shadow-2xl relative overflow-hidden hover:scale-105 hover:shadow-3xl hover:border-gray-500/70 transition-all duration-300 cursor-pointer h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700/30 via-gray-800/50 to-gray-900/80" />
                  <CardContent className={`${isMobile ? 'p-3' : 'p-4'} relative z-10 h-full flex flex-col`}>
                    <div className="aspect-square bg-gray-800/50 rounded-lg mb-2 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className={`font-semibold ${isMobile ? 'text-xs' : 'text-sm'} text-white mb-2 flex-1`}>{item.name}</h3>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center space-x-1">
                        <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
                        <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold text-white`}>{item.price.toLocaleString()}</span>
                      </div>
                      <PurchaseButton item={item} />
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
            
            {hasMore && (
              <CarouselItem className={`pl-1 ${isMobile ? 'basis-1/2' : 'basis-1/4'} min-w-0`}>
                <div className="h-full flex items-center justify-center">
                  <Button 
                    onClick={loadMore}
                    variant="outline" 
                    className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 h-full min-h-[200px] w-full flex flex-col items-center justify-center space-y-2"
                  >
                    <span className="text-sm font-medium">Load More</span>
                    <span className="text-xs text-gray-300">+{items.length - visibleCount} items</span>
                  </Button>
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
          
          {!isMobile && visibleItems.length > 4 && (
            <>
              <CarouselPrevious className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20" />
              <CarouselNext className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20" />
            </>
          )}
        </Carousel>
      </CardContent>
    </Card>
  );
};