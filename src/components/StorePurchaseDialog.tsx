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
  <div className={`space-y-1 ${className}`}>
    <span className="text-sm text-white/70 inline-flex items-center gap-1">
      <Icon className="w-3 h-3" />
      {label}
    </span>
    <span className="text-sm font-medium text-white block">
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
  <div className="flex items-center justify-center gap-2 text-sm text-white/70">
    <span>{label}</span>
    <div className="flex items-center gap-1">
      <img
        src="/lovable-uploads/aa517b6d-c98b-4876-9f58-97246b49844b.png"
        alt="LCS Coin"
        className="w-4 h-4"
      />
      <span className="font-medium text-white">
        {formatNumberWithAbbreviation(balance)}
      </span>
    </div>
  </div>
);

// Price Display Component
const PriceDisplay = ({ price }: { price: number }) => (
  <div className="flex items-center justify-center gap-2 py-3 px-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
    <img
      src="/lovable-uploads/aa517b6d-c98b-4876-9f58-97246b49844b.png"
      alt="LCS Coin"
      className="w-6 h-6 -mt-0.5"
    />
    <span className="text-2xl font-bold text-white">
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
        <DrawerContent className="bg-black/20 backdrop-blur-xl border border-white/20 max-h-[90vh] shadow-2xl">
          <DrawerHeader className="relative">
            <DrawerTitle className="text-center text-white">Purchase Item</DrawerTitle>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-0 right-4 text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <ScrollArea className="max-h-[calc(90vh-80px)] overflow-y-auto custom-scroll">
            {authenticated && (isUserPurchased && item?.quantity > 0) && (
              <div className="px-6">
                {item.is_sell_item ? (
                  <Button variant="secondary" disabled={isLoadingCard} onClick={() => handleIsSellItem({ is_sell_item: false })}>
                    {isLoadingCard && <Spinner color="gray" />}   Remove from Marketplace
                  </Button>
                ) : (
                  <Button variant="destructive" disabled={isLoadingCard} onClick={() => handleOpenSellModal()}>
                    {isLoadingCard && <Spinner color="white" />} Sell on Marketplace
                  </Button>
                )}
              </div>
            )}

            <div className="flex flex-col gap-6 p-6 pb-8">
              {/* Item Image */}
              <div className="flex justify-center">
                <img
                  src={item?.ImgGatewayUrl || item.image_url || "/placeholder.svg"}
                  alt={item.name}
                  className="w-32 h-32 md:w-40 md:h-40 object-contain rounded-xl"
                />
              </div>

              {/* Item Details */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    {item.name}
                  </h3>
                  {/* Seller name for marketplace items */}
                  {isLockerItem && 'user_name' in item && item.user_name && (
                    <p className="text-sm text-white/60 mb-2">
                      Seller: <span className="text-white/80 font-medium">{abbreviateUsername(item.user_name)}</span>
                    </p>
                  )}
                  {item.description && (
                    <p className="text-white/70 text-sm md:text-base">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Price */}
                {isUserPurchased ? <PriceDisplay price={item.coins} /> :
                  (isLockerItem && 'sale_price' in item) ? <PriceDisplay price={item?.sale_price} /> :
                    // ('item_id' in item && item?.item_id) ? <PriceDisplay price={item?.coins} /> :
                    <PriceDisplay price={item.price} />}

                <div className="grid grid-cols-2 gap-4">
                  {/* Rarity */}
                  <div>
                    <Badge className={`${getRarityColor(item?.rarity)} font-medium border`}>
                      {getRarityDisplayName(item?.rarity)}
                    </Badge>
                  </div>

                  {/* Category */}
                  <div>
                    <Badge className="capitalize bg-white/10 text-white border-white/20 hover:bg-white/20">
                      {item.category}
                    </Badge>
                  </div>

                  {/* First Release Date */}
                  <StatItem
                    icon={Calendar}
                    label="First Release"
                    value={formatDate(item.first_release_date)}
                  />


                  {/* Total Purchased */}
                  <StatItem
                    icon={TrendingUp}
                    label="Total Sell"
                    className="flex gap-2 items-center space-y-0"
                    value={formatNumberWithAbbreviation(item.total_purchased || 0)}
                  />
                  {isUserPurchased && <StatItem
                    icon={Calendar}
                    label="Purchased At"
                    value={formatDate(item?.purchase_date)}
                  />}
                  {isUserPurchased && <StatItem
                    icon={List}
                    label="Available Quantity"
                    className="flex gap-2 items-center space-y-0"
                    value={formatNumberWithAbbreviation(item?.quantity || 0)}
                  />}
                </div>

                {/* User Balance Display */}
                {(isUserPurchased) ? null : authenticated && (
                  <BalanceDisplay balance={userBalance.coins} />
                )}

                {/* Purchase Buttons */}
                {(isUserPurchased) ? null : <div className="space-y-3 pt-4">
                  <Button
                    onClick={handlePurchaseWithCoins}
                    className="w-full flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white"
                    disabled={insufficientFunds || isSubmintLoading || isLoadingCard || isLoading}
                  >
                    <img
                      src="/lovable-uploads/aa517b6d-c98b-4876-9f58-97246b49844b.png"
                      alt="LCS Coin"
                      className="w-4 h-4"
                    />
                    {(isSubmintLoading || isLoading) ? <Spinner color="white" /> : 'Purchase with Coins'}
                  </Button>


                  {/* <Button
                  onClick={handleCardPayment}
                  disabled={isSubmintLoading || isLoadingCard}
                  className="w-full flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white"
                >
                  <CreditCard className="w-4 h-4" />
                  {isLoadingCard ? <Spinner color="white" /> : 'Purchase with Card'}
                </Button> */}
                </div>}

                {/* Insufficient Funds Warning */}
                {isUserPurchased ? null : insufficientFunds && (
                  <div className="text-center text-sm text-red-300 bg-red-500/20 backdrop-blur-sm p-3 rounded-lg border border-red-500/30">
                    Insufficient coins. You need {formatNumberWithAbbreviation(item.price - userBalance.coins)} more coins.
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
