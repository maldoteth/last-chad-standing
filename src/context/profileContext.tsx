import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useSupabase } from "@/hooks/useSupabase";
import { generateUniqueWeb3Name } from "@/lib/utils";
import { handleError } from "@/Api/handleError";
import { useSearchParams } from "react-router-dom";
import { useSocketEmit, useSocketEvent } from "./SocketContext";

// ---------------- Types ----------------
export interface Performance {
    id: string;
    user_id: string;
    total_XP: number;
    level: number;
    level_id: string;
    ranking: string;
    created_at?: string;
    updated_at?: string;
}

export interface UserProfile {
    id: string;
    name: string;
    email?: string;
    avatar_url?: string;
    xp?: number;
    coins?: number;
    created_at: string;
    updated_at?: string;
    ref_by?: string;
    ref_code?: string;
    profileImage?: string;
    isSigner?: boolean;
    quorumId?: string;
    performance?: Performance | null; // single object (or null if missing)
}

interface ProfileContextValue {
    profile: UserProfile | null;
    loading: boolean;
    createProfile: () => Promise<void>;
    updateUsername: (data: { name?: string, profileImage?: string, isSigner?: boolean }) => Promise<void>;
    fetchProfile: () => void;
    refreshAvatar: () => void;
}

// ---------------- Tier Logic ----------------

const getTierIcon = (xp: number): string => {
    if (xp >= 10000) return "👑"; // King Chad
    if (xp >= 9000) return "💪"; // Giga Chad
    if (xp >= 8000) return "👊"; // Chad
    if (xp >= 7000) return "⭐"; // Superstar
    if (xp >= 6000) return "🏆"; // Champ
    if (xp >= 5000) return "🥊"; // Pro
    if (xp >= 4000) return "⚔️"; // Fighter
    if (xp >= 3000) return "🏃"; // Athlete
    if (xp >= 2000) return "✊"; // Sparrer
    if (xp >= 1000) return "🎯"; // Trainee
    return "👤"; // Recruit
};

// ---------------- Context Setup ----------------

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
    const { user, authenticated, logout, } = usePrivy();
    const { getUserProfile, loginOrCreateUser, updateUser } = useSupabase();
    // const [searchParams] = useSearchParams()
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);
    // const referred_by = searchParams?.get('ref') || ''
    const fetchProfile = async () => {
        if (!authenticated || !user?.id) return;

        try {
            setLoading(true);
            const response = await getUserProfile(user.id);
            if (response.success && response.data) {
                const tierIcon = getTierIcon(response.data?.xp || 0);
                setProfile({ ...response.data, avatar_url: tierIcon });
            }
        } catch (error) {
            console.error("❌ Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const createProfile = async () => {
        if (!authenticated || !user?.id) {
            console.warn("Cannot create profile: user not authenticated");
            return;
        }
        const referred_by = sessionStorage.getItem('referred_by')
        try {
            setLoading(true);
            const body = user?.email
                ? { name: generateUniqueWeb3Name(), email: user.email?.address, privy_id: user.id, referred_by }
                : { name: generateUniqueWeb3Name(), wallet_address: user?.wallet?.address, privy_id: user.id, referred_by };

            const res = await loginOrCreateUser(body);
            if (res.success && res.user) {
                if (res.token) {
                    localStorage.setItem('token', res.token);
                }
                const tierIcon = getTierIcon(res.user?.xp || 0);
                setProfile({ ...res.user, avatar_url: tierIcon });
            }
        } catch (error) {
            console.error("❌ Error creating profile:", error);
            await logout()
            handleError(error)
        } finally {
            setLoading(false);
        }
    };

    const updateUsername = async (data: { name?: string, profileImage?: string, isSigner?: boolean }) => {
        if (!profile?.id) return;
        try {
            setLoading(true);
            const res = await updateUser(profile.id, data);
            if (res.success && res.data) {
                const tierIcon = getTierIcon(res.data?.xp || 0);
                setProfile({ ...res.data, avatar_url: tierIcon });
            }
        } catch (error) {
            console.error("❌ Error updating username:", error);
            handleError(error)
        } finally {
            setLoading(false);
        }
    };

    const refreshAvatar = () => {
        if (!profile) return;
        const newIcon = getTierIcon(profile.xp || 0);
        setProfile(prev => (prev ? { ...prev, avatar_url: newIcon } : null));
    };
    useEffect(() => {
        if (authenticated && user?.id && !profile && !loading) {
            createProfile();
        }
    }, [authenticated, user?.id, profile, loading]);

    useSocketEvent('update:user', (user: UserProfile) => {
        if (!user) return;
        const newIcon = getTierIcon(user.xp || 0);
        const data = { ...user, avatar_url: newIcon }
        setProfile(data);
    })

    return (
        <ProfileContext.Provider
            value={{
                profile,
                loading,
                createProfile,
                updateUsername,
                refreshAvatar,
                fetchProfile
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
};

// ---------------- Hook ----------------

export const useProfile = (): ProfileContextValue => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error("useProfile must be used within a ProfileProvider");
    }
    return context;
};
