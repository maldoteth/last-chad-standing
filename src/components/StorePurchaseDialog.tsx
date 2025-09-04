import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { usePrivy } from '@privy-io/react-auth';
import { useStore } from "@/hooks/useStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Coins, CreditCard, X, Calendar, TrendingUp } from "lucide-react";
import { formatNumberWithAbbreviation } from "@/lib/utils";

interface StorePurchaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    name: string;
    description?: string;
    price: number;
    category: string;
    rarity: string;
    image_url?: string;
    first_release_date?: string;
    total_purchased?: number;
  } | null;
}

export const StorePurchaseDialog: React.FC<StorePurchaseDialogProps> = ({
  isOpen,
  onClose,
  item
}) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { authenticated, login } = usePrivy();
  const { purchaseItem, userBalance } = useStore();

  if (!item) return null;

  const handlePurchaseWithCoins = async () => {
    if (!authenticated) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to make purchases.",
        action: (
          <Button size="sm" onClick={login}>
            Sign In
          </Button>
        )
      });
      return;
    }

    const success = await purchaseItem(item.id, item.name, item.price);
    if (success) {
      onClose();
    }
  };

  const handlePurchaseWithCard = () => {
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

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'epic': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'rare': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'uncommon': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const DialogContent = () => (
    <div className="flex flex-col gap-6 p-6">
      {/* Close button for mobile */}
      {isMobile && (
        <DrawerClose asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 z-10"
          >
            <X className="h-4 w-4" />
          </Button>
        </DrawerClose>
      )}

      {/* Item Image */}
      <div className="flex justify-center">
        <div className="relative">
          <img
            src={item.image_url || "/placeholder.svg"}
            alt={item.name}
            className="w-32 h-32 md:w-40 md:h-40 object-contain rounded-lg"
          />
        </div>
      </div>

      {/* Item Details */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-muted-foreground text-sm md:text-base">
              {item.description}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-center gap-2 py-3 px-4 bg-card rounded-lg border">
          <img 
            src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" 
            alt="LCS Coin" 
            className="w-6 h-6" 
          />
          <span className="text-2xl font-bold text-foreground">
            {formatNumberWithAbbreviation(item.price)}
          </span>
        </div>

        {/* Item Properties */}
        <div className="grid grid-cols-2 gap-4">
          {/* Rarity */}
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Rarity</span>
            <Badge className={`${getRarityColor(item.rarity)} font-medium capitalize`}>
              {item.rarity}
            </Badge>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Category</span>
            <Badge variant="outline" className="capitalize">
              {item.category}
            </Badge>
          </div>

          {/* First Release Date */}
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              First Release
            </span>
            <span className="text-sm font-medium">
              {formatDate(item.first_release_date)}
            </span>
          </div>

          {/* Total Purchased */}
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Total Purchased
            </span>
            <span className="text-sm font-medium">
              {formatNumberWithAbbreviation(item.total_purchased || 0)}
            </span>
          </div>
        </div>

        {/* User Balance Display */}
        {authenticated && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Your balance:</span>
            <div className="flex items-center gap-1">
              <img 
                src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png" 
                alt="LCS Coin" 
                className="w-4 h-4" 
              />
              <span className="font-medium">
                {formatNumberWithAbbreviation(userBalance.coins)}
              </span>
            </div>
          </div>
        )}

        {/* Purchase Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={handlePurchaseWithCoins}
            className="w-full flex items-center gap-2 bg-primary hover:bg-primary/90"
            disabled={authenticated && userBalance.coins < item.price}
          >
            <Coins className="w-4 h-4" />
            Purchase with Coins
          </Button>
          
          <Button
            onClick={handlePurchaseWithCard}
            variant="outline"
            className="w-full flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            Purchase with Card
          </Button>
        </div>

        {/* Insufficient Funds Warning */}
        {authenticated && userBalance.coins < item.price && (
          <div className="text-center text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
            Insufficient coins. You need {formatNumberWithAbbreviation(item.price - userBalance.coins)} more coins.
          </div>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="bg-background/95 backdrop-blur-md border border-border max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle className="text-center">Purchase Item</DrawerTitle>
          </DrawerHeader>
          <DialogContent />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="bg-background/95 backdrop-blur-md border border-border max-h-[90vh] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="text-center">Purchase Item</SheetTitle>
          <SheetClose asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4"
            >
              <X className="h-4 w-4" />
            </Button>
          </SheetClose>
        </SheetHeader>
        <DialogContent />
      </SheetContent>
    </Sheet>
  );
};