-- Add missing mobility items to store_items table
INSERT INTO public.store_items (name, description, category, price, rarity, image_url, is_active, first_release_date) VALUES
('Pogo', 'High-performance pogo stick for extreme vertical mobility and aerial maneuvers', 'mobility', 8000, 'legendary', '/lovable-uploads/speed-buggy.png', true, CURRENT_DATE),
('The Coupé Tank', 'Armored luxury vehicle combining style with raw defensive power', 'mobility', 5000, 'epic', '/lovable-uploads/speed-buggy.png', true, CURRENT_DATE),
('Pit Bike', 'Agile dirt bike built for speed and off-road performance', 'mobility', 4500, 'epic', '/lovable-uploads/speed-buggy.png', true, CURRENT_DATE),
('Speed Buggy', 'Lightweight racing buggy designed for maximum speed and handling', 'mobility', 3200, 'rare', '/lovable-uploads/speed-buggy.png', true, CURRENT_DATE);