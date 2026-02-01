import React, { useState, useEffect, useCallback } from "react";
import { usePrivy } from '@privy-io/react-auth';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, TrendingUp, Clock, History } from "lucide-react";
import { formatNumberWithAbbreviation, getRarityColor, getRarityDisplayName } from "@/lib/utils";
import { useBids } from "@/hooks/useBids";
import { useStore } from "@/context/storeData";
import { Spinner } from "./ui/spinner";
import { supabase } from "@/integrations/supabase/client";

interface BidDialogProps {
    isOpen: boolean;
    onClose: () => void;
    item: any;
}

const BidDialog: React.FC<BidDialogProps> = ({ isOpen, onClose, item }) => {
    const { user } = usePrivy();
    const { placeBid, getBidsForItem, getHighestBidForLocker, loading: bidLoading } = useBids();
    const { userBalance } = useStore();
    
    const [bidAmount, setBidAmount] = useState<number>(0);
    const [highestBid, setHighestBid] = useState<any>(null);
    const [bidHistory, setBidHistory] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(false);

    const fetchData = useCallback(async () => {
        if (!item?.id || !item?.item_id) return;
        setLoadingData(true);
        try {
            const [hbResult, historyResult] = await Promise.all([
                getHighestBidForLocker(item.id),
                getBidsForItem(item.item_id)
            ]);

            if (hbResult.success) setHighestBid(hbResult.data);
            if (historyResult.success) setBidHistory(historyResult.data || []);
            
            // Set initial bid amount to highest bid + 1 or listing price
            const currentHighest = hbResult.data?.bid_amount || 0;
            const minBid = Math.max(currentHighest + 1, item.sale_price || item.price || 0);
            setBidAmount(minBid);
            
        } catch (error) {
            console.error("Error fetching bid data:", error);
        } finally {
            setLoadingData(false);
        }
    }, [item, getHighestBidForLocker, getBidsForItem]);

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen, fetchData]);

    const handlePlaceBid = async () => {
        const success = await placeBid({
            itemId: item.item_id,
            lockerId: item.id,
            bidAmount: bidAmount
        });

        if (success) {
            fetchData(); // Refresh data
        }
    };

    if (!item) return null;

    const minNextBid = highestBid ? highestBid.bid_amount + 1 : (item.sale_price || item.price || 1);
    const isAmountValid = bidAmount >= minNextBid && bidAmount <= userBalance.coins;

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent className="bg-black/80 backdrop-blur-2xl border-t border-white/10 max-h-[90vh]">
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
                    <DrawerTitle className="text-white text-center text-lg font-bold">Place a Bid</DrawerTitle>
                </DrawerHeader>

                <ScrollArea className="max-h-[calc(90vh-120px)] overflow-y-auto">
                    <div className="px-6 py-6 space-y-8">
                        {/* Item Quick Info */}
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5">
                                <img
                                    src={item.image_url || "/placeholder.svg"}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-semibold">{item.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className={`${getRarityColor(item?.rarity)} text-[10px] h-5`}>
                                        {getRarityDisplayName(item?.rarity)}
                                    </Badge>
                                    <span className="text-white/40 text-xs uppercase">{item.category}</span>
                                </div>
                                <div className="text-white/60 text-xs mt-2">
                                    Listing Price: <span className="text-white font-medium">{formatNumberWithAbbreviation(item.sale_price || item.price)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Bid Controls */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Current Highest</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-green-400" />
                                        <span className="text-xl font-bold text-white">
                                            {highestBid ? formatNumberWithAbbreviation(highestBid.bid_amount) : 'No bids'}
                                        </span>
                                    </div>
                                    {highestBid && (
                                        <p className="text-white/30 text-[10px] mt-1">
                                            by {highestBid.bidder?.name || 'Anonymous'}
                                        </p>
                                    )}
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Your Balance</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS" className="w-4 h-4" />
                                        <span className="text-xl font-bold text-white">
                                            {formatNumberWithAbbreviation(userBalance.coins)}
                                        </span>
                                    </div>
                                    <p className="text-white/30 text-[10px] mt-1">Available to spend</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="relative">
                                    <label className="text-white/40 text-xs uppercase tracking-wider ml-1 mb-2 block">Your Bid Amount</label>
                                    <div className="relative flex items-center">
                                        <input
                                            type="number"
                                            value={bidAmount}
                                            onChange={(e) => setBidAmount(parseInt(e.target.value) || 0)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-2xl font-bold text-white focus:outline-none focus:border-primary/50 transition-colors"
                                            placeholder="0"
                                            min={minNextBid}
                                        />
                                        <div className="absolute right-6 flex items-center gap-2">
                                            <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS" className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <div className="flex justify-between mt-2 px-1">
                                        <p className="text-white/30 text-xs">Minimum bid: {formatNumberWithAbbreviation(minNextBid)}</p>
                                        {bidAmount > userBalance.coins && (
                                            <p className="text-red-400/80 text-xs">Insufficient balance</p>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    onClick={handlePlaceBid}
                                    disabled={!isAmountValid || bidLoading}
                                    className="w-full py-6 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all active:scale-95"
                                >
                                    {bidLoading ? <Spinner color="white" /> : "Place Escrow Bid"}
                                </Button>
                                
                                <p className="text-white/30 text-[10px] text-center px-4">
                                    Coins will be held in escrow and automatically refunded if you are outbid or if the bid is rejected/cancelled.
                                </p>
                            </div>
                        </div>

                        {/* Bid History */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2 text-white/60">
                                <History className="w-4 h-4" />
                                <h4 className="text-sm font-semibold uppercase tracking-wider">Bid History ({bidHistory.length})</h4>
                            </div>
                            
                            <div className="space-y-2">
                                {loadingData ? (
                                    <div className="flex justify-center py-8"><Spinner color="gray" /></div>
                                ) : bidHistory.length > 0 ? (
                                    bidHistory.map((bid, i) => (
                                        <div key={bid.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden">
                                                    {bid.bidder?.profileImage ? (
                                                        <img src={bid.bidder.profileImage} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-white/40 font-bold">
                                                            {bid.bidder?.name?.substring(0, 2).toUpperCase() || '??'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-white text-xs font-medium">{bid.bidder?.name || 'Anonymous'}</p>
                                                    <p className="text-white/30 text-[10px]">
                                                        {new Date(bid.created_at).toLocaleDateString()} at {new Date(bid.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-1 justify-end">
                                                    <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="" className="w-3 h-3" />
                                                    <span className="text-white text-sm font-bold">{formatNumberWithAbbreviation(bid.bid_amount)}</span>
                                                </div>
                                                {i === 0 && <Badge className="bg-green-500/20 text-green-400 border-none text-[8px] h-4 py-0">Highest</Badge>}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 bg-white/[0.02] rounded-2xl border border-dashed border-white/10">
                                        <p className="text-white/20 text-xs">No active bids yet. Be the first!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    );
};

export default BidDialog;
