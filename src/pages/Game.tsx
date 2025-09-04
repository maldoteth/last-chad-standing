import React, { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  Trophy, 
  Home, 
  Store, 
  Settings, 
  Plus, 
  Info,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Wallet,
  Play,
  ShoppingBag,
  BarChart3,
  Users,
  Calendar,
  Gift
} from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import OrientationPrompt from "@/components/OrientationPrompt";
import { useIsMobile } from "@/hooks/use-mobile";
import { getCurrentLevel, getProgressToNextLevel } from "@/lib/progressSystem";
import { usePrivy } from "@privy-io/react-auth";
import { SettingsDialog } from "@/components/SettingsDialog";
import { useStore } from "@/hooks/useStore";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import StoreSection from "@/components/StoreSection";
import { StorePurchaseDialog } from "@/components/StorePurchaseDialog";
import type { StoreItem } from "@/hooks/useStore";

const Game = () => {
  const { ready, authenticated, login, user } = usePrivy();
  const { profile } = useProfile();
  const isMobile = useIsMobile();
  const [activeView, setActiveView] = useState("home");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isRankingsOpen, setIsRankingsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedMarketItem, setSelectedMarketItem] = useState(null);
  const [selectedRarity, setSelectedRarity] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStoreItem, setSelectedStoreItem] = useState<StoreItem | null>(null);
  const [isStorePurchaseOpen, setIsStorePurchaseOpen] = useState(false);

  const { storeItems, userBalance, userInventory, loading, purchaseItem } = useStore();

  const handleStoreItemClick = (item: StoreItem) => {
    setSelectedStoreItem(item);
    setIsStorePurchaseOpen(true);
  };

  const getStoreItemsByCategory = (category: string) => {
    return storeItems.filter(item => item.category === category);
  };

  // Mock data for marketplace items
  const marketplaceItems = [{
    id: 1,
    name: "El Matador",
    team: "Latin Legends",
    position: "Supreme", 
    itemType: "fighter",
    price: 1250,
    lastSale: 1200,
    trend: "up",
    image: "/src/assets/latin-legend-skin.png"
  }, {
    id: 2,
    name: "Cyber Warrior",
    team: "Tech Titans",
    position: "Supreme",
    itemType: "fighter", 
    price: 1100,
    lastSale: 1150,
    trend: "down",
    image: "/src/assets/cyber-warrior-skin.png"
  }, {
    id: 3,
    name: "Irish King",
    team: "Celtic Champions",
    position: "Supreme",
    itemType: "fighter",
    price: 950,
    lastSale: 900,
    trend: "up",
    image: "/src/assets/irish-king-skin.png"
  }];

  // Mock data for chart (using real-looking price movements)
  const marketValueData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    value: Math.round(1000 + Math.sin(i * 0.3) * 200 + Math.random() * 100)
  }));

  const listingsData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    listings: Math.round(50 + Math.sin(i * 0.2) * 20 + Math.random() * 30)
  }));

  const currentMarketValue = marketValueData[marketValueData.length - 1]?.value || 0;
  const currentListings = Math.round(listingsData[listingsData.length - 1]?.listings || 0);

  const getFilteredItems = (items: any[]) => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRarity = selectedRarity === "all" || item.rarity === selectedRarity;
      return matchesSearch && matchesRarity;
    });
  };

  const renderMobileView = () => {
    switch (activeView) {
      case "home":
        return (
          <div className="space-y-6 pb-20">
            {/* Balance Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-black/20 backdrop-blur-md border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <img 
                      src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" 
                      alt="LCS Coin" 
                      className="w-6 h-6" 
                    />
                    <div>
                      <p className="text-xs text-white/70">LCS Coins</p>
                      <p className="font-bold text-white">{userBalance?.coins?.toLocaleString() || '0'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-black/20 backdrop-blur-md border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <div>
                      <p className="text-xs text-white/70">XP</p>
                      <p className="font-bold text-white">{userBalance?.xp || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Level Progress */}
            <Card className="bg-black/20 backdrop-blur-md border-white/10">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{getCurrentLevel(userBalance?.xp || 0).name}</span>
                    <span className="text-xs text-white/70">Level {getCurrentLevel(userBalance?.xp || 0).level}</span>
                  </div>
                  <Progress value={getProgressToNextLevel(userBalance?.xp || 0).percentage} className="h-2" />
                  <p className="text-xs text-white/70">
                    {getProgressToNextLevel(userBalance?.xp || 0).current} / {getProgressToNextLevel(userBalance?.xp || 0).total} XP to next level
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button 
                className="h-20 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
                onClick={() => setActiveView("store")}
              >
                <div className="text-center">
                  <Store className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-sm">Store</span>
                </div>
              </Button>
              <Button 
                className="h-20 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
                onClick={() => setActiveView("marketplace")}
              >
                <div className="text-center">
                  <BarChart3 className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-sm">Market</span>
                </div>
              </Button>
            </div>

            {/* Featured Content */}
            <Card className="bg-black/20 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-base text-white">Featured</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Gift className="w-12 h-12 mx-auto text-white/50 mb-4" />
                  <p className="text-sm text-white/70">Check back for special events and limited offers</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "store":
        return (
          <div className="space-y-6 pb-20">
            {/* Search and Filter */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-white/70" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20">
                      {selectedRarity === "all" ? "All Rarities" : selectedRarity}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-black/90 backdrop-blur-md border-white/20">
                    <DropdownMenuItem onClick={() => setSelectedRarity("all")} className="text-white hover:bg-white/10">All Rarities</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedRarity("common")} className="text-white hover:bg-white/10">Common</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedRarity("rare")} className="text-white hover:bg-white/10">Rare</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedRarity("epic")} className="text-white hover:bg-white/10">Epic</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedRarity("legendary")} className="text-white hover:bg-white/10">Legendary</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Store Categories */}
            <div className="space-y-8">
              {/* Fighters Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Fighters</h3>
                <StoreSection
                  category="fighters" 
                  items={getStoreItemsByCategory('fighters')}
                  selectedRarity={selectedRarity}
                  onItemClick={handleStoreItemClick}
                />
              </div>

              {/* Accessories Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Accessories</h3>
                <StoreSection
                  category="accessories" 
                  items={getStoreItemsByCategory('accessories')}
                  selectedRarity={selectedRarity}
                  onItemClick={handleStoreItemClick}
                />
              </div>

              {/* Emotes Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Emotes</h3>
                <StoreSection
                  category="emotes" 
                  items={getStoreItemsByCategory('emotes')}
                  selectedRarity={selectedRarity}
                  onItemClick={handleStoreItemClick}
                />
              </div>

              {/* Packs Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Packs</h3>
                <StoreSection
                  category="packs" 
                  items={getStoreItemsByCategory('packs')}
                  selectedRarity={selectedRarity}
                  onItemClick={handleStoreItemClick}
                />
              </div>
            </div>
          </div>
        );

      case "marketplace":
        return (
          <div className="space-y-6 pb-20">
            {/* Marketplace Header */}
            <Card className="bg-black/20 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-base text-white flex items-center justify-between">
                  <span>Marketplace</span>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/20">
                    {currentListings} Active
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-white">${currentMarketValue.toLocaleString()}</p>
                    <p className="text-xs text-white/70">Market Value</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{currentListings}</p>
                    <p className="text-xs text-white/70">Active Listings</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Featured Items */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Featured Items</h3>
              <div className="space-y-3">
                {marketplaceItems.map((item) => (
                  <Card key={item.id} className="bg-black/20 backdrop-blur-md border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-800/50 rounded-lg overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-sm">{item.name}</h4>
                          <p className="text-xs text-white/70">{item.team}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm font-bold text-white">${item.price}</span>
                            {item.trend === "up" ? (
                              <TrendingUp className="w-3 h-3 text-green-500" />
                            ) : (
                              <TrendingDown className="w-3 h-3 text-red-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Handle authentication
  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="bg-black/20 backdrop-blur-md border-white/10 max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl mb-2">Welcome to LCS</CardTitle>
            <p className="text-white/70">Connect your wallet to start playing</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={login} 
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <OrientationPrompt />
      
      {/* Mobile Layout */}
      {isMobile && (
        <div className="relative">
          {/* Header */}
          <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">⚡</div>
                <div>
                  <h1 className="text-lg font-bold text-white">LCS</h1>
                  <p className="text-xs text-white/70">Level {getCurrentLevel(userBalance?.xp || 0).level}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsNotificationsOpen(true)}
                  className="text-white hover:bg-white/10"
                >
                  <Bell className="w-5 h-5" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsRankingsOpen(true)}
                  className="text-white hover:bg-white/10"
                >
                  <Trophy className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-4 py-6">
            {renderMobileView()}
          </div>

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md border-t border-white/10">
            <div className="flex items-center justify-around py-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveView("home")}
                className={`flex flex-col items-center space-y-1 h-16 ${
                  activeView === "home" 
                    ? "text-white bg-white/10" 
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="text-xs">Home</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveView("store")}
                className={`flex flex-col items-center space-y-1 h-16 ${
                  activeView === "store" 
                    ? "text-white bg-white/10" 
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <Store className="w-5 h-5" />
                <span className="text-xs">Store</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveView("marketplace")}
                className={`flex flex-col items-center space-y-1 h-16 ${
                  activeView === "marketplace" 
                    ? "text-white bg-white/10" 
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="text-xs">Market</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSettingsOpen(true)}
                className="flex flex-col items-center space-y-1 h-16 text-white/70 hover:text-white hover:bg-white/5"
              >
                <Settings className="w-5 h-5" />
                <span className="text-xs">Settings</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout - Hidden on mobile */}
      <div className="hidden lg:flex lg:min-h-screen w-full">
        {/* Left Sidebar - Desktop only */}
        <aside className="w-80 bg-black border-r border-border p-6 space-y-6 overflow-y-auto h-screen">
          <div className="relative">
            {/* Desktop: Hover Card + Popover */}
            <div className="relative">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Card className="bg-black border-gray-700 cursor-pointer hover:border-gray-600 transition-colors">
                        <CardHeader>
                          <CardTitle className="text-base flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-base">{profile?.avatar_url || '👤'}</span>
                              <span>Progress</span>
                            </div>
                            <Info className="w-4 h-4 text-muted-foreground" />
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">
                                  {getCurrentLevel(userBalance?.xp || 0).name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {userBalance?.xp || 0} XP
                                </span>
                              </div>
                              <Progress value={getProgressToNextLevel(userBalance?.xp || 0).percentage} className="h-2" />
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-center">
                              <div>
                                <div className="flex items-center justify-center space-x-1 mb-1">
                                  <img 
                                    src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" 
                                    alt="LCS Coin" 
                                    className="w-4 h-4" 
                                  />
                                  <span className="text-sm font-bold">{userBalance?.coins?.toLocaleString() || '0'}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">LCS Coins</p>
                              </div>
                              <div>
                                <div className="flex items-center justify-center space-x-1 mb-1">
                                  <Trophy className="w-4 h-4 text-yellow-500" />
                                  <span className="text-sm font-bold">{userBalance?.xp || 0}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">Total XP</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 bg-black/90 backdrop-blur-md border-gray-700">
                      <div className="space-y-4">
                        <h4 className="font-medium">Level System</h4>
                        <p className="text-sm text-muted-foreground">
                          Earn XP by playing matches, completing challenges, and participating in tournaments.
                        </p>
                        <div className="text-xs text-muted-foreground">
                          Next: <span className="font-medium">{getProgressToNextLevel(userBalance?.xp || 0).current} / {getProgressToNextLevel(userBalance?.xp || 0).total} XP</span>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 bg-black/90 backdrop-blur-md border-gray-700">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Player Progress</h4>
                    <p className="text-xs text-muted-foreground">
                      Level {getCurrentLevel(userBalance?.xp || 0).level} • {userBalance?.xp || 0} XP
                    </p>
                    <p className="text-xs">
                      {getProgressToNextLevel(userBalance?.xp || 0).current} / {getProgressToNextLevel(userBalance?.xp || 0).total} XP progress
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" className="justify-start h-12" onClick={() => setActiveView("store")}>
                <Store className="w-4 h-4 mr-3" />
                Store
              </Button>
              <Button variant="outline" className="justify-start h-12" onClick={() => setActiveView("marketplace")}>
                <BarChart3 className="w-4 h-4 mr-3" />
                Marketplace
              </Button>
            </div>
          </div>

          <Separator />

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-base">Weekly Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[{
                  rank: 1,
                  name: "CryptoKing",
                  level: 15,
                  points: 15420,
                  avatar: "👑"
                }, {
                  rank: 2,
                  name: "BlockMaster",
                  level: 14,
                  points: 14250,
                  avatar: "🎯"
                }, {
                  rank: 3,
                  name: "NFTNinja",
                  level: 13,
                  points: 13800,
                  avatar: "🥷"
                }].map((player) => (
                  <div key={player.rank} className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold">
                      {player.rank}
                    </div>
                    <div className="text-base">{player.avatar}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{player.name}</p>
                      <p className="text-xs text-muted-foreground">{player.points.toLocaleString()} pts</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content Area - Desktop */}
        <main className="flex-1 overflow-y-auto h-screen">
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-md border-white/10">
                  <TabsTrigger value="home" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">Home</TabsTrigger>
                  <TabsTrigger value="store" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">Store</TabsTrigger>
                  <TabsTrigger value="marketplace" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">Marketplace</TabsTrigger>
                </TabsList>

                <TabsContent value="home" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="bg-black/20 backdrop-blur-md border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white">Game Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <Play className="w-12 h-12 mx-auto text-white/50 mb-4" />
                          <p className="text-sm text-white/70">Game launches soon!</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-black/20 backdrop-blur-md border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white">Community</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <Users className="w-12 h-12 mx-auto text-white/50 mb-4" />
                          <p className="text-sm text-white/70">Connect with other players</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-black/20 backdrop-blur-md border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white">Events</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <Calendar className="w-12 h-12 mx-auto text-white/50 mb-4" />
                          <p className="text-sm text-white/70">Check back for upcoming events</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="store" className="space-y-6">
                  {/* Desktop Store Search and Filter */}
                  <div className="flex items-center space-x-4">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                      <Input
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Filter className="w-4 h-4 text-white/70" />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20">
                            {selectedRarity === "all" ? "All Rarities" : selectedRarity}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-black/90 backdrop-blur-md border-white/20">
                          <DropdownMenuItem onClick={() => setSelectedRarity("all")} className="text-white hover:bg-white/10">All Rarities</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedRarity("common")} className="text-white hover:bg-white/10">Common</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedRarity("rare")} className="text-white hover:bg-white/10">Rare</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedRarity("epic")} className="text-white hover:bg-white/10">Epic</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedRarity("legendary")} className="text-white hover:bg-white/10">Legendary</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Desktop Store Categories */}
                  <div className="space-y-8">
                    {/* Fighters Section */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white">Fighters</h3>
                      <StoreSection
                        category="fighters" 
                        items={getStoreItemsByCategory('fighters')}
                        selectedRarity={selectedRarity}
                        onItemClick={handleStoreItemClick}
                        desktopMode={true}
                      />
                    </div>

                    {/* Accessories Section */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white">Accessories</h3>
                      <StoreSection
                        category="accessories" 
                        items={getStoreItemsByCategory('accessories')}
                        selectedRarity={selectedRarity}
                        onItemClick={handleStoreItemClick}
                        desktopMode={true}
                      />
                    </div>

                    {/* Emotes Section */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white">Emotes</h3>
                      <StoreSection
                        category="emotes" 
                        items={getStoreItemsByCategory('emotes')}
                        selectedRarity={selectedRarity}
                        onItemClick={handleStoreItemClick}
                        desktopMode={true}
                      />
                    </div>

                    {/* Packs Section */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white">Packs</h3>
                      <StoreSection
                        category="packs" 
                        items={getStoreItemsByCategory('packs')}
                        selectedRarity={selectedRarity}
                        onItemClick={handleStoreItemClick}
                        desktopMode={true}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="marketplace" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <Card className="bg-black/20 backdrop-blur-md border-white/10">
                        <CardHeader>
                          <CardTitle className="text-white">Featured Listings</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {marketplaceItems.map((item) => (
                              <div key={item.id} className="flex items-center space-x-4 p-4 rounded-lg bg-white/5">
                                <div className="w-16 h-16 bg-gray-800/50 rounded-lg overflow-hidden">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-white">{item.name}</h4>
                                  <p className="text-sm text-white/70">{item.team}</p>
                                  <div className="flex items-center space-x-2 mt-2">
                                    <span className="text-lg font-bold text-white">${item.price}</span>
                                    {item.trend === "up" ? (
                                      <TrendingUp className="w-4 h-4 text-green-500" />
                                    ) : (
                                      <TrendingDown className="w-4 h-4 text-red-500" />
                                    )}
                                  </div>
                                </div>
                                <Button size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20">
                                  View Details
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-6">
                      <Card className="bg-black/20 backdrop-blur-md border-white/10">
                        <CardHeader>
                          <CardTitle className="text-white">Market Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-white">${currentMarketValue.toLocaleString()}</p>
                            <p className="text-sm text-white/70">Total Market Value</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-white">{currentListings}</p>
                            <p className="text-sm text-white/70">Active Listings</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Notifications Drawer */}
      <Drawer open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <DrawerContent className="bg-black/20 backdrop-blur-md border-white/10">
          <DrawerHeader>
            <DrawerTitle className="text-center text-white">Notifications</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6">
            <div className="text-center py-8">
              <Bell className="w-12 h-12 mx-auto text-white/50 mb-4" />
              <p className="text-sm text-white/70">
                You'll see game updates and important announcements here
              </p>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Mobile Rankings Drawer */}
      <Drawer open={isRankingsOpen} onOpenChange={setIsRankingsOpen}>
        <DrawerContent className="bg-black/20 backdrop-blur-md border-white/10 max-h-[80vh]">
          <DrawerHeader>
            <DrawerTitle className="text-center text-white">Rankings</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6 overflow-y-auto">
            <p className="text-sm text-white/70 text-center pb-4">Weekly prize pool: $0</p>
            <div className="space-y-2">
              {[{
                rank: 1,
                name: "CryptoKing",
                level: 15,
                points: 15420,
                avatar: "👑"
              }, {
                rank: 2,
                name: "BlockMaster",
                level: 14,
                points: 14250,
                avatar: "🎯"
              }, {
                rank: 3,
                name: "NFTNinja",
                level: 13,
                points: 13800,
                avatar: "🥷"
              }, {
                rank: 4,
                name: "TokenTiger",
                level: 12,
                points: 12500,
                avatar: "🐅"
              }, {
                rank: 5,
                name: "DefiDragon",
                level: 11,
                points: 11800,
                avatar: "🐉"
              }].map((player) => (
                <Card key={player.rank} className="bg-white/5 border-white/10">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white">
                        {player.rank}
                      </div>
                      <div className="text-lg">{player.avatar}</div>
                      <div className="flex-1">
                        <p className="font-medium text-white">{player.name}</p>
                        <p className="text-xs text-white/70">Level {player.level} • {player.points.toLocaleString()} pts</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Settings Dialog */}
      <SettingsDialog 
        open={isSettingsOpen} 
        onOpenChange={setIsSettingsOpen} 
      />

      {/* Store Purchase Dialog */}
      <StorePurchaseDialog
        isOpen={isStorePurchaseOpen}
        onClose={() => setIsStorePurchaseOpen(false)}
        item={selectedStoreItem}
      />
    </div>
  );
};

export default Game;