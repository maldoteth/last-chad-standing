import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2, Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApi } from "@/Api/apiFunction";
import { CheckPrivy, CryptoPaymentProps } from "@/lib/checkPrivy";
import { coinToUsd } from "@/lib/utils";
import { useProfile } from "@/context/profileContext";
import useEthToUsdRate from "@/lib/useEthrate";

interface BuyDialogContentProps {
  selectedPlayer?: {
    name: string;
    [key: string]: any;
  } | null;
  onClose: () => void;
}

const BuyDialogContent: React.FC<BuyDialogContentProps> = ({ selectedPlayer, onClose }) => {
  const { toast } = useToast();
  const { post } = useApi();
  const [isLoadingCard, setIsLoadingCard] = useState(false);
  const [showCheckPrivy, setShowCheckPrivy] = useState(false);
  const [selectedCoins, setSelectedCoins] = useState<number>(500);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchProfile } = useProfile()
  const ethToUsdRate = useEthToUsdRate();
// You can use this rate when calculating ethAmount etc.
  // Coin presets
  const coinPresets = [
    { coins: 100, label: "100" },
    { coins: 1000, label: "1K" },
    { coins: 10000, label: "10K" },
    { coins: 100000, label: "100K" },
    { coins: 1000000, label: "1M" },
    { coins: 10000000, label: "10M" },
  ];

  const usdValue = (selectedCoins * coinToUsd).toFixed(2);

  const handleCardPayment = async () => {
    try {
      setIsLoadingCard(true);

      // Call Stripe checkout session API
      const response = await post("payment/checkout-session", {
        cartItems: [{
          name: `${selectedCoins} Coins`,
          price: parseFloat(usdValue)
        }],
      });
      // Redirect to Stripe checkout if URL is provided
      if (response?.url) {
        window.location.href = response.url;
      } else {
        toast({
          title: "Success",
          description: "Checkout session created successfully",
        });
        onClose();
      }
    } catch (error: any) {
      console.error("Stripe checkout error:", error);
      toast({
        title: "Payment Error",
        description: error.response?.data?.message || "Failed to initialize payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingCard(false);
    }
  };

  const handleCryptoCompletedPayment = async (data: CryptoPaymentProps) => {
    try {
      setIsLoading(true);

      // Call Stripe checkout session API
      const response = await post("payment/crypto", {
        coins: selectedCoins,
        txHash: data?.hash,
        depositAddress: data?.address,
        exchangeRate: data?.exchangeRate,
        cryptoAmount: data?.cryptoAmount,
        amount: data?.amount
      });
      // Redirect to Stripe checkout if URL is provided
      if (response?.success) {
        toast({
          title: "Success",
          description: response?.message,
        });
        await fetchProfile()
      }

    } catch (error: any) {
      console.error("Stripe checkout error:", error);
      toast({
        title: "Payment Error",
        description: error.response?.data?.message || "Failed to payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleCryptoPayment = () => {
    setShowCheckPrivy(true);
  };

  // If CheckPrivy is shown, render it instead of the buttons
  if (showCheckPrivy) {
    return (
      <div className="">
        <CheckPrivy
          dollarAmount={parseFloat(usdValue)}
          coins={selectedCoins}
          ethToUsdRate={ethToUsdRate}
          onComplete={handleCryptoCompletedPayment}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 p-4">
      {/* Coin Presets Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-sm font-medium">Select Coins</h3>
          <span className="text-white/60 text-xs">1 Coin = ${coinToUsd}</span>
        </div>

        {/* Coin Preset Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {coinPresets.map((preset, index) => (
            <Button
              key={index}
              variant="outline"
              className={`
                relative overflow-hidden duration-100
                ${selectedCoins === preset.coins
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400 text-white scale-105'
                  : 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30'
                }
              `}
              onClick={() => setSelectedCoins(preset.coins)}
            >
              <div className="flex gap-1 items-center justify-center py-1">
                <Coins className="w-4 h-4 mb-1" />
                <span className="font-bold">{preset.label}</span>
              </div>
            </Button>
          ))}
        </div>

        {/* Selected Amount Display */}
        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-lg p-4 mt-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs">Selected Amount</p>
              <p className="text-white text-2xl font-bold">
                {selectedCoins.toLocaleString()} Coins
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-xs">Total Price</p>
              <p className="text-green-400 text-2xl font-bold">
                ${usdValue}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-3 pt-2">
        <Button
          className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 hover:text-white transition-all duration-300"
          onClick={handleCardPayment}
          disabled={isLoadingCard || isLoading}
        >
          {isLoadingCard ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay ${usdValue} with Card
            </>
          )}
        </Button>

        <Button
          variant="outline"
          className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 hover:text-white transition-all duration-300"
          onClick={handleCryptoPayment}
          disabled={isLoadingCard || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <img
                src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png"
                alt="LCS Coin"
                className="w-4 h-4 mr-2"
              />
              Pay ${usdValue} with Crypto
            </>
          )}
        </Button>

        <Button
          variant="ghost"
          className="text-white hover:bg-white/10 hover:text-white transition-all duration-300"
          onClick={onClose}
          disabled={isLoadingCard || isLoading}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default BuyDialogContent;