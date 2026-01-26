"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { useProfile } from "./profileContext";
import { usePrivy } from "@privy-io/react-auth";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Types
export interface Level {
  id?: string;
  level: number;
  name: string;
  icon?: string | null;
  min_xp: number;
  max_xp?: number | null;
  created_at?: string;
  updated_at?: string;
}

export type ObjectiveType =
  | "packs"
  | "fighters"
  | "invitation"
  | "game"
  | "trade"
  | "sell"
  | "win"
  | "friend";

export type ObjectiveCategory = "daily" | "weekly";

export interface ObjectiveData {
  id: string
  title: string;
  description: string;
  type: ObjectiveType;
  category: ObjectiveCategory;
  targetCount: number;
  rewardXP: number;
  icon: string;
}

export interface ObjectiveProgress {
  id: string
  user_id: string
  objective_id: string
  currentCount: number
  completed: boolean
  startDate: string 
  endDate?: string | null
  lastUpdated: string
  type: ObjectiveType
  category: ObjectiveCategory
  objective?: Objective
}

export interface Objective {
  id: string
  title: string
  description?: string | null
  type: ObjectiveType
  category: ObjectiveCategory
  created_at?: string
  updated_at?: string
}

interface RankContextType {
  rankingData: any[];
  levelsData: Level[];
  objectivesData: ObjectiveData[];
  objectivesUserData: ObjectiveProgress[];
  fetchRanksData: () => Promise<void>;
  isLoading: boolean;
}

const RankContext = createContext<RankContextType | undefined>(undefined);

export const RankProvider = ({ children }: { children: ReactNode }) => {
  const [rankingData, setRankingData] = useState<any[]>([]);
  const [levelsData, setLevelData] = useState<Level[]>([]);
  const [objectivesData, setObjectiveData] = useState<ObjectiveData[]>([]);
  const [objectivesUserData, setObjectiveUserData] = useState<ObjectiveProgress[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { getLevels, getRanks, getObjectives, getUserObjectives } = useSupabase();
  const { user, authenticated } = usePrivy();
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  const fetchLevelsData = async () => {
    try {
      const response = await getLevels();
      if (response.success) {
        setLevelData(response.data);
      }
    } catch (error) {
      console.error("Error fetching levels:", error);
    }
  };

  const fetchRanksData = async () => {
    try {
      const response = await getRanks();
      if (response.success) {
        setRankingData(response.data);
      }
    } catch (error) {
      console.error("Error fetching ranks:", error);
    }
  };

  const fetchObjectiveData = async () => {
    try {
      const response = await getObjectives();
      if (response.success) {
        setObjectiveData(response.data as ObjectiveData[]);
      }
    } catch (error) {
      console.error("Error fetching objectives:", error);
    }
  };

  const isFetchingObjectivesRef = useRef(false);
  const fetchObjectiveUserData = async () => {
    if (isFetchingObjectivesRef.current || !authenticated || !user?.id) return;
    try {
      isFetchingObjectivesRef.current = true;
      const response = await getUserObjectives(user.id);
      if (response.success) {
        setObjectiveUserData(response.data as ObjectiveProgress[]);
      }
    } catch (error: any) {
      console.error("Error fetching user objectives:", error);
    } finally {
      isFetchingObjectivesRef.current = false;
    }
  };

  // 💡 Realtime Subscriptions
  useEffect(() => {
    if (isAdmin) return;

    // 🏆 Rankings Subscription
    const performanceChannel = supabase
      .channel('public:Performances')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Performances' },
        () => {
          console.log('🏆 Rankings updated via Realtime');
          fetchRanksData();
        }
      )
      .subscribe();

    // 🎯 Personal Objectives Subscription
    let objectiveChannel: any;
    if (authenticated && user?.id) {
      objectiveChannel = supabase
        .channel(`objectives-${user.id}`)
        .on(
          'postgres_changes',
          { 
            event: '*', 
            schema: 'public', 
            table: 'ObjectiveProgress',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            console.log('🎯 Objectives updated via Realtime');
            fetchObjectiveUserData();
          }
        )
        .subscribe();
    }

    return () => {
      supabase.removeChannel(performanceChannel);
      if (objectiveChannel) supabase.removeChannel(objectiveChannel);
    };
  }, [isAdmin, authenticated, user?.id]);

  useEffect(() => {
    if (isAdmin) return;
    
    const fetchAllData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchObjectiveData(),
        fetchRanksData(),
        fetchLevelsData(),
      ]);
      setIsLoading(false);
    };

    fetchAllData();
  }, [isAdmin]);

  useEffect(() => {
    if (authenticated) {
      fetchObjectiveUserData();
    }
  }, [authenticated]);

  return (
    <RankContext.Provider
      value={{
        rankingData,
        objectivesUserData,
        levelsData,
        objectivesData,
        fetchRanksData,
        isLoading,
      }}
    >
      {children}
    </RankContext.Provider>
  );
};

export const useRank = () => {
  const context = useContext(RankContext);
  if (!context) {
    throw new Error("useRank must be used within a RankProvider");
  }
  return context;
};
