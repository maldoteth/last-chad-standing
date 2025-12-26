import React, { useEffect, useState } from "react";
import { useWallets, usePrivy, useFundWallet } from "@privy-io/react-auth";
import { createPublicClient, createWalletClient, http, custom } from "viem";
import { base } from "viem/chains";
import type { Address, ByteArray } from "viem";
import { useApi } from "@/Api/apiFunction";
import { toast } from "sonner";

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
  const isEmailOrSmsAuth = authenticated && user && !wallets?.length;
  const { post, get } = useApi()
  const { fundWallet, } = useFundWallet();

  const ethAmount = dollarAmount / ethToUsdRate;
  // 1000000000000000000n = 1 ETH
  const TX_AMOUNT = BigInt(Math.floor(ethAmount * 1e18));
  const [adminWallet, setAdminWallet] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!wallets || wallets.length === 0) return;

      const wallet = wallets[0];
      const address = wallet.address as Address;

      const client = createPublicClient({
        chain: base,
        transport: http(),
      });

      try {
        const bal = await client.getBalance({ address });
        setBalance(bal);
        setInsufficientBalance(bal < TX_AMOUNT);
        // if (bal < REQUIRED_AMOUNT) {
        //   handleFundWallet()
        // }
      } catch (err) {
        console.error("❌ Error fetching balance:", err);
      }
    };

    fetchBalance();
  }, [wallets]);

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
      const response = await get('admin/wallet')
      setAdminWallet(response?.wallet?.address)
    } catch (error) {
      console.log(error)
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
    const wallet = wallets[0];
    const address = wallet.address as Address;

    try {
      const provider = await wallet.getEthereumProvider();

      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x2105" }], // 0x209 = 521 in decimal? Actually, Base Mainnet chainId is 8453 decimal = 0x2105
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x2105", // 8453 decimal
                chainName: "Base Mainnet",
                nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
                rpcUrls: ["https://mainnet.base.org"],
                blockExplorerUrls: ["https://basescan.org"],
              },
            ],
          });

          await provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x2105" }],
          });
        } else {
          throw switchError;
        }
      }

      const client = createWalletClient({
        account: address,
        chain: base, // make sure 'base' is configured for Mainnet
        transport: custom(provider),
      });

      const hash = await client.sendTransaction({
        account: address,
        to: adminWallet as Address,
        value: TX_AMOUNT

      });

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
    if (!wallets || wallets.length === 0) {
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
    if (!wallets || wallets.length === 0) {
      return;
    }
    if (!adminWallet) {
      toast.error('Admin Wallet Address not found!')
      return
    }
    const wallet = wallets[0];
    const address = wallet.address as Address;

    try {
      await fundWallet({
        address,
        options: {
          chain: base,
          asset: "native-currency",
          amount: (Number(TX_AMOUNT) / 1e18) as any, // ETH needed
        }
      });

      console.log("✅ Wallet funded successfully!");

      // ✅ call send transaction after funding
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
      {/* Email/SMS Auth Warning */}
      {isEmailOrSmsAuth && (
        <div className="border border-white/25 rounded-lg p-4 bg-white/25 backdrop-blur-3xl">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-white/80 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-gray-700 mb-3">
                You're logged in via {user?.email ? "email" : "phone"}. Connect a wallet to continue.
              </p>
              <button
                onClick={handleConnectWallet}
                disabled={isConnectingWallet}
                className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isConnectingWallet ? "Connecting..." : "Connect Wallet"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Connected View */}
      {wallets.length > 0 && (
        <div className="space-y-4">
          {/* Wallet Address Card */}
          <div className="border border-white/25 rounded-lg p-4 bg-white/25 backdrop-blur-3xl">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2 h-2 rounded-full ${insufficientBalance ? 'bg-orange-400' : 'bg-green-500'}`} />
              <h3 className="text-sm font-medium text-white">Wallet Address</h3>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-mono text-white break-all bg-black/50 backdrop-blur-2xl p-2 rounded border border-gray-200 flex-1">
                {wallets[0].address}
              </p>
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(wallets[0].address);
                  toast.success("Address copied!");
                }}
                className="p-2 rounded bg-black/50 border border-gray-200 text-white hover:bg-white/20 transition-colors shrink-0"
                title="Copy address"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Balance Overview */}
          <div className="border border-white/25 rounded-lg p-4 bg-white/25 backdrop-blur-3xl">
            <h3 className="text-sm font-medium text-white mb-3">Balance Overview</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-md bg-black/50 backdrop-blur-2xl border border-gray-200">
                <p className="text-xs text-white/80 mb-1">Current Balance</p>
                <p className="text-sm font-semibold text-white">
                  {balance !== null ? `${(Number(balance) / 1e18).toFixed(6)} ETH` : "Loading..."}
                </p>
              </div>
              <div className="p-3 rounded-md bg-black/50 backdrop-blur-2xl border border-gray-200">
                <p className="text-xs text-white/80 mb-1">Payment Amount</p>
                <p className="text-sm font-semibold text-white">
                  {(Number(TX_AMOUNT) / 1e18).toFixed(6)} ETH
                </p>
              </div>
            </div>

            {/* Insufficient Balance Warning */}
            {insufficientBalance && balance !== null && (
              <div className="mt-4 p-3 rounded-md bg-orange-50 border border-orange-200">
                <p className="text-sm font-medium text-orange-900 mb-2">Insufficient Balance</p>
                <p className="text-xs text-orange-800">
                  Please add{" "}
                  <span className="font-semibold">
                    {((Number(TX_AMOUNT) - Number(balance)) / 1e18).toFixed(6)} ETH
                  </span>{" "}
                  to your wallet to proceed with the transaction.
                </p>
              </div>
            )}
          </div>

          {/* Transaction Button */}
          {insufficientBalance ?
            <div className="space-y-2">
              <button
                onClick={handleFundWallet}
                disabled={isLoading}
                className={`w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors bg-gray-900 text-white hover:bg-gray-800`}
              >
                Acquire ETH
              </button>
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(wallets[0].address);
                  toast.success("Address copied to clipboard!");
                }}
                className="w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors bg-white/20 text-white hover:bg-white/30 border border-white/25"
              >
                Copy Address
              </button>
            </div> :
            <button
              onClick={sendTransaction}
              disabled={insufficientBalance}
              className={`w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${insufficientBalance
                ? "bg-gray-700 text-white/80 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
            >
              Send Transaction ({(Number(TX_AMOUNT) / 1e18).toFixed(6)} ETH)
            </button>}

          {/* Transaction Hash */}
          {txHash && (
            <div className="border border-green-300 rounded-lg p-4 bg-green-50">
              <p className="text-sm font-medium text-green-900 mb-2">Transaction Successful</p>
              <a
                href={`https://basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-green-700 hover:text-green-900 underline break-all"
              >
                {txHash}
              </a>
            </div>
          )}
        </div>
      )}
      {/* No Wallet */}
      {wallets.length === 0 && !isEmailOrSmsAuth && (
        <div className="border border-white/25 rounded-lg p-6 bg-white/25 backdrop-blur-3xl text-center">
          <p className="text-sm text-white">No wallet connected</p>
        </div>
      )}
    </div>
  );
};