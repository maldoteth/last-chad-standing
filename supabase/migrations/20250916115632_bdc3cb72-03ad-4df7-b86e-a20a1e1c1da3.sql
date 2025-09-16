-- Update the default value for coins column to 0
ALTER TABLE public.user_balances ALTER COLUMN coins SET DEFAULT 0;

-- Update all existing users who have 1000 coins to have 0 coins instead
UPDATE public.user_balances SET coins = 0 WHERE coins = 1000;