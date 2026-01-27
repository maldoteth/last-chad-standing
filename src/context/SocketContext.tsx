import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePrivy } from '@privy-io/react-auth';
import { useProfile } from './profileContext';

export interface ServerToClientEvents {
  'authentication:success': (data: { userId: string; socketId: string; timestamp: Date }) => void;
  'disconnected': (data: { userId: string; timestamp: Date; reason: string }) => void;
  'notifications:delivered': (data: { count: number; timestamp: Date }) => void;
  'server:shutdown': (data: { message: string; timestamp: Date }) => void;
  'notification:new': (data: any) => void;
  'notification:count': (data: any) => void;
  'update:ranking': (data: any) => void;
  'update:user': (data: any) => void;
  'storeItems': (data: any) => void;
  'lockerItems': (data: any) => void;
  'updatedLocker': (data: any) => void;
  'update:objectiveProgress': (data: any) => void;
}

interface SocketContextType {
  isConnected: boolean;
  connectionError: string | null;
  connect: () => void;
  disconnect: () => void;
}

const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  connectionError: null,
  connect: () => {},
  disconnect: () => {},
});

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { profile } = useProfile();
  const { authenticated } = usePrivy();
  const channelRef = useRef<any>(null);

  const disconnect = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      setIsConnected(false);
      console.log('🔌 Supabase Realtime Disconnected');
    }
  }, []);

  const connect = useCallback(() => {
    if (!authenticated || !profile?.id) return;

    if (channelRef.current) return;

    console.log('🔌 Connecting to Supabase Realtime for user:', profile.id);

    const channel = supabase
      .channel(`user-updates-${profile.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Locker', filter: `user_id=eq.${profile.id}` },
        (payload) => {
          console.log('🔥 Realtime change in Locker:', payload);
          window.dispatchEvent(new CustomEvent('updatedLocker', { detail: payload }));
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'Notification', filter: `user_id=eq.${profile.id}` },
        (payload) => {
          console.log('🔥 New Notification received:', payload);
          window.dispatchEvent(new CustomEvent('notification:new', { detail: payload.new }));
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'Users', filter: `id=eq.${profile.id}` },
        (payload) => {
          console.log('🔥 User profile updated:', payload);
          window.dispatchEvent(new CustomEvent('update:user', { detail: payload.new }));
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ObjectiveProgress', filter: `user_id=eq.${profile.id}` },
        (payload) => {
          console.log('🔥 Objective progress updated:', payload);
          window.dispatchEvent(new CustomEvent('update:objectiveProgress', { detail: payload }));
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Supabase Realtime Subscribed');
          setIsConnected(true);
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('❌ Supabase Realtime Subscription Error');
          setConnectionError('Failed to subscribe to realtime updates');
        }
      });

    channelRef.current = channel;
  }, [profile?.id, authenticated]);

  useEffect(() => {
    if (authenticated && profile?.id) {
      connect();
    } else {
      disconnect();
    }
    return () => disconnect();
  }, [authenticated, profile?.id, connect, disconnect]);

  return (
    <SocketContext.Provider value={{ isConnected, connectionError, connect, disconnect }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);