-- First, let's drop the existing storage policies that rely on auth.uid()
DROP POLICY IF EXISTS "Users can upload their own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Profile pictures are publicly accessible" ON storage.objects;

-- Create new policies that work without Supabase Auth
-- Allow public read access to profile pictures
CREATE POLICY "Public read access for profile pictures" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profile-pictures');

-- Allow anyone to insert profile pictures (we'll handle authorization in the app layer)
CREATE POLICY "Allow profile picture uploads" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'profile-pictures');

-- Allow anyone to update profile pictures (we'll handle authorization in the app layer)
CREATE POLICY "Allow profile picture updates" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'profile-pictures');

-- Allow anyone to delete profile pictures (we'll handle authorization in the app layer)
CREATE POLICY "Allow profile picture deletions" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'profile-pictures');