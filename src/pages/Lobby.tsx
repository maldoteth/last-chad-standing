import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LobbyHeader from '@/components/lobby/LobbyHeader';
import GameModeSelector from '@/components/lobby/GameModeSelector';
import LiveGamesBrowser from '@/components/lobby/LiveGamesBrowser';
import StreamViewer from '@/components/lobby/StreamViewer';

export type LobbyView = 'lobby' | 'play' | 'watch' | 'stream';

const Lobby = () => {
  const [currentView, setCurrentView] = useState<LobbyView>('lobby');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleBackToGame = () => {
    navigate('/game');
  };

  const handleModeSelect = (mode: 'play' | 'watch') => {
    setCurrentView(mode);
  };

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId);
    setCurrentView('stream');
  };

  const handleBackToLobby = () => {
    setCurrentView('lobby');
    setSelectedGame(null);
  };

  const handleBackToWatch = () => {
    setCurrentView('watch');
    setSelectedGame(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LobbyHeader 
        currentView={currentView}
        onBack={currentView === 'lobby' ? handleBackToGame : 
               currentView === 'stream' ? handleBackToWatch : 
               handleBackToLobby} 
      />

      <main className="container mx-auto px-4 py-6">
        {currentView === 'lobby' && (
          <div className="space-y-8">
            <GameModeSelector onModeSelect={handleModeSelect} />
            <LiveGamesBrowser onGameSelect={handleGameSelect} />
          </div>
        )}

        {currentView === 'play' && (
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold">Matchmaking</h1>
            <p className="text-muted-foreground">Finding opponents...</p>
            <div className="bg-card p-8 rounded-lg max-w-md mx-auto">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'watch' && (
          <LiveGamesBrowser onGameSelect={handleGameSelect} />
        )}

        {currentView === 'stream' && selectedGame && (
          <StreamViewer gameId={selectedGame} />
        )}
      </main>
    </div>
  );
};

export default Lobby;