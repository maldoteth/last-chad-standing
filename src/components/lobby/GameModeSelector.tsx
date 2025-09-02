import React from 'react';
import { Play, Eye, Users, Gamepad2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface GameModeSelectorProps {
  onModeSelect: (mode: 'play' | 'watch') => void;
}

const GameModeSelector = ({ onModeSelect }: GameModeSelectorProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {/* Play Mode Card */}
      <Card className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 hover:border-primary/50">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Play className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Play</CardTitle>
          <CardDescription>
            Join the battle and compete against other players
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Matchmaking system</span>
            </div>
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              <span>Real-time gameplay</span>
            </div>
          </div>
          <Button 
            onClick={() => onModeSelect('play')}
            className="w-full"
            size="lg"
          >
            Enter Battle
          </Button>
        </CardContent>
      </Card>

      {/* Watch Mode Card */}
      <Card className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 hover:border-accent/50">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors">
            <Eye className="w-8 h-8 text-accent-foreground" />
          </div>
          <CardTitle className="text-2xl">Watch</CardTitle>
          <CardDescription>
            Stream live games, place bets, and support players
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>Live game streams</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 text-center">🎯</span>
              <span>Betting & rewards</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 text-center">🎁</span>
              <span>Send aid to players</span>
            </div>
          </div>
          <Button 
            onClick={() => onModeSelect('watch')}
            className="w-full"
            variant="secondary"
            size="lg"
          >
            Browse Games
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameModeSelector;