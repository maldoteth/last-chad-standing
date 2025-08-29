import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useProfile } from "./useProfile";
import { useStore } from "./useStore";

export const useGame = () => {
  const { authenticated } = usePrivy();
  const { profile } = useProfile();
  const { userBalance } = useStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (authenticated && profile && userBalance !== null) {
      setReady(true);
    } else {
      setReady(false);
    }
  }, [authenticated, profile, userBalance]);

  // For now, use a default XP value since it's not in the profile yet
  const xp = 0; // TODO: Add XP to user profile
  const level = Math.floor(xp / 100) + 1;
  const currency = typeof userBalance === 'number' ? userBalance : 0;

  return {
    ready,
    currency,
    xp,
    level,
  };
};