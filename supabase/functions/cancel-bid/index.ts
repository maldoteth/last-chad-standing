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

        const { bidId, userId } = await req.json()

        if (!bidId || !userId) {
            throw new Error('Missing bidId or userId');
        }

        // 1. Fetch bid and verify ownership
        const { data: bid, error: bidError } = await supabaseClient
            .from('nft_bids')
            .select('*')
            .eq('id', bidId)
            .single();

        if (bidError || !bid) throw new Error('Bid not found');
        if (bid.bidder_id !== userId) throw new Error('You did not place this bid');
        if (bid.status !== 'active') throw new Error('Bid is not active');

        // 2. Refund coins
        const { error: creditError } = await supabaseClient.rpc('credit_coins_atomic', {
            p_user_id: userId,
            p_amount: bid.bid_amount,
            p_xp_gain: 0
        });
        if (creditError) throw new Error('Failed to refund coins');

        // 3. Mark bid as cancelled
        await supabaseClient.from('nft_bids').update({ status: 'cancelled' }).eq('id', bidId);

        return new Response(
            JSON.stringify({ success: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );

    } catch (error) {
        console.error("Cancel bid error:", error);
        return new Response(
            JSON.stringify({ success: false, error: (error as any).message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }
});
