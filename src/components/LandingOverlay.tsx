import { useState } from 'react';
import { X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import SocialLinks from '@/components/SocialLinks';
import BrokenByDesign from '@/components/ui/broken-by-design';

const STORAGE_KEY = 'lcs_landing_seen_v2';

const hasSeenLanding = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

const LandingOverlay = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(() => location.pathname === '/' && !hasSeenLanding());
  const [closing, setClosing] = useState(false);

  const handleEnter = () => {
    setClosing(true);
    setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, 'true');
      } catch {
        // private browsing — just close
      }
      setVisible(false);
    }, 500);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black transition-transform duration-500 ease-in-out ${closing ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <BrokenByDesign
        title="last chad standing."
        logoSrc="/lovable-uploads/fa645b0b-fcbe-46f6-9054-45d5ab0929d6.png"
        height="100%"
      />

      {/* Enter */}
      <button
        onClick={handleEnter}
        className="absolute top-6 right-6 z-[110] p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
        aria-label="Close"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      {/* Bottom CTAs */}
      <div
        className="absolute inset-x-0 bottom-0 z-[110] flex flex-col items-center pb-8 px-4 pointer-events-none"
        onClick={(e) => {
          const target = e.target as HTMLElement;
          const link = target.closest('[aria-label]');
          if (link) {
            const label = link.getAttribute('aria-label');
            if (label === 'Game' || label === 'Documentation') {
              handleEnter();
            }
          }
        }}
      >
        <div className="pointer-events-auto">
          <SocialLinks />
        </div>
      </div>
    </div>
  );
};

export default LandingOverlay;
