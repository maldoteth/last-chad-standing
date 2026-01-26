'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { usePrivy } from '@privy-io/react-auth';
import { adminLogin } from '@/lib/adminAuth';
import { useApi } from '@/Api/apiFunction';
import { handleError } from '@/Api/handleError';
import { isAdminAuthenticated, adminLogout, getAdminSession } from '@/lib/adminAuth';

export default function AdminLogin() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { post } = useApi();
  const { login, logout, ready, authenticated, user } = usePrivy();
  const [adminSession, setAdminSession] = useState<any>(null);

  const isVerifying = useRef(false);
  const hasVerified = useRef(false);

  const verifyAdmin = useCallback(async () => {
    // Prevent duplicate calls
    if (!ready || !authenticated || !user) return;
    if (isVerifying.current || hasVerified.current) return;

    isVerifying.current = true;

    try {
      const payload = {
        walletAddress: user.wallet?.address,
        email: user.email?.address,
        privy_id: user?.id,
      };

      const result = await post("admin/login", payload);

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
  }, [authenticated]);

  useEffect(() => {
    verifyAdmin();
  }, [authenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Sign in with Privy to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {!ready ? (
            <p>Loading Privy...</p>
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
