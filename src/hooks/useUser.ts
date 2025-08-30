import { usePrivy } from '@privy-io/react-auth';

export const useUser = () => {
  const { user, authenticated, ready } = usePrivy();
  
  return {
    user: authenticated ? user : null,
    isLoading: !ready
  };
};