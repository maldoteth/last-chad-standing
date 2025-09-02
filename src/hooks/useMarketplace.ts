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

// Mock data based on top gamers from different time periods
const createMockMarketplaceListings = (): MarketplaceListing[] => {
  const mockUsers = ['user1', 'user2', 'user3', 'user4', 'user5'];
  
  // High-value players from trending data
  const highValuePlayers = [
    // All time top performers
    { name: "Shane Sonny", price: 15000 },
    { name: "White Base Vest", price: 16000 },
    { name: "Lean Chad", price: 13500 },
    { name: "Indi", price: 14200 },
    { name: "Kayne Famooser", price: 12800 },
    
    // Monthly top performers
    { name: "DJ Mouse", price: 9200 },
    { name: "Alex Toosick", price: 8500 },
    { name: "Tarragon Southslice", price: 8900 },
    { name: "Ray Del Maestro", price: 9800 },
    { name: "John Strictland", price: 10500 },
    
    // Weekly top performers
    { name: "Silverborg", price: 7300 },
    { name: "Based Chad", price: 6800 },
    { name: "Leroy Girthy", price: 5900 },
    { name: "Big Dawg", price: 6400 },
    { name: "Zombie Chan", price: 7100 },
    
    // Daily top performers
    { name: "The Irish King", price: 8500 },
    { name: "Stani Eagle", price: 9100 },
    { name: "Speed Buggy", price: 8900 },
    { name: "Jonesy Bones", price: 7200 },
    { name: "Latin Legend", price: 6800 }
  ];

  const listings: MarketplaceListing[] = [];
  
  highValuePlayers.forEach((player, index) => {
    // Create high-value sell listings (10-25% above base price)
    const sellPriceMultiplier = 1.1 + (Math.random() * 0.15);
    const sellPrice = Math.round(player.price * sellPriceMultiplier);
    
    listings.push({
      id: `sell-${index}`,
      user_id: mockUsers[index % mockUsers.length],
      item_id: player.name,
      item_type: 'fighter',
      listing_type: 'sell',
      price: sellPrice,
      quantity: 1,
      status: 'active',
      created_at: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    });
    
    // Create competitive buy listings (5-15% below base price)
    const buyPriceMultiplier = 0.85 + (Math.random() * 0.1);
    const buyPrice = Math.round(player.price * buyPriceMultiplier);
    
    listings.push({
      id: `buy-${index}`,
      user_id: mockUsers[(index + 1) % mockUsers.length],
      item_id: player.name,
      item_type: 'fighter',
      listing_type: 'buy',
      price: buyPrice,
      quantity: 1,
      status: 'active',
      created_at: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    });
  });
  
  return listings.sort((a, b) => b.price - a.price); // Sort by highest prices first
};

export const useMarketplace = () => {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = usePrivy();

  const fetchListings = async () => {
    try {
      // Use mock data with high-value listings from trending players
      const mockListings = createMockMarketplaceListings();
      setListings(mockListings);
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