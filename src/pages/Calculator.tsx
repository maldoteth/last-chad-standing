import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Calculator = () => {
  const [holdings, setHoldings] = useState({
    genesisDads: 0,
    honoraryChads: 0,
    allAccessPass: 0,
    vipPass: 0,
    elitePass: 0,
  });

  // NFT Collection Data
  const collections = {
    genesisDads: { name: 'Genesis Chads', supply: 2076 },
    honoraryChads: { name: 'Honorary Chads', supply: 15 },
    allAccessPass: { name: 'All Access Pass', supply: 881 },
    vipPass: { name: 'VIP Pass', supply: 245 },
    elitePass: { name: 'Elite Pass', supply: 82 },
  };

  // Airdrop Constants
  const TOTAL_AIRDROP = 50_000_000; // 5% of 1,000,000,000

  // Calculate tokens per NFT for each collection
  const tokensPerNFT = useMemo(() => {
    const totalNFTs = Object.values(collections).reduce((sum, collection) => sum + collection.supply, 0);
    
    return Object.entries(collections).reduce((acc, [key, collection]) => {
      acc[key] = TOTAL_AIRDROP / totalNFTs;
      return acc;
    }, {} as Record<string, number>);
  }, []);

  // Calculate user's total allocation
  const userAllocation = useMemo(() => {
    return Object.entries(holdings).reduce((total, [key, amount]) => {
      return total + (amount * tokensPerNFT[key]);
    }, 0);
  }, [holdings, tokensPerNFT]);

  const handleInputChange = (collection: string, value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    setHoldings(prev => ({
      ...prev,
      [collection]: numValue
    }));
  };

  const clearAll = () => {
    setHoldings({
      genesisDads: 0,
      honoraryChads: 0,
      allAccessPass: 0,
      vipPass: 0,
      elitePass: 0,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border/40 px-4 py-4">
        <div className="container mx-auto flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="h-4 w-px bg-border"></div>
          <h1 className="text-lg font-semibold">Airdrop Calculator</h1>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">LCS Airdrop Calculator</h1>
          <p className="text-muted-foreground">
            Calculate your share of the 50,000,000 token airdrop based on your NFT holdings
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Your NFT Holdings</CardTitle>
              <CardDescription>
                Enter the number of NFTs you hold for each collection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(collections).map(([key, collection]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key} className="flex justify-between">
                    <span>{collection.name}</span>
                    <span className="text-xs text-muted-foreground">
                      Total Supply: {collection.supply.toLocaleString()}
                    </span>
                  </Label>
                  <Input
                    id={key}
                    type="number"
                    min="0"
                    value={holdings[key as keyof typeof holdings] || ''}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    placeholder="0"
                    className="bg-background"
                  />
                </div>
              ))}
              
              <Button onClick={clearAll} variant="outline" className="w-full mt-4">
                Clear All
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle>Your Airdrop Allocation</CardTitle>
              <CardDescription>
                Based on your NFT holdings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Breakdown by Collection */}
              <div className="space-y-3">
                {Object.entries(collections).map(([key, collection]) => {
                  const userTokens = holdings[key as keyof typeof holdings] * tokensPerNFT[key];
                  if (holdings[key as keyof typeof holdings] === 0) return null;
                  
                  return (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {collection.name} ({holdings[key as keyof typeof holdings]}x)
                      </span>
                      <span className="font-medium">
                        {userTokens.toLocaleString(undefined, { maximumFractionDigits: 0 })} tokens
                      </span>
                    </div>
                  );
                })}
              </div>

              {userAllocation > 0 && <div className="border-t border-border pt-3" />}

              {/* Total Allocation */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Allocation:</span>
                  <span className="text-xl font-bold text-primary">
                    {userAllocation.toLocaleString(undefined, { maximumFractionDigits: 0 })} tokens
                  </span>
                </div>
                
                {userAllocation > 0 && (
                  <div className="text-center text-sm text-muted-foreground">
                    {((userAllocation / TOTAL_AIRDROP) * 100).toFixed(4)}% of total airdrop
                  </div>
                )}
              </div>

              {userAllocation === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  Enter your NFT holdings above to see your airdrop allocation
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Airdrop Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Token Distribution</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Total Token Supply: 1,000,000,000</li>
                  <li>Airdrop Allocation: 5% (50,000,000 tokens)</li>
                  <li>Tokens per NFT: {(TOTAL_AIRDROP / Object.values(collections).reduce((sum, c) => sum + c.supply, 0)).toLocaleString(undefined, { maximumFractionDigits: 0 })}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">NFT Collections</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {Object.entries(collections).map(([key, collection]) => (
                    <li key={key}>
                      {collection.name}: {collection.supply.toLocaleString()} supply
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calculator;