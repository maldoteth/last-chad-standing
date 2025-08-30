-- Enable Row Level Security on user_balances and user_profiles tables
-- and add appropriate policies

-- Enable RLS on user_balances table
ALTER TABLE public.user_balances ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for user_balances
CREATE POLICY "Users can view their own balance" 
ON public.user_balances 
FOR SELECT 
USING ((auth.uid())::text = user_id);

CREATE POLICY "Users can update their own balance" 
ON public.user_balances 
FOR UPDATE 
USING ((auth.uid())::text = user_id);

CREATE POLICY "Users can insert their own balance" 
ON public.user_balances 
FOR INSERT 
WITH CHECK ((auth.uid())::text = user_id);

-- Enable RLS on user_profiles table
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for user_profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.user_profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.user_profiles 
FOR UPDATE 
USING ((auth.uid())::text = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK ((auth.uid())::text = user_id);