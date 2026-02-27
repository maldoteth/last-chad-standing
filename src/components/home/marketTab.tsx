import React, { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useStore, StoreItem } from "@/context/storeData";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMarketplace } from "@/hooks/useMarketplace";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatNumberWithAbbreviation } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, BarChart3, LineChart, ArrowUpRight, Search, Filter, Layers, X, ArrowRightLeft, ArrowUpDown } from "lucide-react";
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from 'recharts';
import { tabItems, topGainersData } from "@/lib/data";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import StorePurchaseDialog from "../StorePurchaseDialog";
import { useProfile } from "@/context/profileContext";

// Market Prices Component
const MarketplacePrices = ({ profile, player, getMarketplacePrices, isMobile, size = 'medium', onSellClick, onBuyClick }) => {
    const prices = getMarketplacePrices(player.name, 'player');
    const sizeClasses = {
        small: { coin: 'w-3 h-3 md:w-4.5 md:h-4.5', text: 'text-xs md:text-base', label: 'text-[10px] md:text-sm' },
        medium: { coin: 'w-4 h-4 md:w-5 md:h-5', text: 'text-sm md:text-sm', label: 'text-xs md:text-xs' },
        large: { coin: 'w-5 h-5 md:w-7.5 md:h-7.5', text: 'text-lg md:text-xl', label: 'text-sm md:text-lg' }
    };
    const { coin, text, label } = sizeClasses[size];
    const isLoginUserBuy = profile?.id === player?.user_id
    if (!prices.hasListings || !prices.bestSellPrice && !prices.bestBuyPrice) {
        const mockSellPrice = Math.round(player?.sale_price || 0 * 1);

        const TradeButton = isMobile ? Drawer : Popover;
        const TriggerComponent = isMobile ? DrawerTrigger : PopoverTrigger;
        const ContentComponent = isMobile ? DrawerContent : PopoverContent;

        return (
            <div className="flex items-center justify-end md:justify-between md:gap-4 rounded-lg p-3 min-w-[140px]">
                <div className="flex flex-col items-end md:flex-row md:items-center md:gap-4">
                    <div className="flex items-center gap-1 mb-1 md:mb-0 justify-start">
                        <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className={`${coin} flex-shrink-0 mt-1 md:mt-0`} />
                        <span className={`${text} font-bold text-foreground mt-1 md:mt-0`}>
                            {formatNumberWithAbbreviation(mockSellPrice)}
                        </span>
                    </div>
                </div>
                <TradeButton>
                    <TriggerComponent asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8 bg-transparent hover:bg-transparent">
                            <ArrowRightLeft className="w-4 h-4" />
                        </Button>
                    </TriggerComponent>
                    <ContentComponent className={isMobile ? "bg-black/10 backdrop-blur-md border border-white/20 text-white" : "w-32 bg-black/10 backdrop-blur-md border border-white/20 text-white z-50 p-1"} {...(!isMobile && { align: "center", side: "bottom", sideOffset: 8 })}>
                        {isMobile && (
                            <DrawerHeader>
                                <DrawerTitle className="text-center">Trade Options</DrawerTitle>
                            </DrawerHeader>
                        )}
                        <div className={isMobile ? "px-4 pb-8 space-y-2" : "flex flex-col gap-1"}>
                            <Button size={isMobile ? "default" : "sm"} variant={isMobile ? "ghost" : "outline"} className={`w-full ${isMobile ? "justify-center" : ""} text-green-400 border border-green-400/30 hover:bg-green-400/10 ${!isMobile && "bg-transparent"}`} onClick={onBuyClick}>
                                Buy
                            </Button>
                            <Button disabled={isLoginUserBuy} size={isMobile ? "default" : "sm"} variant={isMobile ? "ghost" : "outline"} className={`w-full ${isMobile ? "justify-center" : ""} text-red-400 border border-red-400/30 hover:bg-red-400/10 ${!isMobile && "bg-transparent"}`} onClick={onSellClick}>
                                Sell
                            </Button>
                        </div>
                    </ContentComponent>
                </TradeButton>
            </div>
        );
    }

    return (
        <div className="flex items-start space-x-2">
            <div className="flex items-center space-x-4">
                {prices.bestBuyPrice && <span className={`${label} text-red-400 font-medium cursor-pointer hover:text-red-300 transition-colors`} onClick={onSellClick}>sell</span>}
                {prices.bestSellPrice && <span className={`${label} text-green-400 font-medium cursor-pointer hover:text-green-300 transition-colors`} onClick={onBuyClick}>buy</span>}
            </div>
        </div>
    );
};

// Player List Item Component
const PlayerListItem = ({
    profile,
    player,
    getMarketplacePrices,
    isMobile,
    size = 'medium',
    onSellClick,
    onBuyClick,
    index
}) => {
    const percentChange =
        player?.bestSellPrice && player?.coins
            ? (((player?.bestSellPrice - player.coins) / player.coins) * 100).toFixed(1)
            : 0;

    const isUp = parseFloat(percentChange as any) >= 0;

    return (
        <div className="flex items-center space-x-3 p-2 md:p-3 bg-white/5 rounded-lg hover:bg-white/10 md:hover:bg-white/15 transition-all duration-300 cursor-pointer">
            {/* Player Image */}
            <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full overflow-hidden flex-shrink-0">
                <img
                    src={player.ImgGatewayUrl ?? player.image_url ?? player.image}
                    alt={player.name}
                    className="w-full h-full object-cover"
                    loading={index < 3 ? 'eager' : 'lazy'}
                />
            </div>

            {/* Player Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <p className="text-sm md:text-base lg:text-lg font-semibold text-white truncate">
                            {player.name}
                        </p>

                        {/* ✅ Dynamic percentChange display */}
                        <p className={`text-xs md:text-sm ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                            {isUp ? '+' : ''}
                            {percentChange}%
                            {getMarketplacePrices(player.name, 'fighter').bestSellPrice &&
                                ` ${formatNumberWithAbbreviation(getMarketplacePrices(player.name, 'fighter').bestSellPrice)} sell`}
                            {getMarketplacePrices(player.name, 'fighter').bestBuyPrice &&
                                ` ${formatNumberWithAbbreviation(getMarketplacePrices(player.name, 'fighter').bestBuyPrice)} buy`}
                        </p>
                    </div>

                    {/* Marketplace Buttons */}
                    <div className="flex flex-col items-end">
                        <MarketplacePrices
                            player={player}
                            getMarketplacePrices={getMarketplacePrices}
                            isMobile={isMobile}
                            size={size}
                            profile={profile}
                            onSellClick={() => onSellClick(player)}
                            onBuyClick={() => onBuyClick(player)}
                        />
                        {player.bids && player.bids[0]?.count > 0 && (
                            <div className="flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                                <TrendingUp className="w-2.5 h-2.5 text-green-400" />
                                <span className="text-[9px] font-bold text-green-400 uppercase tracking-tighter">
                                    {player.bids[0].count} ACTIVE {player.bids[0].count === 1 ? 'BID' : 'BIDS'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Time Filter Buttons Component
const TimeFilterButtons = ({ activeFilter, onFilterChange, filters }) => (
    <div className="flex flex-wrap gap-1 md:gap-2">
        {filters.map(filter => (
            <Button key={filter.key} variant={activeFilter === filter.key ? "secondary" : "ghost"} size="sm" className={`text-xs h-6 md:h-7 px-2 md:px-3 ${activeFilter === filter.key ? "bg-white/20 text-white border-white/30" : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"}`} onClick={() => onFilterChange(filter.key)}>
                {filter.label}
            </Button>
        ))}
    </div>
);

// Market Stat Card Component
const MarketStatCard = ({ title, icon: Icon, value, chartData, dataKey }) => (
    <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%), linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)`, backgroundSize: '4px 4px' }} />
        <CardContent className="p-4 md:p-6 relative z-10">
            <div className="flex items-center space-x-2 mb-2">
                <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                <span className="text-xs md:text-sm lg:text-base font-medium text-white">{title}</span>
            </div>
            <div className="space-y-1 md:space-y-2">
                <div className="flex items-center space-x-1">
                    {title.includes('Market Value') && <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-3 h-3 md:w-4 md:h-4" />}
                    {value && <span className="text-sm md:text-lg lg:text-xl font-bold text-white select-none">{value}</span>}
                </div>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" className="" />
                            <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.7)' }} className="" />
                            <YAxis tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.7)' }} className="" tickFormatter={dataKey === 'listings' ? value => Math.round(value).toString() : undefined} />
                            <Tooltip labelStyle={{ color: '#000' }} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }} formatter={value => [dataKey === 'listings' ? Math.round(Number(value)) : Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), title]} />
                            <Area type="monotone" dataKey={dataKey} stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={1} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </CardContent>
    </Card>
);

// Card Background Component (reusable styling)
const CardBackground = () => (
    <>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%), linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)`, backgroundSize: '4px 4px' }} />
    </>
);

const MarketTab = () => {
    const isMobile = useIsMobile();
    const [gainersTimeFilter, setGainersTimeFilter] = useState("daily");
    const [trendingTimeFilter, setTrendingTimeFilter] = useState("daily");
    const [visiblePlayers, setVisiblePlayers] = useState(10);
    const [marketplaceCategory, setMarketplaceCategory] = useState("all");
    const [marketplaceRarity, setMarketplaceRarity] = useState("all");
    const [marketplaceSortBy, setMarketplaceSortBy] = useState("highest-price");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchExpanded, setSearchExpanded] = useState(false);
    const [buyDialogOpen, setBuyDialogOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
    const { toast } = useToast();
    const { profile } = useProfile()
    const { getMarketplacePrices, listings: itemsData, listGainer,
        loadingMarket, loading,
        listMarketValue,
        fetchTrendingItems, fetchGainerItems, listTrending, listGraphs
    } = useMarketplace();
    const handleSellClick = (player: any) => {
        toast({ title: "Item not found in locker", variant: "destructive" });
    };

    const handleBuyClick = (player: any) => {
        setSelectedPlayer(player);
        setBuyDialogOpen(true);
    };
   
    const filterMarketplaceByCategory = (players: any[], category: string) => category === "all" ? players : players.filter(player => player.category === category);
    const filterMarketplaceByRarity = (players: any[], rarity: string) => {
        if (rarity === "all") return players;
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
            case "highest-price": return sorted.sort((a, b) => b.price - a.price);
            case "lowest-price": return sorted.sort((a, b) => a.price - b.price);
            case "highest-gain": return sorted.sort((a, b) => ((b.price - b?.price) / b?.price * 100) - ((a.price - a?.price) / a?.price * 100));
            case "highest-loss": {
                const lossesOnly = sorted.filter(player => ((player.price - player?.price) / player?.price * 100) < 0);
                return lossesOnly.sort((a, b) => ((a.price - a?.price) / a?.price * 100) - ((b.price - b?.price) / b?.price * 100));
            }
            default: return sorted;
        }
        //   switch (sortBy) {
        //     case "highest-price": return sorted.sort((a, b) => b.price - a.price);
        //     case "lowest-price": return sorted.sort((a, b) => a.price - b.price);
        //     case "highest-gain": return sorted.sort((a, b) => ((b.price - b.lastSale) / b.lastSale * 100) - ((a.price - a.lastSale) / a.lastSale * 100));
        //     case "highest-loss": {
        //         const lossesOnly = sorted.filter(player => ((player.price - player.lastSale) / player.lastSale * 100) < 0);
        //         return lossesOnly.sort((a, b) => ((a.price - a.lastSale) / a.lastSale * 100) - ((b.price - b.lastSale) / b.lastSale * 100));
        //     }
        //     default: return sorted;
        // }
    };

    // Items to hide from marketplace (temporary, for investigation)
    const HIDDEN_MARKETPLACE_ITEMS = ["Ray Del Maestro", "Dangerous fighter", "Conquisto D'ior", "Helicopter", "White Base Vest"];
    const filterHiddenItems = (players: any[]) => 
        players?.filter(player => 
            !HIDDEN_MARKETPLACE_ITEMS.some(hidden => 
                player.name?.toLowerCase().includes(hidden.toLowerCase())
            )
        ) || [];

    const filteredAndSortedMarketplacePlayers = sortMarketplacePlayers(filterMarketplaceBySearch(filterMarketplaceByRarity(filterMarketplaceByCategory(filterHiddenItems(itemsData), marketplaceCategory), marketplaceRarity), searchTerm), marketplaceSortBy);
    const filteredTrending = filterHiddenItems(listTrending);
    const filteredGainers = filterHiddenItems(listGainer);
    const timeFilters = [
        { key: "daily", label: isMobile ? "24H" : "Daily" },
        { key: "weekly", label: isMobile ? "7D" : "Weekly" },
        { key: "monthly", label: isMobile ? "30D" : "Monthly" },
        { key: "all", label: isMobile ? "All" : "All Time" }
    ];

    const FilterDropdown = ({ type }: { type: 'category' | 'sort' | 'rarity' }) => {
        const Component = isMobile ? Drawer : DropdownMenu;
        const TriggerComp = isMobile ? DrawerTrigger : DropdownMenuTrigger;
        const ContentComp = isMobile ? DrawerContent : DropdownMenuContent;

        const config = {
            category: {
                icon: Layers,
                title: "Filter by Category",
                options: [
                    { value: "all", label: "⚫ All", active: marketplaceCategory === "all", onClick: () => setMarketplaceCategory("all") },
                    { value: "fighters", label: "👊 Fighters", active: marketplaceCategory === "fighters", onClick: () => setMarketplaceCategory("fighters") },
                    { value: "mobility", label: "🚗 Mobility", active: marketplaceCategory === "mobility", onClick: () => setMarketplaceCategory("mobility") },
                    { value: "accessories", label: "💎 Accessories", active: marketplaceCategory === "accessories", onClick: () => setMarketplaceCategory("accessories") },
                    { value: "emotes", label: "💃 Emotes", active: marketplaceCategory === "emotes", onClick: () => setMarketplaceCategory("emotes") },
                    { value: "packs", label: "🎁 Packs", active: marketplaceCategory === "packs", onClick: () => setMarketplaceCategory("packs") }
                ]
            },
            sort: {
                icon: ArrowUpDown,
                title: "Sort By",
                options: [
                    { value: "highest-price", label: "⬆️ Highest Price", active: marketplaceSortBy === "highest-price", onClick: () => setMarketplaceSortBy("highest-price") },
                    { value: "lowest-price", label: "⬇️ Lowest Price", active: marketplaceSortBy === "lowest-price", onClick: () => setMarketplaceSortBy("lowest-price") },
                    { value: "highest-gain", label: "📈 Highest % Gain", active: marketplaceSortBy === "highest-gain", onClick: () => setMarketplaceSortBy("highest-gain") },
                    { value: "highest-loss", label: "📉 Highest % Loss", active: marketplaceSortBy === "highest-loss", onClick: () => setMarketplaceSortBy("highest-loss") }
                ]
            },
            rarity: {
                icon: Filter,
                title: "Filter by Rarity",
                options: [
                    { value: "all", label: "All Rarities", color: "bg-black", active: marketplaceRarity === "all", onClick: () => setMarketplaceRarity("all") },
                    { value: "green", label: "Regular", color: "bg-green-500", active: marketplaceRarity === "green", onClick: () => setMarketplaceRarity("green") },
                    { value: "blue", label: "Rare", color: "bg-blue-500", active: marketplaceRarity === "blue", onClick: () => setMarketplaceRarity("blue") },
                    { value: "silver", label: "Legendary", color: "bg-gray-300", active: marketplaceRarity === "silver", onClick: () => setMarketplaceRarity("silver") },
                    { value: "gold", label: "Mythical", color: "bg-yellow-400", active: marketplaceRarity === "gold", onClick: () => setMarketplaceRarity("gold") },
                    { value: "special", label: "Special", color: "bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400", active: marketplaceRarity === "special", onClick: () => setMarketplaceRarity("special") }
                ]
            }
        }[type];

        const Icon = config.icon;

        return (
            <Component>
                <TriggerComp asChild>
                    <Button variant="outline" size="sm" className="bg-black/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-6 md:h-8 w-6 md:w-8">
                        <Icon className="w-3 h-3" />
                    </Button>
                </TriggerComp>
                <ContentComp className={isMobile ? "bg-black/10 backdrop-blur-md border border-white/20 text-white" : `${type === 'sort' ? 'w-36' : type === 'rarity' ? 'w-32' : 'w-40'} bg-black/10 backdrop-blur-md border border-white/20 text-white z-[9999]`} {...(!isMobile && { align: "center" })}>
                    {isMobile && (
                        <DrawerHeader>
                            <DrawerTitle className="text-center">{config.title}</DrawerTitle>
                        </DrawerHeader>
                    )}
                    <div className={isMobile ? "px-4 pb-8 space-y-2" : ""}>
                        {config.options.map(option => (
                            isMobile ? (
                                <Button key={option.value} variant="ghost" onClick={option.onClick} className={`w-full justify-start text-white hover:bg-white/10 ${option.active ? "bg-white/20" : ""}`}>
                                    {option.color && <div className={`w-3 h-3 rounded-full ${option.color} mr-2`} />}
                                    {option.label}
                                </Button>
                            ) : (
                                <DropdownMenuItem key={option.value} onClick={option.onClick} className={`flex items-center space-x-2 cursor-pointer text-white hover:bg-white/10 ${option.active ? "bg-white/20" : ""}`}>
                                    {option.color && <div className={`w-3 h-3 rounded-full ${option.color}`} />}
                                    <span>{option.label}</span>
                                </DropdownMenuItem>
                            )
                        ))}
                    </div>
                </ContentComp>
            </Component>
        );
    };
    useEffect(() => {
        fetchGainerItems(gainersTimeFilter)
    }, [gainersTimeFilter]);
    useEffect(() => {
        fetchTrendingItems(trendingTimeFilter)
    }, [trendingTimeFilter]);

    return (
        <>
            <ScrollArea className="h-full">
                <div className="p-4 md:p-6">
                    <div className="space-y-4 md:space-y-6 max-w-6xl mx-auto">
                        {/* Market Header */}
                        <div className="text-center">
                            <h1 className="text-2xl md:text-3xl font-bold">The Market</h1>
                        </div>

                        {/* Market Stats Cards */}
                        <div className="grid lg:grid-cols-1 md:grid-cols-2 grid-cols-1 xl:grid-cols-2 gap-3 md:gap-6">
                            <MarketStatCard title="Total Market Value" icon={BarChart3} value={''} chartData={listMarketValue} dataKey="total_market_value" />
                            <MarketStatCard title="Live Listings" icon={LineChart} value={''} chartData={listGraphs} dataKey="count" />
                        </div>

                        {/* Trending & Gainers */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
                            {/* Trending */}
                            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
                                <CardBackground />
                                <CardHeader className="pb-3 relative z-10">
                                    <div className="flex items-center justify-between mb-2 md:mb-3">
                                        <CardTitle className="text-base md:text-lg lg:text-2xl flex items-center space-x-2 text-white">
                                            <span className="text-base md:text-lg">🔥</span>
                                            <span>Trending</span>
                                        </CardTitle>
                                    </div>
                                    <TimeFilterButtons activeFilter={trendingTimeFilter} onFilterChange={setTrendingTimeFilter} filters={timeFilters} />
                                </CardHeader>
                                <CardContent className="relative z-10">
                                    <div className="space-y-2 md:space-y-3">
                                        {filteredTrending?.map((player, idx) => (
                                            <PlayerListItem profile={profile} key={`trending-${idx}`} player={player} getMarketplacePrices={getMarketplacePrices} isMobile={isMobile} size="medium" onSellClick={handleSellClick} onBuyClick={handleBuyClick} index={idx} />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Top Gainers */}
                            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
                                <CardBackground />
                                <CardHeader className="pb-3 relative z-10">
                                    <div className="flex items-center justify-between mb-2 md:mb-3">
                                        <CardTitle className="text-base md:text-lg lg:text-2xl flex items-center space-x-2 text-white">
                                            <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                                            <span>Gainers</span>
                                        </CardTitle>
                                    </div>
                                    <TimeFilterButtons activeFilter={gainersTimeFilter} onFilterChange={setGainersTimeFilter} filters={timeFilters} />
                                </CardHeader>
                                <CardContent className="relative z-10">
                                    <div className="space-y-2 md:space-y-3">
                                        {filteredGainers?.map((player, idx) => (
                                            <PlayerListItem profile={profile} key={`gainers-${gainersTimeFilter}-${idx}`} player={player} getMarketplacePrices={getMarketplacePrices} isMobile={isMobile} size="medium" onSellClick={handleSellClick} onBuyClick={handleBuyClick} index={idx} />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Marketplace */}
                        <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
                            <CardBackground />
                            <CardHeader className="pb-3 relative z-10">
                                <CardTitle className="text-xl md:text-2xl lg:text-3xl flex items-center justify-between text-white">
                                    <span>Marketplace</span>
                                    <div className="flex items-center gap-1 md:gap-2">
                                        {/* Search */}
                                        {!searchExpanded ? (
                                            isMobile ? (
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
                                            ) : (
                                                <Button variant="outline" size="sm" className="bg-black/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs h-8 w-8" onClick={() => setSearchExpanded(true)}>
                                                    <Search className="w-3 h-3" />
                                                </Button>
                                            )
                                        ) : (
                                            <div className="flex items-center animate-fade-in">
                                                <div className="relative">
                                                    <Button variant="ghost" size="sm" className="absolute left-1 top-1/2 transform -translate-y-1/2 h-6 w-6 text-white hover:bg-white/20 z-10" onClick={() => { setSearchTerm(""); setSearchExpanded(false); }}>
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                    <Input placeholder="search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onBlur={() => !searchTerm && setSearchExpanded(false)} className="pl-8 pr-3 h-8 text-xs bg-black/20 backdrop-blur-md border-white/30 text-white placeholder:text-gray-400 w-48 focus:bg-black/30 focus:border-white/40" autoFocus />
                                                </div>
                                            </div>
                                        )}

                                        <FilterDropdown type="category" />
                                        <FilterDropdown type="sort" />
                                        <FilterDropdown type="rarity" />
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="space-y-2 md:space-y-3">
                                    {filteredAndSortedMarketplacePlayers.slice(0, visiblePlayers).map((player, idx) => (
                                        <PlayerListItem profile={profile} key={idx} player={player} getMarketplacePrices={getMarketplacePrices} isMobile={isMobile} size="large" onSellClick={handleSellClick} onBuyClick={handleBuyClick} index={idx} />
                                    ))}
                                </div>

                                {visiblePlayers < filteredAndSortedMarketplacePlayers.length && (
                                    <div className="mt-4 md:mt-6 text-center">
                                        <Button variant="outline" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20" onClick={() => setVisiblePlayers(prev => Math.min(prev + 10, filteredAndSortedMarketplacePlayers.length))}>
                                            Load More
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </ScrollArea>

            <StorePurchaseDialog
                isOpen={buyDialogOpen}
                onClose={() => setBuyDialogOpen(false)}
                item={selectedPlayer}
                isLockerItem={true}
            />
        </>
    );
};

export default MarketTab;