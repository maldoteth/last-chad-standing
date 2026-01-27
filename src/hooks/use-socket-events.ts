import { useEffect } from 'react';

export function useSocketEvent<T>(
    eventName: string,
    callback: (data: T) => void,
    deps: React.DependencyList = []
) {
    useEffect(() => {
        const handler = (event: any) => {
            callback(event.detail);
        };

        window.addEventListener(eventName, handler);
        return () => window.removeEventListener(eventName, handler);
    }, [eventName, ...deps]);
}

export function useSocketEmit<T, R>(eventName: string) {
    return {
        emit: async (data?: T) => {
            console.warn(`Socket emit for ${eventName} called with data:`, data, '. In Supabase we use direct API calls for updates.');
            return {} as R;
        },
        isConnected: true
    };
}
