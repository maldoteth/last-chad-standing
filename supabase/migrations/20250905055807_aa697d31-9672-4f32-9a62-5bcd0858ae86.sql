-- Remove duplicate emotes to fix mobile/tablet repetition issue
DELETE FROM public.store_items WHERE id IN (
  '76ee7ca9-7a58-4dbf-92c6-85543a954b94', -- Duplicate Flex (cheaper version - 250 coins, rare)
  '02a68dfc-8b3e-47ad-b9dc-70b7847b1fbe', -- Duplicate Squeaky Dance (cheaper version - 750 coins)
  '285435b0-6d64-45d9-85c3-6f8a383a325c'  -- Duplicate Fists Up (mythical version - 1000 coins)
);