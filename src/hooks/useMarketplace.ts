import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePrivy } from '@privy-io/react-auth';
import { toast } from 'sonner';
import { useApi } from '@/Api/apiFunction';
import { handleError } from '@/Api/handleError';
import { useSocketEvent } from '@/context/SocketContext';


export type MarketplaceListing = {
  id: string
  name: string
  price: number
  rarity: "common" | "rare" | "epic" | "legendary" | "special" // include all possible rarities
  category: "packs" | "fighters" | "cards" | "items" | string   // extendable
  image_url: string
  is_active: boolean
  created_at: string // ISO timestamp
  updated_at: string // ISO timestamp
  description: string
  max_supply: number
  sale_start_date: string | null
  sale_end_date: string | null
  total_purchased: number
  first_release_date: string | null
  user_id: string
  item_id: string
  quantity: number
  coins: number
  purchase_date: string
  status: "purchased" | "pending" | "cancelled" | string
  coin_change: number
  change_type: "increase" | "decrease" | "nochange" | string
  total_purchased_locker_item: number
  is_sell_item: boolean
  store_id: string
}

export interface MarketplacePrices {
  bestSellPrice?: number;
  bestBuyPrice?: number;
  hasListings: boolean;
}

export const useMarketplace = () => {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [listGainer, setListGainer] = useState<MarketplaceListing[]>([]);
  const [listTrending, setListTrending] = useState<MarketplaceListing[]>([]);
  const [listGraphs, setListGraphs] = useState<any[]>([]);
  const [listMarketValue, setListMarketValue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMarket, setLoadingMarket] = useState(true);
  const { user } = usePrivy();
  const { get } = useApi()
  const fetchStoreItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await get(`locker-item/market-place/?page=1`, {}, { cache: true, revalidate: true, ttl: 5000 });
      if (response.success) {
        const storeItemsData = response?.items?.map((item: any) => {
          const { store_items, ...rest } = item || {};
          return {
            ...(store_items || {}),
            ...rest,
            store_id: store_items?.id,
          };
        });
        setListings(storeItemsData);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }, []);
  const fetchLiveGraph = useCallback(async () => {
    setLoading(true);
    try {
      const response = await get(`locker-item/live-listing`, {}, );
      if (response.success) {
        setListGraphs(response?.days);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }, []);
  const fetchMarketValue = useCallback(async () => {
    setLoading(true);
    try {
      const response = await get(`locker-item/market-value`, {}, );
      if (response.success) {
        setListMarketValue(response?.days);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }, []);
  const fetchGainerItems = useCallback(async (dateFilter = 'all') => {
    setLoadingMarket(true);
    try {
      const response = await get(`locker-item/market-place/?page=1`, { type: 'up', dateFilter }, { cache: true, revalidate: true, ttl: 5000 });
      if (response.success) {
        const storeItemsData = response?.items?.map((item: any) => {
          const { store_items, ...rest } = item || {};
          return {
            ...(store_items || {}),
            ...rest,
            store_id: store_items?.id,
          };
        });
        setListGainer(storeItemsData);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingMarket(false);
    }
  }, []);
  const fetchTrendingItems = useCallback(async (dateFilter = 'all') => {
    setLoadingMarket(true);
    try {
      const response = await get(`locker-item/market-place/?page=1`, { type: 'up', dateFilter, isTrending: true }, { cache: true, revalidate: true, ttl: 5000 });
      if (response.success) {
        const storeItemsData = response?.items?.map((item: any) => {
          const { store_items, ...rest } = item || {};
          return {
            ...(store_items || {}),
            ...rest,
            store_id: store_items?.id,
          };
        });
        setListTrending(storeItemsData);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingMarket(false);
    }
  }, []);
  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings((data || []) as any[]);
    } catch (error) {
      console.error('Error fetching marketplace listings:', error);
      toast.error('Failed to load marketplace data');
    } finally {
      setLoading(false);
    }
  };
  const getMarketplacePrices = (itemId: string, itemType: string): MarketplacePrices => {
    const itemListings = listings.filter(
      listing => listing.item_id === itemId && listing?.category === itemType
    );

    if (itemListings.length === 0) {
      return { hasListings: false };
    }

    const sellListings = itemListings
      .sort((a, b) => a.price - b.price); // Lowest first

    const buyListings = itemListings
      .sort((a, b) => b.price - a.price); // Highest first

    return {
      bestSellPrice: sellListings.length > 0 ? sellListings[0].price : undefined,
      bestBuyPrice: buyListings.length > 0 ? buyListings[0].price : undefined,
      hasListings: true
    };
  };

  const createListing = async (
    itemId: string,
    itemType: string,
    listingType: 'sell' | 'buy',
    price: number,
    quantity: number = 1
  ): Promise<boolean> => {
    if (!user?.id) {
      toast.error('Please connect your wallet to create listings');
      return false;
    }

    try {
      const { error } = await supabase
        .from('marketplace_listings')
        .insert({
          user_id: user.id,
          item_id: itemId,
          item_type: itemType,
          listing_type: listingType,
          price,
          quantity
        });

      if (error) throw error;

      toast.success(`${listingType === 'sell' ? 'Sell' : 'Buy'} order created successfully!`);
      await fetchListings(); // Refresh listings
      return true;
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error('Failed to create listing');
      return false;
    }
  };

  const cancelListing = async (listingId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('marketplace_listings')
        .update({ status: 'cancelled' })
        .eq('id', listingId);

      if (error) throw error;

      toast.success('Listing cancelled successfully!');
      await fetchListings(); // Refresh listings
      return true;
    } catch (error) {
      console.error('Error cancelling listing:', error);
      toast.error('Failed to cancel listing');
      return false;
    }
  };
  useSocketEvent('updatedLocker', (data) => {
    fetchStoreItems()
    fetchGainerItems()
  })
  useEffect(() => {
    fetchStoreItems();
    fetchLiveGraph()
    fetchMarketValue()
  }, []);
  return {
    listings,
    loading,
    listGainer,
    listGraphs,
    listMarketValue,
    loadingMarket, listTrending,
    getMarketplacePrices,
    createListing,
    cancelListing,
    refetchListings: fetchStoreItems,
    fetchGainerItems,
    fetchTrendingItems
  };
};