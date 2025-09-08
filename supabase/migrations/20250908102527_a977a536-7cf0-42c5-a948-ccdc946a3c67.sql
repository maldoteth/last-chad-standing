-- Update Stami Eagle rarity to mythical
UPDATE public.store_items 
SET rarity = 'mythical' 
WHERE name ILIKE '%stami%eagle%';