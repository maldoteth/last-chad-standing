import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Search, Copy, Check } from "lucide-react";
import DocumentSearch from "@/components/DocumentSearch";
import { useToast } from "@/hooks/use-toast";

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const { toast } = useToast();

  const colorPalette = [
    { name: 'Primary Blue', hex: '#1E40AF', description: 'Main brand color for headers and CTAs' },
    { name: 'Secondary Blue', hex: '#3B82F6', description: 'Secondary actions and links' },
    { name: 'Accent Orange', hex: '#F97316', description: 'Accent color for highlights and warnings' },
    { name: 'Success Green', hex: '#10B981', description: 'Success states and positive actions' },
    { name: 'Dark Gray', hex: '#1F2937', description: 'Primary text and dark backgrounds' },
    { name: 'Medium Gray', hex: '#6B7280', description: 'Secondary text and subtle elements' },
    { name: 'Light Gray', hex: '#F3F4F6', description: 'Background and card surfaces' },
    { name: 'Pure White', hex: '#FFFFFF', description: 'Clean backgrounds and contrast' },
  ];

  const copyToClipboard = (hex: string, colorName: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    toast({
      title: "Color copied!",
      description: `${colorName} (${hex}) copied to clipboard`,
    });
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const documentSections = [
    {
      title: "Onboarding",
      description: "Everything you need to get started with our platform.",
      documents: [
        { name: "Welcome Guide", link: "#" },
        { name: "Account Setup", link: "#" },
      ],
    },
    {
      title: "Integrations",
      description: "Connect our platform with your favorite tools.",
      documents: [
        { name: "Salesforce Integration", link: "#" },
        { name: "Slack Integration", link: "#" },
      ],
    },
    {
      title: "API Documentation",
      description: "Detailed documentation for our API.",
      documents: [
        { name: "Authentication", link: "#" },
        { name: "Endpoints", link: "#" },
      ],
    },
    {
      title: "Security",
      description: "Learn about our security practices.",
      documents: [
        { name: "Data Encryption", link: "#" },
        { name: "Privacy Policy", link: "#" },
      ],
    },
    {
      title: "Troubleshooting",
      description: "Common issues and how to solve them.",
      documents: [
        { name: "FAQ", link: "#" },
        { name: "Contact Support", link: "#" },
      ],
    },
    {
      title: "Terms of Service",
      description: "Our terms and conditions.",
      documents: [{ name: "Terms of Service", link: "#" }],
    },
  ];

  const [filteredSections, setFilteredSections] = useState(documentSections);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filtered = documentSections.filter((section) => {
        const sectionMatches = section.title
          .toLowerCase()
          .includes(query.toLowerCase());
        const documentMatches = section.documents.some((doc) =>
          doc.name.toLowerCase().includes(query.toLowerCase())
        );
        return sectionMatches || documentMatches;
      });
      setFilteredSections(filtered);
    } else {
      setFilteredSections(documentSections);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-bold text-2xl text-blue-700 mr-4">
              LCS
            </span>
            <span className="text-gray-600">/</span>
            <span className="ml-4 text-gray-800 font-semibold">
              Documents
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-blue-100 to-indigo-200 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-4">
            Comprehensive Documentation
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Everything you need to know about our platform.
          </p>
          <div className="max-w-md mx-auto">
            <Input
              type="search"
              placeholder="Search documents..."
              className="shadow-lg"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <DocumentSearch onSearch={handleSearch} />

          {filteredSections.map((section, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl font-bold">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-gray-600 mb-4">{section.description}</p>
                <ul>
                  {section.documents.map((doc, docIndex) => (
                    <li key={docIndex} className="mb-2">
                      <a
                        href={doc.link}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {doc.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
          
          {/* Brand Assets Section */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl font-bold">Brand Assets</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:shadow-lg transition-shadow">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">LCS</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Primary Logo</h3>
                  <p className="text-sm text-gray-600 mb-4">Official LCS logo for main brand usage</p>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download PNG
                  </Button>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:shadow-lg transition-shadow">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">LCS</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Secondary Logo</h3>
                  <p className="text-sm text-gray-600 mb-4">Alternative logo for special applications</p>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download SVG
                  </Button>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200 hover:shadow-lg transition-shadow">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">LCS</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Icon Mark</h3>
                  <p className="text-sm text-gray-600 mb-4">Icon version for small applications</p>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download ICO
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Palette Section */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl font-bold">Color Palette</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Official LCS brand colors for consistent visual identity across all platforms and materials.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Usage Guidelines:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Use Primary Blue for main headers and call-to-action buttons</li>
                    <li>• Secondary Blue for links and secondary actions</li>
                    <li>• Accent Orange for highlights and important notifications</li>
                    <li>• Maintain proper contrast ratios for accessibility</li>
                  </ul>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {colorPalette.map((color, index) => (
                  <div key={index} className="group">
                    <div className="relative overflow-hidden rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300">
                      <div 
                        className="h-24 w-full cursor-pointer transition-transform group-hover:scale-105"
                        style={{ backgroundColor: color.hex }}
                        onClick={() => copyToClipboard(color.hex, color.name)}
                      />
                      <div className="p-4 bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">{color.name}</h4>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => copyToClipboard(color.hex, color.name)}
                          >
                            {copiedColor === color.hex ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                        <div 
                          className="font-mono text-xs text-gray-600 mb-2 cursor-pointer hover:text-gray-900 transition-colors"
                          onClick={() => copyToClipboard(color.hex, color.name)}
                        >
                          {color.hex}
                        </div>
                        <p className="text-xs text-gray-500 leading-tight">{color.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Tip:</strong> Click on any color swatch or hex code to copy it to your clipboard.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl font-bold">
                Accessibility
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-gray-600 mb-4">
                Ensuring our platform is accessible to everyone.
              </p>
              <Badge variant="secondary">WCAG 2.1 Compliant</Badge>
              <Separator className="my-4" />
              <p className="text-sm text-gray-500">
                We follow the Web Content Accessibility Guidelines (WCAG) to
                ensure our platform is usable by people with disabilities.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl font-bold">Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-gray-600 mb-4">Need assistance?</p>
              <p className="text-gray-600">
                Email us at{" "}
                <a
                  href="mailto:support@example.com"
                  className="text-red-600 hover:underline"
                >
                  support@example.com
                </a>{" "}
                or call us at (555) 123-4567.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Documents;
