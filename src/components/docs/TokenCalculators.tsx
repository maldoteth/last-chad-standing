
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TokenDistributionChart } from "@/components/TokenDistributionChart";
import { TokenReleaseChart } from "@/components/TokenReleaseChart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function TokenCalculators() {
  const [airdropAmount, setAirdropAmount] = useState("");
  const [estimatedValue, setEstimatedValue] = useState(0);

  const calculateAirdrop = () => {
    const amount = parseFloat(airdropAmount);
    if (!isNaN(amount)) {
      setEstimatedValue(amount * 0.25); // Example calculation
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-4">Token Information</h2>
        <p className="text-lg text-muted-foreground">
          MindForge token distribution, release schedule, and calculators.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Airdrop Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="airdrop-amount">Token Amount</Label>
              <Input
                id="airdrop-amount"
                type="number"
                value={airdropAmount}
                onChange={(e) => setAirdropAmount(e.target.value)}
                placeholder="Enter token amount"
              />
            </div>
            <Button onClick={calculateAirdrop}>Calculate Value</Button>
            {estimatedValue > 0 && (
              <p className="text-sm text-muted-foreground">
                Estimated value: ${estimatedValue.toFixed(2)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Token Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <TokenDistributionChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Release Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <TokenReleaseChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
