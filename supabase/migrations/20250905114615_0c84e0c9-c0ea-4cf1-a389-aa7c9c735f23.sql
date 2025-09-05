-- Fix pitbike image to match the working transfer page
UPDATE public.store_items 
SET image_url = '/lovable-uploads/2d5ccc85-d9e9-4c45-b684-159b0bb83745.png' 
WHERE name ILIKE '%pit%bike%' AND category = 'mobility';