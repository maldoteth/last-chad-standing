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

// Function to get tier icon based on XP
const getTierIcon = (xp: number): string => {
  if (xp >= 50000) return '👑'; // God Mode
  if (xp >= 25000) return '💪'; // Giga Chad
  if (xp >= 15000) return '🔥'; // Chad
  if (xp >= 10000) return '⭐'; // Superstar
  if (xp >= 7000) return '🏆'; // Champ
  if (xp >= 4000) return '🥊'; // Pro
  if (xp >= 2000) return '⚔️'; // Fighter
  if (xp >= 1000) return '🏃'; // Athlete
  if (xp >= 500) return '🤝'; // Sparrer
  if (xp >= 100) return '🎯'; // Trainee
  return '👤'; // Recruit
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