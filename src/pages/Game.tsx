import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Coins, ShoppingBag, Users, Package, CreditCard, Trophy, Star, Target, ChevronRight, Bell, Play, Home, TrendingUp, UserPlus } from "lucide-react";
const Game = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [userCoins] = useState(12500);
  const {
    toast
  } = useToast();
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
      {/* Header Navigation */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <nav className="flex items-center space-x-8">
            {tabItems.map(tab => <button key={tab.id} onClick={() => handleTabClick(tab.id)} className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}>
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>)}
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-muted px-3 py-2 rounded-lg">
              <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-4 h-4" />
              <span className="font-semibold">{userCoins.toLocaleString()}</span>
            </div>
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>DD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Left Sidebar - User Profile */}
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
                <span>Objectives</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
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
                <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
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
                <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
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
                <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
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
                <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
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

        {/* Center Content - Bento Boxes */}
        <main className="flex-1 p-6">
          <div className="grid grid-cols-12 gap-6 h-full">
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
                    Start your journey in the ultimate crypto gaming experience
                  </p>
                  <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                    <Play className="w-4 h-4 mr-2" />
                    How to play
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tournament Complete Card */}
            <Card className="col-span-4 bg-green-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Trophy className="w-5 h-5" />
                  <span className="text-sm font-medium">Tournament Complete!</span>
                </div>
                <h3 className="text-lg font-bold mb-2">Weekend League</h3>
                <p className="text-green-100 text-sm mb-4">Dec 16 - Dec 18</p>
                <Button variant="secondary" size="sm" className="bg-white text-green-600 hover:bg-green-50">
                  Reveal winners
                </Button>
              </CardContent>
            </Card>

            {/* Open Packs Card */}
            <Card className="col-span-4 bg-orange-500 text-white border-0">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Open Packs</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">PRO</span>
                    <span className="text-sm">x3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">EPIC</span>
                    <span className="text-sm">x1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">LEGENDARY</span>
                    <span className="text-sm">x0</span>
                  </div>
                </div>
                <Button variant="secondary" size="sm" className="bg-white text-orange-500 hover:bg-orange-50">
                  Buy Now
                </Button>
              </CardContent>
            </Card>

            {/* Additional Cards */}
            <Card className="col-span-6 bg-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Squad Builder</h3>
                    <p className="text-sm text-muted-foreground">Build your dream team</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Start Building
                </Button>
              </CardContent>
            </Card>

            <Card className="col-span-6 bg-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Transfer Market</h3>
                    <p className="text-sm text-muted-foreground">Buy & sell fighters</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Browse Market
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Right Sidebar - Notifications */}
        <aside className="w-80 bg-card border-l border-border p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Bell className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          
          <div className="text-center py-12">
            <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">Buy & sell fighters</p>
            <p className="text-sm text-muted-foreground mt-2">
              You'll see game updates and important announcements here
            </p>
          </div>
        </aside>
      </div>
    </div>;
};
export default Game;