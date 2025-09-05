-- Update Speed Buggy item to use the correct image from transfer market
UPDATE public.store_items 
SET image_url = '/lovable-uploads/b64d7801-1284-4763-b115-ca3cfa8ff315.png' 
WHERE name = 'Speed Buggy';