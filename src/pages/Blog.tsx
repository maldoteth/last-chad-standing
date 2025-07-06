import React, { useState, useMemo } from 'react';
import { blogPosts } from '@/data/blogPosts';
import BlogHeader from '@/components/BlogHeader';
import BlogSection from '@/components/BlogSection';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return blogPosts;
    
    return blogPosts.filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const latestPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <BlogHeader 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {searchQuery && (
          <div className="mb-8">
            <p className="text-muted-foreground">
              {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''} for "{searchQuery}"
            </p>
          </div>
        )}

        {featuredPosts.length > 0 && (
          <BlogSection 
            title="Featured Posts" 
            posts={featuredPosts} 
            featured={true}
          />
        )}

        {latestPosts.length > 0 && (
          <BlogSection 
            title="Latest Posts" 
            posts={latestPosts}
          />
        )}

        {filteredPosts.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No posts found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;