import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-PREORDER-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Create Supabase client using the anon key for user authentication
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const { tierId } = await req.json();
    if (!tierId) {
      throw new Error("Tier ID is required");
    }

    logStep("Processing pre-order", { tierId });

    // Map tier IDs to Stripe product IDs
    const tierToProductMap = {
      "game-only": "prod_SnCCRlCwjUq6d5", // Classic Edition
      "special-edition": "prod_SnCDs5sfe3RnlQ", // Special Edition  
      "ultimate-edition": "prod_SnCFXCGWcX4Vqp", // Ultimate Edition
    };

    const productId = tierToProductMap[tierId as keyof typeof tierToProductMap];
    if (!productId) {
      throw new Error(`Invalid tier ID: ${tierId}`);
    }

    logStep("Mapped tier to product", { tierId, productId });

    // Get authenticated user (optional for pre-orders)
    const authHeader = req.headers.get("Authorization");
    let userId = null;

    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const { data } = await supabaseClient.auth.getUser(token);
        if (data.user?.id) {
          userId = data.user.id;
          logStep("Authenticated user found", { userId });
        }
      } catch (error) {
        const authError = error instanceof Error ? error.message : String(error);
        logStep("Authentication failed, proceeding with guest checkout", { error: authError });
      }
    } else {
      logStep("No auth header, proceeding with guest checkout");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get the product details from Stripe
    const product = await stripe.products.retrieve(productId);
    const prices = await stripe.prices.list({ product: productId, limit: 1 });
    
    if (prices.data.length === 0) {
      throw new Error(`No price found for product ${productId}`);
    }

    const price = prices.data[0];
    logStep("Retrieved product and price", { 
      productName: product.name, 
      priceId: price.id, 
      amount: price.unit_amount 
    });

    // Create a one-time payment session for the pre-order (no auto-populated email)
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/preorder-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/preorder-cancel`,
      metadata: {
        tierId: tierId,
        userId: userId || "guest",
      },
    });

    logStep("Created checkout session", { sessionId: session.id, url: session.url });

    // Store preorder record in database using service role key
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { error: dbError } = await supabaseService.from("preorders").insert({
      user_id: userId,
      email: null, // Will be populated after payment completion
      tier_id: tierId,
      stripe_session_id: session.id,
      stripe_customer_id: null, // No pre-existing customer
      product_id: productId,
      amount: price.unit_amount,
      currency: price.currency,
      status: "pending"
    });

    if (dbError) {
      logStep("Database error", { error: dbError.message });
      // Continue even if database insert fails - don't block checkout
    } else {
      logStep("Preorder record created", { sessionId: session.id });
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-preorder-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});