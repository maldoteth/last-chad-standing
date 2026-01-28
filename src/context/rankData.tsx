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
import { useToast } from "@/hooks/use-toast";
import { Trophy, Star, Target } from "lucide-react";

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
  fetchObjectiveUserData: () => Promise<void>;
  isLoading: boolean;
}

const RankContext = createContext<RankContextType | undefined>(undefined);

export const RankProvider = ({ children }: { children: ReactNode }) => {
  const [rankingData, setRankingData] = useState<any[]>([]);
  const [levelsData, setLevelData] = useState<Level[]>([]);
  const [objectivesData, setObjectiveData] = useState<ObjectiveData[]>([]);
  const [objectivesUserData, setObjectiveUserData] = useState<ObjectiveProgress[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const { getLevels, getRanks, getObjectives, getUserObjectives } = useSupabase();
  const { authenticated } = usePrivy();
  const { profile } = useProfile();
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
    // CRITICAL: Must use profile.id (Supabase UUID)
    if (isFetchingObjectivesRef.current || !authenticated || !profile?.id) return;
    try {
      isFetchingObjectivesRef.current = true;
      const response = await getUserObjectives(profile.id);
      if (response.success) {
        setObjectiveUserData(response.data as ObjectiveProgress[]);
      }
    } catch (error: any) {
      console.error("Error fetching user objectives:", error);
    } finally {
      isFetchingObjectivesRef.current = false;
    }
  };

  // 🧠 Keep tracks of latest data for use in Realtime callbacks
  const objectivesDataRef = useRef<ObjectiveData[]>([]);
  const lastKnownXPRef = useRef<number>(profile?.xp || 0);

  useEffect(() => {
    objectivesDataRef.current = objectivesData;
  }, [objectivesData]);

  useEffect(() => {
    if (profile?.xp !== undefined) {
      lastKnownXPRef.current = profile.xp;
    }
  }, [profile?.xp]);

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
    if (authenticated && profile?.id) {
      objectiveChannel = supabase
        .channel(`objectives-${profile.id}`)
        .on(
          'postgres_changes',
          { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'ObjectiveProgress',
            filter: `user_id=eq.${profile.id}`
          },
          (payload: any) => {
            console.log('🎯 Objectives updated via Realtime', payload);
            
            // Check if objective was just completed
            const oldData = payload.old;
            const newData = payload.new;
            
            if (newData.completed && !oldData.completed) {
              const objective = objectivesDataRef.current.find(obj => obj.id === newData.objective_id);
              toast({
                title: "Objective Completed! 🎉",
                description: `You've completed: ${objective?.title || 'An objective'}!`,
                duration: 5000,
                // @ts-ignore - custom icon support in toast
                icon: <Trophy className="w-5 h-5 text-yellow-500" />
              });
            } else if (newData.currentCount > oldData.currentCount) {
               // Optional: Show subtle progress toast
            }
            
            fetchObjectiveUserData();
          }
        )
        .subscribe();
    }

    // ✨ XP & Coins Realtime (Users table)
    let userChannel: any;
    if (authenticated && profile?.id) {
        userChannel = supabase
          .channel(`user-stats-${profile.id}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'Users',
              filter: `id=eq.${profile.id}`
            },
            (payload: any) => {
              const oldXP = lastKnownXPRef.current;
              const newXP = payload.new?.xp || 0;
              
              if (newXP > oldXP) {
                toast({
                  title: "XP Gained! ✨",
                  description: `You earned +${newXP - oldXP} XP! Keep it up.`,
                  duration: 3000,
                  // @ts-ignore - custom icon support in toast
                  icon: <Star className="w-5 h-5 text-blue-400 fill-blue-400" />
                });
              }
              lastKnownXPRef.current = newXP;
            }
          )
          .subscribe();
    }

    return () => {
      supabase.removeChannel(performanceChannel);
      if (objectiveChannel) supabase.removeChannel(objectiveChannel);
      if (userChannel) supabase.removeChannel(userChannel);
    };
  }, [isAdmin, authenticated, profile?.id]);

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
    if (authenticated && profile?.id) {
      fetchObjectiveUserData();
    }
  }, [authenticated, profile?.id]);

  return (
    <RankContext.Provider
      value={{
        rankingData,
        objectivesUserData,
        levelsData,
        objectivesData,
        fetchRanksData,
        fetchObjectiveUserData,
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
