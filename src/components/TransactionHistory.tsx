import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/context/profileContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShoppingCart, Coins, ArrowLeftRight, Gamepad2, CreditCard, Wallet } from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  coins: number;
  xp: number | null;
  paymentMethod: "crypto" | "card" | "coin";
  status: "pending" | "success" | "failed";
  description: string | null;
  createdAt: string;
  item_id: string | null;
  txHash: string | null;
  store_items?: {
    name: string;
    image_url: string;
    category: string;
  } | null;
}

const TransactionHistory = () => {
  const { profile } = useProfile();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!profile?.id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("Transactions")
          .select(`
            id,
            amount,
            coins,
            xp,
            paymentMethod,
            status,
            description,
            createdAt,
            item_id,
            txHash,
            store_items (
              name,
              image_url,
              category
            )
          `)
          .eq("user_id", profile.id)
          .order("createdAt", { ascending: false })
          .limit(50);

        if (error) throw error;
        setTransactions(data || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [profile?.id]);

  const getTransactionIcon = (transaction: Transaction) => {
    if (transaction.store_items) {
      return <ShoppingCart className="w-4 h-4" />;
    }
    if (transaction.description?.toLowerCase().includes("pre-order") || transaction.description?.toLowerCase().includes("preorder")) {
      return <Gamepad2 className="w-4 h-4" />;
    }
    if (transaction.description?.toLowerCase().includes("trade")) {
      return <ArrowLeftRight className="w-4 h-4" />;
    }
    return <Coins className="w-4 h-4" />;
  };

  const getTransactionTitle = (transaction: Transaction) => {
    if (transaction.store_items) {
      return `Purchased ${transaction.store_items.name}`;
    }
    if (transaction.description) {
      return transaction.description;
    }
    return "Coin Purchase";
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "crypto":
        return <Wallet className="w-3 h-3" />;
      case "card":
        return <CreditCard className="w-3 h-3" />;
      case "coin":
        return <Coins className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-white/60" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Coins className="w-12 h-12 text-white/30 mb-3" />
        <p className="text-white/60 text-sm">No transactions yet</p>
        <p className="text-white/40 text-xs mt-1">Your transaction history will appear here</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px] pr-2">
      <div className="space-y-2">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            {/* Icon */}
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              {transaction.store_items?.image_url ? (
                <img
                  src={transaction.store_items.image_url}
                  alt=""
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                getTransactionIcon(transaction)
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {getTransactionTitle(transaction)}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-white/50">
                  {formatDate(transaction.createdAt)}
                </span>
                <span className="flex items-center gap-1 text-xs text-white/50">
                  {getPaymentMethodIcon(transaction.paymentMethod)}
                  {transaction.paymentMethod}
                </span>
              </div>
            </div>

            {/* Amount & Status */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <div className="flex items-center gap-1">
                {transaction.coins > 0 && (
                  <span className="text-sm font-medium text-white flex items-center gap-1">
                    <img
                      src="/lovable-uploads/c32465ca-8811-443a-a73c-b57225210592.png"
                      alt="Coin"
                      className="w-4 h-4"
                    />
                    {transaction.coins.toLocaleString()}
                  </span>
                )}
                {transaction.amount > 0 && transaction.paymentMethod !== "coin" && (
                  <span className="text-xs text-white/60">
                    ${transaction.amount.toFixed(2)}
                  </span>
                )}
              </div>
              <Badge
                variant="outline"
                className={`text-[10px] px-1.5 py-0 ${getStatusColor(transaction.status)}`}
              >
                {transaction.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default TransactionHistory;
