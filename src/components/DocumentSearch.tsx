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
      content: 'Last Chad Standing is a high-intensity, fast paced, third person fighter battle royale. Players choose from a cast of customizable fighters, each trained in unique fight styles and abilities, in a fast-paced, melee-focused environment. The game emphasizes brutal hand-to-hand combat in an open-world island setting, with dynamic environmental hazards and blood-soaked brawls to the death. Only one Chad can remain standing, and he takes home the loot for his troubles. Players are thrown onto the island via helicopter, scattered randomly, and must use both wits and combat prowess to survive against 19 other players. The shrinking cage forces fighters into close quarters, ensuring non stop action. Combat is visceral, utilizing a mix of strikes, grappling, weaponry, and brutal finishers. Overview: Players are thrown onto the island via helicopter, scattered randomly, and must use both wits and combat prowess to survive against 19 other players. The shrinking cage forces fighters into close quarters, ensuring non stop action. Combat is visceral, utilizing a mix of strikes, grappling, weaponry, and brutal finishers.'
    },
    {
      sectionId: 'game-world',
      title: 'Game World & Environment',
      content: 'The map is a relatively small, derelict resort island filled with destructible environments, including beaches, dense jungles, abandoned industrial areas, and decaying urban ruins. The environment offers both vertical and horizontal exploration opportunities. Beaches: Wide open spaces where players can be easily spotted but have more visibility. Jungle: Dense cover where players can ambush or be ambushed. Resort Ruins: Multi-level buildings, providing vantage points for striking down on other players. Industrial Complex: Space to camp but comes with environmental and structural hazards. There are environmental traps like collapsing floors, explosive barrels, and natural hazards such as lava flows and flooding. The environment also dynamically changes over time due to the collapsing zone, adding urgency to exploration.'
    },
    {
      sectionId: 'gameplay-mechanics',
      title: 'Gameplay Mechanics',
      content: 'Players are thrown out of a helicopter flying erratically over the island, with random ejection points adding an element of chaos and unpredictability to the start of each match. Combat System: Combat is the heart of Last Chad Standing. It focuses on hand-to-hand fighting with a realistic physics engine. Every hit feels weighty, and the results of brutal combat are visually emphasized with blood, broken bones, and dismemberment. Strikes: Light, heavy, and combo-based attacks. Timing and precision are key. Grappling: Players can perform grappling moves to counter opponents or initiate brutal finishers. Weapons: Found throughout the map, including blunt instruments, bladed weapons, and improvised tools. Weapons can break over time. Fatalities: Each character can perform unique, gory finishers when they defeat an opponent. Special Moves: Each fighting style comes with their own special move. Proximity Voice Chat: The closer you are to your enemy, the louder you can hear their mic. Character Classes and Abilities: Brawler - High strength, slow but devastating hits. Special Ability: Ground slam causing area damage. Ninja - Fast, agile, more capable of dodging attacks. Special Ability: Invisibility for a short time. Grappler - Masters of throwing opponents and countering attacks. Special Ability: Short dash bursts. Brute - Slow but can absorb more damage and bulldoze through material. Special Ability: Temporary damage immunity. Slayer - Balanced with dirty tricks. Special Ability: Carry an extra weapon. Shrinking Zone Mechanic: Like other battle royales, the island has a death zone that shrinks over time, forcing players into tighter quarters. The visual aesthetic is hyperrealistic, with the zone being a literal wall of steel cage that closes in from all sides. The cage deals continuous damage to anyone who touches it.'
    },
    {
      sectionId: 'storm-cage-mechanics',
      title: 'Enhanced Storm & Cage Mechanics',
      content: 'Last Chad Standing takes the traditional battle royale zone concept to the next level with a dynamic cage system that creates intense pressure and strategic gameplay. The Closing Cage: Instead of a traditional storm or gas, Last Chad Standing features a massive steel cage that mechanically closes in from all sides of the island. This cage creates absolute barriers that reshape the battlefield with each phase. Permanent Barriers: The cage creates absolute no-go zones that deal continuous damage to anyone who touches them. Strategic Positioning: Players must not only avoid the cage but also consider their escape routes before being trapped. Vertical Limitation: The cage extends upward, preventing any attempts to climb or fly over previously accessible areas. Sound Design: The grinding, mechanical sound of the cage closing adds to the psychological pressure. Damage System: Contact with the cage deals significant damage over time, making survival outside the safe zone impossible. Final Zone Transformation: When the cage reaches its final phase, something extraordinary happens. The remaining safe zone undergoes a dramatic transformation as the ground shifts and mechanical structures emerge from beneath the island. The Final MMA Cage: The final zone transforms into a professional MMA octagon cage, creating the ultimate arena for the last remaining fighters. Arena Transformation: The natural environment dissolves away as a regulation-sized MMA cage materializes with proper flooring, lighting, and cage walls. No Escape: Once inside the final cage, there\'s nowhere to run. Enhanced Visibility: Bright arena lighting ensures spectators can clearly see every brutal detail. Crowd Simulation: The arena fills with the roar of a virtual crowd. Referee Presence: A holographic referee appears to officiate the final bout. Championship Stakes: The final cage fight feels like a true championship bout.'
    },
    {
      sectionId: 'progression',
      title: 'Progression & Customization',
      content: 'NFT Skins Marketplace: The in-game skins for characters are NFTs, each with unique visual attributes that can be traded on the marketplace. These skins range from cosmetic changes like clothing, tattoos, scars, and armor, to more grotesque body modifications, giving each fighter a distinct appearance. Limited-edition and rare skins are released periodically and can be earned through winning tournaments, in-game challenges, or purchased directly. Character Customization: Players can customize the appearance of their characters by selecting base skins and layering accessories, clothing, and weapons. NFTs purchased from the marketplace are fully tradable and can enhance the player\'s appearance with unique styles, offering individuality and a sense of ownership.'
    },
    {
      sectionId: 'game-modes',
      title: 'Game Modes',
      content: 'Battle Royale: 20-100 players, one winner. Duos: 10-50 teams of two compete to be the last duo standing. Teamwork is key for survival. Death Match: No shrinking zone, just 15 minutes of pure free-for-all mayhem. Whoever gets the most kills in the time limit wins. Survival Royale: PvE/PvP mode where players must survive waves of zombies while also dealing with other players. Tournaments: Monthly events with large rewards.'
    },
    {
      sectionId: 'monetization',
      title: 'Monetization & Marketplace',
      content: 'The game operates on a play-and-earn model. Players earn in-game currency by participating in matches, which can be used to buy cosmetics, skins, or lootboxes in the marketplace. All NFTs are tradable on external platforms, allowing players to buy, sell, or auction rare skins for real-world value. NFT Drops: Special skins and items are occasionally dropped for players to claim in-game or purchase from the marketplace. In-Game Store: Besides skins, there are in-game items like weapons, emotes, and accessories, all purchasable with in-game or real-world currency. Season Pass: Unlock exclusive items the more you play. LootBoxes: Players can purchase fairly randomized boxes for a chance to win rare items.'
    },
    {
      sectionId: 'visuals-sound',
      title: 'Visuals and Sound',
      content: 'Hyperrealism and Gore: The game emphasizes visual fidelity with cutting-edge graphics, using realistic lighting, textures, and physics-based animations. Every punch, kick, and fatality is brought to life with intense visual effects. Blood splatters realistically, bones crack audibly, and finishing moves are rendered in excruciating detail. Dynamic weather effects like rain, thunderstorms, and night/day cycles further enhance immersion. Sound Design: Each punch and impact has weight, with a focus on brutal, visceral sound effects—bones snapping, skin tearing, and blood splattering. Background music ranges from tense, atmospheric tunes to heart-pounding battle music, rising in intensity as the match progresses.'
    },
    {
      sectionId: 'marketing',
      title: 'Marketing and Launch Strategy',
      content: 'The game will launch with early access and token sales to build a dedicated community before full release. Influencers, streamers, and tournaments will drive hype and engagement, especially in the crypto and gaming communities. Post-launch, regular updates, skins, and new game modes will keep the player base engaged. Last Chad Standing is a brutal, high-octane take on the battle royale genre, offering intense, visceral combat with the unique twist of NFT ownership and customization, pushing the boundaries of what modern multiplayer games can offer.'
    },
    {
      sectionId: 'controls',
      title: 'Basic Controls',
      content: 'The following are the default controls for Last Chad Standing on PC and consoles. Players can customize controls in the settings. PC Controls: W/A/S/D - Move forward, left, backward, right. Mouse Movement - Camera control. Left Mouse Button - Punch/Combos. Right Mouse Button - Kick/Combos. E - Interact (pick up items, activate objects). F - Grapple/Throw. R - Execute/Finishers (when prompt appears). Shift - Sprint. Spacebar - Jump. Ctrl (Hold) - Crouch/Slide (while sprinting). C - Block/Parry. V - Quick Dodge. 1/2/3 - Weapon select (if equipped). G - Throw weapon. M - Large map (full screen). Esc - Pause/Options. Console Controls (PlayStation/Xbox): Left Stick - Move. Right Stick - Camera. R2/RT - Punch/Combos. L2/LT - Kick/Combos. Square/X - Interact. Circle/B - Grapple/Throw. Triangle/Y - Execute/Finisher. X/A - Jump. R1/RB - Block/Parry. L1/LB - Quick Dodge. L3 (Click Left Stick) - Sprint. R3 (Click Right Stick) - Crouch/Slide. L1 + R1 - Special Ability. Options/Menu - Pause/Map.'
    },
    {
      sectionId: 'combat-mechanics',
      title: 'Combat Mechanics',
      content: 'The core of Last Chad Standing revolves around melee combat, blending fast reflexes, precise timing, and smart environmental use. Attack Types: Punch/Combos (LMB/R2) - Quick, basic attacks that deal moderate damage but are harder to counter. Ideal for rapid combos. Kick/Combos (RMB/L2) - Slower, more powerful strikes. These can break through blocks but leave you open to counters if missed. Combos - Chaining punch and kick attacks in various sequences triggers character-specific combos for extra damage or stuns. Example: Punch-Punch-Kick = Overhead Slam Combo. Combos vary based on character type. Grappling (F/Circle/B): Grapple - Initiate a grapple on a nearby opponent to engage in close-quarters combat. Throws - After a successful grapple, use directional inputs to throw your opponent into environmental hazards. Special Throws - Each fighter has unique throws that differ based on their fighting style. Blocking and Parrying: Block (C/R1) - Deflects incoming punch attacks but depletes stamina with each hit. Parry - If timed perfectly, pressing the block button just as an opponent strikes will parry their attack, opening them up for a devastating counterattack. Dodging and Sprinting: Quick Dodge (V/L1) - Evade enemy attacks with a swift side step. Sprint (Shift/L3) - Use sprint to quickly cover ground or charge towards enemies. Special Abilities (Q/L1 + R1): Each character class has a unique special ability that recharges over time. Brawler - Ground slam, causing area-of-effect damage. Ninja - Cloaking for a brief period of invisibility. Brute - Temporary damage immunity. Finishers (R/Triangle/Y): Finishers are unique, gory executions that players can perform when an opponent\'s health is critically low. Execution Prompt - When close to a low-health opponent, press the execute button to perform a brutal finishing move. Customization - Players can customize their finisher animations based on NFTs or earned achievements.'
    },
    {
      sectionId: 'weapons-inventory',
      title: 'Weapons and Inventory',
      content: 'Weapons can be found throughout the island and can range from blunt instruments to branches. Players can carry up to three weapons, and each weapon has durability, meaning it can break over time. Weapon Categories: Blunt Weapons - Bats, pipes, hammers—ideal for ambushes but slower and consume extra stamina. Improvised Weapons - Found objects like bricks, chainsaws, or construction tools. Deal high damage but often have low durability and hamper mobility. Throwable Weapons - Rocks, or even grenades (in special game modes). These can be hurled at enemies from a distance but require good aim. Weapon Durability: Weapons have a limited lifespan. Each time you strike, durability decreases, and eventually, the weapon will break. Broken weapons can be discarded and replaced by scavenging new ones from the environment. Inventory Management: Access Inventory (Tab/D-Pad) - Check your current weapons, items, and consumables. Quick Weapon Swap (1/2/3 or D-Pad) - Instantly switch between your three equipped weapons during combat. Health Items - Consumables like bandages, fruit or med packs are found across the map. They restore health but take time to use, leaving you vulnerable to attacks.'
    },
    {
      sectionId: 'movement',
      title: 'Movement and Traversal',
      content: 'Basic Movement: Use the movement keys/stick to navigate the map. Movement is essential for dodging attacks and avoiding environmental hazards. Jumping and Climbing (Space/X): Jump to clear obstacles or reach higher ground. Some objects are climbable, allowing players to gain an advantage through vertical positioning. Sliding (Ctrl/R3 while Sprinting): Perform a sliding attack while sprinting, which can knock enemies down or be used to quickly evade combat.'
    },
    {
      sectionId: 'map-hazards',
      title: 'Map and Environmental Hazards',
      content: 'The island is littered with environmental traps and hazards that players can use to their advantage or avoid. Map Overview: Access Map (M/Options) - Check the shrinking zone, your position, and possible loot locations. Shrinking Zone - The toxic gas zone slowly closes in over time, forcing players to move closer together. The map displays the current safe area and the next shrinking zone. Environmental Traps: Spikes, Lava Pits, Acid Baths, Cliffs - Throw enemies into these hazards for instant kills. Dynamic Weather - Rain or fog can reduce visibility, making ambushes more viable.'
    },
    {
      sectionId: 'strategy',
      title: 'Game Strategy',
      content: 'Here are some tactical tips to help you dominate: Weapon Conservation - Use each weapon strategically, and don\'t waste hits on unimportant environmental objects. Manage Stamina - Every action (attacking, dodging, blocking) uses stamina. If your stamina runs out, you\'ll be slow and vulnerable. Use the Environment - Environmental hazards can help you eliminate opponents without risking your health in direct combat. Adapt to Opponents - Learn to counter different fighter styles. Loot and Move - Don\'t stay in one place too long, especially as the zone shrinks. Loot what you need and keep moving. If you try and camp, you may be spotted by the audience and the only real places to hide are limited to the jungle areas.'
    },
    {
      sectionId: 'social-aspects',
      title: 'Social Aspects',
      content: 'Last Chad Standing features robust social mechanics that create a truly immersive and interactive gaming experience. These features foster community engagement and add layers of strategy beyond just combat. Proximity Voice Chat: The game features uncensored, proximity-based voice chat that adds intense psychological warfare to combat. Distance-Based Audio - The closer you are to other players, the louder and clearer their voice becomes. No Restrictions - Voice chat is completely uncensored, allowing for authentic trash talk, intimidation tactics, and raw emotional reactions. Strategic Communication - Players can use voice chat to form temporary alliances, negotiate truces, or attempt to deceive opponents. Immersive Experience - Hearing your opponent\'s breathing, grunts of pain, or victory cries adds visceral realism to every encounter. Spectator Mode & Live Viewing: Players can watch ongoing matches in real-time, creating a live entertainment ecosystem. Free Camera Mode - Spectators can freely roam the map or follow specific players. Multiple View Options - Switch between first-person, third-person, and cinematic camera angles. Live Commentary - Spectators can provide real-time commentary and reactions via text chat. Highlight Clips - Automatically capture and share the most brutal moments and epic finishers. Care Packages & Player Support: Spectators can directly influence ongoing matches by purchasing care packages for their favorite fighters. Weapon Drops - Send high-quality weapons, armor, or consumables. Health Packs - Purchase medical supplies that can be airdropped to injured fighters. Special Equipment - Provide temporary buffs, protective gear, or rare weapons. Strategic Timing - Care packages must be strategically timed. Cost Scaling - Care package prices increase as the match progresses. Fighter Backing & Reward Sharing: Players can financially back fighters before matches begin, sharing in the spoils of victory. Pre-Match Betting - Back your favorite fighter with real currency or in-game tokens. Reward Pool Distribution - When your backed fighter wins, you receive a percentage of the total match reward pool. Dynamic Odds - Backing odds change in real-time based on fighter performance. Multiple Fighters - Diversify your bets by backing multiple fighters. Backer Leaderboards - Track the most successful backers. Exclusive Rewards - Top backers gain access to exclusive NFT drops. Social Feedback Loops and Virality: Highlight Generation - Epic moments are automatically captured and packaged into shareable clips. Performance Analytics - Detailed post-match breakdowns show combat effectiveness, crowd support metrics, and backing profits. Viral Challenges - Weekly community challenges and trending hashtags drive social media engagement. Streamer Integration - Built-in streaming tools with automated highlights. Social Proof Mechanics - Display of backer counts, spectator numbers, and social media mentions. Cross-Platform Sharing - Seamless integration with TikTok, Twitter, Instagram, and Discord. Influencer Partnerships - Exclusive fighter skins and tournaments for content creators. Community Rewards - Group achievements and milestones that reward the entire community. Community Features: Fighter Profiles - Detailed statistics, win/loss records, and fighting style breakdowns. Replay System - Watch and share epic moments from past matches with full camera control. Tournament Brackets - Follow major tournaments and championship events with real-time bracket updates. Social Media Integration - Share highlights, backing successes, and epic moments directly to social platforms.'
    },
    {
      sectionId: 'in-game-currency',
      title: 'Economy - Coins',
      content: 'Every game needs in-game currency, but ours is unique compared to most games because it\'s decentralized and has a set supply, giving fighters real ownership without manipulation from developers. Unlike traditional games where developers can inflate currency at will, our coins operate on blockchain technology with transparent tokenomics. This means fighters truly own their digital assets and can trade them freely without fear of arbitrary changes to the game\'s economy. The decentralized nature ensures that the value of fighter investments is protected by smart contracts rather than corporate decisions.'
    },
    {
      sectionId: 'token-economy',
      title: 'Token Distribution',
      content: 'Total Supply: 100,000,000,000 coins. Public: 30% (30B coins) - 100% unlock at TGE. Team: 15% (15B coins) - 12 month cliff + 20% daily linear per year. Foundation: 15% (15B coins) - 20% a year linear daily. Airdrops: 15% (15B coins) - 100% TGE unlock. Ecosystem Rewards: 10% (10B coins) - 20% per year daily linear. LP: 10% (10B coins) - 100% TGE unlock. Advisors: 5% (5B coins) - 12 month cliff + 20% daily linear per year.'
    },
    {
      sectionId: 'genesis-chads',
      title: 'Genesis Chads',
      content: 'The Genesis Chads collection represents the original foundation of the Lean Chad ecosystem, featuring uniquely hand-drawn cartoon characters created by founder Mike Hales in 2022. Each Chad was meticulously crafted with distinctive traits and personalities, forming the cornerstone of what would become a revolutionary gaming and NFT experience. These aren\'t just static collectibles—they\'re dynamic assets designed for utility and engagement. Each Genesis Chad will be progressively introduced to the in-game skins marketplace, where they\'ll be transformed into stunning 3D models ready for use across various gaming environments. The tokenomics behind Genesis Chads create a sustainable revenue-sharing ecosystem. When these 3D skins are purchased or traded on secondary markets, the original holders receive a portion of the revenue, establishing a continuous income stream that rewards early supporters and creates long-term value for the community. Beyond their utility in gaming, Genesis Chad holders—along with owners of any tier passes—are eligible for exclusive airdrops of $LCS tokens. Collections: Genesis Chads, Honorary Chads, All Access Pass, VIP Pass, Elite Pass. Airdrop Distribution - 5% of the supply is divided between: 2% Genesis Chads, 0.25% Honorary Chads, 0.25% All Access Pass, 1% VIP Pass, 1.5% Elite Pass.'
    },
    {
      sectionId: 'airdrop-calculator',
      title: 'Airdrop Calculator',
      content: 'Calculate your share of the 5,000,000,000 token airdrop based on your NFT holdings. Total Token Supply: 100,000,000,000. Airdrop Allocation: 5% (5,000,000,000 tokens). NFT Collections supply counts and allocation details. DeHub Partner Airdrop: As the builders behind the LCS game, 10% of the supply is reserved for the DeHub community. 7.5% for stakers and 2.5% for holders. DeHub Airdrop Calculator: Calculate your DeHub allocation based on your $DHB holdings and staked amounts. Total DeHub Allocation: 10% (10,000,000,000 tokens). Stakers Pool: 7.5% (7,500,000,000 tokens). Holders Pool: 2.5% (2,500,000,000 tokens). OG Bonus: 2x multiplier for stakers since launch. Veteran Bonus: 1.3x multiplier for stakers before Nov 16, 2024. Note: Bonuses are mutually exclusive (no stacking). Estimated TGE Price: $0.0002. Staking Bonuses: OG Bonus - Staked since launch (+100%). Veteran Bonus - Staked before Nov 16th, 2024 (+30%). For users who have been staking $DHB since the protocol launch or before November 16th, 2024.'
    },
    {
      sectionId: 'utility',
      title: 'Utility',
      content: 'In-Game Currency: Buy or sell skins from the store or secondary marketplace directly with other players. Tournament Entry: Access events and experiences, from tournaments to socials. Governance: Voting on game features and updates. Staking Rewards: Earn additional coins by staking. Care Packages: Send support items to players. Back Fighters: Support fighters with coins and share the loot if you win. However, if your fighter loses, you get nothing but shame.'
    },
    {
      sectionId: 'founding-team',
      title: 'Founding Team',
      content: 'Mike Hales: Founder and CEO of Rapz, a notable high end MMA fightwear brand backed by top UFC and boxing stars, with exclusive supplier rights to BKFC. Joint-owner of First Class, the UK\'s largest TikTok partner agency, approaching 1000 streamers signed on and reporting directly for the in-house executive team with offices in the UK and Asia. Professional MMA fighter with profiles on Tapology and ESPN. Social links: TikTok, Instagram, Twitter, Email. Malik Jan AKA mal.eth: Founder of DeHub (DHB) which Malik bootstrapped from 690k to 600m FDV with a ~1000x ROI at peak last bull run, amassing 50,000 holders and close to $10m in the LP, with over $1m in on-chain revenue and $1m in distributed rewards. Former top billing agent at UK\'s largest agency, Blue Arrow and Senior Consultant at World\'s largest agency Randstad. Raised 7 figures for Guide Dogs Charity during tenure as fundraising manager. Social links: Twitter, LinkedIn. Rayn Barrera AKA RaynRaps: Gaming and Web3 expert with over ten years in community growth and game development. Rayn is currently a co-founding Head of Community at Boss Fighters, Backed by Decentraland & Open Loot, the makers of Big Time. As Founder of UP LVL, a gaming and Web3 consulting firm, he\'s partnered with Ubisoft, Riot Games, Twitch and other leading industry giants. Social links: Twitch, YouTube, Instagram, Twitter. Bailey Young: Investments and tokenomics expert who played an instrumental role in the astronomic growth of DeHub in 2021, and oversaw the Blocjerk fundraise of $1,000,000 in 2023 which gave a peak ROI of 1,000%. Bailey is also a former professional gamer, ranking globally in the top 3 COD MW2 and top 100 on Warzone under the tag RickyBobby.'
    },
    {
      sectionId: 'brand-assets',
      title: 'Brand Assets',
      content: 'Download official Last Chad Standing brand assets for your use. All assets are provided in high quality formats. Logo Text: Official Last Chad Standing text logo. Fist Logo: LCS fist emblem logo. LCS Letters: LCS abbreviated letter logo. Usage Guidelines: These assets are for promotional and community use. Do not modify the logos without permission. Maintain proper spacing and proportions. Contact us for custom formats or additional assets.'
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} />
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} />
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
