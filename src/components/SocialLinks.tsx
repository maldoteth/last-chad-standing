
import React from 'react';
import { Instagram, Globe, Layers, BookOpen, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SocialLink {
  name: string;
  icon: React.ReactNode;
  url?: string;
  to?: string;
}

interface SocialLinksProps {
  links?: SocialLink[]; // Make the links prop optional
  className?: string;
}

const defaultSocialLinks: SocialLink[] = [
  {
    name: "X",
    icon: <img src="/lovable-uploads/3c1059ce-1948-46a2-bc2a-8e6c6b55079d.png" alt="X" className="w-6 h-6" />,
    url: "https://x.com/lcs_game"
  },
  {
    name: "Instagram",
    icon: <Instagram className="w-6 h-6" />,
    url: "https://www.instagram.com/lastchadstanding/"
  },
  {
    name: "Deck",
    icon: <Layers className="w-6 h-6" />,
    url: "https://lcsdeck.com"
  },
  {
    name: "Documentation",
    icon: <BookOpen className="w-6 h-6" />,
    to: "/docs"
  },
  {
    name: "Game",
    icon: <Gamepad2 className="w-6 h-6" />,
    to: "/game"
  }
];

const SocialLinks = ({
  links = defaultSocialLinks,
  className
}: SocialLinksProps) => {
  return (
    <div className={cn("flex items-center justify-center gap-6", className)}>
      {links.map(link => {
        const commonProps = {
          key: link.name,
          className: "text-white/80 hover:text-white transition-colors hover:scale-110 transform duration-200",
          "aria-label": link.name
        };

        if (link.to) {
          return (
            <Link {...commonProps} to={link.to}>
              {link.icon}
            </Link>
          );
        }

        return (
          <a {...commonProps} href={link.url} target="_blank" rel="noopener noreferrer">
            {link.icon}
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
