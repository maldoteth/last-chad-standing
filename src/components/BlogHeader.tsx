import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface BlogHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const BlogHeader = ({ searchQuery, onSearchChange }: BlogHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
        LCS Community Blog
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
        Stay updated with the latest news, strategies, and insights from the Last Chad Standing community
      </p>
      
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
        <Input
          type="text"
          placeholder="Search blog posts..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};

export default BlogHeader;