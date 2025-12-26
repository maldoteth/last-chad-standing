import React, { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore, StoreItem } from "@/context/storeData";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GlowCard } from "@/components/ui/spotlight-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { getCurrentLevel, getProgressToNextLevel } from "@/lib/progressSystem";
import { getTierIcon } from "@/lib/utils";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Coins, ShoppingBag, Users, Package, CreditCard, Trophy, Star, Target, ChevronRight, Bell, Play, TrendingUp, UserPlus, Medal, Info, Gift, Gamepad, Instagram, Layers, BookOpen, Youtube, X, RotateCcw, MessageCircle, } from "lucide-react";
import PreOrderDialog from "@/components/PreOrderDialog";
import { Level, useRank } from "@/context/rankData";
import { useApi } from "@/Api/apiFunction";
import { useProfile } from "@/context/profileContext";
import ObjectivesCard from "@/components/objectivesCard";
import SessionSigners from "../session-signers";

const HomeTab = () => {
    const isMobile = useIsMobile();
    const [isPreOrderOpen, setIsPreOrderOpen] = useState(false);
    const [objectivesView, setObjectivesView] = useState<"weekly" | "daily">("weekly");

    const [sellDialogOpen, setSellDialogOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
    const objectivesRef = useRef<HTMLDivElement>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const { post, get } = useApi()
    const {
        toast
    } = useToast();
    const {
        login,
        authenticated,
        user
    } = usePrivy();
    const { levelsData } = useRank()

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

    return <>
        <SessionSigners isSigner={profile?.isSigner} isAdmin={false} quorumId={profile?.quorumId} />

        {isMobile &&
            <>
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
                                        Preorder now
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
                                    <div className="space-y-2 max-h-60 overflow-y-auto custom-scroll">
                                        {levelsData?.map((level: Level, index) => {
                                            const isCurrentLevel = currentLevel === level.id;
                                            const isUnlocked = (userBalance?.xp || 0) >= level?.min_xp;
                                            return <div key={index} className={`flex items-center justify-between p-2 rounded-md transition-colors ${isCurrentLevel ? 'bg-primary/20 border border-primary/30' : isUnlocked ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-800/50 opacity-60'}`}>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-base">{level?.icon}</span>
                                                    <span className="text-sm font-medium text-white">{level.name}</span>
                                                </div>
                                                <span className="text-xs text-gray-400">
                                                    {level.level >= 10 ? "10,000+ XP" : `${level.min_xp}-${level.max_xp} XP`}
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
                                    <div className="space-y-2 max-h-60 overflow-y-auto custom-scroll">
                                        {levelsData?.map((level: Level, index) => {
                                            const isCurrentLevel = currentLevel === level.id;
                                            const isUnlocked = (userBalance?.xp || 0) >= level.min_xp;
                                            return <div key={index} className={`flex items-center justify-between p-2 rounded-md transition-colors ${isCurrentLevel ? 'bg-white/20 border border-primary/30' : isUnlocked ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-800/50 opacity-60'}`}>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-base">{level?.icon}</span>
                                                    <span className="text-sm font-medium">{level.name}</span>
                                                </div>
                                                <span className="text-xs text-gray-400">
                                                    {level.level >= 10 ? "10,000+ XP" : `${level.min_xp}-${level.min_xp} XP`}
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
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-1 mb-2">
                                    <Target className="w-4 h-4 text-white" />
                                    <span className="text-xs font-medium text-white">Objectives</span>
                                </div>
                                <h3 className="text-sm font-bold mb-1">Smash that XP</h3>
                                <p className="text-gray-300 text-xs mb-3">by completing objectives
                                </p>
                                <Button variant="secondary" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 text-xs h-7 relative z-10 transition-all duration-300 w-full" onClick={() => {
                                    setObjectivesView("daily");
                                    setTimeout(() => {
                                        objectivesRef.current?.scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'start'
                                        });
                                    }, 100);
                                }}>
                                    Show Objectives
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
                                                <img src="/lovable-uploads/aa517b6d-c98b-4876-9f58-97246b49844b.png" alt="LCS Coin" className="mr-2 h-4 w-4" />
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
                                            <img src="/lovable-uploads/aa517b6d-c98b-4876-9f58-97246b49844b.png" alt="LCS Coin" className="w-4 h-4" />
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
                                <Button variant="outline" size="sm" className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300" onClick={() => handleSetTabParams("store")}>
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
                                <Button variant="outline" size="sm" className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300" onClick={() => handleSetTabParams("market")}>
                                    Browse Market
                                </Button>
                            </CardContent>
                        </GlowCard>
                    </div>
                </div>

                {/* Objectives - Collapsible on mobile */}
                <div className="px-4 pb-4" ref={objectivesRef}>
                    <ObjectivesCard
                        objectivesView={objectivesView}
                        setObjectivesView={setObjectivesView}
                        isObjectivesGlowing={true}
                    />
                </div>
            </>}



        {!isMobile && <ScrollArea className="h-full">
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
                                        Preorder now
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tournament Complete Card */}
                    <GlowCard className="col-span-4 cursor-pointer">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <Target className="w-5 h-5 text-white" />
                                <span className="text-sm font-medium text-white">Objectives</span>
                            </div>
                            <h3 className="text-lg font-bold mb-2">Smash that XP</h3>
                            <p className="text-gray-300 text-sm mb-4">by completing objectives</p>
                            <Button variant="secondary" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 w-full relative z-10 transition-all duration-300" onClick={() => {
                                setObjectivesView("daily");
                            }}>
                                Show Objectives
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
                                            <img src="/lovable-uploads/aa517b6d-c98b-4876-9f58-97246b49844b.png" alt="LCS Coin" className="mr-2 h-4 w-4" />
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
                                        <img src="/lovable-uploads/aa517b6d-c98b-4876-9f58-97246b49844b.png" alt="LCS Coin" className="w-4 h-4" />
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
                            <Button variant="secondary" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 w-full transition-all duration-300" onClick={() => handleSetTabParams("store")}>
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
                            <Button variant="secondary" size="sm" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 w-full transition-all duration-300" onClick={() => handleSetTabParams("market")}>
                                Browse Market
                            </Button>
                        </CardContent>
                    </GlowCard>
                </div>
            </div>
        </ScrollArea>}
        <PreOrderDialog open={isPreOrderOpen} onOpenChange={setIsPreOrderOpen}>
            <div />
        </PreOrderDialog>
    </>;
};
export default HomeTab;