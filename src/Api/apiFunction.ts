/* eslint-disable prettier/prettier */
import { useCallback } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { useProfile } from "@/context/profileContext";

export function useApi() {
  const supabase = useSupabase();
  const { profile } = useProfile();

  const handleObjectiveUser = async () => {
    if (!profile?.id) return { success: false, data: [] };
    return await supabase.getUserObjectives(profile.id);
  };

  const get = useCallback(
    async (endpoint: string, params?: any) => {
      console.log(`useApi.get: ${endpoint}`, params);

      // Handle specific mappings from old API to Supabase
      if (endpoint === "objective/user") {
        return await handleObjectiveUser();
      }

      if (endpoint === "notifications") {
        if (!profile?.id) return { success: false, data: [] };
        return await supabase.getNotifications(profile.id, {
          page: params?.page,
          unread_only: params?.unread_only === 'true'
        });
      }

      if (endpoint.startsWith("locker-item/token")) {
        // Example: locker-item/token?contractId=...&itemId=...&userId=...
        return await supabase.getContractToken(
          params?.contractId,
          params?.itemId,
          params?.userId || profile?.id
        );
      }

      if (endpoint === "ranks") {
        return await supabase.getRanks();
      }

      if (endpoint === "levels") {
        return await supabase.getLevels();
      }

      if (endpoint === "objectives") {
        return await supabase.getObjectives();
      }

      // Fallback or warning for unhandled endpoints
      console.warn(`Unhandled useApi.get endpoint: ${endpoint}`);
      return { success: false, message: "Endpoint not migrated" };
    },
    [supabase, profile]
  );

  const post = useCallback(
    async (endpoint: string, apiData: any) => {
      console.log(`useApi.post: ${endpoint}`, apiData);

      if (endpoint === "payment/checkout-session") {
        return await supabase.supabase.functions.invoke('create-checkout-session', { body: apiData });
      }

      if (endpoint === "payment/crypto") {
        return await supabase.supabase.functions.invoke('verify-preorder-payment', { body: apiData });
      }

      console.warn(`Unhandled useApi.post endpoint: ${endpoint}`);
      return { success: false, message: "Endpoint not migrated" };
    },
    [supabase]
  );

  const put = useCallback(
    async (endpoint: string, apiData: any) => {
      console.log(`useApi.put: ${endpoint}`, apiData);

      if (endpoint.startsWith("locker-item/")) {
        const id = endpoint.split("/")[1];
        return await supabase.updateLockerItem(id, apiData);
      }

      console.warn(`Unhandled useApi.put endpoint: ${endpoint}`);
      return { success: false, message: "Endpoint not migrated" };
    },
    [supabase]
  );

  const deleteData = useCallback(
    async (endpoint: string) => {
      console.log(`useApi.delete: ${endpoint}`);
      return { success: false, message: "Endpoint not migrated" };
    },
    []
  );

  return {
    get,
    post,
    put,
    deleteData,
    header1: { "Content-Type": "application/json" },
    header2: { "Content-Type": "multipart/form-data" },
  };
}
