import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { formatNumberWithAbbreviation } from "@/lib/utils";
import { useBids } from "@/hooks/useBids";
import { Spinner } from "./ui/spinner";
import { Check, X, Clock, AlertCircle } from "lucide-react";

interface BidListPanelProps {
    lockerId: string;
    itemId: string;
    onBidAccepted?: () => void;
}

const BidListPanel: React.FC<BidListPanelProps> = ({ lockerId, itemId, onBidAccepted }) => {
    const { getBidsForItem, acceptBid, loading: bidLoading } = useBids();
    const [bids, setBids] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [acceptingId, setAcceptingId] = useState<string | null>(null);

    const fetchBids = async () => {
        setLoading(true);
        try {
            const result = await getBidsForItem(itemId);
            if (result.success) {
                // Filter bids specifically for this locker listing
                setBids(result.data?.filter((b: any) => b.locker_id === lockerId) || []);
            }
        } catch (error) {
            console.error("Error fetching bids:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (lockerId) fetchBids();
    }, [lockerId, itemId]);

    const handleAccept = async (bidId: string) => {
        setAcceptingId(bidId);
        const success = await acceptBid(bidId);
        if (success) {
            if (onBidAccepted) onBidAccepted();
            fetchBids();
        }
        setAcceptingId(null);
    };

    if (loading && bids.length === 0) {
        return <div className="flex justify-center p-8"><Spinner color="white" /></div>;
    }

    if (bids.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-white/5 rounded-2xl border border-dashed border-white/10 mt-4">
                <AlertCircle className="w-8 h-8 text-white/20 mb-2" />
                <p className="text-white/40 text-sm font-medium">No active bids for this item</p>
                <p className="text-white/20 text-xs mt-1">Bids from other players will appear here</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 mt-6">
            <div className="flex items-center justify-between px-1">
                <h4 className="text-white/60 text-xs font-bold uppercase tracking-widest">Active Bids ({bids.length})</h4>
                <span className="text-white/30 text-[10px]">Highest bid first</span>
            </div>

            <div className="space-y-2">
                {bids.map((bid) => (
                    <div 
                        key={bid.id} 
                        className="group relative flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden border border-white/10">
                                {bid.bidder?.profileImage ? (
                                    <img src={bid.bidder.profileImage} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-white/40 font-bold">
                                        {bid.bidder?.name?.substring(0, 2).toUpperCase() || '??'}
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-white font-semibold text-sm">{bid.bidder?.name || 'Anonymous'}</p>
                                <div className="flex items-center gap-3 text-white/40 text-[10px] mt-0.5">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(bid.created_at).toLocaleDateString()}
                                    </span>
                                    <span>Expires in 3 days</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-1.5">
                                <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="" className="w-4 h-4" />
                                <span className="text-lg font-bold text-white leading-none">
                                    {formatNumberWithAbbreviation(bid.bid_amount)}
                                </span>
                            </div>
                            <Button
                                size="sm"
                                onClick={() => handleAccept(bid.id)}
                                disabled={!!acceptingId}
                                className="h-8 px-4 bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white border border-green-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all"
                            >
                                {acceptingId === bid.id ? <Spinner color="white" /> : (
                                    <><Check className="w-3 h-3 mr-1" /> Accept</>
                                )}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BidListPanel;
