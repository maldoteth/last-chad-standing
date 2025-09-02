import React, { useState } from 'react';
import { TrendingUp, Coins, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface BettingPanelProps {
  gameId: string;
}

interface PlayerBet {
  player: string;
  odds: number;
  payout: number;
}

const mockBets: PlayerBet[] = [
  { player: 'CyberSamurai', odds: 2.5, payout: 250 },
  { player: 'NeonWarrior', odds: 3.2, payout: 320 },
  { player: 'QuantumHunter', odds: 4.1, payout: 410 },
  { player: 'VoidRider', odds: 5.8, payout: 580 },
];

const BettingPanel = ({ gameId }: BettingPanelProps) => {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState<string>('100');
  const [activeBets, setActiveBets] = useState<Array<{player: string, amount: number, odds: number}>>([]);

  const quickBetAmounts = [25, 50, 100, 250];

  const handlePlaceBet = () => {
    if (!selectedPlayer || !betAmount) return;
    
    const playerBet = mockBets.find(bet => bet.player === selectedPlayer);
    if (!playerBet) return;

    const newBet = {
      player: selectedPlayer,
      amount: parseInt(betAmount),
      odds: playerBet.odds,
    };

    setActiveBets(prev => [...prev, newBet]);
    setSelectedPlayer(null);
    setBetAmount('100');
  };

  const getPotentialPayout = () => {
    if (!selectedPlayer || !betAmount) return 0;
    const playerBet = mockBets.find(bet => bet.player === selectedPlayer);
    return playerBet ? Math.floor(parseInt(betAmount) * playerBet.odds) : 0;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Live Betting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Player Odds */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Player Odds</h4>
          <div className="space-y-2">
            {mockBets.map((bet) => (
              <div
                key={bet.player}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedPlayer === bet.player
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-accent'
                }`}
                onClick={() => setSelectedPlayer(bet.player)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{bet.player}</span>
                  <div className="text-right">
                    <div className="text-sm font-bold">{bet.odds}x</div>
                    <div className="text-xs text-muted-foreground">
                      Win {bet.payout}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bet Amount */}
        {selectedPlayer && (
          <div className="space-y-3 p-4 bg-accent/10 rounded-lg">
            <h4 className="font-medium text-sm">Betting on {selectedPlayer}</h4>
            
            {/* Quick bet buttons */}
            <div className="grid grid-cols-4 gap-2">
              {quickBetAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setBetAmount(amount.toString())}
                  className="text-xs"
                >
                  {amount}
                </Button>
              ))}
            </div>

            {/* Custom amount */}
            <div className="space-y-2">
              <Input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="Enter amount"
                className="text-center"
              />
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Potential payout: </span>
                <span className="font-bold text-primary">
                  <Coins className="w-3 h-3 inline mr-1" />
                  {getPotentialPayout()}
                </span>
              </div>
              <Button onClick={handlePlaceBet} className="w-full">
                Place Bet
              </Button>
            </div>
          </div>
        )}

        {/* Active Bets */}
        {activeBets.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Your Active Bets</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {activeBets.map((bet, index) => (
                <div key={index} className="p-2 bg-card rounded border text-sm">
                  <div className="flex justify-between">
                    <span>{bet.player}</span>
                    <Badge variant="outline">
                      <Coins className="w-3 h-3 mr-1" />
                      {bet.amount}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Odds: {bet.odds}x • Max win: {bet.amount * bet.odds}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="pt-4 border-t space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Bets:</span>
            <span className="font-medium">
              {activeBets.reduce((sum, bet) => sum + bet.amount, 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Potential Win:</span>
            <span className="font-bold text-primary">
              {activeBets.reduce((sum, bet) => sum + (bet.amount * bet.odds), 0)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BettingPanel;