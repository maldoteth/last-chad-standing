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

// This hook uses the Locker table for marketplace functionality
// Items listed for sale in the Locker table serve as marketplace listings
export const useMarketplace = () => {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = usePrivy();

  const fetchListings = async () => {
    try {
      // Fetch items listed for sale from Locker table
      const { data, error } = await supabase
        .from('Locker')
        .select('*')
        .eq('listed_for_sale', true)
        .order('listed_at', { ascending: false });

      if (error) throw error;
      
      // Transform Locker data to MarketplaceListing format
      const transformedListings: MarketplaceListing[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        item_id: item.item_id,
        item_type: 'store_item',
        listing_type: 'sell' as const,
        price: item.sale_price || item.coins,
        quantity: item.listed_quantity || 1,
        status: item.resale_status || 'active',
        created_at: item.listed_at || item.created_at,
        updated_at: item.created_at,
        expires_at: item.sale_end_date || undefined
      }));
      
      setListings(transformedListings);
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
      // Get user's database ID
      const { data: userData, error: userError } = await supabase
        .from('Users')
        .select('id')
        .eq('privy_id', user.id)
        .single();

      if (userError || !userData) {
        toast.error('User not found');
        return false;
      }

      // For sell listings, update the Locker entry
      if (listingType === 'sell') {
        const { error } = await supabase
          .from('Locker')
          .update({
            listed_for_sale: true,
            sale_price: price,
            listed_quantity: quantity,
            listed_at: new Date().toISOString(),
            resale_status: 'listed'
          })
          .eq('user_id', userData.id)
          .eq('item_id', itemId);

        if (error) throw error;
      }

      toast.success(`${listingType === 'sell' ? 'Sell' : 'Buy'} order created successfully!`);
      await fetchListings();
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
          resale_status: 'not_listed',
          sale_price: null,
          listed_quantity: null,
          listed_at: null
        })
        .eq('id', listingId);

      if (error) throw error;

      toast.success('Listing cancelled successfully!');
      await fetchListings();
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
