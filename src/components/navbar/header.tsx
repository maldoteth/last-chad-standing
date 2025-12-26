import React, { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore, StoreItem } from "@/context/storeData";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

import { ProgressBar } from "@/components/ProgressBar";
import { getTierIcon } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Bell, Medal, LogOut, X, Edit3, Check, Copy, CreditCard, Upload } from "lucide-react";
import { tabItems } from "@/lib/data";
import { useRank } from "@/context/rankData";
import { useApi } from "@/Api/apiFunction";
import BuyDialogContent from "../buyDialogContent";
import { useProfile } from "@/context/profileContext";
import { uploadFile } from "@/Api/uploadFile";
import { handleError } from "@/Api/handleError";
import NotificationsList from "../notificationList";
import { useNotifications } from "@/context/notificationContext";

const Header = () => {
    const isMobile = useIsMobile();
    const [activeTab, setActiveTab] = useState("home");
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const [isRankingsOpen, setIsRankingsOpen] = useState(false);
    const [buyDialogOpen, setBuyDialogOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
    const { rankingData } = useRank()
    const { get } = useApi()
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
    const [searchParams, setSearchParams] = useSearchParams();

    const {
        userBalance,
        loading: storeLoading
    } = useStore();
    const {
        profile,
        loading,
        createProfile,
        updateUsername,
        // updateAvatar
    } = useProfile();

    // Username editing state
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [editingUsername, setEditingUsername] = useState('');
    const { unreadCount } = useNotifications()
    // Avatar editing state
    const [isEditingAvatar, setIsEditingAvatar] = useState(false);
    const [selectedAvatarPreview, setSelectedAvatarPreview] = useState('');
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    // Handle username update
    const handleUsernameUpdate = async () => {

        try {
            const apiData = { name: editingUsername.trim(), profileImage: selectedAvatarPreview }
            await updateUsername(apiData);
            setIsEditingUsername(false);
            setEditingUsername('');
            setIsEditingAvatar(false);
            setSelectedAvatarPreview('');
        } catch (error) {
        }
    };

    // Handle avatar file selection
    const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setIsUploadingAvatar(true)
            const res = await uploadFile(file)
            setSelectedAvatarPreview(res?.image);
        } catch (error) {
            handleError(error)
        }
        finally {
            setIsUploadingAvatar(false)
        }
    };

    // Handle wallet address copy
    const handleCopyWalletAddress = async () => {
        if (!user?.linkedAccounts?.length) {
            toast({
                title: "No wallet connected",
                description: "Please connect a wallet first",
                variant: "destructive"
            });
            return;
        }
        const wallet = user.linkedAccounts.find(account => account.type === 'wallet');
        if (!wallet) {
            toast({
                title: "No wallet found",
                description: "No wallet address available to copy",
                variant: "destructive"
            });
            return;
        }
        try {
            await navigator.clipboard.writeText(wallet.address);
            toast({
                title: "Address copied!",
                description: `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)} copied to clipboard`,
                icon: <img src="/base-logo.png" alt="Base" className="w-8 h-8 rounded-md" />
            });
        } catch (error) {
            toast({
                title: "Copy failed",
                description: "Failed to copy wallet address",
                variant: "destructive"
            });
        }
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

    const handleTabClick = (tabId: string) => {
        setSearchParams({ tab: tabId });
    };
    useEffect(() => {
        const tabFromUrl = searchParams.get("tab");
        if (tabFromUrl) {
            setActiveTab(tabFromUrl);
        }
        const referred_by = searchParams?.get('ref') || ''
        if (referred_by) {
            sessionStorage.setItem('referred_by', referred_by)
        }
    }, [searchParams]);

    return (
        <>
            <header className="bg-black lg:border-b border-border px-4 py-3 lg:px-6 lg:py-4">
                <div className="flex items-center justify-between">
                    <img src="/lovable-uploads/fa645b0b-fcbe-46f6-9054-45d5ab0929d6.png" alt="LCS Fist Logo" className="h-10 lg:h-12 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate("/")} />

                    {/* Desktop Navigation - hidden on mobile */}
                    <div className="hidden lg:flex items-center justify-center flex-1">
                        <nav className="flex items-center justify-center space-x-6 ml-12">
                            {tabItems?.filter(tab => tab.id !== "coins")?.map(tab => <button key={tab.id} onClick={() => handleTabClick(tab.id)} className={`relative flex items-center justify-center px-3 py-2 text-sm font-medium transition-all duration-300 ${activeTab === tab.id ? "text-foreground after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-100 after:transition-transform after:duration-300" : "text-muted-foreground hover:text-foreground after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"}`}>
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
                                <div className="relative">
                                    <Bell className="w-6 h-6 text-muted-foreground hover:text-foreground" />
                                    {unreadCount > 0 && <div className="absolute -top-2 -right-2 ">
                                        <div className="text-[10px] bg-white flex justify-center items-center text-red-500 rounded-full h-4 w-4 ">{unreadCount}</div>
                                    </div>}
                                </div>
                            </button>
                        </div>

                        {authenticated ? isMobile ? <Sheet>
                            <SheetTrigger asChild>
                                <Avatar className="w-7 h-7 lg:w-8 lg:h-8 cursor-pointer">
                                    {profile?.profileImage && <AvatarImage src={profile?.profileImage} />}
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
                                                <div
                                                    className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all overflow-hidden border border-white/20"
                                                    onClick={() => {
                                                        setIsEditingAvatar(true);
                                                        setSelectedAvatarPreview(profile?.profileImage || '');
                                                    }}
                                                >
                                                    {profile?.profileImage ? (
                                                        <img src={profile?.profileImage} alt="Avatar preview" className="w-full h-full object-cover" />
                                                    ) : profile?.avatar_url ? (
                                                        profile?.avatar_url || '👤'
                                                    ) : (
                                                        <Edit3 className="w-8 h-8 text-white/50" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col space-y-1">
                                                    <p className="text-sm font-medium leading-none text-white">
                                                        {loading ? "Loading profile..." : profile?.name || 'Profile Error'}
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
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="text-2xl">
                                                        <img src="/lovable-uploads/c32465ca-8811-443a-a73c-b57225210592.png" alt="Coin" className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-white">Coin Balance</span>
                                                        <span className="text-xs text-gray-200">{userBalance?.coins}</span>
                                                    </div>
                                                </div>
                                                <Button size="sm" variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white transition-all duration-300 text-xs px-2 py-1" onClick={() => {
                                                    setSelectedPlayer(null);
                                                    setBuyDialogOpen(true);
                                                }}>
                                                    Buy
                                                </Button>
                                            </div>
                                        </div>

                                        <Button onClick={logout} variant="outline" className="w-full bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white transition-all duration-300">
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Sign Out
                                        </Button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet> : <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="w-7 h-7 lg:w-8 lg:h-8 cursor-pointer">
                                    {profile?.profileImage && <AvatarImage src={profile?.profileImage} />}
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
                                            <div
                                                className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all overflow-hidden border border-white/20 flex-shrink-0"
                                                onClick={() => {
                                                    setIsEditingAvatar(true);
                                                    setSelectedAvatarPreview(profile?.profileImage || '');
                                                }}
                                            >
                                                {profile?.profileImage ? (
                                                    <img src={profile?.profileImage} alt="Avatar preview" className="w-full h-full object-cover" />
                                                ) : profile?.avatar_url ? (
                                                    profile?.avatar_url || '👤'
                                                ) : (
                                                    <Edit3 className="w-8 h-8 text-white/50" />
                                                )}
                                            </div>
                                            <div className="flex flex-col space-y-1 flex-1">
                                                {isEditingUsername ? <div className="flex items-center space-x-2">
                                                    <Input value={editingUsername} onChange={e => setEditingUsername(e.target.value)} className="bg-transparent border-white/20 text-white text-sm h-6 px-2" placeholder="Enter username" maxLength={20} onKeyDown={e => {
                                                        if (e.key === 'Enter') {
                                                            handleUsernameUpdate();
                                                        } else if (e.key === 'Escape') {
                                                            setIsEditingUsername(false);
                                                            setEditingUsername('');
                                                        }
                                                    }} />
                                                    <div className="flex items-center space-x-1">
                                                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-green-500/20 text-green-400 hover:text-green-300" onClick={handleUsernameUpdate} disabled={loading}>
                                                            <Check className="w-3 h-3" />
                                                        </Button>
                                                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-red-500/20 text-red-400 hover:text-red-300" onClick={() => {
                                                            setIsEditingUsername(false);
                                                            setEditingUsername('');
                                                        }}>
                                                            <X className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div> : <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium leading-none text-white">
                                                        {loading ? "Loading profile..." : profile?.name || 'Profile Error'}
                                                    </p>
                                                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-300" onClick={() => {
                                                        setEditingUsername(profile?.name || '');
                                                        setIsEditingUsername(true);
                                                    }}>
                                                        <Edit3 className="w-3 h-3" />
                                                    </Button>
                                                </div>}
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
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="text-2xl">
                                                    <img src="/lovable-uploads/c32465ca-8811-443a-a73c-b57225210592.png" alt="Coin" className="w-6 h-6" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-white">Coin Balance</span>
                                                    <span className="text-xs text-gray-200">{userBalance?.coins}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Button size="sm" variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white transition-all duration-300 text-xs px-2 py-1" onClick={handleCopyWalletAddress}>
                                                    <Copy className="w-3 h-3" />
                                                </Button>
                                                <Button size="sm" variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white transition-all duration-300 text-xs px-2 py-1" onClick={() => {
                                                    setSelectedPlayer(null);
                                                    setBuyDialogOpen(true);
                                                }}>
                                                    Buy
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <DropdownMenuSeparator className="bg-white/20" />

                                    {isEditingAvatar && (
                                        <div className="px-3 py-3 border-b border-white/20">
                                            <p className="text-xs font-medium text-white/70 mb-3">Upload New Avatar:</p>

                                            {/* Preview */}
                                            {selectedAvatarPreview && (
                                                <div className="mb-3 flex justify-center">
                                                    <div className="w-20 h-20 rounded-full overflow-hidden border border-white/20">
                                                        <img src={selectedAvatarPreview} alt="Preview" className="w-full h-full object-cover" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Hidden file input */}
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarFileSelect}
                                                className="hidden"
                                            />

                                            {/* Upload button */}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-full bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white transition-all duration-300 mb-2 text-xs"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <Upload className="w-3 h-3 mr-2" />
                                                Choose Image
                                            </Button>

                                            {/* Action buttons */}
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="flex-1 h-6 hover:bg-green-500/20 text-green-400 hover:text-green-300"
                                                    onClick={handleUsernameUpdate}
                                                    disabled={isUploadingAvatar || loading}
                                                >
                                                    <Check className="w-3 h-3 mr-1" />
                                                    {isUploadingAvatar ? 'Uploading...' : 'Save'}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="flex-1 h-6 hover:bg-red-500/20 text-red-400 hover:text-red-300"
                                                    onClick={() => {
                                                        setIsEditingAvatar(false);
                                                        setSelectedAvatarPreview('');
                                                    }}
                                                >
                                                    <X className="w-3 h-3 mr-1" />
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    <DropdownMenuItem onClick={logout} className="flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 hover:text-white transition-all duration-300">
                                        <LogOut className="w-4 h-4" />
                                        <span>Sign Out</span>
                                    </DropdownMenuItem>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu> : <Button onClick={login} variant="outline" size="sm">
                            Log In
                        </Button>}
                    </div>
                </div>
            </header>
            {/* Mobile Notifications Drawer */}
            <Drawer open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
                <DrawerContent className="bg-black/20 backdrop-blur-md border-white/10">
                    <DrawerHeader>
                        <DrawerTitle className="text-center text-white">Notifications</DrawerTitle>
                    </DrawerHeader>
                    <div className="px-4 pb-6">
                        <NotificationsList />
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
                            {
                                rankingData?.map(player => <div key={player?.id} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                                    <div className="flex-shrink-0 w-8 text-center">
                                        {player?.level <= 3 ? <Medal className={`w-5 h-5 ${player?.level === 1 ? 'text-yellow-400' : player?.level === 2 ? 'text-gray-300' : 'text-amber-600'}`} /> : <span className="text-sm font-medium text-white/60">#{player?.level}</span>}
                                    </div>

                                    <Avatar className="w-8 h-8">
                                        {player?.user_id?.profileImage && <AvatarImage src={player?.user_id?.profileImage} />}
                                        <AvatarFallback className="text-sm bg-white/10 text-white border border-white/20">
                                            {getTierIcon(Number(player.total_XP))}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-white truncate max-w-[100px]">{player?.user_id?.name}</p>
                                            <Badge variant="outline" className="text-xs bg-white/10 text-white border-white/20">Lv.{player.level}</Badge>
                                        </div>
                                        <p className="text-xs text-white/60">{player.total_XP} XP</p>
                                    </div>
                                </div>)}
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>

            {/* Buy Dialog - Mobile: Drawer, Desktop: Dialog */}
            {isMobile ? <Drawer open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
                <DrawerContent className="bg-black/10 backdrop-blur-md border border-white/20 text-white">
                    <DrawerHeader>
                        <DrawerTitle className="text-white text-center">
                            {selectedPlayer ? `Buy ${selectedPlayer.name}` : 'Buy Chad Coins'}
                        </DrawerTitle>
                    </DrawerHeader>
                    <BuyDialogContent
                        selectedPlayer={selectedPlayer}
                        onClose={() => setBuyDialogOpen(false)}
                    />
                </DrawerContent>
            </Drawer> : <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
                <DialogContent className="sm:max-w-md bg-black/10 backdrop-blur-md border border-white/20 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-white">
                            {selectedPlayer ? `Buy ${selectedPlayer.name}` : 'Buy Chad Coins'}
                        </DialogTitle>
                        <DialogDescription className="text-white/80">
                            {selectedPlayer ? 'Choose your payment method to purchase this player.' : 'Choose your payment method to buy Chad Coins.'}
                        </DialogDescription>
                    </DialogHeader>
                    <BuyDialogContent
                        selectedPlayer={selectedPlayer}
                        onClose={() => setBuyDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>}
        </>
    )
}

export default Header