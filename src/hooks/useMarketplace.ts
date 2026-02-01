import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePrivy } from '@privy-io/react-auth';
import { toast } from 'sonner';
import { useSupabase } from './useSupabase';
import { handleError } from '@/Api/handleError';
import { useSocketEvent } from '@/hooks/use-socket-events';


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
  bids?: { count: number }[]
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
  const { getMarketplaceListings, getLiveGraphData, getMarketValueData } = useSupabase();
  const fetchStoreItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getMarketplaceListings({ page: 1 });
      if (response.success && response.items) {
        setListings(response.items as MarketplaceListing[]);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }, [getMarketplaceListings]);
  const fetchLiveGraph = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getLiveGraphData();
      if (response.success) {
        setListGraphs(response.days || []);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }, [getLiveGraphData]);
  const fetchMarketValue = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getMarketValueData();
      if (response.success) {
        setListMarketValue(response.days || []);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }, [getMarketValueData]);
  const fetchGainerItems = useCallback(async (dateFilter = 'all') => {
    setLoadingMarket(true);
    try {
      const response = await getMarketplaceListings({ type: 'up', dateFilter, page: 1 });
      if (response.success && response.items) {
        setListGainer(response.items as MarketplaceListing[]);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingMarket(false);
    }
  }, [getMarketplaceListings]);
  const fetchTrendingItems = useCallback(async (dateFilter = 'all') => {
    setLoadingMarket(true);
    try {
      const response = await getMarketplaceListings({ type: 'up', dateFilter, isTrending: true, page: 1 });
      if (response.success && response.items) {
        setListTrending(response.items as MarketplaceListing[]);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingMarket(false);
    }
  }, [getMarketplaceListings]);
  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('Locker')
        .select(`
          *,
          item:store_items(*),
          user:Users(name, profileImage)
        `)
        .eq('listed_for_sale', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings((data || []).map(item => ({
        ...item.item,
        ...item,
        store_id: item.item_id,
        user_name: item.user?.name || 'Unknown'
      })) as any[]);
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
    lockerId: string,
    price: number,
  ): Promise<boolean> => {
    if (!user?.id) {
      toast.error('Please connect your wallet to create listings');
      return false;
    }

    try {
      const { error } = await supabase
        .from('Locker')
        .update({
          listed_for_sale: true,
          sale_price: price,
          listed_at: new Date().toISOString()
        })
        .eq('id', lockerId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Listing created successfully!');
      await fetchStoreItems(); // Refresh listings
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
        .from('Locker')
        .update({
          listed_for_sale: false,
          sale_price: null,
          listed_at: null
        })
        .eq('id', listingId);

      if (error) throw error;

      toast.success('Listing cancelled successfully!');
      await fetchStoreItems(); // Refresh listings
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