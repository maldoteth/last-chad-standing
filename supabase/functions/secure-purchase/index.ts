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

        // --- Helper: Update XP and Performance ---
        const grantXP = async (uid: string, amount: number, reason: string) => {
            if (amount <= 0) return;

            // Update User XP
            const { data: uData } = await supabaseClient.from('Users').select('xp').eq('id', uid).single();
            const newXP = (uData?.xp || 0) + amount;
            await supabaseClient.from('Users').update({ xp: newXP }).eq('id', uid);

            // Update Performance and Level
            const { data: perf } = await supabaseClient.from('Performances').select('total_XP').eq('user_id', uid).single();
            if (perf) {
                const newTotalXP = (perf.total_XP || 0) + amount;
                const { data: levelInfo } = await supabaseClient
                    .from('Level')
                    .select('id, level')
                    .lte('min_xp', newTotalXP)
                    .order('min_xp', { ascending: false })
                    .limit(1)
                    .single();

                await supabaseClient.from('Performances').update({
                    total_XP: newTotalXP,
                    level: levelInfo?.level || 1,
                    level_id: levelInfo?.id || null
                }).eq('user_id', uid);
            }

            // Notification
            await supabaseClient.from('Notification').insert({
                user_id: uid,
                title: 'XP Gained!',
                message: `You earned ${amount} XP ${reason}`,
                type: 'xp_increase',
                related_type: 'performance',
                is_read: false
            });
        };

        // --- Helper: Track Objective ---
        const trackObjective = async (uid: string, objType: string) => {
            const { data: objectives } = await supabaseClient
                .from('Objective')
                .select('*')
                .eq('type', objType)
                .eq('isActive', true);

            if (!objectives) return;

            for (const obj of objectives) {
                const { data: progress } = await supabaseClient
                    .from('ObjectiveProgress')
                    .select('*')
                    .eq('user_id', uid)
                    .eq('objective_id', obj.id)
                    .maybeSingle();

                if (progress?.completed) continue;

                const newCount = (progress?.currentCount || 0) + 1;
                const isNowCompleted = newCount >= obj.targetCount;

                if (!progress) {
                    await supabaseClient.from('ObjectiveProgress').insert({
                        user_id: uid,
                        objective_id: obj.id,
                        currentCount: newCount,
                        completed: isNowCompleted,
                        type: obj.type,
                        category: obj.category,
                        startDate: new Date().toISOString(),
                        lastUpdated: new Date().toISOString()
                    });
                } else {
                    await supabaseClient.from('ObjectiveProgress').update({
                        currentCount: newCount,
                        completed: isNowCompleted,
                        lastUpdated: new Date().toISOString()
                    }).eq('id', progress.id);
                }

                if (isNowCompleted) {
                    await grantXP(uid, obj.rewardXP, `for completing "${obj.title}"`);
                    await supabaseClient.from('Notification').insert({
                        user_id: uid,
                        title: 'Objective Completed!',
                        message: `Congrats! You completed "${obj.title}"`,
                        type: 'objective_complete',
                        related_type: 'objective',
                        is_read: false
                    });
                }
            }
        };

        if (isMarketplace) {
            // --- Marketplace Purchase (Buy from another user) ---
            if (!lockerId || !tokenId) throw new Error('Locker ID and Token ID are required for marketplace purchase')

            // Get seller's item
            const { data: sellerItem, error: fetchError } = await supabaseClient
                .from('Locker')
                .select('*, item:store_items(*)')
                .eq('id', lockerId)
                .single()

            if (fetchError || !sellerItem) throw new Error('Listing not found')

            // Atomic Update: Subtract coins from buyer
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
            });

            // --- XP & Objectives for Marketplace ---
            const purchaseXP = Math.floor(price / 10);
            await grantXP(userId, purchaseXP, 'from marketplace purchase');

            // Seller gets sell objective progress
            await trackObjective(sellerItem.user_id, 'sell');

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

            // Increment total_purchased in store_items and get category
            const { data: storeItem } = await supabaseClient
                .from('store_items')
                .select('total_purchased, category')
                .eq('id', itemId)
                .single()

            if (storeItem) {
                await supabaseClient
                    .from('store_items')
                    .update({ total_purchased: (storeItem.total_purchased || 0) + 1 })
                    .eq('id', itemId);

                // Track objectives based on category
                if (storeItem.category === 'skins') {
                    await trackObjective(userId, 'fighters');
                } else if (storeItem.category === 'packs') {
                    await trackObjective(userId, 'packs');
                }
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
            });

            // --- XP for Store Purchase ---
            const purchaseXP = Math.floor(price / 10);
            await grantXP(userId, purchaseXP, 'from store purchase');
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
            JSON.stringify({ success: false, error: (error as any).message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
