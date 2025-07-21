import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BrandAssets = () => {
  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="brand-assets" className="mb-12">
      <h2 className="text-3xl font-bold">Brand Assets</h2>
      <p className="mb-6">Download official Last Chad Standing brand assets for promotional use.</p>
      
      {/* Logo Downloads */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4">Logo Variations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <img 
              src="/lovable-uploads/896892f1-7ebc-4852-acea-80dcdbf7c545.png" 
              alt="Primary Logo" 
              className="w-full h-32 object-contain mb-4"
            />
            <h4 className="font-semibold mb-2">Primary Logo</h4>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleDownload('/lovable-uploads/896892f1-7ebc-4852-acea-80dcdbf7c545.png', 'lcs-primary-logo.png')}
              className="flex items-center gap-2"
            >
              <Download size={16} />
              Download PNG
            </Button>
          </div>

          <div className="bg-black p-6 rounded-lg border border-gray-200">
            <img 
              src="/lovable-uploads/896892f1-7ebc-4852-acea-80dcdbf7c545.png" 
              alt="Logo on Dark" 
              className="w-full h-32 object-contain mb-4 filter brightness-0 invert"
            />
            <h4 className="font-semibold mb-2 text-white">Logo on Dark</h4>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleDownload('/lovable-uploads/896892f1-7ebc-4852-acea-80dcdbf7c545.png', 'lcs-logo-dark.png')}
              className="flex items-center gap-2"
            >
              <Download size={16} />
              Download PNG
            </Button>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-orange-500 p-6 rounded-lg border border-gray-200">
            <img 
              src="/lovable-uploads/896892f1-7ebc-4852-acea-80dcdbf7c545.png" 
              alt="Logo on Gradient" 
              className="w-full h-32 object-contain mb-4 filter brightness-0 invert"
            />
            <h4 className="font-semibold mb-2 text-white">Logo on Brand</h4>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleDownload('/lovable-uploads/896892f1-7ebc-4852-acea-80dcdbf7c545.png', 'lcs-logo-brand.png')}
              className="flex items-center gap-2"
            >
              <Download size={16} />
              Download PNG
            </Button>
          </div>
        </div>
      </div>

      {/* Color Palette */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4">Brand Colors</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-full h-20 bg-red-600 rounded-lg mb-2 shadow-md"></div>
            <p className="font-semibold">Primary Red</p>
            <p className="text-sm text-gray-600">#DC2626</p>
          </div>
          <div className="text-center">
            <div className="w-full h-20 bg-orange-500 rounded-lg mb-2 shadow-md"></div>
            <p className="font-semibold">Secondary Orange</p>
            <p className="text-sm text-gray-600">#F97316</p>
          </div>
          <div className="text-center">
            <div className="w-full h-20 bg-gray-900 rounded-lg mb-2 shadow-md"></div>
            <p className="font-semibold">Dark Gray</p>
            <p className="text-sm text-gray-600">#111827</p>
          </div>
          <div className="text-center">
            <div className="w-full h-20 bg-gray-100 rounded-lg mb-2 shadow-md border"></div>
            <p className="font-semibold">Light Gray</p>
            <p className="text-sm text-gray-600">#F3F4F6</p>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4">Typography</h3>
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="text-4xl font-bold mb-2">Inter Bold</h4>
            <p className="text-gray-600">Used for headings and titles</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-lg mb-2">Inter Regular</p>
            <p className="text-gray-600">Used for body text and descriptions</p>
          </div>
        </div>
      </div>

      {/* Usage Guidelines */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Usage Guidelines</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Always maintain proper logo spacing and proportions</li>
          <li>Do not alter, stretch, or modify the logo in any way</li>
          <li>Ensure sufficient contrast when placing logo on backgrounds</li>
          <li>Use official brand colors when creating promotional materials</li>
          <li>Contact the team for usage approval in commercial applications</li>
        </ul>
      </div>
    </section>
  );
};

export default BrandAssets;