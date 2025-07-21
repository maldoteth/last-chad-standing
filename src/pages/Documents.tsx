import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Copy, Check } from 'lucide-react';
import DocumentSearch from '@/components/DocumentSearch';
import TokenDistributionChart from '@/components/TokenDistributionChart';
import TokenReleaseChart from '@/components/TokenReleaseChart';
import { useToast } from '@/hooks/use-toast';

const Documents = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { toast } = useToast();

  const handleCopyClick = () => {
    navigator.clipboard.writeText(
      '0x0000000000000000000000000000000000000000'
    );
    setIsCopied(true);
    toast({
      title: 'Copied!',
      description: 'Address copied to clipboard.',
    });

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Official Documents & Brand Assets
          </h1>
          <p className="text-slate-400">
            All the resources you need to integrate with our brand and
            understand our tokenomics.
          </p>
        </div>

        {/* Search Bar and Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <Button 
              variant="secondary" 
              onClick={() => setIsSearchOpen(true)}
              className="w-full"
            >
              Search Documentation
            </Button>
            <DocumentSearch
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
            />
          </div>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Contract Address</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-slate-300 text-sm">
                0x0000000000000000000000000000000000000000
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyClick}
                disabled={isCopied}
              >
                {isCopied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Token Information Tabs */}
        <Tabs defaultValue="distribution" className="mb-16">
          <TabsList>
            <TabsTrigger value="distribution">Token Distribution</TabsTrigger>
            <TabsTrigger value="release">Token Release Schedule</TabsTrigger>
          </TabsList>
          <TabsContent value="distribution">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Token Distribution Chart
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TokenDistributionChart />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="release">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Token Release Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TokenReleaseChart />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Brand Assets */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Brand Assets</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* Logo Downloads */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Logo Downloads</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="secondary">
                  <Download className="mr-2 h-4 w-4" />
                  Download Logo (SVG)
                </Button>
                <Button variant="secondary">
                  <Download className="mr-2 h-4 w-4" />
                  Download Logo (PNG)
                </Button>
              </CardContent>
            </Card>

            {/* Social Media Assets */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Social Media Assets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="secondary">
                  <Download className="mr-2 h-4 w-4" />
                  Download Banner (Twitter)
                </Button>
                <Button variant="secondary">
                  <Download className="mr-2 h-4 w-4" />
                  Download Profile Picture
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Color Palette */}
          <Card className="mt-8 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Color Palette</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { hex: '#1C1C1C', name: 'Deep black/dark gray', description: 'main logo fill' },
                  { hex: '#2B2B2B', name: 'Charcoal gray', description: 'logo shading' },
                  { hex: '#4B4B4B', name: 'Dark chrome outline', description: 'chrome outline' },
                  { hex: '#A8A8A8', name: 'Mid gray/chrome detail', description: 'chrome detail' },
                  { hex: '#D9D9D9', name: 'Light silver highlight', description: 'silver highlight' },
                  { hex: '#F2F2F2', name: 'Light cream', description: 'fist fill' }
                ].map((color, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/30">
                    <div 
                      className="w-12 h-12 rounded-lg border-2 border-slate-600 flex-shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="flex-1">
                      <div className="text-white font-medium">{color.hex}</div>
                      <div className="text-slate-300 text-sm">{color.name}</div>
                      <div className="text-slate-400 text-xs">({color.description})</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Usage Guidelines */}
          <Card className="mt-8 bg-blue-900/30 border-blue-700">
            <CardHeader>
              <CardTitle className="text-white">Usage Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-blue-100 space-y-4">
                <p>• Always maintain proper spacing around the logo</p>
                <p>• Use high contrast backgrounds for optimal visibility</p>
                <p>• Do not modify, stretch, or alter the logo proportions</p>
                <p>• Ensure minimum size requirements are met for readability</p>
                <p>• Use appropriate file formats for different applications</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Resources Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Additional Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Whitepaper */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Whitepaper</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4">
                  In-depth information about our project, vision, and
                  technology.
                </p>
                <Button variant="secondary">
                  <Download className="mr-2 h-4 w-4" />
                  Download Whitepaper (PDF)
                </Button>
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Community Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4">
                  Learn about our community standards and code of conduct.
                </p>
                <Button variant="secondary">
                  View Community Guidelines
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  What is the purpose of this project?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Our project aims to revolutionize the way people interact with
                  blockchain technology.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  How can I get involved?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  You can get involved by joining our community, contributing to
                  the development, or providing feedback.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
