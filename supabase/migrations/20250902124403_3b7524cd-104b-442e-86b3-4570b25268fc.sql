-- Create preorders table to track all pre-order purchases
CREATE TABLE public.preorders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT, -- Nullable for guest purchases
  email TEXT NOT NULL,
  tier_id TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  product_id TEXT NOT NULL,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, failed, cancelled
  payment_intent_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.preorders ENABLE ROW LEVEL SECURITY;

-- Create policies for preorders
CREATE POLICY "Users can view their own preorders" 
ON public.preorders 
FOR SELECT 
USING (auth.uid()::text = user_id OR user_id IS NULL);

CREATE POLICY "Service role can manage all preorders" 
ON public.preorders 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_preorders_updated_at
BEFORE UPDATE ON public.preorders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();