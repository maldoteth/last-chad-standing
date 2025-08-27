import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Coins, ShoppingBag, Users, Package, CreditCard, Trophy, Star, Target, ChevronRight, Bell, Play } from "lucide-react";

const Game = () => {
  const [activeTab, setActiveTab] = useState("lobby");
  const [userCoins] = useState(12500);

  const tabItems = [
    { id: "lobby", label: "Lobby", icon: Users },
    { id: "store", label: "Store", icon: ShoppingBag },
    { id: "market", label: "Market", icon: CreditCard },
    { id: "locker", label: "Locker", icon: Package },
    { id: "coins", label: "Coins", icon: Coins },
    { id: "pass", label: "Pass", icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      {/* Header Navigation */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <nav className="flex items-center space-x-8">
            {tabItems.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-muted px-3 py-2 rounded-lg">
              <Coins className="w-4 h-4 text-yellow-500" />
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
          <Card className="bg-accent/30 border-accent">
            <CardHeader className="text-center pb-4">
              <Avatar className="w-16 h-16 mx-auto mb-3">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                  DD
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">diversedonkey#5936</CardTitle>
              <Badge variant="outline" className="border-orange-500 text-orange-500 bg-orange-500/10">
                Bronze
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">REP</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">LVL</span>
                <span className="font-semibold">10</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">XP</span>
                  <span>5400 / Next level 1.1k</span>
                </div>
                <Progress value={83} className="h-2" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Skill rating</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Squad value</span>
                <div className="flex items-center space-x-1">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold">0</span>
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
                      <Trophy className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Win 3 matches</p>
                      <p className="text-xs text-muted-foreground">0/3</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Score 5 goals</p>
                      <p className="text-xs text-muted-foreground">0/5</p>
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
            <Card className="col-span-8 row-span-2 bg-gradient-to-br from-blue-600 to-purple-700 text-white border-0 relative overflow-hidden">
              <CardContent className="p-8 h-full flex flex-col justify-between relative z-10">
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
                    <p className="text-sm text-muted-foreground">Buy & sell players</p>
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
            <p className="text-muted-foreground">No notifications yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              You'll see game updates and important announcements here
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Game;