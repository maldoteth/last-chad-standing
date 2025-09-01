
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GameSection from '@/components/GameSection';
import MarketplaceSection from '@/components/MarketplaceSection';
import ProfileSection from '@/components/ProfileSection';
import MobileGame from '@/components/MobileGame';

const Game = () => {
  const [activeSection, setActiveSection] = useState<'game' | 'marketplace' | 'profile'>('game');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-white">
            Last Chad Standing
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="flex items-center justify-center space-x-6 mx-auto">
            <button
              onClick={() => setActiveSection('game')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeSection === 'game'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Game
            </button>
            <button
              onClick={() => setActiveSection('marketplace')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeSection === 'marketplace'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Marketplace
            </button>
            <button
              onClick={() => setActiveSection('profile')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeSection === 'profile'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Profile
            </button>
          </nav>

          {/* Mobile Navigation */}
          <MobileGame activeSection={activeSection} setActiveSection={setActiveSection} />
        </div>
      </header>

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        {activeSection === 'game' && <GameSection />}
        {activeSection === 'marketplace' && <MarketplaceSection />}
        {activeSection === 'profile' && <ProfileSection />}
      </main>

      <footer className="py-4 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Last Chad Standing. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Game;
