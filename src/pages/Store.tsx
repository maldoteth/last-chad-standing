import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Coins, ShoppingBag, Settings, LogOut, ArrowLeft, Filter, Search, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Store = () => {
  const [userCoins] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { toast } = useToast();
  const { login, logout, authenticated, user } = usePrivy();
  const navigate = useNavigate();

  // Sample store items
  const storeItems = {
    skins: [
      { id: 1, name: "Cyber Warrior", price: 2500, rarity: "legendary", image: "/lovable-uploads/2390abe9-bd8c-4568-8198-12a97fb918e3.png" },
      { id: 2, name: "Shadow Assassin", price: 1800, rarity: "epic", image: "/lovable-uploads/3c1059ce-1948-46a2-bc2a-8e6c6b55079d.png" },
      { id: 3, name: "Neon Fighter", price: 1200, rarity: "rare", image: "/lovable-uploads/4ab5b809-ec42-4474-b698-a64f8b2514d1.png" },
      { id: 4, name: "Street Brawler", price: 800, rarity: "common", image: "/lovable-uploads/5c309cef-5628-4ff0-abb3-2351ef140372.png" },
    ],
    accessories: [
      { id: 5, name: "Neon Sneakers", price: 600, rarity: "epic", image: "/lovable-uploads/69c61fed-9ccd-43d2-bab5-17c6c0db05b4.png" },
      { id: 6, name: "Combat Backpack", price: 450, rarity: "rare", image: "/lovable-uploads/7311683b-ea99-4dd9-9b1f-89d96742eff0.png" },
      { id: 7, name: "Tactical Hat", price: 300, rarity: "common", image: "/lovable-uploads/745baeae-f05a-4a2a-828f-45aed6d05972.png" },
      { id: 8, name: "Gold Chain", price: 750, rarity: "rare", image: "/lovable-uploads/77a6c004-93ed-49ee-a5d0-6056ee852612.png" },
    ],
    mobility: [
      { id: 9, name: "Cyber Car", price: 5000, rarity: "legendary", image: "/lovable-uploads/84ab9eed-00bc-425c-a953-3ea0478e464d.png" },
      { id: 10, name: "Speed Buggy", price: 3200, rarity: "epic", image: "/lovable-uploads/896892f1-7ebc-4852-acea-80dcdbf7c545.png" },
      { id: 11, name: "Hover Board", price: 1500, rarity: "rare", image: "/lovable-uploads/89896bcd-7068-4438-ba8d-95f8e577cb75.png" },
      { id: 12, name: "Electric Bike", price: 900, rarity: "common", image: "/lovable-uploads/909e4c87-a878-40aa-96be-f612a1dbac06.png" },
    ]
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "text-yellow-400 border-yellow-400/30";
      case "epic": return "text-purple-400 border-purple-400/30";
      case "rare": return "text-blue-400 border-blue-400/30";
      default: return "text-gray-400 border-gray-400/30";
    }
  };

  const handlePurchase = (itemName: string, price: number) => {
    if (userCoins >= price) {
      toast({
        title: "Purchase Successful!",
        description: `You bought ${itemName} for ${price} LCS coins.`
      });
    } else {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough LCS coins for this purchase.",
        variant: "destructive"
      });
    }
  };

  const filteredItems = () => {
    let items = selectedCategory === "all" 
      ? [...storeItems.skins, ...storeItems.accessories, ...storeItems.mobility]
      : storeItems[selectedCategory as keyof typeof storeItems] || [];
    
    if (searchTerm) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return items;
  };

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
              <span className="font-semibold text-sm lg:text-base">{userCoins.toLocaleString()}</span>
            </div>
            
            {authenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-7 h-7 lg:w-8 lg:h-8 cursor-pointer">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{user?.email?.address?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card border border-border z-50">
                  <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
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
                  <Badge variant="secondary">{storeItems.skins.length}</Badge>
                </CardTitle>
                <CardDescription>Characters to play in game</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-to-br from-blue-600/20 to-purple-700/20 rounded-lg flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/2390abe9-bd8c-4568-8198-12a97fb918e3.png" 
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
                  <Badge variant="secondary">{storeItems.accessories.length}</Badge>
                </CardTitle>
                <CardDescription>Shoes, backpacks, hats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-to-br from-green-600/20 to-blue-700/20 rounded-lg flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/69c61fed-9ccd-43d2-bab5-17c6c0db05b4.png" 
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
                  <Badge variant="secondary">{storeItems.mobility.length}</Badge>
                </CardTitle>
                <CardDescription>Cars, golf buggies, etc</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-to-br from-orange-600/20 to-red-700/20 rounded-lg flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/84ab9eed-00bc-425c-a953-3ea0478e464d.png" 
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
                    src={item.image} 
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
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-4 h-4" />
                      <span className="font-bold text-white">{item.price.toLocaleString()}</span>
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="secondary"
                      className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                      onClick={() => handlePurchase(item.name, item.price)}
                    >
                      Buy Now
                    </Button>
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