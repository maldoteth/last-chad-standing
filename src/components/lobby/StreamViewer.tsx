import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BettingPanel from './BettingPanel';
import AidDropPanel from './AidDropPanel';
import GameChat from './GameChat';
import PlayerStatsPanel from './PlayerStatsPanel';

interface StreamViewerProps {
  gameId: string;
}

const StreamViewer = ({ gameId }: StreamViewerProps) => {
  const [activePanel, setActivePanel] = useState<'betting' | 'aid' | 'chat' | 'stats'>('betting');

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-full">
      {/* Main Stream Area */}
      <div className="lg:col-span-2 space-y-4">
        {/* Video Stream Placeholder */}
        <Card className="aspect-video bg-black/50 border-2">
          <CardContent className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-primary rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Live Stream</h3>
                <p className="text-muted-foreground">Game ID: {gameId}</p>
              </div>
              <div className="flex items-center justify-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  LIVE
                </span>
                <span>1,247 viewers</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Neon Cityscape - Battle Royale</span>
              <span className="text-sm font-normal text-muted-foreground">12:34 elapsed</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {['CyberSamurai', 'NeonWarrior', 'QuantumHunter', 'VoidRider'].map((player, index) => (
                <div key={player} className="text-center">
                  <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                    index === 0 ? 'bg-green-500' : 
                    index === 1 ? 'bg-yellow-500' : 
                    index === 2 ? 'bg-orange-500' : 'bg-red-500'
                  }`}></div>
                  <p className="text-sm font-medium">{player}</p>
                  <p className="text-xs text-muted-foreground">{100 - index * 15} HP</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Side Panels */}
      <div className="space-y-4">
        {/* Panel Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'betting', label: 'Betting' },
            { key: 'aid', label: 'Aid Drop' },
            { key: 'chat', label: 'Chat' },
            { key: 'stats', label: 'Stats' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActivePanel(tab.key as any)}
              className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                activePanel === tab.key
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border hover:bg-accent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active Panel Content */}
        <div className="min-h-[500px]">
          {activePanel === 'betting' && <BettingPanel gameId={gameId} />}
          {activePanel === 'aid' && <AidDropPanel gameId={gameId} />}
          {activePanel === 'chat' && <GameChat gameId={gameId} />}
          {activePanel === 'stats' && <PlayerStatsPanel gameId={gameId} />}
        </div>
      </div>
    </div>
  );
};

export default StreamViewer;