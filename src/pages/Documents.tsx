
import React, { useState, useMemo } from 'react';
import { ArrowLeft, UserCheck, Gamepad2, DollarSign, ExternalLink, Search, Mail, Download, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TokenDistributionChart from '@/components/TokenDistributionChart';
import DocumentSearch from '@/components/DocumentSearch';

const Documents = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Calculator state
  const [holdings, setHoldings] = useState({
    genesisDads: 0,
    honoraryChads: 0,
    allAccessPass: 0,
    vipPass: 0,
    elitePass: 0,
  });

  // NFT Collection Data
  const collections = {
    genesisDads: { name: 'Genesis Chads', supply: 2076 },
    honoraryChads: { name: 'Honorary Chads', supply: 15 },
    allAccessPass: { name: 'All Access Pass', supply: 881 },
    vipPass: { name: 'VIP Pass', supply: 245 },
    elitePass: { name: 'Elite Pass', supply: 82 },
  };

  // Airdrop Constants
  const TOTAL_AIRDROP = 5_000_000_000; // 5% of 100,000,000,000

  // Calculate tokens per NFT for each collection based on allocation percentages
  const tokensPerNFT = useMemo(() => {
    const TOTAL_SUPPLY = 100_000_000_000; // Total token supply
    const allocations = {
      genesisDads: 0.02 * TOTAL_SUPPLY, // 2% = 2,000,000,000 tokens
      honoraryChads: 0.0025 * TOTAL_SUPPLY, // 0.25% = 250,000,000 tokens
      allAccessPass: 0.0025 * TOTAL_SUPPLY, // 0.25% = 250,000,000 tokens
      elitePass: 0.01 * TOTAL_SUPPLY, // 1% = 1,000,000,000 tokens
      vipPass: 0.015 * TOTAL_SUPPLY, // 1.5% = 1,500,000,000 tokens
    };
    
    return Object.entries(collections).reduce((acc, [key, collection]) => {
      acc[key] = allocations[key as keyof typeof allocations] / collection.supply;
      return acc;
    }, {} as Record<string, number>);
  }, []);

  // Calculate user's total allocation
  const userAllocation = useMemo(() => {
    return Object.entries(holdings).reduce((total, [key, amount]) => {
      return total + (amount * tokensPerNFT[key]);
    }, 0);
  }, [holdings, tokensPerNFT]);

  const handleInputChange = (collection: string, value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    setHoldings(prev => ({
      ...prev,
      [collection]: numValue
    }));
  };

  const clearAll = () => {
    setHoldings({
      genesisDads: 0,
      honoraryChads: 0,
      allAccessPass: 0,
      vipPass: 0,
      elitePass: 0,
    });
  };
  const handleSearchClick = () => {
    // Check if mobile
    if (window.innerWidth < 640) {
      setIsMobileSearchOpen(true);
    } else {
      setIsSearchOpen(true);
    }
  };
  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setIsMobileSearchOpen(false);
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const documentSections = [{
    title: "Game Overview",
    icon: <Gamepad2 size={20} />,
    items: [{
      title: "Core Concept",
      href: "#core-concept"
    }, {
      title: "Game World & Environment",
      href: "#game-world"
    }, {
      title: "Gameplay Mechanics",
      href: "#gameplay-mechanics"
    }, {
      title: "Enhanced Zone Mechanics",
      href: "#storm-cage-mechanics"
    }, {
      title: "Progression & Customization",
      href: "#progression"
    }, {
      title: "Game Modes",
      href: "#game-modes"
    }, {
      title: "Monetization & Marketplace",
      href: "#monetization"
    }, {
      title: "Visuals and Sound",
      href: "#visuals-sound"
    }, {
      title: "Marketing Strategy",
      href: "#marketing"
    }, {
      title: "Controls",
      href: "#controls"
    }, {
      title: "Combat Mechanics",
      href: "#combat-mechanics"
    }, {
      title: "Weapons & Inventory",
      href: "#weapons-inventory"
    }, {
      title: "Movement & Traversal",
      href: "#movement"
    }, {
      title: "Map & Hazards",
      href: "#map-hazards"
    }, {
      title: "Strategy",
      href: "#strategy"
    }, {
      title: "Social Aspects",
      href: "#social-aspects"
    }]
  }, {
    title: "Economy",
    icon: <DollarSign size={20} />,
    items: [{
      title: "Coins",
      href: "#in-game-currency"
    }, {
      title: "Distribution",
      href: "#token-economy"
    }, {
      title: "Genesis Chads",
      href: "#genesis-chads"
    }, {
      title: "Utility",
      href: "#utility"
    }]
  }, {
    title: "Team",
    icon: <UserCheck size={20} />,
    items: [{
      title: "Founding Team",
      href: "#founding-team"
    }]
  }, {
    title: "Brand",
    icon: <Palette size={20} />,
    items: [{
      title: "Assets",
      href: "#brand-assets"
    }]
  }, {
    title: "Links",
    icon: <ExternalLink size={20} />,
    items: [{
      title: "Email",
      href: "mailto:chads@lastchadstanding.com"
    }, {
      title: "Instagram",
      href: "https://instagram.com/lastchadstanding"
    }, {
      title: "X (Twitter)",
      href: "https://x.com/lcs_game"
    }, {
      title: "LCFC",
      href: "https://leanchadfight.club"
    }]
  }];
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" asChild className="flex items-center gap-2">
                  <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                    <ArrowLeft size={20} />
                    <span className="hidden sm:inline">Back</span>
                  </Link>
                </Button>
                
                <h1 className="text-xl font-semibold text-gray-900 hidden sm:block">Fight Paper</h1>
              </div>
              
              {/* Logo in the middle - visible on all screen sizes */}
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <img src="/lovable-uploads/896892f1-7ebc-4852-acea-80dcdbf7c545.png" alt="Last Chad Standing Logo" className="h-14 w-auto opacity-90" />
              </div>
              
              <Button variant="outline" size="sm" onClick={handleSearchClick} className="flex items-center gap-2">
                <Search size={16} />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden sm:inline-flex pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  ⌘K
                </kbd>
              </Button>
            </div>
          </div>
        </header>

        {/* Mobile Search Inline */}
        {isMobileSearchOpen && <DocumentSearch isOpen={isMobileSearchOpen} onClose={handleSearchClose} isMobileInline={true} />}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 h-[calc(100vh-8rem)]">
                <ScrollArea className="h-full [&>[data-radix-scroll-area-viewport]]:!overflow-x-hidden [&>div>div[style]]:!scrollbar-none">
                  <nav className="space-y-6 pr-4">
                    {documentSections.map(section => <div key={section.title} className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-900 font-medium">
                          {section.icon}
                          <span>{section.title}</span>
                        </div>
                        <ul className="space-y-2 ml-6">
                          {section.items.map(item => <li key={item.title}>
                              {item.href.startsWith('http') ? <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors text-sm flex items-center gap-1">
                                  {item.title}
                                  <ExternalLink size={12} />
                                </a> : <a href={item.href} className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                                  {item.title}
                                </a>}
                            </li>)}
                        </ul>
                      </div>)}
                  </nav>
                </ScrollArea>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <ScrollArea className="h-[calc(100vh-8rem)]">
                  <div className="p-8">
                    <div className="prose prose-gray max-w-none">
                      
                      {/* Game Blueprint Header */}
                      <div className="mb-12 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Game Blueprint: Last Chad Standing</h1>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div><strong>Genre:</strong> Third-Person Fighter Battle Royale</div>
                          <div><strong>Players:</strong> 20-100 players per lobby</div>
                          <div><strong>Platforms:</strong> PC, next-gen consoles</div>
                          <div><strong>Rating:</strong> Mature audiences (PEGI 18+)</div>
                        </div>
                      </div>

                      {/* Core Concept */}
                      <section id="core-concept" className="mb-12">
                        <h2 className="text-4xl font-bold">1. Core Concept</h2>
                        <p>Last Chad Standing is a high-intensity, fast paced, third person fighter battle royale. Players choose from a cast of customizable fighters, each trained in unique fight styles and abilities, in a fast-paced, melee-focused environment. The game emphasizes brutal hand-to-hand combat in an open-world island setting, with dynamic environmental hazards and blood-soaked brawls to the death. Only one Chad can remain standing, and he takes home the loot for his troubles.</p>
                        
                        <br />
                        
                        <h3 className="font-bold">Overview</h3>
                        <p>Players are thrown onto the island via helicopter, scattered randomly, and must use both wits and combat prowess to survive against 19 other players. The shrinking cage forces fighters into close quarters, ensuring non stop action. Combat is visceral, utilizing a mix of strikes, grappling, weaponry, and brutal finishers.</p>
                      </section>

                      {/* Helicopter Drop Image */}
                      <div className="my-8 w-full">
                        <img src="/lovable-uploads/1615e7da-29d5-454e-a2fe-57f5abf91d56.png" alt="Helicopter dropping players onto the island" className="w-full h-auto rounded-lg shadow-md" />
                      </div>

                      {/* Game World */}
                      <section id="game-world" className="mb-12">
                        <h2 className="text-3xl font-bold">2. Game World & Environment</h2>
                        <h3 className="text-2xl font-bold"></h3>
                        <p>The map is a relatively small, derelict resort island filled with destructible environments, including beaches, dense jungles, abandoned industrial areas, and decaying urban ruins. The environment offers both vertical and horizontal exploration opportunities, such as:</p>
                        <ul>
                          <li><strong>Beaches:</strong> Wide open spaces where players can be easily spotted but have more visibility.</li>
                          <li><strong>Jungle:</strong> Dense cover where players can ambush or be ambushed.</li>
                          <li><strong>Resort Ruins:</strong> Multi-level buildings, providing vantage points for striking down on other players.</li>
                          <li><strong>Industrial Complex:</strong> Space to camp but comes with environmental and structural hazards</li>
                        </ul>
                        <p>There are environmental traps like collapsing floors, explosive barrels, and natural hazards (e.g., lava flows, flooding). The environment also dynamically changes over time due to the collapsing zone, adding urgency to exploration.</p>
                      </section>

                      {/* Aerial Drop Combat Image */}
                      <div className="my-8 w-full">
                        <img src="/lovable-uploads/b31c9ab4-6dcf-4a77-bdf6-7e82e5a8c66a.png" alt="Aerial view of combat on the island" className="w-full h-auto rounded-lg shadow-md" />
                      </div>

                      {/* Gameplay Mechanics */}
                      <section id="gameplay-mechanics" className="mb-12">
                        <h2 className="text-3xl font-bold">3. Gameplay Mechanics</h2>
                        
                        
                        <p>Players are thrown out of a helicopter flying erratically over the island, with random ejection points adding an element of chaos and unpredictability to the start of each match.</p>

                        <br />

                        <br />

                        <h3 className="text-2xl font-bold">Combat System</h3>
                        <p>Combat is the heart of Last Chad Standing. It focuses on hand-to-hand fighting with a realistic physics engine. Every hit feels weighty, and the results of brutal combat are visually emphasized with blood, broken bones, and dismemberment.</p>
                        <ul>
                          <li><strong>Strikes:</strong> Light, heavy, and combo-based attacks. Timing and precision are key.</li>
                          <li><strong>Grappling:</strong> Players can perform grappling moves to counter opponents or initiate brutal finishers.</li>
                          <li><strong>Weapons:</strong> Found throughout the map, including blunt instruments (bats, pipes), bladed weapons (machetes), and improvised tools (shards of glass, branch). Weapons can break over time, forcing players to fight bare-handed or seek new ones.</li>
                          <li><strong>Fatalities:</strong> Each character can perform unique, gory finishers when they defeat an opponent. Finishers range from decapitations to brutal bone-breaking maneuvers, depending on the character's style.</li>
                          <li><strong>Special Moves:</strong> Each fighting style comes with their own special move.</li>
                          <li><strong>Proximity Voice Chat:</strong> The closer you are to your enemy, the louder you can hear their mic.</li>
                        </ul>

                        <br />

                        <h3 className="text-2xl font-bold">Character Classes and Abilities</h3>
                        <p>Fighters choose from different martial arts backgrounds, with varied stats (speed, strength, stamina) and special abilities:</p>
                        <ul>
                          <li><strong>Brawler:</strong> High strength, slow but devastating hits. Special Ability: Ground slam causing area damage or breaking through material</li>
                          <li><strong>Ninja:</strong> Fast, agile, more capable of dodging attacks. Special Ability: Invisibility for a short time.</li>
                          <li><strong>Grappler:</strong> Masters of throwing opponents and countering attacks. Special Ability: Short dash bursts</li>
                          <li><strong>Brute:</strong> Slow but can absorb more damage than others and bulldoze through most material or dense jungle shrub. Special Ability: Temporary damage immunity.</li>
                          <li><strong>Slayer:</strong> Balanced with dirty tricks up his sleeve. Special Ability: Carry an extra weapon.</li>
                        </ul>

                        <br />

                        <h3 className="text-2xl font-bold">Shrinking Zone Mechanic</h3>
                        <p>Like other battle royales, the island has a "death zone" that shrinks over time, forcing players into tighter quarters. The visual aesthetic is hyperrealistic, with the zone being a literal wall of steel cage that closes in from all sides. As it closes in, players are forced to fight or flee, and those caught in the cage slowly take damage until they die if they don't escape. The cage deals continuous damage to anyone who touches it, making it impossible to survive outside the safe zone for more than a few seconds.</p>
                      </section>

                      {/* Enhanced Zone Mechanics */}
                      <section id="storm-cage-mechanics" className="mb-12">
                        <br />

                        <h2 className="text-3xl font-bold">4. Enhanced Zone Mechanics</h2>
                        <p>Last Chad Standing takes the traditional battle royale zone concept to the next level with a dynamic cage system that creates intense pressure and strategic gameplay.</p>
                        
                        <br />

                        <h3 className="text-2xl font-bold">The Closing Cage</h3>
                        <p>Instead of a traditional storm or gas, Last Chad Standing features a massive steel cage that mechanically closes in from all sides of the island. This cage creates absolute barriers that reshape the battlefield with each phase.</p>
                        <ul>
                          <li><strong>Permanent Barriers:</strong> The cage creates absolute no-go zones that deal continuous damage to anyone who touches them</li>
                          <li><strong>Strategic Positioning:</strong> Players must not only avoid the cage but also consider their escape routes before being trapped</li>
                          <li><strong>Vertical Limitation:</strong> The cage extends upward, preventing any attempts to climb or fly over previously accessible areas</li>
                          <li><strong>Sound Design:</strong> The grinding, mechanical sound of the cage closing adds to the psychological pressure</li>
                          <li><strong>Damage System:</strong> Contact with the cage deals significant damage over time, making survival outside the safe zone impossible</li>
                        </ul>

                        <br />

                        <h3 className="text-2xl font-bold">Final Zone Transformation</h3>
                        <p>When the cage reaches its final phase - the smallest safe zone - something extraordinary happens. The remaining safe zone undergoes a dramatic transformation as the ground shifts and mechanical structures emerge from beneath the island.</p>
                        
                        <br />

                        <h3 className="text-2xl font-bold">The Final MMA Cage</h3>
                        <p>The final zone transforms into a professional MMA octagon cage, creating the ultimate arena for the last remaining fighters. This transformation marks the transition from survival-based gameplay to pure, brutal combat.</p>
                        <ul>
                          <li><strong>Arena Transformation:</strong> The natural environment dissolves away as a regulation-sized MMA cage materializes with proper flooring, lighting, and cage walls</li>
                          <li><strong>No Escape:</strong> Once inside the final cage, there's nowhere to run - fighters must face each other in direct combat until only one remains</li>
                          <li><strong>Enhanced Visibility:</strong> Bright arena lighting ensures spectators can clearly see every brutal detail of the final confrontation</li>
                          <li><strong>Crowd Simulation:</strong> The arena fills with the roar of a virtual crowd, creating an authentic championship fight atmosphere</li>
                          <li><strong>Referee Presence:</strong> A holographic referee appears to officiate the final bout, adding legitimacy to the ultimate showdown</li>
                          <li><strong>Championship Stakes:</strong> The final cage fight feels like a true championship bout, with maximum rewards for the victor</li>
                        </ul>

                        <br />

                        <h3 className="text-2xl font-bold">Tactical Implications</h3>
                        <p>This cage system creates unique strategic considerations throughout the match:</p>
                        <ul>
                          <li><strong>Early Game:</strong> Players must balance looting with positioning to avoid being trapped by the advancing cage</li>
                          <li><strong>Mid Game:</strong> The permanent barriers created by previous cage advances force players into increasingly predictable paths</li>
                          <li><strong>Late Game:</strong> Knowing that the final zone becomes a cage adds pressure to eliminate opponents before reaching the final confrontation</li>
                          <li><strong>Final Showdown:</strong> The MMA cage ensures that the last fight is always an epic, unavoidable battle between the final survivors</li>
                        </ul>
                      </section>

                      {/* Progression & Customization */}
                      <section id="progression" className="mb-12">

                        <br />

                        <h2 className="text-3xl font-bold">5. Progression & Customization</h2>
                        
                        <br />
                        
                        <br />

                        <h3 className="text-2xl font-bold">NFT Skins Marketplace</h3>
                        <p>The in-game skins for characters are NFTs, each with unique visual attributes that can be traded on the marketplace. These skins range from cosmetic changes like clothing, tattoos, scars, and armor, to more grotesque body modifications, giving each fighter a distinct appearance. Limited-edition and rare skins are released periodically and can be earned through winning tournaments, in-game challenges, or purchased directly.</p>

                        <br />

                        <h3 className="text-2xl font-bold">Character Customization</h3>
                        <p>Players can customize the appearance of their characters by selecting base skins and layering accessories, clothing, and weapons. NFTs purchased from the marketplace are fully tradable and can enhance the player's appearance with unique styles, offering individuality and a sense of ownership.</p>

                        
                        
                      </section>

                      {/* Character Model Image */}
                      <div className="my-8 w-full">
                        <img src="/lovable-uploads/7d4ea94f-0c4d-459f-bded-b68a2bd272d6.png" alt="3D character models and customization options" className="w-full h-auto rounded-lg shadow-md" />
                      </div>

                      {/* Game Modes */}
                      <section id="game-modes" className="mb-12">

                        <br />

                        <h2 className="text-3xl font-bold">6. Game Modes</h2>
                        <ul>
                          <li><strong>Battle Royale:</strong> 20-100 players, one winner.</li>
                          <li><strong>Duos:</strong> 10-50 teams of two compete to be the last duo standing. Teamwork is key for survival.</li>
                          <li><strong>Death Match:</strong> No shrinking zone, just 15 minutes of pure free-for-all mayhem. Whoever gets the most kills in the time limit wins.</li>
                          <li><strong>Survival Royale:</strong> PvE/PvP mode where players must survive waves of zombies while also dealing with other players.</li>
                          <li><strong>Tournaments:</strong> Monthly events with large rewards</li>
                        </ul>
                      </section>

                      {/* Monetization */}
                      <section id="monetization" className="mb-12">

                        <br />

                        <h2 className="text-3xl font-bold">7. Monetization & Marketplace</h2>
                        <p>The game operates on a play-and-earn model. Players earn in-game currency by participating in matches, which can be used to buy cosmetics, skins, or lootboxes in the marketplace. All NFTs are tradable on external platforms, allowing players to buy, sell, or auction rare skins for real-world value.</p>
                        <ul>
                          <li><strong>NFT Drops:</strong> Special skins and items are occasionally dropped for players to claim in-game or purchase from the marketplace.</li>
                          <li><strong>In-Game Store:</strong> Besides skins, there are in-game items like weapons, emotes, and accessories, all purchasable with in-game or real-world currency</li>
                          <li><strong>Season Pass:</strong> Unlock exclusive items the more you play</li>
                          <li><strong>LootBoxes:</strong> Players can purchase fairly randomized boxes for a chance to win rare items.</li>
                        </ul>
                      </section>

                      {/* Visuals and Sound */}
                      <section id="visuals-sound" className="mb-12">

                        <br />

                        <h2 className="text-3xl font-bold">8. Visuals and Sound</h2>
                        
                        <br />
                        
                        <br />

                        <h3 className="text-2xl font-bold">Hyperrealism and Gore</h3>
                        <p>The game emphasizes visual fidelity with cutting-edge graphics, using realistic lighting, textures, and physics-based animations. Every punch, kick, and fatality is brought to life with intense visual effects. Blood splatters realistically, bones crack audibly, and finishing moves are rendered in excruciating detail. Dynamic weather effects like rain, thunderstorms, and night/day cycles further enhance immersion.</p>

                        <br />

                        <h3 className="text-2xl font-bold">Sound Design</h3>
                        <p>Each punch and impact has weight, with a focus on brutal, visceral sound effects—bones snapping, skin tearing, and blood splattering. Background music ranges from tense, atmospheric tunes to heart-pounding battle music, rising in intensity as the match progresses.</p>
                      </section>

                      {/* Fighter in Jungle Image */}
                      <div className="my-8 w-full">
                        <img src="/lovable-uploads/f6dc2342-08e2-45a0-a94c-ad2e0db2efb0.png" alt="Fighter in jungle environment showcasing combat stance" className="w-full h-auto rounded-lg shadow-md" />
                      </div>

                      {/* Marketing */}
                      <section id="marketing" className="mb-12">

                        <br />

                        <h2 className="text-3xl font-bold">9. Marketing and Launch Strategy</h2>
                        <p>The game will launch with early access and token sales to build a dedicated community before full release. Influencers, streamers, and tournaments will drive hype and engagement, especially in the crypto and gaming communities. Post-launch, regular updates, skins, and new game modes will keep the player base engaged.</p>
                        <p>Last Chad Standing is a brutal, high-octane take on the battle royale genre, offering intense, visceral combat with the unique twist of NFT ownership and customization, pushing the boundaries of what modern multiplayer games can offer.</p>
                      </section>

                      {/* Controls */}
                      <section id="controls" className="mb-12">

                        <br />

                        <h2 className="text-3xl font-bold">10. Basic Controls</h2>
                        <p>The following are the default controls for Last Chad Standing on PC and consoles. Players can customize controls in the settings.</p>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-gray-50 p-4 rounded-lg">

                            <br />

                            <h3 className="text-2xl font-bold">PC Controls</h3>
                            <ul className="space-y-1 text-sm">
                              <li><strong>W/A/S/D:</strong> Move forward, left, backward, right</li>
                              <li><strong>Mouse Movement:</strong> Camera control</li>
                              <li><strong>Left Mouse Button:</strong> Punch/Combos</li>
                              <li><strong>Right Mouse Button:</strong> Kick/Combos</li>
                              <li><strong>E:</strong> Interact (pick up items, activate objects)</li>
                              <li><strong>F:</strong> Grapple/Throw</li>
                              <li><strong>R:</strong> Execute/Finishers (when prompt appears)</li>
                              <li><strong>Shift:</strong> Sprint</li>
                              <li><strong>Spacebar:</strong> Jump</li>
                              <li><strong>Ctrl (Hold):</strong> Crouch/Slide (while sprinting)</li>
                              <li><strong>C:</strong> Block/Parry</li>
                              <li><strong>V:</strong> Quick Dodge</li>
                              <li><strong>1/2/3:</strong> Weapon select (if equipped)</li>
                              <li><strong>G:</strong> Throw weapon</li>
                              <li><strong>M:</strong> Large map (full screen)</li>
                              <li><strong>Esc:</strong> Pause/Options</li>
                            </ul>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg">

                            <br />

                            <h3 className="text-2xl font-bold">Console Controls (PlayStation/Xbox)</h3>
                            <ul className="space-y-1 text-sm">
                              <li><strong>Left Stick:</strong> Move</li>
                              <li><strong>Right Stick:</strong> Camera</li>
                              <li><strong>R2/RT:</strong> Punch/Combos</li>
                              <li><strong>L2/LT:</strong> Kick/Combos</li>
                              <li><strong>Square/X:</strong> Interact</li>
                              <li><strong>Circle/B:</strong> Grapple/Throw</li>
                              <li><strong>Triangle/Y:</strong> Execute/Finisher</li>
                              <li><strong>X/A:</strong> Jump</li>
                              <li><strong>R1/RB:</strong> Block/Parry</li>
                              <li><strong>L1/LB:</strong> Quick Dodge</li>
                              <li><strong>L3 (Click Left Stick):</strong> Sprint</li>
                              <li><strong>R3 (Click Right Stick):</strong> Crouch/Slide</li>
                              <li><strong>L1 + R1:</strong> Special Ability</li>
                              <li><strong>Options/Menu:</strong> Pause/Map</li>
                            </ul>
                          </div>
                        </div>
                      </section>

                      {/* Combat Mechanics */}
                      <section id="combat-mechanics" className="mb-12">

                        <br />

                        <h2 className="text-3xl font-bold">11. Combat Mechanics</h2>
                        <p>The core of Last Chad Standing revolves around melee combat, blending fast reflexes, precise timing, and smart environmental use.</p>
                        
                        <br />
                        
                        <br />

                        <h3 className="text-2xl font-bold">Attack Types</h3>
                        <ul>
                          <li><strong>Punch/Combos (LMB/R2):</strong> Quick, basic attacks that deal moderate damage but are harder to counter. Ideal for rapid combos.</li>
                          <li><strong>Kick/Combos (RMB/L2):</strong> Slower, more powerful strikes. These can break through blocks but leave you open to counters if missed.</li>
                          <li><strong>Combos:</strong> Chaining punch and kick attacks in various sequences triggers character-specific combos for extra damage or stuns. Example: Punch-Punch-Kick = Overhead Slam Combo. Combos vary based on character type (Brawler, Ninja, etc.).</li>
                        </ul>

                        <br />

                        <h3 className="text-2xl font-bold">Grappling (F/Circle/B)</h3>
                        <ul>
                          <li><strong>Grapple:</strong> Initiate a grapple on a nearby opponent to engage in close-quarters combat. Grapples can be countered with a well-timed block or dodge.</li>
                          <li><strong>Throws:</strong> After a successful grapple, use directional inputs to throw your opponent into environmental hazards or towards other players.</li>
                          <li><strong>Special Throws:</strong> Each fighter has unique throws that differ based on their fighting style (e.g., Brawler performs a suplex; Ninja flips the enemy over).</li>
                        </ul>

                        <br />

                        <h3 className="text-2xl font-bold">Blocking and Parrying</h3>
                        <ul>
                          <li><strong>Block (C/R1):</strong> Deflects incoming punch attacks but depletes stamina with each hit.</li>
                          <li><strong>Parry:</strong> If timed perfectly, pressing the block button just as an opponent strikes will parry their attack, opening them up for a devastating counterattack.</li>
                        </ul>

                        <br />

                        <h3 className="text-2xl font-bold">Dodging and Sprinting</h3>
                        <ul>
                          <li><strong>Quick Dodge (V/L1):</strong> Evade enemy attacks with a swift side step. Dodging consumes stamina but can avoid kick attacks or grapples.</li>
                          <li><strong>Sprint (Shift/L3):</strong> Use sprint to quickly cover ground or charge towards enemies. While sprinting, players can perform sliding attacks, which knock down opponents.</li>
                        </ul>

                        <br />

                        <h3 className="text-2xl font-bold">Special Abilities (Q/L1 + R1)</h3>
                        <p>Each character class has a unique special ability that recharges over time or when certain conditions are met (e.g., landing consecutive hits). Abilities vary greatly but are game-changing when used strategically:</p>
                        <ul>
                          <li><strong>Brawler:</strong> Ground slam, causing area-of-effect damage.</li>
                          <li><strong>Ninja:</strong> Cloaking for a brief period of invisibility.</li>
                          <li><strong>Brute:</strong> Temporary damage immunity.</li>
                        </ul>

                        <br />

                        <h3 className="text-2xl font-bold">Finishers (R/Triangle/Y)</h3>
                        <p>Finishers are unique, gory executions that players can perform when an opponent's health is critically low (triggered when a finisher icon appears).</p>
                        <ul>
                          <li><strong>Execution Prompt:</strong> When close to a low-health opponent, press the execute button to perform a brutal finishing move.</li>
                          <li><strong>Customization:</strong> Players can customize their finisher animations based on NFTs or earned achievements.</li>
                        </ul>
                      </section>

                      {/* Weapons and Inventory */}
                      <section id="weapons-inventory" className="mb-12">

                        <br />

                        <h2 className="text-3xl font-bold">12. Weapons and Inventory</h2>
                        <p>Weapons can be found throughout the island and can range from blunt instruments to branches. Players can carry up to three weapons, and each weapon has durability, meaning it can break over time.</p>
                        
                        <br />

                        <h3 className="text-2xl font-bold">Weapon Categories</h3>
                        <ul>
                          <li><strong>Blunt Weapons:</strong> Bats, pipes, hammers—ideal for ambushes but slower and consume extra stamina.</li>
                          
                          <li><strong>Improvised Weapons:</strong> Found objects like bricks, chainsaws, or construction tools. Deal high damage but often have low durability and hamper mobility.</li>
                          <li><strong>Throwable Weapons:</strong> Rocks, or even grenades (in special game modes). These can be hurled at enemies from a distance but require good aim.</li>
                        </ul>

                        <br />

                        <h3 className="text-2xl font-bold">Weapon Durability</h3>
                        <p>Weapons have a limited lifespan. Each time you strike, durability decreases, and eventually, the weapon will break. Broken weapons can be discarded and replaced by scavenging new ones from the environment.</p>

                        <br />

                        <h3 className="text-2xl font-bold">Inventory Management</h3>
                        <ul>
                          <li><strong>Access Inventory (Tab/D-Pad):</strong> Check your current weapons, items, and consumables.</li>
                          <li><strong>Quick Weapon Swap (1/2/3 or D-Pad):</strong> Instantly switch between your three equipped weapons during combat.</li>
                          <li><strong>Health Items:</strong> Consumables like bandages, fruit or med packs are found across the map. They restore health but take time to use, leaving you vulnerable to attacks.</li>
                        </ul>
                      </section>

                      {/* Movement and Traversal */}
                      <section id="movement" className="mb-12">

                        <br />

                        <h2 className="text-3xl font-bold">13. Movement and Traversal</h2>
                        
                        <br />

                        <h3 className="text-2xl font-bold">Basic Movement</h3>
                        <p>Use the movement keys/stick to navigate the map. Movement is essential for dodging attacks and avoiding environmental hazards.</p>

                        <br />

                        <h3 className="text-2xl font-bold">Jumping and Climbing (Space/X)</h3>
                        <p>Jump to clear obstacles or reach higher ground. Some objects are climbable, allowing players to gain an advantage through vertical positioning.</p>

                        <br />

                        <h3 className="text-2xl font-bold">Sliding (Ctrl/R3 while Sprinting)</h3>
                        <p>Perform a sliding attack while sprinting, which can knock enemies down or be used to quickly evade combat.</p>
                      </section>

                      {/* Map and Environmental Hazards */}
                      <section id="map-hazards" className="mb-12">

                        <br />

                        <h2 className="text-3xl font-bold">14. Map and Environmental Hazards</h2>
                        <p>The island is littered with environmental traps and hazards that players can use to their advantage or avoid.</p>
                        
                        <br />

                        <h3 className="text-2xl font-bold">Map Overview</h3>
                        <ul>
                          <li><strong>Access Map (M/Options):</strong> Check the shrinking zone, your position, and possible loot locations.</li>
                          <li><strong>Shrinking Zone:</strong> The toxic gas zone slowly closes in over time, forcing players to move closer together. The map displays the current safe area and the next shrinking zone.</li>
                        </ul>

                        <br />

                        <h3 className="text-2xl font-bold">Environmental Traps</h3>
                        <ul>
                          <li><strong>Spikes, Lava Pits, Acid Baths, Cliffs:</strong> Throw enemies into these hazards for instant kills.</li>
                          <li><strong>Dynamic Weather:</strong> Rain or fog can reduce visibility, making ambushes more viable.</li>
                        </ul>
                      </section>

                      {/* Game Strategy */}
                      <section id="strategy" className="mb-12">

                        <br />

                        <h2 className="text-3xl font-bold">15. Game Strategy</h2>
                        <p>Here are some tactical tips to help you dominate:</p>
                        <ul>
                          <li><strong>Weapon Conservation:</strong> Use each weapon strategically, and don't waste hits on unimportant environmental objects.</li>
                          <li><strong>Manage Stamina:</strong> Every action (attacking, dodging, blocking) uses stamina. If your stamina runs out, you'll be slow and vulnerable.</li>
                          <li><strong>Use the Environment:</strong> Environmental hazards can help you eliminate opponents without risking your health in direct combat.</li>
                          <li><strong>Adapt to Opponents:</strong> Learn to counter different fighter styles</li>
                          <li><strong>Loot and Move:</strong> Don't stay in one place too long, especially as the zone shrinks. Loot what you need and keep moving. If you try and camp, you may be spotted by the audience and the only real places to hide are limited to the jungle areas.</li>
                        </ul>
                      </section>

                      {/* Social Aspects */}
                      <section id="social-aspects" className="mb-12">

                        <br />

                        <h2 className="text-3xl font-bold">16. Social Aspects</h2>
                        <p>Last Chad Standing features robust social mechanics that create a truly immersive and interactive gaming experience. These features foster community engagement and add layers of strategy beyond just combat.</p>
                        
                        <br />

                        <h3 className="text-2xl font-bold">Proximity Voice Chat</h3>
                        <p>The game features uncensored, proximity-based voice chat that adds intense psychological warfare to combat:</p>
                        <ul>
                          <li><strong>Distance-Based Audio:</strong> The closer you are to other players, the louder and clearer their voice becomes. This creates natural ambush opportunities and tense stalking scenarios.</li>
                          <li><strong>No Restrictions:</strong> Voice chat is completely uncensored, allowing for authentic trash talk, intimidation tactics, and raw emotional reactions that amplify the brutal nature of the competition.</li>
                          <li><strong>Strategic Communication:</strong> Players can use voice chat to form temporary alliances, negotiate truces, or attempt to deceive opponents about their intentions.</li>
                          <li><strong>Immersive Experience:</strong> Hearing your opponent's breathing, grunts of pain, or victory cries adds visceral realism to every encounter.</li>
                        </ul>

                        <br />

                        <h3 className="text-2xl font-bold">Spectator Mode & Live Viewing</h3>
                        <p>Players can watch ongoing matches in real-time, creating a live entertainment ecosystem:</p>
                        <ul>
                          <li><strong>Free Camera Mode:</strong> Spectators can freely roam the map or follow specific players to catch all the action.</li>
                          <li><strong>Multiple View Options:</strong> Switch between first-person, third-person, and cinematic camera angles for the best viewing experience.</li>
                          <li><strong>Live Commentary:</strong> Spectators can provide real-time commentary and reactions via text chat visible to other viewers.</li>
                          <li><strong>Highlight Clips:</strong> Automatically capture and share the most brutal moments and epic finishers.</li>
                        </ul>

                        <br />

                        <h3 className="text-2xl font-bold">Care Packages & Player Support</h3>
                        <p>Spectators can directly influence ongoing matches by purchasing care packages for their favorite fighters:</p>
                        <ul>
                          <li><strong>Weapon Drops:</strong> Send high-quality weapons, armor, or consumables to help your chosen fighter survive longer.</li>
                          <li><strong>Health Packs:</strong> Purchase medical supplies that can be airdropped to injured fighters at critical moments.</li>
                          <li><strong>Special Equipment:</strong> Provide temporary buffs, protective gear, or rare weapons that give fighters an edge in combat.</li>
                          <li><strong>Strategic Timing:</strong> Care packages must be strategically timed - they're visible to all players and can attract unwanted attention to the recipient.</li>
                          <li><strong>Cost Scaling:</strong> Care package prices increase as the match progresses and fewer players remain, making late-game support more valuable.</li>
                        </ul>

                        <br />

                        <h3 className="text-2xl font-bold">Fighter Backing & Reward Sharing</h3>
                        <p>Players can financially back fighters before matches begin, sharing in the spoils of victory:</p>
                        <ul>
                          <li><strong>Pre-Match Betting:</strong> Back your favorite fighter with real currency or in-game tokens before the match starts.</li>
                          <li><strong>Reward Pool Distribution:</strong> When your backed fighter wins, you receive a percentage of the total match reward pool based on your investment.</li>
                          <li><strong>Dynamic Odds:</strong> Backing odds change in real-time based on fighter performance, reputation, and community sentiment.</li>
                          <li><strong>Multiple Fighters:</strong> Diversify your bets by backing multiple fighters in the same match to hedge your investments.</li>
                          <li><strong>Backer Leaderboards:</strong> Track the most successful backers and follow their betting strategies for future matches.</li>
                          <li><strong>Exclusive Rewards:</strong> Top backers gain access to exclusive NFT drops, early access to new content, and special recognition in the community.</li>
                        </ul>

                        <br />

                        <h3 className="text-2xl font-bold">Social Feedback Loops and Virality</h3>
                        <p>The game creates powerful viral loops that encourage organic growth and community engagement:</p>
                        <ul>
                          <li><strong>Highlight Generation:</strong> Epic moments, brutal finishers, and unexpected victories are automatically captured and packaged into shareable clips optimized for social media platforms.</li>
                          <li><strong>Performance Analytics:</strong> Detailed post-match breakdowns show your combat effectiveness, crowd support metrics, and backing profits, encouraging players to share their achievements.</li>
                          <li><strong>Viral Challenges:</strong> Weekly community challenges and trending hashtags (#ChadsOnly, #BrutalFinish) drive social media engagement and attract new players.</li>
                          <li><strong>Streamer Integration:</strong> Built-in streaming tools with automated highlights, viewer polls for care package purchases, and real-time audience engagement features.</li>
                          <li><strong>Social Proof Mechanics:</strong> Display of backer counts, spectator numbers, and social media mentions creates FOMO and social validation for successful fighters.</li>
                          <li><strong>Cross-Platform Sharing:</strong> Seamless integration with TikTok, Twitter, Instagram, and Discord for instant sharing of epic moments and recruitment of new players.</li>
                          <li><strong>Influencer Partnerships:</strong> Exclusive fighter skins and tournaments for content creators, creating authentic promotional content and expanding reach to new audiences.</li>
                          <li><strong>Community Rewards:</strong> Group achievements and milestones that reward the entire community when certain viral or engagement thresholds are met, encouraging collective promotion.</li>
                        </ul>

                        <br />

                        <h3 className="text-2xl font-bold">Community Features</h3>
                        <ul>
                          <li><strong>Fighter Profiles:</strong> Detailed statistics, win/loss records, and fighting style breakdowns for every player.</li>
                          <li><strong>Replay System:</strong> Watch and share epic moments from past matches with full camera control.</li>
                          <li><strong>Tournament Brackets:</strong> Follow major tournaments and championship events with real-time bracket updates.</li>
                          <li><strong>Social Media Integration:</strong> Share highlights, backing successes, and epic moments directly to social platforms.</li>
                        </ul>
                      </section>

                      {/* Economy Section */}
                      <section id="in-game-currency" className="mb-12">

                        <br />

                        <h2 className="text-3xl font-bold">17. Economy</h2>
                        
                        <br />
                        
                        <br />

                        <h3 className="text-2xl font-bold">Coins</h3>

                        <p>Every game needs in-game currency, but ours is unique compared to most games because it's decentralized and has a set supply, giving fighters real ownership without manipulation from developers. Unlike traditional games where developers can inflate currency at will, our coins operate on blockchain technology with transparent tokenomics.</p>
                        <p>This means fighters truly own their digital assets and can trade them freely without fear of arbitrary changes to the game's economy. The decentralized nature ensures that the value of fighter investments is protected by smart contracts rather than corporate decisions.</p>

                        <br />

                        <h3 id="token-economy" className="text-2xl font-bold">Distribution</h3>

                        <p><strong>Total Supply:</strong> 100,000,000,000 coins</p>
                        
                        <TokenDistributionChart />
                        
                        <ul>
                          <li><strong>Public:</strong> 30% (30B coins)</li>
                          <li><strong>Team:</strong> 15% (15B coins)</li>
                          <li><strong>Development Fund:</strong> 15% (15B coins)</li>
                          <li><strong>Marketing & Partnerships:</strong> 15% (15B coins)</li>
                          <li><strong>Ecosystem Rewards:</strong> 10% (10B coins)</li>
                          <li><strong>Liquidity Pool:</strong> 10% (10B coins)</li>
                          <li><strong>Advisors:</strong> 5% (5B coins)</li>
                        </ul>
                      </section>

                      {/* Genesis Chads Section - moved here */}
                      <section id="genesis-chads" className="mb-12">
                        <br />
                        <h2 className="text-3xl font-bold">Genesis Chads</h2>
                        
                        <p>Randomly generated cartoon chads from 2022 hand drawn by founder Mike Hales.</p>
                        
                        <p>Every chad will appear one by one, on the skins marketplace in 3D form, ready to be used in-game, with revenue shared with the holder from buyers and secondary traders.</p>
                        
                        <p>Holders of the genesis chads or any of the passes also qualify for an airdrop of $LCS.</p>
                        
                        <br />
                        
                         <h3 className="text-2xl font-bold">Collections</h3>
                         <ul>
                           <li><strong><a href="https://opensea.io/collection/lcfc-genesis" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Genesis Chads</a></strong></li>
                           <li><strong><a href="https://opensea.io/es/collection/honorary-lean-chad-collection" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Honorary Chads</a></strong></li>
                           <li><strong><a href="https://opensea.io/collection/lcfca" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">All Access Pass</a></strong></li>
                          <li><strong><a href="https://opensea.io/collection/lcfcv" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">VIP Pass</a></strong></li>
                          <li><strong><a href="https://opensea.io/collection/lcfce" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Elite Pass</a></strong></li>
                        </ul>
                        
                        <br />
                        
                        <h3 className="text-2xl font-bold">Airdrop Distribution</h3>
                        <p><strong>5% of the supply is divided between:</strong></p>
                        <ul>
                          <li><strong>2%</strong> Genesis Chads</li>
                          <li><strong>0.25%</strong> Honorary Chads</li>
                          <li><strong>0.25%</strong> All Access Pass</li>
                          <li><strong>1%</strong> Elite Pass</li>
                          <li><strong>1.5%</strong> VIP Pass</li>
                        </ul>
                        
                        <br />
                      </section>

                      {/* Airdrop Calculator */}
                      <section id="airdrop-calculator" className="mb-12">
                        <br />
                        <h2 className="text-3xl font-bold">Airdrop Calculator</h2>
                        <p className="mb-6">Calculate your share of the 5,000,000,000 token airdrop based on your NFT holdings.</p>

                        <div className="grid gap-6 md:grid-cols-2 mb-8">
                          {/* Input Section */}
                          <Card className="bg-white border-gray-200">
                            <CardHeader>
                              <CardTitle className="text-gray-900">Your NFT Holdings</CardTitle>
                              <CardDescription>
                                Enter the number of NFTs you hold for each collection
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              {Object.entries(collections).map(([key, collection]) => (
                                <div key={key} className="space-y-2">
                                  <Label htmlFor={key} className="flex justify-between text-gray-700">
                                    <span>{collection.name}</span>
                                    <span className="text-xs text-gray-500">
                                      Total Supply: {collection.supply.toLocaleString()}
                                    </span>
                                  </Label>
                                  <Input
                                    id={key}
                                    type="number"
                                    min="0"
                                    value={holdings[key as keyof typeof holdings] || ''}
                                    onChange={(e) => handleInputChange(key, e.target.value)}
                                    placeholder="0"
                                    className="bg-white border-gray-300"
                                  />
                                </div>
                              ))}
                              
                              <Button onClick={clearAll} variant="outline" className="w-full mt-4">
                                Clear All
                              </Button>
                            </CardContent>
                          </Card>

                          {/* Results Section */}
                          <Card className="bg-white border-gray-200">
                            <CardHeader>
                              <CardTitle className="text-gray-900">Your Airdrop Allocation</CardTitle>
                              <CardDescription>
                                Based on your NFT holdings
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              {/* Breakdown by Collection */}
                              <div className="space-y-3">
                                {Object.entries(collections).map(([key, collection]) => {
                                  const userTokens = holdings[key as keyof typeof holdings] * tokensPerNFT[key];
                                  if (holdings[key as keyof typeof holdings] === 0) return null;
                                  
                                  return (
                                    <div key={key} className="flex justify-between text-sm">
                                      <span className="text-gray-600">
                                        {collection.name} ({holdings[key as keyof typeof holdings]}x)
                                      </span>
                                      <span className="font-medium text-gray-900">
                                        {userTokens.toLocaleString(undefined, { maximumFractionDigits: 0 })} tokens
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>

                              {userAllocation > 0 && <div className="border-t border-gray-200 pt-3" />}

                              {/* Total Allocation */}
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-lg font-semibold text-gray-900">Total Allocation:</span>
                                  <span className="text-xl font-bold text-blue-600">
                                    {userAllocation.toLocaleString(undefined, { maximumFractionDigits: 0 })} tokens
                                  </span>
                                </div>
                                
                                {userAllocation > 0 && (
                                  <div className="text-center text-sm text-gray-500">
                                    {((userAllocation / TOTAL_AIRDROP) * 100).toFixed(4)}% of total airdrop
                                  </div>
                                )}
                              </div>

                              {userAllocation === 0 && (
                                <div className="text-center text-gray-500 py-8">
                                  Enter your NFT holdings above to see your airdrop allocation
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>

                        {/* Calculator Info */}
                        <Card className="bg-gray-50 border-gray-200">
                          <CardHeader>
                            <CardTitle className="text-gray-900">Calculation Details</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <h4 className="font-semibold mb-2 text-gray-900">Token Distribution</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  <li>Total Token Supply: 100,000,000,000</li>
                                  <li>Airdrop Allocation: 5% (5,000,000,000 tokens)</li>
                                  <li>Tokens per NFT: {(TOTAL_AIRDROP / Object.values(collections).reduce((sum, c) => sum + c.supply, 0)).toLocaleString(undefined, { maximumFractionDigits: 0 })}</li>
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2 text-gray-900">NFT Collections</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {Object.entries(collections).map(([key, collection]) => (
                                    <li key={key}>
                                      {collection.name}: {collection.supply.toLocaleString()} supply
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <br />
                        
                        <br />
                        
                        <h3 className="text-2xl font-bold">$DHB Token Distribution</h3>
                        <p><strong>10% of the supply is reserved for $DHB stakers and holders.</strong></p>
                        <ul>
                          <li><strong>2.5%</strong> for holders</li>
                          <li><strong>7.5%</strong> for stakers</li>
                        </ul>
                      </section>

                      <section id="utility" className="mb-12">

                        <br />

                        <h3 className="text-2xl font-bold">Utility</h3>

                        
                        <ul>
                          <li><strong>In-Game Currency:</strong> Buy or sell skins from the store or secondary marketplace directly with other players</li>
                          <li><strong>Tournament Entry:</strong> Access events and experiences, from tournaments to socials</li>
                          
                          <li><strong>Governance:</strong> Voting on game features and updates</li>
                          <li><strong>Staking Rewards:</strong> Earn additional coins by staking</li>
                          <li><strong>Care Packages:</strong> Send support items to players</li>
                          <li><strong>Back Fighters:</strong> Support fighters with coins and share the loot if you win. However, if your fighter loses, you get nothing but shame.</li>
                        </ul>

                        <div className="mt-8">
                          
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            
                            
                            
                          </div>
                        </div>
                      </section>

                      {/* Team Section */}
                      <section id="founding-team" className="mb-12">

                        <br />

                        <h2 className="text-3xl font-bold">Founding Team</h2>
                        <div className="space-y-8">
                          
                          {/* Mike Hales */}
                          <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 rounded-lg">
                            <div className="md:w-1/4">
                              <img src="/lovable-uploads/89896bcd-7068-4438-ba8d-95f8e577cb75.png" alt="Mike Hales" className="w-full aspect-[3/4] object-cover rounded-lg" />
                            </div>
                            <div className="md:w-3/4">
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">Mike Hales</h3>
                              <p className="text-gray-700 leading-relaxed mb-4">
                                Founder and CEO of Rapz, a notable high end MMA fightwear brand backed by top 
                                UFC and boxing stars, with exclusive supplier rights to BKFC. Joint-owner of 
                                First Class, the UK's largest TikTok partner agency, approaching 1000 streamers 
                                signed on and reporting directly for the in-house executive team with offices in the 
                                UK and Asia.
                              </p>
                              <div className="flex flex-wrap gap-3">
                                <a href="https://tiktok.com/@mikehalesmma" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm">
                                  TikTok
                                  <ExternalLink size={12} />
                                </a>
                                <a href="https://www.tapology.com/fightcenter/fighters/101647-mike-hales" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm">
                                  Tapology
                                  <ExternalLink size={12} />
                                </a>
                                <a href="https://instagram.com/mikehalesmma" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm">
                                  Instagram
                                  <ExternalLink size={12} />
                                </a>
                                <a href="https://x.com/mikehalesmma" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm">
                                  X (Twitter)
                                  <ExternalLink size={12} />
                                </a>
                                <a href="mailto:chads@lastchadstanding.com" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm">
                                  Email
                                  <Mail size={12} />
                                </a>
                                <a href="https://www.espn.co.uk/mma/fighter/_/id/4610150/mike-hales" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm">
                                  ESPN Profile
                                  <ExternalLink size={12} />
                                </a>
                              </div>
                            </div>
                          </div>

                          {/* Malik Jan */}
                          <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 rounded-lg">
                            <div className="md:w-1/4">
                              <img src="/lovable-uploads/84ab9eed-00bc-425c-a953-3ea0478e464d.png" alt="Malik Jan" className="w-full aspect-[3/4] object-cover rounded-lg" />
                            </div>
                            <div className="md:w-3/4">
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">Malik Jan AKA mal.eth</h3>
                              <p className="text-gray-700 leading-relaxed mb-4">
                                Founder of DeHub (DHB) which Malik bootstrapped from 690k to 600m FDV 
                                with a ~1000x ROI at peak last bull run, amassing 50,000 holders and close to 
                                $10m in the LP, with over $1m in on-chain revenue and $1m in distributed rewards. 
                                Former top billing agent at UK's largest agency, Blue Arrow and Senior Consultant 
                                at World's largest agency Randstad. Raised 7 figures for Guide Dogs Charity 
                                during tenure as fundraising manager.
                              </p>
                              <div className="flex flex-wrap gap-3">
                                <a href="https://x.com/maldoteth" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm">
                                  X (Twitter)
                                  <ExternalLink size={12} />
                                </a>
                                <a href="https://uk.linkedin.com/in/malik-jan-turkistani-842b4b195" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm">
                                  LinkedIn
                                  <ExternalLink size={12} />
                                </a>
                              </div>
                            </div>
                          </div>

                          {/* Rayn Barrera */}
                          <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 rounded-lg">
                            <div className="md:w-1/4">
                              <img src="/lovable-uploads/ea386eae-1f4f-44c0-ad78-7f038df224d3.png" alt="Rayn Barrera" className="w-full aspect-[3/4] object-cover rounded-lg" />
                            </div>
                            <div className="md:w-3/4">
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">Rayn Barrera AKA RaynRaps</h3>
                              <p className="text-gray-700 leading-relaxed mb-4">
                                Gaming and Web3 expert with over ten years in community growth and game 
                                development. Rayn is currently a co-founding Head of Community at Boss 
                                Fighters, Backed by Decentraland & Open Loot, the makers of Big Time. As Founder of 
                                UP LVL, a gaming and Web3 consulting firm, he's partnered with Ubisoft, Riot Games, 
                                Twitch and other leading industry giants.
                              </p>
                              <div className="flex flex-wrap gap-3">
                                <a href="https://www.twitch.tv/raynraps" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm">
                                  Twitch
                                  <ExternalLink size={12} />
                                </a>
                                <a href="https://www.youtube.com/c/RaynRaps" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm">
                                  YouTube
                                  <ExternalLink size={12} />
                                </a>
                                <a href="https://www.instagram.com/raynraps/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm">
                                  Instagram
                                  <ExternalLink size={12} />
                                </a>
                                <a href="https://x.com/RaynRaps" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm">
                                  X (Twitter)
                                  <ExternalLink size={12} />
                                </a>
                              </div>
                            </div>
                          </div>

                          {/* Bailey Young */}
                          <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 rounded-lg">
                            <div className="md:w-1/4">
                              <img src="/lovable-uploads/1373b087-4cb8-43e3-ae69-f3ff5c05a5d1.png" alt="Bailey Young" className="w-full aspect-[3/4] object-cover rounded-lg" />
                            </div>
                            <div className="md:w-3/4">
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">Bailey Young</h3>
                              <p className="text-gray-700 leading-relaxed">
                                Investments and tokenomics expert who played an instrumental role in the 
                                astronomic growth of DeHub in 2021, and oversaw the Blocjerk fundraise of 
                                $1,000,000 in 2023 which gave a peak ROI of 1,000%. Bailey is also a former 
                                professional gamer, ranking globally in the top 3 COD MW2 and top 100 on 
                                Warzone under the tag RickyBobby.
                              </p>
                            </div>
                          </div>

                        </div>
                      </section>

                      {/* Brand Assets Section */}
                      <section id="brand-assets" className="mb-12">
                        <br />
                        <h2 className="text-3xl font-bold">Brand Assets</h2>
                        <p className="mb-6">Download official Last Chad Standing brand assets for your use. All assets are provided in high quality formats.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {/* Logo Text */}
                          <div className="bg-gray-50 p-6 rounded-lg border">
                            <div className="mb-4">
                              <img src="/lovable-uploads/c076819c-8944-483c-9fd4-336da5ebba11.png" alt="Last Chad Standing Logo Text" className="w-full h-auto" />
                            </div>
                            <h3 className="font-semibold mb-2">Logo Text</h3>
                            <p className="text-sm text-gray-600 mb-4">Official Last Chad Standing text logo</p>
                            <Button 
                              onClick={() => handleDownload('/lovable-uploads/c076819c-8944-483c-9fd4-336da5ebba11.png', 'lcs-logo-text.png')}
                              size="sm" 
                              className="w-full flex items-center gap-2"
                            >
                              <Download size={16} />
                              Download PNG
                            </Button>
                          </div>

                          {/* Fist Logo */}
                          <div className="bg-gray-50 p-6 rounded-lg border">
                            <div className="mb-4">
                              <img src="/lovable-uploads/467b4b2b-4ef7-4259-8c00-cc82ac4255ae.png" alt="LCS Fist Logo" className="w-full h-auto" />
                            </div>
                            <h3 className="font-semibold mb-2">Fist Logo</h3>
                            <p className="text-sm text-gray-600 mb-4">LCS fist emblem logo</p>
                            <Button 
                              onClick={() => handleDownload('/lovable-uploads/467b4b2b-4ef7-4259-8c00-cc82ac4255ae.png', 'lcs-fist-logo.png')}
                              size="sm" 
                              className="w-full flex items-center gap-2"
                            >
                              <Download size={16} />
                              Download PNG
                            </Button>
                          </div>

                          {/* LCS Letter Logo */}
                          <div className="bg-gray-50 p-6 rounded-lg border">
                            <div className="mb-4">
                              <img src="/lovable-uploads/ac3e1f52-ba21-4588-9051-87eef47caf5c.png" alt="LCS Letter Logo" className="w-full h-auto" />
                            </div>
                            <h3 className="font-semibold mb-2">LCS Letters</h3>
                            <p className="text-sm text-gray-600 mb-4">LCS abbreviated letter logo</p>
                            <Button 
                              onClick={() => handleDownload('/lovable-uploads/ac3e1f52-ba21-4588-9051-87eef47caf5c.png', 'lcs-letters-logo.png')}
                              size="sm" 
                              className="w-full flex items-center gap-2"
                            >
                              <Download size={16} />
                              Download PNG
                            </Button>
                          </div>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-900 mb-2">Usage Guidelines</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• These assets are for promotional and community use</li>
                            <li>• Do not modify the logos without permission</li>
                            <li>• Maintain proper spacing and proportions</li>
                            <li>• Contact us for custom formats or additional assets</li>
                          </ul>
                        </div>
                      </section>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DocumentSearch isOpen={isSearchOpen} onClose={handleSearchClose} />
    </>
  );
};

export default Documents;
