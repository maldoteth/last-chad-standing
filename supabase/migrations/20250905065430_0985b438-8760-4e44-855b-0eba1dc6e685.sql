-- Delete the specified packs from store_items
DELETE FROM public.store_items 
WHERE name IN ('Platinum Pack', 'Diamond Pack', 'Starter Pack');