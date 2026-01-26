import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    try {
        const { cartItems, metadata } = await req.json();

        if (!cartItems || cartItems.length === 0) {
            throw new Error("Cart items are required");
        }

        const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
            apiVersion: "2023-10-16",
        });

        const line_items = cartItems.map((item: any) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity || 1,
        }));

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get("origin")}/payment-cancel`,
            metadata: metadata || {},
        });

        return new Response(JSON.stringify({ url: session.url }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new Response(JSON.stringify({ error: errorMessage }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
        });
    }
});
