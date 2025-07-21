import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import TokenDistributionChart from '@/components/TokenDistributionChart';
import TokenReleaseChart from '@/components/TokenReleaseChart';
import { formatNumberWithAbbreviation } from '@/lib/utils';

const TokenCalculators = () => {
  const [holdings, setHoldings] = useState({
    genesisDads: 0,
    honoraryChads: 0,
    allAccessPass: 0,
    vipPass: 0,
    elitePass: 0
  });

  const [dhbHoldings, setDhbHoldings] = useState(0);
  const [dhbStaked, setDhbStaked] = useState(0);
  const [ogBonus, setOgBonus] = useState(false);
  const [veteranBonus, setVeteranBonus] = useState(false);

  // NFT Collection Data
  const collections = {
    genesisDads: { name: 'Genesis Chads', supply: 2076 },
    honoraryChads: { name: 'Honorary Chads', supply: 133 },
    allAccessPass: { name: 'All Access Pass', supply: 881 },
    vipPass: { name: 'VIP Pass', supply: 245 },
    elitePass: { name: 'Elite Pass', supply: 82 }
  };

  // Constants
  const TOTAL_AIRDROP = 5_000_000_000;
  const TOTAL_DHB_STAKED = 1_792_474_753;
  const TOTAL_DHB_HOLDINGS = 2_903_416_217;
  const TOTAL_SUPPLY = 100_000_000_000;

  // Calculate tokens per NFT for each collection
  const tokensPerNFT = useMemo(() => {
    const allocations = {
      genesisDads: 0.02 * TOTAL_SUPPLY,
      honoraryChads: 0.0025 * TOTAL_SUPPLY,
      allAccessPass: 0.0025 * TOTAL_SUPPLY,
      elitePass: 0.015 * TOTAL_SUPPLY,
      vipPass: 0.01 * TOTAL_SUPPLY
    };
    return Object.entries(collections).reduce((acc, [key, collection]) => {
      acc[key] = allocations[key as keyof typeof allocations] / collection.supply;
      return acc;
    }, {} as Record<string, number>);
  }, []);

  // Calculate user's total allocation
  const userAllocation = useMemo(() => {
    return Object.entries(holdings).reduce((total, [key, amount]) => {
      return total + amount * tokensPerNFT[key];
    }, 0);
  }, [holdings, tokensPerNFT]);

  // DeHub calculations
  const dhbAllocation = useMemo(() => {
    const stakerPercentage = dhbStaked / TOTAL_DHB_STAKED;
    const holderPercentage = dhbHoldings / TOTAL_DHB_HOLDINGS;
    const baseStakerAllocation = stakerPercentage * (0.075 * TOTAL_SUPPLY);
    const holderAllocation = holderPercentage * (0.025 * TOTAL_SUPPLY);

    let bonusMultiplier = 1;
    if (ogBonus) {
      bonusMultiplier = 2;
    } else if (veteranBonus) {
      bonusMultiplier = 1.3;
    }
    const stakerAllocation = baseStakerAllocation * bonusMultiplier;
    const bonusTokens = baseStakerAllocation * (bonusMultiplier - 1);
    
    return {
      baseStakerTokens: isNaN(baseStakerAllocation) ? 0 : baseStakerAllocation,
      bonusTokens: isNaN(bonusTokens) ? 0 : bonusTokens,
      stakerTokens: isNaN(stakerAllocation) ? 0 : stakerAllocation,
      holderTokens: isNaN(holderAllocation) ? 0 : holderAllocation,
      totalTokens: (isNaN(stakerAllocation) ? 0 : stakerAllocation) + (isNaN(holderAllocation) ? 0 : holderAllocation),
      stakerPercentage: isNaN(stakerPercentage) ? 0 : stakerPercentage * 100,
      holderPercentage: isNaN(holderPercentage) ? 0 : holderPercentage * 100,
      bonusMultiplier: bonusMultiplier
    };
  }, [dhbStaked, dhbHoldings, ogBonus, veteranBonus]);

  const handleInputChange = (collection: string, value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    setHoldings(prev => ({ ...prev, [collection]: numValue }));
  };

  const clearAll = () => {
    setHoldings({
      genesisDads: 0,
      honoraryChads: 0,
      allAccessPass: 0,
      vipPass: 0,
      elitePass: 0
    });
    setDhbHoldings(0);
    setDhbStaked(0);
    setOgBonus(false);
    setVeteranBonus(false);
  };

  return (
    <>
      {/* Token Economy Section */}
      <section id="token-economy" className="mb-12">
        <h2 className="text-3xl font-bold">Token Distribution</h2>
        <p className="mb-6">Last Chad Standing ($LCS) has a total supply of 100 billion tokens distributed across various stakeholders and use cases.</p>
        <div className="my-8">
          <TokenDistributionChart />
        </div>
        <div className="my-8">
          <TokenReleaseChart />
        </div>
      </section>

      {/* Airdrop Calculator Section */}
      <section id="airdrop-calculator" className="mb-12">
        <h2 className="text-3xl font-bold">Airdrop Calculator</h2>
        <p className="mb-6">Calculate your potential $LCS token allocation based on your NFT holdings and DeHub participation.</p>
        
        {/* NFT Holdings Calculator */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>NFT Holdings Calculator</CardTitle>
            <CardDescription>Enter your NFT holdings to calculate your allocation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {Object.entries(collections).map(([key, collection]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>{collection.name} (Supply: {collection.supply.toLocaleString()})</Label>
                  <Input
                    id={key}
                    type="number"
                    min="0"
                    max={collection.supply}
                    value={holdings[key as keyof typeof holdings] || ''}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    placeholder="0"
                  />
                  <p className="text-sm text-gray-600">
                    {formatNumberWithAbbreviation(tokensPerNFT[key])} tokens per NFT
                  </p>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Your NFT Allocation:</h4>
              <p className="text-2xl font-bold text-green-600">
                {formatNumberWithAbbreviation(userAllocation)} $LCS
              </p>
            </div>
          </CardContent>
        </Card>

        {/* DeHub Calculator */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>DeHub Holdings Calculator</CardTitle>
            <CardDescription>Enter your $DHB holdings and staking amounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="dhb-holdings">$DHB Holdings</Label>
                <Input
                  id="dhb-holdings"
                  type="number"
                  min="0"
                  value={dhbHoldings || ''}
                  onChange={(e) => setDhbHoldings(parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dhb-staked">$DHB Staked</Label>
                <Input
                  id="dhb-staked"
                  type="number"
                  min="0"
                  value={dhbStaked || ''}
                  onChange={(e) => setDhbStaked(parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="og-bonus"
                  checked={ogBonus}
                  onCheckedChange={(checked) => {
                    setOgBonus(checked as boolean);
                    if (checked) setVeteranBonus(false);
                  }}
                />
                <Label htmlFor="og-bonus">OG Bonus (2x multiplier)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="veteran-bonus"
                  checked={veteranBonus}
                  onCheckedChange={(checked) => {
                    setVeteranBonus(checked as boolean);
                    if (checked) setOgBonus(false);
                  }}
                />
                <Label htmlFor="veteran-bonus">Veteran Bonus (1.3x multiplier)</Label>
              </div>
            </div>

            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold">Your DeHub Allocation Breakdown:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Staker Percentage:</strong> {dhbAllocation.stakerPercentage.toFixed(6)}%</p>
                  <p><strong>Holder Percentage:</strong> {dhbAllocation.holderPercentage.toFixed(6)}%</p>
                  <p><strong>Bonus Multiplier:</strong> {dhbAllocation.bonusMultiplier}x</p>
                </div>
                <div>
                  <p><strong>Base Staker Tokens:</strong> {formatNumberWithAbbreviation(dhbAllocation.baseStakerTokens)}</p>
                  <p><strong>Bonus Tokens:</strong> {formatNumberWithAbbreviation(dhbAllocation.bonusTokens)}</p>
                  <p><strong>Holder Tokens:</strong> {formatNumberWithAbbreviation(dhbAllocation.holderTokens)}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-2xl font-bold text-blue-600">
                  Total: {formatNumberWithAbbreviation(dhbAllocation.totalTokens)} $LCS
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Combined Total Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-center text-gray-900 mb-2">
                {formatNumberWithAbbreviation(userAllocation + dhbAllocation.totalTokens)} $LCS
              </p>
              <p className="text-center text-gray-600">
                Total estimated airdrop allocation
              </p>
            </div>
            <div className="mt-4 flex justify-center">
              <Button onClick={clearAll} variant="outline">
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default TokenCalculators;