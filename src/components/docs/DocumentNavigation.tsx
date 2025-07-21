import React from 'react';
import { Gamepad2, DollarSign, UserCheck, Palette, ExternalLink } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const DocumentNavigation = () => {
  const documentSections = [
    {
      title: "Game Overview",
      icon: <Gamepad2 size={20} />,
      items: [
        { title: "Core Concept", href: "#core-concept" },
        { title: "Game World & Environment", href: "#game-world" },
        { title: "Gameplay Mechanics", href: "#gameplay-mechanics" },
        { title: "Enhanced Zone Mechanics", href: "#storm-cage-mechanics" },
        { title: "Progression & Customization", href: "#progression" },
        { title: "Game Modes", href: "#game-modes" },
        { title: "Monetization & Marketplace", href: "#monetization" },
        { title: "Visuals and Sound", href: "#visuals-sound" },
        { title: "Marketing Strategy", href: "#marketing" },
        { title: "Controls", href: "#controls" },
        { title: "Combat Mechanics", href: "#combat-mechanics" },
        { title: "Weapons & Inventory", href: "#weapons-inventory" },
        { title: "Movement & Traversal", href: "#movement" },
        { title: "Map & Hazards", href: "#map-hazards" },
        { title: "Strategy", href: "#strategy" },
        { title: "Social Aspects", href: "#social-aspects" }
      ]
    },
    {
      title: "Economy",
      icon: <DollarSign size={20} />,
      items: [
        { title: "Coins", href: "#in-game-currency" },
        { title: "Distribution", href: "#token-economy" },
        { title: "Airdrops", href: "#airdrop-calculator" },
        { title: "Utility", href: "#utility" }
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
      title: "Brand",
      icon: <Palette size={20} />,
      items: [
        { title: "Assets", href: "#brand-assets" }
      ]
    },
    {
      title: "Links",
      icon: <ExternalLink size={20} />,
      items: [
        { title: "Email", href: "mailto:chads@lastchadstanding.com" },
        { title: "Instagram", href: "https://instagram.com/lastchadstanding" },
        { title: "X (Twitter)", href: "https://x.com/lcs_game" },
        { title: "LCFC", href: "https://leanchadfight.club" }
      ]
    }
  ];

  return (
    <div className="sticky top-24 h-[calc(100vh-8rem)]">
      <ScrollArea className="h-full [&>[data-radix-scroll-area-viewport]]:!overflow-x-hidden [&>div>div[style]]:!scrollbar-none">
        <nav className="space-y-6 pr-4">
          {documentSections.map(section => (
            <div key={section.title} className="space-y-3">
              <div className="flex items-center gap-2 text-gray-900 font-medium">
                {section.icon}
                <span>{section.title}</span>
              </div>
              <ul className="space-y-2 ml-6">
                {section.items.map(item => (
                  <li key={item.title}>
                    {item.href.startsWith('http') ? (
                      <a 
                        href={item.href} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-600 hover:text-gray-900 transition-colors text-sm flex items-center gap-1"
                      >
                        {item.title}
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <a 
                        href={item.href} 
                        className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                      >
                        {item.title}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
};

export default DocumentNavigation;