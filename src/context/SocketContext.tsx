import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { APIURL } from '@/Api/axiosInstance';

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

export interface ClientToServerEvents {
  'ping': (callback: (data: { time: Date; status: string }) => void) => void;
  'checkConnection': (callback: (data: { connected: boolean; socketId: string; userId: string }) => void) => void;
  'user:leaving': () => void;
}

interface SocketContextType {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  isConnected: boolean;
  connectionError: string | null;
  connect: () => void;
  disconnect: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  connectionError: null,
  connect: () => {},
  disconnect: () => {},
});

interface SocketProviderProps {
  children: ReactNode;
  socketUrl?: string;
  debug?: boolean;
  options?: {
    reconnectionAttempts?: number;
    reconnectionDelay?: number;
    timeout?: number;
  };
}

const DEFAULT_OPTIONS = {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
};

export const SocketProvider: React.FC<SocketProviderProps> = ({
  children,
  socketUrl = APIURL,
  debug = false,
  options = DEFAULT_OPTIONS,
}) => {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

  const connect = useCallback(() => {
    const userToken = localStorage.getItem('token');
    
    if (!userToken) {
      console.error('❌ No token found in localStorage');
      return;
    }

    if (socketRef.current) {
      if (debug) console.log('⚠️ Socket already connected');
      return;
    }

    if (!socketUrl) {
      console.error('❌ Socket URL is not defined');
      return;
    }

    if (debug) console.log('🔌 Connecting to socket...', socketUrl);

    const socketInstance = io(socketUrl, {
      auth: { token: userToken },
      query: { token: userToken },
      ...options,
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('✅ Socket connected:', socketInstance.id);
      setIsConnected(true);
      setConnectionError(null);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('⚠️ Socket disconnected:', reason);
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('❌ Connection error:', error.message);
      setConnectionError(error.message);
      setIsConnected(false);
    });

    socketInstance.io.on('reconnect', (attempt) => {
      console.log('🔁 Reconnected on attempt:', attempt);
    });

    socketInstance.io.on('reconnect_error', (error) => {
      console.error('🛑 Reconnect error:', error.message);
    });

    // Debug: Listen to all events
    if (debug) {
      socketInstance.onAny((eventName, ...args) => {
        console.log('🔥 Socket event received:', eventName, args);
      });
    }
  }, [socketUrl, options, debug]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
      if (debug) console.log('🔌 Socket disconnected manually');
    }
  }, [debug]);

  useEffect(() => {
    const userToken = localStorage.getItem('token');
    if (userToken) connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [connect]);

  useEffect(() => {
    if (!socketRef.current) return;

    const handleBeforeUnload = () => {
      socketRef.current?.emit('user:leaving');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, connectionError, connect, disconnect }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export function useSocketEvent<T>(
  eventName: keyof ServerToClientEvents,
  callback: (data: T) => void,
  deps: React.DependencyList = []
) {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const eventHandler = (data: T) => {
      callback(data);
    };

    socket.on(eventName as any, eventHandler as any);

    return () => {
      socket.off(eventName as any, eventHandler as any);
    };
  }, [socket, eventName, ...deps]);
}

export function useSocketEmit<T, R>(eventName: keyof ClientToServerEvents) {
  const { socket, isConnected } = useSocket();

  const emitEvent = useCallback(
    (data?: T): Promise<R> => {
      return new Promise((resolve, reject) => {
        if (!socket || !isConnected) {
          return reject(new Error('Socket not connected'));
        }

        socket.emit(eventName as any, data, (response: R) => {
          resolve(response);
        });
      });
    },
    [socket, isConnected, eventName]
  );

  return { emit: emitEvent, isConnected };
}