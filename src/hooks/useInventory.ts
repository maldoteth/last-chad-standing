import { useState, useEffect } from "react";
import { useStore } from "./useStore";

export const useInventory = () => {
  const { userInventory, loading: storeLoading } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(storeLoading);
  }, [storeLoading]);

  return {
    inventory: userInventory,
    loading,
  };
};