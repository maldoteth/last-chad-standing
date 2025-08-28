-- Add XP column to user_balances table
ALTER TABLE public.user_balances 
ADD COLUMN xp integer NOT NULL DEFAULT 0;