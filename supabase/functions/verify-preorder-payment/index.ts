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
    const { sessionId, type } = body;

    // Handle Crypto Coin Purchase
    if (type === 'crypto_coin_purchase') {
      const { coins, txHash, amount, userId } = body;

      logStep("Processing crypto coin purchase", { coins, txHash, userId });

      if (!txHash) throw new Error("Transaction hash is required");
      if (!coins) throw new Error("Coin amount is required");
      if (!userId) throw new Error("User ID is required");

      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        { auth: { persistSession: false } }
      );

      // 1. Check if transaction already processed
      const { data: existingTx } = await supabaseAdmin
        .from('Transactions')
        .select('id')
        .eq('txHash', txHash)
        .maybeSingle();

      if (existingTx) {
        logStep("Transaction already processed", { txHash });
        return new Response(JSON.stringify({
          success: true,
          message: "Payment already processed",
          alreadyProcessed: true
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      // 2. Update user balance
      const { data: userData, error: userError } = await supabaseAdmin
        .from('Users')
        .select('coins')
        .eq('id', userId)
        .single();

      if (userError || !userData) {
        console.error("User not found or error:", userError);
        throw new Error("User not found");
      }

      const newBalance = (userData.coins || 0) + Number(coins);

      const { error: updateError } = await supabaseAdmin
        .from('Users')
        .update({ coins: newBalance })
        .eq('id', userId);

      if (updateError) throw updateError;

      // 3. Log transaction
      const { error: txError } = await supabaseAdmin
        .from('Transactions')
        .insert({
          user_id: userId,
          amount: amount || 0,
          coins: coins,
          paymentMethod: 'crypto',
          status: 'success',
          txHash: txHash
        });

      if (txError) {
        console.error("Failed to log transaction:", txError);
        // We don't throw here because user already got their coins, 
        // but we should probably log it.
      }

      logStep("Crypto coin purchase successful", { userId, newBalance });

      return new Response(JSON.stringify({
        success: true,
        message: `${coins} coins added successfully!`,
        coins: coins
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Default Stripe Preorder Logic
    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    logStep("Verifying Stripe payment", { sessionId });

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

    // Create Supabase service client
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

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