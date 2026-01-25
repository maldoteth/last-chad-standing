"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { usePrivy, useSessionSigners } from "@privy-io/react-auth";
import { useApi } from "@/Api/apiFunction";
import { adminLogin } from "@/lib/adminAuth";
import { toast } from "@/hooks/use-toast";
import { handleError } from "@/Api/handleError";
import { useProfile } from "@/context/profileContext";


const SessionSigners = ({ quorumId, isSigner, isAdmin = false }: { quorumId: string, isSigner: boolean, isAdmin?: boolean }) => {
  const { user, ready } = usePrivy()
  const { updateUsername } = useProfile()
  const { addSessionSigners, } = useSessionSigners();
  const { put, post } = useApi()
  const [isAdded, setIsAdded] = useState(false);
  const handleUpadateAdmin = async () => {
    try {
      const payload = {
        isSigner: true
      };

      const result = await put("admin", payload);

      if (result.success) {
        adminLogin({ ...result?.admin, token: result?.token });

        toast({
          title: "Login successful",
          description: "Welcome to the admin panel",
        });

      } else {
        toast({
          title: "Access denied",
          description: "You are not authorized as an admin",
          variant: "destructive",
        });
      }
    } catch (error) {
      handleError(error);
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
      if (isAdmin && !quorumId) {
        const payload = {
          walletAddress: user.wallet?.address,
          email: user.email?.address,
          privy_id: user?.id,
        };

        const result = await post("admin/login", payload);
        if (result.success) {
          signerId=result?.admin?.quorumId
          await adminLogin({ ...result.admin, token: result.token });
        }
      }
      
      if (!signerId) {
         isAddingRef.current = false;
         return;
      }

      const sessionSigner = await addSessionSigners({
        address: user.wallet.address,
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
          handleUpadateAdmin()
        } else {
          await updateUsername({
            isSigner: true,
          })
        }
      }
    } catch (error: any) {
      console.error(error)
      // If duplicate signer error, mark as added to stop retrying
      if (error?.message?.includes('Duplicate signer')) {
        setIsAdded(true);
      }
    } finally {
      isAddingRef.current = false;
    }
  }, [ready, quorumId, user?.wallet?.address, isSigner, isAdded, isAdmin]);

  useEffect(() => {
    if (ready && user?.wallet?.address && !isAdded && !isSigner) {
      // Increased delay and added a check for the embedded wallet
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