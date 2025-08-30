-- Fix RLS policies for Privy authentication compatibility
-- Since Privy handles auth outside Supabase, auth.uid() returns NULL
-- We need to temporarily disable RLS or modify policies to work with application-level security

-- Drop existing RLS policies that depend on auth.uid()
DROP POLICY IF EXISTS "Users can create their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.user_profiles;

-- Drop existing user_balances policies
DROP POLICY IF EXISTS "Users can update their own balance" ON public.user_balances;
DROP POLICY IF EXISTS "Users can view their own balance" ON public.user_balances;

-- Temporarily disable RLS to allow profile creation through application
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_balances DISABLE ROW LEVEL SECURITY;

-- Add trigger to auto-generate usernames for new profiles
DROP TRIGGER IF EXISTS auto_generate_username_trigger ON public.user_profiles;
CREATE TRIGGER auto_generate_username_trigger
  BEFORE INSERT ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_username();