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
    // Fetch admin user from database
    const { data: adminUsers, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .limit(1);

    if (error) {
      console.error('Database error:', error);
      return { success: false, error: 'Database error occurred' };
    }

    if (!adminUsers || adminUsers.length === 0) {
      return { success: false, error: 'Invalid credentials' };
    }

    const adminUser = adminUsers[0] as AdminUser;

    // Verify password
    const isValidPassword = await bcrypt.compare(password, adminUser.password_hash);
    
    if (!isValidPassword) {
      return { success: false, error: 'Invalid credentials' };
    }

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