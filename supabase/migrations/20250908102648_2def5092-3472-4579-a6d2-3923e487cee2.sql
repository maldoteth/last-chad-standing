-- Update Stani Eagle rarity to mythical (corrected spelling)
UPDATE public.store_items 
SET rarity = 'mythical' 
WHERE name ILIKE '%stani%eagle%';