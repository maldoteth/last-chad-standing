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

        // Helper to check for existing objective progress or create it
        const updateObjective = async (uid: string, objType: string) => {
            console.log(`Tracking objective type: ${objType} for user: ${uid}`);
            const { data: objectives, error: objError } = await supabaseClient
                .from('Objective')
                .select('*')
                .eq('type', objType)
                .eq('isActive', true);

            if (objError) {
                console.error(`Error fetching objectives for type ${objType}:`, objError);
                return;
            }

            if (!objectives || objectives.length === 0) {
                console.log(`No active objectives found for type: ${objType}`);
                return;
            }

            for (const obj of objectives) {
                const { data: progress, error: progError } = await supabaseClient
                    .from('ObjectiveProgress')
                    .select('*')
                    .eq('user_id', uid)
                    .eq('objective_id', obj.id)
                    .maybeSingle();

                if (progError) {
                    console.error(`Error fetching progress for obj ${obj.id}:`, progError);
                    continue;
                }

                if (progress?.completed) {
                    console.log(`Objective ${obj.id} already completed for user ${uid}`);
                    continue;
                }

                const newCount = (progress?.currentCount || 0) + 1;
                const isNowCompleted = newCount >= obj.targetCount;

                if (!progress) {
                    console.log(`Creating new progress for objective ${obj.id}`);
                    const { error: insError } = await supabaseClient.from('ObjectiveProgress').insert({
                        user_id: uid,
                        objective_id: obj.id,
                        currentCount: newCount,
                        completed: isNowCompleted,
                        type: obj.type,
                        category: obj.category,
                        startDate: new Date().toISOString(),
                        lastUpdated: new Date().toISOString()
                    });
                    if (insError) console.error("Insert Progress Error:", insError);
                } else {
                    console.log(`Updating existing progress for objective ${obj.id} to ${newCount}`);
                    const { error: updError } = await supabaseClient.from('ObjectiveProgress').update({
                        currentCount: newCount,
                        completed: isNowCompleted,
                        lastUpdated: new Date().toISOString()
                    }).eq('id', progress.id);
                    if (updError) console.error("Update Progress Error:", updError);
                }

                if (isNowCompleted) {
                    console.log(`Objective ${obj.id} COMPLETED for user ${uid}`);
                    // Reward XP for completion
                    const { data: userData } = await supabaseClient.from('Users').select('xp').eq('id', uid).single();
                    const newXP = (userData?.xp || 0) + obj.rewardXP;
                    await supabaseClient.from('Users').update({ xp: newXP }).eq('id', uid);

                    // Notification for completion
                    await supabaseClient.from('Notification').insert({
                        user_id: uid,
                        title: 'Objective Completed! 🎉',
                        message: `Congrats! You completed "${obj.title}" and earned ${obj.rewardXP} XP!`,
                        type: 'objective_complete',
                        related_type: 'objective',
                        is_read: false
                    });
                }
            }
        };

        const priceNum = Number(price);
        const purchaseXP = Math.floor(priceNum / 10);
        const newTotalCoins = user.coins - priceNum;
        const newTotalXP = (user.xp || 0) + purchaseXP;

        // 2. Perform Primary Transaction (Update User Coins & XP)
        const { error: updateError } = await supabaseClient
            .from('Users')
            .update({ coins: newTotalCoins, xp: newTotalXP })
            .eq('id', userId);

        if (updateError) throw updateError;

        // 3. Update Performance Table (Total XP)
        const { data: perf } = await supabaseClient.from('Performances').select('total_XP').eq('user_id', userId).single();
        if (perf) {
            const newTotalPerfXP = (perf.total_XP || 0) + purchaseXP;
            const { data: levelInfo } = await supabaseClient
                .from('Level')
                .select('id, level')
                .lte('min_xp', newTotalPerfXP)
                .order('min_xp', { ascending: false })
                .limit(1)
                .single();

            await supabaseClient.from('Performances').update({
                total_XP: newTotalPerfXP,
                level: levelInfo?.level || 1,
                level_id: levelInfo?.id || null
            }).eq('user_id', userId);
        }

        if (isMarketplace) {
            // --- Marketplace Purchase Logic ---
            if (!lockerId || !tokenId) throw new Error('Locker ID and Token ID are required for marketplace purchase');

            const { data: sellerItem, error: fetchError } = await supabaseClient
                .from('Locker')
                .select('*, item:store_items(*)')
                .eq('id', lockerId)
                .single();

            if (fetchError || !sellerItem) throw new Error('Listing not found');

            // Update seller item (mark as not for sale)
            await supabaseClient.from('Locker').update({
                listed_for_sale: false,
                is_sell_item: false,
                sell_count: (sellerItem.sell_count || 0) + 1,
            }).eq('id', lockerId);

            // Create new locker entry for buyer
            const { data: newLocker, error: lockerError } = await supabaseClient.from('Locker').insert({
                user_id: userId,
                item_id: sellerItem.item_id,
                coins: priceNum,
                nftBuyerWalletId: nftBuyerWalletId,
                purchase_date: new Date().toISOString(),
                quantity: 1,
                listed_for_sale: false,
                is_sell_item: false,
                token_ids: [tokenId],
            }).select('id').single();

            if (!lockerError && newLocker) {
                // Also track in Contract_token for quick lookup
                await supabaseClient.from('Contract_token').insert({
                    user_id: userId,
                    item_id: sellerItem.item_id,
                    locker_id: newLocker.id,
                    nftAddress: sellerItem.item?.nftAddress,
                    token_id: parseInt(tokenId) || 0
                });
            }

            // Map category to objective types
            const cat = (sellerItem.item?.category || "").toLowerCase();
            if (cat === 'skins' || cat === 'fighters') {
                await updateObjective(userId, 'fighters');
            } else if (cat === 'packs') {
                await updateObjective(userId, 'packs');
            }

            // Seller gets sell objective progress
            await updateObjective(sellerItem.user_id, 'sell');

        } else {
            // --- Store Purchase Logic ---
            if (!itemId) throw new Error('Item ID is required for store purchase');

            const { data: newLocker, error: lockerError } = await supabaseClient.from('Locker').insert({
                user_id: userId,
                item_id: itemId,
                coins: priceNum,
                nftBuyerWalletId: nftBuyerWalletId,
                purchase_date: new Date().toISOString(),
                quantity: 1,
                listed_for_sale: false,
                is_sell_item: false,
            }).select('id').single();

            const { data: storeItem } = await supabaseClient
                .from('store_items')
                .select('category, total_purchased, nftAddress')
                .eq('id', itemId)
                .single();

            if (storeItem) {
                await supabaseClient.from('store_items').update({
                    total_purchased: (storeItem.total_purchased || 0) + 1
                }).eq('id', itemId);

                if (!lockerError && newLocker) {
                    // Track in Contract_token
                    await supabaseClient.from('Contract_token').insert({
                        user_id: userId,
                        item_id: itemId,
                        locker_id: newLocker.id,
                        nftAddress: storeItem.nftAddress,
                        token_id: 0 // Default for store items
                    });
                }

                // Track Objectives
                const cat = (storeItem.category || "").toLowerCase();
                if (cat === 'skins' || cat === 'fighters') {
                    await updateObjective(userId, 'fighters');
                } else if (cat === 'packs') {
                    await updateObjective(userId, 'packs');
                }
            }
        }

        // Create Transaction Log
        await supabaseClient.from('Transactions').insert({
            user_id: userId,
            item_id: isMarketplace ? null : itemId,
            locker_id: isMarketplace ? null : null, // Should ideally link the new locker ID here too
            amount: priceNum,
            coins: priceNum,
            paymentMethod: 'coin',
            status: 'success',
            txHash: mintTx,
            nftBuyerWalletId: nftBuyerWalletId,
        });

        // Notification for purchase
        await supabaseClient.from('Notification').insert({
            user_id: userId,
            title: 'Purchase Successful! 💰',
            message: `You spent ${priceNum} coins and earned ${purchaseXP} XP.`,
            type: 'purchase',
            is_read: false
        });

        // 4. Return updated user and objectives
        const { data: finalUser } = await supabaseClient.from('Users').select('*').eq('id', userId).single();
        const { data: finalObjectives } = await supabaseClient
            .from('ObjectiveProgress')
            .select('*, objective:Objective(*)')
            .eq('user_id', userId);

        return new Response(
            JSON.stringify({
                success: true,
                user: finalUser,
                objectives: finalObjectives
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );

    } catch (error) {
        console.error("Purchase error:", error);
        return new Response(
            JSON.stringify({ success: false, error: (error as any).message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }
});
