import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        )

        const { bidderId, itemId, lockerId, bidAmount, expiresInDays = 3 } = await req.json()

        if (!bidderId || !itemId || !lockerId || !bidAmount) {
            throw new Error('Missing required parameters');
        }

        const amount = Number(bidAmount);
        if (amount <= 0) throw new Error('Bid amount must be positive');

        // 1. Verify Locker listing
        const { data: locker, error: lockerError } = await supabaseClient
            .from('Locker')
            .select('user_id, listed_for_sale, item:store_items(name)')
            .eq('id', lockerId)
            .single();

        if (lockerError || !locker) throw new Error('Listing not found');
        if (!locker.listed_for_sale) throw new Error('This item is no longer for sale');
        if (locker.user_id === bidderId) throw new Error('You cannot bid on your own item');

        // 2. Check for existing bids on this locker
        const { data: existingBids } = await supabaseClient
            .from('nft_bids')
            .select('*')
            .eq('locker_id', lockerId)
            .eq('status', 'active');

        const highestBid = existingBids?.sort((a, b) => b.bid_amount - a.bid_amount)[0];

        if (highestBid && amount <= highestBid.bid_amount) {
            throw new Error(`Your bid must be higher than the current highest bid of ${highestBid.bid_amount}`);
        }

        // 3. Auto-cancel THIS bidder's old bid if it exists
        const myOldBid = existingBids?.find(b => b.bidder_id === bidderId);
        if (myOldBid) {
            await supabaseClient.rpc('credit_coins_atomic', {
                p_user_id: bidderId,
                p_amount: myOldBid.bid_amount,
                p_xp_gain: 0
            });
            await supabaseClient.from('nft_bids').update({ status: 'cancelled' }).eq('id', myOldBid.id);
        }

        // 4. Escrow coins from current bidder
        const { error: deductError } = await supabaseClient.rpc('deduct_coins_atomic', {
            p_user_id: bidderId,
            p_amount: amount,
            p_xp_gain: 0
        });
        if (deductError) throw new Error(deductError.message);

        // 5. Refund and notify PREVIOUS highest bidder if they are someone else
        if (highestBid && highestBid.bidder_id !== bidderId) {
            await supabaseClient.rpc('credit_coins_atomic', {
                p_user_id: highestBid.bidder_id,
                p_amount: highestBid.bid_amount,
                p_xp_gain: 0
            });
            await supabaseClient.from('nft_bids').update({ status: 'outbid' }).eq('id', highestBid.id);

            // Notify outbid bidder
            await supabaseClient.from('Notification').insert({
                user_id: highestBid.bidder_id,
                title: 'You have been outbid! 📉',
                message: `Someone placed a higher bid on "${locker.item?.name}". Your ${highestBid.bid_amount} coins have been refunded.`,
                type: 'bid_outbid',
                related_id: itemId,
                related_type: 'store_item',
                is_read: false
            });
        }

        // 6. Insert new bid
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expiresInDays);

        const { data: newBid, error: bidError } = await supabaseClient.from('nft_bids').insert({
            bidder_id: bidderId,
            item_id: itemId,
            locker_id: lockerId,
            bid_amount: amount,
            status: 'active',
            expires_at: expiresAt.toISOString()
        }).select().single();

        if (bidError) throw bidError;

        // 7. Notify Seller
        await supabaseClient.from('Notification').insert({
            user_id: locker.user_id,
            title: 'New Bid Received! 🎟️',
            message: `You received a bid of ${amount} coins for "${locker.item?.name}".`,
            type: 'bid_placed',
            related_id: itemId,
            related_type: 'store_item',
            is_read: false
        });

        return new Response(
            JSON.stringify({ success: true, bid: newBid }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );

    } catch (error) {
        console.error("Place bid error:", error);
        return new Response(
            JSON.stringify({ success: false, error: (error as any).message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }
});
