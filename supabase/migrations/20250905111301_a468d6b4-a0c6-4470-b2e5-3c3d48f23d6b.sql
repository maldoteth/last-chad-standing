-- Update Pit Bike item to use the coupe tank image from transfer market
UPDATE public.store_items 
SET image_url = '/lovable-uploads/1c6b707c-97a6-4381-bc54-de63a7cf8a31.png' 
WHERE name = 'Pit Bike';