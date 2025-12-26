-- Deactivate all "Dangerous fighter" items
UPDATE store_items 
SET is_active = false, updated_at = NOW()
WHERE name ILIKE '%dangerous%fighter%';