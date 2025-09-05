-- Add the 4 desktop accessories to store_items table
INSERT INTO public.store_items (name, description, price, category, rarity, image_url, is_active) VALUES
  ('Combat Vest', 'Military-grade tactical vest with advanced protection', 880, 'accessories', 'gold', '/lovable-uploads/8c7fd9f1-1128-4d45-b089-e8879cb0fa98.png', true),
  ('DHB x LCS shorts', 'Premium athletic shorts for superior performance', 990, 'accessories', 'blue', '/lovable-uploads/e21fe8d7-5519-4b7b-bd90-6b96e74635d4.png', true),
  ('BMF Shorts', 'Elite combat shorts for ultimate mobility', 1200, 'accessories', 'special', '/lovable-uploads/6ffd60e7-d39b-442f-a71c-9ae2f491846f.png', true),
  ('Rapz Gloves', 'Professional fighting gloves with enhanced grip', 800, 'accessories', 'silver', '/lovable-uploads/9320a71d-c3b8-4922-938c-5e759907fcf6.png', true);