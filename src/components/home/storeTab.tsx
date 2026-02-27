import React, { useState, useRef } from "react";
import { useStore, StoreItem } from "@/context/storeData";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlowCard } from "@/components/ui/spotlight-card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, ChevronLeft, Filter, Layers } from "lucide-react";
import StoreCarousel, { StoreCarouselRef } from "@/components/StoreCarousel";
import StorePurchaseDialog  from "../StorePurchaseDialog";
import { getRarityFilterColor, getRarityDisplayName, getRarityColor, CATEGORIES, RARITIES } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import StoreCategoryCard from "./storeCategoryCard";
import { supabase } from "@/integrations/supabase/client";

// Filter Button Component
const FilterButton = ({
  icon: Icon,
  onClick,
  isMobile,
  children
}: {
  icon: React.ComponentType<any>;
  onClick?: () => void;
  isMobile: boolean;
  children: React.ReactNode;
}) => {
  const trigger = (
    <Button variant="ghost" size="default" className="text-white hover:bg-white/10 w-18 h-18">
      <Icon className="w-7 h-7" />
    </Button>
  );

  return isMobile ? (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      {children}
    </Drawer>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      {children}
    </DropdownMenu>
  );
};

// Filter Option Component
const FilterOption = ({
  label,
  onClick,
  isSelected,
  icon,
  isMobile
}: {
  label: string;
  onClick: () => void;
  isSelected: boolean;
  icon?: React.ReactNode;
  isMobile: boolean;
}) => {
  const className = `flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${isSelected ? "bg-white/20" : ""}`;

  const content = (
    <>
      {icon}
      <span>{label}</span>
    </>
  );

  return isMobile ? (
    <Button variant="ghost" onClick={onClick} className={`w-full justify-start ${className}`}>
      {content}
    </Button>
  ) : (
    <DropdownMenuItem onClick={onClick} className={className}>
      {content}
    </DropdownMenuItem>
  );
};


const StoreTab = () => {
  const isMobile = useIsMobile();
  const [selectedRarity, setSelectedRarity] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [selectedStoreItem, setSelectedStoreItem] = useState<StoreItem | null>(null);

  // Refs for carousels
  const carouselRefs = {
    fighters: useRef<StoreCarouselRef>(null),
    accessories: useRef<StoreCarouselRef>(null),
    mobility: useRef<StoreCarouselRef>(null),
    emotes: useRef<StoreCarouselRef>(null),
    packs: useRef<StoreCarouselRef>(null)
  };

  const { storeItems, loading } = useStore();

  const handleStoreItemClick = (item: StoreItem) => {
    setSelectedStoreItem(item);
    setPurchaseDialogOpen(true);
  };

  const getStoreItemsByCategory = (category: string) => {
    return storeItems.filter((item: any) =>
      item.category.toLowerCase() === category.toLowerCase() || category === 'all'
    );
  };

  // Items to hide from Fresh Drops store
  const HIDDEN_STORE_ITEMS = ["Conquisto D'ior", "Helicopter", "Bonsey Bones", "Attack Copter", "bonsey", "copter", "Jonesy Bones", "jonesy", "dirt bike", "pong", "Dirt Bike", "Pong"];
  
  const filterHiddenStoreItems = (items: any[]) =>
    items.filter(item => 
      !HIDDEN_STORE_ITEMS.some(hidden => 
        item.name?.toLowerCase().includes(hidden.toLowerCase())
      )
    );

  const filterItemsByRarity = (items: any[]) => {
    if (selectedRarity === "all") return items;
    return items.filter((item: any) => item.rarity === selectedRarity);
  };

  const mapItemsToDisplay = (items: any[]) =>
    items.map((item: any) => {
      let displayUrl = item.ImgGatewayUrl || item.image_url || item.image;
      
      if (displayUrl) {
        // 1. Detect and fix broken Pinata URLs (extract filename from URL)
        if (displayUrl.includes('pinata.cloud/ipfs/')) {
          const parts = displayUrl.split('/ipfs/');
          const path = parts[parts.length - 1];
          if (!(path.startsWith('Qm') || path.startsWith('bafy'))) {
            // Extract JUST the filename if it's nested or a full URL
            const cleanPath = decodeURIComponent(path).split('/').pop() || path;
            const { data: { publicUrl } } = supabase.storage.from('items').getPublicUrl(cleanPath);
            displayUrl = publicUrl;
          }
        } 
        // 2. Resolve relative paths
        else if (!displayUrl.startsWith('http')) {
          const isIPFS = displayUrl.startsWith('Qm') || displayUrl.startsWith('bafy');
          if (isIPFS) {
            displayUrl = `https://gateway.pinata.cloud/ipfs/${displayUrl}`;
          } else {
            const cleanPath = decodeURIComponent(displayUrl).split('/').pop() || displayUrl;
            const { data: { publicUrl } } = supabase.storage.from('items').getPublicUrl(cleanPath);
            displayUrl = publicUrl;
          }
        }
      }

      return {
        ...item,
        name: item.name,
        price: item.price,
        rarity: item.rarity,
        image: displayUrl || "/placeholder.svg",
        raw: item,
      };
    });

  const renderCategoryFilters = (isMobile: boolean) => (
    <>
      {isMobile ? (
        <DrawerContent className="bg-black/10 backdrop-blur-md border border-white/20 text-white">
          <DrawerHeader>
            <DrawerTitle className="text-center">Filter by Category</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8 space-y-2">
            {CATEGORIES.map((cat, index) => (
              <FilterOption
                key={index}
                label={`${cat.icon} ${cat.label}`}
                onClick={() => setSelectedCategory(cat.id)}
                isSelected={selectedCategory === cat.id}
                isMobile={true}
              />
            ))}
          </div>
        </DrawerContent>
      ) : (
        <DropdownMenuContent align="center" className="w-32 bg-black/10 backdrop-blur-md border border-white/20 text-white z-50">
          {CATEGORIES.map((cat, index) => (
            <FilterOption
              key={index}
              label={`${cat.icon} ${cat.label}`}
              onClick={() => setSelectedCategory(cat.id)}
              isSelected={selectedCategory === cat.id}
              isMobile={false}
            />
          ))}
        </DropdownMenuContent>
      )}
    </>
  );

  const renderRarityFilters = (isMobile: boolean) => (
    <>
      {isMobile ? (
        <DrawerContent className="bg-black/10 backdrop-blur-md border border-white/20 text-white">
          <DrawerHeader>
            <DrawerTitle className="text-center">Filter by Rarity</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8 space-y-2">
            <FilterOption
              label="All Rarities"
              onClick={() => setSelectedRarity("all")}
              isSelected={selectedRarity === "all"}
              icon={<div className="w-3 h-3 rounded-full bg-black" />}
              isMobile={true}
            />
            {RARITIES.map((rarity, index) => (
              <FilterOption
                key={index}
                label={getRarityDisplayName(rarity)}
                onClick={() => setSelectedRarity(rarity)}
                isSelected={selectedRarity === rarity}
                icon={<div className={`w-3 h-3 rounded-full ${getRarityFilterColor(rarity)}`} />}
                isMobile={true}
              />
            ))}
          </div>
        </DrawerContent>
      ) : (
        <DropdownMenuContent align="center" className="w-32 bg-black/10 backdrop-blur-md border border-white/20 text-white z-50">
          <FilterOption
            label="All Rarities"
            onClick={() => setSelectedRarity("all")}
            isSelected={selectedRarity === "all"}
            icon={<div className="w-3 h-3 rounded-full bg-black" />}
            isMobile={false}
          />
          {RARITIES.map((rarity,index) => (
            <FilterOption
              key={index}
              label={getRarityDisplayName(rarity)}
              onClick={() => setSelectedRarity(rarity)}
              isSelected={selectedRarity === rarity}
              icon={<div className={`w-3 h-3 rounded-full ${getRarityFilterColor(rarity)}`} />}
              isMobile={false}
            />
          ))}
        </DropdownMenuContent>
      )}
    </>
  );

  const content = (
    <div className={isMobile ? "p-4 space-y-6" : "sm:p-6 p-4"}>
      <div className={isMobile ? "space-y-6" : "space-y-6 max-w-4xl mx-auto"}>
        {/* Header */}
        <div className="text-center sticky top-0 z-50 bg-gradient-to-b from-black via-black/70 to-black/40 backdrop-blur-md py-1">
          <div className="absolute top-0 left-0">
            <FilterButton icon={Layers} isMobile={isMobile}>
              {renderCategoryFilters(isMobile)}
            </FilterButton>
          </div>

          <h1 className={`font-bold ${isMobile ? 'text-2xl' : 'text-3xl'} mb-4`}>Fresh Drops</h1>

          <div className="absolute top-0 right-0">
            <FilterButton icon={Filter} isMobile={isMobile}>
              {renderRarityFilters(isMobile)}
            </FilterButton>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="text-4xl">🔒</div>
          <h2 className="text-xl font-semibold text-white/80">Awaiting Listings</h2>
          <p className="text-sm text-white/50 max-w-xs">New drops will appear here when available. Stay tuned!</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? content : <ScrollArea className="h-full">{content}</ScrollArea>}
      <StorePurchaseDialog
        isOpen={purchaseDialogOpen}
        onClose={() => setPurchaseDialogOpen(false)}
        item={selectedStoreItem as any}
      />
    </>
  );
};

export default StoreTab;