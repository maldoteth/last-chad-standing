import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-PREORDER-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const body = await req.json();
    const { sessionId, type, coins, txHash, depositAddress, exchangeRate, cryptoAmount, amount } = body;

    // Create Supabase service client
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // --- CRYPTO COIN PURCHASE FLOW ---
    if (type === 'crypto_coin_purchase') {
      logStep("Processing crypto coin purchase", { coins, txHash, amount });

      if (!txHash || !coins) {
        throw new Error("Transaction hash and coins are required for crypto purchases");
      }

      // Get user from JWT auth header
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        throw new Error("Authorization header is required");
      }

      const supabaseAuth = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        {
          global: { headers: { Authorization: authHeader } },
          auth: { persistSession: false }
        }
      );

      const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
      if (authError || !user) {
        throw new Error("User not authenticated");
      }

      const userId = user.id;
      logStep("Authenticated user", { userId });

      // Check for duplicate transaction
      const { data: existingTx } = await supabaseService
        .from('Transactions')
        .select('id')
        .eq('txHash', txHash)
        .single();

      if (existingTx) {
        throw new Error("This transaction has already been processed");
      }

      // Get current coin balance
      const { data: userData, error: userError } = await supabaseService
        .from('Users')
        .select('coins')
        .eq('id', userId)
        .single();

      if (userError) {
        logStep("User lookup error", { error: userError.message });
        throw new Error(`Failed to find user: ${userError.message}`);
      }

      const coinAmount = Number(coins);
      const newBalance = (userData?.coins || 0) + coinAmount;

      // Update user coins
      const { error: updateError } = await supabaseService
        .from('Users')
        .update({ coins: newBalance })
        .eq('id', userId);

      if (updateError) {
        logStep("Coin update error", { error: updateError.message });
        throw new Error(`Failed to update coins: ${updateError.message}`);
      }

      // Log transaction
      const { error: txError } = await supabaseService
        .from('Transactions')
        .insert({
          user_id: userId,
          amount: amount || 0,
          coins: coinAmount,
          paymentMethod: 'crypto',
          status: 'success',
          txHash: txHash,
          depositAddress: depositAddress || null,
          exchangeRate: exchangeRate || null,
          cryptoAmount: cryptoAmount || null,
        });

      if (txError) {
        logStep("Transaction log error", { error: txError.message });
      }

      logStep("Crypto coin purchase completed", { userId, coins: coinAmount, newBalance });

      return new Response(JSON.stringify({
        success: true,
        message: `${coinAmount} coins added successfully`,
        newBalance,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // --- STRIPE PREORDER VERIFICATION FLOW ---
    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    logStep("Verifying payment", { sessionId });

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    logStep("Retrieved Stripe session", {
      sessionId,
      paymentStatus: session.payment_status,
      status: session.status
    });

    // Determine status based on Stripe session
    let status = "pending";
    if (session.payment_status === "paid") {
      status = "paid";
    } else if (session.status === "expired") {
      status = "cancelled";
    } else if (session.payment_status === "unpaid") {
      status = "failed";
    }

    // Update preorder record
    const { data, error } = await supabaseService
      .from("preorders")
      .update({
        status,
        payment_intent_id: session.payment_intent as string || null,
        updated_at: new Date().toISOString()
      })
      .eq("stripe_session_id", sessionId)
      .select()
      .single();

    if (error) {
      logStep("Database update error", { error: error.message });
      throw new Error(`Failed to update preorder: ${error.message}`);
    }

    logStep("Preorder updated successfully", { preorderId: data.id, status });

    return new Response(JSON.stringify({
      success: true,
      preorder: data,
      paymentStatus: session.payment_status
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in verify-preorder-payment", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
