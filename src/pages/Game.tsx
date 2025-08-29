import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Banknote,
  Gamepad2,
  Package2,
  PercentCircle,
  Target,
  Users2,
} from "lucide-react";
import { useGame } from "@/hooks/useGame";
import { useInventory } from "@/hooks/useInventory";
import { cn } from "@/lib/utils";
import { GameItem } from "@/components/GameItem";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BuyCurrencyDialog } from "@/components/BuyCurrencyDialog";

type ObjectivesView = "daily" | "weekly" | "quests";

const Game = () => {
  const { address } = useAccount();
  const { ready, currency, xp, level } = useGame();
  const { inventory, loading } = useInventory();
  const { privy } = usePrivy();
  const [objectivesView, setObjectivesView] = useState<ObjectivesView>("quests");
  const { toast } = useToast();

  useEffect(() => {
    if (!address) {
      toast({
        title: "Connect your wallet to play!",
        description: "You must connect your wallet to play the game.",
      });
    }
  }, [address, toast]);

  return (
    <div className="container relative">
      <div className="flex justify-between items-center">
        <h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 text-foreground">
          Game
        </h1>
        <div className="flex gap-2">
          {privy?.authenticated ? (
            <Button variant="secondary" asChild>
              <Link to="/inventory">
                Inventory <Package2 className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          ) : null}
          <BuyCurrencyDialog />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="w-4 h-4" />
              Currency
            </CardTitle>
            <CardDescription>Your in-game currency.</CardDescription>
          </CardHeader>
          <CardContent>
            {ready ? (
              <div className="text-2xl font-bold">{currency}</div>
            ) : (
              <Skeleton className="w-[100px] h-8" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PercentCircle className="w-4 h-4" />
              XP
            </CardTitle>
            <CardDescription>Your experience points.</CardDescription>
          </CardHeader>
          <CardContent>
            {ready ? (
              <div className="text-2xl font-bold">{xp}</div>
            ) : (
              <Skeleton className="w-[100px] h-8" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users2 className="w-4 h-4" />
              Level
            </CardTitle>
            <CardDescription>Your current level.</CardDescription>
          </CardHeader>
          <CardContent>
            {ready ? (
              <div className="text-2xl font-bold">{level}</div>
            ) : (
              <Skeleton className="w-[100px] h-8" />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="quests" className="w-full">
          <TabsList>
            <TabsTrigger
              value="quests"
              onClick={() => setObjectivesView("quests")}
            >
              Quests
            </TabsTrigger>
            <TabsTrigger
              value="weekly"
              onClick={() => setObjectivesView("weekly")}
            >
              Weekly
            </TabsTrigger>
            <TabsTrigger
              value="daily"
              onClick={() => setObjectivesView("daily")}
            >
              Daily
            </TabsTrigger>
          </TabsList>
          <TabsContent value="quests" className="space-y-2">
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
              <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                <Target className="w-5 h-5" />
                {objectivesView === 'quests' ? 'Quests' : objectivesView === 'weekly' ? 'Weekly Objectives' : 'Daily Objectives'}
              </h3>
              <div>
                <p className="text-sm text-muted-foreground">
                  No quests available yet. Check back later!
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="weekly" className="space-y-2">
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
              <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                <Target className="w-5 h-5" />
                {objectivesView === 'quests' ? 'Quests' : objectivesView === 'weekly' ? 'Weekly Objectives' : 'Daily Objectives'}
              </h3>
              <div>
                <p className="text-sm text-muted-foreground">
                  No weekly objectives available yet. Check back later!
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="daily" className="space-y-2">
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
              <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                <Target className="w-5 h-5" />
                {objectivesView === 'quests' ? 'Quests' : objectivesView === 'weekly' ? 'Weekly Objectives' : 'Daily Objectives'}
              </h3>
              <div>
                <p className="text-sm text-muted-foreground">
                  No daily objectives available yet. Check back later!
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-6">
        <h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight transition-colors first:mt-0 text-foreground flex items-center gap-2">
          <Gamepad2 className="w-5 h-5" />
          Items
        </h2>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent>
                  <Skeleton className="w-full h-[100px]" />
                  <Skeleton className="w-[80%] h-4 mt-2" />
                  <Skeleton className="w-[60%] h-4 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {inventory?.map((item) => (
              <GameItem key={item.item_id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
