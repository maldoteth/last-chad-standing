import React from 'react';
import SocialLinks from '@/components/SocialLinks';

const Blog = () => {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Navigation Interface */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-4 sm:px-10 py-7">
        <div className="grid grid-cols-3 items-center">
          {/* Left Icon - Minimalist Iris */}
          <div className="flex items-center justify-start">
            <img src="/lovable-uploads/ebc2efc2-8d89-4230-921a-5d8b6b3e2e17.png" alt="LCS Fist Logo" className="opacity-70 w-7 h-7 sm:w-6 sm:h-6" />
          </div>

          {/* Center Links */}
          <div className="flex justify-center">
            <SocialLinks />
          </div>

          {/* Right Status */}
          <div className="flex justify-end">
            <div className="font-inter text-xs sm:text-sm text-muted-foreground text-right hidden sm:block">
              PHASE: <span className="text-primary">2/4</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Announcements On The Way</h1>
          <p className="text-muted-foreground text-lg"> Check back soon!</p>
        </div>
      </div>
    </div>
  );
};
export default Blog;