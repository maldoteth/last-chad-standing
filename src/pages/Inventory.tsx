import { useState, useEffect } from "react";
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Package, Calendar, Star } from "lucide-react";
import { UserInventoryItem } from "@/hooks/useStore";
import { useToast } from "@/hooks/use-toast";

const Inventory = () => {
  const { authenticated, user } = usePrivy();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [inventory, setInventory] = useState<UserInventoryItem[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authenticated) {
      navigate('/store');
      return;
    }
    fetchUserData();
  }, [authenticated, navigate, user?.id]);

  const fetchUserData = async () => {
    if (!user?.id) return;

    // Fetch inventory
    const { data: inventoryData, error: inventoryError } = await supabase
      .from('user_inventory')
      .select(`
        id,
        item_id,
        quantity,
        purchased_at,
        store_items (*)
      `)
      .eq('user_id', user.id)
      .order('purchased_at', { ascending: false });

    if (inventoryError) {
      toast({
        title: "Error",
        description: "Failed to fetch inventory",
        variant: "destructive"
      });
    } else {
      setInventory(inventoryData || []);
    }

    // Fetch transaction history
    const { data: transactionData, error: transactionError } = await supabase
      .from('transactions')
      .select(`
        id,
        amount,
        transaction_type,
        created_at,
        store_items (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (transactionError) {
      toast({
        title: "Error",
        description: "Failed to fetch transaction history",
        variant: "destructive"
      });
    } else {
      setTransactions(transactionData || []);
    }

    setLoading(false);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "text-yellow-400 border-yellow-400/30";
      case "epic": return "text-purple-400 border-purple-400/30";
      case "rare": return "text-blue-400 border-blue-400/30";
      default: return "text-gray-400 border-gray-400/30";
    }
  };

  if (!authenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/store')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Store
            </Button>
            <Package className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">My Inventory</h1>
          </div>

          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>{user?.email?.address?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{user?.email?.address}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your inventory...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Inventory Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Owned Items ({inventory.length})</span>
                    <Package className="w-5 h-5 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {inventory.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No items yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Visit the store to purchase your first items!
                      </p>
                      <Button onClick={() => navigate('/store')}>
                        Browse Store
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {inventory.map((item) => (
                        <Card key={item.id} className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white border border-gray-600/50 shadow-xl">
                          <CardContent className="p-4">
                            <div className="aspect-square bg-gray-800/50 rounded-lg mb-3 overflow-hidden">
                              <img 
                                src={item.store_items.image_url || '/placeholder.svg'} 
                                alt={item.store_items.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-sm text-white">{item.store_items.name}</h3>
                                <Badge variant="outline" className={`text-xs capitalize ${getRarityColor(item.store_items.rarity)}`}>
                                  <Star className="w-3 h-3 mr-1" />
                                  {item.store_items.rarity}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center justify-between text-xs text-gray-300">
                                <span>Qty: {item.quantity}</span>
                                <span>{new Date(item.purchased_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Transaction History */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Recent Purchases</span>
                    <Calendar className="w-5 h-5 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {transactions.length === 0 ? (
                    <div className="text-center py-6">
                      <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">No purchases yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={transaction.store_items?.image_url || '/placeholder.svg'} 
                              alt={transaction.store_items?.name || 'Item'}
                              className="w-8 h-8 rounded object-cover"
                            />
                            <div>
                              <p className="text-sm font-medium">{transaction.store_items?.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(transaction.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1">
                              <img src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" alt="LCS Coin" className="w-3 h-3" />
                              <span className="text-sm font-semibold text-red-500">-{transaction.amount}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;