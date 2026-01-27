"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePrivy, useSessionSigners } from "@privy-io/react-auth";
import { adminLogin } from "@/lib/adminAuth";
import { toast } from "@/hooks/use-toast";
import { useProfile } from "@/context/profileContext";
import { supabase } from "@/integrations/supabase/client";


const SessionSigners = ({ quorumId, isSigner, isAdmin = false }: { quorumId: string, isSigner: boolean, isAdmin?: boolean }) => {
  const { user, ready } = usePrivy()
  const { updateUsername } = useProfile()
  const { addSessionSigners, } = useSessionSigners();
  const [isAdded, setIsAdded] = useState(false);

  const handleUpdateAdmin = async () => {
    try {
      // For Admin, we update the AdminUsers table
      const { data, error } = await supabase
        .from('AdminUsers')
        .update({ isSigner: true })
        .eq('privy_id', user?.id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        // Sync local session
        const currentSession = JSON.parse(localStorage.getItem('admin_session') || '{}');
        adminLogin({ ...currentSession, isSigner: true });

        toast({
          title: "Session Authorized",
          description: "Signer registered successfully",
        });
      }
    } catch (error: any) {
        console.error("Error updating admin signer status:", error);
    }
  }

  const isAddingRef = useRef(false);
  const handleAddSessionSigners = useCallback(async () => {
    if (!ready || !user?.wallet?.address || isAdded || isSigner) {
      return;
    }
    
    if (isAddingRef.current) return;
    isAddingRef.current = true;

    try {
      let signerId = quorumId
      
      // If Admin and no quorumId, try to re-auth/get quorumId via Edge Function
      if (isAdmin && !quorumId) {
        const payload = {
          walletAddress: user.wallet?.address,
          email: user.email?.address,
          privy_id: user?.id,
        };

        const { data: result, error } = await supabase.functions.invoke('admin-login', {
            body: payload
        });

        if (!error && result.success) {
          signerId = result?.admin?.quorumId;
          await adminLogin({ ...result.admin, token: result.token });
        }
      }
      
      if (!signerId) {
         isAddingRef.current = false;
         return;
      }

      const sessionSigner = await addSessionSigners({
        address: user.wallet.address as `0x${string}`,
        signers: [
          {
            signerId: signerId,
            policyIds: [],
          },
        ],
      });

      if (sessionSigner.user) {
        setIsAdded(true);
        if (isAdmin) {
          handleUpdateAdmin()
        } else {
          await updateUsername({
            isSigner: true,
          })
        }
      }
    } catch (error: any) {
      console.error("❌ Add Session Signer Error:", error)
      if (error?.message?.includes('Duplicate signer')) {
        setIsAdded(true);
      }
    } finally {
      isAddingRef.current = false;
    }
  }, [ready, quorumId, user?.wallet?.address, isSigner, isAdded, isAdmin, user?.id, addSessionSigners, updateUsername]);

  useEffect(() => {
    if (ready && user?.wallet?.address && !isAdded && !isSigner) {
      const timer = setTimeout(() => {
        if (ready && user?.wallet?.address) {
          handleAddSessionSigners();
        }
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [ready, user?.wallet?.address, isAdded, isSigner, handleAddSessionSigners]);

  return <></>;
};

export default SessionSigners;
