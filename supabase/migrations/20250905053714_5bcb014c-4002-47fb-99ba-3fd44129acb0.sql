-- Remove Tactical Wing Suit and Elite Armor from accessories
DELETE FROM public.store_items 
WHERE id IN (
  'afb8b7f9-2dac-496c-bc5e-e37fd28e9e99', -- Tactical Wing Suit
  '268b82d5-4d63-45be-aefe-a678ef69d77e'  -- Elite Armor
);