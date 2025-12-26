import React, { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { EIP1193Provider, getEmbeddedConnectedWallet, usePrivy, useSendTransaction, useWallets } from '@privy-io/react-auth';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, ZoomIn } from "lucide-react";
import { coinToUsd, formatNumberWithAbbreviation, getRarityColor, getRarityDisplayName, abbreviateUsername } from "@/lib/utils";
import { useStore } from "@/context/storeData";
import { Spinner } from "./ui/spinner";
import { useApi } from "@/Api/apiFunction";
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
  const { post, put, get } = useApi()
  const [isLoading, setIsLoading] = useState(false);
  const { user } = usePrivy()
  const { wallets } = useWallets()
  const { profile } = useProfile()
  const { sendTransaction } = useSendTransaction();
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  // 👇 Sell Modal state
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [tokenIds, setTokenIds] = useState<any[]>();
  const [salePrice, setSalePrice] = useState<number>(0);
  const [listedQuantity, setListedQuantity] = useState<number>(1);
  const [saleEndDate, setSaleEndDate] = useState<any | null>(null);
  const isUserPurchased = (item && "status" in item && item.status === "purchased") && profile?.id === item?.user_id
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
    if (item?.nftAddress && 'item_id' in item) {
      try {
        const data = await get('locker-item/token', { contractId: item.nftAddress, item_id: item?.item_id, userId: item?.user_id });
        const tokenId = data?.item
        console.log(data)
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
  }, [item]);

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
      const { txHash } = await post('privy-nft/safe-transfer', {
        WALLET_ID: item?.nftBuyerWalletId,
        RECIPIENT: userWallet,
        NFT_CONTRACT: item.nftAddress,
        TOKEN_ID: TOKEN_ID == 0 ? TOKEN_ID + 1 : TOKEN_ID
      })
      return txHash?.hash
    } catch (error) {
      throw (error)
    }
  }
  const handleSendPrivyNft = async () => {
    try {
      const userWallet = user.wallet.address as Address
      const { mintTx } = await post('privy-nft/mint', {
        WALLET_ID: item?.nftDeployWalletId,
        RECIPIENT: userWallet,
        NFT_CONTRACT: item.nftAddress
      })
      return mintTx?.hash
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

    } catch (error) {
      console.log(error)
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

      const response = await put(`locker-item/${item?.id}`, { is_sell_item });
      if (response?.success) {
        toast({
          title: "Success",
          description: response?.message,
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
      const response = await put(`locker-item/${item.id}`, {
        is_sell_item: true,
        sale_price: salePrice,
        sale_end_date: saleEndDate,
        listed_quantity: listedQuantity
      });

      if (response?.success) {
        toast({ title: "Success", description: response.message });
        setSellModalOpen(false);
        onClose();
      } else {
        toast({ title: "Error", description: response?.message || "Something went wrong", variant: "destructive" });
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
                  <img
                    src={item?.ImgGatewayUrl || item.image_url || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
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
                      <img
                        src={item?.ImgGatewayUrl || item.image_url || "/placeholder.svg"}
                        alt={item.name}
                        className="max-w-full max-h-[85vh] object-contain rounded-2xl"
                      />
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
                    <h2 className="text-xl font-semibold text-white mb-1">{item.name}</h2>
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
                    <StatItem label="Sold" value={`${item.total_purchased || 0}/500`} />
                    {isUserPurchased && (
                      <StatItem label="Owned" value={formatNumberWithAbbreviation(item?.quantity || 0)} />
                    )}
                  </div>
                  
                  {/* Sold Out Badge */}
                  {(item.total_purchased || 0) >= 500 && !isUserPurchased && (
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
                        onClick={(item.total_purchased || 0) < 500 ? handlePurchaseWithCoins : undefined}
                        disabled={insufficientFunds || isSubmintLoading || isLoadingCard || isLoading}
                        loading={isSubmintLoading || isLoading}
                        insufficientFunds={insufficientFunds}
                      />
                    ) : (
                      <PriceDisplay 
                        price={item.price}
                        onClick={(item.total_purchased || 0) < 500 ? handlePurchaseWithCoins : undefined}
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
                  </div>

                  {/* Actions */}
                  {authenticated && isUserPurchased && item?.quantity > 0 && (
                    <div>
                      {item.is_sell_item ? (
                        <Button 
                          variant="outline" 
                          disabled={isLoadingCard} 
                          onClick={() => handleIsSellItem({ is_sell_item: false })}
                          className="text-white/70 border-white/10 hover:bg-white/5 hover:text-white"
                        >
                          {isLoadingCard && <Spinner color="gray" />} Remove from Marketplace
                        </Button>
                      ) : (
                        <Button 
                          variant="outline"
                          disabled={isLoadingCard} 
                          onClick={() => handleOpenSellModal()}
                          className="text-white/70 border-white/10 hover:bg-white/5 hover:text-white"
                        >
                          {isLoadingCard && <Spinner color="white" />} Sell on Marketplace
                        </Button>
                      )}
                    </div>
                  )}

                </div>
              </div>
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
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
