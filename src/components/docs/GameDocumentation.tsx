
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function GameDocumentation() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-4">Game Documentation</h2>
        <p className="text-lg text-muted-foreground">
          Comprehensive guide to MindForge gameplay mechanics and features.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Core Gameplay
              <Badge variant="outline">v1.0</Badge>
            </CardTitle>
            <CardDescription>
              Understanding the fundamental mechanics of MindForge
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Overview</h4>
              <p className="text-sm text-muted-foreground">
                MindForge is a strategic blockchain-based game where players build, upgrade, and manage virtual forges to create unique digital assets.
              </p>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2">Key Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Build and customize your forge</li>
                <li>• Craft unique NFT items</li>
                <li>• Trade in the marketplace</li>
                <li>• Participate in tournaments</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Your first steps in the MindForge universe
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">1. Connect Your Wallet</h4>
              <p className="text-sm text-muted-foreground">
                Start by connecting your preferred Web3 wallet to access the game.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. Choose Your Starter Pack</h4>
              <p className="text-sm text-muted-foreground">
                Select from three different starter packs, each with unique advantages.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3. Build Your First Forge</h4>
              <p className="text-sm text-muted-foreground">
                Place your forge in the virtual world and begin crafting.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
