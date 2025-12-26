import React, { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { EIP1193Provider, getEmbeddedConnectedWallet, usePrivy, useSendTransaction, useWallets } from '@privy-io/react-auth';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreditCard, X, Calendar, TrendingUp, List } from "lucide-react";
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
  icon: Icon,
  label,
  value,
  className
}: {
  icon: React.ComponentType<any>;
  label: string;
  value: string;
  className?: string
}) => (
  <div className={`flex flex-col gap-0.5 ${className}`}>
    <span className="text-xs text-white/50 uppercase tracking-wide inline-flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
    <span className="text-sm font-semibold text-white">
      {value}
    </span>
  </div>
);

// Balance Display Component
const BalanceDisplay = ({
  balance,
  label = "Your balance:"
}: {
  balance: number;
  label?: string;
}) => (
  <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20">
    <span className="text-sm text-white/70">{label}</span>
    <div className="flex items-center gap-1.5">
      <img
        src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png"
        alt="LCS Coin"
        className="w-5 h-5"
      />
      <span className="font-bold text-white text-lg">
        {formatNumberWithAbbreviation(balance)}
      </span>
    </div>
  </div>
);

// Price Display Component
const PriceDisplay = ({ price }: { price: number }) => (
  <div className="relative overflow-hidden flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-purple-600/30 via-purple-500/20 to-purple-600/30 rounded-2xl border border-purple-500/30 shadow-lg shadow-purple-500/10">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    <img
      src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png"
      alt="LCS Coin"
      className="w-8 h-8 relative z-10"
    />
    <span className="text-3xl font-bold text-white relative z-10">
      {formatNumberWithAbbreviation(price)}
    </span>
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
        <DrawerContent className="bg-gradient-to-b from-gray-900/98 via-gray-950/98 to-black/98 backdrop-blur-2xl border border-white/10 max-h-[90vh] shadow-2xl">
          <DrawerHeader className="relative pb-2">
            <DrawerTitle className="text-center text-white/90 text-lg font-semibold tracking-wide">
              Purchase Item
            </DrawerTitle>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-0 right-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                <X className="h-5 w-5" />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <ScrollArea className="max-h-[calc(90vh-80px)] overflow-y-auto custom-scroll">
            {authenticated && (isUserPurchased && item?.quantity > 0) && (
              <div className="px-6 pb-4">
                {item.is_sell_item ? (
                  <Button variant="secondary" disabled={isLoadingCard} onClick={() => handleIsSellItem({ is_sell_item: false })} className="w-full">
                    {isLoadingCard && <Spinner color="gray" />} Remove from Marketplace
                  </Button>
                ) : (
                  <Button variant="destructive" disabled={isLoadingCard} onClick={() => handleOpenSellModal()} className="w-full">
                    {isLoadingCard && <Spinner color="white" />} Sell on Marketplace
                  </Button>
                )}
              </div>
            )}

            <div className="flex flex-col gap-5 px-6 pb-8">
              {/* Item Image with glow effect */}
              <div className="flex justify-center pt-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-transparent rounded-2xl blur-2xl scale-110" />
                  <img
                    src={item?.ImgGatewayUrl || item.image_url || "/placeholder.svg"}
                    alt={item.name}
                    className="relative w-36 h-36 md:w-44 md:h-44 object-contain rounded-2xl border border-white/10 shadow-xl"
                  />
                </div>
              </div>

              {/* Item Details */}
              <div className="space-y-5">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    {item.name}
                  </h3>
                  {/* Seller name for marketplace items */}
                  {isLockerItem && 'user_name' in item && item.user_name && (
                    <p className="text-sm text-white/50">
                      Seller: <span className="text-purple-400 font-medium">{abbreviateUsername(item.user_name)}</span>
                    </p>
                  )}
                  {item.description && (
                    <p className="text-white/60 text-sm md:text-base max-w-sm mx-auto">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Price */}
                {isUserPurchased ? <PriceDisplay price={item.coins} /> :
                  (isLockerItem && 'sale_price' in item) ? <PriceDisplay price={item?.sale_price} /> :
                    <PriceDisplay price={item.price} />}

                {/* Badges Row */}
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <Badge className={`${getRarityColor(item?.rarity)} font-semibold border px-3 py-1`}>
                    {getRarityDisplayName(item?.rarity)}
                  </Badge>
                  <Badge className="capitalize bg-white/10 text-white border-white/20 hover:bg-white/20 px-3 py-1">
                    {item.category}
                  </Badge>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/5 border border-white/10">

                  <StatItem
                    icon={Calendar}
                    label="First Release"
                    value={formatDate(item.first_release_date)}
                  />
                  <StatItem
                    icon={TrendingUp}
                    label="Total Sold"
                    value={formatNumberWithAbbreviation(item.total_purchased || 0)}
                  />
                  {isUserPurchased && (
                    <StatItem
                      icon={Calendar}
                      label="Purchased At"
                      value={formatDate(item?.purchase_date)}
                    />
                  )}
                  {isUserPurchased && (
                    <StatItem
                      icon={List}
                      label="Available Qty"
                      value={formatNumberWithAbbreviation(item?.quantity || 0)}
                    />
                  )}
                </div>

                {/* User Balance Display */}
                {!isUserPurchased && authenticated && (
                  <BalanceDisplay balance={userBalance.coins} />
                )}

                {/* Purchase Button */}
                {!isUserPurchased && (
                  <div className="pt-2">
                    <Button
                      onClick={handlePurchaseWithCoins}
                      className="w-full h-12 flex items-center justify-center gap-2.5 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 hover:from-purple-500 hover:via-purple-400 hover:to-purple-500 text-white font-semibold text-base rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98]"
                      disabled={insufficientFunds || isSubmintLoading || isLoadingCard || isLoading}
                    >
                      <img
                        src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png"
                        alt="LCS Coin"
                        className="w-5 h-5"
                      />
                      {(isSubmintLoading || isLoading) ? <Spinner color="white" /> : insufficientFunds ? 'Insufficient Balance' : 'Purchase with Coins'}
                    </Button>
                  </div>
                )}

                {/* Insufficient Funds Warning */}
                {!isUserPurchased && insufficientFunds && (
                  <div className="text-center text-sm text-red-300 bg-red-500/10 backdrop-blur-sm p-3 rounded-xl border border-red-500/20">
                    You need <span className="font-semibold">{formatNumberWithAbbreviation(item.price - userBalance.coins)}</span> more coins to purchase.
                  </div>
                )}
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
