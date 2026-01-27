import React, { useEffect, useState } from "react";
import { useWallets, usePrivy, useFundWallet } from "@privy-io/react-auth";
import { createPublicClient, createWalletClient, http, custom, formatEther } from "viem";
import { base } from "viem/chains";
import type { Address } from "viem";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export interface CryptoPaymentProps { hash: string, address: string, exchangeRate: number, cryptoAmount: number, amount: number }

interface CheckPrivyProps {
  dollarAmount?: number;
  coins?: number;
  ethToUsdRate?: number;
  onComplete: (data: CryptoPaymentProps) => void
}

export const CheckPrivy = ({ dollarAmount = 0, onComplete, ethToUsdRate = 0 }: CheckPrivyProps) => {
  const { wallets } = useWallets();
  const { ready, authenticated, user, linkWallet } = usePrivy();
  const [balance, setBalance] = useState<bigint | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const activeWallet = wallets.find(w => w.walletClientType !== 'privy') || wallets[0];
  const isEmailOrSmsAuth = authenticated && user && activeWallet?.walletClientType === 'privy';
  const { fundWallet, } = useFundWallet();

  const ethAmount = dollarAmount / ethToUsdRate;
  const TX_AMOUNT = BigInt(Math.floor(ethAmount * 1e18));
  const [adminWallet, setAdminWallet] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!activeWallet) return;

      const address = activeWallet.address as Address;

      const client = createPublicClient({
        chain: base,
        transport: http(),
      });

      try {
        const bal = await client.getBalance({ address });
        setBalance(bal);
        setInsufficientBalance(bal < TX_AMOUNT);
      } catch (err) {
        console.error("❌ Error fetching balance:", err);
      }
    };

    fetchBalance();
  }, [activeWallet, TX_AMOUNT]);

  const handleConnectWallet = async () => {
    setIsConnectingWallet(true);
    try {
      await linkWallet();
    } catch (err) {
      console.error("❌ Error connecting wallet:", err);
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const handleGetAdminWallet = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('AdminWallet')
        .select('address')
        .limit(1)
        .single();

      if (error) throw error;
      setAdminWallet(data?.address || '')
    } catch (error) {
      console.error("Error fetching admin wallet from Supabase:", error);
    }
    finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleGetAdminWallet()
  }, []);

  const sendUserTransaction = async () => {
    if (!adminWallet) {
      toast.error('Admin Wallet Address not found!')
      return
    }
    if (!activeWallet) return;
    const address = activeWallet.address as Address;

    try {
      const provider = await activeWallet.getEthereumProvider();

      try {
        await (provider as any).request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x2105" }], 
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await (provider as any).request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x2105", 
                chainName: "Base Mainnet",
                nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
                rpcUrls: ["https://mainnet.base.org"],
                blockExplorerUrls: ["https://basescan.org"],
              },
            ],
          });

          await (provider as any).request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x2105" }],
          });
        } else {
          throw switchError;
        }
      }

      const client = createWalletClient({
        account: address,
        chain: base, 
        transport: custom(provider as any),
      });

      const hash = await client.sendTransaction({
        account: address,
        to: adminWallet as Address,
        value: TX_AMOUNT
      } as any);

      console.log("✅ Transaction hash:", hash);
      setTxHash(hash);

      if (hash) {
        onComplete({
          hash,
          address,
          exchangeRate: ethToUsdRate,
          cryptoAmount: ethAmount,
          amount: dollarAmount
        });
      }
    } catch (err) {
      console.error("❌ Error sending transaction:", err);
      toast.error('Transaction failed. Check console for details.');
    }
  };

  const sendTransaction = async () => {
    if (!activeWallet) {
      toast.info('Please connect your wallet first!')
      return;
    }

    if (balance === null || balance < TX_AMOUNT) {
      toast.error("Insufficient balance! Please add funds to your wallet.");
      return;
    }

    await sendUserTransaction()
  };

  const handleFundWallet = async () => {
    if (!activeWallet) {
      return;
    }
    if (!adminWallet) {
      toast.error('Admin Wallet Address not found!')
      return
    }
    const address = activeWallet.address as Address;

    try {
      const formattedAmount = Number(formatEther(TX_AMOUNT)).toFixed(6);
      
      await fundWallet({
        address,
        options: {
          chain: base,
          asset: "native-currency",
          amount: formattedAmount, 
        }
      });

      console.log("✅ Wallet funded successfully!");
      await sendUserTransaction();

    } catch (err) {
      console.error("❌ Error funding wallet:", err);
    }
  };

  if (!ready || isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-white">Please login first</div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="border border-white/20 rounded-lg p-4 bg-white/5 backdrop-blur-3xl">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Payment Wallet</h3>
            {isEmailOrSmsAuth && (
              <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[10px]">
                Embedded (Low Balance)
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 bg-black/40 p-3 rounded border border-white/10">
            <p className="text-xs font-mono text-white/90 break-all flex-1">
              {activeWallet?.address || "No wallet linked"}
            </p>
            {activeWallet && (
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(activeWallet.address);
                  toast.success("Address copied!");
                }}
                className="p-1.5 rounded hover:bg-white/10 text-white/60 transition-colors"
                title="Copy address"
              >
                <Copy size={14} />
              </button>
            )}
          </div>

          {isEmailOrSmsAuth && (
            <div className="space-y-2">
              <p className="text-[11px] text-white/60 leading-relaxed">
                You are using a temporary embedded wallet. To pay directly with MetaMask or other apps:
              </p>
              <Button 
                onClick={handleConnectWallet} 
                disabled={isConnectingWallet}
                variant="secondary"
                className="w-full h-8 text-xs font-bold"
              >
                {isConnectingWallet ? "Connecting..." : "Link MetaMask / External Wallet"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {activeWallet && (
        <div className="border border-white/20 rounded-lg p-4 bg-white/5 backdrop-blur-3xl space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/30 p-3 rounded border border-white/10">
              <p className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Your Balance</p>
              <p className={`text-sm font-bold ${insufficientBalance ? 'text-orange-400' : 'text-white'}`}>
                {balance !== null ? `${Number(formatEther(balance)).toFixed(6)} ETH` : "Loading..."}
              </p>
            </div>
            <div className="bg-black/30 p-3 rounded border border-white/10">
              <p className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Amount Due</p>
              <p className="text-sm font-bold text-white">
                {Number(formatEther(TX_AMOUNT)).toFixed(6)} ETH
              </p>
            </div>
          </div>

          {insufficientBalance && (
            <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded text-[11px] text-orange-300">
              Insufficient ETH for payment and gas. Please add funds to your wallet.
            </div>
          )}

          <div className="space-y-2 pt-2">
            {!insufficientBalance ? (
              <Button
                onClick={sendTransaction}
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-black font-bold h-12"
              >
                {isLoading ? "Processing..." : `Confirm Payment (${Number(formatEther(TX_AMOUNT)).toFixed(6)} ETH)`}
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleFundWallet}
                  variant="outline"
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10 text-[11px]"
                >
                  Acquire / Top-up
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10 text-[11px]"
                >
                  Refresh Balance
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {txHash && (
        <div className="border border-green-500/30 rounded-lg p-4 bg-green-500/10 text-center space-y-2">
          <p className="text-sm font-bold text-green-400">Payment Sent!</p>
          <a
            href={`https://basescan.org/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-white/60 underline truncate block"
          >
            Track on Explorer
          </a>
        </div>
      )}
    </div>
  );
};