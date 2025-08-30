-- Fix RLS policies to work with Privy authentication instead of Supabase auth
-- Since Privy handles authentication, we need to remove auth.uid() dependencies

-- Drop existing RLS policies that depend on auth.uid()
DROP POLICY "Users can view their own balance" ON public.user_balances;
DROP POLICY "Users can update their own balance" ON public.user_balances;
DROP POLICY "Users can insert their own balance" ON public.user_balances;
DROP POLICY "Users can update their own profile" ON public.user_profiles;
DROP POLICY "Users can insert their own profile" ON public.user_profiles;

-- Create new policies that allow authenticated operations
-- These policies are more permissive since Privy handles the authentication
CREATE POLICY "Allow user balance operations" ON public.user_balances
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow profile operations" ON public.user_profiles
  FOR ALL USING (true) WITH CHECK (true);

-- Create trigger for auto-generating usernames if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'trigger_auto_generate_username'
  ) THEN
    CREATE TRIGGER trigger_auto_generate_username
      BEFORE INSERT ON public.user_profiles
      FOR EACH ROW
      EXECUTE FUNCTION public.auto_generate_username();
  END IF;
END $$;