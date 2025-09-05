-- Update pitbike image in store_items table
UPDATE public.store_items 
SET image_url = '/lovable-uploads/4af5c711-e15f-4821-814d-97dcd8975540.png' 
WHERE name ILIKE '%pit%bike%' AND category = 'mobility';