
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const BrandAssets = () => {
  const handleLogoDownload = () => {
    const link = document.createElement('a');
    link.href = '/lovable-uploads/af18551a-62b4-4f17-84d9-0215cff91604.png';
    link.download = 'last-chad-standing-logo.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Brand Assets
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Download official Last Chad Standing logos and brand assets for your projects.
          </p>
        </div>

        {/* Logo Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold mb-6">Official Logo</h2>
          
          {/* Logo Display */}
          <div className="bg-white/10 rounded-lg p-8 mb-6 flex items-center justify-center">
            <img 
              src="/lovable-uploads/af18551a-62b4-4f17-84d9-0215cff91604.png" 
              alt="Last Chad Standing Logo" 
              className="max-w-full h-auto max-h-48"
            />
          </div>

          {/* Download Button */}
          <Button 
            onClick={handleLogoDownload}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Download size={20} />
            Download Logo (PNG)
          </Button>

          {/* Usage Guidelines */}
          <div className="mt-8 p-6 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-lg font-semibold mb-4">Usage Guidelines</h3>
            <ul className="space-y-2 text-white/80">
              <li>• Please maintain the logo's aspect ratio and don't distort it</li>
              <li>• Ensure sufficient contrast when placing on backgrounds</li>
              <li>• Don't modify the colors or add effects to the logo</li>
              <li>• Use the logo to represent Last Chad Standing authentically</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandAssets;
