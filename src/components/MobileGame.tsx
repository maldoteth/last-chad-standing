
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

interface MobileGameProps {
  activeSection: 'game' | 'marketplace' | 'profile';
  setActiveSection: (section: 'game' | 'marketplace' | 'profile') => void;
}

const MobileGame = ({ activeSection, setActiveSection }: MobileGameProps) => {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="bg-gray-900 border-gray-700">
          <nav className="flex flex-col space-y-4 mt-8">
            <button
              onClick={() => setActiveSection('game')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 text-left ${
                activeSection === 'game'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Game
            </button>
            <button
              onClick={() => setActiveSection('marketplace')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 text-left ${
                activeSection === 'marketplace'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Marketplace
            </button>
            <button
              onClick={() => setActiveSection('profile')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 text-left ${
                activeSection === 'profile'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Profile
            </button>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileGame;
