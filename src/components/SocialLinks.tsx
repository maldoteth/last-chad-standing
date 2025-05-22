
import React from 'react';
import { Instagram, Twitter, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SocialLink {
  name: string;
  icon: React.ReactNode;
  url: string;
}

interface SocialLinksProps {
  links?: SocialLink[]; // Make the links prop optional
  className?: string;
}

const defaultSocialLinks: SocialLink[] = [
  {
    name: "Website",
    icon: <Globe size={24} />,
    url: "https://leanchadfight.club"
  },
  {
    name: "Twitter",
    icon: <Twitter size={24} />,
    url: "https://x.com/lcs_game"
  },
  {
    name: "Instagram",
    icon: <Instagram size={24} />,
    url: "https://www.instagram.com/lastchadstanding/"
  }
];

const SocialLinks = ({ links = defaultSocialLinks, className }: SocialLinksProps) => {
  return (
    <div className={cn("flex items-center justify-center gap-6", className)}>
      {links.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/80 hover:text-white transition-colors hover:scale-110 transform duration-200"
          aria-label={link.name}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
