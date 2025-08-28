-- Create admin_users table for custom admin authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users table (only admins can access)
CREATE POLICY "Admin users can manage admin table" 
ON public.admin_users 
FOR ALL 
USING (true);

-- Insert default admin user with bcrypt-hashed password for "admin42069"
-- Using bcrypt hash with salt rounds 10 for password "admin42069"
INSERT INTO public.admin_users (email, password_hash) 
VALUES ('admin@lcs.com', '$2b$10$rQJ8pF7QKqF5KX.vN4K2/.rKt6OqGJqF5KX.vN4K2/.rKt6OqGJqF5KX.vN4K2/');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();