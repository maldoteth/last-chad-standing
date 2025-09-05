-- Update Pogo item to use the correct image from transfer market
UPDATE public.store_items 
SET image_url = '/lovable-uploads/2877ff38-b9fd-4a5d-bca9-25b14f237997.png' 
WHERE name = 'Pogo';