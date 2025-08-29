-- Create trigger to auto-generate usernames on profile creation
CREATE TRIGGER auto_generate_username_trigger
  BEFORE INSERT ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_username();

-- Update existing profiles that have null usernames
UPDATE public.user_profiles 
SET username = generate_random_username() 
WHERE username IS NULL OR username = '';