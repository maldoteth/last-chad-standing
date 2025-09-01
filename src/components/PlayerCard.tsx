import React from 'react';
import { OptimizedPlayerImage } from './OptimizedPlayerImage';
import { formatNumberWithAbbreviation } from '@/lib/utils';

interface Player {
  name: string;
  team?: string;
  position?: string;
  price: number;
  change: number;
  trend?: string;
  image: string;
}

interface PlayerCardProps {
  player: Player;
  getMarketplacePrices: (name: string, type: string) => any;
  renderMarketplacePrices: (player: Player, getMarketplacePrices: any, size: string, onSellClick?: () => void, onBuyClick?: () => void) => React.ReactNode;
  onSellClick: (player: Player) => void;
  onBuyClick: (player: Player) => void;
  priority?: boolean;
  className?: string;
  variant?: 'mobile' | 'desktop';
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  getMarketplacePrices,
  renderMarketplacePrices,
  onSellClick,
  onBuyClick,
  priority = false,
  className = "flex items-center space-x-3 p-2 bg-white/5 rounded-lg",
  variant = 'mobile'
}) => {
  const nameTextSize = variant === 'desktop' ? 'text-sm' : 'text-sm md:text-xl';
  
  return (
    <div className={className}>
      <div className="w-12 h-12 rounded-full overflow-hidden">
        <OptimizedPlayerImage
          src={player.image}
          alt={player.name}
          priority={priority}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className={`flex items-center justify-between ${variant === 'desktop' ? 'mb-1' : ''}`}>
          <div className="flex-1 min-w-0">
            <p className={`${nameTextSize} font-semibold text-white`}>{player.name}</p>
            <p className={`text-xs ${player.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {player.change >= 0 ? '+' : ''}{formatNumberWithAbbreviation(player.change)}%{' '}
              {getMarketplacePrices(player.name, 'fighter').bestSellPrice ? 
                `${formatNumberWithAbbreviation(getMarketplacePrices(player.name, 'fighter').bestSellPrice)} sell` : ''}{' '}
              {getMarketplacePrices(player.name, 'fighter').bestBuyPrice ? 
                `${formatNumberWithAbbreviation(getMarketplacePrices(player.name, 'fighter').bestBuyPrice)} buy` : ''}
            </p>
          </div>
          {renderMarketplacePrices(player, getMarketplacePrices, 'medium', () => onSellClick(player), () => onBuyClick(player))}
        </div>
      </div>
    </div>
  );
};