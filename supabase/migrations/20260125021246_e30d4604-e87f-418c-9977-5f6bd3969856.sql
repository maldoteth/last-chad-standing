-- Insert admin user
INSERT INTO public."AdminUsers" (email, role)
VALUES ('shubhamraikwar09j@gmail.com', 'admin')
ON CONFLICT (email) DO UPDATE SET role = 'admin';