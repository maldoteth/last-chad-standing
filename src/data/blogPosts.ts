export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  image?: string;
  tags: string[];
  featured: boolean;
  author?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "welcome-to-lcs",
    title: "Welcome to Last Chad Standing",
    excerpt: "Discover the ultimate gaming experience that combines strategy, skill, and community in one epic battle royale.",
    content: "Last Chad Standing represents a new era in competitive gaming...",
    date: "2024-01-15",
    readTime: "3 min read",
    image: "/lovable-uploads/896892f1-7ebc-4852-acea-80dcdbf7c545.png",
    tags: ["Gaming", "Community", "Launch"],
    featured: true,
    author: "LCS Team"
  },
  {
    id: "token-economics-explained",
    title: "Understanding LCS Token Economics",
    excerpt: "Deep dive into the tokenomics that power the Last Chad Standing ecosystem and reward system.",
    content: "The LCS token serves as the backbone of our gaming economy...",
    date: "2024-01-10",
    readTime: "5 min read",
    image: "/lovable-uploads/ac3e1f52-ba21-4588-9051-87eef47caf5c.png",
    tags: ["DeFi", "Tokenomics", "Strategy"],
    featured: true,
    author: "Economics Team"
  },
  {
    id: "gaming-strategies",
    title: "Pro Gaming Strategies for Victory",
    excerpt: "Master the art of Last Chad Standing with these expert tips and tricks from our top players.",
    content: "Success in Last Chad Standing requires more than just quick reflexes...",
    date: "2024-01-05",
    readTime: "4 min read",
    image: "/lovable-uploads/b31c9ab4-6dcf-4a77-bdf6-7e82e5a8c66a.png",
    tags: ["Gaming", "Strategy", "Tips"],
    featured: false,
    author: "Pro Gaming Team"
  },
  {
    id: "community-update-january",
    title: "January Community Update",
    excerpt: "Latest developments, upcoming features, and community highlights from the past month.",
    content: "We're excited to share the latest updates from the LCS community...",
    date: "2024-01-01",
    readTime: "2 min read",
    tags: ["Community", "Updates", "News"],
    featured: false,
    author: "Community Team"
  }
];