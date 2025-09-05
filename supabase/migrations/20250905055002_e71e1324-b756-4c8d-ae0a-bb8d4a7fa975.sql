-- Remove specified emotes and packs for mobile/tablet optimization
DELETE FROM public.store_items WHERE id IN (
  '148c7ddd-83a2-4875-b112-49085034b007', -- Taunt
  'cfcfd058-e775-4fc0-9e0b-943cfd6941be', -- Power Pose
  '6a08e280-c9fa-4ff2-94b8-79340aad30be', -- Ultimate Flex
  '2934ad77-7c91-4f01-8ce7-53cd8a7a48c4', -- Taunt Gesture
  '6933ddfb-05f0-48c2-be83-33c61a8543a0', -- Victory Dance
  'b2702015-a7a0-4a78-9b34-88cac5576075', -- Shush
  '5c8fc1d2-a798-4f82-9b26-0a589f0e812b'  -- Premium Pack
);