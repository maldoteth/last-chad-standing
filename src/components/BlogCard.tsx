import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BlogPost } from '@/data/blogPosts';
import { formatDistance } from 'date-fns';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogCard = ({ post, featured = false }: BlogCardProps) => {
  const dateFromNow = formatDistance(new Date(post.date), new Date(), { addSuffix: true });

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${featured ? 'border-primary' : ''}`}>
      <Link to={`/blog/${post.id}`} className="block">
        {post.image && (
          <div className="aspect-video overflow-hidden rounded-t-lg">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <CardHeader className="pb-2">
          <div className="flex flex-wrap gap-2 mb-2">
            {post.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className={`font-semibold group-hover:text-primary transition-colors ${featured ? 'text-xl' : 'text-lg'}`}>
            {post.title}
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {post.excerpt}
          </p>
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{dateFromNow}</span>
            <span>{post.readTime}</span>
          </div>
          {post.author && (
            <div className="mt-2 text-sm text-muted-foreground">
              By {post.author}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
};

export default BlogCard;