/* eslint-disable prettier/prettier */
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useToast } from './use-toast';

type Tables = Database['public']['Tables'];
type StoreItem = Tables['store_items']['Row'];
type LockerItem = Tables['Locker']['Row'];
type User = Tables['Users']['Row'];
type Notification = Tables['Notification']['Row'];
type Level = Tables['Level']['Row'];
type Objective = Tables['Objective']['Row'];
type ObjectiveProgress = Tables['ObjectiveProgress']['Row'];

export function useSupabase() {
    const { toast } = useToast();

    // ==================== STORE ITEMS ====================

    const getStoreItems = async (page: number = 1, pageSize: number = 10) => {
        try {
            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1;

            const { data, error, count } = await supabase
                .from('store_items')
                .select('*', { count: 'exact' })
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) throw error;

            return {
                success: true,
                items: data as StoreItem[],
                pagination: {
                    total: count || 0,
                    totalPages: Math.ceil((count || 0) / pageSize),
                    currentPage: page,
                    pageSize,
                },
            };
        } catch (error: any) {
            console.error('Error fetching store items:', error);
            return {
                success: false,
                items: [],
                pagination: { total: 0, totalPages: 0, currentPage: page, pageSize },
                error: error.message,
            };
        }
    };

    const createStoreItem = async (item: Tables['store_items']['Insert']) => {
        try {
            const { data, error } = await supabase
                .from('store_items')
                .insert(item)
                .select()
                .single();

            if (error) throw error;

            return { success: true, data };
        } catch (error: any) {
            console.error('Error creating store item:', error);
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
            return { success: false, error: error.message };
        }
    };

    const updateStoreItem = async (id: string, updates: Tables['store_items']['Update']) => {
        try {
            const { data, error } = await supabase
                .from('store_items')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            return { success: true, data };
        } catch (error: any) {
            console.error('Error updating store item:', error);
            return { success: false, error: error.message };
        }
    };

    const deleteStoreItem = async (id: string) => {
        try {
            const { error } = await supabase
                .from('store_items')
                .delete()
                .eq('id', id);

            if (error) throw error;

            return { success: true };
        } catch (error: any) {
            console.error('Error deleting store item:', error);
            return { success: false, error: error.message };
        }
    };

    // ==================== LOCKER ITEMS ====================

    const getLockerItems = async (userId: string, page: number = 1, pageSize: number = 10) => {
        try {
            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1;

            const { data, error, count } = await supabase
                .from('Locker')
                .select(`
          *,
          item:store_items(*)
        `, { count: 'exact' })
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) throw error;

            return {
                success: true,
                items: data,
                pagination: {
                    total: count || 0,
                    totalPages: Math.ceil((count || 0) / pageSize),
                    currentPage: page,
                    pageSize,
                },
            };
        } catch (error: any) {
            console.error('Error fetching locker items:', error);
            return {
                success: false,
                items: [],
                pagination: { total: 0, totalPages: 0, currentPage: page, pageSize },
                error: error.message,
            };
        }
    };

    const updateLockerItem = async (id: string, updates: Tables['Locker']['Update']) => {
        try {
            const { data, error } = await supabase.functions.invoke('update-locker', {
                body: { id, updates }
            });

            if (error) throw error;

            return data;
        } catch (error: any) {
            console.error('Error updating locker item:', error);
            return { success: false, error: error.message };
        }
    };

    // ==================== USER MANAGEMENT ====================

    const getUserProfile = async (privyId: string) => {
        try {
            const { data, error } = await supabase
                .from('Users')
                .select('*')
                .eq('privy_id', privyId)
                .single();

            if (error) throw error;

            return { success: true, data };
        } catch (error: any) {
            console.error('Error fetching user profile:', error);
            return { success: false, error: error.message };
        }
    };

    const createUser = async (user: Tables['Users']['Insert']) => {
        try {
            const { data, error } = await supabase
                .from('Users')
                .insert(user)
                .select()
                .single();

            if (error) throw error;

            return { success: true, data };
        } catch (error: any) {
            console.error('Error creating user:', error);
            return { success: false, error: error.message };
        }
    };

    const updateUser = async (id: string, updates: Tables['Users']['Update']) => {
        try {
            const { data, error } = await supabase
                .from('Users')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            return { success: true, data };
        } catch (error: any) {
            console.error('Error updating user:', error);
            return { success: false, error: error.message };
        }
    };

    const loginOrCreateUser = async (userData: {
        name: string;
        email?: string;
        wallet_address?: string;
        privy_id: string;
        referred_by?: string | null;
    }) => {
        try {
            // 1. Check if user exists
            const { data: existingUser } = await supabase
                .from('Users')
                .select('*')
                .eq('privy_id', userData.privy_id)
                .single();

            if (existingUser) {
                // User exists, return it
                return {
                    success: true,
                    user: existingUser,
                    token: 'supabase-session' // Placeholder for compatibility
                };
            }

            // 2. Create new user
            const { data: newUser, error } = await supabase
                .from('Users')
                .insert({
                    name: userData.name,
                    email: userData.email,
                    wallet_address: userData.wallet_address,
                    privy_id: userData.privy_id,
                    ref_by_code: userData.referred_by,
                    coins: 1000, // Starting coins
                    xp: 0,
                })
                .select()
                .single();

            if (error) throw error;

            // 3. Create performance record
            await supabase
                .from('Performances')
                .insert({
                    user_id: newUser.id,
                    total_XP: 0,
                    level: 1,
                });

            return {
                success: true,
                user: newUser,
                token: 'supabase-session'
            };
        } catch (error: any) {
            console.error('Error logging in/creating user:', error);
            return {
                success: false,
                error: error.message,
                user: null,
                token: null
            };
        }
    };

    const getRanks = async (limit: number = 50) => {
        try {
            const { data, error } = await supabase
                .from('Users')
                .select(`
                    id,
                    name,
                    profileImage,
                    xp,
                    coins,
                    performance:Performances(total_XP, level, ranking)
                `)
                .order('xp', { ascending: false })
                .limit(limit);

            if (error) throw error;

            return {
                success: true,
                data: data.map((user, index) => ({
                    ...user,
                    rank: index + 1,
                    total_XP: user.xp || 0
                }))
            };
        } catch (error: any) {
            console.error('Error fetching ranks:', error);
            return { success: false, data: [], error: error.message };
        }
    };

    // ==================== GAME DATA ====================

    const getLevels = async () => {
        try {
            const { data, error } = await supabase
                .from('Level')
                .select('*')
                .order('level', { ascending: true });

            if (error) throw error;

            return { success: true, data };
        } catch (error: any) {
            console.error('Error fetching levels:', error);
            return { success: false, data: [], error: error.message };
        }
    };

    const getObjectives = async () => {
        try {
            const { data, error } = await supabase
                .from('Objective')
                .select('*')
                .eq('isActive', true)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return { success: true, data };
        } catch (error: any) {
            console.error('Error fetching objectives:', error);
            return { success: false, data: [], error: error.message };
        }
    };

    const getUserObjectives = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('ObjectiveProgress')
                .select(`
          *,
          objective:Objective(*)
        `)
                .eq('user_id', userId)
                .order('lastUpdated', { ascending: false });

            if (error) throw error;

            return { success: true, data };
        } catch (error: any) {
            console.error('Error fetching user objectives:', error);
            return { success: false, data: [], error: error.message };
        }
    };

    // ==================== MARKETPLACE OPERATIONS ====================

    const getMarketplaceListings = async (params: {
        page?: number;
        type?: 'up' | 'down';
        isTrending?: boolean;
        dateFilter?: string;
    }) => {
        try {
            const { page = 1, type, isTrending } = params;
            const pageSize = 20;
            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1;

            let query = supabase
                .from('Locker')
                .select(`
                    *,
                    item:store_items(*),
                    user:Users(name, profileImage)
                `)
                .eq('listed_for_sale', true);

            if (type === 'up') {
                query = query.gt('coin_change', 0);
            } else if (type === 'down') {
                query = query.lt('coin_change', 0);
            }

            if (isTrending) {
                query = query.order('sell_count', { ascending: false });
            } else {
                query = query.order('listed_at', { ascending: false });
            }

            const { data, error } = await query.range(from, to);

            if (error) throw error;

            return {
                success: true,
                items: (data || []).map(item => ({
                    ...item.item,
                    ...item,
                    store_id: item.item_id,
                    user_name: item.user?.name || 'Unknown'
                }))
            };
        } catch (error: any) {
            console.error('Error fetching marketplace listings:', error);
            return { success: false, items: [], error: error.message };
        }
    };

    const getLiveGraphData = async () => {
        try {
            return { success: true, days: [] };
        } catch (error: any) {
            console.error('Error fetching graph data:', error);
            return { success: false, days: [] };
        }
    };

    const getMarketValueData = async () => {
        try {
            return { success: true, days: [] };
        } catch (error: any) {
            console.error('Error fetching market value:', error);
            return { success: false, days: [] };
        }
    };

    // ==================== NOTIFICATIONS ====================

    const getNotifications = async (userId: string, options?: {
        page?: number;
        unread_only?: boolean;
        pageSize?: number;
    }) => {
        try {
            const page = options?.page || 1;
            const pageSize = options?.pageSize || 20;
            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1;

            let query = supabase
                .from('Notification')
                .select('*', { count: 'exact' })
                .eq('user_id', userId);

            if (options?.unread_only) {
                query = query.eq('is_read', false);
            }

            const { data, error, count } = await query
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) throw error;

            return {
                success: true,
                data,
                pagination: {
                    total: count || 0,
                    totalPages: Math.ceil((count || 0) / pageSize),
                    currentPage: page,
                    pageSize,
                },
            };
        } catch (error: any) {
            console.error('Error fetching notifications:', error);
            return {
                success: false,
                data: [],
                pagination: { total: 0, totalPages: 0, currentPage: 1, pageSize: 20 },
                error: error.message,
            };
        }
    };

    const getUnreadNotificationCount = async (userId: string) => {
        try {
            const { count, error } = await supabase
                .from('Notification')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .eq('is_read', false);

            if (error) throw error;

            return { success: true, count: count || 0 };
        } catch (error: any) {
            console.error('Error fetching notification count:', error);
            return { success: false, count: 0, error: error.message };
        }
    };

    const markNotificationAsRead = async (notificationId: string) => {
        try {
            const { error } = await supabase
                .from('Notification')
                .update({ is_read: true })
                .eq('id', notificationId);

            if (error) throw error;

            return { success: true };
        } catch (error: any) {
            console.error('Error marking notification as read:', error);
            return { success: false, error: error.message };
        }
    };

    // ==================== ADMIN ====================

    const getAdminWallet = async () => {
        try {
            const { data, error } = await supabase
                .from('AdminWallet')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error) throw error;

            return { success: true, wallet: data };
        } catch (error: any) {
            console.error('Error fetching admin wallet:', error);
            return { success: false, wallet: null, error: error.message };
        }
    };

    const setAdminWallet = async (address: string) => {
        try {
            const { data, error } = await supabase
                .from('AdminWallet')
                .insert({ address })
                .select()
                .single();

            if (error) throw error;

            return { success: true, data };
        } catch (error: any) {
            console.error('Error setting admin wallet:', error);
            return { success: false, error: error.message };
        }
    };

    // ==================== NFT TOKEN TRACKING ====================

    const getContractToken = async (contractId: string, itemId: string, userId: string) => {
        try {
            const { data, error } = await supabase
                .from('Contract_token')
                .select('*')
                .eq('nftAddress', contractId)
                .eq('item_id', itemId)
                .eq('user_id', userId)
                .maybeSingle();

            if (error) throw error;

            return { success: true, data };
        } catch (error: any) {
            console.error('Error fetching contract token:', error);
            return { success: false, data: null, error: error.message };
        }
    };

    // ==================== PURCHASE OPERATIONS ====================

    const purchaseStoreItem = async (params: {
        itemId: string;
        userId: string;
        price: number;
        mintTx: string;
        nftBuyerWalletId: string;
    }) => {
        try {
            const { data, error } = await supabase.functions.invoke('secure-purchase', {
                body: { ...params, isMarketplace: false }
            });

            if (error) throw error;
            return data;
        } catch (error: any) {
            console.error('Error purchasing store item:', error);
            return { success: false, error: error.message, user: null };
        }
    };

    const purchaseLockerItem = async (params: {
        lockerId: string;
        userId: string;
        price: number;
        mintTx: string;
        nftBuyerWalletId: string;
        tokenId: string;
    }) => {
        try {
            const { data, error } = await supabase.functions.invoke('secure-purchase', {
                body: { ...params, isMarketplace: true }
            });

            if (error) throw error;
            return data;
        } catch (error: any) {
            console.error('Error purchasing locker item:', error);
            return { success: false, error: error.message, user: null };
        }
    };

    const generateNFTMetadata = async (data: any) => {
        try {
            const { data: result, error } = await supabase.functions.invoke('generate-nft-metadata', {
                body: data
            });

            if (error) throw error;
            return result;
        } catch (error: any) {
            console.error('Error generating metadata:', error);
            throw error;
        }
    };

    const loginAdmin = async (payload: { walletAddress?: string; email?: string; privy_id?: string }) => {
        try {
            const { data, error } = await supabase.functions.invoke('admin-login', {
                body: payload
            });

            if (error) throw error;
            return data;
        } catch (error: any) {
            console.error('Error admin login:', error);
            return { success: false, error: error.message };
        }
    };

    return {
        // Store Items
        getStoreItems,
        createStoreItem,
        updateStoreItem,
        deleteStoreItem,

        // Locker Items
        getLockerItems,
        getMarketplaceListings,
        updateLockerItem,
        getLiveGraphData,
        getMarketValueData,

        // User Management
        getUserProfile,
        createUser,
        updateUser,
        loginOrCreateUser,

        // Game Data
        getLevels,
        getRanks,
        getObjectives,
        getUserObjectives,

        // Notifications
        getNotifications,
        getUnreadNotificationCount,
        markNotificationAsRead,

        // Admin
        getAdminWallet,
        setAdminWallet,

        // NFT Tokens
        getContractToken,

        // Purchase Operations
        purchaseStoreItem,
        purchaseLockerItem,

        // Edge Functions
        generateNFTMetadata,
        loginAdmin,
        supabase,
    };
}
