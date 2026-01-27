'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePrivy } from '@privy-io/react-auth';
import { adminLogin } from '@/lib/adminAuth';
import { handleError } from '@/Api/handleError';
import { useSupabase } from '@/hooks/useSupabase';

export default function AdminLogin() {
  const { login, logout, ready, authenticated, user } = usePrivy();
  const { loginAdmin } = useSupabase();

  const isVerifying = useRef(false);
  const hasVerified = useRef(false);

  const verifyAdmin = useCallback(async () => {
    // Prevent duplicate calls
    if (!ready || !authenticated || !user) return;
    if (isVerifying.current || hasVerified.current) return;

    isVerifying.current = true;

    try {
      // Clear old tokens to ensure a clean login
      localStorage.removeItem('token');
      localStorage.removeItem('admin_token');
      
      const payload = {
        walletAddress: user.wallet?.address,
        email: user.email?.address,
        privy_id: user?.id,
      };

      const result = await loginAdmin(payload);

      if (result.success) {
        await adminLogin({ ...result.admin, token: result.token });
        hasVerified.current = true;
        window.location.replace('/admin');
      }
    } catch (err) {
      handleError(err);
    } finally {
      isVerifying.current = false;
    }
  }, [ready, authenticated, user, loginAdmin]);

  useEffect(() => {
    if (authenticated && !hasVerified.current && !isVerifying.current) {
      verifyAdmin();
    }
  }, [authenticated, verifyAdmin]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Sign in with Privy to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {!ready ? (
            <p className="text-white">Loading Privy...</p>
          ) : authenticated ? (
            <Button onClick={logout} variant="destructive" className="w-full">
              Logout
            </Button>
          ) : (
            <Button onClick={login} className="w-full">
              Sign in Admin
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
