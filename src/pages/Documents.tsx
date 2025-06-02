
import React from 'react';
import { ArrowLeft, FileText, Book, Code, Users, Target, TrendingUp, Gamepad2, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

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
            <nav className="space-y-6 sticky top-24">
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
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
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
                          src="/lovable-uploads/909e4c87-a878-40aa-96be-f612a1dbac06.png" 
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
