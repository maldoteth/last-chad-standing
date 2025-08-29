import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpRight, ArrowDownRight, Search, Filter, TrendingUp, Users, Activity, BarChart3 } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';

const Market = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("price");
  const [filterCategory, setFilterCategory] = useState("all");

  // Mock market data
  const marketAnalytics = {
    totalValue: 2847529,
    totalListings: 15420,
    avgPrice: 184.73,
    change24h: 12.5
  };

  const trendingPlayers = [
    { name: "ChadMaster", value: 15420, change: 23.5, rank: 1 },
    { name: "AlphaGamer", value: 12834, change: 18.2, rank: 2 },
    { name: "ProSkills", value: 11567, change: 15.8, rank: 3 },
    { name: "ElitePlayer", value: 9823, change: 12.1, rank: 4 },
    { name: "GameLegend", value: 8934, change: 8.7, rank: 5 }
  ];

  const topCategories = [
    { name: "Skins", value: 35, color: "#8B5CF6" },
    { name: "Weapons", value: 28, color: "#F59E0B" },
    { name: "Accessories", value: 22, color: "#10B981" },
    { name: "Mobility", value: 15, color: "#EF4444" }
  ];

  const priceHistory = [
    { time: "00:00", price: 180 },
    { time: "04:00", price: 175 },
    { time: "08:00", price: 185 },
    { time: "12:00", price: 190 },
    { time: "16:00", price: 188 },
    { time: "20:00", price: 195 },
    { time: "24:00", price: 184 }
  ];

  const marketListings = [
    {
      id: 1,
      name: "Legendary Lightning Skin",
      seller: "ChadMaster",
      price: 2500,
      originalPrice: 750,
      rarity: "legendary",
      category: "skins",
      image: "/lovable-uploads/04d47857-2947-4d8d-a573-ff6bdaa23efb.png",
      timeLeft: "2h 45m"
    },
    {
      id: 2,
      name: "Flame Warrior Skin",
      seller: "AlphaGamer",
      price: 1800,
      originalPrice: 500,
      rarity: "rare",
      category: "skins",
      image: "/lovable-uploads/0438f719-b82a-4f49-80d1-7f232ef63242.png",
      timeLeft: "5h 12m"
    },
    {
      id: 3,
      name: "Royal Crown",
      seller: "ProSkills",
      price: 3200,
      originalPrice: 1000,
      rarity: "legendary",
      category: "accessories",
      image: "/lovable-uploads/10b201c5-4459-46db-8a74-f056acdf247b.png",
      timeLeft: "1h 23m"
    },
    {
      id: 4,
      name: "Speed Demon Boots",
      seller: "ElitePlayer",
      price: 950,
      originalPrice: 400,
      rarity: "epic",
      category: "mobility",
      image: "/lovable-uploads/1373b087-4cb8-43e3-ae69-f3ff5c05a5d1.png",
      timeLeft: "8h 56m"
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-400 border-yellow-400';
      case 'epic': return 'text-purple-400 border-purple-400';
      case 'rare': return 'text-blue-400 border-blue-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const filteredListings = marketListings.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">NFT Marketplace</h1>
            <p className="text-gray-400">Trade rare items and collectibles</p>
          </div>
          <Button className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20">
            List Item
          </Button>
        </div>

        {/* Market Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Value</p>
                  <p className="text-xl font-bold">${marketAnalytics.totalValue.toLocaleString()}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Listings</p>
                  <p className="text-xl font-bold">{marketAnalytics.totalListings.toLocaleString()}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Avg Price</p>
                  <p className="text-xl font-bold">${marketAnalytics.avgPrice}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">24h Change</p>
                  <p className="text-xl font-bold text-green-400">+{marketAnalytics.change24h}%</p>
                </div>
                <ArrowUpRight className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Market Listings */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search and Filters */}
            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-40 bg-white/5 border-white/20 text-white">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-gray-700">
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="skins">Skins</SelectItem>
                      <SelectItem value="weapons">Weapons</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                      <SelectItem value="mobility">Mobility</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32 bg-white/5 border-white/20 text-white">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-gray-700">
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="time">Time Left</SelectItem>
                      <SelectItem value="rarity">Rarity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Market Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredListings.map((item) => (
                <Card key={item.id} className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 hover:border-gray-600/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-gray-800/50 rounded-lg mb-3 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm">{item.name}</h3>
                        <Badge variant="outline" className={getRarityColor(item.rarity)}>
                          {item.rarity}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400">Seller: {item.seller}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-green-400">${item.price}</p>
                          <p className="text-xs text-gray-500 line-through">${item.originalPrice}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Time left:</p>
                          <p className="text-sm font-medium text-orange-400">{item.timeLeft}</p>
                        </div>
                      </div>
                      <Button className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20">
                        Place Bid
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar with Analytics */}
          <div className="space-y-4">
            {/* Price Chart */}
            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-sm">24h Price Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} />
                    <YAxis stroke="#9CA3AF" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '6px'
                      }}
                    />
                    <Line type="monotone" dataKey="price" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Categories */}
            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-sm">Top Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie
                      data={topCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={50}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {topCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1 mt-2">
                  {topCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
                        <span>{category.name}</span>
                      </div>
                      <span>{category.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Players */}
            <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-sm">Top Sellers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingPlayers.slice(0, 5).map((player, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                          {player.rank}
                        </div>
                        <span className="text-sm font-medium">{player.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">${player.value.toLocaleString()}</p>
                        <p className={`text-xs flex items-center ${player.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {player.change > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {Math.abs(player.change)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Market;