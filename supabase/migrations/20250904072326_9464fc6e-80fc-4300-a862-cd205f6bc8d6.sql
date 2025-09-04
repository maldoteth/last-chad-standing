-- Insert sample store items for testing the enhanced store functionality
INSERT INTO public.store_items (name, description, price, category, rarity, image_url, first_release_date, total_purchased, is_active) VALUES
-- Fighters category
('The Irish King', 'Legendary fighter from the emerald isle', 2500, 'fighters', 'legendary', '/lovable-uploads/5c3f060f-4c5f-412b-8f27-eb1bebd3dd7d.png', '2024-01-15', 42, true),
('Stani Eagle', 'Swift striker with eagle-eye precision', 1800, 'fighters', 'rare', '/lovable-uploads/37f256dc-415c-4032-82ad-db63f676284d.png', '2024-02-10', 28, true),
('Jonesy Bones', 'Tank specialist with bone-crushing power', 2200, 'fighters', 'epic', '/lovable-uploads/660b5122-5ce8-4f6e-af72-2c607d47ef44.png', '2024-01-20', 35, true),
('Latin Legend', 'Defensive master from the mountains', 1500, 'fighters', 'uncommon', '/lovable-uploads/2c556456-ebeb-4eec-9842-f2d31e06c58a.png', '2024-03-05', 18, true),

-- Accessories category
('Elite Combat Helmet', 'Advanced tactical headgear', 800, 'accessories', 'rare', '/lovable-uploads/896892f1-7ebc-4852-acea-80dcdbf7c545.png', '2024-02-01', 12, true),
('Tactical Wing Suit', 'Enhanced mobility armor piece', 600, 'accessories', 'uncommon', '/lovable-uploads/2eec4a9a-97d3-4ba4-9508-2eeef0011139.png', '2024-01-25', 24, true),
('Battle Boots', 'Reinforced combat footwear', 450, 'accessories', 'common', '/lovable-uploads/7d84dfb4-4db3-4adb-87f0-36f33c0f8daa.png', '2024-03-10', 8, true),

-- Mobility category
('Speed Boost Pack', 'Increases movement speed significantly', 1200, 'mobility', 'epic', '/lovable-uploads/b64d7801-1284-4763-b115-ca3cfa8ff315.png', '2024-01-10', 31, true),
('Jump Jets', 'Enhanced vertical mobility system', 900, 'mobility', 'rare', '/lovable-uploads/c4290bdc-f68b-45db-bf53-f9551d2cb16f.png', '2024-02-15', 19, true),

-- Emotes category
('Victory Dance', 'Celebratory emote for winning moments', 300, 'emotes', 'common', '/lovable-uploads/4c80b2cf-0ea7-49a2-96b8-58ecbfa7623a.png', '2024-03-01', 5, true),
('Taunt Gesture', 'Intimidating gesture to psych out opponents', 250, 'emotes', 'common', '/lovable-uploads/508d1509-e761-46c6-9f3a-f70e256f5a52.png', '2024-02-28', 3, true);