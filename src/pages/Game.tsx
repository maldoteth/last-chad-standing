import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { formatNumberWithAbbreviation } from '@/lib/utils';
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import SocialLinks from '@/components/SocialLinks';
import { useMediaQuery } from 'usehooks-ts'

const videoSource = '/game-bg.mp4';

export default function Game() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showOrientationPrompt, setShowOrientationPrompt] = useState(false);
  const [userStats, setUserStats] = useState({
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    highestStreak: 0,
    currentStreak: 0,
    totalPrizes: 0,
  });
    const { toast } = useToast()
    const isMobile = useMediaQuery('(max-width: 768px)')

  const fetchUserStats = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`/api/userStats?userId=${user.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUserStats(data);
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
    }
  }, [user?.id]);

  useEffect(() => {
    const checkOrientation = () => {
      if (window.innerWidth < window.innerHeight && isMobile) {
        setShowOrientationPrompt(true);
      } else {
        setShowOrientationPrompt(false);
      }
    };

    // Check on mount
    checkOrientation();

    // Check on resize
    window.addEventListener('resize', checkOrientation);

    // Cleanup listener
    return () => window.removeEventListener('resize', checkOrientation);
  }, [isMobile]);

  useEffect(() => {
    if (!ready) return;

    // If the user is not authenticated, redirect to the home page
    if (!authenticated) {
      navigate('/');
      return;
    }

    // If the user is authenticated, fetch their stats
    fetchUserStats();

    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer); // Clear the timer if the component unmounts before the timer finishes
  }, [ready, authenticated, navigate, fetchUserStats]);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {showOrientationPrompt && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/80 z-50 flex flex-col items-center justify-center">
          <p className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">Please rotate your device</p>
          <img src="/rotate-phone.svg" alt="Rotate phone" className="w-32 h-32 animate-rotate-phone" />
        </div>
      )}

      {/* Video Background */}
      <video
        src={videoSource}
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />

      {/* Loading Screen */}
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/80 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <img src="/lcs-logo-animation.gif" alt="Loading..." className="w-64 h-auto" />
            <p className="text-lg mt-4">Loading...</p>
          </div>
        </div>
      )}
      
      {!loading && (
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header */}
          <header className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm border-b border-white/10">
            {/* Logo Section */}
            <div className="flex items-center">
              <button onClick={() => navigate('/')} className="mr-4">
                <img src="/lcs-logo-no-bg.png" alt="Logo" className="h-8 w-auto" />
              </button>
              <SocialLinks className="hidden md:flex" />
            </div>
            
            {/* Navigation */}
            <nav className="flex items-center justify-center space-x-6 ml-16">
              <button onClick={() => navigate('/game')} className="text-white/80 hover:text-white transition-colors">Game</button>
              <button onClick={() => navigate('/leaderboard')} className="text-white/80 hover:text-white transition-colors">Leaderboard</button>
              <button onClick={() => navigate('/docs')} className="text-white/80 hover:text-white transition-colors">Docs</button>
            </nav>

            {/* User Stats Section */}
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-sm text-white/70">Games Played: <span className="font-semibold">{userStats?.gamesPlayed != null ? formatNumberWithAbbreviation(userStats.gamesPlayed) : <Skeleton className="h-4 w-12" />}</span></p>
                <p className="text-sm text-white/70">Wins: <span className="font-semibold">{userStats?.wins != null ? formatNumberWithAbbreviation(userStats.wins) : <Skeleton className="h-4 w-12" />}</span></p>
              </div>
              <button onClick={logout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Log Out
              </button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Last Chad Standing</h1>
              <p className="text-lg">Welcome to the game!</p>
            </div>
          </main>

          {/* Footer */}
          <footer className="p-4 text-center text-white/50 border-t border-white/10">
            <p>&copy; 2024 Last Chad Standing</p>
          </footer>
        </div>
      )}
    </div>
  );
}
