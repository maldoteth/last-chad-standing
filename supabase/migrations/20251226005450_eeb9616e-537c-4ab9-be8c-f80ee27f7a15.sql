-- Rename all "John Doe" fighters to "Conquisto D'ior"
UPDATE store_items 
SET name = 'Conquisto D''ior', updated_at = NOW()
WHERE name = 'John Doe';