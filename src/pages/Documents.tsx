import React, { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import DocumentSearch from '@/components/DocumentSearch';
import DocumentNavigation from '@/components/docs/DocumentNavigation';
import GameDocumentation from '@/components/docs/GameDocumentation';
import TokenCalculators from '@/components/docs/TokenCalculators';
import TeamSection from '@/components/docs/TeamSection';
import BrandAssets from '@/components/docs/BrandAssets';

const Documents = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleSearchClick = () => {
    if (window.innerWidth < 640) {
      setIsMobileSearchOpen(true);
    } else {
      setIsSearchOpen(true);
    }
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setIsMobileSearchOpen(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" asChild className="flex items-center gap-2">
                  <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                    <ArrowLeft size={20} />
                    <span className="hidden sm:inline">Back</span>
                  </Link>
                </Button>
                
                <h1 className="text-xl font-semibold text-gray-900 hidden sm:block">Fight Paper</h1>
              </div>
              
              {/* Logo in the middle */}
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <img src="/lovable-uploads/896892f1-7ebc-4852-acea-80dcdbf7c545.png" alt="Last Chad Standing Logo" className="h-14 w-auto opacity-90" />
              </div>
              
              <Button variant="outline" size="sm" onClick={handleSearchClick} className="flex items-center gap-2">
                <Search size={16} />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden sm:inline-flex pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  ⌘K
                </kbd>
              </Button>
            </div>
          </div>
        </header>

        {/* Mobile Search Inline */}
        {isMobileSearchOpen && <DocumentSearch isOpen={isMobileSearchOpen} onClose={handleSearchClose} isMobileInline={true} />}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <DocumentNavigation />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <ScrollArea className="h-[calc(100vh-8rem)]">
                  <div className="p-8">
                    <div className="prose prose-gray max-w-none">
                      
                      {/* Scrolling Announcement */}
                      <div className="mb-6 overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg border-2 border-orange-600 shadow-lg">
                        <div className="py-3 px-4">
                          <div className="text-sm sm:text-base font-semibold text-center">
                            🔔 Airdrop calculators are out now! click airdrops in the menu or{' '}
                            <button onClick={() => {
                              const element = document.getElementById('airdrop-calculator');
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                              }
                            }} className="underline hover:text-yellow-300 transition-colors font-bold">
                              tap here
                            </button>
                            {' '}to view now
                          </div>
                        </div>
                      </div>

                      <GameDocumentation />
                      <TokenCalculators />
                      <TeamSection />
                      <BrandAssets />
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DocumentSearch isOpen={isSearchOpen} onClose={handleSearchClose} />
    </>
  );
};

export default Documents;