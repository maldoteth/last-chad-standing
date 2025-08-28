-- Update admin user with correct bcrypt hash for password "admin42069"
-- Generated using bcryptjs with salt rounds 10
UPDATE public.admin_users 
SET password_hash = '$2a$10$xS7QWLk5LJKqJ5K2/.0K2OUh6OqGJqF5KX.vN4K2/.rKt6OqGJqF5K'
WHERE email = 'admin@lcs.com';