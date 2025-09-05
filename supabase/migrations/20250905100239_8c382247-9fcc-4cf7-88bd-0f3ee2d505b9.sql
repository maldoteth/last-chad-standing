-- Remove the specified mobility items from store_items table
DELETE FROM public.store_items 
WHERE name IN ('Jump Jets', 'Jump Pack', 'Speed Boost Pack', 'Speed Boots');