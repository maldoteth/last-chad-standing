import React from 'react';
import BlogCard from './BlogCard';
import { BlogPost } from '@/data/blogPosts';

interface BlogSectionProps {
  title: string;
  posts: BlogPost[];
  featured?: boolean;
}

const BlogSection = ({ title, posts, featured = false }: BlogSectionProps) => {
  if (posts.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-foreground mb-6">{title}</h2>
      <div className={`grid gap-6 ${
        featured 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2' 
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      }`}>
        {posts.map(post => (
          <BlogCard key={post.id} post={post} featured={featured} />
        ))}
      </div>
    </section>
  );
};

export default BlogSection;