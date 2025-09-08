-- Update Stani Eagle rarity to special
UPDATE public.store_items 
SET rarity = 'special' 
WHERE name ILIKE '%stani%eagle%';