-- Pre-orders Table
CREATE TABLE IF NOT EXISTS "preorders" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "user_id" UUID REFERENCES "Users"("id"),
    "email" TEXT,
    "tier_id" TEXT NOT NULL,
    "stripe_session_id" TEXT UNIQUE,
    "stripe_customer_id" TEXT,
    "product_id" TEXT,
    "amount" DECIMAL,
    "currency" TEXT DEFAULT 'usd',
    "status" TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed'
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);
