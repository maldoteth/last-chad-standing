import bcrypt from 'bcryptjs';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
}

interface LoginResult {
  success: boolean;
  error?: string;
}

// Generate a session token
const generateSessionToken = (): string => {
  return crypto.randomUUID() + '-' + Date.now();
};

// Store admin session in localStorage
const setAdminSession = (adminUser: AdminUser): void => {
  const sessionToken = generateSessionToken();
  const sessionData = {
    id: adminUser.id,
    email: adminUser.email,
    token: sessionToken,
    loginTime: Date.now(),
  };
  localStorage.setItem('admin_session', JSON.stringify(sessionData));
};

// Get admin session from localStorage
export const getAdminSession = () => {
  const sessionData = localStorage.getItem('admin_session');
  if (!sessionData) return null;
  
  try {
    const session = JSON.parse(sessionData);
    // Check if session is still valid (24 hours)
    const isValid = Date.now() - session.loginTime < 24 * 60 * 60 * 1000;
    return isValid ? session : null;
  } catch {
    return null;
  }
};

// Check if user is authenticated as admin
export const isAdminAuthenticated = (): boolean => {
  return getAdminSession() !== null;
};

// Admin login function
export const adminLogin = async (email: string, password: string): Promise<LoginResult> => {
  try {
    console.log('Admin login attempt for:', email);
    
    // Fetch admin user from database
    const { data: adminUsers, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .limit(1);

    console.log('Database query result:', { adminUsers, error });

    if (error) {
      console.error('Database error:', error);
      return { success: false, error: 'Database error occurred' };
    }

    if (!adminUsers || adminUsers.length === 0) {
      console.log('No admin user found');
      return { success: false, error: 'Invalid credentials' };
    }

    const adminUser = adminUsers[0] as AdminUser;
    console.log('Found admin user:', adminUser.email);
    console.log('Stored hash:', adminUser.password_hash);

    // Verify password
    console.log('Comparing password:', password);
    const isValidPassword = await bcrypt.compare(password, adminUser.password_hash);
    console.log('Password comparison result:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('Password verification failed');
      return { success: false, error: 'Invalid credentials' };
    }

    console.log('Login successful, setting session');
    // Set session
    setAdminSession(adminUser);
    
    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed' };
  }
};

// Admin logout function
export const adminLogout = (): void => {
  localStorage.removeItem('admin_session');
};