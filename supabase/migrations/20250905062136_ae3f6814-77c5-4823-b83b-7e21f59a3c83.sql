-- Standardize rarity system across all store items
-- Update inconsistent rarity names to use standardized naming convention

-- Update 'blue' to 'rare'
UPDATE public.store_items SET rarity = 'rare' WHERE rarity = 'blue';

-- Update 'green' to 'common' 
UPDATE public.store_items SET rarity = 'common' WHERE rarity = 'green';

-- Update 'gold' to 'legendary'
UPDATE public.store_items SET rarity = 'legendary' WHERE rarity = 'gold';

-- Update 'silver' to 'epic'
UPDATE public.store_items SET rarity = 'epic' WHERE rarity = 'silver';

-- Keep 'special' as is - it's a special category

-- Ensure all other rarities are already standardized
-- Final rarity types will be: common, uncommon, rare, epic, legendary, special