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
  if (xp >= 10000) return '👑'; // King Chad (Level 10+)
  if (xp >= 9000) return '💪'; // Giga Chad (Level 9)
  if (xp >= 8000) return '👊'; // Chad (Level 8)
  if (xp >= 7000) return '⭐'; // Superstar (Level 7)
  if (xp >= 6000) return '🏆'; // Champ (Level 6)
  if (xp >= 5000) return '🥊'; // Pro (Level 5)
  if (xp >= 4000) return '⚔️'; // Fighter (Level 4)
  if (xp >= 3000) return '🏃'; // Athlete (Level 3)
  if (xp >= 2000) return '✊'; // Sparrer (Level 2)
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
      console.error('createProfile: User not authenticated', { userId: user?.id, authenticated });
      throw new Error('User must be authenticated to create profile');
    }

    try {
      setLoading(true);
      console.log('Creating profile for user:', user.id);
      
      // Check if profile already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing profile:', checkError);
        throw checkError;
      }

      if (existingProfile) {
        console.log('Profile already exists:', existingProfile);
        const tierIcon = getTierIcon(userBalance?.xp || 0);
        const profileWithIcon = {
          ...existingProfile,
          avatar_url: tierIcon
        };
        setProfile(profileWithIcon);
        return profileWithIcon;
      }

      // Use upsert logic to handle potential duplicate keys
      console.log('Creating new profile and balance for user:', user.id);

      // First, upsert user balance (handle duplicates gracefully)
      const { data: balanceData, error: balanceError } = await supabase
        .from('user_balances')
        .upsert({
          user_id: user.id,
          coins: 1000,
          xp: 0
        }, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (balanceError) {
        console.error('Error upserting user balance:', balanceError);
        throw balanceError;
      }

      console.log('User balance upserted:', balanceData);

      // Then create profile - trigger will auto-generate username
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
        }, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (profileError) {
        console.error('Error upserting profile:', profileError);
        throw profileError;
      }

      if (!profileData) {
        console.error('No profile data returned from upsert');
        throw new Error('No profile data returned from upsert');
      }

      console.log('Profile upserted successfully:', profileData);

      // Add tier icon as avatar_url
      const tierIcon = getTierIcon(balanceData.xp);
      const profileWithIcon = {
        ...profileData,
        avatar_url: tierIcon
      };
      
      setProfile(profileWithIcon);
      
      toast({
        title: "Welcome!",
        description: `Profile ready: ${profileData.username}`,
      });

      return profileWithIcon;
    } catch (error: any) {
      console.error('Error in createProfile function:', error);
      
      // Handle specific database constraint errors
      const errorMessage = error?.code === '23505' 
        ? "Profile already exists. Please try logging in again."
        : "Unable to create your profile. Please try again.";
      
      toast({
        title: "Profile creation failed",
        description: errorMessage,
        variant: "destructive",
      });
      
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