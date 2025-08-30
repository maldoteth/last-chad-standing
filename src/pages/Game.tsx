import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { StoreItem } from "@/hooks/useStore";
import { supabase } from '@/integrations/supabase/client';
import { GameItem } from '@/components/GameItem';
import { useUser } from '@/hooks/useUser';

const Game = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const { user, isLoading: userLoading } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user && !userLoading) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchStoreItems();
    }
  }, [navigate, user, userLoading]);

  const fetchStoreItems = async () => {
    const { data, error } = await supabase
      .from('store_items')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch store items",
        variant: "destructive"
      });
      return;
    }

    setStoreItems(data || []);
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Game</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
                Profile
              </Button>
              {user?.email === 'admin@example.com' && (
                <Button variant="secondary" size="sm" onClick={() => navigate('/admin')}>
                  Admin Panel
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Special Pack Card */}
          
                    <Card className="bg-gradient-to-br from-orange-500/90 to-red-600/90 text-white border-0 hover:scale-105 transition-transform cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <img 
                          src="/lovable-uploads/special-pack-end-of-summer.png" 
                          alt="EO Summer Pack" 
                          className="w-16 h-16 mx-auto mb-3 rounded-lg"
                        />
                        <h3 className="font-semibold text-sm text-white mb-2">EO Summer Pack</h3>
                        <p className="text-xs text-white/80 mb-3">Limited time special pack with exclusive summer items</p>
                        <Button size="sm" className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30">
                          Get Pack
                        </Button>
                      </CardContent>
                    </Card>
          

          {/* Store Items */}
          {loading ? (
            <div>Loading store items...</div>
          ) : (
            storeItems.map((item) => (
              <GameItem key={item.id} item={item} />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Game;
