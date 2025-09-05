-- Add the 4 missing fighters to match desktop version
INSERT INTO public.store_items (name, price, rarity, category, image_url, is_active, description) VALUES
('Shane Sonny', 1200, 'gold', 'fighters', '/lovable-uploads/a76e21f1-ffca-4130-bd9a-08d09167dca0.png', true, 'Golden fighter with exceptional technique'),
('Ray Del Maestro', 2800, 'blue', 'fighters', '/lovable-uploads/e8b33b1a-410f-4448-9b83-126b8d27f0a9.png', true, 'Master fighter with legendary skills'),
('John Strictland', 1000, 'special', 'fighters', '/lovable-uploads/98664a07-8365-4512-8f3e-a0c79bd4617c.png', true, 'Special edition fighter with unique abilities'),
('Tarragon Southslice', 2800, 'gold', 'fighters', '/lovable-uploads/cf5abf4c-cf7f-49b7-a830-49343c8d1222.png', true, 'Elite golden fighter from the south');