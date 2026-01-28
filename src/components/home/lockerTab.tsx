import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useSearchParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Archive } from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";
import { useStore, StoreItem } from "@/context/storeData";
import { Skeleton } from "@/components/ui/skeleton";
import { StoreCarouselRef } from "@/components/StoreCarousel";
import StoreCategoryCard from "./storeCategoryCard";
import StorePurchaseDialog from "../StorePurchaseDialog";
import { toast } from "@/hooks/use-toast";
import { useSocketEvent } from "@/hooks/use-socket-events";

const LockerHeader = ({ title }: { title: string }) => (
    <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
            <h1 className="text-2xl lg:text-3xl font-bold">{title}</h1>
        </div>
    </div>
);

const cardBackground = {
    backgroundImage: `
    linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
    linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
  `,
    backgroundSize: "4px 4px",
};

const LockerCategoryEmpty = ({
    title,
    emptyText,
    onBrowse,
    isMobile,
}: {
    title: string;
    emptyText: string;
    onBrowse: () => void;
    isMobile: boolean;
}) => (
    <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
        <div className="absolute inset-0" style={cardBackground} />
        <CardHeader className="relative z-10 pb-3">
            <CardTitle className="flex items-center text-white text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 text-center py-8 lg:py-12">
            <div
                className={`${isMobile ? "w-12 h-12" : "w-16 h-16"
                    } bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3`}
            >
                <Archive className={`${isMobile ? "w-6 h-6" : "w-8 h-8"} text-gray-400`} />
            </div>
            <p className="text-gray-300 text-sm lg:text-base">{emptyText}</p>
            <Button
                onClick={onBrowse}
                variant="secondary"
                size="sm"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 mt-3 lg:mt-4"
            >
                Browse Store
            </Button>
        </CardContent>
    </Card>
);

const LockerLoginCard = ({ onLogin }: { onLogin: () => void }) => (
    <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
        <div className="absolute inset-0" style={cardBackground} />
        <CardContent className="p-6 text-center relative z-10">
            <Archive className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-4 text-white">Login to View Your Locker</h3>
            <Button
                onClick={onLogin}
                variant="secondary"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30"
            >
                Login
            </Button>
        </CardContent>
    </Card>
);

const LockerTab = () => {
    const { login, authenticated, user } = usePrivy();
    const { getLockerItems } = useSupabase();
    const [searchParams, setSearchParams] = useSearchParams();
    const isMobile = useIsMobile();
    const [loading, setLoading] = useState(true);
    const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const carouselRefs = {
        fighters: useRef<StoreCarouselRef>(null),
        accessories: useRef<StoreCarouselRef>(null),
        mobility: useRef<StoreCarouselRef>(null),
        emotes: useRef<StoreCarouselRef>(null),
        packs: useRef<StoreCarouselRef>(null),
    };

    const handleTabClick = (tabId: string) => setSearchParams({ tab: tabId });

    const handleItemClick = (item: StoreItem) => {
        setSelectedItem(item);
        setDialogOpen(true);
    };

    const getStoreItemsByCategory = (category: string) =>
        storeItems.filter((item) => {
            const itemCat = item.category?.toLowerCase();
            const targetCat = category.toLowerCase();
            // Map 'skins' to 'fighters'
            if (targetCat === 'fighters' && itemCat === 'skins') return true;
            return itemCat === targetCat;
        });

    const mapItemsToDisplay = (items: StoreItem[]) =>
        items.map((item) => ({
            name: item.name,
            price: item.price,
            rarity: item.rarity,
            image: item.image_url || "/placeholder.svg",
            raw: item,
            ...item
        }));
    useSocketEvent('lockerItems', (data) => {
        if (!data) return;

        setStoreItems((prevData) => {
            const newEntries = Array.isArray(data) ? data : [data];
            const updated = [...prevData];

            newEntries.forEach((entry) => {
                const entryId = entry.id;
                const existingIndex = updated.findIndex(
                    (item) => (item.id) === entryId
                );
                if (existingIndex !== -1) {
                    updated[existingIndex] = { ...updated[existingIndex], ...entry };
                } else {
                    updated.push(entry);
                }
            });
            return updated;
        });
    })
    const fetchStoreItems = useCallback(async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const response = await getLockerItems(user.id, 1, 100);
            if (response.success) {
                const storeItemsData = response?.items?.map((item: any) => {
                    const storeItem = item.item || {};
                    return {
                        ...storeItem,
                        ...item,
                        store_id: storeItem.id,
                        image_url: storeItem.image_url // ensuring mapping
                    };
                });
                setStoreItems(storeItemsData);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch store items",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [user?.id, getLockerItems]);
    useEffect(() => {
        if (authenticated) {
            fetchStoreItems()
        }
    }, [authenticated]);
    const renderCategory = (title: string, category: string, emptyText: string, refKey: keyof typeof carouselRefs) => {
        const items = getStoreItemsByCategory(category);

        if (items.length === 0) {
            return (
                <LockerCategoryEmpty
                    key={category}
                    title={title}
                    emptyText={emptyText}
                    onBrowse={() => handleTabClick("store")}
                    isMobile={isMobile}
                />
            );
        }

        return (
            <StoreCategoryCard
                key={category}
                title={title}
                items={mapItemsToDisplay(items)}
                onItemClick={handleItemClick}
                carouselRef={carouselRefs[refKey]}
                desktopMode={!isMobile}
            />
        );
    };

    const content = !authenticated ? (
        <LockerLoginCard onLogin={login} />
    ) : (
        loading ?
            <div className="grid sm:grid-cols-3 grid-cols-2 gap-3">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className=" space-y-2">
                        <Skeleton className="h-[200px]" />
                        <Skeleton className="h-[25px]" />
                        <Skeleton className="h-[25px]" />
                    </div>
                ))}
            </div> :

            <div className="space-y-4 lg:space-y-6">
                {renderCategory("Fighters", "fighters", "No fighters owned yet", "fighters")}
                {renderCategory("Accessories", "accessories", "No accessories owned yet", "accessories")}
                {renderCategory("Mobility", "mobility", "No vehicles owned yet", "mobility")}
                {renderCategory("Emotes", "emotes", "No emotes owned yet", "emotes")}
                {renderCategory("Packs", "packs", "No packs owned yet", "packs")}
            </div>
    );

    return (
        <>
            {isMobile ? (
                <div className="p-4 space-y-6">
                    <LockerHeader title="My Locker" />
                    {content}
                </div>
            ) : (
                <ScrollArea className="h-full">
                    <div className="p-6">
                        <div className="space-y-6 max-w-4xl mx-auto">
                            <LockerHeader title="My Locker" />
                            {content}
                        </div>
                    </div>
                </ScrollArea>
            )}

            <StorePurchaseDialog
                isOpen={dialogOpen}
                onClose={() => setDialogOpen(false)}
                item={selectedItem as any}
            />
        </>
    );
};

export default LockerTab;
