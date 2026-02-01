import { useState, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useSupabase } from './useSupabase';
import { toast } from 'sonner';

export const useBids = () => {
    const { user } = usePrivy();
    const {
        getBidsForItem: getBidsForItemRpc,
        getMyBids: getMyBidsRpc,
        getHighestBidForLocker: getHighestBidForLockerRpc,
        placeBid: placeBidRpc,
        acceptBid: acceptBidRpc,
        cancelBid: cancelBidRpc
    } = useSupabase();

    const [loading, setLoading] = useState(false);

    const placeBid = async (params: { itemId: string; lockerId: string; bidAmount: number; expiresInDays?: number }) => {
        if (!user?.id) {
            toast.error('Please connect your wallet to place bids');
            return false;
        }
        setLoading(true);
        try {
            const result = await placeBidRpc({
                bidderId: user.id,
                ...params
            });
            if (result.success) {
                toast.success('Bid placed successfully!');
                return true;
            } else {
                toast.error(result.error || 'Failed to place bid');
                return false;
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const acceptBid = async (bidId: string) => {
        if (!user?.id) return false;
        setLoading(true);
        try {
            const result = await acceptBidRpc(bidId, user.id);
            if (result.success) {
                toast.success('Bid accepted!');
                return true;
            } else {
                toast.error(result.error || 'Failed to accept bid');
                return false;
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const cancelBid = async (bidId: string) => {
        if (!user?.id) return false;
        setLoading(true);
        try {
            const result = await cancelBidRpc(bidId, user.id);
            if (result.success) {
                toast.success('Bid cancelled and coins refunded');
                return true;
            } else {
                toast.error(result.error || 'Failed to cancel bid');
                return false;
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const getBidsForItem = useCallback((itemId: string) => getBidsForItemRpc(itemId), [getBidsForItemRpc]);
    const getMyBids = useCallback(() => user?.id ? getMyBidsRpc(user.id) : Promise.resolve({ success: false, data: [] }), [user?.id, getMyBidsRpc]);
    const getHighestBidForLocker = useCallback((lockerId: string) => getHighestBidForLockerRpc(lockerId), [getHighestBidForLockerRpc]);

    return {
        placeBid,
        acceptBid,
        cancelBid,
        loading,
        getBidsForItem,
        getMyBids,
        getHighestBidForLocker
    };
};
