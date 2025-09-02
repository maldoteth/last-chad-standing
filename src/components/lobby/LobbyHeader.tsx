import React from 'react';
import { ArrowLeft, Users, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LobbyHeaderProps {
  currentView: 'lobby' | 'play' | 'watch' | 'stream';
  onBack: () => void;
}

const LobbyHeader = ({ currentView, onBack }: LobbyHeaderProps) => {
  const getTitle = () => {
    switch (currentView) {
      case 'lobby':
        return 'Game Lobby';
      case 'play':
        return 'Matchmaking';
      case 'watch':
        return 'Live Games';
      case 'stream':
        return 'Live Stream';
      default:
        return 'Lobby';
    }
  };

  const getIcon = () => {
    switch (currentView) {
      case 'play':
        return <Users className="w-5 h-5" />;
      case 'watch':
      case 'stream':
        return <Eye className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            {getIcon()}
            <h1 className="text-xl font-semibold">{getTitle()}</h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LobbyHeader;