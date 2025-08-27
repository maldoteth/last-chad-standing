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
import { Coins, ShoppingBag, Users, Package, CreditCard, Trophy, Star, Target, ChevronRight, Bell, Play, Home, TrendingUp, UserPlus, Medal, LogOut, Settings, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const Game = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [rightSidebarTab, setRightSidebarTab] = useState("rankings");
  const [userCoins] = useState(0);
  const [visiblePlayers, setVisiblePlayers] = useState(10);
  const { toast } = useToast();
  const { login, logout, authenticated, user } = usePrivy();
  const navigate = useNavigate();
  const handleTabClick = (tabId: string) => {
    if (tabId === "lobby") {
      toast({
        title: "Coming Soon",
        description: "The lobby feature is currently under development."
      });
    } else {
      setActiveTab(tabId);
    }
  };
  const tabItems = [{
    id: "home",
    label: "Home",
    icon: Home
  }, {
    id: "lobby",
    label: "Lobby",
    icon: Users
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
    id: "coins",
    label: "Coins",
    icon: Coins
  }, {
    id: "pass",
    label: "Pass",
    icon: Trophy
  }];
  return <div className="min-h-screen bg-background text-foreground dark">
      {/* Mobile/Tablet optimized layout */}
      
      {/* Header with coins and avatar - simplified for mobile */}
      <header className="bg-card lg:border-b border-border px-4 py-3 lg:px-6 lg:py-4">
        <div className="flex items-center justify-between">
          <img src="/lovable-uploads/91245c4e-58e3-4f3e-9c11-44ed9eba5ac6.png" alt="Last Chad Standing" className="h-8 lg:hidden" />
          
          {/* Desktop Navigation - hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-8">
            {tabItems.map(tab => <button key={tab.id} onClick={() => handleTabClick(tab.id)} className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}>
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>)}
          </nav>
          
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
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - Mobile First Layout */}
      <div className="lg:flex lg:min-h-[calc(100vh-80px)]">
        
        {/* Mobile: Stack everything vertically */}
        <div className="lg:hidden overflow-y-auto max-h-[calc(100vh-80px)]">
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
                        description: "The game will be available soon!"
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
              <Card className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white border border-gray-600/50 shadow-2xl relative overflow-hidden">
                {/* Metallic base layer */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700/30 via-gray-800/50 to-gray-900/80" />
                
                {/* Metallic shine overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/10 to-transparent transform -skew-x-12" />
                <CardContent className="p-4">
                  <div className="flex items-center space-x-1 mb-2">
                    <Trophy className="w-4 h-4" />
                    <span className="text-xs font-medium">Quests!</span>
                  </div>
                  <h3 className="text-sm font-bold mb-1">Smash that XP</h3>
                  <p className="text-gray-300 text-xs mb-3">by completing all quests</p>
                  <Button variant="secondary" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 text-xs h-7 relative z-10 transition-all duration-300">
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
                  <h3 className="text-sm font-bold mb-2">Open Packs</h3>
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-yellow-300 font-semibold">GOLD</span>
                      <span className="text-xs">x0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-300 font-semibold">SILVER</span>
                      <span className="text-xs">x0</span>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 text-xs h-7 relative z-10 transition-all duration-300">
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
                      <h3 className="font-semibold text-sm text-white">Squad Builder</h3>
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
        </div>

        {/* Desktop Layout - Hidden on mobile */}
        <div className="hidden lg:flex lg:h-screen w-full overflow-hidden">
          {/* Left Sidebar - Desktop only */}
          <aside className="w-80 bg-card border-r border-border p-6 space-y-6">
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
          </aside>

          {/* Center Content - Desktop Bento Boxes */}
          <main className="flex-1 p-6 overflow-hidden">
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
                          description: "The game will be available soon!"
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
              <Card className="col-span-4 bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white border border-gray-600/50 shadow-2xl relative overflow-hidden">
                {/* Metallic base layer */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700/30 via-gray-800/50 to-gray-900/80" />
                
                {/* Metallic shine overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/10 to-transparent transform -skew-x-12" />
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Trophy className="w-5 h-5" />
                    <span className="text-sm font-medium">Quests!</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Smash that XP</h3>
                  <p className="text-gray-300 text-sm mb-4">by completing all quests</p>
                  <Button variant="secondary" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 w-full relative z-10 transition-all duration-300">
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
                  <h3 className="text-lg font-bold mb-4">Open Packs</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-yellow-300 font-semibold">GOLD</span>
                      <span className="text-sm">x0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300 font-semibold">SILVER</span>
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
                      <h3 className="font-semibold text-white">Squad Builder</h3>
                      <p className="text-sm text-gray-300">Build your dream team</p>
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
                      <p className="text-sm text-gray-300">Buy & sell fighters</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 w-full transition-all duration-300">
                    Browse Market
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>

          {/* Right Sidebar - Desktop only */}
          <aside className="w-80 bg-card border-l border-border p-6 flex flex-col h-screen">
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
              
              <TabsContent value="notifications" className="flex-1 flex flex-col">
                <div className="text-center py-8 flex-1 flex flex-col justify-center">
                  <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <p className="text-muted-foreground">Weekly prize pool: $0</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    You'll see game updates and important announcements here
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="rankings" className="overflow-y-auto space-y-2 scrollbar-none max-h-[580px] -mt-2">
                <p className="text-sm text-muted-foreground text-center pb-2">Weekly prize pool: $0</p>
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
