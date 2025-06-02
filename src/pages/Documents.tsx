import React from 'react';
import { ArrowLeft, UserCheck, Gamepad2, Map, Sword, Settings, Target, Trophy, DollarSign, Eye, Headphones, Rocket, Joystick, Shield, Navigation, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

const Documents = () => {
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
    title: "Links",
    icon: <ExternalLink size={20} />,
    items: [{
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
  return <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft size={20} />
                <span>Back to Game</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">Documentation</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Poster Image */}
      <div className="w-full">
        <img src="/lovable-uploads/b0860230-720f-4dda-b468-f3ff97006100.png" alt="Last Chad Standing Game Poster" className="w-full h-auto object-cover" />
      </div>

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
                      <p>Players are thrown onto the island via helicopter, scattered randomly, and must use both wits and combat prowess to survive against 19 other players. The shrinking zone of poison gas forces fighters into close quarters, ensuring non stop action. Combat is visceral, utilizing a mix of strikes, grappling, weaponry, and brutal finishers.</p>
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
                        <li><strong>Brute:</strong> Slow but can absorb more damage than others. Special Ability: Temporary damage immunity.</li>
                        <li><strong>Slayer:</strong> Balanced with dirty tricks up his sleeve. Special Ability: Carry an extra weapon.</li>
                      </ul>

                      <h3 className="text-2xl font-bold">Shrinking Zone Mechanic</h3>
                      <p>Like other battle royales, the island has a "death zone" that shrinks over time, forcing players into tighter quarters. The visual aesthetic is hyperrealistic, with the zone being a literal wall of toxic gas that corrodes anything it touches. As it closes in, players are forced to fight or flee, and those caught in the zone slowly die in an excruciating spiral of pain. Unless you're lucky enough to find a gas mask, you won't survive more than 30 seconds before you suffocate on your own blood while your skin boils explosively.</p>
                    </section>

                    {/* Progression & Customization */}
                    <section id="progression" className="mb-12">
                      <h2 className="text-3xl font-bold">4. Progression & Customization</h2>
                      
                      <br />
                      
                      <h3 className="text-2xl font-bold">NFT Skins Marketplace</h3>
                      <p>The in-game skins for characters are NFTs, each with unique visual attributes that can be traded on the marketplace. These skins range from cosmetic changes like clothing, tattoos, scars, and armor, to more grotesque body modifications, giving each fighter a distinct appearance. Limited-edition and rare skins are released periodically and can be earned through winning tournaments, in-game challenges, or purchased directly.</p>

                      <h3 className="text-2xl font-bold">Character Customization</h3>
                      <p>Players can customize the appearance of their characters by selecting base skins and layering accessories, clothing, and weapons. NFTs purchased from the marketplace are fully tradable and can enhance the player's appearance with unique styles, offering individuality and a sense of ownership.</p>

                      
                      
                    </section>

                    {/* Character Model Image */}
                    <div className="my-8 w-full">
                      <img src="/lovable-uploads/7d4ea94f-0c4d-459f-bded-b68a2bd272d6.png" alt="3D character models and customization options" className="w-full h-auto rounded-lg shadow-md" />
                    </div>

                    {/* Game Modes */}
                    <section id="game-modes" className="mb-12">
                      <h2 className="text-3xl font-bold">5. Game Modes</h2>
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
                      <h2 className="text-3xl font-bold">6. Monetization & Marketplace</h2>
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
                      <h2 className="text-3xl font-bold">7. Visuals and Sound</h2>
                      
                      <br />
                      
                      <h3 className="text-2xl font-bold">Hyperrealism and Gore</h3>
                      <p>The game emphasizes visual fidelity with cutting-edge graphics, using realistic lighting, textures, and physics-based animations. Every punch, kick, and fatality is brought to life with intense visual effects. Blood splatters realistically, bones crack audibly, and finishing moves are rendered in excruciating detail. Dynamic weather effects like rain, thunderstorms, and night/day cycles further enhance immersion.</p>

                      <h3 className="text-2xl font-bold">Sound Design</h3>
                      <p>Each punch and impact has weight, with a focus on brutal, visceral sound effects—bones snapping, skin tearing, and blood splattering. Background music ranges from tense, atmospheric tunes to heart-pounding battle music, rising in intensity as the match progresses.</p>
                    </section>

                    {/* Fighter in Jungle Image */}
                    <div className="my-8 w-full">
                      <img src="/lovable-uploads/f6dc2342-08e2-45a0-a94c-ad2e0db2efb0.png" alt="Fighter in jungle environment showcasing combat stance" className="w-full h-auto rounded-lg shadow-md" />
                    </div>

                    {/* Marketing */}
                    <section id="marketing" className="mb-12">
                      <h2 className="text-3xl font-bold">8. Marketing and Launch Strategy</h2>
                      <p>The game will launch with early access and token sales to build a dedicated community before full release. Influencers, streamers, and tournaments will drive hype and engagement, especially in the crypto and gaming communities. Post-launch, regular updates, skins, and new game modes will keep the player base engaged.</p>
                      <p>Last Chad Standing is a brutal, high-octane take on the battle royale genre, offering intense, visceral combat with the unique twist of NFT ownership and customization, pushing the boundaries of what modern multiplayer games can offer.</p>
                    </section>

                    {/* Controls */}
                    <section id="controls" className="mb-12">
                      <h2 className="text-3xl font-bold">9. Basic Controls</h2>
                      <p>The following are the default controls for Last Chad Standing on PC and consoles. Players can customize controls in the settings.</p>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
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
                      <h2 className="text-3xl font-bold">10. Combat Mechanics</h2>
                      <p>The core of Last Chad Standing revolves around melee combat, blending fast reflexes, precise timing, and smart environmental use.</p>
                      
                      <h3 className="text-2xl font-bold">Attack Types</h3>
                      <ul>
                        <li><strong>Punch/Combos (LMB/R2):</strong> Quick, basic attacks that deal moderate damage but are harder to counter. Ideal for rapid combos.</li>
                        <li><strong>Kick/Combos (RMB/L2):</strong> Slower, more powerful strikes. These can break through blocks but leave you open to counters if missed.</li>
                        <li><strong>Combos:</strong> Chaining punch and kick attacks in various sequences triggers character-specific combos for extra damage or stuns. Example: Punch-Punch-Kick = Overhead Slam Combo. Combos vary based on character type (Brawler, Ninja, etc.).</li>
                      </ul>

                      <h3 className="text-2xl font-bold">Grappling (F/Circle/B)</h3>
                      <ul>
                        <li><strong>Grapple:</strong> Initiate a grapple on a nearby opponent to engage in close-quarters combat. Grapples can be countered with a well-timed block or dodge.</li>
                        <li><strong>Throws:</strong> After a successful grapple, use directional inputs to throw your opponent into environmental hazards or towards other players.</li>
                        <li><strong>Special Throws:</strong> Each fighter has unique throws that differ based on their fighting style (e.g., Brawler performs a suplex; Ninja flips the enemy over).</li>
                      </ul>

                      <h3 className="text-2xl font-bold">Blocking and Parrying</h3>
                      <ul>
                        <li><strong>Block (C/R1):</strong> Deflects incoming punch attacks but depletes stamina with each hit.</li>
                        <li><strong>Parry:</strong> If timed perfectly, pressing the block button just as an opponent strikes will parry their attack, opening them up for a devastating counterattack.</li>
                      </ul>

                      <h3 className="text-2xl font-bold">Dodging and Sprinting</h3>
                      <ul>
                        <li><strong>Quick Dodge (V/L1):</strong> Evade enemy attacks with a swift side step. Dodging consumes stamina but can avoid kick attacks or grapples.</li>
                        <li><strong>Sprint (Shift/L3):</strong> Use sprint to quickly cover ground or charge towards enemies. While sprinting, players can perform sliding attacks, which knock down opponents.</li>
                      </ul>

                      <h3 className="text-2xl font-bold">Special Abilities (Q/L1 + R1)</h3>
                      <p>Each character class has a unique special ability that recharges over time or when certain conditions are met (e.g., landing consecutive hits). Abilities vary greatly but are game-changing when used strategically:</p>
                      <ul>
                        <li><strong>Brawler:</strong> Ground slam, causing area-of-effect damage.</li>
                        <li><strong>Ninja:</strong> Cloaking for a brief period of invisibility.</li>
                        <li><strong>Brute:</strong> Temporary damage immunity.</li>
                      </ul>

                      <h3 className="text-2xl font-bold">Finishers (R/Triangle/Y)</h3>
                      <p>Finishers are unique, gory executions that players can perform when an opponent's health is critically low (triggered when a finisher icon appears).</p>
                      <ul>
                        <li><strong>Execution Prompt:</strong> When close to a low-health opponent, press the execute button to perform a brutal finishing move.</li>
                        <li><strong>Customization:</strong> Players can customize their finisher animations based on NFTs or earned achievements.</li>
                      </ul>
                    </section>

                    {/* Weapons and Inventory */}
                    <section id="weapons-inventory" className="mb-12">
                      <h2 className="text-3xl font-bold">11. Weapons and Inventory</h2>
                      <p>Weapons can be found throughout the island and can range from blunt instruments to sharp bladed weapons. Players can carry up to three weapons, and each weapon has durability, meaning it can break over time.</p>
                      
                      <h3 className="text-2xl font-bold">Weapon Categories</h3>
                      <ul>
                        <li><strong>Blunt Weapons:</strong> Bats, pipes, hammers—ideal for bashing enemies. Slower, but cause knockback.</li>
                        
                        <li><strong>Improvised Weapons:</strong> Found objects like bricks, chainsaws, or construction tools. Deal high damage but often have low durability.</li>
                        <li><strong>Throwable Weapons:</strong> Rocks, or even grenades (in special game modes). These can be hurled at enemies from a distance but require good aim.</li>
                      </ul>

                      <h3 className="text-2xl font-bold">Weapon Durability</h3>
                      <p>Weapons have a limited lifespan. Each time you strike, durability decreases, and eventually, the weapon will break. Broken weapons can be discarded and replaced by scavenging new ones from the environment.</p>

                      <h3 className="text-2xl font-bold">Inventory Management</h3>
                      <ul>
                        <li><strong>Access Inventory (Tab/D-Pad):</strong> Check your current weapons, items, and consumables.</li>
                        <li><strong>Quick Weapon Swap (1/2/3 or D-Pad):</strong> Instantly switch between your three equipped weapons during combat.</li>
                        <li><strong>Health Items:</strong> Consumables like bandages, fruit or med packs are found across the map. They restore health but take time to use, leaving you vulnerable to attacks.</li>
                      </ul>
                    </section>

                    {/* Movement and Traversal */}
                    <section id="movement" className="mb-12">
                      <h2 className="text-3xl font-bold">12. Movement and Traversal</h2>
                      
                      <h3 className="text-2xl font-bold">Basic Movement</h3>
                      <p>Use the movement keys/stick to navigate the map. Movement is essential for dodging attacks and avoiding environmental hazards.</p>

                      <h3 className="text-2xl font-bold">Jumping and Climbing (Space/X)</h3>
                      <p>Jump to clear obstacles or reach higher ground. Some objects are climbable, allowing players to gain an advantage through vertical positioning.</p>

                      <h3 className="text-2xl font-bold">Sliding (Ctrl/R3 while Sprinting)</h3>
                      <p>Perform a sliding attack while sprinting, which can knock enemies down or be used to quickly evade combat.</p>
                    </section>

                    {/* Map and Environmental Hazards */}
                    <section id="map-hazards" className="mb-12">
                      <h2 className="text-3xl font-bold">13. Map and Environmental Hazards</h2>
                      <p>The island is littered with environmental traps and hazards that players can use to their advantage or avoid.</p>
                      
                      <h3 className="text-2xl font-bold">Map Overview</h3>
                      <ul>
                        <li><strong>Access Map (M/Options):</strong> Check the shrinking zone, your position, and possible loot locations.</li>
                        <li><strong>Shrinking Zone:</strong> The toxic gas zone slowly closes in over time, forcing players to move closer together. The map displays the current safe area and the next shrinking zone.</li>
                      </ul>

                      <h3 className="text-2xl font-bold">Environmental Traps</h3>
                      <ul>
                        <li><strong>Spikes, Lava Pits, Acid Baths, Cliffs:</strong> Throw enemies into these hazards for instant kills.</li>
                        <li><strong>Dynamic Weather:</strong> Rain or fog can reduce visibility, making ambushes more viable.</li>
                      </ul>
                    </section>

                    {/* Game Strategy */}
                    <section id="strategy" className="mb-12">
                      <h2 className="text-3xl font-bold">14. Game Strategy</h2>
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
                      <h2 className="text-3xl font-bold">15. Social Aspects</h2>
                      <p>Last Chad Standing features robust social mechanics that create a truly immersive and interactive gaming experience. These features foster community engagement and add layers of strategy beyond just combat.</p>
                      
                      <h3 className="text-2xl font-bold">Proximity Voice Chat</h3>
                      <p>The game features uncensored, proximity-based voice chat that adds intense psychological warfare to combat:</p>
                      <ul>
                        <li><strong>Distance-Based Audio:</strong> The closer you are to other players, the louder and clearer their voice becomes. This creates natural ambush opportunities and tense stalking scenarios.</li>
                        <li><strong>No Restrictions:</strong> Voice chat is completely uncensored, allowing for authentic trash talk, intimidation tactics, and raw emotional reactions that amplify the brutal nature of the competition.</li>
                        <li><strong>Strategic Communication:</strong> Players can use voice chat to form temporary alliances, negotiate truces, or attempt to deceive opponents about their intentions.</li>
                        <li><strong>Immersive Experience:</strong> Hearing your opponent's breathing, grunts of pain, or victory cries adds visceral realism to every encounter.</li>
                      </ul>

                      <h3 className="text-2xl font-bold">Spectator Mode & Live Viewing</h3>
                      <p>Players can watch ongoing matches in real-time, creating a live entertainment ecosystem:</p>
                      <ul>
                        <li><strong>Free Camera Mode:</strong> Spectators can freely roam the map or follow specific players to catch all the action.</li>
                        <li><strong>Multiple View Options:</strong> Switch between first-person, third-person, and cinematic camera angles for the best viewing experience.</li>
                        <li><strong>Live Commentary:</strong> Spectators can provide real-time commentary and reactions via text chat visible to other viewers.</li>
                        <li><strong>Highlight Clips:</strong> Automatically capture and share the most brutal moments and epic finishers.</li>
                      </ul>

                      <h3 className="text-2xl font-bold">Care Packages & Player Support</h3>
                      <p>Spectators can directly influence ongoing matches by purchasing care packages for their favorite fighters:</p>
                      <ul>
                        <li><strong>Weapon Drops:</strong> Send high-quality weapons, armor, or consumables to help your chosen fighter survive longer.</li>
                        <li><strong>Health Packs:</strong> Purchase medical supplies that can be airdropped to injured fighters at critical moments.</li>
                        <li><strong>Special Equipment:</strong> Provide temporary buffs, protective gear, or rare weapons that give fighters an edge in combat.</li>
                        <li><strong>Strategic Timing:</strong> Care packages must be strategically timed - they're visible to all players and can attract unwanted attention to the recipient.</li>
                        <li><strong>Cost Scaling:</strong> Care package prices increase as the match progresses and fewer players remain, making late-game support more valuable.</li>
                      </ul>

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
                      <h2 className="text-3xl font-bold">16. Economy</h2>
                      
                      <br />
                      
                      <h3 className="text-2xl font-bold">Coins</h3>

                      <p>Every game needs in-game currency, but ours is unique compared to most games because it's decentralized and has a set supply, giving players real ownership without manipulation from developers. Unlike traditional games where developers can inflate currency at will, our coins operate on blockchain technology with transparent tokenomics.</p>
                      <p>This means players truly own their digital assets and can trade them freely without fear of arbitrary changes to the game's economy. The decentralized nature ensures that the value of player investments is protected by smart contracts rather than corporate decisions.</p>

                      <br />

                      <h3 id="token-economy" className="text-2xl font-bold">Distribution</h3>

                      <p><strong>Total Supply:</strong> 1,000,000,000 coins</p>
                      <ul>
                        <li><strong>Public Sale:</strong> 30% (300M coins)</li>
                        <li><strong>Team & Advisors:</strong> 20% (200M coins)</li>
                        <li><strong>Development Fund:</strong> 15% (150M coins)</li>
                        <li><strong>Marketing & Partnerships:</strong> 15% (150M coins)</li>
                        <li><strong>Ecosystem Rewards:</strong> 10% (100M coins)</li>
                        <li><strong>Liquidity Pool:</strong> 10% (100M coins)</li>
                      </ul>

                      <br />

                      <h3 id="utility" className="text-2xl font-bold">Utility</h3>

                      
                      <ul>
                        <li><strong>Buy or sell skins from the store or secondary marketplace directly with other players</strong></li>
                        <li><strong>Tournament Entry:</strong> Entry fees for competitive events</li>
                        <li><strong>NFT Marketplace:</strong> Trading and purchasing unique items</li>
                        <li><strong>Governance:</strong> Voting on game features and updates</li>
                        <li><strong>Staking Rewards:</strong> Earn additional coins by staking</li>
                        <li><strong>Care Packages:</strong> Send support items to players</li>
                      </ul>

                      <div className="mt-8">
                        
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          
                          
                          
                        </div>
                      </div>
                    </section>

                    {/* Team Section */}
                    <section id="founding-team" className="mb-12">
                      <h2 className="text-3xl font-bold">Founding Team</h2>
                      <div className="space-y-8">
                        
                        {/* Mike Hales */}
                        <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 rounded-lg">
                          <div className="md:w-1/3">
                            <img src="/lovable-uploads/89896bcd-7068-4438-ba8d-95f8e577cb75.png" alt="Mike Hales" className="w-full h-64 object-cover rounded-lg" />
                          </div>
                          <div className="md:w-2/3">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Mike Hales</h3>
                            <p className="text-gray-700 leading-relaxed">
                              Founder and CEO of Rapz, a notable high end MMA fightwear brand backed by top 
                              UFC and boxing stars, with exclusive supplier rights to BKFC. Joint-owner of 
                              First Class, the UK's largest TikTok partner agency, approaching 1000 streamers 
                              signed on and reporting directly for the in-house executive team with offices in the 
                              UK and Asia.
                            </p>
                          </div>
                        </div>

                        {/* Malik Jan */}
                        <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 rounded-lg">
                          <div className="md:w-1/3">
                            <img src="/lovable-uploads/84ab9eed-00bc-425c-a953-3ea0478e464d.png" alt="Malik Jan" className="w-full h-64 object-cover rounded-lg" />
                          </div>
                          <div className="md:w-2/3">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Malik Jan AKA mal.eth</h3>
                            <p className="text-gray-700 leading-relaxed">
                              Founder of DeHub (DHB) which Malik bootstrapped from 690k to 600m FDV 
                              with a ~1000x ROI at peak last bull run, amassing 50,000 holders and close to 
                              $10m in the LP, with over $1m in on-chain revenue and $1m in distributed rewards. 
                              Former top billing agent at UK's largest agency, Blue Arrow and Senior Consultant 
                              at World's largest agency Randstad. Raised 7 figures for Guide Dogs Charity 
                              during tenure as fundraising manager.
                            </p>
                          </div>
                        </div>

                        {/* Rayn Barrera */}
                        <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 rounded-lg">
                          <div className="md:w-1/3">
                            <img src="/lovable-uploads/ea386eae-1f4f-44c0-ad78-7f038df224d3.png" alt="Rayn Barrera" className="w-full h-64 object-cover rounded-lg" />
                          </div>
                          <div className="md:w-2/3">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Rayn Barrera AKA RaynRaps</h3>
                            <p className="text-gray-700 leading-relaxed">
                              Gaming and Web3 expert with over ten years in community growth and game 
                              development. Rayn is currently a co-founding Head of Community at Boss 
                              Fighters, Backed by Decentraland & Open Loot, the makers of Big Time. As Founder of 
                              UP LVL, a gaming and Web3 consulting firm, he's partnered with Ubisoft, Riot Games, 
                              Twitch and other leading industry giants.
                            </p>
                          </div>
                        </div>

                        {/* Bailey Young */}
                        <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 rounded-lg">
                          <div className="md:w-1/3">
                            <img src="/lovable-uploads/1373b087-4cb8-43e3-ae69-f3ff5c05a5d1.png" alt="Bailey Young" className="w-full h-64 object-cover rounded-lg" />
                          </div>
                          <div className="md:w-2/3">
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

                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Documents;
