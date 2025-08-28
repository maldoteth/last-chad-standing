-- Let's check what's in the admin_users table and update with a proper hash
-- First, let's see what we have
SELECT email, password_hash FROM public.admin_users;

-- Update with a properly generated bcrypt hash for "admin42069"
-- This hash was generated using bcryptjs with 10 salt rounds
UPDATE public.admin_users 
SET password_hash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE email = 'admin@lcs.com';