"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { useProfile } from "./profileContext";
import { useSocketEvent } from "@/hooks/use-socket-events";
import { useLocation } from "react-router-dom";

// ---------- Types ----------
export interface StoreItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  position?: string;
  image?: string | null;
  is_active: boolean;
  first_release_date?: string;
  total_purchased?: number;
  image_url?: string;
  ImgGatewayUrl?: string;
  rarity?: string;
  sale_end_date?: string;
  sale_start_date?: string;
  max_supply?: string | number;
  nftAddress?: string;
  nft_address?: string;
  nftDeployWalletId?: string;
  nft_deploy_wallet_id?: string;
  nftBuyerWalletId?: string;
  user_id?: string;
}

export interface UserBalance {
  coins: number;
  xp?: number;
}

interface StoreContextType {
  storeItems: StoreItem[];
  userBalance: UserBalance;
  currentLevel: string;
  loading: boolean;
  isSubmintLoading: boolean;
  purchaseItem: (itemId: string, itemName: string, price: number, mintTx: string, nftBuyerWalletId: string) => Promise<boolean>;
  purchaseTokenId: (itemId: string, itemName: string, price: number, mintTx: string, nftBuyerWalletId: string, TOKEN_ID: string) => Promise<boolean>;
  refetch: {
    storeItems: () => Promise<void>;
  };
}

// ---------- Context ----------
const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const { user } = usePrivy();
  const { toast } = useToast();
  const { getStoreItems, purchaseStoreItem, purchaseLockerItem } = useSupabase();
  const { profile } = useProfile()
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [userBalance, setUserBalance] = useState<UserBalance>({ coins: 0, xp: 0 });
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmintLoading, setIsSubmintLoading] = useState(false);
  const currentLevel = profile?.performance?.level_id ?? ''
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  // ---------- Fetch store items ----------
  useSocketEvent("storeItems", (data) => {
    if (!data) return;

    setStoreItems((prevData) => {
      const newEntries = Array.isArray(data) ? data : [data];
      let updated = [...prevData];

      newEntries.forEach((entry) => {
        const entryId = entry.id;
        const existingIndex = updated.findIndex((item) => item.id === entryId);

        if (entry.is_active === false) {
          if (existingIndex !== -1) {
            updated.splice(existingIndex, 1);
          }
          return;
        }

        if (existingIndex !== -1) {
          updated[existingIndex] = { ...updated[existingIndex], ...entry };
        } else {
          updated.push(entry);
        }
      });

      return updated;
    });
  });

  const fetchStoreItems = async () => {
    setLoading(true);
    try {
      const response = await getStoreItems(1, 100); // Get first 100 items
      if (response.success) {
        const resData: StoreItem[] = response.items as any;

        setStoreItems(resData?.filter(item => !!item.is_active));
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch store items",
          variant: "destructive",
        });
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
  };
  // ---------- Purchase item ----------
  const purchaseItem = async (itemId: string, itemName: string, price: number, mintTx: string, nftBuyerWalletId: string) => {
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
      setIsSubmintLoading(true)
      const response = await purchaseStoreItem({
        itemId,
        userId: profile?.id || '',
        price,
        mintTx,
        nftBuyerWalletId
      });

      // Update local balance
      if (response.success && response.user) {
        setUserBalance({ coins: response.user.coins, xp: response.user.xp });

        toast({
          title: "Purchase successful!",
          description: `You purchased ${itemName} for ${price} coins.`,
        });
        return true;
      } else {
        throw new Error(response.error || 'Purchase failed');
      }
    } catch (error) {
      console.error("Error purchasing item:", error);
      toast({
        title: "Purchase failed",
        description: "There was an error processing your purchase. Please try again.",
        variant: "destructive",
      });
      return false;
    }
    finally {
      setIsSubmintLoading(false)
    }
  };
  const purchaseTokenId = async (itemId: string, itemName: string, price: number, mintTx: string, nftBuyerWalletId: string, TOKEN_ID: string) => {
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
      setIsSubmintLoading(true)
      const response = await purchaseLockerItem({
        lockerId: itemId,
        userId: profile?.id || '',
        price,
        mintTx,
        nftBuyerWalletId,
        tokenId: TOKEN_ID
      });

      // Update local balance
      if (response.success && response.user) {
        setUserBalance({ coins: response.user.coins, xp: response.user.xp });

        toast({
          title: "Purchase successful!",
          description: `You purchased ${itemName} for ${price} coins.`,
        });
        return true;
      } else {
        throw new Error(response.error || 'Purchase failed');
      }
    } catch (error) {
      console.error("Error purchasing item:", error);
      toast({
        title: "Purchase failed",
        description: "There was an error processing your purchase. Please try again.",
        variant: "destructive",
      });
      return false;
    }
    finally {
      setIsSubmintLoading(false)
    }
  };

  // ---------- Initialize ----------
  useEffect(() => {
    if (isAdmin) {
      return
    }
    const initializeData = async () => {
      setLoading(true);
      await fetchStoreItems();
      setLoading(false);
    };

    initializeData();
  }, [user?.id]);
  useEffect(() => {
    if (profile && user) {
      setUserId(profile?.id);
      setUserBalance({ coins: profile?.coins, xp: profile?.xp });
    }
  }, [profile, user]);

  return (
    <StoreContext.Provider
      value={{
        storeItems,
        userBalance,
        loading,
        currentLevel,
        isSubmintLoading,
        purchaseItem,
        purchaseTokenId,
        refetch: {
          storeItems: fetchStoreItems,
        },
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

// ---------- Hook ----------
export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
