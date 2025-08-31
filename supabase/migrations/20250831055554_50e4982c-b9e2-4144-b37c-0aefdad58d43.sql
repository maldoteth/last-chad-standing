-- Create marketplace_listings table for bid/ask system
CREATE TABLE public.marketplace_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  item_id UUID NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('player', 'skin', 'emote', 'bike', 'pack')),
  listing_type TEXT NOT NULL CHECK (listing_type IN ('sell', 'buy')),
  price INTEGER NOT NULL CHECK (price > 0),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view active marketplace listings" 
ON public.marketplace_listings 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "Users can create their own marketplace listings" 
ON public.marketplace_listings 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own marketplace listings" 
ON public.marketplace_listings 
FOR UPDATE 
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own marketplace listings" 
ON public.marketplace_listings 
FOR DELETE 
USING (auth.uid()::text = user_id);

-- Add indexes for better performance
CREATE INDEX idx_marketplace_listings_item_id ON public.marketplace_listings(item_id);
CREATE INDEX idx_marketplace_listings_item_type ON public.marketplace_listings(item_type);
CREATE INDEX idx_marketplace_listings_listing_type ON public.marketplace_listings(listing_type);
CREATE INDEX idx_marketplace_listings_status ON public.marketplace_listings(status);
CREATE INDEX idx_marketplace_listings_price ON public.marketplace_listings(price);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_marketplace_listings_updated_at
BEFORE UPDATE ON public.marketplace_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();