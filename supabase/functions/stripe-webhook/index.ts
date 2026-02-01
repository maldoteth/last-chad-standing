import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2023-10-16",
});

serve(async (req) => {
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
        return new Response("No signature", { status: 400 });
    }

    try {
        const body = await req.text();
        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            Deno.env.get("STRIPE_WEBHOOK_SECRET") || ""
        );

        const supabaseAdmin = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;
            const { userId, coins, type } = session.metadata || {};

            if (type === 'coin_purchase' && userId && coins) {
                const coinAmount = parseInt(coins);

                // Update user coins
                const { data: userData, error: userError } = await supabaseAdmin
                    .from('Users')
                    .select('coins')
                    .eq('id', userId)
                    .single();

                if (userError) throw userError;

                const newBalance = (userData?.coins || 0) + coinAmount;

                await supabaseAdmin
                    .from('Users')
                    .update({ coins: newBalance })
                    .eq('id', userId);

                // Log transaction
                await supabaseAdmin
                    .from('Transactions')
                    .insert({
                        user_id: userId,
                        amount: session.amount_total ? session.amount_total / 100 : 0,
                        coins: coinAmount,
                        paymentMethod: 'card',
                        status: 'success',
                        txHash: session.id
                    });
            }

            if (type === 'preorder' && userId) {
                // Handle pre-order completion (e.g. update preorders table)
                await supabaseAdmin
                    .from('preorders')
                    .update({ status: 'completed', email: session.customer_details?.email })
                    .eq('stripe_session_id', session.id);
            }
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Webhook error:", errorMessage);
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 400,
        });
    }
});
