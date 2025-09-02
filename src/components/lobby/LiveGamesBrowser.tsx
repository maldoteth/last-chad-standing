import React, { useState } from 'react';
import { Eye, Users, Clock, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface GameData {
  id: string;
  players: string[];
  viewers: number;
  status: 'starting' | 'active' | 'finishing';
  duration: string;
  map: string;
  mode: string;
  featured?: boolean;
}

interface LiveGamesBrowserProps {
  onGameSelect: (gameId: string) => void;
}

const mockGames: GameData[] = [
  {
    id: 'game-1',
    players: ['CyberSamurai', 'NeonWarrior', 'QuantumHunter', 'VoidRider'],
    viewers: 1247,
    status: 'active',
    duration: '12:34',
    map: 'Neon Cityscape',
    mode: 'Battle Royale',
    featured: true,
  },
  {
    id: 'game-2',
    players: ['TechnoMage', 'PixelPhantom', 'DataDemon'],
    viewers: 892,
    status: 'active',
    duration: '08:15',
    map: 'Cyber Arena',
    mode: 'Team Deathmatch',
  },
  {
    id: 'game-3',
    players: ['GlitchGhost', 'CodeCrusher', 'BinaryBeast', 'MatrixMaster'],
    viewers: 634,
    status: 'starting',
    duration: '00:45',
    map: 'Digital Fortress',
    mode: 'Capture the Flag',
  },
  {
    id: 'game-4',
    players: ['HoloHacker', 'PlasmaPlayer'],
    viewers: 423,
    status: 'active',
    duration: '15:22',
    map: 'Quantum Lab',
    mode: '1v1 Duel',
  },
  {
    id: 'game-5',
    players: ['SynthSoldier', 'CircuitSiren', 'BitBrawler'],
    viewers: 267,
    status: 'finishing',
    duration: '19:58',
    map: 'Chrome Complex',
    mode: 'King of the Hill',
  },
];

const LiveGamesBrowser = ({ onGameSelect }: LiveGamesBrowserProps) => {
  const [filter, setFilter] = useState<'all' | 'starting' | 'active' | 'finishing'>('all');

  const filteredGames = filter === 'all' 
    ? mockGames 
    : mockGames.filter(game => game.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'starting':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'active':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'finishing':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Live Games</h2>
        <div className="flex gap-2">
          {(['all', 'starting', 'active', 'finishing'] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredGames.map((game) => (
          <Card 
            key={game.id} 
            className={`transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer ${
              game.featured ? 'border-primary/50 bg-primary/5' : ''
            }`}
            onClick={() => onGameSelect(game.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{game.map}</CardTitle>
                  {game.featured && (
                    <Star className="w-4 h-4 text-primary fill-primary" />
                  )}
                  <Badge className={getStatusColor(game.status)}>
                    {game.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {game.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {game.viewers.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{game.mode}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>{game.players.length} players</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {game.players.map((player, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {player}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Watch
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No games found for the selected filter.</p>
        </div>
      )}
    </div>
  );
};

export default LiveGamesBrowser;