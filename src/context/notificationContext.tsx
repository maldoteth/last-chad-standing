'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { usePrivy } from '@privy-io/react-auth';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from './profileContext';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type?: string;
    is_read: boolean;
    created_at: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    page: number;
    limit: number;
    totalPages: number;
    fetchNotifications: (options?: { unread_only?: string; page?: number }) => Promise<void>;
    fetchUnreadCount: () => Promise<void>;
    markAsRead: (notificationId: string) => Promise<void>;
    refreshAll: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface Props {
    children: ReactNode;
}

export const NotificationProvider: React.FC<Props> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(20);
    const [totalPages, setTotalPages] = useState<number>(1);

    const { getNotifications, getUnreadNotificationCount, markNotificationAsRead } = useSupabase();
    const { user, authenticated } = usePrivy();
    const { profile } = useProfile();

    // ---------------------
    // Fetch Notifications (with pagination & unread filter)
    // ---------------------
    const isFetchingRef = useRef(false);
    const isFetchingCountRef = useRef(false);

    const fetchNotifications = async (options?: { unread_only?: string; page?: number }) => {
        if (isFetchingRef.current || !profile?.id) return;
        try {
            isFetchingRef.current = true;
            setLoading(true);

            const res = await getNotifications(profile.id, { 
                page: options?.page, 
                unread_only: options?.unread_only === 'true' 
            });

            if (res.success) {
                setNotifications(res.data || []);
                setPage(res.pagination?.currentPage || page);
                setLimit(res.pagination?.pageSize || limit);
                setTotalPages(res.pagination?.totalPages || 1);
            }
        } catch (err) {
            console.error('❌ Error fetching notifications:', err);
        } finally {
            setLoading(true); // Keeping sync with original logic or fixing? original had setLoading(true) then setLoading(false)
            setLoading(false);
            isFetchingRef.current = false;
        }
    };

    const fetchUnreadCount = async () => {
        if (isFetchingCountRef.current || !profile?.id) return;
        try {
            isFetchingCountRef.current = true;
            const res = await getUnreadNotificationCount(profile.id);
            if (res.success) {
                setUnreadCount(res.count || 0);
            }
        } catch (err) {
            console.error('❌ Error fetching unread count:', err);
        } finally {
            isFetchingCountRef.current = false;
        }
    };

    // ---------------------
    // Mark As Read
    // ---------------------
    const markAsRead = async (notificationId: string) => {
        try {
            const res = await markNotificationAsRead(notificationId);
            if (res.success) {
                setNotifications(prev =>
                    prev.map(n => (n.id === notificationId ? { ...n, is_read: true } : n))
                );
                setUnreadCount(prev => Math.max(prev - 1, 0));
            }
        } catch (err) {
            console.error('❌ Error marking notification as read:', err);
        }
    };

    // ---------------------
    // Refresh All (both count + notifications)
    // ---------------------
    const refreshAll = async () => {
        await Promise.all([fetchNotifications(), fetchUnreadCount()]);
    };

    useEffect(() => {
        if (authenticated && profile?.id) {
            refreshAll();

            // 💡 Enable Realtime Subscription
            const channel = supabase
                .channel(`notifications-${profile.id}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'Notification',
                        filter: `user_id=eq.${profile.id}`
                    },
                    (payload) => {
                        console.log('📬 New notification received via Realtime:', payload);
                        refreshAll();
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [authenticated, user?.id, profile?.id]);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                loading,
                page,
                limit,
                totalPages,
                fetchNotifications,
                fetchUnreadCount,
                markAsRead,
                refreshAll,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
