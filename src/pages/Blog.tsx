import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Construction } from 'lucide-react';

const Brick = ({ delay }: { delay: number }) => (
  <div 
    className="w-12 h-6 bg-gradient-to-br from-red-700 to-red-800 border border-red-900 animate-fade-in"
    style={{ 
      animationDelay: `${delay}ms`,
      animationFillMode: 'both'
    }}
  />
);

const BrickWall = ({ progress }: { progress: number }) => {
  const totalBricks = 60;
  const visibleBricks = Math.floor((progress / 100) * totalBricks);
  
  return (
    <div className="grid grid-cols-10 gap-1 max-w-md mx-auto mb-8">
      {Array.from({ length: totalBricks }).map((_, index) => {
        const row = Math.floor(index / 10);
        const col = index % 10;
        const isOffset = row % 2 === 1;
        const shouldShow = index < visibleBricks;
        
        return (
          <div
            key={index}
            className={`${isOffset && col === 9 ? 'opacity-0' : ''} ${isOffset ? 'ml-6' : ''}`}
          >
            {shouldShow && <Brick delay={index * 50} />}
          </div>
        );
      })}
    </div>
  );
};

const Blog = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 80);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <Construction className="mx-auto mb-4 w-12 h-12 text-muted-foreground animate-pulse" />
          <h1 className="text-4xl font-bold text-foreground mb-2">Blog Under Construction</h1>
          <p className="text-muted-foreground text-lg mb-8">Building something amazing...</p>
        </div>
        
        <BrickWall progress={progress} />
        
        <div className="space-y-4">
          <Progress value={progress} className="w-full max-w-md mx-auto" />
          <p className="text-sm text-muted-foreground">
            {progress < 100 ? `Building progress: ${progress}%` : 'Construction complete! Check back soon for our blog.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Blog;