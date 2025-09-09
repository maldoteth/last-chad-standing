-- Update all uncommon rarity items to sparse
UPDATE public.store_items 
SET rarity = 'sparse' 
WHERE rarity = 'uncommon';

-- Update any marketplace listings with uncommon rarity to sparse
UPDATE public.marketplace_listings 
SET item_type = REPLACE(item_type, 'uncommon', 'sparse')
WHERE item_type LIKE '%uncommon%';