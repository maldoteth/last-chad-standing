
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, FileText, Calendar, User, Tag, ExternalLink } from "lucide-react";
import DocumentSearch from "@/components/DocumentSearch";

interface Document {
  id: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  downloadUrl: string;
  externalUrl?: string;
}

const documents: Document[] = [
  {
    id: "1",
    title: "Q3 2024 Financial Report",
    description: "Comprehensive financial analysis and performance metrics for the third quarter of 2024.",
    date: "2024-10-15",
    author: "Finance Team",
    category: "Financial",
    tags: ["quarterly", "revenue", "analysis"],
    downloadUrl: "/documents/q3-2024-report.pdf"
  },
  {
    id: "2",
    title: "Product Roadmap 2025",
    description: "Strategic product development plan and feature roadmap for the upcoming year.",
    date: "2024-10-01",
    author: "Product Team",
    category: "Strategy",
    tags: ["roadmap", "product", "planning"],
    downloadUrl: "/documents/roadmap-2025.pdf"
  },
  {
    id: "3",
    title: "Technical Architecture Guide",
    description: "Detailed documentation of system architecture and implementation guidelines.",
    date: "2024-09-20",
    author: "Engineering Team",
    category: "Technical",
    tags: ["architecture", "technical", "guide"],
    downloadUrl: "/documents/tech-architecture.pdf"
  },
  {
    id: "4",
    title: "Market Research Analysis",
    description: "In-depth market analysis and competitive landscape research findings.",
    date: "2024-09-10",
    author: "Research Team",
    category: "Research",
    tags: ["market", "research", "analysis"],
    downloadUrl: "/documents/market-research.pdf"
  },
  {
    id: "5",
    title: "Compliance Guidelines 2024",
    description: "Updated compliance requirements and regulatory guidelines for 2024.",
    date: "2024-08-30",
    author: "Legal Team",
    category: "Legal",
    tags: ["compliance", "legal", "guidelines"],
    downloadUrl: "/documents/compliance-2024.pdf"
  },
  {
    id: "6",
    title: "Security Best Practices",
    description: "Comprehensive security protocols and best practices for all team members.",
    date: "2024-08-15",
    author: "Security Team",
    category: "Security",
    tags: ["security", "protocols", "best-practices"],
    downloadUrl: "/documents/security-practices.pdf"
  }
];

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", ...Array.from(new Set(documents.map(doc => doc.category)))];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (url: string, title: string) => {
    // In a real app, this would trigger the actual download
    console.log(`Downloading: ${title} from ${url}`);
  };

  const announcementText = "🎉 New LCS Deck presentation available - Updated quarterly metrics and strategic insights now ready for download";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Announcement Banner */}
      <div className="bg-primary text-primary-foreground py-2 overflow-hidden relative">
        <div className="flex animate-marquee whitespace-nowrap">
          <span className="mx-8 text-sm font-medium">{announcementText}</span>
          <span className="mx-8 text-sm font-medium">{announcementText}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4 font-exo">
            Document Center
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-sora">
            Access important documents, reports, and resources all in one place
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold mb-2 font-exo">
                      {doc.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground font-sora">
                      {doc.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {doc.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(doc.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {doc.author}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {doc.tags.map((tag) => (
                      <div key={tag} className="flex items-center text-xs text-muted-foreground">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => handleDownload(doc.downloadUrl, doc.title)}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    {doc.externalUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(doc.externalUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No documents found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filter criteria
            </p>
          </div>
        )}

        {/* Document Search Component */}
        <DocumentSearch />
      </div>
    </div>
  );
};

export default Documents;
