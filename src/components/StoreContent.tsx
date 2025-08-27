import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Search, Grid, List, Heart, ShoppingCart, Star, Zap, Car, Backpack } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for store items
const storeItems = {
  skins: [
    {
      id: 1,
      name: "Cyber Ninja",
      price: 2500,
      rarity: "legendary",
      image: "/lovable-uploads/4ab5b809-ec42-4474-b698-a64f8b2514d1.png",
      description: "Elite cybernetic warrior skin"
    },
    {
      id: 2,
      name: "Street Fighter",
      price: 1200,
      rarity: "epic",
      image: "/lovable-uploads/77a6c004-93ed-49ee-a5d0-6056ee852612.png",
      description: "Urban combat specialist"
    },
    {
      id: 3,
      name: "Desert Soldier",
      price: 800,
      rarity: "rare",
      image: "/lovable-uploads/896892f1-7ebc-4852-acea-80dcdbf7c545.png",
      description: "Battle-tested warrior"
    },
    {
      id: 4,
      name: "Neon Runner",
      price: 1800,
      rarity: "epic",
      image: "/lovable-uploads/ac3e1f52-ba21-4588-9051-87eef47caf5c.png",
      description: "High-tech speedster"
    }
  ],
  accessories: [
    {
      id: 5,
      name: "Tactical Backpack",
      price: 400,
      rarity: "common",
      image: "/lovable-uploads/13b1e254-7a27-4fc3-8040-9882d7705c70.png",
      description: "Extra storage capacity"
    },
    {
      id: 6,
      name: "Combat Boots",
      price: 600,
      rarity: "rare",
      image: "/lovable-uploads/1615e7da-29d5-454e-a2fe-57f5abf91d56.png",
      description: "Enhanced movement speed"
    },
    {
      id: 7,
      name: "Stealth Hat",
      price: 300,
      rarity: "common",
      image: "/lovable-uploads/2d3f78f9-ea64-4ca6-83e4-30cb240f0d0a.png",
      description: "Reduced visibility"
    }
  ],
  mobility: [
    {
      id: 8,
      name: "Hover Car",
      price: 5000,
      rarity: "legendary",
      image: "/lovable-uploads/319fe799-d5a0-4338-a0d4-53b1b1e3fe1a.png",
      description: "High-speed aerial vehicle"
    },
    {
      id: 9,
      name: "Desert Buggy",
      price: 2200,
      rarity: "epic",
      image: "/lovable-uploads/3f5e7815-4bdc-4a67-a0a6-adc4051e8144.png",
      description: "All-terrain exploration"
    },
    {
      id: 10,
      name: "Golf Cart",
      price: 800,
      rarity: "rare",
      image: "/lovable-uploads/467b4b2b-4ef7-4259-8c00-cc82ac4255ae.png",
      description: "Casual transportation"
    }
  ]
};

const rarityColors = {
  common: "text-gray-400 border-gray-400",
  rare: "text-blue-400 border-blue-400",
  epic: "text-purple-400 border-purple-400",
  legendary: "text-yellow-400 border-yellow-400"
};

const StoreContent = () => {
  const [activeCategory, setActiveCategory] = useState("skins");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterRarity, setFilterRarity] = useState("all");
  const { toast } = useToast();

  const handlePurchase = (item: any) => {
    toast({
      title: "Purchase Successful!",
      description: `You've successfully purchased ${item.name} for ${item.price} coins.`,
    });
  };

  const getFilteredItems = () => {
    let items = storeItems[activeCategory as keyof typeof storeItems] || [];
    
    // Filter by search term
    if (searchTerm) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by rarity
    if (filterRarity !== "all") {
      items = items.filter(item => item.rarity === filterRarity);
    }
    
    // Sort items
    switch (sortBy) {
      case "price-low":
        items.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        items.sort((a, b) => b.price - a.price);
        break;
      case "rarity":
        const rarityOrder = { common: 1, rare: 2, epic: 3, legendary: 4 };
        items.sort((a, b) => rarityOrder[b.rarity as keyof typeof rarityOrder] - rarityOrder[a.rarity as keyof typeof rarityOrder]);
        break;
      default:
        items.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return items;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "skins":
        return Star;
      case "accessories":
        return Backpack;
      case "mobility":
        return Car;
      default:
        return Star;
    }
  };

  return (
    <div className="space-y-6">
      {/* Store Header */}
      <div className="relative overflow-hidden rounded-lg">
        <Card className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white border border-gray-600/50 shadow-2xl relative overflow-hidden">
          {/* Metallic base layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700/30 via-gray-800/50 to-gray-900/80" />
          
          {/* Metallic shine overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/10 to-transparent transform -skew-x-12" />
          
          <CardContent className="p-8 relative z-10">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-md border border-white/20">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2 text-white">LCS Store</h1>
                <p className="text-gray-300">Upgrade your game with premium skins, accessories, and vehicles</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white border border-gray-600/50 shadow-2xl relative overflow-hidden">
        {/* Metallic effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700/30 via-gray-800/50 to-gray-900/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/10 to-transparent transform -skew-x-12" />
        
        <CardContent className="p-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 focus:border-white/40"
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-white/10 backdrop-blur-md border border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-600">
                  <SelectItem value="name" className="text-white">Name A-Z</SelectItem>
                  <SelectItem value="price-low" className="text-white">Price Low-High</SelectItem>
                  <SelectItem value="price-high" className="text-white">Price High-Low</SelectItem>
                  <SelectItem value="rarity" className="text-white">Rarity</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterRarity} onValueChange={setFilterRarity}>
                <SelectTrigger className="w-32 bg-white/10 backdrop-blur-md border border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-600">
                  <SelectItem value="all" className="text-white">All Rarities</SelectItem>
                  <SelectItem value="common" className="text-gray-400">Common</SelectItem>
                  <SelectItem value="rare" className="text-blue-400">Rare</SelectItem>
                  <SelectItem value="epic" className="text-purple-400">Epic</SelectItem>
                  <SelectItem value="legendary" className="text-yellow-400">Legendary</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex bg-white/10 backdrop-blur-md border border-white/20 rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="bg-transparent hover:bg-white/20 text-white"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="bg-transparent hover:bg-white/20 text-white"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-6">
        <div className="overflow-x-auto">
          <TabsList className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 border border-gray-600/50 p-2 w-full justify-start min-w-max">
            {Object.keys(storeItems).map((category) => {
              const Icon = getCategoryIcon(category);
              return (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="flex items-center space-x-2 px-6 py-3 text-white data-[state=active]:bg-white/20 data-[state=active]:text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-md border border-white/10 data-[state=active]:border-white/30"
                >
                  <Icon className="w-4 h-4" />
                  <span className="capitalize font-medium">{category}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Store Items */}
        {Object.keys(storeItems).map((category) => (
          <TabsContent key={category} value={category} className="space-y-6">
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
              {getFilteredItems().map((item) => (
                <Card
                  key={item.id}
                  className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white border border-gray-600/50 shadow-2xl relative overflow-hidden group hover:shadow-3xl transition-all duration-300 hover:scale-105"
                >
                  {/* Metallic base layer */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700/30 via-gray-800/50 to-gray-900/80" />
                  
                  {/* Metallic shine overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/10 to-transparent transform -skew-x-12 group-hover:via-gray-300/20 transition-all duration-300" />
                  
                  {/* Animated glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 transition-opacity duration-500" />
                  
                  <CardContent className={`relative z-10 ${viewMode === "grid" ? "p-6" : "p-4 flex items-center space-x-4"}`}>
                    {viewMode === "grid" ? (
                      <>
                        <div className="aspect-square bg-white/5 rounded-lg mb-4 overflow-hidden backdrop-blur-sm border border-white/10">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors duration-300">{item.name}</h3>
                            <Button variant="ghost" size="sm" className="text-white/60 hover:text-red-400 hover:bg-white/10">
                              <Heart className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <Badge className={`${rarityColors[item.rarity as keyof typeof rarityColors]} bg-transparent backdrop-blur-sm`}>
                            <Zap className="w-3 h-3 mr-1" />
                            {item.rarity.toUpperCase()}
                          </Badge>
                          
                          <p className="text-sm text-gray-300 line-clamp-2">{item.description}</p>
                          
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center space-x-2">
                              <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-4 h-4" />
                              <span className="font-bold text-yellow-400">{item.price.toLocaleString()}</span>
                            </div>
                            
                            <Button
                              onClick={() => handlePurchase(item)}
                              className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105"
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Buy
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-20 h-20 bg-white/5 rounded-lg overflow-hidden backdrop-blur-sm border border-white/10 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-white">{item.name}</h3>
                            <Badge className={`${rarityColors[item.rarity as keyof typeof rarityColors]} bg-transparent backdrop-blur-sm`}>
                              {item.rarity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-300">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-4 h-4" />
                              <span className="font-bold text-yellow-400">{item.price.toLocaleString()}</span>
                            </div>
                            <Button
                              onClick={() => handlePurchase(item)}
                              size="sm"
                              className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Buy
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {getFilteredItems().length === 0 && (
              <Card className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white border border-gray-600/50 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700/30 via-gray-800/50 to-gray-900/80" />
                <CardContent className="p-12 text-center relative z-10">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-white/60" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">No items found</h3>
                  <p className="text-gray-300">Try adjusting your search or filter criteria.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default StoreContent;