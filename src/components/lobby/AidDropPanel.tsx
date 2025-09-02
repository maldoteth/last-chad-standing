import React, { useState } from 'react';
import { Gift, Heart, Zap, Shield, Coins } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AidDropPanelProps {
  gameId: string;
}

interface AidItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: React.ReactNode;
  cooldown?: number;
}

const aidItems: AidItem[] = [
  {
    id: 'health',
    name: 'Health Pack',
    description: 'Restore 50 HP instantly',
    cost: 25,
    icon: <Heart className="w-4 h-4" />,
  },
  {
    id: 'energy',
    name: 'Energy Boost',
    description: 'Restore energy and increase speed',
    cost: 35,
    icon: <Zap className="w-4 h-4" />,
  },
  {
    id: 'shield',
    name: 'Shield Boost',
    description: 'Temporary damage resistance',
    cost: 45,
    icon: <Shield className="w-4 h-4" />,
  },
  {
    id: 'ammo',
    name: 'Ammo Drop',
    description: 'Refill weapon ammunition',
    cost: 20,
    icon: <span className="text-sm">🔫</span>,
  },
];

const players = ['CyberSamurai', 'NeonWarrior', 'QuantumHunter', 'VoidRider'];

const AidDropPanel = ({ gameId }: AidDropPanelProps) => {
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [selectedAid, setSelectedAid] = useState<string>('');
  const [sentAids, setSentAids] = useState<Array<{player: string, aid: string, timestamp: Date}>>([]);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  const handleSendAid = () => {
    if (!selectedPlayer || !selectedAid) return;

    const aid = aidItems.find(item => item.id === selectedAid);
    if (!aid) return;

    // Add to sent aids
    setSentAids(prev => [...prev, {
      player: selectedPlayer,
      aid: aid.name,
      timestamp: new Date(),
    }]);

    // Set cooldown if applicable
    if (aid.cooldown) {
      setCooldowns(prev => ({
        ...prev,
        [`${selectedPlayer}-${selectedAid}`]: aid.cooldown,
      }));
    }

    // Reset selections
    setSelectedPlayer('');
    setSelectedAid('');
  };

  const isOnCooldown = (playerId: string, aidId: string) => {
    const key = `${playerId}-${aidId}`;
    return cooldowns[key] && cooldowns[key] > 0;
  };

  const selectedAidItem = aidItems.find(item => item.id === selectedAid);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5" />
          Aid Drop
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Player Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Player</label>
          <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a player to help" />
            </SelectTrigger>
            <SelectContent>
              {players.map((player) => (
                <SelectItem key={player} value={player}>
                  <div className="flex items-center justify-between w-full">
                    <span>{player}</span>
                    <div className="flex items-center gap-1 ml-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-muted-foreground">85 HP</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Aid Items */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Choose Aid Type</label>
          <div className="grid grid-cols-2 gap-2">
            {aidItems.map((aid) => {
              const onCooldown = selectedPlayer && isOnCooldown(selectedPlayer, aid.id);
              return (
                <div
                  key={aid.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedAid === aid.id
                      ? 'border-primary bg-primary/10'
                      : onCooldown
                      ? 'border-muted bg-muted/20 opacity-50 cursor-not-allowed'
                      : 'border-border hover:border-accent'
                  }`}
                  onClick={() => !onCooldown && setSelectedAid(aid.id)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {aid.icon}
                    <span className="font-medium text-sm">{aid.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {aid.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      <Coins className="w-3 h-3 mr-1" />
                      {aid.cost}
                    </Badge>
                    {onCooldown && (
                      <span className="text-xs text-muted-foreground">
                        Cooldown
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Send Aid Button */}
        {selectedPlayer && selectedAid && selectedAidItem && (
          <div className="p-4 bg-accent/10 rounded-lg space-y-3">
            <div className="text-center">
              <p className="text-sm">
                Send <strong>{selectedAidItem.name}</strong> to <strong>{selectedPlayer}</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                Cost: {selectedAidItem.cost} coins
              </p>
            </div>
            <Button onClick={handleSendAid} className="w-full">
              <Gift className="w-4 h-4 mr-2" />
              Send Aid Drop
            </Button>
          </div>
        )}

        {/* Recent Aid Drops */}
        {sentAids.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Recent Aid Drops</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {sentAids.slice(-5).reverse().map((aid, index) => (
                <div key={index} className="p-2 bg-card rounded border text-sm">
                  <div className="flex justify-between items-center">
                    <span>{aid.aid} → {aid.player}</span>
                    <span className="text-xs text-muted-foreground">
                      {aid.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="pt-4 border-t space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Sent:</span>
            <span className="font-medium">{sentAids.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Coins Spent:</span>
            <span className="font-medium">
              {sentAids.reduce((sum, aid) => {
                const item = aidItems.find(i => i.name === aid.aid);
                return sum + (item?.cost || 0);
              }, 0)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AidDropPanel;