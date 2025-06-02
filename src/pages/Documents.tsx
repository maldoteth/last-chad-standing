
import React from 'react';
import { ArrowLeft, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

const Documents = () => {
  const documentSections = [
    {
      title: "Team",
      icon: <UserCheck size={20} />,
      items: [
        { title: "Founding Team", href: "#founding-team" }
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
