import React, { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { EIP1193Provider, getEmbeddedConnectedWallet, usePrivy, useSendTransaction, useWallets } from '@privy-io/react-auth';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, ZoomIn } from "lucide-react";
import { coinToUsd, formatNumberWithAbbreviation, getRarityColor, getRarityDisplayName, abbreviateUsername } from "@/lib/utils";
import { useStore } from "@/context/storeData";
import { Spinner } from "./ui/spinner";
import { useSupabase } from "@/hooks/useSupabase";
import {
  Address,
  createWalletClient,
  custom,
  encodeFunctionData,
  Hex,
  parseAbi,
  WalletClient,
} from "viem";
import { getUserTokens, sendNFT } from "@/utils/nftContractUtils";
import { CONTRACT_ABI, erc721Abi } from "@/utils/helpers";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker"; // you can use any date picker
import { useProfile } from "@/context/profileContext";
import BidDialog from "./BidDialog";
import BidListPanel from "./BidListPanel";
import { useBids } from "@/hooks/useBids";

interface StoreItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  rarity?: string;
  image_url?: string;
  ImgGatewayUrl?: string;
  nftAddress?: Address;
  userAddress?: Address;
  first_release_date?: string;
  total_purchased?: number;
  quantity?: number;
  coins?: number;
  nftDeployWalletId?: string;
  nftBuyerWalletId?: string;
  token_ids?: any[];
}
export interface LockerItem extends StoreItem {
  user_id: string;
  item_id: string;
  quantity: number;
  price_at_buy: number;
  coins: number;
  purchase_date: string;
  status: string;
  store_id: string;
  created_at: string;
  sale_price: number;
  updated_at: string;
  sale_start_date?: string | null;
  sale_end_date?: string | null;
  coin_change?: number | null;
  change_type?: string | null;
  total_purchased_locker_item?: number | null;
  is_sell_item?: boolean | null;
  user_name?: string;
}

interface StorePurchaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: StoreItem | LockerItem | null;
  isLockerItem?: boolean
}

// Get max supply based on rarity
const getRarityMaxSupply = (rarity?: string): number => {
  switch (rarity?.toLowerCase()) {
    case 'legendary':
      return 100;
    case 'epic':
      return 200;
    case 'rare':
      return 300;
    case 'sparse':
    default:
      return 500;
  }
};

// Stat Item Component
const StatItem = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="text-center">
    <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">{label}</p>
    <p className="text-white text-sm font-medium">{value}</p>
  </div>
);

// Balance Display Component
const BalanceDisplay = ({
  balance,
}: {
  balance: number;
}) => (
  <div className="flex items-center justify-center gap-1.5 text-white/50 text-sm">
    <span>Balance:</span>
    <img
      src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png"
      alt="LCS Coin"
      className="w-4 h-4"
    />
    <span className="text-white font-medium">{formatNumberWithAbbreviation(balance)}</span>
  </div>
);

// Price Display Component (Clickable)
const PriceDisplay = ({ 
  price, 
  onClick, 
  disabled, 
  loading,
  insufficientFunds 
}: { 
  price: number; 
  onClick?: () => void; 
  disabled?: boolean;
  loading?: boolean;
  insufficientFunds?: boolean;
}) => (
  <div className="flex justify-center w-full">
    <button
      onClick={onClick}
      disabled={disabled || !onClick}
      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 mx-auto ${
        onClick && !disabled
          ? 'bg-white/10 hover:bg-white/20 hover:scale-105 cursor-pointer active:scale-95 backdrop-blur-sm border border-white/10'
          : ''
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${insufficientFunds ? 'border-red-500/30' : ''}`}
    >
    {loading ? (
      <Spinner color="white" />
    ) : (
      <>
        <img
          src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png"
          alt="LCS Coin"
          className="w-6 h-6"
        />
        <span className="text-2xl font-bold text-white">
          {formatNumberWithAbbreviation(price)}
        </span>
      </>
    )}
    </button>
  </div>
);

const StorePurchaseDialog: React.FC<StorePurchaseDialogProps> = ({
  isOpen,
  onClose,
  item,
  isLockerItem = false
}) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { authenticated, login } = usePrivy();
  const { purchaseItem, purchaseTokenId, userBalance, isSubmintLoading, } = useStore();
  const [isLoadingCard, setIsLoadingCard] = useState(false);
  const { getContractToken, updateLockerItem, supabase: supabaseInstance } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = usePrivy()
  const { wallets } = useWallets()
  const { profile } = useProfile()
  const { sendTransaction } = useSendTransaction();
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [isBidDialogOpen, setIsBidDialogOpen] = useState(false);
  const [highestBid, setHighestBid] = useState<any>(null);
  const { getHighestBidForLocker } = useBids();
  // 👇 Sell Modal state
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [tokenIds, setTokenIds] = useState<any[]>();
  const [salePrice, setSalePrice] = useState<number>(0);
  const [listedQuantity, setListedQuantity] = useState<number>(1);
  const [saleEndDate, setSaleEndDate] = useState<any | null>(null);
  const isUserOwned = item && "user_id" in item && item.user_id === profile?.id;
  const isUserPurchased = isUserOwned || (item && "status" in item && item.status === "purchased" && profile?.id === item?.user_id);
  const fetchBalance = async () => {
    if (item?.nftAddress) {
      try {
        const data = await getUserTokens(
          item.nftAddress as Address,
          item.userAddress || user?.wallet?.address as Address
        );
        const converted = data?.toString()
        const numbers = converted.split(",")
          .map(Number)
          .filter((v, i, a) => a.indexOf(v) === i)
        setTokenIds(numbers)
      } catch (error) {
        console.error("Error fetching user balance:", error);
      }
    }
  };
  const fetchToken = async () => {
    if (item?.nftAddress && 'item_id' in item && item.user_id) {
      try {
        const res = await getContractToken(item.nftAddress as string, item.item_id, item.user_id);
        const tokenId = res?.data;
        if (!tokenId?.token_id) {
          fetchBalance()
        } else {
          setTokenIds([tokenId?.token_id])
        }
      } catch (error) {
        console.error("Error fetching user balance:", error);
      }
    }
  };
  useEffect(() => {
    fetchToken();
    if (isOpen && isLockerItem && item?.id) {
       getHighestBidForLocker(item.id).then(res => {
         if (res.success) setHighestBid(res.data);
       });
    }
  }, [item, isOpen]);

  // Reset image expanded state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setIsImageExpanded(false);
    }
  }, [isOpen]);
  const handleTransferPrivyNft = async () => {
    try {
      const TOKEN_ID =  tokenIds?.length > 0 ? tokenIds[0] : ''

      const userWallet = user.wallet.address as Address
      const buyerWalletId = item?.nftBuyerWalletId || (item as any)?.nft_buyer_wallet_id;
      const contractAddress = item.nftAddress || (item as any)?.nft_address;

      console.log("🛠️ Transfer Request Details:", {
        WALLET_ID: buyerWalletId,
        RECIPIENT: userWallet,
        NFT_CONTRACT: contractAddress,
        TOKEN_ID: TOKEN_ID
      });

      if (!buyerWalletId || !contractAddress) {
        throw new Error(`Missing NFT details for transfer! WALLET_ID: ${buyerWalletId}, CONTRACT: ${contractAddress}.`);
      }

      const { data, error } = await supabase.functions.invoke('safe-transfer', {
        body: {
            WALLET_ID: buyerWalletId,
            RECIPIENT: userWallet,
            NFT_CONTRACT: contractAddress,
            TOKEN_ID: TOKEN_ID == 0 ? TOKEN_ID + 1 : TOKEN_ID
        }
      });
      if (error) throw error;
      return data?.txHash?.hash;
    } catch (error) {
      throw (error)
    }
  }
  const handleSendPrivyNft = async () => {
    try {
      const userWallet = user.wallet.address as Address
      const walletId = item?.nftDeployWalletId || (item as any)?.nft_deploy_wallet_id || (item as any)?.nftDeployWalletId;
      const contractAddress = item.nftAddress || (item as any)?.nft_address;

      console.log("🛠️ Minting Request Details:", {
        WALLET_ID: walletId,
        RECIPIENT: userWallet,
        NFT_CONTRACT: contractAddress
      });

      if (!walletId || !contractAddress) {
        throw new Error(`Missing NFT details! WALLET_ID: ${walletId}, CONTRACT: ${contractAddress}. Please recreate the item in Admin.`);
      }

      const { data, error } = await supabase.functions.invoke('mint-nft', {
        body: {
            WALLET_ID: walletId,
            RECIPIENT: userWallet,
            NFT_CONTRACT: contractAddress
        }
      });
      if (error) throw error;
      return data?.mintTx?.hash;
    } catch (error) {
      throw (error)
    }
  }
  if (!item) return null;

  const handleOpenSellModal = () => {
    setSalePrice(item.coins);
    setListedQuantity(item.quantity || 1);
    setSaleEndDate(null);
    setSellModalOpen(true);
  };
  const insufficientFunds = authenticated && userBalance.coins < item.price;

  const handlePurchaseWithCoins = async () => {
    try {
      setIsLoading(true)
      if (!authenticated) {
        toast({
          title: "Please log in",
          description: "You need to be logged in to make purchases.",
          action: (
            <Button size="sm" onClick={login}>
              Sign In
            </Button>
          )
        });
        return;
      }
      if (insufficientFunds) {
        toast({
          title: 'Insufficient Funds! please add coins',
          variant: 'destructive',
        })
      }
      const TOKEN_ID =  tokenIds?.length > 0 ? tokenIds[0] : ''

      const mintTx = isLockerItem ? await handleTransferPrivyNft() : await handleSendPrivyNft()
      let success = null;
      if (isLockerItem && 'sale_price' in item) {
        success = await purchaseTokenId(
          item.id,
          item.name,
          item.sale_price,
          mintTx as any,
          user?.wallet?.id as string,
          TOKEN_ID == 0 ? TOKEN_ID + 1 : TOKEN_ID
        );
      } else {
        success = await purchaseItem(
          item.id,
          item.name,
          item?.price,
          mintTx as any,
          user?.wallet?.id as string
        );
      }

      if (success) {
        onClose();
      }

    } catch (error: any) {
      console.log("Purchase Error:", error);
      
      let errorMessage = "Something went wrong. Please try again.";
      
      // Handle Supabase Edge Function errors
      if (error.context) {
        try {
          const body = await error.context.json();
          if (body.message) {
            errorMessage = body.message;
          } else if (body.error) {
            errorMessage = body.error;
          }
        } catch (e) {
          errorMessage = error.message || "Edge Function error";
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      // Special case for common variations of insufficient funds
      if (errorMessage.toLowerCase().includes("insufficient funds") || 
          errorMessage.toLowerCase().includes("insufficient_funds")) {
        if (errorMessage.includes("Admin wallet")) {
          // This is our specific message from the Edge Function
        } else {
          errorMessage = "Server error: The minting wallet has insufficient gas funds. Please contact admin.";
        }
      }


      toast({
        title: "Purchase Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false)
    }
  };

  const handleIsSellItem = async ({ is_sell_item }: { is_sell_item: boolean }) => {
    if (!authenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to purchase with card",
        action: (
          <Button size="sm" onClick={login}>
            Sign In
          </Button>
        )
      });
      return;
    }
    try {
      setIsLoadingCard(true);

      const response = await updateLockerItem(item?.id as string, { is_sell_item });
      if (response?.success) {
        toast({
          title: "Success",
          description: "Locker item updated",
        });
        onClose();
      }
    } catch (error: any) {
      console.error("Locker Item error:", error);
      toast({
        title: "Locker Item",
        description: error?.error || "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingCard(false);
    }
  };

  const handleSellSubmit = async () => {
    if (!authenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to sell items",
        action: <Button size="sm" onClick={login}>Sign In</Button>
      });
      return;
    }

    if (listedQuantity < 1 || listedQuantity > (item.quantity || 1)) {
      toast({ title: "Invalid Quantity", description: "Quantity must be between 1 and your owned amount", variant: "destructive" });
      return;
    }

    // if (!saleEndDate) {
    //   toast({ title: "Invalid Date", description: "Please select a valid sale end date", variant: "destructive" });
    //   return;
    // }

    try {
      setIsLoading(true);
      const response = await updateLockerItem(item.id, {
        is_sell_item: true,
        sale_price: salePrice,
        sale_end_date: saleEndDate,
        listed_quantity: listedQuantity,
        listed_at: new Date().toISOString(),
        listed_for_sale: true
      });

      if (response?.success) {
        toast({ title: "Success", description: "Item listed on marketplace" });
        setSellModalOpen(false);
        onClose();
      } else {
        toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
      }
    } catch (error: any) {
      console.error("Sell Item error:", error);
      toast({ title: "Error", description: error?.message || "Failed to list item", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  return (
    <>
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="bg-black/[0.08] backdrop-blur-3xl border-t border-white/5 max-h-[85vh]">
          <DrawerHeader className="relative py-4 border-b border-white/5">
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 text-white/40 hover:text-white hover:bg-white/5 rounded-full h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
            <DrawerTitle className="sr-only">Purchase Item</DrawerTitle>
          </DrawerHeader>

          <ScrollArea className="max-h-[calc(85vh-60px)] overflow-y-auto">
            <div className="px-6 py-6">
              {/* Main Content - Horizontal on larger screens */}
              <div className="flex flex-col items-center gap-6">
                
                {/* Image - Clickable to expand */}
                <div 
                  className="relative w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden bg-white/5 cursor-pointer group"
                  onClick={() => setIsImageExpanded(true)}
                >
                  {(() => {
                    const rawUrl = item?.ImgGatewayUrl || item?.image_url;
                    let finalUrl = rawUrl || "/placeholder.svg";

                    if (rawUrl) {
                      if (rawUrl.includes('pinata.cloud/ipfs/')) {
                        const parts = rawUrl.split('/ipfs/');
                        const path = parts[parts.length - 1];
                        if (!(path.startsWith('Qm') || path.startsWith('bafy'))) {
                          const cleanPath = decodeURIComponent(path).split('/').pop() || path;
                          const { data: { publicUrl } } = supabase.storage.from('items').getPublicUrl(cleanPath);
                          finalUrl = publicUrl;
                        }
                      } else if (!rawUrl.startsWith('http')) {
                        const isIPFS = rawUrl.startsWith('Qm') || rawUrl.startsWith('bafy');
                        if (isIPFS) {
                          finalUrl = `https://gateway.pinata.cloud/ipfs/${rawUrl}`;
                        } else {
                          const cleanPath = decodeURIComponent(rawUrl).split('/').pop() || rawUrl;
                          const { data: { publicUrl } } = supabase.storage.from('items').getPublicUrl(cleanPath);
                          finalUrl = publicUrl;
                        }
                      }
                    }

                    return (
                      <img
                        src={finalUrl}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    );
                  })()}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Expanded Image Modal */}
                {isImageExpanded && (
                  <div 
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:pb-[100px]"
                    onClick={() => setIsImageExpanded(false)}
                  >
                    <div className="relative max-w-[90vw] max-h-[90vh] md:-translate-y-[50px]">
                      {(() => {
                        const rawUrl = item?.ImgGatewayUrl || item?.image_url;
                        let finalUrl = rawUrl || "/placeholder.svg";

                        if (rawUrl) {
                          if (rawUrl.includes('pinata.cloud/ipfs/')) {
                            const parts = rawUrl.split('/ipfs/');
                            const path = parts[parts.length - 1];
                            if (!(path.startsWith('Qm') || path.startsWith('bafy'))) {
                              const cleanPath = decodeURIComponent(path).split('/').pop() || path;
                              const { data: { publicUrl } } = supabase.storage.from('items').getPublicUrl(cleanPath);
                              finalUrl = publicUrl;
                            }
                          } else if (!rawUrl.startsWith('http')) {
                            const isIPFS = rawUrl.startsWith('Qm') || rawUrl.startsWith('bafy');
                            if (isIPFS) {
                              finalUrl = `https://gateway.pinata.cloud/ipfs/${rawUrl}`;
                            } else {
                              const cleanPath = decodeURIComponent(rawUrl).split('/').pop() || rawUrl;
                              const { data: { publicUrl } } = supabase.storage.from('items').getPublicUrl(cleanPath);
                              finalUrl = publicUrl;
                            }
                          }
                        }

                        return (
                          <img
                            src={finalUrl}
                            alt={item.name}
                            className="max-w-full max-h-[85vh] object-contain rounded-2xl"
                          />
                        );
                      })()}
                      <button
                        onClick={() => setIsImageExpanded(false)}
                        className="absolute -top-3 -right-3 w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Info Section */}
                <div className="flex-1 text-center space-y-4 w-full max-w-sm">
                  {/* Name & Description */}
                  <div>
                    <h2 className="text-2xl font-semibold text-white mb-1">{item.name}</h2>
                    {item.description && (
                      <p className="text-white/50 text-sm">{item.description}</p>
                    )}
                    {isLockerItem && 'user_name' in item && item.user_name && (
                      <p className="text-white/40 text-xs mt-2">
                        Sold by {abbreviateUsername(item.user_name)}
                      </p>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="outline" className={`${getRarityColor(item?.rarity)} text-xs`}>
                      {getRarityDisplayName(item?.rarity)}
                    </Badge>
                    <Badge variant="outline" className="capitalize text-white/60 border-white/10 text-xs">
                      {item.category}
                    </Badge>
                  </div>

                  {/* Stats Row */}
                  <div className="flex justify-center gap-8 py-3 border-y border-white/5">
                    <StatItem label="Released" value={formatDate(item.first_release_date)} />
                    <StatItem label="Sold" value={`${item.total_purchased || 0}/${getRarityMaxSupply(item.rarity)}`} />
                    {isUserPurchased && (
                      <StatItem label="Owned" value={formatNumberWithAbbreviation(item?.quantity || 0)} />
                    )}
                  </div>
                  
                  {/* Sold Out Badge */}
                  {(item.total_purchased || 0) >= getRarityMaxSupply(item.rarity) && !isUserPurchased && (
                    <div className="text-center py-2">
                      <Badge variant="outline" className="text-red-400 border-red-400/30 bg-red-500/10 px-4 py-1">
                        Sold Out
                      </Badge>
                    </div>
                  )}

                  {/* Price Section - Clickable to Buy */}
                  <div className="py-4">
                    {isUserPurchased ? (
                      <PriceDisplay price={item.coins} />
                    ) : (isLockerItem && 'sale_price' in item) ? (
                      <PriceDisplay 
                        price={item?.sale_price} 
                        onClick={(item.total_purchased || 0) < getRarityMaxSupply(item.rarity) ? handlePurchaseWithCoins : undefined}
                        disabled={insufficientFunds || isSubmintLoading || isLoadingCard || isLoading}
                        loading={isSubmintLoading || isLoading}
                        insufficientFunds={insufficientFunds}
                      />
                    ) : (
                      <PriceDisplay 
                        price={item.price}
                        onClick={(item.total_purchased || 0) < getRarityMaxSupply(item.rarity) ? handlePurchaseWithCoins : undefined}
                        disabled={insufficientFunds || isSubmintLoading || isLoadingCard || isLoading}
                        loading={isSubmintLoading || isLoading}
                        insufficientFunds={insufficientFunds}
                      />
                    )}
                    
                    {!isUserPurchased && authenticated && (
                      <div className="mt-3">
                        <BalanceDisplay balance={userBalance.coins} />
                        {insufficientFunds && (
                          <p className="text-red-400/70 text-xs mt-1">Insufficient balance</p>
                        )}
                      </div>
                    )}

                    {highestBid && (
                      <div className="mt-2 text-center">
                        <p className="text-green-400/80 text-[10px] uppercase tracking-widest font-bold">
                          Highest Bid: {formatNumberWithAbbreviation(highestBid.bid_amount)}
                        </p>
                      </div>
                    )}

                    {isLockerItem && !isUserPurchased && (
                      <Button 
                        variant="outline"
                        onClick={() => setIsBidDialogOpen(true)}
                        className="mt-4 w-full py-4 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-semibold transition-all"
                      >
                        Place Bid
                      </Button>
                    )}
                  </div>

                  {/* Actions */}
                  {authenticated && isUserPurchased && item?.quantity > 0 && (
                    <div>
                      <div className="flex flex-col gap-2">
                        {item.is_sell_item ? (
                          <Button 
                            variant="outline" 
                            disabled={isLoadingCard} 
                            onClick={() => handleIsSellItem({ is_sell_item: false })}
                            className="text-white/70 border-white/10 hover:bg-white/5 hover:text-white w-full"
                          >
                            {isLoadingCard && <Spinner color="gray" />} Remove from Marketplace
                          </Button>
                        ) : (
                          <Button 
                            variant="outline"
                            disabled={isLoadingCard} 
                            onClick={() => handleOpenSellModal()}
                            className="text-white/70 border-white/10 hover:bg-white/5 hover:text-white w-full"
                          >
                            {isLoadingCard && <Spinner color="white" />} Sell on Marketplace
                          </Button>
                        )}
                        
                        {(item.nftAddress || (item as any)?.nft_address) && (
                          <Button
                            variant="link"
                            className="text-primary hover:text-primary/80 text-xs py-0 h-auto font-medium"
                            onClick={() => {
                              const addr = item.nftAddress || (item as any)?.nft_address;
                              const tid = tokenIds && tokenIds.length > 0 ? tokenIds[0] : null;
                              const url = tid !== null 
                                ? `https://basescan.org/token/${addr}?a=${tid}` 
                                : `https://basescan.org/address/${addr}`;
                              window.open(url, '_blank');
                            }}
                          >
                            View on BaseScan →
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {isUserOwned && (item as any).listed_for_sale && (
                    <BidListPanel 
                      lockerId={item.id} 
                      itemId={(item as any).item_id} 
                      onBidAccepted={() => {
                        onClose();
                      }} 
                    />
                  )}

                </div>
              </div>
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      {item && (
        <BidDialog 
          isOpen={isBidDialogOpen} 
          onClose={() => setIsBidDialogOpen(false)} 
          item={item} 
        />
      )}
      {sellModalOpen && (
        <Drawer open={sellModalOpen} onOpenChange={() => setSellModalOpen(false)}>
          <DrawerContent className="bg-black/30 backdrop-blur-xl border border-white/20 max-h-[60vh] shadow-2xl p-6">
            <DrawerHeader>
              <DrawerTitle className="text-white text-center">List Item on Marketplace</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="absolute top-0 right-4 text-white/70 hover:text-white hover:bg-white/10">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </DrawerHeader>
            <div className=" mt-6 grid grid-cols-2 gap-3">
              <div>
                <label className="text-white block mb-1">Sale Price</label>
                <input
                  type="number"
                  value={salePrice}
                  onChange={(e) => setSalePrice(parseFloat(e.target.value))}
                  className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
                />
              </div>
              <div>
                <label className="text-white block mb-1">Quantity to List</label>
                <input
                  type="number"
                  value={listedQuantity}
                  onChange={(e) => setListedQuantity(parseInt(e.target.value))}
                  max={item.quantity}
                  min={1}
                  className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
                />
              </div>
              {/* <div>
                <label className="text-white block mb-1">Sale End Date</label>
                <input
                  value={saleEndDate}
                  onChange={(date) => setSaleEndDate(date.target.value)}
                  placeholder="Select Date"
                  type="date"
                  className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
                />
              </div> */}
            </div>
            <div className="mt-2 inline-block1">
              <Button
                onClick={handleSellSubmit}
                disabled={isLoading}
                variant="secondary"
                className=" px-10 "
              >
                {isLoading ? <Spinner color="white" /> : "List Item"}
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};
export default StorePurchaseDialog;
