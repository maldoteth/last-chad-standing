import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Coins, ShoppingBag, Users, Package, CreditCard, Trophy, Star, Target, ChevronRight, Bell, Play, Home, TrendingUp, UserPlus, Medal, LogOut, Settings, Info, Gift, BarChart3, LineChart, ArrowUpRight, ArrowDownRight, Search, Filter, Gamepad, Instagram, Layers, BookOpen, Youtube } from "lucide-react";
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar, Area, AreaChart } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const Game = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [gainersTimeFilter, setGainersTimeFilter] = useState("daily");
  const [rightSidebarTab, setRightSidebarTab] = useState("rankings");
  const [userCoins] = useState(0);
  const [visiblePlayers, setVisiblePlayers] = useState(10);
  const { toast } = useToast();
  const { login, logout, authenticated, user } = usePrivy();
  const navigate = useNavigate();

  // Mock data for market analytics
  const marketValueData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    value: 125000 + Math.sin(i * 0.3) * 15000 + Math.random() * 10000,
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  const listingsData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    listings: 450 + Math.cos(i * 0.4) * 50 + Math.random() * 30,
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  const trendingPlayers = [
    { name: "Shadow Strike", team: "Crimson Hawks", position: "Striker", price: 8500, change: 12.5, trend: "up", image: "/lovable-uploads/2390abe9-bd8c-4568-8198-12a97fb918e3.png" },
    { name: "Iron Fist", team: "Steel Wolves", position: "Tank", price: 7200, change: -8.3, trend: "down", image: "/lovable-uploads/3c1059ce-1948-46a2-bc2a-8e6c6b55079d.png" },
    { name: "Lightning Bolt", team: "Thunder Birds", position: "Speed", price: 9100, change: 15.7, trend: "up", image: "/lovable-uploads/2390abe9-bd8c-4568-8198-12a97fb918e3.png" },
    { name: "Stone Wall", team: "Mountain Lions", position: "Defense", price: 6800, change: -4.2, trend: "down", image: "/lovable-uploads/3c1059ce-1948-46a2-bc2a-8e6c6b55079d.png" },
    { name: "Fire Storm", team: "Flame Dragons", position: "Assault", price: 8900, change: 9.6, trend: "up", image: "/lovable-uploads/2390abe9-bd8c-4568-8198-12a97fb918e3.png" }
  ];

  const topGainersData = {
    daily: [
      { name: "Cyber Phantom", team: "Neon Guardians", position: "Stealth", price: 5200, change: 24.8, image: "/lovable-uploads/2390abe9-bd8c-4568-8198-12a97fb918e3.png" },
      { name: "Quantum Leap", team: "Future Force", position: "Mobility", price: 4800, change: 19.3, image: "/lovable-uploads/3c1059ce-1948-46a2-bc2a-8e6c6b55079d.png" },
      { name: "Void Walker", team: "Dark Matter", position: "Phantom", price: 6100, change: 17.5, image: "/lovable-uploads/2390abe9-bd8c-4568-8198-12a97fb918e3.png" },
      { name: "Solar Flare", team: "Sun Blazers", position: "Energy", price: 5500, change: 16.2, image: "/lovable-uploads/3c1059ce-1948-46a2-bc2a-8e6c6b55079d.png" },
      { name: "Storm Breaker", team: "Wind Riders", position: "Force", price: 4900, change: 15.9, image: "/lovable-uploads/2390abe9-bd8c-4568-8198-12a97fb918e3.png" }
    ],
    weekly: [
      { name: "Lightning Strike", team: "Thunder Hawks", position: "Speed", price: 7300, change: 45.2, image: "/lovable-uploads/2390abe9-bd8c-4568-8198-12a97fb918e3.png" },
      { name: "Iron Forge", team: "Steel Warriors", position: "Tank", price: 6800, change: 38.7, image: "/lovable-uploads/3c1059ce-1948-46a2-bc2a-8e6c6b55079d.png" },
      { name: "Phoenix Wing", team: "Fire Eagles", position: "Assault", price: 5900, change: 33.1, image: "/lovable-uploads/2390abe9-bd8c-4568-8198-12a97fb918e3.png" },
      { name: "Frost Bite", team: "Ice Wolves", position: "Control", price: 6400, change: 29.8, image: "/lovable-uploads/3c1059ce-1948-46a2-bc2a-8e6c6b55079d.png" },
      { name: "Earth Shaker", team: "Ground Force", position: "Heavy", price: 7100, change: 27.3, image: "/lovable-uploads/2390abe9-bd8c-4568-8198-12a97fb918e3.png" }
    ],
    monthly: [
      { name: "Titan Crusher", team: "Mega Corps", position: "Destroyer", price: 9200, change: 89.4, image: "/lovable-uploads/2390abe9-bd8c-4568-8198-12a97fb918e3.png" },
      { name: "Shadow Master", team: "Dark Legion", position: "Assassin", price: 8500, change: 76.8, image: "/lovable-uploads/3c1059ce-1948-46a2-bc2a-8e6c6b55079d.png" },
      { name: "Plasma Cannon", team: "Energy Corps", position: "Artillery", price: 8900, change: 69.5, image: "/lovable-uploads/2390abe9-bd8c-4568-8198-12a97fb918e3.png" },
      { name: "Void Reaper", team: "Space Raiders", position: "Elite", price: 9800, change: 62.1, image: "/lovable-uploads/3c1059ce-1948-46a2-bc2a-8e6c6b55079d.png" },
      { name: "Storm Lord", team: "Weather Gods", position: "Legendary", price: 10500, change: 58.7, image: "/lovable-uploads/2390abe9-bd8c-4568-8198-12a97fb918e3.png" }
    ],
    alltime: [
      { name: "Apex Legend", team: "Ultimate Force", position: "Champion", price: 15000, change: 234.7, image: "/lovable-uploads/2390abe9-bd8c-4568-8198-12a97fb918e3.png" },
      { name: "God Slayer", team: "Divine Army", position: "Mythic", price: 13500, change: 189.3, image: "/lovable-uploads/3c1059ce-1948-46a2-bc2a-8e6c6b55079d.png" },
      { name: "Universe Destroyer", team: "Cosmic Force", position: "Godlike", price: 14200, change: 156.8, image: "/lovable-uploads/2390abe9-bd8c-4568-8198-12a97fb918e3.png" },
      { name: "Reality Bender", team: "Quantum Lords", position: "Transcendent", price: 12800, change: 142.5, image: "/lovable-uploads/3c1059ce-1948-46a2-bc2a-8e6c6b55079d.png" },
      { name: "Infinite Power", team: "Eternal Guardians", position: "Supreme", price: 16000, change: 198.9, image: "/lovable-uploads/2390abe9-bd8c-4568-8198-12a97fb918e3.png" }
    ]
  };

  const topGainers = topGainersData[gainersTimeFilter];

  const allPlayers = [
    { name: "Shadow Strike", team: "Crimson Hawks", position: "Striker", price: 8500, lastSale: 7500, trend: "up", image: "/lovable-uploads/2390abe9-bd8c-4568-8198-12a97fb918e3.png" },
    { name: "Fire Storm", team: "Flame Dragons", position: "Assault", price: 8900, lastSale: 8100, trend: "up", image: "/lovable-uploads/2390abe9-bd8c-4568-8198-12a97fb918e3.png" },
    { name: "Lightning Bolt", team: "Thunder Birds", position: "Speed", price: 9100, lastSale: 7900, trend: "up", image: "/lovable-uploads/3c1059ce-1948-46a2-bc2a-8e6c6b55079d.png" },
    { name: "Iron Fist", team: "Steel Wolves", position: "Tank", price: 7200, lastSale: 7850, trend: "down", image: "/lovable-uploads/2390abe9-bd8c-4568-8198-12a97fb918e3.png" },
    { name: "Stone Wall", team: "Mountain Lions", position: "Defense", price: 6800, lastSale: 7100, trend: "down", image: "/lovable-uploads/3c1059ce-1948-46a2-bc2a-8e6c6b55079d.png" },
    { name: "Void Walker", team: "Dark Matter", position: "Phantom", price: 6100, lastSale: 5200, trend: "up", image: "/lovable-uploads/2390abe9-bd8c-4568-8198-12a97fb918e3.png" },
    { name: "Solar Flare", team: "Sun Blazers", position: "Energy", price: 5500, lastSale: 4750, trend: "up", image: "/lovable-uploads/3c1059ce-1948-46a2-bc2a-8e6c6b55079d.png" },
    { name: "Cyber Phantom", team: "Neon Guardians", position: "Stealth", price: 5200, lastSale: 4100, trend: "up", image: "/lovable-uploads/2390abe9-bd8c-4568-8198-12a97fb918e3.png" },
    { name: "Storm Breaker", team: "Wind Riders", position: "Force", price: 4900, lastSale: 4200, trend: "up", image: "/lovable-uploads/3c1059ce-1948-46a2-bc2a-8e6c6b55079d.png" },
    { name: "Quantum Leap", team: "Future Force", position: "Mobility", price: 4800, lastSale: 4000, trend: "up", image: "/lovable-uploads/2390abe9-bd8c-4568-8198-12a97fb918e3.png" }
  ].sort((a, b) => b.price - a.price);

  const currentMarketValue = marketValueData[marketValueData.length - 1]?.value || 0;
  const currentListings = Math.round(listingsData[listingsData.length - 1]?.listings || 0);

  // Debug logging for activeTab changes
  console.log('Current activeTab:', activeTab);
  const handleTabClick = (tabId: string) => {
    console.log('Tab clicked:', tabId);
    console.log('Current activeTab before:', activeTab);
    
    if (tabId === "lobby") {
      toast({
        title: "Game releasing soon!",
        description: "",
        duration: 4200
      });
    } else {
      setActiveTab(tabId);
      console.log('Setting activeTab to:', tabId);
    }
  };
  const tabItems = [{
    id: "home",
    label: "Home",
    icon: Home
  }, {
    id: "store",
    label: "Store",
    icon: ShoppingBag
  }, {
    id: "market",
    label: "Market",
    icon: CreditCard
  }, {
    id: "locker",
    label: "Locker",
    icon: Package
  }, {
    id: "lobby",
    label: "Lobby",
    icon: Gamepad
  }, {
    id: "coins",
    label: "Coins",
    icon: Coins
  }];
  return <div className="min-h-screen bg-background text-foreground dark">
      {/* Mobile/Tablet optimized layout */}
      
      {/* Header with coins and avatar - simplified for mobile */}
      <header className="bg-card lg:border-b border-border px-4 py-3 lg:px-6 lg:py-4">
        <div className="flex items-center justify-between">
          <img src="/lovable-uploads/ef3aca91-a372-4313-aa94-3c2dcf946dd6.png" alt="LCS Logo" className="h-8 lg:h-10" />
          
          {/* Desktop Navigation - hidden on mobile */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <nav className="flex items-center space-x-8">
            {tabItems.filter(tab => tab.id !== "coins").map(tab => <button key={tab.id} onClick={() => handleTabClick(tab.id)} className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}>
                <tab.icon className={`${tab.id === 'lobby' ? 'w-6 h-6' : 'w-4 h-4'}`} />
                <span>{tab.label}</span>
              </button>)}
            </nav>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-4 h-4" />
              <span className="font-semibold text-sm lg:text-base">{userCoins.toLocaleString()}</span>
            </div>
            
            {authenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-7 h-7 lg:w-8 lg:h-8 cursor-pointer">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{user?.email?.address?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card border border-border z-50">
                  <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => logout()}
                    className="flex items-center space-x-2 cursor-pointer text-red-500 hover:text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={login} variant="outline" size="sm">
                Log In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - Mobile First Layout */}
      <div className="lg:flex lg:min-h-[calc(100vh-80px)]">
        
        {/* Mobile: Stack everything vertically */}
        <div className="lg:hidden overflow-y-auto max-h-[calc(100vh-80px)]">
            {activeTab === "home" && (
              <>
                {/* Hero Card - Portrait oriented for mobile */}
                <div className="p-4">
                  <Card className="bg-gradient-to-b from-blue-600/90 to-purple-700/90 text-white border-0 relative overflow-hidden h-96">
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
                      style={{
                        backgroundImage: 'url(/lovable-uploads/2390abe9-bd8c-4568-8198-12a97fb918e3.png)',
                        backgroundPosition: 'center top'
                      }} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    <CardContent className="p-6 h-full flex flex-col justify-end relative z-10">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Welcome to LCS</h2>
                        <p className="text-blue-100 mb-4 text-sm">
                          Start your journey in the ultimate crypto gaming experience
                        </p>
                        <div className="flex space-x-3">
                          <Button 
                            variant="secondary" 
                            size="default" 
                            className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                            onClick={() => navigate('/docs')}
                          >
                            <Info className="w-4 h-4 mr-2" />
                            How to play
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="default" 
                            className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                            onClick={() => toast({
                              title: "Coming Soon",
                              description: "The game will be available soon!",
                              duration: 4200
                            })}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Play now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Progress Card */}
                <div className="px-4 pb-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center space-x-2">
                        <Star className="w-4 h-4" />
                        <span>Progress</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Level 0: Recruit</span>
                            <span className="text-xs text-muted-foreground">0/100 XP</span>
                          </div>
                          <Progress value={0} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Cards Grid - 2 columns on mobile */}
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
                      <div className="absolute inset-0" style={{
                        backgroundImage: `
                          linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
                          linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
                        `,
                        backgroundSize: '4px 4px'
                      }} />
                      <CardContent className="p-4 flex flex-col h-full">
                        <div className="flex items-center space-x-1 mb-2">
                          <Trophy className="w-4 h-4 text-white" />
                          <span className="text-xs font-medium text-white">Quests!</span>
                        </div>
                        <h3 className="text-sm font-bold mb-1">Smash that XP</h3>
                        <p className="text-gray-300 text-xs mb-3 flex-1">by completing all quests</p>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 text-xs h-7 relative z-10 transition-all duration-300"
                          onClick={() => toast({
                            title: "Coming Soon",
                            description: "Quests are coming soon!",
                            duration: 4200
                          })}
                        >
                          Show Quests
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
                      <div className="absolute inset-0" style={{
                        backgroundImage: `
                          linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
                          linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
                        `,
                        backgroundSize: '4px 4px'
                      }} />
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-1 mb-2">
                          <Gift className="w-4 h-4" />
                          <span className="text-xs font-medium">Open Packs</span>
                        </div>
                        <div className="space-y-1 mb-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-300 font-semibold">SILVER</span>
                            <span className="text-xs">x0</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-yellow-300 font-semibold">GOLD</span>
                            <span className="text-xs">x0</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent font-bold">SPECIAL</span>
                            <span className="text-xs">x0</span>
                          </div>
                        </div>
                        <Button variant="secondary" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 text-xs h-7 relative z-10 transition-all duration-300 w-full">
                          Buy Now
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-1 gap-3">
                    <Card className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white border border-gray-600/50 shadow-2xl relative overflow-hidden">
                      {/* Metallic base layer */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-700/30 via-gray-800/50 to-gray-900/80" />
                      
                      {/* Metallic shine overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/10 to-transparent transform -skew-x-12" />
                      
                      <CardContent className="p-4 relative z-10">
                        <div className="flex flex-col items-center text-center space-y-3 mb-3">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm text-white">Build your roster</h3>
                            <p className="text-xs text-gray-300">Build your dream team</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300">
                          Start Building
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white border border-gray-600/50 shadow-2xl relative overflow-hidden">
                      {/* Metallic base layer */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-700/30 via-gray-800/50 to-gray-900/80" />
                      
                      {/* Metallic shine overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/10 to-transparent transform -skew-x-12" />
                      
                      <CardContent className="p-4 relative z-10">
                        <div className="flex flex-col items-center text-center space-y-3 mb-3">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <CreditCard className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm text-white">Transfer Market</h3>
                            <p className="text-xs text-gray-300">Buy & sell fighters</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300">
                          Browse Market
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Objectives - Collapsible on mobile */}
                <div className="px-4 pb-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center space-x-2">
                        <Target className="w-4 h-4" />
                        <span>Weekly Objectives</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {[
                          { icon: Package, text: "Open 3 packs", progress: "0/3", bg: "bg-primary" },
                          { icon: ShoppingBag, text: "Buy 3 fighters", progress: "0/3", bg: "bg-secondary" },
                          { icon: CreditCard, text: "Sell 3 fighters", progress: "0/3", bg: "bg-destructive" },
                          { icon: TrendingUp, text: "Trade 3 days in a row", progress: "0/3", bg: "bg-orange-500" },
                          { icon: UserPlus, text: "Invite 3 friends", progress: "0/3", bg: "bg-blue-500" }
                        ].map((obj, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                            <div className="flex items-center space-x-3">
                              <div className={`w-6 h-6 ${obj.bg} rounded-full flex items-center justify-center`}>
                                <obj.icon className="w-3 h-3 text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{obj.text}</p>
                                <p className="text-xs text-muted-foreground">{obj.progress} • 10 XP</p>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {activeTab === "store" && (
              <div className="p-4 space-y-6">
                {/* Store Header */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <ShoppingBag className="w-8 h-8 text-primary" />
                    <div>
                      <h1 className="text-2xl font-bold">LCS Store</h1>
                      <p className="text-muted-foreground text-sm">Customize your gaming experience</p>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-4">
                  {/* Skins Category */}
                  <Card className="bg-gradient-to-br from-blue-600/20 to-purple-700/20 border border-blue-600/30">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Skins</span>
                        <Badge variant="secondary">4 items</Badge>
                      </CardTitle>
                      <CardDescription>Characters to play in game</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { name: "Cyber Warrior", price: 2500, rarity: "legendary", image: "/lovable-uploads/2390abe9-bd8c-4568-8198-12a97fb918e3.png" },
                          { name: "Shadow Assassin", price: 1800, rarity: "epic", image: "/lovable-uploads/3c1059ce-1948-46a2-bc2a-8e6c6b55079d.png" }
                        ].map((item, idx) => (
                          <Card key={idx} className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white border border-gray-600/50 shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-700/30 via-gray-800/50 to-gray-900/80" />
                            <CardContent className="p-3 relative z-10">
                              <div className="aspect-square bg-gray-800/50 rounded-lg mb-2 overflow-hidden">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <h3 className="font-semibold text-xs text-white mb-1">{item.name}</h3>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                  <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-3 h-3" />
                                  <span className="text-xs font-bold text-white">{item.price.toLocaleString()}</span>
                                </div>
                                <Button size="sm" variant="secondary" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-6 px-2">
                                  Buy
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Accessories Category */}
                  <Card className="bg-gradient-to-br from-green-600/20 to-blue-700/20 border border-green-600/30">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Accessories</span>
                        <Badge variant="secondary">4 items</Badge>
                      </CardTitle>
                      <CardDescription>Shoes, backpacks, hats</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { name: "Neon Sneakers", price: 600, image: "/lovable-uploads/69c61fed-9ccd-43d2-bab5-17c6c0db05b4.png" },
                          { name: "Combat Backpack", price: 450, image: "/lovable-uploads/7311683b-ea99-4dd9-9b1f-89d96742eff0.png" }
                        ].map((item, idx) => (
                          <Card key={idx} className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white border border-gray-600/50 shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-700/30 via-gray-800/50 to-gray-900/80" />
                            <CardContent className="p-3 relative z-10">
                              <div className="aspect-square bg-gray-800/50 rounded-lg mb-2 overflow-hidden">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <h3 className="font-semibold text-xs text-white mb-1">{item.name}</h3>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                  <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-3 h-3" />
                                  <span className="text-xs font-bold text-white">{item.price.toLocaleString()}</span>
                                </div>
                                <Button size="sm" variant="secondary" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-6 px-2">
                                  Buy
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Mobility Category */}
                  <Card className="bg-gradient-to-br from-orange-600/20 to-red-700/20 border border-orange-600/30">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Mobility</span>
                        <Badge variant="secondary">4 items</Badge>
                      </CardTitle>
                      <CardDescription>Cars, golf buggies, etc</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { name: "Cyber Car", price: 5000, image: "/lovable-uploads/84ab9eed-00bc-425c-a953-3ea0478e464d.png" },
                          { name: "Speed Buggy", price: 3200, image: "/lovable-uploads/896892f1-7ebc-4852-acea-80dcdbf7c545.png" }
                        ].map((item, idx) => (
                          <Card key={idx} className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white border border-gray-600/50 shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-700/30 via-gray-800/50 to-gray-900/80" />
                            <CardContent className="p-3 relative z-10">
                              <div className="aspect-square bg-gray-800/50 rounded-lg mb-2 overflow-hidden">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <h3 className="font-semibold text-xs text-white mb-1">{item.name}</h3>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                  <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-3 h-3" />
                                  <span className="text-xs font-bold text-white">{item.price.toLocaleString()}</span>
                                </div>
                                <Button size="sm" variant="secondary" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-6 px-2">
                                  Buy
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "market" && (
              <div className="p-4 space-y-6">
                {/* Market Header */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <CreditCard className="w-8 h-8 text-primary" />
                    <div>
                      <h1 className="text-2xl font-bold">Transfer Market</h1>
                      <p className="text-muted-foreground text-sm">Buy, sell, and trade fighters</p>
                    </div>
                  </div>
                </div>

                {/* Market Stats Cards */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {/* Total Market Value */}
                  <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
                    <div className="absolute inset-0" style={{
                      backgroundImage: `
                        linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
                        linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
                      `,
                      backgroundSize: '4px 4px'
                    }} />
                    <CardContent className="p-4 relative z-10">
                      <div className="flex items-center space-x-2 mb-2">
                        <BarChart3 className="w-4 h-4 text-white" />
                        <span className="text-xs font-medium text-white">Market Cap</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-3 h-3" />
                          <span className="text-sm font-bold text-white">{currentMarketValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                        </div>
                        <div className="h-12">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={marketValueData.slice(-7)}>
                              <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke="hsl(var(--primary))"
                                fill="hsl(var(--primary))"
                                fillOpacity={0.2}
                                strokeWidth={1}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Active Listings */}
                  <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
                    <div className="absolute inset-0" style={{
                      backgroundImage: `
                        linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
                        linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
                      `,
                      backgroundSize: '4px 4px'
                    }} />
                    <CardContent className="p-4 relative z-10">
                      <div className="flex items-center space-x-2 mb-2">
                        <LineChart className="w-4 h-4 text-white" />
                        <span className="text-xs font-medium text-white">Live Listings</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm font-bold text-white">{currentListings}</span>
                        <div className="h-12">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={listingsData.slice(-7)}>
                              <Area 
                                type="monotone" 
                                dataKey="listings" 
                                stroke="hsl(var(--primary))"
                                fill="hsl(var(--primary))"
                                fillOpacity={0.2}
                                strokeWidth={1}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Trending & Gainers */}
                <div className="space-y-4">
                  {/* Trending */}
                  <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
                    <div className="absolute inset-0" style={{
                      backgroundImage: `
                        linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
                        linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
                      `,
                      backgroundSize: '4px 4px'
                    }} />
                    <CardHeader className="pb-3 relative z-10">
                      <CardTitle className="text-base flex items-center space-x-2 text-white">
                        <TrendingUp className="w-4 h-4" />
                        <span>Trending</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="space-y-2">
                        {trendingPlayers.slice(0, 3).map((player, idx) => (
                          <div key={idx} className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg">
                            <div className="w-8 h-8 rounded-full overflow-hidden">
                              <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold text-white truncate">{player.name}</p>
                                <div className="flex items-center space-x-1">
                                  <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-3 h-3" />
                                  <span className="text-xs font-bold text-white">{player.price.toLocaleString()}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-400">{player.team}</p>
                                <div className={`flex items-center space-x-1 ${player.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                                  {player.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                  <span className="text-xs font-medium">{Math.abs(player.change)}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Gainers */}
                  <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
                    <div className="absolute inset-0" style={{
                      backgroundImage: `
                        linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
                        linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
                      `,
                      backgroundSize: '4px 4px'
                    }} />
                    <CardHeader className="pb-3 relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-base flex items-center space-x-2 text-white">
                          <ArrowUpRight className="w-4 h-4 text-green-400" />
                          <span>Top Gainers</span>
                        </CardTitle>
                      </div>
                      <div className="flex space-x-1">
                        {[
                          { key: "daily", label: "24H" },
                          { key: "weekly", label: "7D" },
                          { key: "monthly", label: "30D" },
                          { key: "alltime", label: "All" }
                        ].map((filter) => (
                          <Button
                            key={filter.key}
                            variant={gainersTimeFilter === filter.key ? "secondary" : "ghost"}
                            size="sm"
                            className={`text-xs h-6 px-2 ${
                              gainersTimeFilter === filter.key 
                                ? "bg-white/20 text-white border-white/30" 
                                : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                            }`}
                            onClick={() => setGainersTimeFilter(filter.key)}
                          >
                            {filter.label}
                          </Button>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="space-y-2">
                        {topGainers.slice(0, 3).map((player, idx) => (
                          <div key={idx} className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg">
                            <div className="w-8 h-8 rounded-full overflow-hidden">
                              <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold text-white truncate">{player.name}</p>
                                <div className="flex items-center space-x-1">
                                  <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-3 h-3" />
                                  <span className="text-xs font-bold text-white">{player.price.toLocaleString()}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-400">{player.team}</p>
                                <div className="flex items-center space-x-1 text-green-400">
                                  <ArrowUpRight className="w-3 h-3" />
                                  <span className="text-xs font-medium">+{player.change}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* All Players List */}
                <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
                  <div className="absolute inset-0" style={{
                    backgroundImage: `
                      linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
                      linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
                    `,
                    backgroundSize: '4px 4px'
                  }} />
                  <CardHeader className="pb-3 relative z-10">
                    <CardTitle className="text-base flex items-center justify-between text-white">
                      <span>All Players</span>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-6 px-2">
                          <Search className="w-3 h-3 mr-1" />
                          Search
                        </Button>
                        <Button variant="outline" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-6 px-2">
                          <Filter className="w-3 h-3 mr-1" />
                          Filter
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="space-y-2">
                      {allPlayers.slice(0, visiblePlayers).map((player, idx) => (
                        <div key={idx} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-semibold text-white truncate">{player.name}</p>
                              <div className="flex items-center space-x-1">
                                <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-4 h-4" />
                                <span className="text-sm font-bold text-white">{player.price.toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-gray-400">{player.team} • {player.position}</p>
                                <p className="text-xs text-gray-500">Last: {player.lastSale.toLocaleString()}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className={`flex items-center space-x-1 ${player.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                                  {player.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-6 px-2"
                                  onClick={() => toast({
                                    title: "Purchase Initiated",
                                    description: `Attempting to buy ${player.name} for ${player.price.toLocaleString()} coins`,
                                    duration: 3000
                                  })}
                                >
                                  Buy
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {visiblePlayers < allPlayers.length && (
                      <div className="mt-4 text-center">
                        <Button 
                          variant="outline" 
                          className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
                          onClick={() => setVisiblePlayers(prev => Math.min(prev + 10, allPlayers.length))}
                        >
                          Load More Players
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "locker" && (
              <div className="p-4 space-y-6">
                {/* Mobile Locker Header */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <Package className="w-8 h-8 text-primary" />
                    <div>
                      <h1 className="text-2xl font-bold">My Locker</h1>
                    </div>
                  </div>
                </div>

                {!authenticated ? (
                  <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
                    <div className="absolute inset-0" style={{
                      backgroundImage: `
                        linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
                        linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
                      `,
                      backgroundSize: '4px 4px'
                    }} />
                    <CardContent className="p-6 text-center relative z-10">
                      <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold mb-2 text-white">Login to View Your Locker</h3>
                      <p className="text-gray-300 mb-4">Connect your wallet to see your owned items</p>
                      <Button onClick={login} variant="secondary" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30">
                        Login
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {/* Mobile Skins Category */}
                    <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
                      <div className="absolute inset-0" style={{
                        backgroundImage: `
                          linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
                          linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
                        `,
                        backgroundSize: '4px 4px'
                      }} />
                      <CardHeader className="relative z-10 pb-3">
                        <CardTitle className="flex items-center justify-between text-white text-lg">
                          <span>Skins</span>
                          <Badge variant="secondary" className="bg-white/10 text-white border-white/20">0 owned</Badge>
                        </CardTitle>
                        <CardDescription className="text-gray-300">Your character skins</CardDescription>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <div className="text-center py-8">
                          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-gray-300 text-sm">No skins owned yet</p>
                          <p className="text-xs text-gray-400 mt-1">Visit the store to purchase character skins</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Mobile Accessories Category */}
                    <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
                      <div className="absolute inset-0" style={{
                        backgroundImage: `
                          linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
                          linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
                        `,
                        backgroundSize: '4px 4px'
                      }} />
                      <CardHeader className="relative z-10 pb-3">
                        <CardTitle className="flex items-center justify-between text-white text-lg">
                          <span>Accessories</span>
                          <Badge variant="secondary" className="bg-white/10 text-white border-white/20">0 owned</Badge>
                        </CardTitle>
                        <CardDescription className="text-gray-300">Your accessories collection</CardDescription>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <div className="text-center py-8">
                          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-gray-300 text-sm">No accessories owned yet</p>
                          <p className="text-xs text-gray-400 mt-1">Visit the store to purchase shoes, backpacks, and hats</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Mobile Mobility Category */}
                    <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
                      <div className="absolute inset-0" style={{
                        backgroundImage: `
                          linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
                          linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
                        `,
                        backgroundSize: '4px 4px'
                      }} />
                      <CardHeader className="relative z-10 pb-3">
                        <CardTitle className="flex items-center justify-between text-white text-lg">
                          <span>Mobility</span>
                          <Badge variant="secondary" className="bg-white/10 text-white border-white/20">0 owned</Badge>
                        </CardTitle>
                        <CardDescription className="text-gray-300">Your vehicles collection</CardDescription>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <div className="text-center py-8">
                          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-gray-300 text-sm">No vehicles owned yet</p>
                          <p className="text-xs text-gray-400 mt-1">Visit the store to purchase bikes, cars, and hovercrafts</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          
        </div>

        {/* Desktop Layout - Hidden on mobile */}
        <div className="hidden lg:flex lg:min-h-screen w-full">
          {/* Left Sidebar - Desktop only */}
          <aside className="w-80 bg-card border-r border-border p-6 space-y-6 overflow-y-auto h-screen">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Level 0: Recruit</span>
                      <span className="text-xs text-muted-foreground">0/100 XP</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Weekly Objectives</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Package className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Open 3 packs</p>
                        <p className="text-xs text-muted-foreground">0/3 • 10 XP</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 text-secondary-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Buy 3 fighters</p>
                        <p className="text-xs text-muted-foreground">0/3 • 10 XP</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-destructive rounded-full flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-destructive-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Sell 3 fighters</p>
                        <p className="text-xs text-muted-foreground">0/3 • 10 XP</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Trade 3 days in a row</p>
                        <p className="text-xs text-muted-foreground">0/3 • 10 XP</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <UserPlus className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Invite 3 friends</p>
                        <p className="text-xs text-muted-foreground">0/3 • 10 XP</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Social Links */}
            <div className="mt-auto pt-6">
              <div className="flex items-center justify-center gap-4">
                <a href="https://x.com/lcs_game" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <img src="/lovable-uploads/3c1059ce-1948-46a2-bc2a-8e6c6b55079d.png" alt="X" className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/lastchadstanding/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://lcsdeck.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Layers className="w-5 h-5" />
                </a>
                <a href="/docs" className="text-muted-foreground hover:text-primary transition-colors">
                  <BookOpen className="w-5 h-5" />
                </a>
                <a href="https://youtube.com/@lastchadstanding" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Youtube className="w-6 h-6" />
                </a>
              </div>
              
              {/* Prominent Logo */}
              <div className="flex justify-center mt-6">
                <a 
                  href="https://dehub.io/lcs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img 
                    src="/lovable-uploads/885f4a61-92f8-40e3-8733-2ba3b2534e16.png" 
                    alt="Logo" 
                    className="h-16 object-contain opacity-90 hover:opacity-100 transition-opacity duration-300 cursor-pointer" 
                  />
                </a>
              </div>
            </div>
          </aside>

          {/* Center Content - Desktop Layout */}
          <main className="flex-1 p-6 overflow-y-auto h-screen">
            {activeTab === "home" && (
              <div className="grid grid-cols-12 gap-6 h-full min-h-0">
                {/* Large Welcome Card */}
                <Card className="col-span-8 row-span-2 bg-gradient-to-br from-blue-600/80 to-purple-700/80 text-white border-0 relative overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
                  backgroundImage: 'url(/lovable-uploads/2390abe9-bd8c-4568-8198-12a97fb918e3.png)'
                }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <CardContent className="p-8 h-full flex flex-col justify-end relative z-10">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Welcome to LCS</h2>
                    <p className="text-blue-100 mb-6">
                      Get ready to play the first ever MMA battle royale
                    </p>
                      <div className="flex space-x-4">
                        <Button 
                          variant="secondary" 
                          size="default" 
                          className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                          onClick={() => navigate('/docs')}
                        >
                          <Info className="w-4 h-4 mr-2" />
                          How to play
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="default" 
                          className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                          onClick={() => toast({
                            title: "Coming Soon",
                            description: "The game will be available soon!",
                            duration: 4200
                          })}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Play now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tournament Complete Card */}
                <Card className="col-span-4 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
                  <div className="absolute inset-0" style={{
                    backgroundImage: `
                      linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
                      linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
                    `,
                    backgroundSize: '4px 4px'
                  }} />
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Trophy className="w-5 h-5 text-white" />
                      <span className="text-sm font-medium text-white">Quests!</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">Smash that XP</h3>
                    <p className="text-gray-300 text-sm mb-4">by completing all quests</p>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 w-full relative z-10 transition-all duration-300"
                      onClick={() => toast({
                        title: "Coming Soon",
                        description: "Quests are coming soon!",
                        duration: 4200
                      })}
                    >
                      Show Quests
                    </Button>
                  </CardContent>
                </Card>

                {/* Open Packs Card */}
                <Card className="col-span-4 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
                  <div className="absolute inset-0" style={{
                    backgroundImage: `
                      linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
                      linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
                    `,
                    backgroundSize: '4px 4px'
                  }} />
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Gift className="w-5 h-5" />
                      <span className="text-sm font-medium">Open Packs</span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300 font-semibold">SILVER</span>
                        <span className="text-sm">x0</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-yellow-300 font-semibold">GOLD</span>
                        <span className="text-sm">x0</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent font-bold">SPECIAL</span>
                        <span className="text-sm">x0</span>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 w-full relative z-10 transition-all duration-300">
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>

                {/* Additional Cards */}
                <Card className="col-span-6 bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white border border-gray-600/50 shadow-2xl relative overflow-hidden">
                  {/* Metallic base layer */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700/30 via-gray-800/50 to-gray-900/80" />
                  
                  {/* Metallic shine overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/10 to-transparent transform -skew-x-12" />
                  
                  <CardContent className="p-6 relative z-10">
                    <div className="flex flex-col items-center text-center space-y-3 mb-4">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Roster</h3>
                        <p className="text-sm text-gray-300">Pick your prizefighters</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 w-full transition-all duration-300">
                      Start Building
                    </Button>
                  </CardContent>
                </Card>

                <Card className="col-span-6 bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white border border-gray-600/50 shadow-2xl relative overflow-hidden">
                  {/* Metallic base layer */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700/30 via-gray-800/50 to-gray-900/80" />
                  
                  {/* Metallic shine overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/10 to-transparent transform -skew-x-12" />
                  
                  <CardContent className="p-6 relative z-10">
                    <div className="flex flex-col items-center text-center space-y-3 mb-4">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Transfer Market</h3>
                        <p className="text-sm text-gray-300">Buy, sell, list or just browse</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 w-full transition-all duration-300">
                      Browse Market
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "store" && (
              <div className="space-y-6 max-w-4xl">
                {/* Store Header */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <ShoppingBag className="w-8 h-8 text-primary" />
                    <div>
                      <h1 className="text-3xl font-bold">LCS Store</h1>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-6">
                  {/* Skins Category */}
                  <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
                    <div className="absolute inset-0" style={{
                      backgroundImage: `
                        linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
                        linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
                      `,
                      backgroundSize: '4px 4px'
                    }} />
                    <CardHeader className="relative z-10">
                      <CardTitle className="flex items-center justify-between text-white">
                        <span>Skins</span>
                        <Badge variant="secondary">4 items</Badge>
                      </CardTitle>
                      <CardDescription className="text-gray-300">Characters to play in game</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-4 gap-4">
                        {[
                          { name: "Cyber Warrior", price: 2500, rarity: "legendary", image: "/lovable-uploads/2390abe9-bd8c-4568-8198-12a97fb918e3.png" },
                          { name: "Shadow Assassin", price: 1800, rarity: "epic", image: "/lovable-uploads/3c1059ce-1948-46a2-bc2a-8e6c6b55079d.png" },
                          { name: "Battle Mage", price: 2200, rarity: "legendary", image: "/lovable-uploads/2390abe9-bd8c-4568-8198-12a97fb918e3.png" },
                          { name: "Iron Guardian", price: 1500, rarity: "rare", image: "/lovable-uploads/3c1059ce-1948-46a2-bc2a-8e6c6b55079d.png" }
                        ].map((item, idx) => (
                          <Card key={idx} className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white border border-gray-600/50 shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-700/30 via-gray-800/50 to-gray-900/80" />
                            <CardContent className="p-4 relative z-10">
                              <div className="aspect-square bg-gray-800/50 rounded-lg mb-3 overflow-hidden">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <h3 className="font-semibold text-sm text-white mb-2">{item.name}</h3>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                  <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-4 h-4" />
                                  <span className="text-sm font-bold text-white">{item.price.toLocaleString()}</span>
                                </div>
                                <Button size="sm" variant="secondary" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-7 px-3">
                                  Buy
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Accessories Category */}
                  <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
                    <div className="absolute inset-0" style={{
                      backgroundImage: `
                        linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
                        linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
                      `,
                      backgroundSize: '4px 4px'
                    }} />
                    <CardHeader className="relative z-10">
                      <CardTitle className="flex items-center justify-between text-white">
                        <span>Accessories</span>
                        <Badge variant="secondary">4 items</Badge>
                      </CardTitle>
                      <CardDescription className="text-gray-300">Shoes, backpacks, hats</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-4 gap-4">
                        {[
                          { name: "Neon Sneakers", price: 600, image: "/lovable-uploads/69c61fed-9ccd-43d2-bab5-17c6c0db05b4.png" },
                          { name: "Combat Backpack", price: 450, image: "/lovable-uploads/7311683b-ea99-4dd9-9b1f-89d96742eff0.png" },
                          { name: "Tactical Helmet", price: 750, image: "/lovable-uploads/69c61fed-9ccd-43d2-bab5-17c6c0db05b4.png" },
                          { name: "Power Gloves", price: 550, image: "/lovable-uploads/7311683b-ea99-4dd9-9b1f-89d96742eff0.png" }
                        ].map((item, idx) => (
                          <Card key={idx} className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white border border-gray-600/50 shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-700/30 via-gray-800/50 to-gray-900/80" />
                            <CardContent className="p-4 relative z-10">
                              <div className="aspect-square bg-gray-800/50 rounded-lg mb-3 overflow-hidden">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <h3 className="font-semibold text-sm text-white mb-2">{item.name}</h3>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                  <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-4 h-4" />
                                  <span className="text-sm font-bold text-white">{item.price.toLocaleString()}</span>
                                </div>
                                <Button size="sm" variant="secondary" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-7 px-3">
                                  Buy
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Mobility Category */}
                  <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
                    <div className="absolute inset-0" style={{
                      backgroundImage: `
                        linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
                        linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
                      `,
                      backgroundSize: '4px 4px'
                    }} />
                    <CardHeader className="relative z-10">
                      <CardTitle className="flex items-center justify-between text-white">
                        <span>Mobility</span>
                        <Badge variant="secondary">4 items</Badge>
                      </CardTitle>
                      <CardDescription className="text-gray-300">Cars, golf buggies, etc</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-4 gap-4">
                        {[
                          { name: "Cyber Car", price: 5000, image: "/lovable-uploads/84ab9eed-00bc-425c-a953-3ea0478e464d.png" },
                          { name: "Speed Buggy", price: 3200, image: "/lovable-uploads/896892f1-7ebc-4852-acea-80dcdbf7c545.png" },
                          { name: "Hover Bike", price: 4500, image: "/lovable-uploads/84ab9eed-00bc-425c-a953-3ea0478e464d.png" },
                          { name: "Stealth Jet", price: 8000, image: "/lovable-uploads/896892f1-7ebc-4852-acea-80dcdbf7c545.png" }
                        ].map((item, idx) => (
                          <Card key={idx} className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white border border-gray-600/50 shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-700/30 via-gray-800/50 to-gray-900/80" />
                            <CardContent className="p-4 relative z-10">
                              <div className="aspect-square bg-gray-800/50 rounded-lg mb-3 overflow-hidden">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <h3 className="font-semibold text-sm text-white mb-2">{item.name}</h3>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                  <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-4 h-4" />
                                  <span className="text-sm font-bold text-white">{item.price.toLocaleString()}</span>
                                </div>
                                <Button size="sm" variant="secondary" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-7 px-3">
                                  Buy
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "market" && (
              <div className="space-y-6 max-w-6xl">
                {/* Market Header */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-3 mb-6">
                    <CreditCard className="w-8 h-8 text-primary" />
                    <div>
                      <h1 className="text-3xl font-bold">Transfer Market</h1>
                    </div>
                  </div>
                </div>

                {/* Market Analytics Dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Total Market Value Chart */}
                  <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
                    <div className="absolute inset-0" style={{
                      backgroundImage: `
                        linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
                        linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
                      `,
                      backgroundSize: '4px 4px'
                    }} />
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-lg flex items-center space-x-2 text-white">
                        <BarChart3 className="w-5 h-5" />
                        <span>Total Market Value</span>
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        <div className="flex items-center space-x-2">
                          <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-4 h-4" />
                          <span className="text-xl font-bold text-white">{currentMarketValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={marketValueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.7)' }} />
                            <YAxis tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.7)' }} />
                            <Tooltip 
                              labelStyle={{ color: '#000' }}
                              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="value" 
                              stroke="hsl(var(--primary))"
                              fill="hsl(var(--primary))"
                              fillOpacity={0.3}
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Live Listings Chart */}
                  <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
                    <div className="absolute inset-0" style={{
                      backgroundImage: `
                        linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
                        linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
                      `,
                      backgroundSize: '4px 4px'
                    }} />
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-lg flex items-center space-x-2 text-white">
                        <LineChart className="w-5 h-5" />
                        <span>Live Transfer Listings</span>
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        <span className="text-xl font-bold text-white">{currentListings} active listings</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={listingsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.7)' }} />
                            <YAxis tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.7)' }} />
                            <Tooltip 
                              labelStyle={{ color: '#000' }}
                              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="listings" 
                              stroke="hsl(var(--primary))"
                              fill="hsl(var(--primary))"
                              fillOpacity={0.3}
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Trending & Gainers Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Trending List */}
                  <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
                    <div className="absolute inset-0" style={{
                      backgroundImage: `
                        linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
                        linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
                      `,
                      backgroundSize: '4px 4px'
                    }} />
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-lg flex items-center space-x-2 text-white">
                        <TrendingUp className="w-5 h-5" />
                        <span>Trending</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="space-y-3">
                        {trendingPlayers.map((player, idx) => (
                          <div key={idx} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                            <div className="w-12 h-12 rounded-full overflow-hidden">
                              <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-semibold text-white truncate">{player.name}</p>
                                <div className="flex items-center space-x-1">
                                  <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-4 h-4" />
                                  <span className="text-sm font-bold text-white">{player.price.toLocaleString()}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-400">{player.team} • {player.position}</p>
                                <div className={`flex items-center space-x-1 ${player.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                                  {player.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                  <span className="text-xs font-medium">{player.trend === 'up' ? '+' : ''}{player.change}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Gainers List */}
                  <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
                    <div className="absolute inset-0" style={{
                      backgroundImage: `
                        linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
                        linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
                      `,
                      backgroundSize: '4px 4px'
                    }} />
                    <CardHeader className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <CardTitle className="text-lg flex items-center space-x-2 text-white">
                          <ArrowUpRight className="w-5 h-5 text-green-400" />
                          <span>Top Gainers</span>
                        </CardTitle>
                      </div>
                      <div className="flex space-x-2">
                        {[
                          { key: "daily", label: "Daily" },
                          { key: "weekly", label: "Weekly" },
                          { key: "monthly", label: "Monthly" },
                          { key: "alltime", label: "All Time" }
                        ].map((filter) => (
                          <Button
                            key={filter.key}
                            variant={gainersTimeFilter === filter.key ? "secondary" : "ghost"}
                            size="sm"
                            className={`text-xs ${
                              gainersTimeFilter === filter.key 
                                ? "bg-white/20 text-white border-white/30" 
                                : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                            }`}
                            onClick={() => setGainersTimeFilter(filter.key)}
                          >
                            {filter.label}
                          </Button>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="space-y-3">
                        {topGainers.map((player, idx) => (
                          <div key={idx} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                            <div className="w-12 h-12 rounded-full overflow-hidden">
                              <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-semibold text-white truncate">{player.name}</p>
                                <div className="flex items-center space-x-1">
                                  <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-4 h-4" />
                                  <span className="text-sm font-bold text-white">{player.price.toLocaleString()}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-400">{player.team} • {player.position}</p>
                                <div className="flex items-center space-x-1 text-green-400">
                                  <ArrowUpRight className="w-3 h-3" />
                                  <span className="text-xs font-medium">+{player.change}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* All Players List */}
                <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
                  <div className="absolute inset-0" style={{
                    backgroundImage: `
                      linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
                      linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
                    `,
                    backgroundSize: '4px 4px'
                  }} />
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-lg flex items-center justify-between text-white">
                      <span>All Players - Most Expensive First</span>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-8 px-3">
                          <Search className="w-3 h-3 mr-1" />
                          Search
                        </Button>
                        <Button variant="outline" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-8 px-3">
                          <Filter className="w-3 h-3 mr-1" />
                          Filter
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="space-y-3">
                      {allPlayers.slice(0, visiblePlayers).map((player, idx) => (
                        <div key={idx} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                          <div className="w-16 h-16 rounded-full overflow-hidden">
                            <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-lg font-semibold text-white truncate">{player.name}</p>
                              <div className="flex items-center space-x-2">
                                <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-5 h-5" />
                                <span className="text-lg font-bold text-white">{player.price.toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-400">{player.team} • {player.position}</p>
                                <p className="text-xs text-gray-500">Last sale: {player.lastSale.toLocaleString()}</p>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className={`flex items-center space-x-1 ${player.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                                  {player.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                  <span className="text-sm font-medium">
                                    {((player.price - player.lastSale) / player.lastSale * 100).toFixed(1)}%
                                  </span>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
                                  onClick={() => toast({
                                    title: "Purchase Initiated",
                                    description: `Attempting to buy ${player.name} for ${player.price.toLocaleString()} coins`,
                                    duration: 3000
                                  })}
                                >
                                  Buy Now
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {visiblePlayers < allPlayers.length && (
                      <div className="mt-6 text-center">
                        <Button 
                          variant="outline" 
                          className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
                          onClick={() => setVisiblePlayers(prev => Math.min(prev + 10, allPlayers.length))}
                        >
                          Load More Players ({allPlayers.length - visiblePlayers} remaining)
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "locker" && (
              <div className="space-y-6 max-w-4xl">
                {/* Desktop Locker Header */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <Package className="w-8 h-8 text-primary" />
                    <div>
                      <h1 className="text-3xl font-bold">My Locker</h1>
                    </div>
                  </div>
                </div>

                {!authenticated ? (
                  <Card className="bg-card border border-border">
                    <CardContent className="p-8 text-center">
                      <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Login to View Your Locker</h3>
                      <p className="text-muted-foreground mb-4">Connect your wallet to see your owned items</p>
                      <Button onClick={login} className="bg-primary hover:bg-primary/90">
                        Login
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {/* Desktop Skins Category */}
                    <Card className="bg-gradient-to-br from-blue-600/20 to-purple-700/20 border border-blue-600/30">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Skins</span>
                          <Badge variant="secondary">0 owned</Badge>
                        </CardTitle>
                        <CardDescription>Your character skins</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-muted-foreground/50" />
                          </div>
                          <p className="text-muted-foreground">No skins owned yet</p>
                          <p className="text-sm text-muted-foreground/70 mt-1">Visit the store to purchase character skins</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Desktop Accessories Category */}
                    <Card className="bg-gradient-to-br from-green-600/20 to-blue-700/20 border border-green-600/30">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Accessories</span>
                          <Badge variant="secondary">0 owned</Badge>
                        </CardTitle>
                        <CardDescription>Your accessories collection</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-muted-foreground/50" />
                          </div>
                          <p className="text-muted-foreground">No accessories owned yet</p>
                          <p className="text-sm text-muted-foreground/70 mt-1">Visit the store to purchase shoes, backpacks, and hats</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Desktop Mobility Category */}
                    <Card className="bg-gradient-to-br from-orange-600/20 to-red-700/20 border border-orange-600/30">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Mobility</span>
                          <Badge variant="secondary">0 owned</Badge>
                        </CardTitle>
                        <CardDescription>Your vehicles collection</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-muted-foreground/50" />
                          </div>
                          <p className="text-muted-foreground">No vehicles owned yet</p>
                          <p className="text-sm text-muted-foreground/70 mt-1">Visit the store to purchase cars, golf buggies, and more</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </main>

          {/* Right Sidebar - Desktop only */}
          <aside className="w-80 bg-card border-l border-border p-6 flex flex-col h-screen overflow-y-auto">
            <Tabs value={rightSidebarTab} onValueChange={setRightSidebarTab} className="w-full flex flex-col h-full">
              <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="rankings" className="flex items-center gap-2">
                  <Medal className="w-4 h-4" />
                  Rankings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="notifications">
                <div className="text-center py-8 flex-1 flex flex-col justify-center">
                  <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <p className="text-sm text-muted-foreground mt-2">
                    You'll see game updates and important announcements here
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="rankings" className="overflow-y-auto space-y-2 scrollbar-none max-h-[580px] -mt-2">
                <p className="text-sm text-muted-foreground text-center pb-2 pt-6">Weekly prize pool: $0</p>
                {[
                  { rank: 1, name: "CryptoKing", level: 45, points: 15420, avatar: "👑" },
                  { rank: 2, name: "BlockMaster", level: 43, points: 14890, avatar: "⚔️" },
                  { rank: 3, name: "ChainWarrior", level: 41, points: 14320, avatar: "🛡️" },
                  { rank: 4, name: "TokenSlayer", level: 38, points: 13780, avatar: "🗡️" },
                  { rank: 5, name: "NFTChampion", level: 37, points: 13240, avatar: "🏆" },
                  { rank: 6, name: "DeFiGamer", level: 35, points: 12890, avatar: "💎" },
                  { rank: 7, name: "MetaPlayer", level: 34, points: 12450, avatar: "🎮" },
                  { rank: 8, name: "Web3Hero", level: 32, points: 12120, avatar: "🚀" },
                  { rank: 9, name: "CoinMaster", level: 30, points: 11780, avatar: "💰" },
                  { rank: 10, name: "BlockHero", level: 29, points: 11340, avatar: "⭐" },
                  { rank: 11, name: "SmartTrader", level: 28, points: 10920, avatar: "🧠" },
                  { rank: 12, name: "CyberNinja", level: 27, points: 10540, avatar: "🥷" },
                  { rank: 13, name: "QuantumGamer", level: 26, points: 10180, avatar: "⚡" },
                  { rank: 14, name: "PixelMaster", level: 25, points: 9840, avatar: "🎨" },
                  { rank: 15, name: "CodeWarrior", level: 24, points: 9520, avatar: "💻" },
                  { rank: 16, name: "AlgoTrader", level: 23, points: 9210, avatar: "📈" },
                  { rank: 17, name: "BitCrusher", level: 22, points: 8920, avatar: "🔨" },
                  { rank: 18, name: "EtherLord", level: 21, points: 8650, avatar: "⚡" },
                  { rank: 19, name: "GameChanger", level: 20, points: 8390, avatar: "🎯" },
                  { rank: 20, name: "TechSavvy", level: 19, points: 8140, avatar: "🔧" },
                  { rank: 21, name: "DigitalNomad", level: 18, points: 7910, avatar: "🌐" },
                  { rank: 22, name: "CryptoSage", level: 17, points: 7690, avatar: "🧙‍♂️" },
                  { rank: 23, name: "BlockBuilder", level: 16, points: 7480, avatar: "🏗️" },
                  { rank: 24, name: "TokenHunter", level: 15, points: 7280, avatar: "🎣" },
                  { rank: 25, name: "ChainLink", level: 14, points: 7090, avatar: "🔗" }
                ].map((player) => (
                  <div key={player.rank} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0 w-8 text-center">
                      {player.rank <= 3 ? (
                        <Medal className={`w-5 h-5 ${
                          player.rank === 1 ? 'text-yellow-400' : 
                          player.rank === 2 ? 'text-gray-300' : 
                          'text-amber-600'
                        }`} />
                      ) : (
                        <span className="text-sm font-medium text-muted-foreground">#{player.rank}</span>
                      )}
                    </div>
                    
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-sm">{player.avatar}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{player.name}</p>
                        <Badge variant="outline" className="text-xs">Lv.{player.level}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{player.points.toLocaleString()} XP</p>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </aside>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2 z-50">
        <div className="flex items-center justify-around">
          {tabItems.slice(0, 5).map(tab => (
            <button 
              key={tab.id} 
              onClick={() => handleTabClick(tab.id)} 
              className={`flex flex-col items-center space-y-1 px-2 py-1 rounded-lg transition-colors ${
                activeTab === tab.id 
                  ? "text-primary" 
                  : "text-muted-foreground"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>;
};
export default Game;
