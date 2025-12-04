import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
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
      
      // Fetch from Users table using privy_id
      const { data, error } = await supabase
        .from('Users')
        .select('*')
        .eq('privy_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      // Map Users table to UserProfile interface
      if (data) {
        const tierIcon = getTierIcon(Number(data.xp) || 0);
        setProfile({
          id: data.id,
          user_id: data.id,
          username: data.name,
          avatar_url: tierIcon,
          created_at: data.created_at,
          updated_at: data.updated_at
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
      
      // Check if user already exists in Users table
      const { data: existingUser, error: checkError } = await supabase
        .from('Users')
        .select('*')
        .eq('privy_id', user.id)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing user:', checkError);
        throw checkError;
      }

      if (existingUser) {
        console.log('User already exists:', existingUser);
        const tierIcon = getTierIcon(Number(existingUser.xp) || 0);
        const profileWithIcon: UserProfile = {
          id: existingUser.id,
          user_id: existingUser.id,
          username: existingUser.name,
          avatar_url: tierIcon,
          created_at: existingUser.created_at,
          updated_at: existingUser.updated_at
        };
        setProfile(profileWithIcon);
        return profileWithIcon;
      }

      // Create new user in Users table
      const defaultName = `User_${user.id.slice(0, 8)}`;
      const { data: newUser, error: createError } = await supabase
        .from('Users')
        .insert({
          privy_id: user.id,
          name: defaultName,
          coins: 0,
          xp: 0
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        throw createError;
      }

      console.log('User created successfully:', newUser);

      const tierIcon = getTierIcon(0);
      const profileWithIcon: UserProfile = {
        id: newUser.id,
        user_id: newUser.id,
        username: newUser.name,
        avatar_url: tierIcon,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at
      };
      
      setProfile(profileWithIcon);
      
      toast({
        title: "Welcome!",
        description: `Profile ready: ${newUser.name}`,
      });

      return profileWithIcon;
    } catch (error: any) {
      console.error('Error in createProfile function:', error);
      
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

  const updateUsername = async (newUsername: string) => {
    if (!user?.id || !authenticated || !profile) {
      throw new Error('User must be authenticated with profile to update username');
    }

    // Basic validation
    if (!newUsername || newUsername.trim().length < 3 || newUsername.trim().length > 20) {
      throw new Error('Username must be between 3 and 20 characters');
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('Users')
        .update({ name: newUsername.trim() })
        .eq('privy_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating username:', error);
        throw error;
      }

      // Update local profile state
      const tierIcon = getTierIcon(userBalance?.xp || 0);
      const updatedProfile: UserProfile = {
        id: data.id,
        user_id: data.id,
        username: data.name,
        avatar_url: tierIcon,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      setProfile(updatedProfile);
      
      toast({
        title: "Username updated!",
        description: `Your username is now ${newUsername}`,
      });

      return updatedProfile;
    } catch (error: any) {
      console.error('Error in updateUsername function:', error);
      
      const errorMessage = error?.code === '23505' 
        ? "Username already taken. Please try a different one."
        : error?.message || "Unable to update username. Please try again.";
      
      toast({
        title: "Update failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    createProfile,
    fetchProfile,
    updateUsername,
  };
};
