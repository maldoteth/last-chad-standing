
interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  token: string;
  quorumId?: string;
  isSigner?: boolean;
}

interface LoginResult {
  success: boolean;
  error?: string;
}

// Store admin session in localStorage
const setAdminSession = (adminUser: AdminUser): void => {
  const sessionData = {
    id: adminUser.id,
    email: adminUser.email,
    token: adminUser?.token,
    quorumId: adminUser?.quorumId,
    isSigner: adminUser?.isSigner,
    loginTime: Date.now(),
  };
  localStorage.setItem('admin_session', JSON.stringify(sessionData));
  localStorage.setItem('token', adminUser?.token);
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
export const adminLogin = async (adminUser: any): Promise<LoginResult> => {
  try {
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