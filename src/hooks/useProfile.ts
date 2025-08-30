import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { getCurrentLevel } from '@/lib/progressSystem';
import { useStore } from '@/hooks/useStore';

interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Function to get tier icon based on XP (aligned with 1k-per-level system)
const getTierIcon = (xp: number): string => {
  if (xp >= 10000) return '👑'; // God Mode (Level 10+)
  if (xp >= 9000) return '💪'; // Giga Chad (Level 9)
  if (xp >= 8000) return '🔥'; // Chad (Level 8)
  if (xp >= 7000) return '⭐'; // Superstar (Level 7)
  if (xp >= 6000) return '🏆'; // Champ (Level 6)
  if (xp >= 5000) return '🥊'; // Pro (Level 5)
  if (xp >= 4000) return '⚔️'; // Fighter (Level 4)
  if (xp >= 3000) return '🏃'; // Athlete (Level 3)
  if (xp >= 2000) return '🤝'; // Sparrer (Level 2)
  if (xp >= 1000) return '🎯'; // Trainee (Level 1)
  return '👤'; // Recruit (Level 0)
};

export const useProfile = () => {
  const { user, authenticated } = usePrivy();
  const { userBalance } = useStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    if (!user?.id || !authenticated) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      // Add tier icon as avatar_url based on current XP
      if (data) {
        const tierIcon = getTierIcon(userBalance?.xp || 0);
        setProfile({
          ...data,
          avatar_url: tierIcon
        });
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    if (!user?.id || !authenticated) {
      throw new Error('User must be authenticated to create profile');
    }

    try {
      setLoading(true);
      
      // The database will automatically generate a username via trigger
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        throw error;
      }

      // Add tier icon as avatar_url
      const tierIcon = getTierIcon(userBalance?.xp || 0);
      const profileWithIcon = {
        ...data,
        avatar_url: tierIcon
      };
      
      setProfile(profileWithIcon);
      
      toast({
        title: "Profile created!",
        description: `Welcome ${data.username}!`,
      });

      return profileWithIcon;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update XP and refresh tier icon when user balance changes
  useEffect(() => {
    if (profile && userBalance) {
      const newTierIcon = getTierIcon(userBalance.xp);
      if (newTierIcon !== profile.avatar_url) {
        setProfile(prev => prev ? {
          ...prev,
          avatar_url: newTierIcon
        } : null);
      }
    }
  }, [userBalance?.xp, profile?.id]);

  useEffect(() => {
    if (authenticated && user?.id) {
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [user?.id, authenticated]);

  return {
    profile,
    loading,
    createProfile,
    fetchProfile,
    // Removed functions: updateProfile, uploadAvatar
  };
};