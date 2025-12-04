import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface StoreItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  rarity: string;
  image_url: string;
  is_active: boolean;
  first_release_date?: string;
  total_purchased?: number;
  max_supply?: number;
}

export interface UserBalance {
  coins: number;
  xp: number;
}

export interface UserInventoryItem {
  id: string;
  item_id: string;
  quantity: number | null;
  purchase_date: string;
  store_item?: StoreItem;
}

export const useStore = () => {
  const { user } = usePrivy();
  const { toast } = useToast();
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [userBalance, setUserBalance] = useState<UserBalance>({ coins: 0, xp: 0 });
  const [userInventory, setUserInventory] = useState<UserInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch store items
  const fetchStoreItems = async () => {
    const { data, error } = await supabase
      .from('store_items')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching store items:', error);
      return;
    }

    setStoreItems(data || []);
  };

  // Fetch user balance from Users table
  const fetchUserBalance = async () => {
    if (!user?.id) return;

    // First try to find user by privy_id
    const { data, error } = await supabase
      .from('Users')
      .select('coins, xp')
      .eq('privy_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user balance:', error);
      return;
    }

    if (data) {
      setUserBalance({ 
        coins: Number(data.coins) || 0, 
        xp: Number(data.xp) || 0 
      });
    }
  };

  // Fetch user inventory from Locker table
  const fetchUserInventory = async () => {
    if (!user?.id) return;

    // Get user id from Users table first
    const { data: userData, error: userError } = await supabase
      .from('Users')
      .select('id')
      .eq('privy_id', user.id)
      .maybeSingle();

    if (userError || !userData) {
      console.error('Error fetching user:', userError);
      return;
    }

    const { data, error } = await supabase
      .from('Locker')
      .select(`
        id,
        item_id,
        quantity,
        purchase_date,
        store_items (*)
      `)
      .eq('user_id', userData.id);

    if (error) {
      console.error('Error fetching user inventory:', error);
      return;
    }

    const inventoryItems: UserInventoryItem[] = (data || []).map(item => ({
      id: item.id,
      item_id: item.item_id,
      quantity: item.quantity,
      purchase_date: item.purchase_date,
      store_item: item.store_items as unknown as StoreItem
    }));

    setUserInventory(inventoryItems);
  };

  // Purchase item
  const purchaseItem = async (itemId: string, itemName: string, price: number) => {
    if (!user?.id) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to make purchases.",
        variant: "destructive",
      });
      return false;
    }

    if (userBalance.coins < price) {
      toast({
        title: "Insufficient coins",
        description: `You need ${price} coins but only have ${userBalance.coins}.`,
        variant: "destructive",
      });
      return false;
    }

    try {
      // Get user id from Users table
      const { data: userData, error: userError } = await supabase
        .from('Users')
        .select('id, coins')
        .eq('privy_id', user.id)
        .single();

      if (userError || !userData) {
        throw new Error('User not found');
      }

      // Update user coins
      const { error: balanceError } = await supabase
        .from('Users')
        .update({ coins: Number(userData.coins) - price })
        .eq('id', userData.id);

      if (balanceError) {
        throw balanceError;
      }

      // Add to Locker (inventory)
      const { error: lockerError } = await supabase
        .from('Locker')
        .insert({
          user_id: userData.id,
          item_id: itemId,
          quantity: 1,
          coins: price,
          total_purchased_locker_item: 1
        });

      if (lockerError) {
        throw lockerError;
      }

      // Record transaction
      const { error: transactionError } = await supabase
        .from('Transactions')
        .insert({
          user_id: userData.id,
          item_id: itemId,
          amount: price,
          coins: price,
          paymentMethod: 'coin',
          status: 'success'
        });

      if (transactionError) {
        console.error('Transaction record error:', transactionError);
        // Don't fail the purchase for transaction logging errors
      }

      // Update local state
      setUserBalance({ coins: userBalance.coins - price, xp: userBalance.xp });
      await fetchUserInventory();

      toast({
        title: "Purchase successful!",
        description: `You purchased ${itemName} for ${price} coins.`,
      });

      return true;
    } catch (error) {
      console.error('Error purchasing item:', error);
      toast({
        title: "Purchase failed",
        description: "There was an error processing your purchase. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await fetchStoreItems();
      if (user?.id) {
        await fetchUserBalance();
        await fetchUserInventory();
      }
      setLoading(false);
    };

    initializeData();
  }, [user?.id]);

  return {
    storeItems,
    userBalance,
    userInventory,
    loading,
    purchaseItem,
    refetch: {
      storeItems: fetchStoreItems,
      userBalance: fetchUserBalance,
      userInventory: fetchUserInventory,
    }
  };
};
