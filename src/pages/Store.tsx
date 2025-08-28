import { useState } from "react";
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Coins, ShoppingBag, Settings, LogOut, ArrowLeft, Search, Star, ChevronRight, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/hooks/useStore";
import { useProfile } from "@/hooks/useProfile";

const Store = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { login, logout, authenticated, user } = usePrivy();
  const navigate = useNavigate();
  const { storeItems, userBalance, loading, purchaseItem } = useStore();
  const { profile } = useProfile();

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "text-yellow-400 border-yellow-400/30";
      case "epic": return "text-purple-400 border-purple-400/30";
      case "rare": return "text-blue-400 border-blue-400/30";
      default: return "text-gray-400 border-gray-400/30";
    }
  };

  const handlePurchase = async (itemId: string, itemName: string, price: number) => {
    await purchaseItem(itemId, itemName, price);
  };

  const filteredItems = () => {
    let items = selectedCategory === "all" 
      ? storeItems
      : storeItems.filter(item => item.category === selectedCategory);
    
    if (searchTerm) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return items;
  };

  const getCategoryCount = (category: string) => {
    if (category === "all") return storeItems.length;
    return storeItems.filter(item => item.category === category).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground dark">
        <header className="bg-card border-b border-border px-4 py-3 lg:px-6 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/game')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Game
              </Button>
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-8 w-32" />
          </div>
        </header>
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="bg-card">
                <CardContent className="p-4">
                  <Skeleton className="aspect-square mb-3" />
                  <Skeleton className="h-4 mb-2" />
                  <Skeleton className="h-6 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 lg:px-6 lg:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/game')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Game</span>
            </Button>
            <img src="/lovable-uploads/ef3aca91-a372-4313-aa94-3c2dcf946dd6.png" alt="LCS Logo" className="h-8 lg:h-10" />
            <div className="hidden lg:flex items-center space-x-2 text-muted-foreground">
              <span>Game</span>
              <span>/</span>
              <span className="text-foreground">Store</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-4 h-4" />
              <span className="font-semibold text-sm lg:text-base">{userBalance.coins.toLocaleString()}</span>
            </div>
            
            {authenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-7 h-7 lg:w-8 lg:h-8 cursor-pointer">
                    <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>
                      {profile?.username?.charAt(0).toUpperCase() || 
                       user?.email?.address?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card border border-border z-50">
                  <DropdownMenuItem 
                    onClick={() => navigate('/inventory')}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>My Inventory</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate('/admin')}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Admin Panel</span>
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Store Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <ShoppingBag className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">LCS Store</h1>
              <p className="text-muted-foreground">Customize your gaming experience</p>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full lg:w-auto">
              <TabsList className="grid w-full grid-cols-4 lg:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="skins">Skins</TabsTrigger>
                <TabsTrigger value="accessories">Accessories</TabsTrigger>
                <TabsTrigger value="mobility">Mobility</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Categories Overview */}
        {selectedCategory === "all" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedCategory("skins")}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Skins
                  <Badge variant="secondary">{getCategoryCount("skins")}</Badge>
                </CardTitle>
                <CardDescription>Characters to play in game</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-to-br from-blue-600/20 to-purple-700/20 rounded-lg flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/0438f719-b82a-4f49-80d1-7f232ef63242.png" 
                    alt="Skins Preview" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedCategory("accessories")}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Accessories
                  <Badge variant="secondary">{getCategoryCount("accessories")}</Badge>
                </CardTitle>
                <CardDescription>Shoes, backpacks, hats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-to-br from-green-600/20 to-blue-700/20 rounded-lg flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/10b201c5-4459-46db-8a74-f056acdf247b.png" 
                    alt="Accessories Preview" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedCategory("mobility")}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Mobility
                  <Badge variant="secondary">{getCategoryCount("mobility")}</Badge>
                </CardTitle>
                <CardDescription>Cars, golf buggies, etc</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-to-br from-orange-600/20 to-red-700/20 rounded-lg flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/1373b087-4cb8-43e3-ae69-f3ff5c05a5d1.png" 
                    alt="Mobility Preview" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Store Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems().map((item) => (
            <Card key={item.id} className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white border border-gray-600/50 shadow-2xl relative overflow-hidden group hover:scale-105 transition-transform duration-300">
              {/* Metallic base layer */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700/30 via-gray-800/50 to-gray-900/80" />
              
              {/* Metallic shine overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/10 to-transparent transform -skew-x-12 group-hover:animate-pulse" />
              
              <CardContent className="p-4 relative z-10">
                <div className="aspect-square bg-gray-800/50 rounded-lg mb-3 overflow-hidden">
                  <img 
                    src={item.image_url || '/placeholder.svg'} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-white">{item.name}</h3>
                    <Badge variant="outline" className={`text-xs capitalize ${getRarityColor(item.rarity)}`}>
                      <Star className="w-3 h-3 mr-1" />
                      {item.rarity}
                    </Badge>
                  </div>

                  {item.description && (
                    <p className="text-xs text-gray-300 line-clamp-2">{item.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-4 h-4" />
                      <span className="font-bold text-white">{item.price.toLocaleString()}</span>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="secondary"
                          className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                          disabled={!authenticated}
                        >
                          <ShoppingBag className="mr-2 h-3 w-3" />
                          {authenticated ? 'Buy Now' : 'Login to Buy'}
                          {authenticated && <ChevronRight className="ml-2 h-3 w-3" />}
                        </Button>
                      </DropdownMenuTrigger>
                      {authenticated && (
                        <DropdownMenuContent className="bg-black/10 backdrop-blur-md border border-white/20 text-white">
                          <DropdownMenuItem 
                            className="hover:bg-white/10 cursor-pointer"
                            onClick={() => handlePurchase(item.id, item.name, item.price)}
                          >
                            <Coins className="mr-2 h-4 w-4" />
                            Buy with Coin Balance
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="hover:bg-white/10 cursor-pointer"
                            onClick={() => {/* TODO: Implement card payment */}}
                          >
                            <CreditCard className="mr-2 h-4 w-4" />
                            Buy with Card
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      )}
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems().length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;