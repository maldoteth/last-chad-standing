
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function BrandAssets() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const { toast } = useToast();

  const brandAssets = [
    {
      title: "Logo Package",
      description: "Complete logo set with variations",
      file: "mindforge-logo-package.zip",
      size: "2.4 MB"
    },
    {
      title: "Brand Guidelines",
      description: "Typography, colors, and usage guidelines",
      file: "brand-guidelines.pdf",
      size: "1.2 MB"
    },
    {
      title: "Marketing Materials",
      description: "Templates and promotional assets",
      file: "marketing-materials.zip",
      size: "5.8 MB"
    }
  ];

  const colorPalette = [
    { name: "Primary Blue", hex: "#3B82F6", description: "Main brand color" },
    { name: "Secondary Purple", hex: "#8B5CF6", description: "Accent color" },
    { name: "Success Green", hex: "#10B981", description: "Success states" },
    { name: "Warning Orange", hex: "#F59E0B", description: "Warning states" },
    { name: "Error Red", hex: "#EF4444", description: "Error states" },
    { name: "Dark Gray", hex: "#374151", description: "Primary text" },
    { name: "Light Gray", hex: "#9CA3AF", description: "Secondary text" },
    { name: "Background", hex: "#F9FAFB", description: "Background color" }
  ];

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    toast({
      title: "Color copied!",
      description: `${hex} copied to clipboard`,
    });
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-4">Brand Assets</h2>
        <p className="text-lg text-muted-foreground">
          Download official MindForge brand assets and guidelines.
        </p>
      </div>

      <div className="grid gap-6">
        {brandAssets.map((asset) => (
          <Card key={asset.title}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{asset.title}</span>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{asset.description}</p>
              <p className="text-xs text-muted-foreground">File size: {asset.size}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h3 className="text-2xl font-bold tracking-tight mb-4">Color Palette</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {colorPalette.map((color) => (
            <Card key={color.hex} className="overflow-hidden">
              <div
                className="h-24 w-full cursor-pointer"
                style={{ backgroundColor: color.hex }}
                onClick={() => copyToClipboard(color.hex)}
              />
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">{color.name}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(color.hex)}
                  >
                    {copiedColor === color.hex ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground font-mono">{color.hex}</p>
                <p className="text-xs text-muted-foreground mt-1">{color.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
