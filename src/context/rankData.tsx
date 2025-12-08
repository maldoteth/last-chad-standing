"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useApi } from "@/Api/apiFunction";
import { useSocketEvent } from "./SocketContext";
import { useProfile } from "./profileContext";
import { usePrivy } from "@privy-io/react-auth";
import { useLocation } from "react-router-dom";

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
  startDate: string // ISO 8601 date string from Supabase (e.g., "2025-10-15T12:00:00Z")
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

// Context type
interface RankContextType {
  rankingData: any[];
  levelsData: Level[];
  objectivesData: ObjectiveData[];
  objectivesUserData: ObjectiveProgress[];
  fetchRanksData: () => Promise<void>;
  isLoading: boolean;
}

// Create context
const RankContext = createContext<RankContextType | undefined>(undefined);

// Provider component
export const RankProvider = ({ children }: { children: ReactNode }) => {
  const [rankingData, setRankingData] = useState<any[]>([]);
  const [levelsData, setLevelData] = useState<Level[]>([]);
  const [objectivesData, setObjectiveData] = useState<ObjectiveData[]>([]);
  const [objectivesUserData, setObjectiveUserData] = useState<ObjectiveProgress[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { get } = useApi();
  const { user, authenticated } = usePrivy();
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  useSocketEvent("update:ranking", (data) => {
    if (!data) return;

    setRankingData((prevData) => {
      const newEntries = Array.isArray(data) ? data : [data];
      const updated = [...prevData];

      newEntries.forEach((entry) => {
        const entryId = entry.id;
        const existingIndex = updated.findIndex((item) => item.id === entryId);
        if (existingIndex !== -1) {
          updated[existingIndex] = { ...updated[existingIndex], ...entry };
        } else {
          updated.push(entry);
        }
      });

      const sorted = [...updated].sort(
        (a, b) => Number(b.total_XP) - Number(a.total_XP)
      );

      const ranked = sorted.map((item, index) => ({
        ...item,
        rank: index + 1,
      }));

      return ranked;
    });
  });

  const fetchLevelsData = async () => {
    try {
      const response = await get("level");
      setLevelData(response?.data);
    } catch (error) {
      console.error("Error fetching levels:", error);
    }
  };

  const fetchRanksData = async () => {
    try {
      const response = await get("ranks");
      setRankingData(response?.data);
    } catch (error) {
      console.error("Error fetching ranks:", error);
    }
  };

  const fetchObjectiveData = async () => {
    try {
      const response = await get("objective");
      setObjectiveData(response?.data as ObjectiveData[]);
    } catch (error) {
      console.error("Error fetching objectives:", error);
    }
  };
  const fetchObjectiveUserData = async () => {
    try {
      const response = await get("objective/user");
      setObjectiveUserData(response?.data as ObjectiveProgress[]);
    } catch (error) {
      console.error("Error fetching objectives:", error);
    }
  };


  useSocketEvent("update:objectiveProgress", (data) => { fetchObjectiveUserData() })
  useEffect(() => {
    if (isAdmin) {
      return
    }
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
  }, []);
  useEffect(() => {
    if (authenticated) {
      const fetchAllData = async () => {
        setIsLoading(true);
        await fetchObjectiveUserData()
        setIsLoading(false);
      };

      fetchAllData();
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

// Hook for consuming context
export const useRank = () => {
  const context = useContext(RankContext);
  if (!context) {
    throw new Error("useRank must be used within a RankProvider");
  }
  return context;
};
