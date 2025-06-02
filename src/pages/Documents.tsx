
import React from 'react';
import { ArrowLeft, FileText, Book, Code, Users, Target, TrendingUp, Gamepad2, UserCheck, Calendar, Coins, DollarSign, Mail, Zap, Map, Sword, Settings, Users2, Trophy, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

const Documents = () => {
  const documentSections = [
    {
      title: "Overview",
      icon: <Book size={20} />,
      items: [
        { title: "Game Overview", href: "#overview" },
        { title: "The Mission", href: "#mission" },
        { title: "Market Opportunity", href: "#market" }
      ]
    },
    {
      title: "Why LCS",
      icon: <Target size={20} />,
      items: [
        { title: "Market Gap", href: "#why" },
        { title: "Why Us", href: "#why-us" },
        { title: "Why Now", href: "#why-now" }
      ]
    },
    {
      title: "Team",
      icon: <UserCheck size={20} />,
      items: [
        { title: "Founding Team", href: "#founding-team" }
      ]
    },
    {
      title: "Game Features",
      icon: <Gamepad2 size={20} />,
      items: [
        { title: "Key Features", href: "#key-features" },
        { title: "Combat System", href: "#combat" },
        { title: "Character Creation", href: "#characters" },
        { title: "Battle Royale Rules", href: "#battle-royale" }
      ]
    },
    {
      title: "Roadmap",
      icon: <Calendar size={20} />,
      items: [
        { title: "Development Timeline", href: "#roadmap" },
        { title: "Future Growth Plans", href: "#future-growth" }
      ]
    },
    {
      title: "Tokenomics",
      icon: <Coins size={20} />,
      items: [
        { title: "LCS Token", href: "#lcs-token" },
        { title: "TGE Information", href: "#tge-info" }
      ]
    },
    {
      title: "Financials",
      icon: <DollarSign size={20} />,
      items: [
        { title: "Funding & Budget", href: "#financials" },
        { title: "Revenue Projections", href: "#projections" }
      ]
    },
    {
      title: "Getting Started",
      icon: <Code size={20} />,
      items: [
        { title: "First Match Guide", href: "#first-match" },
        { title: "Training & Skills", href: "#training" },
        { title: "Equipment & Gear", href: "#equipment" }
      ]
    },
    {
      title: "Community",
      icon: <Users size={20} />,
      items: [
        { title: "Tournaments", href: "#tournaments" },
        { title: "Leaderboards", href: "#leaderboards" },
        { title: "Discord Community", href: "#discord" },
        { title: "Streaming Guidelines", href: "#streaming" }
      ]
    },
    {
      title: "Contact",
      icon: <Mail size={20} />,
      items: [
        { title: "Reach Out", href: "#contact" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Game</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">Documentation</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 h-[calc(100vh-8rem)]">
              <ScrollArea className="h-full [&>[data-radix-scroll-area-viewport]]:!overflow-x-hidden [&>div>div[style]]:!scrollbar-none">
                <nav className="space-y-6 pr-4">
                  {documentSections.map((section) => (
                    <div key={section.title} className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-900 font-medium">
                        {section.icon}
                        <span>{section.title}</span>
                      </div>
                      <ul className="space-y-2 ml-6">
                        {section.items.map((item) => (
                          <li key={item.title}>
                            <a 
                              href={item.href}
                              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                            >
                              {item.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
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
                    
                    <section id="overview" className="mb-12">
                      <h1>Overview</h1>
                      <p className="text-lg text-gray-700 leading-relaxed">
                        'Last Chad Standing' (LCS) emerges as the first ever MMA battle royale game, 
                        fusing exhilarating martial arts combat with a winner-takes-all spectacle.
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        It encapsulates the fierce spirit of MMA and the tumultuous frenzy of battle royales, 
                        intertwined with the vibrant tapestry of internet culture via highly shareable viral moments.
                      </p>
                    </section>

                    <section id="why" className="mb-12">
                      <h2>Why LCS?</h2>
                      <p className="text-gray-700 leading-relaxed">
                        There are no other modern MMA games on consoles besides EA's widely panned UFC, 
                        and not a single option on PC.
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Existing MMA games lack online or multiplayer modes or real-time strategy, 
                        emphasizing one-on-one duels that offer limited replay value.
                      </p>
                    </section>

                    <section id="why-us" className="mb-12">
                      <h2>Why Us</h2>
                      <p className="text-gray-700 leading-relaxed">
                        LCS is crafted by a trusted and proven team who delivered every roadmap and who's 
                        first token (DHB) saw an ROI of 1000x, hitting over 500m FDV with a 9 figure LP 
                        at the peak of the 2021 bull run, reaching 50,000 holders.
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        We are MMA fighters and gamers deeply immersed in the art of combat, e-sports and 
                        blockchain with professional experience stemming from some of the largest companies in the world.
                      </p>
                      
                      <h3>Team Past</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        <div className="bg-gray-100 p-3 rounded-lg text-center">
                          <span className="font-medium">TikTok</span>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-lg text-center">
                          <span className="font-medium">Binance Custody</span>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-lg text-center">
                          <span className="font-medium">Ubisoft</span>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-lg text-center">
                          <span className="font-medium">DeHub</span>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-lg text-center">
                          <span className="font-medium">Randstad</span>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-lg text-center">
                          <span className="font-medium">Riot Games</span>
                        </div>
                      </div>
                    </section>

                    <section id="why-now" className="mb-12">
                      <h2>Why Now</h2>
                      <p className="text-gray-700 leading-relaxed">
                        EA Sports' latest installment of UFC has received disappointing ratings along with 
                        only being available on consoles, creating a significant opportunity in the market, 
                        especially given the absence of competing MMA games for fans of the world's fastest-growing 
                        sport, especially on PC.
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        We have also built a tier network of fighters, athletes and streamers that is primed 
                        and ready for this venture.
                      </p>
                    </section>

                    <section id="founding-team" className="mb-12">
                      <h2>Founding Team</h2>
                      <div className="space-y-8">
                        
                        {/* Mike Hales */}
                        <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 rounded-lg">
                          <div className="md:w-1/3">
                            <img 
                              src="/lovable-uploads/89896bcd-7068-4438-ba8d-95f8e577cb75.png" 
                              alt="Mike Hales" 
                              className="w-full h-64 object-cover rounded-lg"
                            />
                          </div>
                          <div className="md:w-2/3">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Mike Hales</h3>
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
                            <img 
                              src="/lovable-uploads/84ab9eed-00bc-425c-a953-3ea0478e464d.png" 
                              alt="Malik Jan" 
                              className="w-full h-64 object-cover rounded-lg"
                            />
                          </div>
                          <div className="md:w-2/3">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Malik Jan AKA mal.eth</h3>
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
                            <img 
                              src="/lovable-uploads/ea386eae-1f4f-44c0-ad78-7f038df224d3.png" 
                              alt="Rayn Barrera" 
                              className="w-full h-64 object-cover rounded-lg"
                            />
                          </div>
                          <div className="md:w-2/3">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Rayn Barrera AKA RaynRaps</h3>
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
                            <img 
                              src="/lovable-uploads/1373b087-4cb8-43e3-ae69-f3ff5c05a5d1.png" 
                              alt="Bailey Young" 
                              className="w-full h-64 object-cover rounded-lg"
                            />
                          </div>
                          <div className="md:w-2/3">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Bailey Young</h3>
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

                    <section id="mission" className="mb-12">
                      <h2>The Mission</h2>
                      <p className="text-gray-700 leading-relaxed">
                        To redefine combat sports in gaming by merging realism with the chaotic and universally 
                        adored excitement of the battle royale genre.
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        We're a team of real fighters and gamers creating something that fans will truly love 
                        and cherish forever.
                      </p>
                    </section>

                    <section id="market" className="mb-12">
                      <h2>The Market</h2>
                      <p className="text-gray-700 leading-relaxed">
                        The global gaming market is valued at $200+ billion, with battle royale games holding 
                        significant market share and MMA commonly cited as the fastest growing sport in the world.
                      </p>
                    </section>

                    <section id="key-features" className="mb-12">
                      <h2>The Game: Key Features</h2>
                      <ul className="space-y-4">
                        <li className="text-gray-700 leading-relaxed">
                          <strong>Massive multiplayer online brawler</strong> with free for all, solo and duo modes.
                        </li>
                        <li className="text-gray-700 leading-relaxed">
                          <strong>Customisable avatars & fight styles</strong> with unique skill trees and varying 
                          mobility options combined with dynamic weather to keep all on their toes.
                        </li>
                        <li className="text-gray-700 leading-relaxed">
                          <strong>Open world builder</strong> for developers to monetise and create economies 
                          within our ecosystem all powered by our in-game currency.
                        </li>
                      </ul>
                    </section>

                    <section id="roadmap" className="mb-12">
                      <h2>Development Timeline</h2>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Building & User Growth</h3>
                        <p className="text-gray-700 mb-4"><strong>Q1-2 2025:</strong> Alpha</p>
                        <p className="text-gray-700 mb-4"><strong>Q3-4 2025:</strong> Beta</p>
                        <p className="text-gray-700 mb-4"><strong>Q4 2025 - Q1 2026:</strong> Full Game Launch</p>
                        <p className="text-gray-700"><strong>Q2-4 2026:</strong> Post-launch updates and expansion</p>
                      </div>
                    </section>

                    <section id="future-growth" className="mb-12">
                      <h2>Future Growth Plans</h2>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Expansion packs with new fighting styles, game mechanics and settings. Introduction of live eSports events, 
                        and in-game partnerships with fighters, brands, IP, KOLs, meme coins as well as global MMA leagues, 
                        dojos, health clubs and beyond.
                      </p>
                    </section>

                    <section id="lcs-token" className="mb-12">
                      <h2>LCS Token</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Supply & Distribution</h3>
                          <p className="text-gray-700 mb-2"><strong>Total Supply:</strong> 100,000,000,000</p>
                          <ul className="space-y-2 text-gray-700">
                            <li>• 30% Community</li>
                            <li>• 25% TGE</li>
                            <li>• 20% LP</li>
                            <li>• 15% DAO</li>
                            <li>• 10% Team</li>
                          </ul>
                          <div className="mt-4">
                            <p className="text-gray-700"><strong>FDV at TGE:</strong> $20,000,000</p>
                            <p className="text-gray-700"><strong>Price at TGE:</strong> $0.0002</p>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Utility</h3>
                          <ul className="space-y-2 text-gray-700">
                            <li>• Only currency in-game for trading skins, purchasing assets, season passes, lootboxes and all other transactions</li>
                            <li>• Rewards for winners and community, sustained through revenue buy backs</li>
                            <li>• Required for governance, vote on game direction</li>
                          </ul>
                        </div>
                      </div>
                    </section>

                    <section id="tge-info" className="mb-12">
                      <h2>TGE Information</h2>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">LCS Token: TGE Intel</h3>
                        <div className="space-y-2 text-gray-700">
                          <p><strong>Listing FDV:</strong> $20,000,000</p>
                          <p><strong>Listing Price:</strong> 0.0002</p>
                          <p><strong>Listing Date:</strong> TBC</p>
                        </div>
                        
                        <h4 className="text-md font-semibold text-gray-900 mt-6 mb-3">Release Schedule:</h4>
                        <ul className="space-y-2 text-gray-700">
                          <li>• <strong>Sales:</strong> 100% TGE unlock</li>
                          <li>• <strong>Team:</strong> 20% per year, daily linear</li>
                          <li>• <strong>Community & DAO:</strong> To be voted via governance</li>
                        </ul>
                      </div>
                    </section>

                    <section id="financials" className="mb-12">
                      <h2>Financials</h2>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Funding</h3>
                          <p className="text-gray-700">
                            $5 million total raise goal to for AA game release and GTM campaigns.
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Budget Breakdown</h3>
                          <ul className="space-y-2 text-gray-700">
                            <li>• 30% Development</li>
                            <li>• 50% Marketing</li>
                            <li>• 20% Runway</li>
                          </ul>
                        </div>
                      </div>
                    </section>

                    <section id="projections" className="mb-12">
                      <h2>Revenue Projections</h2>
                      <p className="text-gray-700 leading-relaxed">
                        Forecasted revenue of $10 million in the first 24 months, scaling to $50 million by year three. 
                        Verticals include primary sales of skins and in game assets, secondary trading fees, token fees, 
                        LP fees and liquidations.
                      </p>
                    </section>

                    <section id="combat" className="mb-12">
                      <h2>Combat System</h2>
                      <p className="text-gray-700 leading-relaxed">
                        Master our intuitive yet deep combat system featuring striking, grappling, and ground game mechanics.
                      </p>
                    </section>

                    <section id="characters" className="mb-12">
                      <h2>Character Creation</h2>
                      <p className="text-gray-700 leading-relaxed">
                        Create your ultimate fighter with our comprehensive character creation system.
                        Choose from various fighting styles, customize your appearance, and develop your skills.
                      </p>
                    </section>

                    <section id="first-match" className="mb-12">
                      <h2>Your First Match</h2>
                      <p className="text-gray-700 leading-relaxed">
                        New to the game? Here's everything you need to know to jump into your first battle royale match.
                      </p>
                      <ol className="list-decimal list-inside space-y-2 text-gray-700">
                        <li>Complete the tutorial</li>
                        <li>Customize your character</li>
                        <li>Join a match lobby</li>
                        <li>Survive and be the last chad standing!</li>
                      </ol>
                    </section>

                    <section id="tournaments" className="mb-12">
                      <h2>Tournaments & Events</h2>
                      <p className="text-gray-700 leading-relaxed">
                        Compete in weekly tournaments and special events to prove you're the ultimate fighter.
                      </p>
                    </section>

                    <section id="contact" className="mb-12">
                      <h2>Reach Out</h2>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <img src="/lovable-uploads/77a6c004-93ed-49ee-a5d0-6056ee852612.png" alt="X" className="w-5 h-5" />
                            <span className="text-gray-700">@lcs_game</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Mail size={20} className="text-gray-600" />
                            <span className="text-gray-700">finance@lastchadstanding.com</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
                              <span className="text-white text-xs">T</span>
                            </div>
                            <span className="text-gray-700">@cryptoxba</span>
                          </div>
                          <div className="mt-6">
                            <p className="text-gray-700 font-medium">www.lastchadstanding.com</p>
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
    </div>
  );
};

export default Documents;
