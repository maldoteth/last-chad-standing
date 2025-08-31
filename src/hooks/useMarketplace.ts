import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePrivy } from '@privy-io/react-auth';
import { toast } from 'sonner';

export interface MarketplaceListing {
  id: string;
  user_id: string;
  item_id: string;
  item_type: string;
  listing_type: 'sell' | 'buy';
  price: number;
  quantity: number;
  status: string;
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

export interface MarketplacePrices {
  bestSellPrice?: number;
  bestBuyPrice?: number;
  hasListings: boolean;
}

export const useMarketplace = () => {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = usePrivy();

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings((data || []) as MarketplaceListing[]);
    } catch (error) {
      console.error('Error fetching marketplace listings:', error);
      toast.error('Failed to load marketplace data');
    } finally {
      setLoading(false);
    }
  };

  const getMarketplacePrices = (itemId: string, itemType: string): MarketplacePrices => {
    const itemListings = listings.filter(
      listing => listing.item_id === itemId && listing.item_type === itemType
    );

    if (itemListings.length === 0) {
      return { hasListings: false };
    }

    const sellListings = itemListings
      .filter(listing => listing.listing_type === 'sell')
      .sort((a, b) => a.price - b.price); // Lowest first

    const buyListings = itemListings
      .filter(listing => listing.listing_type === 'buy')
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

  useEffect(() => {
    fetchListings();
  }, []);

  return {
    listings,
    loading,
    getMarketplacePrices,
    createListing,
    cancelListing,
    refetchListings: fetchListings
  };
};