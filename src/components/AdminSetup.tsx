import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const AdminSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const setupAdminPassword = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('hash-admin-password');
      
      if (error) {
        throw error;
      }

      toast({
        title: "Admin setup complete",
        description: "Password hash has been updated successfully",
      });
      
      console.log('Admin password setup result:', data);
    } catch (error) {
      console.error('Admin setup error:', error);
      toast({
        title: "Setup failed",
        description: "Failed to update admin password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader className="text-center">
        <CardTitle>Admin Setup</CardTitle>
        <CardDescription>
          Initialize admin password hash
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button onClick={setupAdminPassword} disabled={isLoading}>
          {isLoading ? 'Setting up...' : 'Setup Admin Password'}
        </Button>
        <p className="text-sm text-muted-foreground mt-4">
          This will set the admin password to: <code>admin42069</code>
        </p>
      </CardContent>
    </Card>
  );
};