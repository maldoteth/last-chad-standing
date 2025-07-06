
import React from 'react';
import { Instagram, Globe, Layers, BookOpen, Bell } from 'lucide-react';
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
  theme?: 'light' | 'dark';
}

const defaultSocialLinks: SocialLink[] = [
  {
    name: "X",
    icon: <img src="/lovable-uploads/77a6c004-93ed-49ee-a5d0-6056ee852612.png" alt="X" className="w-6 h-6" />,
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
    name: "Blog",
    icon: <Bell className="w-6 h-6" />,
    to: "/blog"
  }
];

const SocialLinks = ({
  links = defaultSocialLinks,
  className,
  theme = 'dark'
}: SocialLinksProps) => {
  const getSocialLinks = (theme: 'light' | 'dark') => [
    {
      name: "X",
      icon: <img 
        src={theme === 'light' ? "/lovable-uploads/13b1e254-7a27-4fc3-8040-9882d7705c70.png" : "/lovable-uploads/77a6c004-93ed-49ee-a5d0-6056ee852612.png"} 
        alt="X" 
        className="w-6 h-6" 
      />,
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
      name: "Blog",
      icon: <Bell className="w-6 h-6" />,
      to: "/blog"
    }
  ];

  const socialLinks = getSocialLinks(theme);
  return (
    <div className={cn("flex items-center justify-center gap-6", className)}>
      {socialLinks.map(link => {
        const baseClasses = theme === 'light' 
          ? "text-muted-foreground hover:text-foreground" 
          : "text-white/80 hover:text-white";
        
        const commonProps = {
          key: link.name,
          className: `${baseClasses} transition-colors hover:scale-110 transform duration-200`,
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
