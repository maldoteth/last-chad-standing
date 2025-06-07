import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SearchResult {
  sectionId: string;
  title: string;
  content: string;
  match: string;
}

interface DocumentSearchProps {
  isOpen: boolean;
  onClose: () => void;
  isMobileInline?: boolean;
}

const DocumentSearch: React.FC<DocumentSearchProps> = ({ isOpen, onClose, isMobileInline = false }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Define all searchable content sections
  const searchableContent = [
    {
      sectionId: 'core-concept',
      title: 'Core Concept',
      content: 'Last Chad Standing is a high-intensity, fast paced, third person fighter battle royale. Players choose from a cast of customizable fighters, each trained in unique fight styles and abilities, in a fast-paced, melee-focused environment. The game emphasizes brutal hand-to-hand combat in an open-world island setting, with dynamic environmental hazards and blood-soaked brawls to the death.'
    },
    {
      sectionId: 'game-world',
      title: 'Game World & Environment',
      content: 'The map is a relatively small, derelict resort island filled with destructible environments, including beaches, dense jungles, abandoned industrial areas, and decaying urban ruins. Beaches provide wide open spaces, jungle offers dense cover for ambushes, resort ruins provide multi-level buildings for vantage points, and industrial complex has environmental hazards.'
    },
    {
      sectionId: 'gameplay-mechanics',
      title: 'Gameplay Mechanics',
      content: 'Combat focuses on hand-to-hand fighting with realistic physics. Features strikes, grappling, weapons, fatalities, special moves, and proximity voice chat. Character classes include Brawler, Ninja, Grappler, Brute, and Slayer, each with unique abilities and stats.'
    },
    {
      sectionId: 'storm-cage-mechanics',
      title: 'Enhanced Storm & Cage Mechanics',
      content: 'Steel cage that mechanically closes in from all sides, creating absolute barriers. Final zone transforms into professional MMA octagon cage. The cage deals continuous damage and creates strategic positioning challenges.'
    },
    {
      sectionId: 'progression',
      title: 'Progression & Customization',
      content: 'NFT skins marketplace with unique visual attributes. Character customization with base skins, accessories, clothing, and weapons. Limited-edition and rare skins available through tournaments, challenges, or direct purchase.'
    },
    {
      sectionId: 'game-modes',
      title: 'Game Modes',
      content: 'Battle Royale with 20-100 players, Duos with 10-50 teams, Death Match with 15-minute time limit, Survival Royale with PvE/PvP elements, and monthly tournaments with large rewards.'
    },
    {
      sectionId: 'monetization',
      title: 'Monetization & Marketplace',
      content: 'Play-and-earn model with in-game currency. NFT drops, in-game store, season pass, and lootboxes. All NFTs are tradable on external platforms for real-world value.'
    },
    {
      sectionId: 'visuals-sound',
      title: 'Visuals and Sound',
      content: 'Hyperrealistic graphics with cutting-edge visual fidelity, realistic lighting, textures, and physics-based animations. Brutal, visceral sound effects with dynamic weather and atmospheric music.'
    },
    {
      sectionId: 'controls',
      title: 'Basic Controls',
      content: 'PC controls include WASD movement, mouse camera, left/right click for attacks, E to interact, F to grapple, R to execute, Shift to sprint, Spacebar to jump. Console controls use sticks for movement and camera, triggers for attacks.'
    },
    {
      sectionId: 'combat-mechanics',
      title: 'Combat Mechanics',
      content: 'Attack types include punch/combos and kick/combos. Grappling system with throws and special moves. Blocking, parrying, dodging mechanics. Special abilities unique to each character class. Brutal finishers and executions.'
    },
    {
      sectionId: 'weapons-inventory',
      title: 'Weapons and Inventory',
      content: 'Blunt weapons, improvised weapons, and throwable weapons. Weapon durability system where weapons break over time. Inventory management with up to three weapons and consumable health items.'
    },
    {
      sectionId: 'movement',
      title: 'Movement and Traversal',
      content: 'Basic movement with jumping, climbing, and sliding mechanics. Sprint and slide attacks for tactical advantages. Vertical and horizontal exploration opportunities.'
    },
    {
      sectionId: 'map-hazards',
      title: 'Map and Environmental Hazards',
      content: 'Environmental traps including spikes, lava pits, acid baths, and cliffs. Dynamic weather affecting visibility. Shrinking zone mechanics forcing players together.'
    },
    {
      sectionId: 'strategy',
      title: 'Game Strategy',
      content: 'Weapon conservation, stamina management, environmental usage, opponent adaptation, and tactical movement. Key strategies for dominating matches and surviving to the end.'
    },
    {
      sectionId: 'social-aspects',
      title: 'Social Aspects',
      content: 'Proximity voice chat, spectator mode, care packages, fighter backing, reward sharing. Community features including profiles, replays, tournaments, and social media integration.'
    },
    {
      sectionId: 'in-game-currency',
      title: 'Economy - Coins',
      content: 'Decentralized in-game currency with set supply of 1,000,000,000 coins. Blockchain technology ensures transparent tokenomics and true ownership without developer manipulation.'
    },
    {
      sectionId: 'token-economy',
      title: 'Token Distribution',
      content: 'Public Sale 30%, Team 15%, Development Fund 15%, Marketing & Partnerships 15%, Ecosystem Rewards 10%, Liquidity Pool 10%, Advisors 5%.'
    },
    {
      sectionId: 'genesis-chads',
      title: 'Genesis Chads',
      content: 'Randomly generated cartoon chads from 2022. Hand drawn by founder Mike Hales. Revenue sharing with holders. Airdrop qualification for holders. Collections include Genesis Chads, All Access Pass, VIP Pass, Elite Pass.'
    },
    {
      sectionId: 'utility',
      title: 'Utility',
      content: 'In-game currency for buying skins, tournament entry, governance voting, staking rewards, care packages, and backing fighters. Share loot when your fighter wins.'
    },
    {
      sectionId: 'founding-team',
      title: 'Founding Team',
      content: 'Mike Hales - Founder and CEO of Rapz, Joint-owner of First Class. Malik Jan - Founder of DeHub, former agency consultant. Rayn Barrera - Gaming and Web3 expert, co-founding Head of Community at Boss Fighters. Bailey Young - Investments and tokenomics expert, former professional gamer.'
    }
  ];

  // Filter content based on search term
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const results: SearchResult[] = [];
    const lowercaseSearch = searchTerm.toLowerCase();

    searchableContent.forEach(section => {
      const titleMatch = section.title.toLowerCase().includes(lowercaseSearch);
      const contentMatch = section.content.toLowerCase().includes(lowercaseSearch);

      if (titleMatch || contentMatch) {
        // Find the specific matching text
        let match = '';
        if (titleMatch) {
          match = section.title;
        } else {
          // Find the sentence containing the search term
          const sentences = section.content.split('. ');
          const matchingSentence = sentences.find(sentence => 
            sentence.toLowerCase().includes(lowercaseSearch)
          );
          match = matchingSentence ? matchingSentence + '.' : section.content.substring(0, 100) + '...';
        }

        results.push({
          sectionId: section.sectionId,
          title: section.title,
          content: section.content,
          match
        });
      }
    });

    return results;
  }, [searchTerm]);

  const handleResultClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      onClose();
    }
  };

  if (!isOpen) return null;

  // Mobile inline version
  if (isMobileInline) {
    return (
      <div className="w-full bg-white border-b border-gray-200">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search documentation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4"
                autoFocus
              />
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {searchResults.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No results found for "{searchTerm}"</p>
            ) : (
              <div className="space-y-3">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    onClick={() => handleResultClick(result.sectionId)}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <h4 className="font-semibold text-gray-900 mb-1">{result.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{result.match}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {searchResults.length > 0 && (
            <div className="pt-4 text-sm text-gray-500">
              Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop modal version
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search documentation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4"
                autoFocus
              />
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4">
            {searchTerm.trim() === '' ? (
              <p className="text-gray-500 text-center py-8">Start typing to search through the documentation...</p>
            ) : searchResults.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No results found for "{searchTerm}"</p>
            ) : (
              <div className="space-y-3">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    onClick={() => handleResultClick(result.sectionId)}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <h4 className="font-semibold text-gray-900 mb-1">{result.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{result.match}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {searchResults.length > 0 && (
          <div className="p-4 border-t border-gray-200 text-sm text-gray-500">
            Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentSearch;
