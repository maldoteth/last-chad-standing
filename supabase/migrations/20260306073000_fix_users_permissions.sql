-- Disable RLS for tables accessed by frontend to support Privy-based auth flow
-- Since Privy handles authentication outside Supabase, we temporarily disable RLS for these tables
-- to allow the frontend to perform CRUD operations using the anon key.

ALTER TABLE IF EXISTS public."Users" DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Locker" DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Performances" DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Notification" DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Objective" DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."ObjectiveProgress" DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Transactions" DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Level" DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.store_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.marketplace_listings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Contract_token" DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_balances DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_profiles DISABLE ROW LEVEL SECURITY;
