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

        const { itemId, userId, price, mintTx, nftBuyerWalletId, isMarketplace, lockerId, tokenId } = await req.json()

        // 1. Get User Balance
        const { data: user, error: userError } = await supabaseClient
            .from('Users')
            .select('coins, xp')
            .eq('id', userId)
            .single()

        if (userError || !user) throw new Error('User not found')
        if (user.coins < price) throw new Error('Insufficient coins')

        if (isMarketplace) {
            // --- Marketplace Purchase (Buy from another user) ---
            if (!lockerId || !tokenId) throw new Error('Locker ID and Token ID are required for marketplace purchase')

            // Get seller's item
            const { data: sellerItem, error: fetchError } = await supabaseClient
                .from('Locker')
                .select('*')
                .eq('id', lockerId)
                .single()

            if (fetchError || !sellerItem) throw new Error('Listing not found')

            // Atomic Update: Subtract coins from buyer, Mark seller item as sold, Create buyer item
            // We do this in a simple sequence here, but for production RPC is safer.

            const { error: subError } = await supabaseClient
                .from('Users')
                .update({ coins: user.coins - price })
                .eq('id', userId)

            if (subError) throw subError

            const { error: sellerUpdateError } = await supabaseClient
                .from('Locker')
                .update({
                    listed_for_sale: false,
                    is_sell_item: false,
                    sell_count: (sellerItem.sell_count || 0) + 1,
                })
                .eq('id', lockerId)

            if (sellerUpdateError) throw sellerUpdateError

            const { error: buyerLockerError } = await supabaseClient
                .from('Locker')
                .insert({
                    user_id: userId,
                    item_id: sellerItem.item_id,
                    coins: price,
                    nftBuyerWalletId: nftBuyerWalletId,
                    purchase_date: new Date().toISOString(),
                    quantity: 1,
                    listed_for_sale: false,
                    is_sell_item: false,
                    sell_count: 0,
                    total_purchased_locker_item: (sellerItem.total_purchased_locker_item || 0) + 1,
                    token_ids: [tokenId],
                })

            if (buyerLockerError) throw buyerLockerError

            // Log Transaction
            await supabaseClient.from('Transactions').insert({
                user_id: userId,
                locker_id: lockerId,
                amount: price,
                coins: price,
                paymentMethod: 'coin',
                status: 'success',
                txHash: mintTx,
                nftBuyerWalletId: nftBuyerWalletId,
            })

        } else {
            // --- Store Purchase (Buy from first release) ---
            if (!itemId) throw new Error('Item ID is required for store purchase')

            // Update Buyer Coins
            const { error: subError } = await supabaseClient
                .from('Users')
                .update({ coins: user.coins - price })
                .eq('id', userId)

            if (subError) throw subError

            // Create Locker entry
            const { error: lockerError } = await supabaseClient
                .from('Locker')
                .insert({
                    user_id: userId,
                    item_id: itemId,
                    coins: price,
                    nftBuyerWalletId: nftBuyerWalletId,
                    purchase_date: new Date().toISOString(),
                    quantity: 1,
                    listed_for_sale: false,
                    is_sell_item: false,
                    sell_count: 0,
                    total_purchased_locker_item: 0,
                })

            if (lockerError) throw lockerError

            // Increment total_purchased in store_items
            const { data: storeItem } = await supabaseClient
                .from('store_items')
                .select('total_purchased')
                .eq('id', itemId)
                .single()

            if (storeItem) {
                await supabaseClient
                    .from('store_items')
                    .update({ total_purchased: (storeItem.total_purchased || 0) + 1 })
                    .eq('id', itemId)
            }

            // Log Transaction
            await supabaseClient.from('Transactions').insert({
                user_id: userId,
                item_id: itemId,
                amount: price,
                coins: price,
                paymentMethod: 'coin',
                status: 'success',
                txHash: mintTx,
                nftBuyerWalletId: nftBuyerWalletId,
            })
        }

        // Return updated user profile
        const { data: finalUser } = await supabaseClient
            .from('Users')
            .select('*')
            .eq('id', userId)
            .single()

        return new Response(
            JSON.stringify({ success: true, user: finalUser }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
