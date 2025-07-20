import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DocumentSearch from '@/components/DocumentSearch';

const Documents: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Track active section for navigation highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[id]');
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section) => {
        const element = section as HTMLElement;
        const offsetTop = element.offsetTop;
        const offsetHeight = element.offsetHeight;

        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(element.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    { id: 'core-concept', label: 'Core Concept' },
    { id: 'game-world', label: 'Game World' },
    { id: 'gameplay-mechanics', label: 'Gameplay' },
    { id: 'storm-cage-mechanics', label: 'Storm & Cage' },
    { id: 'progression', label: 'Progression' },
    { id: 'game-modes', label: 'Game Modes' },
    { id: 'monetization', label: 'Monetization' },
    { id: 'visuals-sound', label: 'Visuals & Sound' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'controls', label: 'Controls' },
    { id: 'combat-mechanics', label: 'Combat' },
    { id: 'weapons-inventory', label: 'Weapons' },
    { id: 'movement', label: 'Movement' },
    { id: 'map-hazards', label: 'Map & Hazards' },
    { id: 'strategy', label: 'Strategy' },
    { id: 'social-aspects', label: 'Social Features' },
    { id: 'in-game-currency', label: 'Economy' },
    { id: 'token-economy', label: 'Tokenomics' },
    { id: 'genesis-chads', label: 'Genesis Chads' },
    { id: 'airdrop-calculator', label: 'Airdrops' },
    { id: 'utility', label: 'Utility' },
    { id: 'founding-team', label: 'Team' },
    { id: 'brand-assets', label: 'Brand Assets' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Last Chad Standing</h1>
              <span className="ml-2 text-sm text-gray-500">Documentation</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex items-center gap-2"
              >
                <Search size={16} />
                Search
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="sm:hidden"
              >
                <Search size={20} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <DocumentSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)}
        isMobileInline={window.innerWidth < 640}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className={`lg:block ${isMobileMenuOpen ? 'block' : 'hidden'} lg:w-64 w-full lg:sticky lg:top-24 lg:self-start`}>
            <div className="bg-white rounded-lg shadow-sm border p-4 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
              <h3 className="font-semibold text-gray-900 mb-4">Table of Contents</h3>
              <nav className="space-y-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      activeSection === item.id
                        ? 'bg-orange-100 text-orange-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 lg:max-w-4xl">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 sm:p-8">
                <div className="prose prose-gray max-w-none">
                  
                  {/* Scrolling Announcement */}
                  <div className="mb-6 overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg border-2 border-orange-600 shadow-lg animate-pulse-glow">
                    <div className="py-3 px-4">
                      <div className="text-sm sm:text-base font-semibold text-center">
                        🔔 Airdrop calculators are out now! click airdrops in the menu or{' '}
                        <button onClick={() => {
                        const element = document.getElementById('airdrop-calculator');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }} className="underline hover:text-orange-200 transition-colors">
                        click here
                      </button>
                      {' '}to check your allocation!
                      </div>
                    </div>
                  </div>

                  {/* Core Concept */}
                  <section id="core-concept" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Core Concept</h2>
                    <p className="text-lg text-gray-700 mb-4">
                      Last Chad Standing is a high-intensity, fast paced, third person fighter battle royale. Players choose from a cast of customizable fighters, each trained in unique fight styles and abilities, in a fast-paced, melee-focused environment.
                    </p>
                    <p className="text-gray-700 mb-4">
                      The game emphasizes brutal hand-to-hand combat in an open-world island setting, with dynamic environmental hazards and blood-soaked brawls to the death. Only one Chad can remain standing, and he takes home the loot for his troubles.
                    </p>
                    <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
                      <h3 className="font-semibold text-orange-800 mb-2">Overview</h3>
                      <p className="text-orange-700">
                        Players are thrown onto the island via helicopter, scattered randomly, and must use both wits and combat prowess to survive against 19 other players. The shrinking cage forces fighters into close quarters, ensuring non stop action. Combat is visceral, utilizing a mix of strikes, grappling, weaponry, and brutal finishers.
                      </p>
                    </div>
                  </section>

                  {/* Game World & Environment */}
                  <section id="game-world" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Game World & Environment</h2>
                    <p className="text-gray-700 mb-6">
                      The map is a relatively small, derelict resort island filled with destructible environments, including beaches, dense jungles, abandoned industrial areas, and decaying urban ruins. The environment offers both vertical and horizontal exploration opportunities.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">🏖️ Beaches</h3>
                        <p className="text-blue-700 text-sm">Wide open spaces where players can be easily spotted but have more visibility.</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-800 mb-2">🌿 Jungle</h3>
                        <p className="text-green-700 text-sm">Dense cover where players can ambush or be ambushed.</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-purple-800 mb-2">🏨 Resort Ruins</h3>
                        <p className="text-purple-700 text-sm">Multi-level buildings, providing vantage points for striking down on other players.</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-800 mb-2">🏭 Industrial Complex</h3>
                        <p className="text-gray-700 text-sm">Space to camp but comes with environmental and structural hazards.</p>
                      </div>
                    </div>

                    <p className="text-gray-700">
                      There are environmental traps like collapsing floors, explosive barrels, and natural hazards such as lava flows and flooding. The environment also dynamically changes over time due to the collapsing zone, adding urgency to exploration.
                    </p>
                  </section>

                  {/* Gameplay Mechanics */}
                  <section id="gameplay-mechanics" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Gameplay Mechanics</h2>
                    
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                      <h3 className="font-semibold text-red-800 mb-2">🚁 Helicopter Drop</h3>
                      <p className="text-red-700">
                        Players are thrown out of a helicopter flying erratically over the island, with random ejection points adding an element of chaos and unpredictability to the start of each match.
                      </p>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Combat System</h3>
                    <p className="text-gray-700 mb-4">
                      Combat is the heart of Last Chad Standing. It focuses on hand-to-hand fighting with a realistic physics engine. Every hit feels weighty, and the results of brutal combat are visually emphasized with blood, broken bones, and dismemberment.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">⚡ Strikes</h4>
                        <p className="text-gray-600 text-sm mb-3">Light, heavy, and combo-based attacks. Timing and precision are key.</p>
                        
                        <h4 className="font-semibold text-gray-800 mb-2">🤼 Grappling</h4>
                        <p className="text-gray-600 text-sm mb-3">Players can perform grappling moves to counter opponents or initiate brutal finishers.</p>
                        
                        <h4 className="font-semibold text-gray-800 mb-2">🔪 Weapons</h4>
                        <p className="text-gray-600 text-sm">Found throughout the map, including blunt instruments, bladed weapons, and improvised tools. Weapons can break over time.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">💀 Fatalities</h4>
                        <p className="text-gray-600 text-sm mb-3">Each character can perform unique, gory finishers when they defeat an opponent.</p>
                        
                        <h4 className="font-semibold text-gray-800 mb-2">⭐ Special Moves</h4>
                        <p className="text-gray-600 text-sm mb-3">Each fighting style comes with their own special move.</p>
                        
                        <h4 className="font-semibold text-gray-800 mb-2">🎤 Proximity Voice Chat</h4>
                        <p className="text-gray-600 text-sm">The closer you are to your enemy, the louder you can hear their mic.</p>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Character Classes and Abilities</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      <div className="bg-red-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-red-800 mb-2">🥊 Brawler</h4>
                        <p className="text-red-700 text-sm mb-2">High strength, slow but devastating hits.</p>
                        <p className="text-red-600 text-xs font-medium">Special: Ground slam causing area damage</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-2">🥷 Ninja</h4>
                        <p className="text-purple-700 text-sm mb-2">Fast, agile, more capable of dodging attacks.</p>
                        <p className="text-purple-600 text-xs font-medium">Special: Invisibility for a short time</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">🤼 Grappler</h4>
                        <p className="text-blue-700 text-sm mb-2">Masters of throwing opponents and countering attacks.</p>
                        <p className="text-blue-600 text-xs font-medium">Special: Short dash bursts</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-2">🛡️ Brute</h4>
                        <p className="text-gray-700 text-sm mb-2">Slow but can absorb more damage and bulldoze through material.</p>
                        <p className="text-gray-600 text-xs font-medium">Special: Temporary damage immunity</p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-orange-800 mb-2">⚔️ Slayer</h4>
                        <p className="text-orange-700 text-sm mb-2">Balanced with dirty tricks.</p>
                        <p className="text-orange-600 text-xs font-medium">Special: Carry an extra weapon</p>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Shrinking Zone Mechanic</h3>
                    <p className="text-gray-700">
                      Like other battle royales, the island has a death zone that shrinks over time, forcing players into tighter quarters. The visual aesthetic is hyperrealistic, with the zone being a literal wall of steel cage that closes in from all sides. The cage deals continuous damage to anyone who touches it.
                    </p>
                  </section>

                  {/* Enhanced Storm & Cage Mechanics */}
                  <section id="storm-cage-mechanics" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Enhanced Storm & Cage Mechanics</h2>
                    <p className="text-gray-700 mb-6">
                      Last Chad Standing takes the traditional battle royale zone concept to the next level with a dynamic cage system that creates intense pressure and strategic gameplay.
                    </p>

                    <div className="bg-gray-50 p-6 rounded-lg mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">🔒 The Closing Cage</h3>
                      <p className="text-gray-700 mb-4">
                        Instead of a traditional storm or gas, Last Chad Standing features a massive steel cage that mechanically closes in from all sides of the island. This cage creates absolute barriers that reshape the battlefield with each phase.
                      </p>
                      
                      <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li><strong>Permanent Barriers:</strong> The cage creates absolute no-go zones that deal continuous damage to anyone who touches them</li>
                        <li><strong>Strategic Positioning:</strong> Players must not only avoid the cage but also consider their escape routes before being trapped</li>
                        <li><strong>Vertical Limitation:</strong> The cage extends upward, preventing any attempts to climb or fly over previously accessible areas</li>
                        <li><strong>Sound Design:</strong> The grinding, mechanical sound of the cage closing adds to the psychological pressure</li>
                        <li><strong>Damage System:</strong> Contact with the cage deals significant damage over time, making survival outside the safe zone impossible</li>
                      </ul>
                    </div>

                    <div className="bg-orange-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-orange-800 mb-4">🏟️ Final Zone Transformation</h3>
                      <p className="text-orange-700 mb-4">
                        When the cage reaches its final phase, something extraordinary happens. The remaining safe zone undergoes a dramatic transformation as the ground shifts and mechanical structures emerge from beneath the island.
                      </p>
                      
                      <h4 className="font-semibold text-orange-800 mb-2">The Final MMA Cage</h4>
                      <p className="text-orange-700 mb-3">
                        The final zone transforms into a professional MMA octagon cage, creating the ultimate arena for the last remaining fighters.
                      </p>
                      
                      <ul className="list-disc list-inside text-orange-700 space-y-1 text-sm">
                        <li><strong>Arena Transformation:</strong> The natural environment dissolves away as a regulation-sized MMA cage materializes with proper flooring, lighting, and cage walls</li>
                        <li><strong>No Escape:</strong> Once inside the final cage, there's nowhere to run</li>
                        <li><strong>Enhanced Visibility:</strong> Bright arena lighting ensures spectators can clearly see every brutal detail</li>
                        <li><strong>Crowd Simulation:</strong> The arena fills with the roar of a virtual crowd</li>
                        <li><strong>Referee Presence:</strong> A holographic referee appears to officiate the final bout</li>
                        <li><strong>Championship Stakes:</strong> The final cage fight feels like a true championship bout</li>
                      </ul>
                    </div>
                  </section>

                  {/* Progression & Customization */}
                  <section id="progression" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Progression & Customization</h2>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg mb-6">
                      <h3 className="text-xl font-semibold text-purple-800 mb-4">🎨 NFT Skins Marketplace</h3>
                      <p className="text-purple-700 mb-4">
                        The in-game skins for characters are NFTs, each with unique visual attributes that can be traded on the marketplace. These skins range from cosmetic changes like clothing, tattoos, scars, and armor, to more grotesque body modifications, giving each fighter a distinct appearance.
                      </p>
                      <p className="text-purple-700">
                        Limited-edition and rare skins are released periodically and can be earned through winning tournaments, in-game challenges, or purchased directly.
                      </p>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Character Customization</h3>
                    <p className="text-gray-700">
                      Players can customize the appearance of their characters by selecting base skins and layering accessories, clothing, and weapons. NFTs purchased from the marketplace are fully tradable and can enhance the player's appearance with unique styles, offering individuality and a sense of ownership.
                    </p>
                  </section>

                  {/* Game Modes */}
                  <section id="game-modes" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Game Modes</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-red-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-red-800 mb-2">👑 Battle Royale</h3>
                        <p className="text-red-700 text-sm">20-100 players, one winner.</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">👥 Duos</h3>
                        <p className="text-blue-700 text-sm">10-50 teams of two compete to be the last duo standing. Teamwork is key for survival.</p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-orange-800 mb-2">💀 Death Match</h3>
                        <p className="text-orange-700 text-sm">No shrinking zone, just 15 minutes of pure free-for-all mayhem. Whoever gets the most kills in the time limit wins.</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-800 mb-2">🧟 Survival Royale</h3>
                        <p className="text-green-700 text-sm">PvE/PvP mode where players must survive waves of zombies while also dealing with other players.</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-purple-800 mb-2">🏆 Tournaments</h3>
                        <p className="text-purple-700 text-sm">Monthly events with large rewards.</p>
                      </div>
                    </div>
                  </section>

                  {/* Monetization & Marketplace */}
                  <section id="monetization" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Monetization & Marketplace</h2>
                    <p className="text-gray-700 mb-6">
                      The game operates on a play-and-earn model. Players earn in-game currency by participating in matches, which can be used to buy cosmetics, skins, or lootboxes in the marketplace. All NFTs are tradable on external platforms, allowing players to buy, sell, or auction rare skins for real-world value.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-green-800 mb-2">🎁 NFT Drops</h3>
                          <p className="text-green-700 text-sm">Special skins and items are occasionally dropped for players to claim in-game or purchase from the marketplace.</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-blue-800 mb-2">🛒 In-Game Store</h3>
                          <p className="text-blue-700 text-sm">Besides skins, there are in-game items like weapons, emotes, and accessories, all purchasable with in-game or real-world currency.</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-purple-800 mb-2">🎫 Season Pass</h3>
                          <p className="text-purple-700 text-sm">Unlock exclusive items the more you play.</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-orange-800 mb-2">📦 LootBoxes</h3>
                          <p className="text-orange-700 text-sm">Players can purchase fairly randomized boxes for a chance to win rare items.</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Visuals and Sound */}
                  <section id="visuals-sound" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Visuals and Sound</h2>
                    
                    <div className="bg-red-50 p-6 rounded-lg mb-6">
                      <h3 className="text-xl font-semibold text-red-800 mb-4">🎬 Hyperrealism and Gore</h3>
                      <p className="text-red-700">
                        The game emphasizes visual fidelity with cutting-edge graphics, using realistic lighting, textures, and physics-based animations. Every punch, kick, and fatality is brought to life with intense visual effects. Blood splatters realistically, bones crack audibly, and finishing moves are rendered in excruciating detail. Dynamic weather effects like rain, thunderstorms, and night/day cycles further enhance immersion.
                      </p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-blue-800 mb-4">🔊 Sound Design</h3>
                      <p className="text-blue-700">
                        Each punch and impact has weight, with a focus on brutal, visceral sound effects—bones snapping, skin tearing, and blood splattering. Background music ranges from tense, atmospheric tunes to heart-pounding battle music, rising in intensity as the match progresses.
                      </p>
                    </div>
                  </section>

                  {/* Marketing and Launch Strategy */}
                  <section id="marketing" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Marketing and Launch Strategy</h2>
                    <p className="text-gray-700">
                      The game will launch with early access and token sales to build a dedicated community before full release. Influencers, streamers, and tournaments will drive hype and engagement, especially in the crypto and gaming communities. Post-launch, regular updates, skins, and new game modes will keep the player base engaged.
                    </p>
                    <p className="text-gray-700 mt-4">
                      Last Chad Standing is a brutal, high-octane take on the battle royale genre, offering intense, visceral combat with the unique twist of NFT ownership and customization, pushing the boundaries of what modern multiplayer games can offer.
                    </p>
                  </section>

                  {/* Basic Controls */}
                  <section id="controls" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Basic Controls</h2>
                    <p className="text-gray-700 mb-6">
                      The following are the default controls for Last Chad Standing on PC and consoles. Players can customize controls in the settings.
                    </p>

                    <div className="grid lg:grid-cols-2 gap-8">
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-blue-800 mb-4">🖥️ PC Controls</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">W/A/S/D</span>
                            <span className="text-blue-700">Move forward, left, backward, right</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Mouse Movement</span>
                            <span className="text-blue-700">Camera control</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Left Mouse Button</span>
                            <span className="text-blue-700">Punch/Combos</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Right Mouse Button</span>
                            <span className="text-blue-700">Kick/Combos</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">E</span>
                            <span className="text-blue-700">Interact (pick up items, activate objects)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">F</span>
                            <span className="text-blue-700">Grapple/Throw</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">R</span>
                            <span className="text-blue-700">Execute/Finishers (when prompt appears)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Shift</span>
                            <span className="text-blue-700">Sprint</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Spacebar</span>
                            <span className="text-blue-700">Jump</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Ctrl (Hold)</span>
                            <span className="text-blue-700">Crouch/Slide (while sprinting)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">C</span>
                            <span className="text-blue-700">Block/Parry</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">V</span>
                            <span className="text-blue-700">Quick Dodge</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">1/2/3</span>
                            <span className="text-blue-700">Weapon select (if equipped)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">G</span>
                            <span className="text-blue-700">Throw weapon</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">M</span>
                            <span className="text-blue-700">Large map (full screen)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Esc</span>
                            <span className="text-blue-700">Pause/Options</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-green-800 mb-4">🎮 Console Controls (PlayStation/Xbox)</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">Left Stick</span>
                            <span className="text-green-700">Move</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Right Stick</span>
                            <span className="text-green-700">Camera</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">R2/RT</span>
                            <span className="text-green-700">Punch/Combos</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">L2/LT</span>
                            <span className="text-green-700">Kick/Combos</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Square/X</span>
                            <span className="text-green-700">Interact</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Circle/B</span>
                            <span className="text-green-700">Grapple/Throw</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Triangle/Y</span>
                            <span className="text-green-700">Execute/Finisher</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">X/A</span>
                            <span className="text-green-700">Jump</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">R1/RB</span>
                            <span className="text-green-700">Block/Parry</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">L1/LB</span>
                            <span className="text-green-700">Quick Dodge</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">L3 (Click Left Stick)</span>
                            <span className="text-green-700">Sprint</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">R3 (Click Right Stick)</span>
                            <span className="text-green-700">Crouch/Slide</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">L1 + R1</span>
                            <span className="text-green-700">Special Ability</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Options/Menu</span>
                            <span className="text-green-700">Pause/Map</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Combat Mechanics */}
                  <section id="combat-mechanics" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Combat Mechanics</h2>
                    <p className="text-gray-700 mb-6">
                      The core of Last Chad Standing revolves around melee combat, blending fast reflexes, precise timing, and smart environmental use.
                    </p>

                    <div className="space-y-8">
                      <div className="bg-red-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-red-800 mb-4">⚔️ Attack Types</h3>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold text-red-700 mb-1">Punch/Combos (LMB/R2)</h4>
                            <p className="text-red-600 text-sm">Quick, basic attacks that deal moderate damage but are harder to counter. Ideal for rapid combos.</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-red-700 mb-1">Kick/Combos (RMB/L2)</h4>
                            <p className="text-red-600 text-sm">Slower, more powerful strikes. These can break through blocks but leave you open to counters if missed.</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-red-700 mb-1">Combos</h4>
                            <p className="text-red-600 text-sm">Chaining punch and kick attacks in various sequences triggers character-specific combos for extra damage or stuns.</p>
                            <p className="text-red-500 text-xs mt-1">Example: Punch-Punch-Kick = Overhead Slam Combo. Combos vary based on character type.</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-blue-800 mb-4">🤼 Grappling (F/Circle/B)</h3>
                        <div className="space-y-2">
                          <p><strong className="text-blue-700">Grapple:</strong> <span className="text-blue-600 text-sm">Initiate a grapple on a nearby opponent to engage in close-quarters combat.</span></p>
                          <p><strong className="text-blue-700">Throws:</strong> <span className="text-blue-600 text-sm">After a successful grapple, use directional inputs to throw your opponent into environmental hazards.</span></p>
                          <p><strong className="text-blue-700">Special Throws:</strong> <span className="text-blue-600 text-sm">Each fighter has unique throws that differ based on their fighting style.</span></p>
                        </div>
                      </div>

                      <div className="bg-green-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-green-800 mb-4">🛡️ Blocking and Parrying</h3>
                        <div className="space-y-2">
                          <p><strong className="text-green-700">Block (C/R1):</strong> <span className="text-green-600 text-sm">Deflects incoming punch attacks but depletes stamina with each hit.</span></p>
                          <p><strong className="text-green-700">Parry:</strong> <span className="text-green-600 text-sm">If timed perfectly, pressing the block button just as an opponent strikes will parry their attack, opening them up for a devastating counterattack.</span></p>
                        </div>
                      </div>

                      <div className="bg-purple-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-purple-800 mb-4">🏃 Dodging and Sprinting</h3>
                        <div className="space-y-2">
                          <p><strong className="text-purple-700">Quick Dodge (V/L1):</strong> <span className="text-purple-600 text-sm">Evade enemy attacks with a swift side step.</span></p>
                          <p><strong className="text-purple-700">Sprint (Shift/L3):</strong> <span className="text-purple-600 text-sm">Use sprint to quickly cover ground or charge towards enemies.</span></p>
                        </div>
                      </div>

                      <div className="bg-orange-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-orange-800 mb-4">⭐ Special Abilities (Q/L1 + R1)</h3>
                        <p className="text-orange-700 mb-3">Each character class has a unique special ability that recharges over time.</p>
                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                          <p><strong className="text-orange-700">Brawler:</strong> <span className="text-orange-600">Ground slam, causing area-of-effect damage</span></p>
                          <p><strong className="text-orange-700">Ninja:</strong> <span className="text-orange-600">Cloaking for a brief period of invisibility</span></p>
                          <p><strong className="text-orange-700">Brute:</strong> <span className="text-orange-600">Temporary damage immunity</span></p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">💀 Finishers (R/Triangle/Y)</h3>
                        <p className="text-gray-700 mb-3">Finishers are unique, gory executions that players can perform when an opponent's health is critically low.</p>
                        <div className="space-y-2">
                          <p><strong className="text-gray-700">Execution Prompt:</strong> <span className="text-gray-600 text-sm">When close to a low-health opponent, press the execute button to perform a brutal finishing move.</span></p>
                          <p><strong className="text-gray-700">Customization:</strong> <span className="text-gray-600 text-sm">Players can customize their finisher animations based on NFTs or earned achievements.</span></p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Weapons and Inventory */}
                  <section id="weapons-inventory" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Weapons and Inventory</h2>
                    <p className="text-gray-700 mb-6">
                      Weapons can be found throughout the island and can range from blunt instruments to branches. Players can carry up to three weapons, and each weapon has durability, meaning it can break over time.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-red-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-red-800 mb-2">🔨 Blunt Weapons</h3>
                        <p className="text-red-700 text-sm">Bats, pipes, hammers—ideal for ambushes but slower and consume extra stamina.</p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-orange-800 mb-2">🔧 Improvised Weapons</h3>
                        <p className="text-orange-700 text-sm">Found objects like bricks, chainsaws, or construction tools. Deal high damage but often have low durability and hamper mobility.</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">🪨 Throwable Weapons</h3>
                        <p className="text-blue-700 text-sm">Rocks, or even grenades (in special game modes). These can be hurled at enemies from a distance but require good aim.</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-yellow-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-yellow-800 mb-4">⚡ Weapon Durability</h3>
                        <p className="text-yellow-700">
                          Weapons have a limited lifespan. Each time you strike, durability decreases, and eventually, the weapon will break. Broken weapons can be discarded and replaced by scavenging new ones from the environment.
                        </p>
                      </div>

                      <div className="bg-green-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-green-800 mb-4">🎒 Inventory Management</h3>
                        <div className="space-y-2">
                          <p><strong className="text-green-700">Access Inventory (Tab/D-Pad):</strong> <span className="text-green-600 text-sm">Check your current weapons, items, and consumables.</span></p>
                          <p><strong className="text-green-700">Quick Weapon Swap (1/2/3 or D-Pad):</strong> <span className="text-green-600 text-sm">Instantly switch between your three equipped weapons during combat.</span></p>
                          <p><strong className="text-green-700">Health Items:</strong> <span className="text-green-600 text-sm">Consumables like bandages, fruit or med packs are found across the map. They restore health but take time to use, leaving you vulnerable to attacks.</span></p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Movement and Traversal */}
                  <section id="movement" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Movement and Traversal</h2>
                    
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-blue-800 mb-4">🏃 Basic Movement</h3>
                        <p className="text-blue-700">
                          Use the movement keys/stick to navigate the map. Movement is essential for dodging attacks and avoiding environmental hazards.
                        </p>
                      </div>

                      <div className="bg-green-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-green-800 mb-4">🧗 Jumping and Climbing (Space/X)</h3>
                        <p className="text-green-700">
                          Jump to clear obstacles or reach higher ground. Some objects are climbable, allowing players to gain an advantage through vertical positioning.
                        </p>
                      </div>

                      <div className="bg-orange-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-orange-800 mb-4">🛷 Sliding (Ctrl/R3 while Sprinting)</h3>
                        <p className="text-orange-700">
                          Perform a sliding attack while sprinting, which can knock enemies down or be used to quickly evade combat.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Map and Environmental Hazards */}
                  <section id="map-hazards" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Map and Environmental Hazards</h2>
                    <p className="text-gray-700 mb-6">
                      The island is littered with environmental traps and hazards that players can use to their advantage or avoid.
                    </p>

                    <div className="space-y-6">
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-blue-800 mb-4">🗺️ Map Overview</h3>
                        <div className="space-y-2">
                          <p><strong className="text-blue-700">Access Map (M/Options):</strong> <span className="text-blue-600 text-sm">Check the shrinking zone, your position, and possible loot locations.</span></p>
                          <p><strong className="text-blue-700">Shrinking Zone:</strong> <span className="text-blue-600 text-sm">The toxic gas zone slowly closes in over time, forcing players to move closer together. The map displays the current safe area and the next shrinking zone.</span></p>
                        </div>
                      </div>

                      <div className="bg-red-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-red-800 mb-4">⚠️ Environmental Traps</h3>
                        <div className="space-y-2">
                          <p><strong className="text-red-700">Instant Kill Hazards:</strong> <span className="text-red-600 text-sm">Spikes, Lava Pits, Acid Baths, Cliffs - Throw enemies into these hazards for instant kills.</span></p>
                          <p><strong className="text-red-700">Dynamic Weather:</strong> <span className="text-red-600 text-sm">Rain or fog can reduce visibility, making ambushes more viable.</span></p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Game Strategy */}
                  <section id="strategy" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Game Strategy</h2>
                    <p className="text-gray-700 mb-6">Here are some tactical tips to help you dominate:</p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-blue-800 mb-2">🔧 Weapon Conservation</h3>
                          <p className="text-blue-700 text-sm">Use each weapon strategically, and don't waste hits on unimportant environmental objects.</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-green-800 mb-2">⚡ Manage Stamina</h3>
                          <p className="text-green-700 text-sm">Every action (attacking, dodging, blocking) uses stamina. If your stamina runs out, you'll be slow and vulnerable.</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-red-800 mb-2">🌋 Use the Environment</h3>
                          <p className="text-red-700 text-sm">Environmental hazards can help you eliminate opponents without risking your health in direct combat.</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-purple-800 mb-2">🥊 Adapt to Opponents</h3>
                          <p className="text-purple-700 text-sm">Learn to counter different fighter styles.</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-orange-800 mb-2">🏃 Loot and Move</h3>
                          <p className="text-orange-700 text-sm">Don't stay in one place too long, especially as the zone shrinks. Loot what you need and keep moving.</p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-yellow-800 mb-2">👁️ Avoid Camping</h3>
                          <p className="text-yellow-700 text-sm">If you try and camp, you may be spotted by the audience and the only real places to hide are limited to the jungle areas.</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Social Aspects */}
                  <section id="social-aspects" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Social Aspects</h2>
                    <p className="text-gray-700 mb-6">
                      Last Chad Standing features robust social mechanics that create a truly immersive and interactive gaming experience. These features foster community engagement and add layers of strategy beyond just combat.
                    </p>

                    <div className="space-y-8">
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-blue-800 mb-4">🎤 Proximity Voice Chat</h3>
                        <p className="text-blue-700 mb-4">The game features uncensored, proximity-based voice chat that adds intense psychological warfare to combat.</p>
                        <ul className="list-disc list-inside text-blue-600 space-y-1 text-sm">
                          <li><strong>Distance-Based Audio</strong> - The closer you are to other players, the louder and clearer their voice becomes</li>
                          <li><strong>No Restrictions</strong> - Voice chat is completely uncensored, allowing for authentic trash talk, intimidation tactics, and raw emotional reactions</li>
                          <li><strong>Strategic Communication</strong> - Players can use voice chat to form temporary alliances, negotiate truces, or attempt to deceive opponents</li>
                          <li><strong>Immersive Experience</strong> - Hearing your opponent's breathing, grunts of pain, or victory cries adds visceral realism to every encounter</li>
                        </ul>
                      </div>

                      <div className="bg-purple-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-purple-800 mb-4">👁️ Spectator Mode & Live Viewing</h3>
                        <p className="text-purple-700 mb-4">Players can watch ongoing matches in real-time, creating a live entertainment ecosystem.</p>
                        <ul className="list-disc list-inside text-purple-600 space-y-1 text-sm">
                          <li><strong>Free Camera Mode</strong> - Spectators can freely roam the map or follow specific players</li>
                          <li><strong>Multiple View Options</strong> - Switch between first-person, third-person, and cinematic camera angles</li>
                          <li><strong>Live Commentary</strong> - Spectators can provide real-time commentary and reactions via text chat</li>
                          <li><strong>Highlight Clips</strong> - Automatically capture and share the most brutal moments and epic finishers</li>
                        </ul>
                      </div>

                      <div className="bg-green-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-green-800 mb-4">📦 Care Packages & Player Support</h3>
                        <p className="text-green-700 mb-4">Spectators can directly influence ongoing matches by purchasing care packages for their favorite fighters.</p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-green-700 mb-2">Package Types:</h4>
                            <ul className="list-disc list-inside text-green-600 space-y-1 text-sm">
                              <li><strong>Weapon Drops</strong> - Send high-quality weapons, armor, or consumables</li>
                              <li><strong>Health Packs</strong> - Purchase medical supplies that can be airdropped to injured fighters</li>
                              <li><strong>Special Equipment</strong> - Provide temporary buffs, protective gear, or rare weapons</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-green-700 mb-2">Strategic Elements:</h4>
                            <ul className="list-disc list-inside text-green-600 space-y-1 text-sm">
                              <li><strong>Strategic Timing</strong> - Care packages must be strategically timed</li>
                              <li><strong>Cost Scaling</strong> - Care package prices increase as the match progresses</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="bg-orange-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-orange-800 mb-4">💰 Fighter Backing & Reward Sharing</h3>
                        <p className="text-orange-700 mb-4">Players can financially back fighters before matches begin, sharing in the spoils of victory.</p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-orange-700 mb-2">Betting System:</h4>
                            <ul className="list-disc list-inside text-orange-600 space-y-1 text-sm">
                              <li><strong>Pre-Match Betting</strong> - Back your favorite fighter with real currency or in-game tokens</li>
                              <li><strong>Reward Pool Distribution</strong> - When your backed fighter wins, you receive a percentage of the total match reward pool</li>
                              <li><strong>Dynamic Odds</strong> - Backing odds change in real-time based on fighter performance</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-orange-700 mb-2">Advanced Features:</h4>
                            <ul className="list-disc list-inside text-orange-600 space-y-1 text-sm">
                              <li><strong>Multiple Fighters</strong> - Diversify your bets by backing multiple fighters</li>
                              <li><strong>Backer Leaderboards</strong> - Track the most successful backers</li>
                              <li><strong>Exclusive Rewards</strong> - Top backers gain access to exclusive NFT drops</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="bg-red-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-red-800 mb-4">🚀 Social Feedback Loops and Virality</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-red-700 mb-2">Content Creation:</h4>
                            <ul className="list-disc list-inside text-red-600 space-y-1 text-sm">
                              <li><strong>Highlight Generation</strong> - Epic moments are automatically captured and packaged into shareable clips</li>
                              <li><strong>Performance Analytics</strong> - Detailed post-match breakdowns show combat effectiveness, crowd support metrics, and backing profits</li>
                              <li><strong>Viral Challenges</strong> - Weekly community challenges and trending hashtags drive social media engagement</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-red-700 mb-2">Platform Integration:</h4>
                            <ul className="list-disc list-inside text-red-600 space-y-1 text-sm">
                              <li><strong>Streamer Integration</strong> - Built-in streaming tools with automated highlights</li>
                              <li><strong>Social Proof Mechanics</strong> - Display of backer counts, spectator numbers, and social media mentions</li>
                              <li><strong>Cross-Platform Sharing</strong> - Seamless integration with TikTok, Twitter, Instagram, and Discord</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">👥 Community Features</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                              <li><strong>Fighter Profiles</strong> - Detailed statistics, win/loss records, and fighting style breakdowns</li>
                              <li><strong>Replay System</strong> - Watch and share epic moments from past matches with full camera control</li>
                              <li><strong>Tournament Brackets</strong> - Follow major tournaments and championship events with real-time bracket updates</li>
                            </ul>
                          </div>
                          <div>
                            <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                              <li><strong>Social Media Integration</strong> - Share highlights, backing successes, and epic moments directly to social platforms</li>
                              <li><strong>Influencer Partnerships</strong> - Exclusive fighter skins and tournaments for content creators</li>
                              <li><strong>Community Rewards</strong> - Group achievements and milestones that reward the entire community</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Economy - Coins */}
                  <section id="in-game-currency" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Economy - Coins</h2>
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg">
                      <p className="text-gray-700 mb-4">
                        Every game needs in-game currency, but ours is unique compared to most games because it's decentralized and has a set supply, giving fighters real ownership without manipulation from developers.
                      </p>
                      <p className="text-gray-700">
                        Unlike traditional games where developers can inflate currency at will, our coins operate on blockchain technology with transparent tokenomics. This means fighters truly own their digital assets and can trade them freely without fear of arbitrary changes to the game's economy. The decentralized nature ensures that the value of fighter investments is protected by smart contracts rather than corporate decisions.
                      </p>
                    </div>
                  </section>

                  {/* Token Distribution */}
                  <section id="token-economy" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Token Distribution</h2>
                    <div className="bg-blue-50 p-6 rounded-lg mb-6">
                      <h3 className="text-xl font-semibold text-blue-800 mb-4">📊 Total Supply: 100,000,000,000 coins</h3>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-800 mb-2">👥 Public: 30%</h3>
                        <p className="text-green-700 text-sm mb-1">30B coins</p>
                        <p className="text-green-600 text-xs">100% unlock at TGE</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-purple-800 mb-2">👨‍💼 Team: 15%</h3>
                        <p className="text-purple-700 text-sm mb-1">15B coins</p>
                        <p className="text-purple-600 text-xs">12 month cliff + 20% daily linear per year</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">🏛️ Foundation: 15%</h3>
                        <p className="text-blue-700 text-sm mb-1">15B coins</p>
                        <p className="text-blue-600 text-xs">20% a year linear daily</p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-orange-800 mb-2">🎁 Airdrops: 15%</h3>
                        <p className="text-orange-700 text-sm mb-1">15B coins</p>
                        <p className="text-orange-600 text-xs">100% TGE unlock</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-red-800 mb-2">🎮 Ecosystem Rewards: 10%</h3>
                        <p className="text-red-700 text-sm mb-1">10B coins</p>
                        <p className="text-red-600 text-xs">20% per year daily linear</p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-yellow-800 mb-2">💧 LP: 10%</h3>
                        <p className="text-yellow-700 text-sm mb-1">10B coins</p>
                        <p className="text-yellow-600 text-xs">100% TGE unlock</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-800 mb-2">🤝 Advisors: 5%</h3>
                        <p className="text-gray-700 text-sm mb-1">5B coins</p>
                        <p className="text-gray-600 text-xs">12 month cliff + 20% daily linear per year</p>
                      </div>
                    </div>
                  </section>

                  {/* Genesis Chads */}
                  <section id="genesis-chads" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Genesis Chads</h2>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg mb-6">
                      <p className="text-gray-700 mb-4">
                        The Genesis Chads collection represents the original foundation of the Lean Chad ecosystem, featuring uniquely hand-drawn cartoon characters created by founder Mike Hales in 2022. Each Chad was meticulously crafted with distinctive traits and personalities, forming the cornerstone of what would become a revolutionary gaming and NFT experience.
                      </p>
                      <p className="text-gray-700 mb-4">
                        These aren't just static collectibles—they're dynamic assets designed for utility and engagement. Each Genesis Chad will be progressively introduced to the in-game skins marketplace, where they'll be transformed into stunning 3D models ready for use across various gaming environments.
                      </p>
                      <p className="text-gray-700">
                        The tokenomics behind Genesis Chads create a sustainable revenue-sharing ecosystem. When these 3D skins are purchased or traded on secondary markets, the original holders receive a portion of the revenue, establishing a continuous income stream that rewards early supporters and creates long-term value for the community.
                      </p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg mb-6">
                      <h3 className="text-xl font-semibold text-blue-800 mb-4">🎁 Airdrop Eligibility</h3>
                      <p className="text-blue-700 mb-4">
                        Beyond their utility in gaming, Genesis Chad holders—along with owners of any tier passes—are eligible for exclusive airdrops of $LCS tokens.
                      </p>
                      
                      <h4 className="font-semibold text-blue-700 mb-3">Collections:</h4>
                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <ul className="list-disc list-inside text-blue-600 space-y-1">
                          <li>Genesis Chads</li>
                          <li>Honorary Chads</li>
                          <li>All Access Pass</li>
                        </ul>
                        <ul className="list-disc list-inside text-blue-600 space-y-1">
                          <li>VIP Pass</li>
                          <li>Elite Pass</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-green-800 mb-4">📊 Airdrop Distribution</h3>
                      <p className="text-green-700 mb-3">5% of the supply is divided between:</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium text-green-700">Genesis Chads</span>
                            <span className="text-green-600">2%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-green-700">Honorary Chads</span>
                            <span className="text-green-600">0.25%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-green-700">All Access Pass</span>
                            <span className="text-green-600">0.25%</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium text-green-700">VIP Pass</span>
                            <span className="text-green-600">1%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-green-700">Elite Pass</span>
                            <span className="text-green-600">1.5%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Airdrop Calculator */}
                  <section id="airdrop-calculator" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Airdrop Calculator</h2>
                    
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mb-8">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">🎯 Calculate Your Share</h3>
                      <p className="text-gray-700 mb-4">
                        Calculate your share of the <strong>5,000,000,000 token airdrop</strong> based on your NFT holdings.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Total Token Supply:</strong> 100,000,000,000</p>
                          <p><strong>Airdrop Allocation:</strong> 5% (5,000,000,000 tokens)</p>
                        </div>
                        <div>
                          <p className="text-gray-600">NFT Collections supply counts and allocation details.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-lg mb-8">
                      <h3 className="text-xl font-semibold text-purple-800 mb-4">🤝 DeHub Partner Airdrop</h3>
                      <p className="text-purple-700 mb-4">
                        As the builders behind the LCS game, <strong>10% of the supply</strong> is reserved for the DeHub community.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-purple-600 text-sm mb-2"><strong>7.5%</strong> for stakers</p>
                          <p className="text-purple-600 text-sm"><strong>2.5%</strong> for holders</p>
                        </div>
                        <div>
                          <p className="text-purple-600 text-sm">Calculate your DeHub allocation based on your $DHB holdings and staked amounts.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 p-6 rounded-lg mb-8">
                      <h3 className="text-xl font-semibold text-orange-800 mb-4">📈 DeHub Airdrop Calculator</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-orange-700 mb-3">Allocation Details:</h4>
                          <ul className="space-y-2 text-sm">
                            <li><strong className="text-orange-700">Total DeHub Allocation:</strong> <span className="text-orange-600">10% (10,000,000,000 tokens)</span></li>
                            <li><strong className="text-orange-700">Stakers Pool:</strong> <span className="text-orange-600">7.5% (7,500,000,000 tokens)</span></li>
                            <li><strong className="text-orange-700">Holders Pool:</strong> <span className="text-orange-600">2.5% (2,500,000,000 tokens)</span></li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-orange-700 mb-3">Bonus Multipliers:</h4>
                          <ul className="space-y-2 text-sm">
                            <li><strong className="text-orange-700">OG Bonus:</strong> <span className="text-orange-600">2x multiplier for stakers since launch</span></li>
                            <li><strong className="text-orange-700">Veteran Bonus:</strong> <span className="text-orange-600">1.3x multiplier for stakers before Nov 16, 2024</span></li>
                          </ul>
                          <p className="text-orange-500 text-xs mt-2">Note: Bonuses are mutually exclusive (no stacking)</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">💰 Estimated TGE Price</h3>
                        <p className="text-2xl font-bold text-green-600">$0.0002</p>
                      </div>
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-800 mb-4">🎁 Staking Bonuses</h3>
                        <div className="space-y-2 text-sm">
                          <p><strong className="text-blue-700">OG Bonus:</strong> <span className="text-blue-600">Staked since launch (+100%)</span></p>
                          <p><strong className="text-blue-700">Veteran Bonus:</strong> <span className="text-blue-600">Staked before Nov 16th, 2024 (+30%)</span></p>
                        </div>
                        <p className="text-blue-500 text-xs mt-3">For users who have been staking $DHB since the protocol launch or before November 16th, 2024.</p>
                      </div>
                    </div>
                  </section>

                  {/* Utility */}
                  <section id="utility" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Utility</h2>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-800 mb-2">💰 In-Game Currency</h3>
                        <p className="text-green-700 text-sm">Buy or sell skins from the store or secondary marketplace directly with other players.</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-purple-800 mb-2">🏆 Tournament Entry</h3>
                        <p className="text-purple-700 text-sm">Access events and experiences, from tournaments to socials.</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">🗳️ Governance</h3>
                        <p className="text-blue-700 text-sm">Voting on game features and updates.</p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-orange-800 mb-2">📈 Staking Rewards</h3>
                        <p className="text-orange-700 text-sm">Earn additional coins by staking.</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-red-800 mb-2">📦 Care Packages</h3>
                        <p className="text-red-700 text-sm">Send support items to players.</p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-yellow-800 mb-2">🎯 Back Fighters</h3>
                        <p className="text-yellow-700 text-sm">Support fighters with coins and share the loot if you win. However, if your fighter loses, you get nothing but shame.</p>
                      </div>
                    </div>
                  </section>

                  {/* Founding Team */}
                  <section id="founding-team" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Founding Team</h2>
                    
                    <div className="space-y-8">
                      <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center">
                            <span className="text-red-800 font-bold text-xl">MH</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-red-800 mb-2">Mike Hales</h3>
                            <div className="space-y-2 text-sm text-red-700">
                              <p>• Founder and CEO of <strong>Rapz</strong>, a notable high end MMA fightwear brand backed by top UFC and boxing stars, with exclusive supplier rights to BKFC</p>
                              <p>• Joint-owner of <strong>First Class</strong>, the UK's largest TikTok partner agency, approaching 1000 streamers signed on and reporting directly for the in-house executive team with offices in the UK and Asia</p>
                              <p>• Professional MMA fighter with profiles on Tapology and ESPN</p>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">TikTok</span>
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Instagram</span>
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Twitter</span>
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Email</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                            <span className="text-blue-800 font-bold text-xl">MJ</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-blue-800 mb-2">Malik Jan AKA mal.eth</h3>
                            <div className="space-y-2 text-sm text-blue-700">
                              <p>• Founder of <strong>DeHub (DHB)</strong> which Malik bootstrapped from 690k to 600m FDV with a ~1000x ROI at peak last bull run, amassing 50,000 holders and close to $10m in the LP, with over $1m in on-chain revenue and $1m in distributed rewards</p>
                              <p>• Former top billing agent at UK's largest agency, <strong>Blue Arrow</strong> and Senior Consultant at World's largest agency <strong>Randstad</strong></p>
                              <p>• Raised 7 figures for <strong>Guide Dogs Charity</strong> during tenure as fundraising manager</p>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Twitter</span>
                              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">LinkedIn</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center">
                            <span className="text-green-800 font-bold text-xl">RB</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-green-800 mb-2">Rayn Barrera AKA RaynRaps</h3>
                            <div className="space-y-2 text-sm text-green-700">
                              <p>• Gaming and Web3 expert with over ten years in community growth and game development</p>
                              <p>• Currently a co-founding Head of Community at <strong>Boss Fighters</strong>, Backed by Decentraland & Open Loot, the makers of Big Time</p>
                              <p>• As Founder of <strong>UP LVL</strong>, a gaming and Web3 consulting firm, he's partnered with Ubisoft, Riot Games, Twitch and other leading industry giants</p>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">Twitch</span>
                              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">YouTube</span>
                              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">Instagram</span>
                              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">Twitter</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center">
                            <span className="text-purple-800 font-bold text-xl">BY</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-purple-800 mb-2">Bailey Young</h3>
                            <div className="space-y-2 text-sm text-purple-700">
                              <p>• Investments and tokenomics expert who played an instrumental role in the astronomic growth of <strong>DeHub</strong> in 2021, and oversaw the <strong>Blocjerk</strong> fundraise of $1,000,000 in 2023 which gave a peak ROI of 1,000%</p>
                              <p>• Former professional gamer, ranking globally in the top 3 COD MW2 and top 100 on Warzone under the tag <strong>RickyBobby</strong></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Brand Assets */}
                  <section id="brand-assets" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Brand Assets</h2>
                    <p className="text-gray-700 mb-6">
                      Download official Last Chad Standing brand assets for your use. All assets are provided in high quality formats.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-blue-50 p-6 rounded-lg text-center">
                        <div className="w-16 h-16 bg-blue-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                          <Download className="text-blue-600" size={24} />
                        </div>
                        <h3 className="font-semibold text-blue-800 mb-2">Logo Text</h3>
                        <p className="text-blue-700 text-sm mb-4">Official Last Chad Standing text logo</p>
                        <Button variant="outline" size="sm" className="text-blue-600 border-blue-300 hover:bg-blue-100">
                          Download
                        </Button>
                      </div>
                      
                      <div className="bg-red-50 p-6 rounded-lg text-center">
                        <div className="w-16 h-16 bg-red-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                          <Download className="text-red-600" size={24} />
                        </div>
                        <h3 className="font-semibold text-red-800 mb-2">Fist Logo</h3>
                        <p className="text-red-700 text-sm mb-4">LCS fist emblem logo</p>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-100">
                          Download
                        </Button>
                      </div>
                      
                      <div className="bg-orange-50 p-6 rounded-lg text-center">
                        <div className="w-16 h-16 bg-orange-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                          <Download className="text-orange-600" size={24} />
                        </div>
                        <h3 className="font-semibold text-orange-800 mb-2">LCS Letters</h3>
                        <p className="text-orange-700 text-sm mb-4">LCS abbreviated letter logo</p>
                        <Button variant="outline" size="sm" className="text-orange-600 border-orange-300 hover:bg-orange-100">
                          Download
                        </Button>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Usage Guidelines</h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>These assets are for promotional and community use</li>
                        <li>Do not modify the logos without permission</li>
                        <li>Maintain proper spacing and proportions</li>
                        <li>Contact us for custom formats or additional assets</li>
                      </ul>
                    </div>
                  </section>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
