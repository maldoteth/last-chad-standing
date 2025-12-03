"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { usePrivy, useSessionSigners } from "@privy-io/react-auth";
import { useApi } from "@/Api/apiFunction";
import { adminLogin } from "@/lib/adminAuth";
import { toast } from "@/hooks/use-toast";
import { handleError } from "@/Api/handleError";
import { useProfile } from "@/context/profileContext";


const SessionSigners = ({ quorumId, isSigner, isAdmin = false }: { quorumId: string, isSigner: boolean, isAdmin?: boolean }) => {
  const { user } = usePrivy()
  const { updateUsername } = useProfile()
  const { addSessionSigners, } = useSessionSigners();
  const { put } = useApi()
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
  const handleAddSessionSigners = useCallback(async () => {
    if (!user?.wallet?.address) {
      return;
    }
    if (isSigner) {
      return;
    }
    try {
      const sessionSigner = await addSessionSigners({
        address: user.wallet.address,
        signers: [
          {
            signerId: quorumId,
            policyIds: [],
          },
        ],
      });
      if (sessionSigner.user) {
        if (isAdmin) {
          handleUpadateAdmin()
        } else {
          await updateUsername({
            isSigner: true,
          })
        }
      }
    } catch (error) {
      console.log(error)
    }
  }, [quorumId, user?.wallet?.address, isSigner]);
  useEffect(() => {
    handleAddSessionSigners()
  }, [isSigner]);

  return <></>;
};

export default SessionSigners;