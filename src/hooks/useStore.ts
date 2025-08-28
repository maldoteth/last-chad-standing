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
  image_url: string | null;
  is_active: boolean;
}

export interface UserBalance {
  coins: number;
  xp: number;
}

export interface UserInventoryItem {
  id: string;
  item_id: string;
  quantity: number;
  purchased_at: string;
  store_items: StoreItem;
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

  // Fetch user balance
  const fetchUserBalance = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from('user_balances')
      .select('coins, xp')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user balance:', error);
      return;
    }

    if (!data) {
      // Create initial balance for new user
      const { data: newBalance, error: insertError } = await supabase
        .from('user_balances')
        .insert({ user_id: user.id, coins: 1000, xp: 0 })
        .select('coins, xp')
        .single();

      if (insertError) {
        console.error('Error creating user balance:', insertError);
        return;
      }

      setUserBalance({ coins: newBalance.coins, xp: newBalance.xp });
    } else {
      setUserBalance({ coins: data.coins, xp: data.xp });
    }
  };

  // Fetch user inventory
  const fetchUserInventory = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from('user_inventory')
      .select(`
        id,
        item_id,
        quantity,
        purchased_at,
        store_items (*)
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching user inventory:', error);
      return;
    }

    setUserInventory(data || []);
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
      // Start transaction
      const { error: balanceError } = await supabase
        .from('user_balances')
        .update({ coins: userBalance.coins - price })
        .eq('user_id', user.id);

      if (balanceError) {
        throw balanceError;
      }

      // Add to inventory
      const { error: inventoryError } = await supabase
        .from('user_inventory')
        .upsert(
          { user_id: user.id, item_id: itemId, quantity: 1 },
          { onConflict: 'user_id,item_id' }
        );

      if (inventoryError) {
        throw inventoryError;
      }

      // Record transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          item_id: itemId,
          amount: price,
          transaction_type: 'purchase'
        });

      if (transactionError) {
        throw transactionError;
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