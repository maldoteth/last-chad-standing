-- Create store items table
CREATE TABLE public.store_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  rarity TEXT NOT NULL DEFAULT 'common',
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user balances table
CREATE TABLE public.user_balances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE, -- Privy user ID
  coins INTEGER NOT NULL DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user inventory table
CREATE TABLE public.user_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL, -- Privy user ID
  item_id UUID NOT NULL REFERENCES public.store_items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_id)
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL, -- Privy user ID
  item_id UUID NOT NULL REFERENCES public.store_items(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL DEFAULT 'purchase',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.store_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for store_items (public read, admin write)
CREATE POLICY "Store items are viewable by everyone" 
ON public.store_items 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only authenticated users can manage store items" 
ON public.store_items 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- RLS Policies for user_balances
CREATE POLICY "Users can view their own balance" 
ON public.user_balances 
FOR SELECT 
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own balance" 
ON public.user_balances 
FOR ALL 
USING (auth.uid()::text = user_id);

-- RLS Policies for user_inventory
CREATE POLICY "Users can view their own inventory" 
ON public.user_inventory 
FOR SELECT 
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can manage their own inventory" 
ON public.user_inventory 
FOR ALL 
USING (auth.uid()::text = user_id);

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions" 
ON public.transactions 
FOR SELECT 
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create their own transactions" 
ON public.transactions 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

-- Insert sample store items
INSERT INTO public.store_items (name, description, price, category, rarity, image_url) VALUES
('Flame Skin', 'A fiery red skin that glows with intensity', 500, 'skins', 'rare', '/lovable-uploads/0438f719-b82a-4f49-80d1-7f232ef63242.png'),
('Ice Skin', 'A cool blue skin with frosty effects', 300, 'skins', 'common', '/lovable-uploads/048eb62f-cb05-478b-a60a-5dc0bb43b721.png'),
('Lightning Skin', 'Electric yellow skin with sparkling effects', 750, 'skins', 'legendary', '/lovable-uploads/04d47857-2947-4d8d-a573-ff6bdaa23efb.png'),
('Crown Accessory', 'Royal golden crown for ultimate prestige', 1000, 'accessories', 'legendary', '/lovable-uploads/10b201c5-4459-46db-8a74-f056acdf247b.png'),
('Speed Boots', 'Increases movement speed by 20%', 400, 'mobility', 'rare', '/lovable-uploads/1373b087-4cb8-43e3-ae69-f3ff5c05a5d1.png'),
('Jump Pack', 'Allows double jump ability', 600, 'mobility', 'epic', '/lovable-uploads/13b1e254-7a27-4fc3-8040-9882d7705c70.png');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_store_items_updated_at
  BEFORE UPDATE ON public.store_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_balances_updated_at
  BEFORE UPDATE ON public.user_balances
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();