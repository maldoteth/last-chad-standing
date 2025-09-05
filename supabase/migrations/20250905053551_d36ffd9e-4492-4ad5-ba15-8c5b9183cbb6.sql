-- Remove specified accessory items from store
DELETE FROM public.store_items 
WHERE id IN (
  '2f13357f-d3be-4f06-8e8d-f2a6f31f8889', -- Combat Helmet
  'bf86dd42-4d45-44a7-a701-33e4611fb92b', -- Tactical Gloves
  '569f0c22-3858-4507-ad8c-eea3e6d64904', -- Battle Boots (first)
  'e76b908d-cd83-4fc5-898a-267f7fa9a932', -- Battle Boots (duplicate)
  'e9183180-d5b7-4e3d-8ff5-4ef2a8bc948f', -- Crown Accessory
  '6f03b803-d6db-4344-870d-0885c7961d90'  -- Elite Combat Helmet
);