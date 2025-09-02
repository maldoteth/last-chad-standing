import React, { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from "react-router-dom";
import { useStore } from "@/hooks/useStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMarketplace } from "@/hooks/useMarketplace";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GlowCard } from "@/components/ui/spotlight-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ProgressBar } from "@/components/ProgressBar";
import { useProfile } from "@/hooks/useProfile";
import { getAllLevelsForDisplay, getCurrentLevel, getProgressToNextLevel } from "@/lib/progressSystem";
import { formatNumberWithAbbreviation } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Coins, ShoppingBag, Users, Package, CreditCard, Handshake, Trophy, Star, Target, ChevronRight, ChevronLeft, Bell, Play, Home, TrendingUp, UserPlus, Medal, LogOut, Settings, Info, Gift, BarChart3, LineChart, ArrowUpRight, ArrowDownRight, Search, Filter, Gamepad, Instagram, Layers, BookOpen, Youtube, X, RotateCcw, MessageCircle, Archive, ArrowRightLeft, ArrowUpDown, Wallet } from "lucide-react";
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar, Area, AreaChart } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import cyberWarriorSkin from "@/assets/cyber-warrior-skin.png";
import StoreCarousel, { StoreCarouselRef } from "@/components/StoreCarousel";
import PreOrderDialog from "@/components/PreOrderDialog";
const irishKingSkin = "/lovable-uploads/5c3f060f-4c5f-412b-8f27-eb1bebd3dd7d.png";
const staniEagleSkin = "/lovable-uploads/37f256dc-415c-4032-82ad-db63f676284d.png";
const bonesSkin = "/lovable-uploads/660b5122-5ce8-4f6e-af72-2c607d47ef44.png";
const latinLegendSkin = "/lovable-uploads/2c556456-ebeb-4eec-9842-f2d31e06c58a.png";

// Function to get tier icon based on XP
const getTierIcon = (xp: number): string => {
  if (xp >= 10000) return '👑'; // King Chad (Level 10+)
  if (xp >= 9000) return '💪'; // Giga Chad (Level 9)
  if (xp >= 8000) return '👊'; // Chad (Level 8)
  if (xp >= 7000) return '⭐'; // Superstar (Level 7)
  if (xp >= 6000) return '🏆'; // Champ (Level 6)
  if (xp >= 5000) return '🥊'; // Pro (Level 5)
  if (xp >= 4000) return '⚔️'; // Fighter (Level 4)
  if (xp >= 3000) return '🏃'; // Athlete (Level 3)
  if (xp >= 2000) return '✊'; // Sparrer (Level 2)
  if (xp >= 1000) return '🎯'; // Trainee (Level 1)
  return '👤'; // Recruit (Level 0)
};

// Function to render marketplace prices (bid/ask)
const renderMarketplacePrices = (player: any, getMarketplacePrices: (itemId: string, itemType: string) => any, isMobile: boolean, size: 'small' | 'medium' | 'large' = 'medium', onSellClick?: () => void, onBuyClick?: () => void) => {
  const prices = getMarketplacePrices(player.name, 'player');
  const sizeClasses = {
    small: {
      coin: 'w-3 h-3 md:w-4.5 md:h-4.5 md:-ml-1',
      text: 'text-xs md:text-base',
      label: 'text-[10px] md:text-sm'
    },
    medium: {
      coin: 'w-4 h-4 md:w-5 md:h-5 md:-ml-1',
      text: 'text-sm md:text-sm',
      label: 'text-xs md:text-xs'
    },
    large: {
      coin: 'w-5 h-5 md:w-7.5 md:h-7.5 md:-ml-1',
      text: 'text-lg md:text-xl',
      label: 'text-sm md:text-lg'
    }
  };
  const {
    coin,
    text,
    label
  } = sizeClasses[size];
  if (!prices.hasListings || !prices.bestSellPrice && !prices.bestBuyPrice) {
    // Generate mock bid/ask prices when no real listings exist
    const mockSellPrice = Math.round(player.price * 1.15);
    const mockBuyPrice = Math.round(player.price * 0.85);
    
    // Generate mock 24hr change (random between -15% to +15%)
    const mockChange = (Math.random() * 30 - 15);
    const isPositive = mockChange > 0;
    
    return <div className="flex items-center justify-end md:justify-between md:gap-4 rounded-lg p-3 min-w-[140px]">
      <div className="flex flex-col items-end md:flex-row md:items-center md:gap-4">
        <div className="flex items-center gap-1 mb-1 md:mb-0 justify-start">
          <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className={`${coin} flex-shrink-0 mt-1 md:mt-0`} />
          <span className={`${text} font-bold text-foreground mt-1 md:mt-0`}>
            {formatNumberWithAbbreviation(mockSellPrice)}
          </span>
        </div>
        <div className="flex items-center gap-1 justify-start">
          {/* Removed duplicate percentage display - already shown below player name */}
        </div>
      </div>
      
      {isMobile ? <Drawer>
        <DrawerTrigger asChild>
          <Button 
            size="icon"
            variant="ghost" 
            className="h-8 w-8 bg-transparent hover:bg-transparent"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-black/10 backdrop-blur-md border border-white/20 text-white">
          <DrawerHeader>
            <DrawerTitle className="text-center">Trade Options</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8 space-y-2">
            <Button 
              variant="ghost"
              className="w-full justify-center text-green-400 border border-green-400/30 hover:bg-green-400/10"
              onClick={() => onBuyClick?.()}
            >
              Buy
            </Button>
            <Button 
              variant="ghost"
              className="w-full justify-center text-red-400 border border-red-400/30 hover:bg-red-400/10"
              onClick={() => onSellClick?.()}
            >
              Sell
            </Button>
          </div>
        </DrawerContent>
      </Drawer> : <Popover>
        <PopoverTrigger asChild>
          <Button 
            size="icon"
            variant="ghost" 
            className="h-8 w-8 bg-transparent hover:bg-transparent"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-32 bg-black/10 backdrop-blur-md border border-white/20 text-white z-50 p-1" 
          align="center" 
          side="bottom"
          sideOffset={8}
        >
          <div className="flex flex-col gap-1">
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full text-green-400 border-green-400/30 hover:bg-green-400/10 hover:text-green-400 bg-transparent"
              onClick={() => onBuyClick?.()}
            >
              Buy
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full text-red-400 border-red-400/30 hover:bg-red-400/10 hover:text-red-400 bg-transparent"
              onClick={() => onSellClick?.()}
            >
              Sell
            </Button>
          </div>
        </PopoverContent>
      </Popover>}
    </div>;
  }
  return <div className="flex items-start space-x-2">
      <div className="flex items-center space-x-4">
        {prices.bestBuyPrice && <span className={`${label} text-red-400 font-medium cursor-pointer hover:text-red-300 transition-colors`} onClick={() => onSellClick?.()}>
            sell
          </span>}
        {prices.bestSellPrice && <span className={`${label} text-green-400 font-medium cursor-pointer hover:text-green-300 transition-colors`} onClick={() => onBuyClick?.()}>
            buy
          </span>}
      </div>
    </div>;
};
const Game = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("home");
  const [gainersTimeFilter, setGainersTimeFilter] = useState("daily");
  const [trendingTimeFilter, setTrendingTimeFilter] = useState("daily");
  const [rightSidebarTab, setRightSidebarTab] = useState("rankings");
  const [userCoins] = useState(0);
  const [visiblePlayers, setVisiblePlayers] = useState(10);
  const [isPreOrderOpen, setIsPreOrderOpen] = useState(false);
  const [selectedRarity, setSelectedRarity] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [marketplaceCategory, setMarketplaceCategory] = useState("all");
  const [marketplaceRarity, setMarketplaceRarity] = useState("all");
  const [marketplaceSortBy, setMarketplaceSortBy] = useState("highest-price");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [mobilityShaking, setMobilityShaking] = useState(false);
  const [packsShaking, setPacksShaking] = useState(false);
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [objectivesView, setObjectivesView] = useState("daily");
  const [isObjectivesGlowing, setIsObjectivesGlowing] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isRankingsOpen, setIsRankingsOpen] = useState(false);
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const objectivesRef = useRef<HTMLDivElement>(null);
  const fightersCarouselRef = useRef<StoreCarouselRef>(null);
  const accessoriesCarouselRef = useRef<StoreCarouselRef>(null);
  const emotesCarouselRef = useRef<StoreCarouselRef>(null);
  const packsCarouselRef = useRef<StoreCarouselRef>(null);
  const desktopFightersCarouselRef = useRef<StoreCarouselRef>(null);
  const desktopAccessoriesCarouselRef = useRef<StoreCarouselRef>(null);
  const desktopMobilityCarouselRef = useRef<StoreCarouselRef>(null);
  const desktopEmotesCarouselRef = useRef<StoreCarouselRef>(null);
  const desktopPacksCarouselRef = useRef<StoreCarouselRef>(null);
  const {
    toast
  } = useToast();
  const {
    login,
    logout,
    authenticated,
    user
  } = usePrivy();
  const navigate = useNavigate();
  const {
    purchaseItem,
    userBalance
  } = useStore();
  const {
    profile,
    loading,
    createProfile,
    fetchProfile
  } = useProfile();
  const {
    getMarketplacePrices
  } = useMarketplace();

  // Handle mobility shake animation
  const handleMobilityNextClick = () => {
    setMobilityShaking(true);
    setTimeout(() => setMobilityShaking(false), 500);
  };

  // Handle packs shake animation
  const handlePacksNextClick = () => {
    setPacksShaking(true);
    setTimeout(() => setPacksShaking(false), 500);
  };

  // Initialize user balance and profile on login
  useEffect(() => {
    if (authenticated && user?.id && !profile && !loading) {
      console.log('Attempting to create profile for user:', user.id);
      createProfile().catch(error => {
        console.error('Failed to create profile in Game component:', error);
        toast({
          title: "Profile Error",
          description: "Failed to load your profile. Please refresh the page.",
          variant: "destructive"
        });
      });
    }
  }, [authenticated, user?.id, profile, loading, createProfile]);

  // Handle purchase function
  const handlePurchase = async (itemId: string, itemName: string, price: number) => {
    if (!authenticated) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to make purchases.",
        variant: "destructive"
      });
      return;
    }
    const success = await purchaseItem(itemId, itemName, price);
    if (success) {
      toast({
        title: "Purchase successful!",
        description: `You purchased ${itemName} for ${price} coins.`
      });
    }
  };

  // Handle sell click
  const handleSellClick = (player: any) => {
    toast({
      title: "Item not found in locker",
      variant: "destructive",
    });
  };

  // Handle buy with coins click
  const handleBuyWithCoinsClick = () => {
    if (!authenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to purchase with coins",
        action: (
          <Button size="sm" onClick={login}>
            Sign In
          </Button>
        )
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
        action: (
          <Button size="sm" onClick={login}>
            Sign In
          </Button>
        )
      });
      return;
    }
    
    toast({
      title: "Coming Soon",
      description: "Card payments coming soon!",
      duration: 3000
    });
  };

  // Handle buy click
  const handleBuyClick = (player: any) => {
    setSelectedPlayer(player);
    setBuyDialogOpen(true);
  };

  // Mock data for market analytics
  const marketValueData = Array.from({
    length: 30
  }, (_, i) => ({
    day: i + 1,
    value: 125000 + Math.sin(i * 0.3) * 15000 + Math.random() * 10000,
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }));
  const listingsData = Array.from({
    length: 30
  }, (_, i) => ({
    day: i + 1,
    listings: Math.round(450 + Math.cos(i * 0.4) * 50 + Math.random() * 30),
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }));
  const trendingPlayersData = {
    daily: [{
      name: "The Irish King",
      team: "Crimson Hawks",
      position: "Striker",
      price: 4300,
      change: 12.5,
      trend: "up",
      image: "/lovable-uploads/5c3f060f-4c5f-412b-8f27-eb1bebd3dd7d.png"
    }, {
      name: "Jonesy Bones",
      team: "Steel Wolves",
      position: "Tank",
      price: 3800,
      change: -8.3,
      trend: "down",
      image: "/lovable-uploads/660b5122-5ce8-4f6e-af72-2c607d47ef44.png"
    }, {
      name: "Stani Eagle",
      team: "Thunder Birds",
      position: "Speed",
      price: 4700,
      change: 15.7,
      trend: "up",
      image: "/lovable-uploads/37f256dc-415c-4032-82ad-db63f676284d.png"
    }, {
      name: "Latin Legend",
      team: "Mountain Lions",
      position: "Defense",
      price: 3500,
      change: -4.2,
      trend: "down",
      image: "/lovable-uploads/2c556456-ebeb-4eec-9842-f2d31e06c58a.png"
    }, {
      name: "Speed Buggy",
      team: "Flame Dragons",
      position: "Assault",
      price: 4600,
      change: 9.6,
      trend: "up",
      image: "/lovable-uploads/b64d7801-1284-4763-b115-ca3cfa8ff315.png"
    }],
    weekly: [{
      name: "Silverborg",
      team: "Thunder Hawks",
      position: "Speed",
      price: 4700,
      change: 45.2,
      trend: "up",
      image: "/lovable-uploads/fdd396d6-16bd-493f-ba2e-0c27e846ea03.png"
    }, {
      name: "Based Chad",
      team: "Steel Warriors",
      position: "Tank",
      price: 4200,
      change: 38.7,
      trend: "up",
      image: "/lovable-uploads/335b4baf-29e6-4895-a2d4-54e4cee9fae5.png"
    }, {
      name: "Leroy Girthy",
      team: "Fire Eagles",
      position: "Assault",
      price: 3900,
      change: 33.1,
      trend: "up",
      image: "/lovable-uploads/55728a6c-0c6b-4217-82d8-a21b16e912d6.png"
    }, {
      name: "Big Dawg",
      team: "Ice Wolves",
      position: "Control",
      price: 4500,
      change: 29.8,
      trend: "up",
      image: "/lovable-uploads/2532e628-0d4b-465e-b350-e49def10eb26.png"
    }, {
      name: "Zombie Chan",
      team: "Ground Force",
      position: "Heavy",
      price: 3600,
      change: 27.3,
      trend: "up",
      image: "/lovable-uploads/82fe8aed-6cfa-45b6-945c-c447349b7fe2.png"
    }],
    monthly: [{
      name: "DJ Mouse",
      team: "Mega Corps",
      position: "Destroyer",
      price: 4800,
      change: 89.4,
      trend: "up",
      image: "/lovable-uploads/b86689f4-6c8c-4f7f-91f0-c36052c824e6.png"
    }, {
      name: "Alex Toosick",
      team: "Dark Legion",
      position: "Assassin",
      price: 4300,
      change: 76.8,
      trend: "up",
      image: "/lovable-uploads/fa6496ee-f2e7-4af5-8205-7445121d8a6a.png"
    }, {
      name: "Tarragon Southslice",
      team: "Energy Corps",
      position: "Artillery",
      price: 3700,
      change: 69.5,
      trend: "up",
      image: "/lovable-uploads/cf5abf4c-cf7f-49b7-a830-49343c8d1222.png"
    }, {
      name: "Ray Del Maestro",
      team: "Space Raiders",
      position: "Elite",
      price: 4100,
      change: 62.1,
      trend: "up",
      image: "/lovable-uploads/e8b33b1a-410f-4448-9b83-126b8d27f0a9.png"
    }, {
      name: "John Strictland",
      team: "Weather Gods",
      position: "Legendary",
      price: 4900,
      change: 58.7,
      trend: "up",
      image: "/lovable-uploads/98664a07-8365-4512-8f3e-a0c79bd4617c.png"
    }],
    "all time": [{
      name: "Shane Sonny",
      team: "Ultimate Force",
      position: "Champion",
      price: 4600,
      change: 234.7,
      trend: "up",
      image: "/lovable-uploads/a76e21f1-ffca-4130-bd9a-08d09167dca0.png"
    }, {
      name: "Lean Chad",
      team: "Divine Army",
      position: "Mythic",
      price: 3800,
      change: 189.3,
      trend: "up",
      image: "/lovable-uploads/a266b13a-b169-41bf-92db-c75cf3d91c9e.png"
    }, {
      name: "Indi",
      team: "Cosmic Force",
      position: "Godlike",
      price: 4400,
      change: 156.8,
      trend: "up",
      image: "/lovable-uploads/76adb888-cbfd-4b1c-ba39-36303e53c2c0.png"
    }, {
      name: "Kayne Famooser",
      team: "Quantum Lords",
      position: "Transcendent",
      price: 3500,
      change: 142.5,
      trend: "up",
      image: "/lovable-uploads/89c54fc5-22f2-44fd-bbf1-d90a653fdb22.png"
    }, {
      name: "White Base Vest",
      team: "Eternal Guardians",
      position: "Supreme",
      price: 5000,
      change: 198.9,
      trend: "up",
      image: "/lovable-uploads/508d1509-e761-46c6-9f3a-f70e256f5a52.png"
    }]
  };
  const topGainersData = {
    daily: [{
      name: "The Coupé Tank",
      team: "Neon Guardians",
      position: "Stealth",
      price: 5200,
      change: 24.8,
      image: "/lovable-uploads/1c6b707c-97a6-4381-bc54-de63a7cf8a31.png"
    }, {
      name: "Flex",
      team: "Future Force",
      position: "Mobility",
      price: 4800,
      change: 19.3,
      image: "/lovable-uploads/f52e83c2-28b7-417e-90ac-757255d1759f.png"
    }, {
      name: "Pogo",
      team: "Dark Matter",
      position: "Phantom",
      price: 6100,
      change: 17.5,
      image: "/lovable-uploads/2877ff38-b9fd-4a5d-bca9-25b14f237997.png"
    }, {
      name: "Blue Wing Suit",
      team: "Sun Blazers",
      position: "Energy",
      price: 5500,
      change: 16.2,
      image: "/lovable-uploads/1efc1553-007a-4b38-a982-79d9f5abbfa1.png"
    }, {
      name: "Pit Bike",
      team: "Wind Riders",
      position: "Force",
      price: 4900,
      change: 15.9,
      image: "/lovable-uploads/4e2aac54-cac6-4cf1-92ad-76bf7e788077.png"
    }],
    weekly: [{
      name: "Silverborg",
      team: "Thunder Hawks",
      position: "Speed",
      price: 4700,
      change: 45.2,
      image: "/lovable-uploads/fdd396d6-16bd-493f-ba2e-0c27e846ea03.png"
    }, {
      name: "Based Chad",
      team: "Steel Warriors",
      position: "Tank",
      price: 4200,
      change: 38.7,
      image: "/lovable-uploads/335b4baf-29e6-4895-a2d4-54e4cee9fae5.png"
    }, {
      name: "Leroy Girthy",
      team: "Fire Eagles",
      position: "Assault",
      price: 3900,
      change: 33.1,
      image: "/lovable-uploads/55728a6c-0c6b-4217-82d8-a21b16e912d6.png"
    }, {
      name: "Big Dawg",
      team: "Ice Wolves",
      position: "Control",
      price: 4500,
      change: 29.8,
      image: "/lovable-uploads/2532e628-0d4b-465e-b350-e49def10eb26.png"
    }, {
      name: "Zombie Chan",
      team: "Ground Force",
      position: "Heavy",
      price: 3600,
      change: 27.3,
      image: "/lovable-uploads/82fe8aed-6cfa-45b6-945c-c447349b7fe2.png"
    }],
    monthly: [{
      name: "DJ Mouse",
      team: "Mega Corps",
      position: "Destroyer",
      price: 4800,
      change: 89.4,
      image: "/lovable-uploads/b86689f4-6c8c-4f7f-91f0-c36052c824e6.png"
    }, {
      name: "Alex Toosick",
      team: "Dark Legion",
      position: "Assassin",
      price: 4300,
      change: 76.8,
      image: "/lovable-uploads/fa6496ee-f2e7-4af5-8205-7445121d8a6a.png"
    }, {
      name: "Tarragon Southslice",
      team: "Energy Corps",
      position: "Artillery",
      price: 3700,
      change: 69.5,
      image: "/lovable-uploads/cf5abf4c-cf7f-49b7-a830-49343c8d1222.png"
    }, {
      name: "Ray Del Maestro",
      team: "Space Raiders",
      position: "Elite",
      price: 4100,
      change: 62.1,
      image: "/lovable-uploads/e8b33b1a-410f-4448-9b83-126b8d27f0a9.png"
    }, {
      name: "John Strictland",
      team: "Weather Gods",
      position: "Legendary",
      price: 4900,
      change: 58.7,
      image: "/lovable-uploads/98664a07-8365-4512-8f3e-a0c79bd4617c.png"
    }],
    alltime: [{
      name: "Shane Sonny",
      team: "Ultimate Force",
      position: "Champion",
      price: 4600,
      change: 234.7,
      image: "/lovable-uploads/a76e21f1-ffca-4130-bd9a-08d09167dca0.png"
    }, {
      name: "Lean Chad",
      team: "Divine Army",
      position: "Mythic",
      price: 3800,
      change: 189.3,
      image: "/lovable-uploads/a266b13a-b169-41bf-92db-c75cf3d91c9e.png"
    }, {
      name: "Indi",
      team: "Cosmic Force",
      position: "Godlike",
      price: 4400,
      change: 156.8,
      image: "/lovable-uploads/76adb888-cbfd-4b1c-ba39-36303e53c2c0.png"
    }, {
      name: "Kayne Famooser",
      team: "Quantum Lords",
      position: "Transcendent",
      price: 3500,
      change: 142.5,
      image: "/lovable-uploads/89c54fc5-22f2-44fd-bbf1-d90a653fdb22.png"
    }, {
      name: "White Base Vest",
      team: "Eternal Guardians",
      position: "Supreme",
      price: 5000,
      change: 198.9,
      image: "/lovable-uploads/508d1509-e761-46c6-9f3a-f70e256f5a52.png"
    }]
  };
  const topGainers = topGainersData[gainersTimeFilter];
  const trendingPlayers = trendingPlayersData[trendingTimeFilter];
  const allPlayers = [
    // Fighters
    {
      name: "mal.eth",
      team: "Crypto Warriors", 
      position: "Elite",
      itemType: "fighters",
      price: 3200,
      lastSale: 3000,
      trend: "up",
      image: "/lovable-uploads/ccf83582-74cf-469c-87ba-b50ffa5da6de.png"
    }, {
      name: "Tarragon Southslice",
      team: "Energy Corps", 
      position: "Artillery",
      itemType: "fighters",
      price: 2800,
      lastSale: 2650,
      trend: "up",
      image: "/lovable-uploads/cf5abf4c-cf7f-49b7-a830-49343c8d1222.png"
    }, {
      name: "The Irish King", 
      team: "Crimson Hawks",
      position: "Striker", 
      itemType: "fighters",
      price: 2500,
      lastSale: 2300,
      trend: "up",
      image: "/lovable-uploads/5c3f060f-4c5f-412b-8f27-eb1bebd3dd7d.png"
    }, {
      name: "Ray Del Maestro",
      team: "Space Raiders",
      position: "Elite", 
      itemType: "fighters",
      price: 2800,
      lastSale: 2600,
      trend: "up",
      image: "/lovable-uploads/e8b33b1a-410f-4448-9b83-126b8d27f0a9.png"
    }, {
      name: "Jonesy Bones",
      team: "Steel Wolves",
      position: "Tank", 
      itemType: "fighters",
      price: 1900,
      lastSale: 2050,
      trend: "down",
      image: "/lovable-uploads/660b5122-5ce8-4f6e-af72-2c607d47ef44.png"
    }, {
      name: "Protest Sign",
      team: "Future Force",
      position: "Mobility", 
      itemType: "emotes",
      price: 2200,
      lastSale: 2100,
      trend: "up",
      image: "/lovable-uploads/f9ba9551-eabd-4e1f-a2a9-2eeddc92114d.png"
    }, {
      name: "Aura Farm",
      team: "Future Force",
      position: "Mobility", 
      itemType: "emotes",
      price: 1900,
      lastSale: 1850,
      trend: "up",
      image: "/lovable-uploads/74597015-55ed-4190-91df-62af504a7e04.png"
    }, {
      name: "Stani Eagle",
      team: "Thunder Birds",
      position: "Speed", 
      itemType: "fighters",
      price: 1800,
      lastSale: 1650,
      trend: "up",
      image: "/lovable-uploads/37f256dc-415c-4032-82ad-db63f676284d.png"
    }, {
      name: "Screen Smash",
      team: "Future Force",
      position: "Mobility", 
      itemType: "emotes",
      price: 1700,
      lastSale: 1650,
      trend: "up",
      image: "/lovable-uploads/f747341c-eccd-47c4-8290-0451629ec3a4.png"
    }, {
      name: "Latin Legend",
      team: "Mountain Lions",
      position: "Defense", 
      itemType: "fighters",
      price: 1200,
      lastSale: 1400,
      trend: "down",
      image: "/lovable-uploads/2c556456-ebeb-4eec-9842-f2d31e06c58a.png"
    }, {
      name: "Shane Sonny",
      team: "Ultimate Force",
      position: "Champion", 
      itemType: "fighters",
      price: 950,
      lastSale: 1100,
      trend: "down",
      image: "/lovable-uploads/a76e21f1-ffca-4130-bd9a-08d09167dca0.png"
    }, {
      name: "Dumbbell Singer",
      team: "Future Force",
      position: "Mobility", 
      itemType: "emotes",
      price: 1200,
      lastSale: 1150,
      trend: "up",
      image: "/lovable-uploads/2c2096de-f308-4a16-865b-31c36a14a080.png"
    }, {
      name: "BMF Shorts",
      team: "Gear Masters",
      position: "Supreme", 
      itemType: "accessories",
      price: 1200,
      lastSale: 1150,
      trend: "up",
      image: "/lovable-uploads/6ffd60e7-d39b-442f-a71c-9ae2f491846f.png"
    }, {
      name: "John Strictland",
      team: "Weather Gods",
      position: "Legendary", 
      itemType: "fighters",
      price: 1000,
      lastSale: 950,
      trend: "up",
      image: "/lovable-uploads/98664a07-8365-4512-8f3e-a0c79bd4617c.png"
    }, {
      name: "DHB x LCS shorts",
      team: "Gear Masters",
      position: "Supreme", 
      itemType: "accessories",
      price: 850,
      lastSale: 950,
      trend: "down",
      image: "/lovable-uploads/e21fe8d7-5519-4b7b-bd90-6b96e74635d4.png"
    }, {
      name: "Combat Vest",
      team: "Gear Masters",
      position: "Supreme", 
      itemType: "accessories",
      price: 750,
      lastSale: 850,
      trend: "down",
      image: "/lovable-uploads/8c7fd9f1-1128-4d45-b089-e8879cb0fa98.png"
    }, {
      name: "Rapz Gloves",
      team: "Gear Masters",
      position: "Supreme", 
      itemType: "accessories",
      price: 800,
      lastSale: 780,
      trend: "up",
      image: "/lovable-uploads/9320a71d-c3b8-4922-938c-5e759907fcf6.png"
    },
    // Vehicles  
    {
      name: "Pogo",
      team: "Dark Matter",
      position: "Phantom", 
      itemType: "mobility",
      price: 8000,
      lastSale: 7500,
      trend: "up",
      image: "/lovable-uploads/2877ff38-b9fd-4a5d-bca9-25b14f237997.png"
    }, {
      name: "The Coupé Tank",
      team: "Neon Guardians",
      position: "Stealth", 
      itemType: "mobility",
      price: 5000,
      lastSale: 4800,
      trend: "up",
      image: "/lovable-uploads/1c6b707c-97a6-4381-bc54-de63a7cf8a31.png"
    }, {
      name: "Pit Bike", 
      team: "Wind Riders",
      position: "Force", 
      itemType: "mobility",
      price: 4500,
      lastSale: 4200,
      trend: "up",
      image: "/lovable-uploads/4e2aac54-cac6-4cf1-92ad-76bf7e788077.png"
    }, {
      name: "Speed Buggy",
      team: "Flame Dragons",
      position: "Assault", 
      itemType: "mobility", 
      price: 3200,
      lastSale: 3000,
      trend: "up",
      image: "/lovable-uploads/b64d7801-1284-4763-b115-ca3cfa8ff315.png"
    },
    // Emotes
    {
      name: "Squeaky Dance",
      team: "Future Force",
      position: "Mobility", 
      itemType: "emotes",
      price: 2500,
      lastSale: 2300,
      trend: "up",
      image: "/lovable-uploads/5c8c027e-3baf-4550-96a9-ba0715d11506.png"
    }, {
      name: "Fists Up",
      team: "Future Force",
      position: "Mobility", 
      itemType: "emotes",
      price: 1800,
      lastSale: 1650,
      trend: "up",
      image: "/lovable-uploads/370bd874-ad5c-467d-b844-55688b1a0f9a.png"
    }, {
      name: "u want sum?",
      team: "Future Force",
      position: "Mobility", 
      itemType: "emotes",
      price: 1500,
      lastSale: 1400,
      trend: "up",
      image: "/lovable-uploads/30d419b4-79a9-459c-b37b-42099ffd6273.png"
    }, {
      name: "Flex",
      team: "Future Force",
      position: "Mobility", 
      itemType: "emotes",
      price: 800,
      lastSale: 750,
      trend: "up",
      image: "/lovable-uploads/f52e83c2-28b7-417e-90ac-757255d1759f.png"
    },
    // Packs
    {
      name: "Wild West Pack",
      team: "Pack Masters",
      position: "Supreme", 
      itemType: "packs",
      price: 5000,
      lastSale: 4800,
      trend: "up",
      image: "/lovable-uploads/5cf8ad93-f292-4e4c-b53c-eb0c4bc0f7be.png"
    }, {
      name: "EO Summer Pack",
      team: "Pack Masters",
      position: "Supreme", 
      itemType: "packs",
      price: 3500,
      lastSale: 3300,
      trend: "up",
      image: "/lovable-uploads/2149e9ad-919f-49ea-8be4-90f190387d39.png"
    }, {
      name: "Gold Pack",
      team: "Pack Masters",
      position: "Supreme", 
      itemType: "packs",
      price: 2000,
      lastSale: 1900,
      trend: "up",
      image: "/lovable-uploads/291c5734-f144-47b0-9f49-915999e921b0.png"
    }, {
      name: "Silver Pack",
      team: "Pack Masters",
      position: "Supreme", 
      itemType: "packs",
      price: 1000,
      lastSale: 950,
      trend: "up",
      image: "/lovable-uploads/17c3a939-bcaa-4cdb-9b61-271b5774c7e2.png"
    },
    // Accessories
    {
      name: "White Base Vest",
      team: "Gear Masters",
      position: "Supreme", 
      itemType: "accessory",
      price: 750,
      lastSale: 700,
      trend: "up",
      image: "/lovable-uploads/508d1509-e761-46c6-9f3a-f70e256f5a52.png"
    }, {
      name: "Red Wing Suit",
      team: "Gear Masters",
      position: "Supreme", 
      itemType: "accessory",
      price: 600,
      lastSale: 580,
      trend: "up",
      image: "/lovable-uploads/2eec4a9a-97d3-4ba4-9508-2eeef0011139.png"
    }, {
      name: "Grey Base Vest",
      team: "Gear Masters",
      position: "Supreme", 
      itemType: "accessory",
      price: 550,
      lastSale: 520,
      trend: "up",
      image: "/lovable-uploads/91375d1a-e829-4716-b3b6-833b58355bd9.png"
    }, {
      name: "Blue Wing Suit",
      team: "Gear Masters",
      position: "Supreme", 
      itemType: "accessory",
      price: 450,
      lastSale: 430,
      trend: "up",
      image: "/lovable-uploads/1efc1553-007a-4b38-a982-79d9f5abbfa1.png"
    }
  ].sort((a, b) => b.price - a.price);
  const currentMarketValue = marketValueData[marketValueData.length - 1]?.value || 0;
  const currentListings = Math.round(listingsData[listingsData.length - 1]?.listings || 0);

  // Filter function for store items
  const filterItemsByRarity = (items: any[]) => {
    if (selectedRarity === "all") return items;
    return items.filter(item => item.rarity === selectedRarity);
  };

  // Filter marketplace players
  const filterMarketplaceByCategory = (players: any[], category: string) => {
    if (category === "all") return players;
    return players.filter(player => player.itemType === category);
  };
  const filterMarketplaceByRarity = (players: any[], rarity: string) => {
    if (rarity === "all") return players;
    // Since we don't have rarity data for players, we'll mock it based on price ranges for now
    if (rarity === "green") return players.filter(player => player.price <= 5000);
    if (rarity === "blue") return players.filter(player => player.price > 5000 && player.price <= 7000);
    if (rarity === "silver") return players.filter(player => player.price > 7000 && player.price <= 9000);
    if (rarity === "gold") return players.filter(player => player.price > 9000 && player.price <= 12000);
    if (rarity === "special") return players.filter(player => player.price > 12000);
    return players;
  };
  const filterMarketplaceBySearch = (players: any[], search: string) => {
    if (!search.trim()) return players;
    const searchLower = search.toLowerCase();
    return players.filter(player => player.name.toLowerCase().includes(searchLower) || player.team.toLowerCase().includes(searchLower) || player.position.toLowerCase().includes(searchLower));
  };
  const sortMarketplacePlayers = (players: any[], sortBy: string) => {
    const sorted = [...players];
    
    switch (sortBy) {
      case "highest-price":
        return sorted.sort((a, b) => b.price - a.price);
      case "lowest-price":
        return sorted.sort((a, b) => a.price - b.price);
      case "highest-gain":
        return sorted.sort((a, b) => {
          const aGain = ((a.price - a.lastSale) / a.lastSale) * 100;
          const bGain = ((b.price - b.lastSale) / b.lastSale) * 100;
          return bGain - aGain;
        });
      case "highest-loss":
        // Filter to only show losses (negative percentage changes), then sort by largest losses first
        const lossesOnly = sorted.filter(player => {
          const percentChange = ((player.price - player.lastSale) / player.lastSale) * 100;
          return percentChange < 0; // Only include actual losses
        });
        return lossesOnly.sort((a, b) => {
          const aLoss = ((a.price - a.lastSale) / a.lastSale) * 100;
          const bLoss = ((b.price - b.lastSale) / b.lastSale) * 100;
          // Sort by most negative (largest losses first)
          return aLoss - bLoss;
        });
      default:
        return sorted;
    }
  };
  
  const filteredAndSortedMarketplacePlayers = sortMarketplacePlayers(
    filterMarketplaceBySearch(
      filterMarketplaceByRarity(
        filterMarketplaceByCategory(allPlayers, marketplaceCategory), 
        marketplaceRarity
      ), 
      searchTerm
    ), 
    marketplaceSortBy
  );

  // Debug logging for activeTab changes
  console.log('Current activeTab:', activeTab);
  const handleTabClick = (tabId: string) => {
    console.log('Tab clicked:', tabId);
    console.log('Current activeTab before:', activeTab);
    if (tabId === "lobby") {
      setIsPreOrderOpen(true);
    } else {
      setActiveTab(tabId);
      console.log('Setting activeTab to:', tabId);

      // Reset scroll position to top when switching tabs
      setTimeout(() => {
        // Reset main window scroll
        window.scrollTo(0, 0);

        // Reset mobile/tablet scroll containers
        const mobileScrollContainers = document.querySelectorAll('.overflow-y-auto');
        mobileScrollContainers.forEach(container => {
          container.scrollTop = 0;
        });

        // Reset desktop ScrollArea containers
        const scrollAreas = document.querySelectorAll('[data-radix-scroll-area-viewport]');
        scrollAreas.forEach(viewport => {
          viewport.scrollTop = 0;
        });
      }, 50);
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
    icon: Handshake
  }, {
    id: "locker",
    label: "Locker",
    icon: Archive
  }, {
    id: "lobby",
    label: "Lobby",
    icon: Gamepad
  }, {
    id: "coins",
    label: "Coins",
    icon: Coins
  }];
  return <div className="min-h-screen bg-black text-foreground dark">
      {/* Mobile/Tablet optimized layout */}
      
      {/* Header with coins and avatar - simplified for mobile */}
      <header className="bg-black lg:border-b border-border px-4 py-3 lg:px-6 lg:py-4">
        <div className="flex items-center justify-between">
          <img src="/lovable-uploads/fa645b0b-fcbe-46f6-9054-45d5ab0929d6.png" alt="LCS Fist Logo" className="h-10 lg:h-12 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate("/")} />
          
          {/* Desktop Navigation - hidden on mobile */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <nav className="flex items-center justify-center space-x-6 ml-24">
             {tabItems.filter(tab => tab.id !== "coins").map(tab => <button key={tab.id} onClick={() => handleTabClick(tab.id)} className={`relative flex items-center justify-center px-3 py-2 text-sm font-medium transition-all duration-300 ${activeTab === tab.id ? "text-foreground after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-100 after:transition-transform after:duration-300" : "text-muted-foreground hover:text-foreground after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"}`}>
                <tab.icon className="w-8 h-8" />
              </button>)}
            </nav>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Mobile Notifications and Rankings Icons - Only show on mobile/tablet */}
            <div className="flex items-center space-x-2 lg:hidden">
              <button onClick={() => setIsRankingsOpen(true)} className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                <Medal className="w-6 h-6 text-muted-foreground hover:text-foreground" />
              </button>
              <button onClick={() => setIsNotificationsOpen(true)} className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                <Bell className="w-6 h-6 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            
            {isMobile ? (
              <Sheet>
                <SheetTrigger asChild>
                  <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
                    <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-8 h-8" />
                    <span className="font-semibold text-sm lg:text-base">{userCoins.toLocaleString()}</span>
                  </div>
                </SheetTrigger>
                <SheetContent side="bottom" className="bg-black/10 backdrop-blur-md border border-white/20 text-white">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white text-center mb-4">Buy Coins</h3>
                    
                    <div className="flex flex-col space-y-3">
                      <Button
                        className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 hover:text-white transition-all duration-300 px-8 py-4 h-12"
                        onClick={() => {
                          if (!authenticated) {
                            login();
                          } else {
                            toast({
                              title: "Coming Soon!",
                            });
                          }
                        }}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Buy with card
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 hover:text-white transition-all duration-300 px-8 py-4 h-12"
                        onClick={() => {
                          if (!authenticated) {
                            login();
                          } else {
                            toast({
                              title: "Coming Soon!",
                            });
                          }
                        }}
                      >
                        <Wallet className="w-4 h-4 mr-2" />
                        Buy with crypto
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
                    <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-8 h-8" />
                    <span className="font-semibold text-sm lg:text-base">{userCoins.toLocaleString()}</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-40 bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden z-50">
                  {/* Liquid glass metallic background effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10" />
                  <div className="absolute inset-0" style={{
                    backgroundImage: `
                      linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
                      linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
                    `,
                    backgroundSize: '4px 4px'
                  }} />
                  
                  <div className="relative z-10">
                    <DropdownMenuItem 
                      onClick={() => {
                        if (!authenticated) {
                          login();
                        } else {
                          toast({
                            title: "Coming Soon!",
                          });
                        }
                      }} 
                      className="flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 hover:text-white transition-all duration-300"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Buy with card</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      onClick={() => {
                        if (!authenticated) {
                          login();
                        } else {
                          toast({
                            title: "Coming Soon!",
                          });
                        }
                      }} 
                      className="flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 hover:text-white transition-all duration-300"
                    >
                      <Wallet className="w-4 h-4" />
                      <span>Buy with crypto</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {authenticated ? (
              isMobile ? (
                <Sheet>
                  <SheetTrigger asChild>
                    <Avatar className="w-7 h-7 lg:w-8 lg:h-8 cursor-pointer">
                      <AvatarFallback className="text-lg">
                        {profile?.avatar_url || getTierIcon(userBalance.xp)}
                      </AvatarFallback>
                    </Avatar>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl backdrop-blur-md rounded-t-xl">
                    <div className="relative">
                      {/* Liquid glass metallic background effects */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
                      <div className="absolute inset-0" style={{
                        backgroundImage: `
                          linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
                          linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
                        `,
                        backgroundSize: '4px 4px'
                      }} />
                      
                      <div className="relative z-10 p-4">
                        <div className="mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">
                              {profile?.avatar_url || '👤'}
                            </div>
                             <div className="flex flex-col space-y-1">
                               <p className="text-sm font-medium leading-none text-white">
                                 {loading ? "Loading profile..." : profile?.username || 'Profile Error'}
                               </p>
                               <p className="text-xs leading-none text-gray-200">
                                 {user?.email?.address}
                               </p>
                             </div>
                          </div>
                        </div>
                        <div className="mb-4 border-t border-white/20 pt-4">
                          <ProgressBar xp={userBalance?.xp || 0} />
                        </div>
                        <div className="mb-4 border-t border-white/20 pt-4">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">
                              <img src="/lovable-uploads/fe5d4ef8-a585-4160-86a0-ab4fe59293d2.png" alt="Coin" className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-white">Coin Balance</span>
                              <span className="text-xs text-gray-200">0</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={logout} 
                          variant="outline" 
                          className="w-full bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white transition-all duration-300"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="w-7 h-7 lg:w-8 lg:h-8 cursor-pointer">
                      <AvatarFallback className="text-lg">
                        {profile?.avatar_url || getTierIcon(userBalance.xp)}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden backdrop-blur-md z-50">
                    {/* Liquid glass metallic background effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
                    <div className="absolute inset-0" style={{
                      backgroundImage: `
                        linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
                        linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
                      `,
                      backgroundSize: '4px 4px'
                    }} />
                    
                    <div className="relative z-10">
                      <div className="px-3 py-2">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">
                            {profile?.avatar_url || '👤'}
                          </div>
                           <div className="flex flex-col space-y-1">
                             <p className="text-sm font-medium leading-none text-white">
                               {loading ? "Loading profile..." : profile?.username || 'Profile Error'}
                             </p>
                             <p className="text-xs leading-none text-gray-200">
                               {user?.email?.address}
                             </p>
                           </div>
                        </div>
                      </div>
                       <div className="px-3 py-2 border-t border-white/20">
                         <ProgressBar xp={userBalance?.xp || 0} />
                       </div>
                       <div className="px-3 py-2 border-t border-white/20">
                         <div className="flex items-center space-x-3">
                           <div className="text-2xl">
                             <img src="/lovable-uploads/fe5d4ef8-a585-4160-86a0-ab4fe59293d2.png" alt="Coin" className="w-6 h-6" />
                           </div>
                           <div className="flex flex-col">
                             <span className="text-sm font-medium text-white">Coin Balance</span>
                             <span className="text-xs text-gray-200">0</span>
                           </div>
                         </div>
                       </div>
                      
                      <DropdownMenuSeparator className="bg-white/20" />
                      
                      <DropdownMenuItem onClick={logout} className="flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 hover:text-white transition-all duration-300">
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              )
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
        <div className="lg:hidden overflow-y-auto max-h-[calc(100vh-140px)] pb-2">
            {activeTab === "home" && <>
                {/* Hero Card - Portrait oriented for mobile */}
                <div className="p-4">
                  <Card className="bg-gradient-to-b from-blue-600/90 to-purple-700/90 text-white border-0 relative overflow-hidden h-96">
                    <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
                backgroundImage: 'url(/lovable-uploads/8090c672-9fc6-4634-ad28-0629a1a7f181.png)'
              }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    <CardContent className="p-6 h-full flex flex-col justify-end relative z-10">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Welcome to LCS</h2>
                        <div className="flex space-x-3">
                          <Button variant="secondary" size="default" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300" onClick={() => navigate('/docs')}>
                            <Info className="w-4 h-4 mr-2" />
                            How to play
                          </Button>
                          <Button variant="secondary" size="default" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300" onClick={() => setIsPreOrderOpen(true)}>
                            <Play className="w-4 h-4 mr-2" />
                            Play now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Progress Card - Mobile with Popover */}
                <div className="px-4 pb-4">
                  <div className="relative">
                    {/* Mobile/Tablet: Drawer, Desktop: HoverCard */}
                    {isMobile ? <Drawer>
                        <DrawerTrigger asChild>
                          <Card className="bg-black border-gray-700 cursor-pointer hover:border-gray-600 transition-colors">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-base">{profile?.avatar_url || '👤'}</span>
                                  <span>Progress</span>
                                </div>
                                <Info className="w-4 h-4 text-muted-foreground" />
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
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
                          </Card>
                        </DrawerTrigger>
                        <DrawerContent className="bg-black/20 backdrop-blur-xl border-white/10">
                          <DrawerHeader>
                             <DrawerTitle className="text-white text-center">XP Progress Levels</DrawerTitle>
                          </DrawerHeader>
                          <div className="px-4 pb-4">
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                              {getAllLevelsForDisplay().map((level, index) => {
                        const isCurrentLevel = getCurrentLevel(userBalance?.xp || 0).name === level.name;
                        const isUnlocked = (userBalance?.xp || 0) >= level.minXp;
                        return <div key={index} className={`flex items-center justify-between p-2 rounded-md transition-colors ${isCurrentLevel ? 'bg-primary/20 border border-primary/30' : isUnlocked ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-800/50 opacity-60'}`}>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-base">{getTierIcon(level.minXp)}</span>
                                      <span className="text-sm font-medium text-white">{level.name}</span>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                      {level.level >= 10 ? "10,000+ XP" : `${level.minXp.toLocaleString()}-${level.maxXp.toLocaleString()} XP`}
                                    </span>
                                  </div>;
                      })}
                            </div>
                          </div>
                        </DrawerContent>
                      </Drawer> : <HoverCard>
                        <HoverCardTrigger asChild>
                          <Card className="bg-black border-gray-700 cursor-pointer hover:border-gray-600 transition-colors">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-base">{profile?.avatar_url || '👤'}</span>
                                  <span>Progress</span>
                                </div>
                                <Info className="w-4 h-4 text-muted-foreground" />
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
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
                          </Card>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 p-4 bg-black/90 backdrop-blur-md border border-white/20 text-white z-50" side="top" align="center">
                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm">XP Progress Levels</h4>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                              {getAllLevelsForDisplay().map((level, index) => {
                        const isCurrentLevel = getCurrentLevel(userBalance?.xp || 0).name === level.name;
                        const isUnlocked = (userBalance?.xp || 0) >= level.minXp;
                        return <div key={index} className={`flex items-center justify-between p-2 rounded-md transition-colors ${isCurrentLevel ? 'bg-primary/20 border border-primary/30' : isUnlocked ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-800/50 opacity-60'}`}>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-base">{getTierIcon(level.minXp)}</span>
                                      <span className="text-sm font-medium">{level.name}</span>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                      {level.level >= 10 ? "10,000+ XP" : `${level.minXp.toLocaleString()}-${level.maxXp.toLocaleString()} XP`}
                                    </span>
                                  </div>;
                      })}
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>}
                  </div>
                </div>

                {/* Action Cards Grid - 2 columns on mobile */}
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <GlowCard className="cursor-pointer">
                      <CardContent className="p-4 flex flex-col h-full">
                        <div className="flex items-center space-x-1 mb-2">
                          <Trophy className="w-4 h-4 text-white" />
                          <span className="text-xs font-medium text-white">Quests!</span>
                        </div>
                        <h3 className="text-sm font-bold mb-1">Smash that XP</h3>
                        <p className="text-gray-300 text-xs mb-3 flex-1">by completing all quests</p>
                        <Button variant="secondary" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 text-xs h-7 relative z-10 transition-all duration-300" onClick={() => {
                    setObjectivesView("quests");
                    setTimeout(() => {
                      objectivesRef.current?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }, 100);
                  }}>
                          Show Quests
                        </Button>
                      </CardContent>
                    </GlowCard>

                    <GlowCard className="cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-1 mb-2">
                          <Gift className="w-4 h-4" />
                          <span className="text-xs font-medium">Packs</span>
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
                        {isMobile ? <Drawer>
                            <DrawerTrigger asChild>
                              <Button variant="secondary" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 text-xs h-7 relative z-10 transition-all duration-300 w-full">
                                Buy Now
                              </Button>
                            </DrawerTrigger>
                            <DrawerContent className="bg-black/10 backdrop-blur-md border-t border-white/20 text-white transition-all duration-300">
                              <DrawerHeader>
                                <DrawerTitle className="text-white text-center">Purchase Pack</DrawerTitle>
                              </DrawerHeader>
                              <div className="p-4 space-y-3">
                                <Button className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20" onClick={handleBuyWithCoinsClick}>
                                  <Coins className="mr-2 h-4 w-4" />
                                  Buy With Coins
                                </Button>
                                <Button className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20" onClick={handleBuyWithCardClick}>
                                  <CreditCard className="mr-2 h-4 w-4" />
                                  Buy with Card
                                </Button>
                                <DrawerClose asChild>
                                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white">
                                    Cancel
                                  </Button>
                                </DrawerClose>
                              </div>
                            </DrawerContent>
                          </Drawer> : <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="secondary" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 text-xs h-7 relative z-10 transition-all duration-300 w-full">
                                Buy Now
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center" className="w-full bg-black/10 backdrop-blur-md border border-white/20 text-white z-50">
                              <DropdownMenuItem onClick={handleBuyWithCoinsClick} className="flex items-center space-x-2 cursor-pointer text-white hover:bg-gradient-to-br hover:from-gray-800/30 hover:via-black/20 hover:to-gray-900/40 hover:backdrop-blur-md transition-all duration-300">
                                <Coins className="w-4 h-4" />
                                <span>Buy With Coins</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={handleBuyWithCardClick} className="flex items-center space-x-2 cursor-pointer text-white hover:bg-gradient-to-br hover:from-gray-800/30 hover:via-black/20 hover:to-gray-900/40 hover:backdrop-blur-md transition-all duration-300">
                                <CreditCard className="w-4 h-4" />
                                <span>Buy with Card</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>}
                      </CardContent>
                    </GlowCard>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-1 gap-3">
                    <GlowCard className="cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center text-center space-y-3 mb-3">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm text-white">Build your roster</h3>
                            <p className="text-xs text-gray-300">Build your dream team</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300" onClick={() => setActiveTab("store")}>
                          Start Building
                        </Button>
                      </CardContent>
                    </GlowCard>

                    <GlowCard className="cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center text-center space-y-3 mb-3">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <CreditCard className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm text-white">Transfer Market</h3>
                            <p className="text-xs text-gray-300">Buy & sell fighters</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300" onClick={() => setActiveTab("market")}>
                          Browse Market
                        </Button>
                      </CardContent>
                    </GlowCard>
                  </div>
                </div>

                {/* Objectives - Collapsible on mobile */}
                <div className="px-4 pb-4" ref={objectivesRef}>
                  <Card className="bg-black border-gray-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4" />
                           <span>{objectivesView === "weekly" ? "Weekly Objectives" : objectivesView === "daily" ? "Daily Objectives" : "Quests"}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-white/10" onClick={() => {
                    if (objectivesView === "weekly") {
                      setObjectivesView("daily");
                    } else if (objectivesView === "daily") {
                      setObjectivesView("quests");
                    } else {
                      setObjectivesView("weekly");
                    }
                  }}>
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                {objectivesView === "weekly" ? <div className="space-y-3">
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
                  </div> : objectivesView === "daily" ? <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <Play className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Play 1 game</p>
                          <p className="text-xs text-muted-foreground">0/1 • 5 XP</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                          <Gamepad className="w-4 h-4 text-secondary-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Play 2 games</p>
                          <p className="text-xs text-muted-foreground">0/2 • 8 XP</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-destructive rounded-full flex items-center justify-center">
                          <Play className="w-4 h-4 text-destructive-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Play 3 games</p>
                          <p className="text-xs text-muted-foreground">0/3 • 12 XP</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Trophy className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Win 1 game</p>
                          <p className="text-xs text-muted-foreground">0/1 • 15 XP</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Play with 1 friend</p>
                          <p className="text-xs text-muted-foreground">0/1 • 10 XP</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div> : <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                          <X className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Connect X</p>
                          <p className="text-xs text-muted-foreground">0/1 • 25 XP</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                          <Instagram className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Connect Instagram</p>
                          <p className="text-xs text-muted-foreground">0/1 • 25 XP</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-sky-600 rounded-full flex items-center justify-center">
                          <UserPlus className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Follow X</p>
                          <p className="text-xs text-muted-foreground">0/1 • 15 XP</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">
                          <UserPlus className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Follow Instagram</p>
                          <p className="text-xs text-muted-foreground">0/1 • 15 XP</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                          <Star className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Post about $LCS</p>
                          <p className="text-xs text-muted-foreground">0/1 • 50 XP</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>}
                    </CardContent>
                  </Card>
                </div>
              </>}

            {activeTab === "store" && <div className="p-4 space-y-6">
                {/* Store Header */}
                <div className="text-center relative sticky top-0 z-50 bg-gradient-to-b from-black via-black/70 to-black/40 backdrop-blur-md py-1">
                  {/* Category Filter - positioned in top left */}
                  <div className="absolute top-0 left-0">
                    {isMobile ? <Drawer>
                        <DrawerTrigger asChild>
                           <Button variant="ghost" size="default" className="text-white hover:bg-white/10 w-18 h-18">
                            <Layers className="w-7 h-7" />
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent className="bg-black/10 backdrop-blur-md border border-white/20 text-white">
                          <DrawerHeader>
                             <DrawerTitle className="text-center">Filter by Category</DrawerTitle>
                          </DrawerHeader>
                          <div className="px-4 pb-8 space-y-2">
                            <Button variant="ghost" onClick={() => setSelectedCategory("all")} className={`w-full justify-start text-white hover:bg-white/10 ${selectedCategory === "all" ? "bg-white/20" : ""}`}>
                              ⚫ All
                            </Button>
                            <Button variant="ghost" onClick={() => setSelectedCategory("skins")} className={`w-full justify-start text-white hover:bg-white/10 ${selectedCategory === "skins" ? "bg-white/20" : ""}`}>
                              👊 Fighters
                            </Button>
                            <Button variant="ghost" onClick={() => setSelectedCategory("accessories")} className={`w-full justify-start text-white hover:bg-white/10 ${selectedCategory === "accessories" ? "bg-white/20" : ""}`}>
                              💎 Accessories
                            </Button>
                            <Button variant="ghost" onClick={() => setSelectedCategory("mobility")} className={`w-full justify-start text-white hover:bg-white/10 ${selectedCategory === "mobility" ? "bg-white/20" : ""}`}>
                              🚗 Mobility
                            </Button>
                            <Button variant="ghost" onClick={() => setSelectedCategory("emotes")} className={`w-full justify-start text-white hover:bg-white/10 ${selectedCategory === "emotes" ? "bg-white/20" : ""}`}>
                              💃 Emotes
                            </Button>
                            <Button variant="ghost" onClick={() => setSelectedCategory("packs")} className={`w-full justify-start text-white hover:bg-white/10 ${selectedCategory === "packs" ? "bg-white/20" : ""}`}>
                              🎁 Packs
                            </Button>
                          </div>
                        </DrawerContent>
                      </Drawer> : <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="default" className="text-white hover:bg-white/10 w-18 h-18">
                             <Layers className="w-7 h-7" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="w-32 bg-black/10 backdrop-blur-md border border-white/20 text-white z-50">
                          <DropdownMenuItem onClick={() => setSelectedCategory("all")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${selectedCategory === "all" ? "bg-white/20" : ""}`}>
                            <span>⚫ All</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedCategory("skins")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${selectedCategory === "skins" ? "bg-white/20" : ""}`}>
                            <span>👊 Fighters</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedCategory("accessories")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${selectedCategory === "accessories" ? "bg-white/20" : ""}`}>
                            <span>💎 Accessories</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedCategory("mobility")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${selectedCategory === "mobility" ? "bg-white/20" : ""}`}>
                            <span>🚗 Mobility</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedCategory("emotes")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${selectedCategory === "emotes" ? "bg-white/20" : ""}`}>
                            <span>💃 Emotes</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedCategory("packs")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${selectedCategory === "packs" ? "bg-white/20" : ""}`}>
                            <span>🎁 Packs</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>}
                  </div>
                  
                  <div className="flex items-center justify-center space-x-3 mb-4">
                     <div>
                       <h1 className="text-2xl font-bold">Fresh Drops</h1>
                     </div>
                  </div>
                  
                  {/* Filter Dropdown - positioned in top right */}
                  <div className="absolute top-0 right-0">
                    {isMobile ? <Drawer>
                        <DrawerTrigger asChild>
                           <Button variant="ghost" size="default" className="w-18 h-18 text-white hover:bg-white/10">
                             <Filter className="w-7 h-7" />
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent className="bg-black/10 backdrop-blur-md border border-white/20 text-white">
                          <DrawerHeader>
                             <DrawerTitle className="text-center">Filter by Rarity</DrawerTitle>
                          </DrawerHeader>
                          <div className="px-4 pb-8 space-y-2">
                            <Button variant="ghost" onClick={() => setSelectedRarity("all")} className={`w-full justify-start text-white hover:bg-white/10 ${selectedRarity === "all" ? "bg-white/20" : ""}`}>
                              <div className="w-3 h-3 rounded-full bg-black mr-2" />
                              All Rarities
                            </Button>
                            <Button variant="ghost" onClick={() => setSelectedRarity("green")} className={`w-full justify-start text-white hover:bg-white/10 ${selectedRarity === "green" ? "bg-white/20" : ""}`}>
                              <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                              Regular
                            </Button>
                            <Button variant="ghost" onClick={() => setSelectedRarity("blue")} className={`w-full justify-start text-white hover:bg-white/10 ${selectedRarity === "blue" ? "bg-white/20" : ""}`}>
                              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                              Rare
                            </Button>
                            <Button variant="ghost" onClick={() => setSelectedRarity("silver")} className={`w-full justify-start text-white hover:bg-white/10 ${selectedRarity === "silver" ? "bg-white/20" : ""}`}>
                              <div className="w-3 h-3 rounded-full bg-gray-300 mr-2" />
                              Legendary
                            </Button>
                            <Button variant="ghost" onClick={() => setSelectedRarity("gold")} className={`w-full justify-start text-white hover:bg-white/10 ${selectedRarity === "gold" ? "bg-white/20" : ""}`}>
                              <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2" />
                              Mythical
                            </Button>
                            <Button variant="ghost" onClick={() => setSelectedRarity("special")} className={`w-full justify-start text-white hover:bg-white/10 ${selectedRarity === "special" ? "bg-white/20" : ""}`}>
                              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 mr-2" />
                              Special
                            </Button>
                          </div>
                        </DrawerContent>
                      </Drawer> : <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="default" className="w-18 h-18 text-white hover:bg-white/10">
                             <Filter className="w-7 h-7" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="w-32 bg-black/10 backdrop-blur-md border border-white/20 text-white z-50">
                          <DropdownMenuItem onClick={() => setSelectedRarity("all")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${selectedRarity === "all" ? "bg-white/20" : ""}`}>
                            <div className="w-3 h-3 rounded-full bg-black" />
                            <span>All Rarities</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedRarity("green")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${selectedRarity === "green" ? "bg-white/20" : ""}`}>
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span>Regular</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedRarity("blue")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${selectedRarity === "blue" ? "bg-white/20" : ""}`}>
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span>Rare</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedRarity("silver")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${selectedRarity === "silver" ? "bg-white/20" : ""}`}>
                            <div className="w-3 h-3 rounded-full bg-gray-300" />
                            <span>Legendary</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedRarity("gold")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${selectedRarity === "gold" ? "bg-white/20" : ""}`}>
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <span>Mythical</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedRarity("special")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${selectedRarity === "special" ? "bg-white/20" : ""}`}>
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400" />
                            <span>Special</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>}
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-4">
                  {/* Fighters Category */}
                  {(selectedCategory === "all" || selectedCategory === "skins") && <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
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
                        <span>Fighters</span>
                        <div className="flex items-center space-x-3">
                          {/* Navigation arrows for carousel - only show when more than 4 items */}
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10" onClick={() => {
                        fightersCarouselRef.current?.scrollToPrevious();
                      }}>
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10" onClick={() => {
                        fightersCarouselRef.current?.scrollToNext();
                      }}>
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                         </div>
                        </div>
                      </CardTitle>
                      
                    </CardHeader>
                    <CardContent>
                        <StoreCarousel ref={fightersCarouselRef} items={filterItemsByRarity([{
                  name: "Shane Sonny",
                  price: 1200,
                  rarity: "special",
                  image: "/lovable-uploads/a76e21f1-ffca-4130-bd9a-08d09167dca0.png"
                }, {
                  name: "Ray Del Maestro",
                  price: 2800,
                  rarity: "blue",
                  image: "/lovable-uploads/e8b33b1a-410f-4448-9b83-126b8d27f0a9.png"
                }, {
                  name: "John Strictland",
                  price: 1000,
                  rarity: "special",
                  image: "/lovable-uploads/98664a07-8365-4512-8f3e-a0c79bd4617c.png"
                }, {
                  name: "Tarragon Southslice",
                  price: 2800,
                  rarity: "gold",
                  image: "/lovable-uploads/cf5abf4c-cf7f-49b7-a830-49343c8d1222.png"
                }, {
                  name: "The Irish King",
                  price: 2500,
                  rarity: "gold",
                  image: irishKingSkin
                }, {
                  name: "Stani Eagle",
                  price: 1800,
                  rarity: "blue",
                  image: staniEagleSkin
                }, {
                  name: "Jonesy Bones",
                  price: 2200,
                  rarity: "silver",
                  image: bonesSkin
                }, {
                  name: "Latin Legend",
                  price: 1500,
                  rarity: "green",
                  image: latinLegendSkin
                }])} renderItem={(item, idx) => <GlowCard key={idx} className="cursor-pointer">
                              <div className="p-3">
                               <div className="aspect-square bg-gray-800/50 rounded-lg mb-2 overflow-hidden">
                                 <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                               </div>
                              <h3 className="font-semibold text-xs text-white mb-1">{item.name}</h3>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                  <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-3 h-3" />
                                  <span className="text-xs font-bold text-white">{item.price.toLocaleString()}</span>
                                </div>
                                <Drawer>
                                  <DrawerTrigger asChild>
                                     <Button size="sm" variant="secondary" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-6 px-2">
                                       <ShoppingBag className={`${isMobile ? 'h-3 w-3' : 'mr-1 h-2 w-2'}`} />
                                       {!isMobile && "Buy"}
                                     </Button>
                                  </DrawerTrigger>
                                   <DrawerContent className="bg-black/10 backdrop-blur-md border-t border-white/20 text-white transition-all duration-300">
                                    <DrawerHeader>
                                      <DrawerTitle className="text-white text-center">Purchase {item.name}</DrawerTitle>
                                    </DrawerHeader>
                                    <div className="p-4 space-y-3">
                                        <Button className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20" onClick={handleBuyWithCoinsClick}>
                                          <Coins className="mr-2 h-4 w-4" />
                                          Buy With Coins
                                        </Button>
                                        <Button className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20" onClick={handleBuyWithCardClick}>
                                          <CreditCard className="mr-2 h-4 w-4" />
                                          Buy with Card
                                        </Button>
                                      <DrawerClose asChild>
                                         <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white">
                                          Cancel
                                        </Button>
                                      </DrawerClose>
                                    </div>
                                  </DrawerContent>
                                </Drawer>
                               </div>
                             </div>
                           </GlowCard>} />
                     </CardContent>
                   </Card>}

                   {/* Accessories Category */}
                   {(selectedCategory === "all" || selectedCategory === "accessories") && <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
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
                        <div className="flex items-center space-x-3">
                          {/* Navigation arrows for carousel - only show when more than 4 items */}
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10" onClick={() => {
                        accessoriesCarouselRef.current?.scrollToPrevious();
                      }}>
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10" onClick={() => {
                        accessoriesCarouselRef.current?.scrollToNext();
                      }}>
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                         </div>
                        </div>
                      </CardTitle>
                      
                    </CardHeader>
                    <CardContent>
                       <StoreCarousel ref={accessoriesCarouselRef} items={filterItemsByRarity([{
                  name: "Red Wing Suit",
                  price: 600,
                  rarity: "blue",
                  image: "/lovable-uploads/2eec4a9a-97d3-4ba4-9508-2eeef0011139.png"
                }, {
                  name: "Blue Wing Suit",
                  price: 450,
                  rarity: "green",
                  image: "/lovable-uploads/1efc1553-007a-4b38-a982-79d9f5abbfa1.png"
                }, {
                  name: "White Base Vest",
                  price: 750,
                  rarity: "special",
                  image: "/lovable-uploads/508d1509-e761-46c6-9f3a-f70e256f5a52.png"
                }, {
                  name: "Grey Base Vest",
                  price: 550,
                  rarity: "silver",
                  image: "/lovable-uploads/91375d1a-e829-4716-b3b6-833b58355bd9.png"
                }, {
                  name: "Combat Helmet",
                  price: 800,
                  rarity: "gold",
                  image: "/lovable-uploads/896892f1-7ebc-4852-acea-80dcdbf7c545.png"
                }, {
                  name: "Tactical Gloves",
                  price: 350,
                  rarity: "green",
                  image: "/lovable-uploads/4c80b2cf-0ea7-49a2-96b8-58ecbfa7623a.png"
                }, {
                  name: "Elite Armor",
                  price: 1200,
                  rarity: "special",
                  image: "/lovable-uploads/c4290bdc-f68b-45db-bf53-f9551d2cb16f.png"
                }, {
                  name: "Battle Boots",
                  price: 650,
                  rarity: "blue",
                  image: "/lovable-uploads/7d84dfb4-4db3-4adb-87f0-36f33c0f8daa.png"
                }])} renderItem={(item, idx) => <GlowCard key={idx} className="cursor-pointer">
                              <div className="p-3">
                               <div className="aspect-square bg-gray-800/50 rounded-lg mb-2 overflow-hidden">
                                 <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                               </div>
                              <h3 className="font-semibold text-xs text-white mb-1">{item.name}</h3>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                  <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-3 h-3" />
                                  <span className="text-xs font-bold text-white">{item.price.toLocaleString()}</span>
                                </div>
                                <Drawer>
                                  <DrawerTrigger asChild>
                                     <Button size="sm" variant="secondary" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-6 px-2">
                                       <ShoppingBag className={`${isMobile ? 'h-3 w-3' : 'mr-1 h-2 w-2'}`} />
                                       {!isMobile && "Buy"}
                                     </Button>
                                  </DrawerTrigger>
                                   <DrawerContent className="bg-black/10 backdrop-blur-md border-t border-white/20 text-white transition-all duration-300">
                                    <DrawerHeader>
                                      <DrawerTitle className="text-white text-center">Purchase {item.name}</DrawerTitle>
                                    </DrawerHeader>
                                    <div className="p-4 space-y-3">
                                        <Button className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20" onClick={handleBuyWithCoinsClick}>
                                        <Coins className="mr-2 h-4 w-4" />
                                        Buy With Coins
                                      </Button>
                                      <Button className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20" onClick={() => {/* TODO: Implement card payment */}}>
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        Buy with Card
                                      </Button>
                                      <DrawerClose asChild>
                                         <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white">
                                          Cancel
                                        </Button>
                                      </DrawerClose>
                                    </div>
                                  </DrawerContent>
                                </Drawer>
                               </div>
                             </div>
                           </GlowCard>} />
                     </CardContent>
                   </Card>}

                   {/* Emotes Category */}
                   {(selectedCategory === "all" || selectedCategory === "emotes") && <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
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
                        <span>Emotes</span>
                        <div className="flex items-center space-x-3">
                          {/* Navigation arrows for carousel - only show when more than 4 items */}
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10" onClick={() => {
                        emotesCarouselRef.current?.scrollToPrevious();
                      }}>
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10" onClick={() => {
                        emotesCarouselRef.current?.scrollToNext();
                      }}>
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                         </div>
                        </div>
                      </CardTitle>
                      
                    </CardHeader>
                    <CardContent>
                       <StoreCarousel ref={emotesCarouselRef} items={filterItemsByRarity([{
                  name: "Flex",
                  price: 800,
                  rarity: "blue",
                  image: "/lovable-uploads/f52e83c2-28b7-417e-90ac-757255d1759f.png"
                }, {
                  name: "Fists Up",
                  price: 1800,
                  rarity: "gold",
                  image: "/lovable-uploads/370bd874-ad5c-467d-b844-55688b1a0f9a.png"
                }, {
                  name: "Squeaky Dance",
                  price: 2500,
                  rarity: "special",
                  image: "/lovable-uploads/5c8c027e-3baf-4550-96a9-ba0715d11506.png"
                }, {
                  name: "u want sum?",
                  price: 1500,
                  rarity: "gold",
                  image: "/lovable-uploads/30d419b4-79a9-459c-b37b-42099ffd6273.png"
                }, {
                  name: "Protest Sign",
                  price: 1200,
                  rarity: "silver",
                  image: "/lovable-uploads/f9ba9551-eabd-4e1f-a2a9-2eeddc92114d.png"
                }, {
                  name: "Taunt",
                  price: 950,
                  rarity: "blue",
                  image: "/lovable-uploads/13bff6a8-5c37-4ca1-928f-3b3c98952224.png"
                }, {
                  name: "Power Pose",
                  price: 1600,
                  rarity: "gold",
                  image: "/lovable-uploads/c076819c-8944-483c-9fd4-336da5ebba11.png"
                }, {
                name: "Ultimate Flex",
                price: 3000,
                rarity: "special",
                image: "/lovable-uploads/edc04992-1bf6-44e1-b24d-113fdb5e21b4.png"
                }])} renderItem={(item, idx) => <GlowCard key={idx} className="cursor-pointer">
                              <div className="p-3">
                               <div className="aspect-square bg-gray-800/50 rounded-lg mb-2 overflow-hidden flex items-center justify-center">
                                  {item.image.startsWith('/') || item.image.startsWith('http') ? <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" /> : <div className="text-4xl hover:scale-110 transition-transform duration-300">{item.image}</div>}
                               </div>
                              <h3 className="font-semibold text-xs text-white mb-1">{item.name}</h3>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                  <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-3 h-3" />
                                  <span className="text-xs font-bold text-white">{item.price.toLocaleString()}</span>
                                </div>
                                <Drawer>
                                  <DrawerTrigger asChild>
                                     <Button size="sm" variant="secondary" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-6 px-2">
                                       <ShoppingBag className={`${isMobile ? 'h-3 w-3' : 'mr-1 h-2 w-2'}`} />
                                       {!isMobile && "Buy"}
                                     </Button>
                                  </DrawerTrigger>
                                   <DrawerContent className="bg-black/10 backdrop-blur-md border-t border-white/20 text-white transition-all duration-300">
                                    <DrawerHeader>
                                      <DrawerTitle className="text-white text-center">Purchase {item.name}</DrawerTitle>
                                    </DrawerHeader>
                                    <div className="p-4 space-y-3">
                                      <Button className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20" onClick={() => toast({
                              title: "Coming Soon",
                              description: "Coin purchases coming soon!",
                              duration: 3000
                            })}>
                                        <Coins className="mr-2 h-4 w-4" />
                                        Buy With Coins
                                      </Button>
                                      <Button className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20" onClick={() => {/* TODO: Implement card payment */}}>
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        Buy with Card
                                      </Button>
                                      <DrawerClose asChild>
                                         <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white">
                                          Cancel
                                        </Button>
                                      </DrawerClose>
                                    </div>
                                  </DrawerContent>
                                </Drawer>
                               </div>
                             </div>
                           </GlowCard>} />
                      </CardContent>
                    </Card>}

                     {/* Packs Category */}
                     {(selectedCategory === "all" || selectedCategory === "packs") && <Card className={`bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden ${packsShaking ? 'animate-shake' : ''}`}>
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
                          <span>Packs</span>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm" onClick={() => packsCarouselRef.current?.scrollToPrevious()} className="h-6 w-6 p-0 text-white hover:bg-white/20">
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handlePacksNextClick} className="h-6 w-6 p-0 text-white hover:bg-white/20">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <StoreCarousel ref={packsCarouselRef} items={filterItemsByRarity([{
                  name: "Silver Pack",
                  price: 1000,
                  rarity: "silver",
                  image: "/lovable-uploads/17c3a939-bcaa-4cdb-9b61-271b5774c7e2.png"
                }, {
                  name: "Gold Pack",
                  price: 2000,
                  rarity: "gold",
                  image: "/lovable-uploads/291c5734-f144-47b0-9f49-915999e921b0.png"
                }, {
                  name: "EO Summer Pack",
                  price: 3500,
                  rarity: "special",
                  image: "/lovable-uploads/2149e9ad-919f-49ea-8be4-90f190387d39.png"
                }, {
                  name: "Wild West Pack",
                  price: 5000,
                  rarity: "special",
                  image: "/lovable-uploads/5cf8ad93-f292-4e4c-b53c-eb0c4bc0f7be.png"
                }, {
                  name: "Platinum Pack",
                  price: 4500,
                  rarity: "special",
                  image: "/lovable-uploads/ef3aca91-a372-4313-aa94-3c2dcf946dd6.png"
                }, {
                  name: "Diamond Pack",
                  price: 5000,
                  rarity: "special",
                  image: "/lovable-uploads/ba9c646a-45e6-4ab3-9b25-1f069d27960b.png"
                }, {
                  name: "Premium Pack",
                  price: 2800,
                  rarity: "gold",
                  image: "/lovable-uploads/1615e7da-29d5-454e-a2fe-57f5abf91d56.png"
                }, {
                  name: "Starter Pack",
                  price: 500,
                  rarity: "green",
                  image: "/lovable-uploads/ac3e1f52-ba21-4588-9051-87eef47caf5c.png"
                }])} renderItem={(item, idx) => <GlowCard key={idx} className="cursor-pointer">
                               <div className="p-3">
                                 <div className="aspect-square bg-gray-800/50 rounded-lg mb-2 overflow-hidden flex items-center justify-center">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                 </div>
                                 <h3 className="font-semibold text-xs text-white mb-1">{item.name}</h3>
                                 <div className="flex items-center justify-between">
                                   <div className="flex items-center space-x-1">
                                     <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-3 h-3" />
                                     <span className="text-xs font-bold text-white">{item.price.toLocaleString()}</span>
                                   </div>
                                   <Drawer>
                                     <DrawerTrigger asChild>
                                       <Button size="sm" variant="secondary" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-6 px-2">
                                        <ShoppingBag className={`${isMobile ? 'h-3 w-3' : 'mr-1 h-2 w-2'}`} />
                                        {!isMobile && "Buy"}
                                       </Button>
                                     </DrawerTrigger>
                                     <DrawerContent className="bg-black/10 backdrop-blur-md border-t border-white/20 text-white transition-all duration-300">
                                       <DrawerHeader>
                                         <DrawerTitle className="text-white text-center">Purchase {item.name}</DrawerTitle>
                                       </DrawerHeader>
                                       <div className="p-4 space-y-3">
                                        <Button className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20" onClick={handleBuyWithCoinsClick}>
                                          <Coins className="mr-2 h-4 w-4" />
                                          Buy With Coins
                                        </Button>
                                        <Button className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20" onClick={handleBuyWithCardClick}>
                                          <CreditCard className="mr-2 h-4 w-4" />
                                          Buy with Card
                                        </Button>
                                         <DrawerClose asChild>
                                           <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white">
                                             Cancel
                                           </Button>
                                         </DrawerClose>
                                       </div>
                                     </DrawerContent>
                                   </Drawer>
                                 </div>
                               </div>
                             </GlowCard>} />
                        </CardContent>
                      </Card>}
                  </div>
                </div>}

            {activeTab === "market" && <div className="p-4 space-y-6">
                {/* Market Header */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                     <div>
                       <h1 className="text-2xl font-bold">The Market</h1>
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
                        <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        <span className="text-xs md:text-sm font-medium text-white">Total Market Value</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-3 h-3" />
                          <span className="text-sm font-bold text-white">{currentMarketValue.toLocaleString('en-US', {
                        maximumFractionDigits: 0
                      })}</span>
                        </div>
                        <div className="h-12">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={marketValueData.slice(-7)}>
                              <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={1} />
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
                        <LineChart className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        <span className="text-xs md:text-sm font-medium text-white">Live Listings</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm font-bold text-white">{currentListings}</span>
                        <div className="h-12">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={listingsData.slice(-7)}>
                              <Area type="monotone" dataKey="listings" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={1} />
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
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-base md:text-xl flex items-center space-x-2 text-white">
                          <TrendingUp className="w-4 h-4" />
                          <span>Trending</span>
                        </CardTitle>
                      </div>
                      <div className="flex space-x-1">
                        {[{
                    key: "daily",
                    label: "24H"
                  }, {
                    key: "weekly",
                    label: "7D"
                  }, {
                    key: "monthly",
                    label: "30D"
                  }, {
                    key: "all time",
                    label: "All"
                  }].map(filter => <Button key={filter.key} variant={trendingTimeFilter === filter.key ? "secondary" : "ghost"} size="sm" className={`text-xs h-6 px-2 ${trendingTimeFilter === filter.key ? "bg-white/20 text-white border-white/30" : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"}`} onClick={() => setTrendingTimeFilter(filter.key)}>
                            {filter.label}
                          </Button>)}
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="space-y-2">
                        {trendingPlayers.map((player, idx) => (
                          <div key={`trending-${idx}`} className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg">
                            <div className="w-12 h-12 rounded-full overflow-hidden">
                              <img 
                                src={player.image} 
                                alt={player.name} 
                                className="w-full h-full object-cover"
                                loading={idx < 3 ? 'eager' : 'lazy'}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm md:text-xl font-semibold text-white">{player.name}</p>
                                  <p className={`text-xs ${player.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {player.change >= 0 ? '+' : ''}{formatNumberWithAbbreviation(player.change)}%{' '}
                                    {getMarketplacePrices(player.name, 'fighter').bestSellPrice ? 
                                      `${formatNumberWithAbbreviation(getMarketplacePrices(player.name, 'fighter').bestSellPrice)} sell` : ''}{' '}
                                    {getMarketplacePrices(player.name, 'fighter').bestBuyPrice ? 
                                      `${formatNumberWithAbbreviation(getMarketplacePrices(player.name, 'fighter').bestBuyPrice)} buy` : ''}
                                  </p>
                                </div>
                                {renderMarketplacePrices(player, getMarketplacePrices, isMobile, 'medium', () => handleSellClick(player), () => handleBuyClick(player))}
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
                        <CardTitle className="text-base md:text-xl flex items-center space-x-2 text-white">
                          <ArrowUpRight className="w-4 h-4 text-green-400" />
                          <span>Top Gainers</span>
                        </CardTitle>
                      </div>
                      <div className="flex space-x-1">
                        {[{
                    key: "daily",
                    label: "24H"
                  }, {
                    key: "weekly",
                    label: "7D"
                  }, {
                    key: "monthly",
                    label: "30D"
                  }, {
                    key: "alltime",
                    label: "All"
                  }].map(filter => <Button key={filter.key} variant={gainersTimeFilter === filter.key ? "secondary" : "ghost"} size="sm" className={`text-xs h-6 px-2 ${gainersTimeFilter === filter.key ? "bg-white/20 text-white border-white/30" : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"}`} onClick={() => setGainersTimeFilter(filter.key)}>
                            {filter.label}
                          </Button>)}
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="space-y-2">
                        {topGainers.map((player, idx) => (
                          <div key={`gainers-${gainersTimeFilter}-${idx}`} className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg">
                            <div className="w-12 h-12 rounded-full overflow-hidden">
                              <img 
                                src={player.image} 
                                alt={player.name} 
                                className="w-full h-full object-cover"
                                loading={idx < 3 ? 'eager' : 'lazy'}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm md:text-xl font-semibold text-white">{player.name}</p>
                                  <p className={`text-xs ${player.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {player.change >= 0 ? '+' : ''}{formatNumberWithAbbreviation(player.change)}%{' '}
                                    {getMarketplacePrices(player.name, 'fighter').bestSellPrice ? 
                                      `${formatNumberWithAbbreviation(getMarketplacePrices(player.name, 'fighter').bestSellPrice)} sell` : ''}{' '}
                                    {getMarketplacePrices(player.name, 'fighter').bestBuyPrice ? 
                                      `${formatNumberWithAbbreviation(getMarketplacePrices(player.name, 'fighter').bestBuyPrice)} buy` : ''}
                                  </p>
                                </div>
                                {renderMarketplacePrices(player, getMarketplacePrices, isMobile, 'medium', () => handleSellClick(player), () => handleBuyClick(player))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* All Players List (Marketplace) - Moved below gamers */}
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
                    <CardTitle className="text-2xl md:text-3xl flex items-center justify-between text-white">
                      <span>Marketplace</span>
                        <div className="flex items-center space-x-2">
                         <Drawer>
                           <DrawerTrigger asChild>
                              <Button variant="outline" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-6 w-6">
                                <Layers className="w-3 h-3" />
                              </Button>
                           </DrawerTrigger>
                           <DrawerContent className="bg-black/10 backdrop-blur-md border border-white/20 text-white">
                             <DrawerHeader>
                                <DrawerTitle className="text-center">Filter by Category</DrawerTitle>
                             </DrawerHeader>
                             <div className="px-4 pb-8 space-y-2">
                               <Button variant="ghost" onClick={() => setMarketplaceCategory("all")} className={`w-full justify-start text-white hover:bg-white/10 ${marketplaceCategory === "all" ? "bg-white/20" : ""}`}>
                                  ⚫ All
                               </Button>
                                <Button variant="ghost" onClick={() => setMarketplaceCategory("fighters")} className={`w-full justify-start text-white hover:bg-white/10 ${marketplaceCategory === "fighters" ? "bg-white/20" : ""}`}>
                                   👊 Fighters
                                </Button>
                                <Button variant="ghost" onClick={() => setMarketplaceCategory("mobility")} className={`w-full justify-start text-white hover:bg-white/10 ${marketplaceCategory === "mobility" ? "bg-white/20" : ""}`}>
                                   🚗 Mobility
                                </Button>
                                <Button variant="ghost" onClick={() => setMarketplaceCategory("accessories")} className={`w-full justify-start text-white hover:bg-white/10 ${marketplaceCategory === "accessories" ? "bg-white/20" : ""}`}>
                                   💎 Accessories
                                </Button>
                                <Button variant="ghost" onClick={() => setMarketplaceCategory("emotes")} className={`w-full justify-start text-white hover:bg-white/10 ${marketplaceCategory === "emotes" ? "bg-white/20" : ""}`}>
                                   💃 Emotes
                                </Button>
                                <Button variant="ghost" onClick={() => setMarketplaceCategory("packs")} className={`w-full justify-start text-white hover:bg-white/10 ${marketplaceCategory === "packs" ? "bg-white/20" : ""}`}>
                                   🎁 Packs
                                </Button>
                             </div>
                           </DrawerContent>
                         </Drawer>
                         <Drawer>
                           <DrawerTrigger asChild>
                              <Button variant="outline" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-6 w-6">
                                <Search className="w-3 h-3" />
                              </Button>
                           </DrawerTrigger>
                           <DrawerContent className="bg-black/10 backdrop-blur-md border border-white/20 text-white">
                             <DrawerHeader>
                               <DrawerTitle className="text-center">Search</DrawerTitle>
                             </DrawerHeader>
                             <div className="px-4 pb-8">
                               <Input placeholder="Type" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-gray-400" />
                             </div>
                           </DrawerContent>
                         </Drawer>
                         {/* Sort Button */}
                         {isMobile ? <Drawer>
                           <DrawerTrigger asChild>
                             <Button variant="outline" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-6 w-6">
                               <ArrowUpDown className="w-3 h-3" />
                             </Button>
                           </DrawerTrigger>
                           <DrawerContent className="bg-black/10 backdrop-blur-md border border-white/20 text-white">
                             <DrawerHeader>
                               <DrawerTitle className="text-center">Sort By</DrawerTitle>
                             </DrawerHeader>
                             <div className="px-4 pb-8 space-y-2">
                               <Button variant="ghost" onClick={() => setMarketplaceSortBy("highest-price")} className={`w-full justify-start text-white hover:bg-white/10 ${marketplaceSortBy === "highest-price" ? "bg-white/20" : ""}`}>
                                  ⬆️ Highest Price
                               </Button>
                               <Button variant="ghost" onClick={() => setMarketplaceSortBy("lowest-price")} className={`w-full justify-start text-white hover:bg-white/10 ${marketplaceSortBy === "lowest-price" ? "bg-white/20" : ""}`}>
                                  ⬇️ Lowest Price
                               </Button>
                               <Button variant="ghost" onClick={() => setMarketplaceSortBy("highest-gain")} className={`w-full justify-start text-white hover:bg-white/10 ${marketplaceSortBy === "highest-gain" ? "bg-white/20" : ""}`}>
                                  📈 Highest % Gain
                               </Button>
                               <Button variant="ghost" onClick={() => setMarketplaceSortBy("highest-loss")} className={`w-full justify-start text-white hover:bg-white/10 ${marketplaceSortBy === "highest-loss" ? "bg-white/20" : ""}`}>
                                  📉 Highest % Loss
                               </Button>
                             </div>
                           </DrawerContent>
                         </Drawer> : <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button variant="outline" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-6 w-6">
                               <ArrowUpDown className="w-3 h-3" />
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="center" className="w-36 bg-black/10 backdrop-blur-md border border-white/20 text-white z-[9999]">
                             <DropdownMenuItem onClick={() => setMarketplaceSortBy("highest-price")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${marketplaceSortBy === "highest-price" ? "bg-white/20" : ""}`}>
                               <span>⬆️ Highest Price</span>
                             </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => setMarketplaceSortBy("lowest-price")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${marketplaceSortBy === "lowest-price" ? "bg-white/20" : ""}`}>
                               <span>⬇️ Lowest Price</span>
                             </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => setMarketplaceSortBy("highest-gain")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${marketplaceSortBy === "highest-gain" ? "bg-white/20" : ""}`}>
                               <span>📈 Highest % Gain</span>
                             </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => setMarketplaceSortBy("highest-loss")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${marketplaceSortBy === "highest-loss" ? "bg-white/20" : ""}`}>
                               <span>📉 Highest % Loss</span>
                             </DropdownMenuItem>
                           </DropdownMenuContent>
                         </DropdownMenu>}

                         <Drawer>
                           <DrawerTrigger asChild>
                              <Button variant="outline" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-6 w-6">
                                <Filter className="w-3 h-3" />
                              </Button>
                           </DrawerTrigger>
                          <DrawerContent className="bg-black/10 backdrop-blur-md border border-white/20 text-white">
                            <DrawerHeader>
                               <DrawerTitle className="text-center">Filter by Rarity</DrawerTitle>
                            </DrawerHeader>
                            <div className="px-4 pb-8 space-y-2">
                              <Button variant="ghost" onClick={() => setMarketplaceRarity("all")} className={`w-full justify-start text-white hover:bg-white/10 ${marketplaceRarity === "all" ? "bg-white/20" : ""}`}>
                                <div className="w-3 h-3 rounded-full bg-black mr-2" />
                                All Rarities
                              </Button>
                              <Button variant="ghost" onClick={() => setMarketplaceRarity("green")} className={`w-full justify-start text-white hover:bg-white/10 ${marketplaceRarity === "green" ? "bg-white/20" : ""}`}>
                                <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                                Regular
                              </Button>
                              <Button variant="ghost" onClick={() => setMarketplaceRarity("blue")} className={`w-full justify-start text-white hover:bg-white/10 ${marketplaceRarity === "blue" ? "bg-white/20" : ""}`}>
                                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                                Rare
                              </Button>
                              <Button variant="ghost" onClick={() => setMarketplaceRarity("silver")} className={`w-full justify-start text-white hover:bg-white/10 ${marketplaceRarity === "silver" ? "bg-white/20" : ""}`}>
                                <div className="w-3 h-3 rounded-full bg-gray-300 mr-2" />
                                Legendary
                              </Button>
                              <Button variant="ghost" onClick={() => setMarketplaceRarity("gold")} className={`w-full justify-start text-white hover:bg-white/10 ${marketplaceRarity === "gold" ? "bg-white/20" : ""}`}>
                                <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2" />
                                Mythical
                              </Button>
                              <Button variant="ghost" onClick={() => setMarketplaceRarity("special")} className={`w-full justify-start text-white hover:bg-white/10 ${marketplaceRarity === "special" ? "bg-white/20" : ""}`}>
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 mr-2" />
                                Special
                              </Button>
                            </div>
                          </DrawerContent>
                        </Drawer>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="space-y-2">
                       {filteredAndSortedMarketplacePlayers.slice(0, visiblePlayers).map((player, idx) => <div key={idx} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                          </div>
                           <div className="flex-1 min-w-0">
                             <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm md:text-xl font-semibold text-white">{player.name}</p>
                                  <p className={`text-xs ${player.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                                    {player.trend === 'up' ? '+' : ''}{(((player.price - player.lastSale) / player.lastSale) * 100).toFixed(1)}%
                                  </p>
                                </div>
                                {renderMarketplacePrices(player, getMarketplacePrices, isMobile, 'medium', () => handleSellClick(player), () => handleBuyClick(player))}
                             </div>
                           </div>
                        </div>)}
                    </div>
                    
                     {visiblePlayers < filteredAndSortedMarketplacePlayers.length && <div className="mt-4 text-center">
                         <Button variant="outline" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20" onClick={() => setVisiblePlayers(prev => Math.min(prev + 10, filteredAndSortedMarketplacePlayers.length))}>
                           Load More
                         </Button>
                       </div>}
                  </CardContent>
                </Card>

              </div>}

            {activeTab === "locker" && <div className="p-4 space-y-6">
                {/* Mobile Locker Header */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <div>
                      <h1 className="text-2xl font-bold">My Locker</h1>
                    </div>
                  </div>
                </div>

                {!authenticated ? <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
                    <div className="absolute inset-0" style={{
              backgroundImage: `
                        linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
                        linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
                      `,
              backgroundSize: '4px 4px'
            }} />
                    <CardContent className="p-6 text-center relative z-10">
                      <Archive className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold mb-4 text-white">Login to View Your Locker</h3>
                      <Button onClick={login} variant="secondary" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30">
                        Login
                      </Button>
                    </CardContent>
                  </Card> : <div className="space-y-4">
                     {/* Mobile Fighters Category */}
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
                          <CardTitle className="flex items-center text-white text-lg">
                            <span>Fighters</span>
                          </CardTitle>
                         
                       </CardHeader>
                       <CardContent className="relative z-10">
                         <div className="text-center py-8">
                           <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                             <Archive className="w-6 h-6 text-gray-400" />
                           </div>
                           <p className="text-gray-300 text-sm">No fighters owned yet</p>
                           <p className="text-xs text-gray-400 mt-1">Visit the store to purchase fighters</p>
                           <Button onClick={() => setActiveTab("store")} variant="secondary" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 mt-3">
                             Browse Store
                           </Button>
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
                         <CardTitle className="flex items-center text-white text-lg">
                           <span>Accessories</span>
                         </CardTitle>
                        
                      </CardHeader>
                       <CardContent className="relative z-10">
                         <div className="text-center py-8">
                           <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                             <Archive className="w-6 h-6 text-gray-400" />
                           </div>
                           <p className="text-gray-300 text-sm">No accessories owned yet</p>
                           <p className="text-xs text-gray-400 mt-1">Visit the store to purchase shoes, backpacks, and hats</p>
                           <Button onClick={() => setActiveTab("store")} variant="secondary" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 mt-3">
                             Browse Store
                           </Button>
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
                          <CardTitle className="flex items-center text-white text-lg">
                            <span>Mobility</span>
                          </CardTitle>
                         
                       </CardHeader>
                       <CardContent className="relative z-10">
                         <div className="text-center py-8">
                           <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                             <Archive className="w-6 h-6 text-gray-400" />
                           </div>
                           <p className="text-gray-300 text-sm">No vehicles owned yet</p>
                           <p className="text-xs text-gray-400 mt-1">Visit the store to purchase bikes, cars, and hovercrafts</p>
                           <Button onClick={() => setActiveTab("store")} variant="secondary" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 mt-3">
                             Browse Store
                           </Button>
                         </div>
                       </CardContent>
                     </Card>

                     {/* Mobile Packs Category */}
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
                          <CardTitle className="flex items-center text-white text-lg">
                            <span>Packs</span>
                          </CardTitle>
                         
                       </CardHeader>
                       <CardContent className="relative z-10">
                         <div className="text-center py-8">
                           <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                             <Archive className="w-6 h-6 text-gray-400" />
                           </div>
                           <p className="text-gray-300 text-sm">No packs owned yet</p>
                           <p className="text-xs text-gray-400 mt-1">Visit the store to purchase item packs</p>
                           <Button onClick={() => setActiveTab("store")} variant="secondary" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 mt-3">
                             Browse Store
                           </Button>
                         </div>
                       </CardContent>
                     </Card>
                   </div>}
              </div>}
          
        </div>

        {/* Desktop Layout - Hidden on mobile */}
        <div className="hidden lg:flex lg:min-h-screen w-full">
          {/* Left Sidebar - Desktop only */}
          <aside className="w-80 bg-black border-r border-border p-6 space-y-6 overflow-y-auto h-screen">
            <div className="relative">
              {/* Desktop: Hover Card + Popover */}
              {!isMobile ? <div className="relative">
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
                              </div>
                            </CardContent>
                          </Card>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4 bg-black/90 backdrop-blur-md border border-white/20 text-white z-50" side="right" align="start">
                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm">XP Progress Levels</h4>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                              {getAllLevelsForDisplay().map((level, index) => {
                            const isCurrentLevel = getCurrentLevel(userBalance?.xp || 0).name === level.name;
                            const isUnlocked = (userBalance?.xp || 0) >= level.minXp;
                            return <div key={index} className={`flex items-center justify-between p-2 rounded-md transition-colors ${isCurrentLevel ? 'bg-primary/20 border border-primary/30' : isUnlocked ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-800/50 opacity-60'}`}>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-base">
                                        {getTierIcon(level.minXp)}
                                      </span>
                                      <span className="text-sm font-medium">{level.name}</span>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                      {level.maxXp === Infinity ? `${level.minXp.toLocaleString()}+ XP` : `${level.minXp.toLocaleString()}-${level.maxXp.toLocaleString()} XP`}
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
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {getAllLevelsForDisplay().map((level, index) => {
                        const isCurrentLevel = getCurrentLevel(userBalance?.xp || 0).name === level.name;
                        const isUnlocked = (userBalance?.xp || 0) >= level.minXp;
                        return <div key={index} className={`flex items-center justify-between p-2 rounded-md transition-colors ${isCurrentLevel ? 'bg-primary/20 border border-primary/30' : isUnlocked ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-800/50 opacity-60'}`}>
                                <div className="flex items-center space-x-2">
                                  <span className="text-base">{getTierIcon(level.minXp)}</span>
                                  <span className="text-sm font-medium">{level.name}</span>
                                </div>
                                <span className="text-xs text-gray-400">
                                  {level.maxXp === Infinity ? `${level.minXp.toLocaleString()}+ XP` : `${level.minXp.toLocaleString()}-${level.maxXp.toLocaleString()} XP`}
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
                            <div className="space-y-2 max-h-80 overflow-y-auto">
                              {getAllLevelsForDisplay().map((level, index) => {
                            const isCurrentLevel = getCurrentLevel(userBalance?.xp || 0).name === level.name;
                            const isUnlocked = (userBalance?.xp || 0) >= level.minXp;
                            return <div key={index} className={`flex items-center justify-between p-3 rounded-md transition-colors ${isCurrentLevel ? 'bg-primary/20 border border-primary/30' : isUnlocked ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-800/50 opacity-60'}`}>
                                     <div className="flex items-center space-x-2">
                                       <span className="text-base">
                                         {getTierIcon(level.minXp)}
                                       </span>
                                       <span className={`text-sm font-medium ${isCurrentLevel ? 'text-primary' : 'text-white'}`}>
                                         {level.name}
                                       </span>
                                     </div>
                                    <span className="text-xs text-gray-400">
                                      {level.level >= 10 ? "10,000+ XP" : `${level.minXp.toLocaleString()}-${level.maxXp.toLocaleString()} XP`}
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

            <Card className={`bg-black border-gray-700 transition-all duration-500 ease-in-out cursor-pointer hover:bg-black/80 ${isObjectivesGlowing ? 'ring-1 ring-primary/30 shadow-lg shadow-primary/20' : ''}`} onClick={() => {
            if (objectivesView === "weekly") {
              setObjectivesView("daily");
            } else if (objectivesView === "daily") {
              setObjectivesView("quests");
            } else {
              setObjectivesView("weekly");
            }
          }}>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4" />
                    <span>{objectivesView === "weekly" ? "Weekly Objectives" : objectivesView === "daily" ? "Daily Objectives" : "Quests"}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-white/10" onClick={e => {
                  e.stopPropagation();
                  if (objectivesView === "weekly") {
                    setObjectivesView("daily");
                  } else if (objectivesView === "daily") {
                    setObjectivesView("quests");
                  } else {
                    setObjectivesView("weekly");
                  }
                }}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {objectivesView === "weekly" ? <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer" onClick={e => e.stopPropagation()}>
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
                    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer" onClick={e => e.stopPropagation()}>
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
                    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer" onClick={e => e.stopPropagation()}>
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
                    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer" onClick={e => e.stopPropagation()}>
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
                    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer" onClick={e => e.stopPropagation()}>
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
                  </div> : objectivesView === "daily" ? <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <Play className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Play 1 game</p>
                          <p className="text-xs text-muted-foreground">0/1 • 5 XP</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                          <Gamepad className="w-4 h-4 text-secondary-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Play 2 games</p>
                          <p className="text-xs text-muted-foreground">0/2 • 8 XP</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-destructive rounded-full flex items-center justify-center">
                          <Play className="w-4 h-4 text-destructive-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Play 3 games</p>
                          <p className="text-xs text-muted-foreground">0/3 • 12 XP</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Trophy className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Win 1 game</p>
                          <p className="text-xs text-muted-foreground">0/1 • 15 XP</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Play with 1 friend</p>
                          <p className="text-xs text-muted-foreground">0/1 • 10 XP</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div> : <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                          <img src="/lovable-uploads/3c1059ce-1948-46a2-bc2a-8e6c6b55079d.png" alt="X" className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Connect X</p>
                          <p className="text-xs text-muted-foreground">0/1 • 20 XP</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                          <img src="/lovable-uploads/896892f1-7ebc-4852-acea-80dcdbf7c545.png" alt="Instagram" className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Connect Instagram</p>
                          <p className="text-xs text-muted-foreground">0/1 • 20 XP</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                          <img src="/lovable-uploads/3c1059ce-1948-46a2-bc2a-8e6c6b55079d.png" alt="X" className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Follow X</p>
                          <p className="text-xs text-muted-foreground">0/1 • 15 XP</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <img src="/lovable-uploads/896892f1-7ebc-4852-acea-80dcdbf7c545.png" alt="Instagram" className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Follow Instagram</p>
                          <p className="text-xs text-muted-foreground">0/1 • 15 XP</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                          <MessageCircle className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Post about $LCS</p>
                          <p className="text-xs text-muted-foreground">0/1 • 25 XP</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>}
              </CardContent>
            </Card>
            
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
          <main className="flex-1 h-screen">
            {activeTab === "home" && <ScrollArea className="h-full">
                <div className="p-6">
                  <div className="grid grid-cols-12 gap-6 h-full min-h-0">
                {/* Large Welcome Card */}
                <Card className="col-span-8 row-span-2 bg-gradient-to-br from-blue-600/80 to-purple-700/80 text-white border-0 relative overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
                    backgroundImage: 'url(/lovable-uploads/8090c672-9fc6-4634-ad28-0629a1a7f181.png)'
                  }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <CardContent className="p-8 h-full flex flex-col justify-end relative z-10">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Welcome to LCS</h2>
                      <div className="flex space-x-4">
                        <Button variant="secondary" size="default" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300" onClick={() => navigate('/docs')}>
                          <Info className="w-4 h-4 mr-2" />
                          How to play
                        </Button>
                        <Button variant="secondary" size="default" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300" onClick={() => setIsPreOrderOpen(true)}>
                          <Play className="w-4 h-4 mr-2" />
                          Play now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tournament Complete Card */}
                <GlowCard className="col-span-4 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Trophy className="w-5 h-5 text-white" />
                      <span className="text-sm font-medium text-white">Quests!</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">Smash that XP</h3>
                    <p className="text-gray-300 text-sm mb-4">by completing all quests</p>
                    <Button variant="secondary" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 w-full relative z-10 transition-all duration-300" onClick={() => {
                      setObjectivesView("quests");
                      setIsObjectivesGlowing(true);
                      setTimeout(() => {
                        setIsObjectivesGlowing(false);
                      }, 2000);
                    }}>
                      Show Quests
                    </Button>
                  </CardContent>
                </GlowCard>

                {/* Open Packs Card */}
                <GlowCard className="col-span-4 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Gift className="w-5 h-5" />
                      <span className="text-sm font-medium">Packs</span>
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
                    {isMobile ? <Drawer>
                        <DrawerTrigger asChild>
                          <Button variant="secondary" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 w-full relative z-10 transition-all duration-300">
                            Buy Now
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent className="bg-black/10 backdrop-blur-md border-t border-white/20 text-white transition-all duration-300">
                          <DrawerHeader>
                            <DrawerTitle className="text-white text-center">Purchase Pack</DrawerTitle>
                          </DrawerHeader>
                          <div className="p-4 space-y-3">
            <Button className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20" onClick={handleBuyWithCoinsClick}>
              <Coins className="mr-2 h-4 w-4" />
              Buy With Coins
            </Button>
            <Button className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20" onClick={handleBuyWithCardClick}>
              <CreditCard className="mr-2 h-4 w-4" />
              Buy with Card
            </Button>
                            <DrawerClose asChild>
                              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white">
                                Cancel
                              </Button>
                            </DrawerClose>
                          </div>
                        </DrawerContent>
                      </Drawer> : <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 w-full relative z-10 transition-all duration-300">
                            Buy Now
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="w-full bg-black/10 backdrop-blur-md border border-white/20 text-white z-50">
                          <DropdownMenuItem onClick={handleBuyWithCoinsClick} className="flex items-center space-x-2 cursor-pointer text-white hover:bg-gradient-to-br hover:from-gray-800/30 hover:via-black/20 hover:to-gray-900/40 hover:backdrop-blur-md transition-all duration-300">
                            <Coins className="w-4 h-4" />
                            <span>Buy With Coins</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={handleBuyWithCardClick} className="flex items-center space-x-2 cursor-pointer text-white hover:bg-gradient-to-br hover:from-gray-800/30 hover:via-black/20 hover:to-gray-900/40 hover:backdrop-blur-md transition-all duration-300">
                            <CreditCard className="w-4 h-4" />
                            <span>Buy with Card</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>}
                  </CardContent>
                </GlowCard>

                {/* Additional Cards */}
                <GlowCard className="col-span-6 cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-3 mb-4">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Roster</h3>
                        <p className="text-sm text-gray-300">Pick your prizefighters</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 w-full transition-all duration-300" onClick={() => setActiveTab("store")}>
                      Browse Drops
                    </Button>
                  </CardContent>
                </GlowCard>

                <GlowCard className="col-span-6 cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-3 mb-4">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Transfer Market</h3>
                        <p className="text-sm text-gray-300">Buy, sell, list or just browse</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 w-full transition-all duration-300" onClick={() => setActiveTab("market")}>
                      Browse Market
                    </Button>
                  </CardContent>
                </GlowCard>
              </div>
                </div>
              </ScrollArea>}

            {activeTab === "store" && <ScrollArea className="h-full">
                <div className="p-6">
                  <div className="space-y-6 max-w-4xl">
                {/* Store Header */}
                <div className="text-center relative sticky top-0 z-50 bg-black/80 backdrop-blur-md">
                  {/* Category Filter - positioned in top left */}
                  <div className="absolute top-0 left-0">
                    {isMobile ? <Drawer>
                        <DrawerTrigger asChild>
                           <Button variant="ghost" size="default" className="text-white hover:bg-white/10 w-18 h-18">
                             <Layers className="w-7 h-7" />
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent className="bg-black/10 backdrop-blur-md border border-white/20 text-white">
                          <DrawerHeader>
                            <DrawerTitle className="text-center">Filter by Category</DrawerTitle>
                          </DrawerHeader>
                          <div className="px-4 pb-8 space-y-2">
                             <Button variant="ghost" onClick={() => setSelectedCategory("all")} className={`w-full justify-start text-white hover:bg-white/10 ${selectedCategory === "all" ? "bg-white/20" : ""}`}>
                               ⚫ All Categories
                             </Button>
                             <Button variant="ghost" onClick={() => setSelectedCategory("skins")} className={`w-full justify-start text-white hover:bg-white/10 ${selectedCategory === "skins" ? "bg-white/20" : ""}`}>
                               👊 Fighters
                             </Button>
                             <Button variant="ghost" onClick={() => setSelectedCategory("accessories")} className={`w-full justify-start text-white hover:bg-white/10 ${selectedCategory === "accessories" ? "bg-white/20" : ""}`}>
                               💎 Accessories
                             </Button>
                             <Button variant="ghost" onClick={() => setSelectedCategory("mobility")} className={`w-full justify-start text-white hover:bg-white/10 ${selectedCategory === "mobility" ? "bg-white/20" : ""}`}>
                               🚗 Mobility
                             </Button>
                             <Button variant="ghost" onClick={() => setSelectedCategory("emotes")} className={`w-full justify-start text-white hover:bg-white/10 ${selectedCategory === "emotes" ? "bg-white/20" : ""}`}>
                               💃 Emotes
                             </Button>
                             <Button variant="ghost" onClick={() => setSelectedCategory("packs")} className={`w-full justify-start text-white hover:bg-white/10 ${selectedCategory === "packs" ? "bg-white/20" : ""}`}>
                               🎁 Packs
                             </Button>
                          </div>
                        </DrawerContent>
                      </Drawer> : <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="default" className="text-white hover:bg-white/10 w-18 h-18">
                             <Layers className="w-7 h-7" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="w-32 bg-black/10 backdrop-blur-md border border-white/20 text-white z-50">
                           <DropdownMenuItem onClick={() => setSelectedCategory("all")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${selectedCategory === "all" ? "bg-white/20" : ""}`}>
                             <span>⚫ All</span>
                           </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => setSelectedCategory("skins")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${selectedCategory === "skins" ? "bg-white/20" : ""}`}>
                             <span>👊 Fighters</span>
                           </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => setSelectedCategory("accessories")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${selectedCategory === "accessories" ? "bg-white/20" : ""}`}>
                             <span>💎 Accessories</span>
                           </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => setSelectedCategory("mobility")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${selectedCategory === "mobility" ? "bg-white/20" : ""}`}>
                             <span>🚗 Mobility</span>
                           </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => setSelectedCategory("emotes")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${selectedCategory === "emotes" ? "bg-white/20" : ""}`}>
                             <span>💃 Emotes</span>
                           </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => setSelectedCategory("packs")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${selectedCategory === "packs" ? "bg-white/20" : ""}`}>
                             <span>🎁 Packs</span>
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>}
                  </div>
                  
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <div>
                      <h1 className="text-3xl font-bold">Fresh Drops</h1>
                    </div>
                  </div>
                  
                  {/* Filter Dropdown - positioned in top right */}
                  <div className="absolute top-1 right-0">
                    {isMobile ? <Drawer>
                        <DrawerTrigger asChild>
                           <Button variant="ghost" size="default" className="w-18 h-18 text-white hover:bg-white/10">
                             <Filter className="w-7 h-7" />
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent className="bg-black/10 backdrop-blur-md border border-white/20 text-white">
                          <DrawerHeader>
                             <DrawerTitle className="text-center">Filter by Rarity</DrawerTitle>
                          </DrawerHeader>
                          <div className="px-4 pb-8 space-y-2">
                            <Button variant="ghost" onClick={() => setSelectedRarity("all")} className={`w-full justify-start text-white hover:bg-white/10 ${selectedRarity === "all" ? "bg-white/20" : ""}`}>
                              <div className="w-3 h-3 rounded-full bg-black mr-2" />
                              All Rarities
                            </Button>
                            <Button variant="ghost" onClick={() => setSelectedRarity("green")} className={`w-full justify-start text-white hover:bg-white/10 ${selectedRarity === "green" ? "bg-white/20" : ""}`}>
                              <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                              Regular
                            </Button>
                            <Button variant="ghost" onClick={() => setSelectedRarity("blue")} className={`w-full justify-start text-white hover:bg-white/10 ${selectedRarity === "blue" ? "bg-white/20" : ""}`}>
                              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                              Rare
                            </Button>
                            <Button variant="ghost" onClick={() => setSelectedRarity("silver")} className={`w-full justify-start text-white hover:bg-white/10 ${selectedRarity === "silver" ? "bg-white/20" : ""}`}>
                              <div className="w-3 h-3 rounded-full bg-gray-300 mr-2" />
                              Legendary
                            </Button>
                            <Button variant="ghost" onClick={() => setSelectedRarity("gold")} className={`w-full justify-start text-white hover:bg-white/10 ${selectedRarity === "gold" ? "bg-white/20" : ""}`}>
                              <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2" />
                              Mythical
                            </Button>
                            <Button variant="ghost" onClick={() => setSelectedRarity("special")} className={`w-full justify-start text-white hover:bg-white/10 ${selectedRarity === "special" ? "bg-white/20" : ""}`}>
                              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 mr-2" />
                              Special
                            </Button>
                          </div>
                        </DrawerContent>
                      </Drawer> : <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="default" className="w-18 h-18 text-white hover:bg-white/10">
                             <Filter className="w-7 h-7" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="w-32 bg-black/10 backdrop-blur-md border border-white/20 text-white z-50">
                          <DropdownMenuItem onClick={() => setSelectedRarity("all")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${selectedRarity === "all" ? "bg-white/20" : ""}`}>
                            <div className="w-3 h-3 rounded-full bg-black" />
                            <span>All Rarities</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedRarity("green")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${selectedRarity === "green" ? "bg-white/20" : ""}`}>
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span>Regular</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedRarity("blue")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${selectedRarity === "blue" ? "bg-white/20" : ""}`}>
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span>Rare</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedRarity("silver")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${selectedRarity === "silver" ? "bg-white/20" : ""}`}>
                            <div className="w-3 h-3 rounded-full bg-gray-300" />
                            <span>Legendary</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedRarity("gold")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${selectedRarity === "gold" ? "bg-white/20" : ""}`}>
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <span>Mythical</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedRarity("special")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${selectedRarity === "special" ? "bg-white/20" : ""}`}>
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400" />
                            <span>Special</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>}
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-6">
                  {/* Fighters Category */}
                  {(selectedCategory === "all" || selectedCategory === "skins") && <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
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
                          <span>Fighters</span>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm" onClick={() => desktopFightersCarouselRef.current?.scrollToPrevious()} className="h-6 w-6 p-0 text-white hover:bg-white/20">
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => desktopFightersCarouselRef.current?.scrollToNext()} className="h-6 w-6 p-0 text-white hover:bg-white/20">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                       </CardTitle>
                     </CardHeader>
                      <CardContent>
                         <StoreCarousel ref={desktopFightersCarouselRef} desktopMode={true} items={filterItemsByRarity([{
                        name: "Shane Sonny",
                        price: 1200,
                        rarity: "gold",
                        image: "/lovable-uploads/a76e21f1-ffca-4130-bd9a-08d09167dca0.png"
                      }, {
                        name: "Ray Del Maestro",
                        price: 2800,
                        rarity: "blue",
                        image: "/lovable-uploads/e8b33b1a-410f-4448-9b83-126b8d27f0a9.png"
                      }, {
                        name: "John Strictland",
                        price: 1000,
                        rarity: "special",
                        image: "/lovable-uploads/98664a07-8365-4512-8f3e-a0c79bd4617c.png"
                      }, {
                        name: "Tarragon Southslice",
                        price: 2800,
                        rarity: "gold",
                        image: "/lovable-uploads/cf5abf4c-cf7f-49b7-a830-49343c8d1222.png"
                      }, {
                        name: "The Irish King",
                        price: 2500,
                        rarity: "gold",
                        image: irishKingSkin
                      }, {
                        name: "Stani Eagle",
                        price: 1800,
                        rarity: "blue",
                        image: staniEagleSkin
                      }, {
                        name: "Jonesy Bones",
                        price: 2200,
                        rarity: "silver",
                        image: bonesSkin
                      }, {
                        name: "Latin Legend",
                        price: 1500,
                        rarity: "green",
                        image: latinLegendSkin
                      }])} renderItem={(item, idx) => <GlowCard key={idx} className="text-white shadow-2xl cursor-pointer">
                              <div className="absolute inset-0 bg-gradient-to-br from-gray-700/30 via-gray-800/50 to-gray-900/80" />
                              <CardContent className="p-4 relative z-10">
                               <div className="aspect-square bg-gray-800/50 rounded-lg mb-3 overflow-hidden">
                                 <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                               </div>
                                <h3 className="font-semibold text-sm text-white mb-2 truncate">{item.name}</h3>
                               <div className="flex items-center justify-between">
                                 <div className="flex items-center space-x-1">
                                   <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-4 h-4" />
                                   <span className="text-sm font-bold text-white">{item.price.toLocaleString()}</span>
                                 </div>
                                 <DropdownMenu>
                                   <DropdownMenuTrigger asChild>
                                     <Button size="sm" variant="secondary" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-7 px-3">
                                       Buy
                                     </Button>
                                   </DropdownMenuTrigger>
                                   <DropdownMenuContent align="start" className="w-full lg:w-full bg-black/10 backdrop-blur-md border border-white/20 text-white z-50">
                                       <DropdownMenuItem onClick={handleBuyWithCoinsClick} className="flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 transition-all duration-300">
                                        <Coins className="w-4 h-4" />
                                        <span>Buy With Coins</span>
                                      </DropdownMenuItem>
                                       <DropdownMenuItem onClick={handleBuyWithCardClick} className="flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 transition-all duration-300">
                                        <CreditCard className="w-4 h-4" />
                                        <span>Buy with Card</span>
                                      </DropdownMenuItem>
                                   </DropdownMenuContent>
                                 </DropdownMenu>
                               </div>
                             </CardContent>
                            </GlowCard>} />
                       </CardContent>
                   </Card>}

                   {/* Accessories Category */}
                   {(selectedCategory === "all" || selectedCategory === "accessories") && <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
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
                         <div className="flex space-x-1">
                           <Button variant="ghost" size="sm" onClick={() => desktopAccessoriesCarouselRef.current?.scrollToPrevious()} className="h-6 w-6 p-0 text-white hover:bg-white/20">
                             <ChevronLeft className="h-4 w-4" />
                           </Button>
                           <Button variant="ghost" size="sm" onClick={() => desktopAccessoriesCarouselRef.current?.scrollToNext()} className="h-6 w-6 p-0 text-white hover:bg-white/20">
                             <ChevronRight className="h-4 w-4" />
                           </Button>
                         </div>
                       </CardTitle>
                     </CardHeader>
                      <CardContent>
                        <StoreCarousel ref={desktopAccessoriesCarouselRef} desktopMode={true} items={filterItemsByRarity([{
                        name: "Red Wing Suit",
                        price: 600,
                        rarity: "blue",
                        image: "/lovable-uploads/2eec4a9a-97d3-4ba4-9508-2eeef0011139.png"
                      }, {
                        name: "Blue Wing Suit",
                        price: 450,
                        rarity: "green",
                        image: "/lovable-uploads/1efc1553-007a-4b38-a982-79d9f5abbfa1.png"
                      }, {
                        name: "White Base Vest",
                        price: 750,
                        rarity: "special",
                        image: "/lovable-uploads/508d1509-e761-46c6-9f3a-f70e256f5a52.png"
                      }, {
                        name: "Grey Base Vest",
                        price: 550,
                        rarity: "silver",
                        image: "/lovable-uploads/91375d1a-e829-4716-b3b6-833b58355bd9.png"
                      }, {
                        name: "Combat Vest",
                        price: 880,
                        rarity: "gold",
                        image: "/lovable-uploads/8c7fd9f1-1128-4d45-b089-e8879cb0fa98.png"
                      }, {
                        name: "DHB x LCS shorts",
                        price: 990,
                        rarity: "blue",
                        image: "/lovable-uploads/e21fe8d7-5519-4b7b-bd90-6b96e74635d4.png"
                      }, {
                        name: "BMF Shorts",
                        price: 1200,
                        rarity: "special",
                        image: "/lovable-uploads/6ffd60e7-d39b-442f-a71c-9ae2f491846f.png"
                      }, {
                        name: "Rapz Gloves",
                        price: 800,
                        rarity: "silver",
                        image: "/lovable-uploads/9320a71d-c3b8-4922-938c-5e759907fcf6.png"
                      }])} renderItem={(item, idx) => <GlowCard key={idx} className="text-white shadow-2xl cursor-pointer">
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
                                 <DropdownMenu>
                                   <DropdownMenuTrigger asChild>
                                     <Button size="sm" variant="secondary" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-7 px-3">
                                       Buy
                                     </Button>
                                   </DropdownMenuTrigger>
                                   <DropdownMenuContent align="center" className="w-32 bg-black/10 backdrop-blur-md border border-white/20 text-white z-50">
                                      <DropdownMenuItem onClick={handleBuyWithCoinsClick} className="flex items-center space-x-2 cursor-pointer text-white hover:bg-gradient-to-br hover:from-gray-800/30 hover:via-black/20 hover:to-gray-900/40 hover:backdrop-blur-md transition-all duration-300">
                                        <Coins className="w-4 h-4" />
                                        <span>Buy With Coins</span>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={handleBuyWithCardClick} className="flex items-center space-x-2 cursor-pointer text-white hover:bg-gradient-to-br hover:from-gray-800/30 hover:via-black/20 hover:to-gray-900/40 hover:backdrop-blur-md transition-all duration-300">
                                        <CreditCard className="w-4 h-4" />
                                        <span>Buy with Card</span>
                                      </DropdownMenuItem>
                                   </DropdownMenuContent>
                                 </DropdownMenu>
                               </div>
                             </CardContent>
                            </GlowCard>} />
                       </CardContent>
                   </Card>}

                    {/* Mobility Category */}
                   {(selectedCategory === "all" || selectedCategory === "mobility") && <Card className={`bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden transition-transform duration-300 ${mobilityShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
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
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm" onClick={() => desktopMobilityCarouselRef.current?.scrollToPrevious()} className="h-6 w-6 p-0 text-white hover:bg-white/20">
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleMobilityNextClick} className="h-6 w-6 p-0 text-white hover:bg-white/20">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                       <CardContent className="relative z-10">
                         <StoreCarousel ref={desktopMobilityCarouselRef} desktopMode={true} items={filterItemsByRarity([{
                        name: "The Coupé Tank",
                        price: 5000,
                        rarity: "gold",
                        image: "/lovable-uploads/1c6b707c-97a6-4381-bc54-de63a7cf8a31.png"
                      }, {
                        name: "Speed Buggy",
                        price: 3200,
                        rarity: "silver",
                        image: "/lovable-uploads/b64d7801-1284-4763-b115-ca3cfa8ff315.png"
                      }, {
                        name: "Pit Bike",
                        price: 4500,
                        rarity: "blue",
                        image: "/lovable-uploads/4e2aac54-cac6-4cf1-92ad-76bf7e788077.png"
                      }, {
                        name: "Pogo",
                        price: 8000,
                        rarity: "special",
                        image: "/lovable-uploads/2877ff38-b9fd-4a5d-bca9-25b14f237997.png"
                      }])} renderItem={(item, idx) => <GlowCard key={idx} className="text-white shadow-2xl cursor-pointer">
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
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button size="sm" variant="secondary" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-7 px-3">
                                        Buy
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="center" className="w-32 bg-black/10 backdrop-blur-md border border-white/20 text-white z-50">
                                      <DropdownMenuItem onClick={() => toast({
                                  title: "Coming Soon",
                                  description: "Coin purchases coming soon!",
                                  duration: 3000
                                })} className="flex items-center space-x-2 cursor-pointer text-white hover:bg-gradient-to-br hover:from-gray-800/30 hover:via-black/20 hover:to-gray-900/40 hover:backdrop-blur-md transition-all duration-300">
                                        <Coins className="w-4 h-4" />
                                        <span>Buy With Coins</span>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => toast({
                                  title: "Coming Soon",
                                  description: "Card payments coming soon!",
                                  duration: 3000
                                })} className="flex items-center space-x-2 cursor-pointer text-white hover:bg-gradient-to-br hover:from-gray-800/30 hover:via-black/20 hover:to-gray-900/40 hover:backdrop-blur-md transition-all duration-300">
                                        <CreditCard className="w-4 h-4" />
                                        <span>Buy with Card</span>
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                 </div>
                               </CardContent>
                             </GlowCard>} />
                       </CardContent>
                   </Card>}

                   {/* Emotes Category */}
                   {(selectedCategory === "all" || selectedCategory === "emotes") && <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
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
                         <span>Emotes</span>
                         <div className="flex space-x-1">
                           <Button variant="ghost" size="sm" onClick={() => desktopEmotesCarouselRef.current?.scrollToPrevious()} className="h-6 w-6 p-0 text-white hover:bg-white/20">
                             <ChevronLeft className="h-4 w-4" />
                           </Button>
                           <Button variant="ghost" size="sm" onClick={() => desktopEmotesCarouselRef.current?.scrollToNext()} className="h-6 w-6 p-0 text-white hover:bg-white/20">
                             <ChevronRight className="h-4 w-4" />
                           </Button>
                         </div>
                       </CardTitle>
                     </CardHeader>
                      <CardContent>
                        <StoreCarousel ref={desktopEmotesCarouselRef} desktopMode={true} items={filterItemsByRarity([{
                        name: "Flex",
                        price: 800,
                        rarity: "blue",
                        image: "/lovable-uploads/f52e83c2-28b7-417e-90ac-757255d1759f.png"
                      }, {
                        name: "Fists Up",
                        price: 1800,
                        rarity: "gold",
                        image: "/lovable-uploads/370bd874-ad5c-467d-b844-55688b1a0f9a.png"
                      }, {
                        name: "Squeaky Dance",
                        price: 2500,
                        rarity: "special",
                        image: "/lovable-uploads/5c8c027e-3baf-4550-96a9-ba0715d11506.png"
                      }, {
                        name: "u want sum?",
                        price: 1500,
                        rarity: "gold",
                        image: "/lovable-uploads/30d419b4-79a9-459c-b37b-42099ffd6273.png"
                      }, {
                        name: "Protest Sign",
                        price: 2200,
                        rarity: "special",
                        image: "/lovable-uploads/f9ba9551-eabd-4e1f-a2a9-2eeddc92114d.png"
                      }, {
                        name: "Aura Farm",
                        price: 1900,
                        rarity: "silver",
                        image: "/lovable-uploads/74597015-55ed-4190-91df-62af504a7e04.png"
                      }, {
                        name: "Screen Smash",
                        price: 1700,
                        rarity: "blue",
                        image: "/lovable-uploads/f747341c-eccd-47c4-8290-0451629ec3a4.png"
                      }, {
                        name: "Dumbbell Singer",
                        price: 1200,
                        rarity: "green",
                        image: "/lovable-uploads/2c2096de-f308-4a16-865b-31c36a14a080.png"
                      }])} renderItem={(item, idx) => <GlowCard key={idx} className="text-white shadow-2xl cursor-pointer">
                              <div className="absolute inset-0 bg-gradient-to-br from-gray-700/30 via-gray-800/50 to-gray-900/80" />
                              <CardContent className="p-4 relative z-10">
                               <div className="aspect-square bg-gray-800/50 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                                  {item.image.startsWith('/') || item.image.startsWith('http') ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <div className="text-6xl">{item.image}</div>}
                               </div>
                               <h3 className="font-semibold text-sm text-white mb-2">{item.name}</h3>
                               <div className="flex items-center justify-between">
                                 <div className="flex items-center space-x-1">
                                   <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-4 h-4" />
                                   <span className="text-sm font-bold text-white">{item.price.toLocaleString()}</span>
                                 </div>
                                 <DropdownMenu>
                                   <DropdownMenuTrigger asChild>
                                     <Button size="sm" variant="secondary" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-7 px-3">
                                       Buy
                                     </Button>
                                   </DropdownMenuTrigger>
                                   <DropdownMenuContent align="center" className="w-32 bg-black/10 backdrop-blur-md border border-white/20 text-white z-50">
                                     <DropdownMenuItem onClick={() => toast({
                                  title: "Coming Soon",
                                  description: "Coin purchases coming soon!",
                                  duration: 3000
                                })} className="flex items-center space-x-2 cursor-pointer text-white hover:bg-gradient-to-br hover:from-gray-800/30 hover:via-black/20 hover:to-gray-900/40 hover:backdrop-blur-md transition-all duration-300">
                                       <Coins className="w-4 h-4" />
                                       <span>Buy With Coins</span>
                                     </DropdownMenuItem>
                                     <DropdownMenuItem onClick={() => toast({
                                  title: "Coming Soon",
                                  description: "Card payments coming soon!",
                                  duration: 3000
                                })} className="flex items-center space-x-2 cursor-pointer text-white hover:bg-gradient-to-br hover:from-gray-800/30 hover:via-black/20 hover:to-gray-900/40 hover:backdrop-blur-md transition-all duration-300">
                                       <CreditCard className="w-4 h-4" />
                                       <span>Buy with Card</span>
                                     </DropdownMenuItem>
                                   </DropdownMenuContent>
                                 </DropdownMenu>
                               </div>
                             </CardContent>
                            </GlowCard>} />
                       </CardContent>
                   </Card>}

                    {/* Packs Category */}
                    {(selectedCategory === "all" || selectedCategory === "packs") && <Card className={`bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden ${packsShaking ? 'animate-shake' : ''}`}>
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
                         <span>Packs</span>
                         <div className="flex space-x-1">
                           <Button variant="ghost" size="sm" onClick={() => desktopPacksCarouselRef.current?.scrollToPrevious()} className="h-6 w-6 p-0 text-white hover:bg-white/20">
                             <ChevronLeft className="h-4 w-4" />
                           </Button>
                           <Button variant="ghost" size="sm" onClick={handlePacksNextClick} className="h-6 w-6 p-0 text-white hover:bg-white/20">
                             <ChevronRight className="h-4 w-4" />
                           </Button>
                         </div>
                       </CardTitle>
                     </CardHeader>
                     <CardContent className="relative z-10">
                       <StoreCarousel ref={desktopPacksCarouselRef} desktopMode={true} items={filterItemsByRarity([{
                        name: "Silver Pack",
                        price: 1000,
                        rarity: "silver",
                        image: "/lovable-uploads/17c3a939-bcaa-4cdb-9b61-271b5774c7e2.png"
                      }, {
                        name: "Gold Pack",
                        price: 2000,
                        rarity: "gold",
                        image: "/lovable-uploads/291c5734-f144-47b0-9f49-915999e921b0.png"
                      }, {
                        name: "EO Summer Pack",
                        price: 3500,
                        rarity: "special",
                        image: "/lovable-uploads/2149e9ad-919f-49ea-8be4-90f190387d39.png"
                      }, {
                        name: "Wild West Pack",
                        price: 5000,
                        rarity: "special",
                        image: "/lovable-uploads/5cf8ad93-f292-4e4c-b53c-eb0c4bc0f7be.png"
                      }])} renderItem={(item, idx) => <GlowCard key={idx} className="cursor-pointer">
                              <div className="p-4">
                               <div className="aspect-square bg-gray-800/50 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                               </div>
                               <h3 className="font-semibold text-sm text-white mb-2">{item.name}</h3>
                               <div className="flex items-center justify-between">
                                 <div className="flex items-center space-x-1">
                                   <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-4 h-4" />
                                   <span className="text-sm font-bold text-white">{item.price.toLocaleString()}</span>
                                 </div>
                                 <DropdownMenu>
                                   <DropdownMenuTrigger asChild>
                                     <Button size="sm" variant="secondary" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-7 px-3">
                                       Buy
                                     </Button>
                                   </DropdownMenuTrigger>
                                   <DropdownMenuContent align="center" className="w-32 bg-black/10 backdrop-blur-md border border-white/20 text-white z-50">
                                     <DropdownMenuItem onClick={() => toast({
                                  title: "Coming Soon",
                                  description: "Coin purchases coming soon!",
                                  duration: 3000
                                })} className="flex items-center space-x-2 cursor-pointer text-white hover:bg-gradient-to-br hover:from-gray-800/30 hover:via-black/20 hover:to-gray-900/40 hover:backdrop-blur-md transition-all duration-300">
                                       <Coins className="w-4 h-4" />
                                       <span>Buy With Coins</span>
                                     </DropdownMenuItem>
                                     <DropdownMenuItem onClick={() => toast({
                                  title: "Coming Soon",
                                  description: "Card payments coming soon!",
                                  duration: 3000
                                })} className="flex items-center space-x-2 cursor-pointer text-white hover:bg-gradient-to-br hover:from-gray-800/30 hover:via-black/20 hover:to-gray-900/40 hover:backdrop-blur-md transition-all duration-300">
                                       <CreditCard className="w-4 h-4" />
                                       <span>Buy with Card</span>
                                     </DropdownMenuItem>
                                   </DropdownMenuContent>
                                 </DropdownMenu>
                                </div>
                              </div>
                            </GlowCard>} />
                       </CardContent>
                   </Card>}
                  </div>
                </div>
                 </div>
               </ScrollArea>}

            {activeTab === "market" && <ScrollArea className="h-full">
                <div className="p-6">
                  <div className="space-y-6 max-w-6xl">
                {/* Market Header */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-3 mb-6">
                    <div>
                      <h1 className="text-3xl font-bold">The Market</h1>
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
                          <span className="text-xl font-bold text-white">{currentMarketValue.toLocaleString('en-US', {
                              maximumFractionDigits: 0
                            })}</span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={marketValueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="date" tick={{
                              fontSize: 12,
                              fill: 'rgba(255,255,255,0.7)'
                            }} />
                            <YAxis tick={{
                              fontSize: 12,
                              fill: 'rgba(255,255,255,0.7)'
                            }} />
                            <Tooltip labelStyle={{
                              color: '#000'
                            }} contentStyle={{
                              backgroundColor: 'rgba(0,0,0,0.8)',
                              border: '1px solid rgba(255,255,255,0.2)',
                              borderRadius: '8px'
                            }} formatter={value => [Number(value).toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            }), 'Market Value']} />
                            <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} strokeWidth={2} />
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
                            <XAxis dataKey="date" tick={{
                              fontSize: 12,
                              fill: 'rgba(255,255,255,0.7)'
                            }} />
                            <YAxis tick={{
                              fontSize: 12,
                              fill: 'rgba(255,255,255,0.7)'
                            }} tickFormatter={value => Math.round(value).toString()} />
                            <Tooltip labelStyle={{
                              color: '#000'
                            }} contentStyle={{
                              backgroundColor: 'rgba(0,0,0,0.8)',
                              border: '1px solid rgba(255,255,255,0.2)',
                              borderRadius: '8px'
                            }} formatter={value => [Math.round(Number(value)), 'Listings']} />
                            <Area type="monotone" dataKey="listings" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} strokeWidth={2} />
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
                      <div className="flex items-center justify-between mb-3">
                        <CardTitle className="text-lg md:text-2xl flex items-center space-x-2 text-white">
                          <span className="text-lg">🔥</span>
                          <span>Trending</span>
                        </CardTitle>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['daily', 'weekly', 'monthly', 'all time'].map(period => <Button key={period} variant={trendingTimeFilter === period ? "secondary" : "ghost"} size="sm" onClick={() => setTrendingTimeFilter(period)} className={`text-xs px-3 py-1 h-7 ${trendingTimeFilter === period ? "bg-white/20 text-white border-white/30" : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"}`}>
                            {period.charAt(0).toUpperCase() + period.slice(1)}
                          </Button>)}
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="space-y-3">
                        {trendingPlayers.map((player, idx) => (
                          <div key={`desktop-trending-${idx}`} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/15 md:hover:bg-white/20 transition-all duration-300 cursor-pointer">
                            <div className="w-12 h-12 rounded-full overflow-hidden">
                              <img 
                                src={player.image} 
                                alt={player.name} 
                                className="w-full h-full object-cover"
                                loading={idx < 3 ? 'eager' : 'lazy'}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-white">{player.name}</p>
                                  <p className={`text-xs ${player.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {player.change >= 0 ? '+' : ''}{formatNumberWithAbbreviation(player.change)}%{' '}
                                    {getMarketplacePrices(player.name, 'fighter').bestSellPrice ? 
                                      `${formatNumberWithAbbreviation(getMarketplacePrices(player.name, 'fighter').bestSellPrice)} sell` : ''}{' '}
                                    {getMarketplacePrices(player.name, 'fighter').bestBuyPrice ? 
                                      `${formatNumberWithAbbreviation(getMarketplacePrices(player.name, 'fighter').bestBuyPrice)} buy` : ''}
                                  </p>
                                </div>
                                {renderMarketplacePrices(player, getMarketplacePrices, isMobile, 'medium', () => handleSellClick(player), () => handleBuyClick(player))}
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
                        <CardTitle className="text-lg md:text-2xl flex items-center space-x-2 text-white">
                          <ArrowUpRight className="w-5 h-5 text-green-400" />
                           <span>Gainers</span>
                        </CardTitle>
                      </div>
                      <div className="flex space-x-2">
                        {[{
                          key: "daily",
                          label: "Daily"
                        }, {
                          key: "weekly",
                          label: "Weekly"
                        }, {
                          key: "monthly",
                          label: "Monthly"
                        }, {
                          key: "alltime",
                          label: "All Time"
                        }].map(filter => <Button key={filter.key} variant={gainersTimeFilter === filter.key ? "secondary" : "ghost"} size="sm" className={`text-xs ${gainersTimeFilter === filter.key ? "bg-white/20 text-white border-white/30" : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"}`} onClick={() => setGainersTimeFilter(filter.key)}>
                            {filter.label}
                          </Button>)}
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="space-y-3">
                        {topGainers.map((player, idx) => (
                          <div key={`desktop-gainers-${gainersTimeFilter}-${idx}`} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/15 md:hover:bg-white/20 transition-all duration-300 cursor-pointer">
                            <div className="w-12 h-12 rounded-full overflow-hidden">
                              <img 
                                src={player.image} 
                                alt={player.name} 
                                className="w-full h-full object-cover"
                                loading={idx < 3 ? 'eager' : 'lazy'}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-white">{player.name}</p>
                                  <p className={`text-xs ${player.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {player.change >= 0 ? '+' : ''}{formatNumberWithAbbreviation(player.change)}%{' '}
                                    {getMarketplacePrices(player.name, 'fighter').bestSellPrice ? 
                                      `${formatNumberWithAbbreviation(getMarketplacePrices(player.name, 'fighter').bestSellPrice)} sell` : ''}{' '}
                                    {getMarketplacePrices(player.name, 'fighter').bestBuyPrice ? 
                                      `${formatNumberWithAbbreviation(getMarketplacePrices(player.name, 'fighter').bestBuyPrice)} buy` : ''}
                                  </p>
                                </div>
                                {renderMarketplacePrices(player, getMarketplacePrices, isMobile, 'medium', () => handleSellClick(player), () => handleBuyClick(player))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* All Players List / Marketplace - Moved below gamers */}
                <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
                  <div className="absolute inset-0" style={{
                    backgroundImage: `
                      linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
                      linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
                    `,
                    backgroundSize: '4px 4px'
                  }} />
                   <CardHeader className="relative z-10">
                     <CardTitle className="text-2xl md:text-3xl flex items-center justify-between text-white">
                        <span>Marketplace</span>
                          <div className="flex items-center gap-1">
                             {/* Expandable Search */}
                             <div className="flex items-center">
                               {!searchExpanded ? <Button variant="outline" size="sm" className="bg-black/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-8 w-8" onClick={() => setSearchExpanded(true)}>
                                   <Search className="w-3 h-3" />
                                 </Button> : <div className="flex items-center animate-fade-in">
                                   <div className="relative">
                                     <Button variant="ghost" size="sm" className="absolute left-1 top-1/2 transform -translate-y-1/2 h-6 w-6 text-white hover:bg-white/20 z-10" onClick={() => {
                               setSearchTerm("");
                               setSearchExpanded(false);
                             }}>
                                       <X className="w-3 h-3" />
                                     </Button>
                                     <Input placeholder="search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onBlur={() => !searchTerm && setSearchExpanded(false)} className="pl-8 pr-3 h-8 text-xs bg-black/20 backdrop-blur-md border-white/30 text-white placeholder:text-gray-400 w-48 focus:bg-black/30 focus:border-white/40" autoFocus />
                                   </div>
                                 </div>}
                             </div>
                            
                            {/* Category Filter */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm" className="bg-black/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-8 w-8">
                                   <Layers className="w-3 h-3" />
                                 </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="center" className="w-40 bg-black/10 backdrop-blur-md border border-white/20 text-white z-[9999]">
                                <DropdownMenuItem onClick={() => setMarketplaceCategory("all")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${marketplaceCategory === "all" ? "bg-white/20" : ""}`}>
                                  <span>⚫ All</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setMarketplaceCategory("fighters")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${marketplaceCategory === "fighters" ? "bg-white/20" : ""}`}>
                                  <span>👊 Fighters</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setMarketplaceCategory("mobility")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${marketplaceCategory === "mobility" ? "bg-white/20" : ""}`}>
                                  <span>🚗 Mobility</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setMarketplaceCategory("accessories")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${marketplaceCategory === "accessories" ? "bg-white/20" : ""}`}>
                                  <span>💎 Accessories</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setMarketplaceCategory("emotes")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${marketplaceCategory === "emotes" ? "bg-white/20" : ""}`}>
                                  <span>💃 Emotes</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setMarketplaceCategory("packs")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${marketplaceCategory === "packs" ? "bg-white/20" : ""}`}>
                                  <span>🎁 Packs</span>
                                </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>

                            {/* Sort Dropdown */}
                            {isMobile ? <Drawer>
                                <DrawerTrigger asChild>
                                  <Button variant="outline" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-8 w-8">
                                    <ArrowUpDown className="w-3 h-3" />
                                  </Button>
                                </DrawerTrigger>
                                <DrawerContent className="bg-black/10 backdrop-blur-md border border-white/20 text-white">
                                   <DrawerHeader>
                                     <DrawerTitle className="text-center">Sort By</DrawerTitle>
                                   </DrawerHeader>
                                   <div className="px-4 pb-8 space-y-2">
                                     <Button variant="ghost" onClick={() => setMarketplaceSortBy("highest-price")} className={`w-full justify-start text-white hover:bg-white/10 ${marketplaceSortBy === "highest-price" ? "bg-white/20" : ""}`}>
                                        ⬆️ Highest Price
                                     </Button>
                                     <Button variant="ghost" onClick={() => setMarketplaceSortBy("lowest-price")} className={`w-full justify-start text-white hover:bg-white/10 ${marketplaceSortBy === "lowest-price" ? "bg-white/20" : ""}`}>
                                        ⬇️ Lowest Price
                                     </Button>
                                     <Button variant="ghost" onClick={() => setMarketplaceSortBy("highest-gain")} className={`w-full justify-start text-white hover:bg-white/10 ${marketplaceSortBy === "highest-gain" ? "bg-white/20" : ""}`}>
                                        📈 Highest % Gain
                                     </Button>
                                     <Button variant="ghost" onClick={() => setMarketplaceSortBy("highest-loss")} className={`w-full justify-start text-white hover:bg-white/10 ${marketplaceSortBy === "highest-loss" ? "bg-white/20" : ""}`}>
                                        📉 Highest % Loss
                                     </Button>
                                   </div>
                                 </DrawerContent>
                               </Drawer> : <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm" className="bg-black/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-8 w-8">
                                   <ArrowUpDown className="w-3 h-3" />
                                 </Button>
                              </DropdownMenuTrigger>
                               <DropdownMenuContent align="center" className="w-36 bg-black/10 backdrop-blur-md border border-white/20 text-white z-[9999]">
                                <DropdownMenuItem onClick={() => setMarketplaceSortBy("highest-price")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${marketplaceSortBy === "highest-price" ? "bg-white/20" : ""}`}>
                                  <span>⬆️ Highest Price</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setMarketplaceSortBy("lowest-price")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${marketplaceSortBy === "lowest-price" ? "bg-white/20" : ""}`}>
                                  <span>⬇️ Lowest Price</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setMarketplaceSortBy("highest-gain")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${marketplaceSortBy === "highest-gain" ? "bg-white/20" : ""}`}>
                                  <span>📈 Highest % Gain</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setMarketplaceSortBy("highest-loss")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${marketplaceSortBy === "highest-loss" ? "bg-white/20" : ""}`}>
                                  <span>📉 Highest % Loss</span>
                                </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>}

                            {/* Filter Dropdown - Price/Trend Filter */}
                            {isMobile ? <Drawer>
                                <DrawerTrigger asChild>
                                  <Button variant="outline" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-8 px-3">
                                    <Filter className="w-3 h-3 mr-1" />
                                    Filter
                                  </Button>
                                </DrawerTrigger>
                                <DrawerContent className="bg-black/10 backdrop-blur-md border border-white/20 text-white">
                                   <DrawerHeader>
                                     <DrawerTitle className="text-center">Filter by Rarity</DrawerTitle>
                                   </DrawerHeader>
                                   <div className="px-4 pb-8 space-y-2">
                                     <Button variant="ghost" onClick={() => setMarketplaceRarity("all")} className={`w-full justify-start text-white hover:bg-white/10 ${marketplaceRarity === "all" ? "bg-white/20" : ""}`}>
                                       <div className="w-3 h-3 rounded-full bg-black mr-2" />
                                       All Rarities
                                     </Button>
                                     <Button variant="ghost" onClick={() => setMarketplaceRarity("green")} className={`w-full justify-start text-white hover:bg-white/10 ${marketplaceRarity === "green" ? "bg-white/20" : ""}`}>
                                       <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                                       Regular
                                     </Button>
                                     <Button variant="ghost" onClick={() => setMarketplaceRarity("blue")} className={`w-full justify-start text-white hover:bg-white/10 ${marketplaceRarity === "blue" ? "bg-white/20" : ""}`}>
                                       <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                                       Rare
                                     </Button>
                                     <Button variant="ghost" onClick={() => setMarketplaceRarity("silver")} className={`w-full justify-start text-white hover:bg-white/10 ${marketplaceRarity === "silver" ? "bg-white/20" : ""}`}>
                                       <div className="w-3 h-3 rounded-full bg-gray-300 mr-2" />
                                       Legendary
                                     </Button>
                                     <Button variant="ghost" onClick={() => setMarketplaceRarity("gold")} className={`w-full justify-start text-white hover:bg-white/10 ${marketplaceRarity === "gold" ? "bg-white/20" : ""}`}>
                                       <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2" />
                                       Mythical
                                     </Button>
                                     <Button variant="ghost" onClick={() => setMarketplaceRarity("special")} className={`w-full justify-start text-white hover:bg-white/10 ${marketplaceRarity === "special" ? "bg-white/20" : ""}`}>
                                       <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 mr-2" />
                                       Special
                                     </Button>
                                   </div>
                                </DrawerContent>
                              </Drawer> : <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                   <Button variant="outline" size="sm" className="bg-black/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-8 w-8">
                                     <Filter className="w-3 h-3" />
                                   </Button>
                                </DropdownMenuTrigger>
                                 <DropdownMenuContent align="center" className="w-32 bg-black/10 backdrop-blur-md border border-white/20 text-white z-[9999]">
                                   <DropdownMenuItem onClick={() => setMarketplaceRarity("all")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${marketplaceRarity === "all" ? "bg-white/20" : ""}`}>
                                     <div className="w-3 h-3 rounded-full bg-black" />
                                     <span>All Rarities</span>
                                   </DropdownMenuItem>
                                   <DropdownMenuItem onClick={() => setMarketplaceRarity("green")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${marketplaceRarity === "green" ? "bg-white/20" : ""}`}>
                                     <div className="w-3 h-3 rounded-full bg-green-500" />
                                     <span>Regular</span>
                                   </DropdownMenuItem>
                                   <DropdownMenuItem onClick={() => setMarketplaceRarity("blue")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${marketplaceRarity === "blue" ? "bg-white/20" : ""}`}>
                                     <div className="w-3 h-3 rounded-full bg-blue-500" />
                                     <span>Rare</span>
                                   </DropdownMenuItem>
                                   <DropdownMenuItem onClick={() => setMarketplaceRarity("silver")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${marketplaceRarity === "silver" ? "bg-white/20" : ""}`}>
                                     <div className="w-3 h-3 rounded-full bg-gray-300" />
                                     <span>Legendary</span>
                                   </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setMarketplaceRarity("gold")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${marketplaceRarity === "gold" ? "bg-white/20" : ""}`}>
                                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                      <span>Mythical</span>
                                    </DropdownMenuItem>
                                   <DropdownMenuItem onClick={() => setMarketplaceRarity("special")} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${marketplaceRarity === "special" ? "bg-white/20" : ""}`}>
                                     <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400" />
                                     <span>Special</span>
                                   </DropdownMenuItem>
                                 </DropdownMenuContent>
                              </DropdownMenu>}
                          </div>
                      </CardTitle>
                    </CardHeader>
                   <CardContent className="relative z-10">
                     <div className="space-y-3">
                       {filteredAndSortedMarketplacePlayers.slice(0, visiblePlayers).map((player, idx) => <div key={idx} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg hover:bg-white/15 md:hover:bg-white/20 transition-all duration-300 mb-3 last:mb-0 cursor-pointer">
                          <div className="w-16 h-16 rounded-full overflow-hidden">
                            <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-lg md:text-xl font-semibold text-white">{player.name}</p>
                                  <p className={`text-sm ${player.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                                    {player.trend === 'up' ? '+' : ''}{(((player.price - player.lastSale) / player.lastSale) * 100).toFixed(1)}%
                                  </p>
                                </div>
                               {renderMarketplacePrices(player, getMarketplacePrices, isMobile, 'large', () => handleSellClick(player), () => handleBuyClick(player))}
                             </div>
                          </div>
                        </div>)}
                    </div>
                    
                      {visiblePlayers < filteredAndSortedMarketplacePlayers.length && <div className="mt-6 text-center">
                          <Button variant="outline" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20" onClick={() => setVisiblePlayers(prev => Math.min(prev + 10, filteredAndSortedMarketplacePlayers.length))}>
                            Load More
                          </Button>
                        </div>}
                  </CardContent>
                 </Card>

                </div>
              </div>
            </ScrollArea>}

            {activeTab === "locker" && <ScrollArea className="h-full">
                <div className="p-6">
                  <div className="space-y-6 max-w-4xl">
                {/* Desktop Locker Header */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <div>
                      <h1 className="text-3xl font-bold">My Locker</h1>
                    </div>
                  </div>
                </div>

                {!authenticated ? <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
                    <div className="absolute inset-0" style={{
                    backgroundImage: `
                        linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
                        linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
                      `,
                    backgroundSize: '4px 4px'
                  }} />
                    <CardContent className="p-6 text-center relative z-10">
                       <Archive className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                       <h3 className="text-lg font-semibold mb-4 text-white">Login to View Your Locker</h3>
                       <Button onClick={login} variant="secondary" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30">
                         Login
                       </Button>
                    </CardContent>
                  </Card> : <div className="space-y-6">
                     {/* Desktop Fighters Category */}
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
                          <CardTitle className="text-white">
                            <span>Fighters</span>
                          </CardTitle>
                         <CardDescription className="text-gray-300">Your fighters collection</CardDescription>
                       </CardHeader>
                       <CardContent className="relative z-10">
                         <div className="text-center py-12">
                           <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                             <Archive className="w-8 h-8 text-gray-400" />
                           </div>
                           <p className="text-gray-300">No fighters owned yet</p>
                           <p className="text-sm text-gray-400 mt-1">Visit the store to purchase fighters</p>
                           <Button onClick={() => setActiveTab("store")} variant="secondary" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 mt-4">
                             Browse Store
                           </Button>
                         </div>
                       </CardContent>
                     </Card>

                    {/* Desktop Accessories Category */}
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
                         <CardTitle className="text-white">
                           <span>Accessories</span>
                         </CardTitle>
                        <CardDescription className="text-gray-300">Your accessories collection</CardDescription>
                      </CardHeader>
                       <CardContent className="relative z-10">
                         <div className="text-center py-12">
                           <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                             <Archive className="w-8 h-8 text-gray-400" />
                           </div>
                           <p className="text-gray-300">No accessories owned yet</p>
                           <p className="text-sm text-gray-400 mt-1">Visit the store to purchase shoes, backpacks, and hats</p>
                           <Button onClick={() => setActiveTab("store")} variant="secondary" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 mt-4">
                             Browse Store
                           </Button>
                         </div>
                       </CardContent>
                    </Card>

                     {/* Desktop Mobility Category */}
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
                          <CardTitle className="text-white">
                            <span>Mobility</span>
                          </CardTitle>
                         <CardDescription className="text-gray-300">Your vehicles collection</CardDescription>
                       </CardHeader>
                       <CardContent className="relative z-10">
                         <div className="text-center py-12">
                           <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                             <Archive className="w-8 h-8 text-gray-400" />
                           </div>
                           <p className="text-gray-300">No vehicles owned yet</p>
                           <p className="text-sm text-gray-400 mt-1">Visit the store to purchase cars, golf buggies, and more</p>
                           <Button onClick={() => setActiveTab("store")} variant="secondary" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 mt-4">
                             Browse Store
                           </Button>
                         </div>
                       </CardContent>
                     </Card>

                     {/* Desktop Packs Category */}
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
                          <CardTitle className="text-white">
                            <span>Packs</span>
                          </CardTitle>
                         <CardDescription className="text-gray-300">Your packs collection</CardDescription>
                       </CardHeader>
                       <CardContent className="relative z-10">
                         <div className="text-center py-12">
                           <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                             <Archive className="w-8 h-8 text-gray-400" />
                           </div>
                           <p className="text-gray-300">No packs owned yet</p>
                           <p className="text-sm text-gray-400 mt-1">Visit the store to purchase item packs</p>
                           <Button onClick={() => setActiveTab("store")} variant="secondary" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 mt-4">
                             Browse Store
                           </Button>
                         </div>
                       </CardContent>
                     </Card>
                    </div>}
               </div>
                </div>
              </ScrollArea>}
          </main>

          {/* Right Sidebar - Desktop only */}
          <aside className="w-80 bg-black border-l border-border p-6 flex flex-col h-screen overflow-y-auto">
            <Tabs value={rightSidebarTab} onValueChange={setRightSidebarTab} className="w-full flex flex-col h-full">
              <TabsList className="grid w-full grid-cols-2 flex-shrink-0 bg-black">
                <TabsTrigger value="notifications" className="flex items-center gap-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:transition-transform after:duration-300 after:scale-x-0 data-[state=active]:after:scale-x-100">
                  <Bell className="w-4 h-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="rankings" className="flex items-center gap-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:transition-transform after:duration-300 after:scale-x-0 data-[state=active]:after:scale-x-100">
                  <Medal className="w-4 h-4" />
                  Rankings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="notifications" className="bg-black">
                <div className="text-center py-8 flex-1 flex flex-col justify-center">
                  <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <p className="text-sm text-muted-foreground mt-2">
                    You'll see game updates and important announcements here
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="rankings" className="flex-1 overflow-y-auto space-y-2 -mt-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-black">
                <p className="text-sm text-muted-foreground text-center pb-2 pt-6">Weekly prize pool: $0</p>
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
                points: 14890,
                avatar: "👑"
              }, {
                rank: 3,
                name: "ChainWarrior",
                level: 14,
                points: 14320,
                avatar: "👑"
              }, {
                rank: 4,
                name: "TokenSlayer",
                level: 13,
                points: 13780,
                avatar: "👑"
              }, {
                rank: 5,
                name: "NFTChampion",
                level: 13,
                points: 13240,
                avatar: "👑"
              }, {
                rank: 6,
                name: "DeFiGamer",
                level: 12,
                points: 12890,
                avatar: "👑"
              }, {
                rank: 7,
                name: "MetaPlayer",
                level: 12,
                points: 12450,
                avatar: "👑"
              }, {
                rank: 8,
                name: "Web3Hero",
                level: 12,
                points: 12120,
                avatar: "👑"
              }, {
                rank: 9,
                name: "CoinMaster",
                level: 11,
                points: 11780,
                avatar: "👑"
              }, {
                rank: 10,
                name: "BlockHero",
                level: 11,
                points: 11340,
                avatar: "👑"
              }, {
                rank: 11,
                name: "SmartTrader",
                level: 10,
                points: 10920,
                avatar: "👑"
              }, {
                rank: 12,
                name: "CyberNinja",
                level: 10,
                points: 10540,
                avatar: "👑"
              }, {
                rank: 13,
                name: "QuantumGamer",
                level: 10,
                points: 10180,
                avatar: "👑"
              }, {
                rank: 14,
                name: "PixelMaster",
                level: 9,
                points: 9840,
                avatar: "💪"
              }, {
                rank: 15,
                name: "CodeWarrior",
                level: 9,
                points: 9520,
                avatar: "💪"
              }, {
                rank: 16,
                name: "AlgoTrader",
                level: 9,
                points: 9210,
                avatar: "💪"
              }, {
                rank: 17,
                name: "BitCrusher",
                level: 8,
                points: 8920,
                avatar: "🔥"
              }, {
                rank: 18,
                name: "EtherLord",
                level: 8,
                points: 8650,
                avatar: "🔥"
              }, {
                rank: 19,
                name: "GameChanger",
                level: 8,
                points: 8390,
                avatar: "🔥"
              }, {
                rank: 20,
                name: "TechSavvy",
                level: 8,
                points: 8140,
                avatar: "🔥"
              }, {
                rank: 21,
                name: "DigitalNomad",
                level: 7,
                points: 7910,
                avatar: "⭐"
              }, {
                rank: 22,
                name: "CryptoSage",
                level: 7,
                points: 7690,
                avatar: "⭐"
              }, {
                rank: 23,
                name: "BlockBuilder",
                level: 7,
                points: 7480,
                avatar: "⭐"
              }, {
                rank: 24,
                name: "TokenHunter",
                level: 7,
                points: 7280,
                avatar: "⭐"
              }, {
                rank: 25,
                name: "ChainLink",
                level: 7,
                points: 7090,
                avatar: "⭐"
              }].map(player => <div key={player.rank} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0 w-8 text-center">
                      {player.rank <= 3 ? <Medal className={`w-5 h-5 ${player.rank === 1 ? 'text-yellow-400' : player.rank === 2 ? 'text-gray-300' : 'text-amber-600'}`} /> : <span className="text-sm font-medium text-muted-foreground">#{player.rank}</span>}
                    </div>
                    
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-sm">{player.avatar}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{player.name}</p>
                        <Badge variant="outline" className="text-xs">Lv.{player.level}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{player.points.toLocaleString()} XP</p>
                    </div>
                  </div>)}
              </TabsContent>
            </Tabs>
          </aside>
        </div>
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
              points: 14890,
              avatar: "👑"
            }, {
              rank: 3,
              name: "ChainWarrior",
              level: 14,
              points: 14320,
              avatar: "👑"
            }, {
              rank: 4,
              name: "TokenSlayer",
              level: 13,
              points: 13780,
              avatar: "👑"
            }, {
              rank: 5,
              name: "NFTChampion",
              level: 13,
              points: 13240,
              avatar: "👑"
            }, {
              rank: 6,
              name: "DeFiGamer",
              level: 12,
              points: 12890,
              avatar: "👑"
            }, {
              rank: 7,
              name: "MetaPlayer",
              level: 12,
              points: 12450,
              avatar: "👑"
            }, {
              rank: 8,
              name: "Web3Hero",
              level: 12,
              points: 12120,
              avatar: "👑"
            }, {
              rank: 9,
              name: "CoinMaster",
              level: 11,
              points: 11780,
              avatar: "👑"
            }, {
              rank: 10,
              name: "BlockHero",
              level: 11,
              points: 11340,
              avatar: "👑"
            }].map(player => <div key={player.rank} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="flex-shrink-0 w-8 text-center">
                    {player.rank <= 3 ? <Medal className={`w-5 h-5 ${player.rank === 1 ? 'text-yellow-400' : player.rank === 2 ? 'text-gray-300' : 'text-amber-600'}`} /> : <span className="text-sm font-medium text-white/60">#{player.rank}</span>}
                  </div>
                  
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-sm bg-white/10 text-white border border-white/20">{player.avatar}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white">{player.name}</p>
                      <Badge variant="outline" className="text-xs bg-white/10 text-white border-white/20">Lv.{player.level}</Badge>
                    </div>
                    <p className="text-xs text-white/60">{player.points.toLocaleString()} XP</p>
                  </div>
                </div>)}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-border px-4 pt-4 pb-5 z-50">
        <div className="flex items-center justify-around">
          {tabItems.slice(0, 5).map(tab => <button key={tab.id} onClick={() => handleTabClick(tab.id)} className={`flex flex-col items-center space-y-1 px-2 py-1 rounded-lg transition-colors ${activeTab === tab.id ? "text-primary" : "text-muted-foreground"}`}>
              <tab.icon className="w-7 h-7" />
            </button>)}
        </div>
      </nav>

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

      {/* Buy Dialog - Mobile: Drawer, Desktop: Dialog */}
      {isMobile ? <Drawer open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
          <DrawerContent className="bg-black/10 backdrop-blur-md border border-white/20 text-white">
            <DrawerHeader>
              <DrawerTitle className="text-white text-center">Buy {selectedPlayer?.name}</DrawerTitle>
            </DrawerHeader>
            <div className="flex flex-col space-y-3 p-4">
              <Button className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 hover:text-white transition-all duration-300" onClick={() => {
            toast({
              title: "Card Payment",
              description: "Card payment functionality coming soon!"
            });
            setBuyDialogOpen(false);
          }}>
                <CreditCard className="w-4 h-4 mr-2" />
                Buy with Card
              </Button>
              <Button variant="outline" className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 hover:text-white transition-all duration-300" onClick={() => {
            toast({
              title: "Coin Payment",
              description: "Coin payment functionality coming soon!"
            });
            setBuyDialogOpen(false);
          }}>
                <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-4 h-4 mr-2" />
                Buy with Coins
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white transition-all duration-300" onClick={() => setBuyDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </DrawerContent>
        </Drawer> : <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
          <DialogContent className="sm:max-w-md bg-black/10 backdrop-blur-md border border-white/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Buy {selectedPlayer?.name}</DialogTitle>
              <DialogDescription className="text-white/80">
                Choose your payment method to purchase this player.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col space-y-3 pt-4">
              <Button className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 hover:text-white transition-all duration-300" onClick={() => {
            toast({
              title: "Card Payment",
              description: "Card payment functionality coming soon!"
            });
            setBuyDialogOpen(false);
          }}>
                <CreditCard className="w-4 h-4 mr-2" />
                Buy with Card
              </Button>
              <Button variant="outline" className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 hover:text-white transition-all duration-300" onClick={() => {
            toast({
              title: "Coin Payment",
              description: "Coin payment functionality coming soon!"
            });
            setBuyDialogOpen(false);
          }}>
                <Coins className="w-4 h-4 mr-2" />
                Buy with Coins
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white transition-all duration-300" onClick={() => setBuyDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>}

        {/* Pre-Order Dialog */}
        <PreOrderDialog open={isPreOrderOpen} onOpenChange={setIsPreOrderOpen}>
          <div />
        </PreOrderDialog>
    </div>;
};
export default Game;