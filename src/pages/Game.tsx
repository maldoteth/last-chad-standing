import React, { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore, StoreItem } from "@/context/storeData";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GlowCard } from "@/components/ui/spotlight-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getCurrentLevel, getProgressToNextLevel } from "@/lib/progressSystem";
import { getTierIcon } from "@/lib/utils";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Coins, ShoppingBag, Users, Package, CreditCard, Trophy, Star, Target, ChevronRight, Bell, Play, TrendingUp, UserPlus, Medal, Info, Gift, Gamepad, Instagram, Layers, BookOpen, Youtube, X, RotateCcw, MessageCircle, CookingPot, } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PreOrderDialog from "@/components/PreOrderDialog";
import StorePurchaseDialog from "@/components/StorePurchaseDialog";
import Header from "@/components/navbar/header";
import BottomNavbar from "@/components/navbar/bottomNavbar";
import { Level, useRank } from "@/context/rankData";
import { useApi } from "@/Api/apiFunction";
import StoreTab from "@/components/home/storeTab";
import LockerTab from "@/components/home/lockerTab";
import { useProfile } from "@/context/profileContext";
import MarketTab from "@/components/home/marketTab";
import ObjectivesCard from "@/components/objectivesCard";
import HomeTab from "@/components/home/homeTab";
import { useNotifications } from "@/context/notificationContext";
import { Spinner } from "@/components/ui/spinner";
import NotificationsList from "@/components/notificationList";

const Game = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("home");
  const [rightSidebarTab, setRightSidebarTab] = useState("rankings");
  const [isPreOrderOpen, setIsPreOrderOpen] = useState(false);
  const [objectivesView, setObjectivesView] = useState<"weekly" | "daily" | "quests">("weekly");
  const [isObjectivesGlowing, setIsObjectivesGlowing] = useState(false);

  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [selectedStoreItem, setSelectedStoreItem] = useState<StoreItem | null>(null);
  const objectivesRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { post, get } = useApi()
  const { unreadCount } = useNotifications()

  const {
    toast
  } = useToast();
  const {
    login,
    authenticated,
    user
  } = usePrivy();
  const { rankingData, levelsData } = useRank()

  const navigate = useNavigate();
  const {
    userBalance,
    currentLevel,
    loading: storeLoading
  } = useStore();
  const {
    profile,
  } = useProfile();

  // Handle buy with coins click
  const handleBuyWithCoinsClick = () => {
    if (!authenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to purchase with coins",
        action: <Button size="sm" onClick={login}>
          Sign In
        </Button>
      });
      return;
    }
    toast({
      title: "Coming Soon",
      description: "Coin purchases coming soon!",
      duration: 3000
    });
  };

  // Handle buy with card click
  const handleBuyWithCardClick = () => {
    if (!authenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to purchase with card",
        action: <Button size="sm" onClick={login}>
          Sign In
        </Button>
      });
      return;
    }
    toast({
      title: "Coming Soon",
      description: "Card payments coming soon!",
      duration: 3000
    });
  };

  const handleSetTabParams = (tabId: string) => {
    setSearchParams({ tab: tabId });
  };
  const handleTabClick = (tabId: string) => {
    if (tabId === "lobby") {
      setIsPreOrderOpen(true);
    } else {
      setActiveTab(tabId);
      setTimeout(() => {
        window.scrollTo(0, 0);
        const mobileScrollContainers = document.querySelectorAll('.overflow-y-auto');
        mobileScrollContainers.forEach(container => {
          container.scrollTop = 0;
        });
        const scrollAreas = document.querySelectorAll('[data-radix-scroll-area-viewport]');
        scrollAreas.forEach(viewport => {
          viewport.scrollTop = 0;
        });
      }, 50);
    }
  };
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl) {
      handleTabClick(tabFromUrl);
    }
  }, [searchParams]);

  return <div className="min-h-screen bg-black text-foreground dark">
    {/* Mobile/Tablet optimized layout */}
    <Header />

    {/* Main Content - Mobile First Layout */}
    <div className="lg:flex lg:min-h-[calc(100vh-80px)] custom-scroll">

      {/* Mobile: Stack everything vertically */}
      {isMobile && <div className="lg:hidden overflow-y-auto custom-scroll max-h-[calc(100vh-140px)] pb-2">
        {activeTab === "home" &&
          <HomeTab />}

        {activeTab === "store" && <StoreTab />}

        {activeTab === "market" &&
          <MarketTab />
        }

        {activeTab === "locker" && <LockerTab />}
      </div>}

      {/* Desktop Layout - Hidden on mobile */}
      <div className="hidden lg:flex lg:min-h-screen w-full">
        {/* Left Sidebar - Desktop only */}
        <aside className="w-80 bg-black border-r border-border p-6 space-y-6 overflow-y-auto custom-scroll h-screen">
          <div className="relative">
            {/* Desktop: Hover Card + Popover */}
            {!isMobile ? <div className="relative">
              <HoverCard>
                <HoverCardTrigger>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Card className="bg-black border-gray-700 cursor-pointer hover:border-gray-600 transition-colors">
                        <CardHeader className="pb-0">
                          <CardTitle className="text-base flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-base">{profile?.avatar_url || '👤'}</span>
                              <span>Progress</span>
                            </div>
                            <Info className="w-4 h-4 text-muted-foreground" />
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="!pt-0">
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
                        </CardContent>
                      </Card>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4 bg-black/90 backdrop-blur-md border border-white/20 text-white z-50" side="right" align="start">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm">XP Progress Levels</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto custom-scroll">
                          {levelsData?.map((level: Level, index) => {
                            const isCurrentLevel = currentLevel === level.id;
                            const isUnlocked = (userBalance?.xp || 0) >= level.min_xp;
                            return <div key={index} className={`flex items-center justify-between p-2 rounded-md transition-colors ${isCurrentLevel ? 'bg-primary/20 border border-primary/30' : isUnlocked ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-800/50 opacity-60'}`}>
                              <div className="flex items-center space-x-2">
                                <span className="text-base">
                                  {level?.icon}
                                </span>
                                <span className="text-sm font-medium">{level.name}</span>
                              </div>
                              <span className="text-xs text-gray-400">
                                {level.max_xp === Infinity ? `${level.min_xp}+ XP` : `${level.min_xp}-${level.max_xp} XP`}
                              </span>
                            </div>;
                          })}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-4 bg-black/90 backdrop-blur-md border border-white/20 text-white z-50" side="right" align="start">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">XP Progress Levels</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto custom-scroll">
                      {levelsData?.map((level: Level, index) => {
                        const isCurrentLevel = currentLevel === level.id;
                        const isUnlocked = (userBalance?.xp || 0) >= level.min_xp;
                        return <div key={index} className={`flex items-center justify-between p-2 rounded-md transition-colors ${isCurrentLevel ? 'bg-primary/20 border border-primary/30' : isUnlocked ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-800/50 opacity-60'}`}>
                          <div className="flex items-center space-x-2">
                            <span className="text-base">{getTierIcon(level.min_xp)}</span>
                            <span className="text-sm font-medium">{level.name}</span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {level.max_xp === Infinity ? `${level.min_xp}+ XP` : `${level.min_xp}-${level.max_xp} XP`}
                          </span>
                        </div>;
                      })}
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div> : (/* Mobile: Card with Info Button and Popover */
              <Card className="bg-black border-gray-700">
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">{profile?.avatar_url || '👤'}</span>
                      <span>Progress</span>
                    </div>
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-white/10">
                          <Info className="w-4 h-4" />
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent className="bg-black/95 backdrop-blur-md border-gray-700">
                        <DrawerHeader>
                          <DrawerTitle className="text-white text-center">XP Progress Levels</DrawerTitle>
                        </DrawerHeader>
                        <div className="p-4 pb-8">
                          <div className="space-y-2 max-h-80 overflow-y-auto custom-scroll">
                            {levelsData?.map((level: Level, index) => {
                              const isCurrentLevel = currentLevel === level.id;
                              const isUnlocked = (userBalance?.xp || 0) >= level.min_xp;
                              return <div key={index} className={`flex items-center justify-between p-3 rounded-md transition-colors ${isCurrentLevel ? 'bg-primary/20 border border-primary/30' : isUnlocked ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-800/50 opacity-60'}`}>
                                <div className="flex items-center space-x-2">
                                  <span className="text-base">
                                    {level?.icon}
                                  </span>
                                  <span className={`text-sm font-medium ${isCurrentLevel ? 'text-primary' : 'text-white'}`}>
                                    {level.name}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-400">
                                  {level.level >= 10 ? "10,000+ XP" : `${level.min_xp}-${level.max_xp} XP`}
                                </span>
                              </div>;
                            })}
                          </div>
                        </div>
                      </DrawerContent>
                    </Drawer>
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
                  </div>
                </CardContent>
              </Card>)}
          </div>

          <ObjectivesCard
            objectivesView={objectivesView}
            setObjectivesView={setObjectivesView}
            isObjectivesGlowing={isObjectivesGlowing}
          />

          {/* Social Links */}
          <div className="mt-auto pt-2">
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
              <a href="https://dehub.io/lcs" target="_blank" rel="noopener noreferrer" className="block">
                <img src="/lovable-uploads/885f4a61-92f8-40e3-8733-2ba3b2534e16.png" alt="Logo" className="h-16 object-contain opacity-90 hover:opacity-100 transition-opacity duration-300 cursor-pointer" />
              </a>
            </div>
          </div>
        </aside>

        {/* Center Content - Desktop Layout */}
        {!isMobile && <main className="flex-1 h-screen">
          {activeTab === "home" && <HomeTab />}

          {activeTab === "store" && <StoreTab />}

          {activeTab === "market" &&
            <MarketTab />
          }

          {activeTab === "locker" && <LockerTab />}
        </main>}

        {/* Right Sidebar - Desktop only */}
        <aside className="w-80 bg-black border-l border-border p-6 flex flex-col h-screen overflow-y-auto custom-scroll">
          <Tabs value={rightSidebarTab} onValueChange={setRightSidebarTab} className="w-full flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-2 flex-shrink-0 bg-black">
              <TabsTrigger value="notifications" className="flex items-center gap-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:transition-transform after:duration-300 after:scale-x-0 data-[state=active]:after:scale-x-100">
                <div className="relative">
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && <div className="absolute -top-2 -right-2 ">
                    <div className="text-[10px] bg-white flex justify-center items-center text-red-500 rounded-full h-4 w-4 ">{unreadCount}</div>
                  </div>}
                </div>
                Notifications
              </TabsTrigger>
              <TabsTrigger value="rankings" className="flex items-center gap-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:transition-transform after:duration-300 after:scale-x-0 data-[state=active]:after:scale-x-100">
                <Medal className="w-4 h-4" />
                Rankings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notifications" className="bg-black">
              <NotificationsList />
            </TabsContent>

            <TabsContent value="rankings" className="flex-1  overflow-y-auto custom-scrollspace-y-2 -mt-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-black">
              <p className="text-sm text-muted-foreground text-center pb-2 pt-6">Weekly prize pool: $0</p>

              {rankingData && rankingData?.map(player => <div key={player?.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0 w-8 text-center">
                  {player?.level <= 3 ? <Medal className={`w-5 h-5 ${player?.level === 1 ? 'text-yellow-400' : player?.level === 2 ? 'text-gray-300' : 'text-amber-600'}`} /> : <span className="text-sm font-medium text-muted-foreground">#{player?.level}</span>}
                </div>

                <Avatar className="w-8 h-8">
                  {player?.user_id?.profileImage && <AvatarImage src={player?.user_id?.profileImage} />}
                  <AvatarFallback className="text-sm">{getTierIcon(Number(player.total_XP))}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{player?.user_id?.name}</p>
                    <Badge variant="outline" className="text-xs">Lv.{player.level}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{player.total_XP} XP</p>
                </div>
              </div>)}
            </TabsContent>
          </Tabs>
        </aside>
      </div>
    </div>


    {/* Mobile Bottom Navigation */}
    <BottomNavbar />

    {/* Sell Dialog - Mobile: Drawer, Desktop: Dialog */}
    {isMobile ? <Drawer open={sellDialogOpen} onOpenChange={setSellDialogOpen}>
      <DrawerContent className="bg-black/10 backdrop-blur-md border border-white/20 text-white">
        <DrawerHeader>
          <DrawerTitle className="text-white text-center">Sell {selectedPlayer?.name}</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <p className="text-white/80 mb-4">
            Selling functionality is coming soon! Stay tuned for updates.
          </p>
          <div className="flex justify-end">
            <Button variant="outline" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 hover:text-white transition-all duration-300" onClick={() => setSellDialogOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer> : <Dialog open={sellDialogOpen} onOpenChange={setSellDialogOpen}>
      <DialogContent className="sm:max-w-md bg-black/10 backdrop-blur-md border border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Sell {selectedPlayer?.name}</DialogTitle>
          <DialogDescription className="text-white/80">
            Selling functionality is coming soon! Stay tuned for updates.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 hover:text-white transition-all duration-300" onClick={() => setSellDialogOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>}
    {/* Pre-Order Dialog */}
    <PreOrderDialog open={isPreOrderOpen} onOpenChange={setIsPreOrderOpen}>
      <div />
    </PreOrderDialog>
    {/* Store Purchase Dialog */}
    <StorePurchaseDialog isOpen={purchaseDialogOpen} onClose={() => setPurchaseDialogOpen(false)} item={selectedStoreItem} />
  </div>;
};
export default Game;