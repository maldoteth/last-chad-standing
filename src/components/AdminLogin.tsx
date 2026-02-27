'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { usePrivy } from '@privy-io/react-auth';
import { adminLogin } from '@/lib/adminAuth';
import { handleError } from '@/Api/handleError';
import { useSupabase } from '@/hooks/useSupabase';
import { toast } from '@/hooks/use-toast';

export default function AdminLogin() {
  const { login, logout, ready, authenticated, user } = usePrivy();
  const { loginAdmin } = useSupabase();

  const [accessCode, setAccessCode] = useState('');
  const [codeVerified, setCodeVerified] = useState(false);
  const [codeError, setCodeError] = useState('');

  const isVerifying = useRef(false);
  const hasVerified = useRef(false);

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No valid code exists yet — always refuse
    setCodeError('Access denied. Invalid access code.');
    toast({
      title: 'Access Denied',
      description: 'Invalid access code.',
      variant: 'destructive',
    });
  };

  const verifyAdmin = useCallback(async () => {
    if (!ready || !authenticated || !user) return;
    if (isVerifying.current || hasVerified.current) return;

    isVerifying.current = true;

    try {
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
    if (codeVerified && authenticated && !hasVerified.current && !isVerifying.current) {
      verifyAdmin();
    }
  }, [codeVerified, authenticated, verifyAdmin]);

  // Gate: show access code form first
  if (!codeVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Access Code Required</CardTitle>
            <CardDescription>Enter your access code to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCodeSubmit} className="flex flex-col gap-4">
              <Input
                type="password"
                placeholder="Enter access code"
                value={accessCode}
                onChange={(e) => {
                  setAccessCode(e.target.value);
                  setCodeError('');
                }}
                maxLength={64}
              />
              {codeError && (
                <p className="text-destructive text-sm text-center">{codeError}</p>
              )}
              <Button type="submit" className="w-full" disabled={!accessCode.trim()}>
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

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
