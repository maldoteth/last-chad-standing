import React from 'react';
import { BarChart3, Heart, Zap, Shield, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface PlayerStatsPanelProps {
  gameId: string;
}

interface PlayerStats {
  name: string;
  health: number;
  energy: number;
  shield: number;
  kills: number;
  position: { x: number; y: number };
  status: 'alive' | 'eliminated';
  rank: number;
}

const mockPlayerStats: PlayerStats[] = [
  {
    name: 'CyberSamurai',
    health: 85,
    energy: 70,
    shield: 40,
    kills: 3,
    position: { x: 125, y: 87 },
    status: 'alive',
    rank: 1,
  },
  {
    name: 'NeonWarrior',
    health: 92,
    energy: 55,
    shield: 65,
    kills: 2,
    position: { x: 203, y: 154 },
    status: 'alive',
    rank: 2,
  },
  {
    name: 'QuantumHunter',
    health: 68,
    energy: 90,
    shield: 25,
    kills: 4,
    position: { x: 87, y: 201 },
    status: 'alive',
    rank: 3,
  },
  {
    name: 'VoidRider',
    health: 0,
    energy: 0,
    shield: 0,
    kills: 1,
    position: { x: 156, y: 134 },
    status: 'eliminated',
    rank: 4,
  },
];

const PlayerStatsPanel = ({ gameId }: PlayerStatsPanelProps) => {
  const alivePlayers = mockPlayerStats.filter(player => player.status === 'alive');
  const eliminatedPlayers = mockPlayerStats.filter(player => player.status === 'eliminated');

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-yellow-400 border-yellow-400';
      case 2:
        return 'text-gray-300 border-gray-300';
      case 3:
        return 'text-orange-400 border-orange-400';
      default:
        return 'text-muted-foreground border-muted';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Player Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Live Players */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Alive ({alivePlayers.length})
          </h4>
          {alivePlayers.map((player) => (
            <div
              key={player.name}
              className="p-3 bg-card border rounded-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={`w-6 h-6 p-0 flex items-center justify-center text-xs ${getRankColor(player.rank)}`}
                  >
                    #{player.rank}
                  </Badge>
                  <span className="font-medium">{player.name}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Target className="w-3 h-3" />
                  {player.kills}
                </div>
              </div>

              {/* Health */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-red-500" />
                    Health
                  </div>
                  <span>{player.health}%</span>
                </div>
                <Progress value={player.health} className="h-2" />
              </div>

              {/* Energy */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-yellow-500" />
                    Energy
                  </div>
                  <span>{player.energy}%</span>
                </div>
                <Progress value={player.energy} className="h-2" />
              </div>

              {/* Shield */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-blue-500" />
                    Shield
                  </div>
                  <span>{player.shield}%</span>
                </div>
                <Progress value={player.shield} className="h-2" />
              </div>

              {/* Position */}
              <div className="text-xs text-muted-foreground">
                Position: ({player.position.x}, {player.position.y})
              </div>
            </div>
          ))}
        </div>

        {/* Eliminated Players */}
        {eliminatedPlayers.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Eliminated ({eliminatedPlayers.length})
            </h4>
            {eliminatedPlayers.map((player) => (
              <div
                key={player.name}
                className="p-3 bg-muted/20 border rounded-lg opacity-60"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className="w-6 h-6 p-0 flex items-center justify-center text-xs text-muted-foreground border-muted"
                    >
                      #{player.rank}
                    </Badge>
                    <span className="font-medium line-through">{player.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Target className="w-3 h-3" />
                    {player.kills}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Eliminated at ({player.position.x}, {player.position.y})
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Game Stats */}
        <div className="pt-4 border-t space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Kills:</span>
            <span className="font-medium">
              {mockPlayerStats.reduce((sum, player) => sum + player.kills, 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Players Left:</span>
            <span className="font-medium text-green-400">
              {alivePlayers.length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Game Time:</span>
            <span className="font-medium">12:34</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerStatsPanel;