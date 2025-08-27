import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Coins, ShoppingBag, Users, Package, CreditCard, Trophy, Star, Zap, Shield, Gamepad2 } from "lucide-react";

const Game = () => {
  const [userCoins, setUserCoins] = useState(2500);
  const [ownedItems, setOwnedItems] = useState<string[]>([]);

  // Mock store items
  const storeItems = {
    skins: [
      { id: "skin1", name: "Neon Warrior", price: 500, image: "🎭", rarity: "Epic" },
      { id: "skin2", name: "Shadow Hunter", price: 750, image: "🥷", rarity: "Legendary" },
      { id: "skin3", name: "Cyber Knight", price: 300, image: "🤖", rarity: "Rare" },
    ],
    accessories: [
      { id: "acc1", name: "Golden Crown", price: 200, image: "👑", rarity: "Rare" },
      { id: "acc2", name: "Plasma Wings", price: 400, image: "🪶", rarity: "Epic" },
      { id: "acc3", name: "Digital Visor", price: 150, image: "🥽", rarity: "Common" },
    ],
    mobility: [
      { id: "mob1", name: "Rocket Boots", price: 600, image: "🚀", rarity: "Epic" },
      { id: "mob2", name: "Hover Board", price: 450, image: "🛹", rarity: "Rare" },
      { id: "mob3", name: "Speed Boost", price: 250, image: "⚡", rarity: "Common" },
    ]
  };

  const coinPackages = [
    { amount: 1000, price: "$4.99", bonus: "0% Bonus" },
    { amount: 2500, price: "$9.99", bonus: "25% Bonus" },
    { amount: 5000, price: "$19.99", bonus: "50% Bonus" },
    { amount: 10000, price: "$34.99", bonus: "75% Bonus" },
  ];

  const purchaseItem = (item: any) => {
    if (userCoins >= item.price) {
      setUserCoins(prev => prev - item.price);
      setOwnedItems(prev => [...prev, item.id]);
    }
  };

  const ComingSoonDialog = ({ children, title }: { children: React.ReactNode, title: string }) => (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-black/95 border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-primary">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            This feature is coming soon! Stay tuned for updates.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-gray-900 border-b border-primary/20 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <Gamepad2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">Player1337</h1>
              <p className="text-muted-foreground">Level 42 • Chad Elite</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg">
              <Coins className="w-5 h-5 text-primary" />
              <span className="font-bold">{userCoins.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-lg">
              <Star className="w-5 h-5 text-secondary" />
              <span>2,847 XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="store" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-gray-900 border border-primary/20">
            <TabsTrigger value="lobby" className="data-[state=active]:bg-primary data-[state=active]:text-black">
              <Users className="w-4 h-4 mr-2" />
              Lobby
            </TabsTrigger>
            <TabsTrigger value="store" className="data-[state=active]:bg-primary data-[state=active]:text-black">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Store
            </TabsTrigger>
            <TabsTrigger value="market" className="data-[state=active]:bg-primary data-[state=active]:text-black">
              <CreditCard className="w-4 h-4 mr-2" />
              Transfer Market
            </TabsTrigger>
            <TabsTrigger value="locker" className="data-[state=active]:bg-primary data-[state=active]:text-black">
              <Package className="w-4 h-4 mr-2" />
              Locker
            </TabsTrigger>
            <TabsTrigger value="coins" className="data-[state=active]:bg-primary data-[state=active]:text-black">
              <Coins className="w-4 h-4 mr-2" />
              Coins
            </TabsTrigger>
            <TabsTrigger value="season" className="data-[state=active]:bg-primary data-[state=active]:text-black">
              <Trophy className="w-4 h-4 mr-2" />
              Season Pass
            </TabsTrigger>
          </TabsList>

          {/* Lobby Tab */}
          <TabsContent value="lobby" className="mt-6">
            <ComingSoonDialog title="Lobby">
              <Card className="bg-gray-900 border-primary/20 cursor-pointer hover:bg-gray-800 transition-colors">
                <CardHeader className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto text-primary mb-4" />
                  <CardTitle className="text-2xl">Game Lobby</CardTitle>
                  <CardDescription>Join matches and play with friends</CardDescription>
                </CardHeader>
              </Card>
            </ComingSoonDialog>
          </TabsContent>

          {/* Store Tab */}
          <TabsContent value="store" className="mt-6 space-y-8">
            {Object.entries(storeItems).map(([category, items]) => (
              <div key={category}>
                <h2 className="text-xl font-bold capitalize mb-4 text-primary">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => (
                    <Card key={item.id} className="bg-gray-900 border-primary/20 hover:border-primary/40 transition-all">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="text-4xl">{item.image}</div>
                          <Badge variant={item.rarity === 'Legendary' ? 'default' : 'secondary'}>
                            {item.rarity}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Coins className="w-4 h-4" />
                          {item.price} LCS
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button 
                          onClick={() => purchaseItem(item)}
                          disabled={ownedItems.includes(item.id) || userCoins < item.price}
                          className="w-full"
                          variant={ownedItems.includes(item.id) ? "secondary" : "default"}
                        >
                          {ownedItems.includes(item.id) ? "Owned" : 
                           userCoins < item.price ? "Insufficient Coins" : "Purchase"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Transfer Market Tab */}
          <TabsContent value="market" className="mt-6">
            <ComingSoonDialog title="Transfer Market">
              <Card className="bg-gray-900 border-primary/20 cursor-pointer hover:bg-gray-800 transition-colors">
                <CardHeader className="text-center py-12">
                  <CreditCard className="w-16 h-16 mx-auto text-primary mb-4" />
                  <CardTitle className="text-2xl">Transfer Market</CardTitle>
                  <CardDescription>Trade items with other players</CardDescription>
                </CardHeader>
              </Card>
            </ComingSoonDialog>
          </TabsContent>

          {/* Locker Tab */}
          <TabsContent value="locker" className="mt-6">
            <Card className="bg-gray-900 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Your Assets
                </CardTitle>
                <CardDescription>Items you own and can equip</CardDescription>
              </CardHeader>
              <CardContent>
                {ownedItems.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No items owned yet</p>
                    <p>Visit the Store to purchase skins, accessories, and mobility items</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ownedItems.map((itemId) => {
                      const item = Object.values(storeItems).flat().find(i => i.id === itemId);
                      return item ? (
                        <Card key={itemId} className="bg-black border-primary/20">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="text-4xl">{item.image}</div>
                              <Badge variant="outline" className="border-primary text-primary">Equipped</Badge>
                            </div>
                            <CardTitle className="text-lg">{item.name}</CardTitle>
                            <CardDescription>{item.rarity}</CardDescription>
                          </CardHeader>
                        </Card>
                      ) : null;
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Coins Tab */}
          <TabsContent value="coins" className="mt-6 space-y-6">
            <Card className="bg-gray-900 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-primary" />
                  LCS Coin Balance
                </CardTitle>
                <CardDescription>Purchase coins to buy items in the store</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <div className="text-4xl font-bold text-primary mb-2">{userCoins.toLocaleString()}</div>
                  <p className="text-muted-foreground">LCS Coins</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-primary/20">
              <CardHeader>
                <CardTitle>Purchase Coins</CardTitle>
                <CardDescription>Choose a package to add coins to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {coinPackages.map((pkg, index) => (
                    <Card key={index} className="bg-black border-primary/20 hover:border-primary/40 transition-all">
                      <CardHeader className="text-center">
                        <div className="text-2xl font-bold text-primary">{pkg.amount.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">LCS Coins</div>
                        <div className="text-lg font-semibold">{pkg.price}</div>
                        <Badge variant="secondary" className="text-xs">{pkg.bonus}</Badge>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full" variant="outline">
                          Purchase
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Season Pass Tab */}
          <TabsContent value="season" className="mt-6">
            <ComingSoonDialog title="Season Pass">
              <Card className="bg-gray-900 border-primary/20 cursor-pointer hover:bg-gray-800 transition-colors">
                <CardHeader className="text-center py-12">
                  <Trophy className="w-16 h-16 mx-auto text-primary mb-4" />
                  <CardTitle className="text-2xl">Season Pass</CardTitle>
                  <CardDescription>Battle pass progression and exclusive rewards</CardDescription>
                </CardHeader>
              </Card>
            </ComingSoonDialog>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Game;