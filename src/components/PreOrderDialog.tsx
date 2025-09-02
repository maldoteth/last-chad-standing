import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GlowCard } from '@/components/ui/spotlight-card';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface PreOrderTier {
  id: string;
  name: string;
  price: number;
  originalValue?: number;
  features: string[];
  popular?: boolean;
}

const preOrderTiers: PreOrderTier[] = [{
  id: 'game-only',
  name: 'Classic Edition',
  price: 18,
  features: ['Full game access', 'Standard gameplay experience', 'Combo of Packs']
}, {
  id: 'special-edition',
  name: 'Special Edition',
  price: 69,
  originalValue: 200,
  popular: true,
  features: ['Early access', 'Special Pack Bundle', 'Worth $200 total value']
}, {
  id: 'ultimate-edition',
  name: 'Ultimate Edition',
  price: 420,
  originalValue: 1000,
  features: ['First access privilege', 'Exclusive in-game badge', 'Ultimate Pack Bundle', 'Worth $1000 total value']
}];

interface PreOrderDialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const PreOrderDialog = ({ children, open: externalOpen, onOpenChange: externalOnOpenChange }: PreOrderDialogProps) => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [internalOpen, setInternalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = externalOnOpenChange || setInternalOpen;

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handlePreOrder = async () => {
    if (!selectedTier) return;

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to your account before making a pre-order.",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: "Processing...",
        description: "Redirecting to checkout...",
      });

      const { data, error } = await supabase.functions.invoke('create-preorder-checkout', {
        body: { tierId: selectedTier }
      });

      if (error) {
        throw error;
      }

      if (data.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        setIsOpen(false);
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Pre-order error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process pre-order. Please try again.",
        variant: "destructive"
      });
    }
  };

  const contentClassName = "bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700/50 backdrop-blur-md text-white shadow-2xl before:absolute before:inset-0 before:bg-gradient-to-br before:from-gray-800/20 before:via-transparent before:to-gray-900/30 before:pointer-events-none";

  const renderContent = () => (
    <>
      <div className="grid md:grid-cols-3 gap-6">
        {preOrderTiers.map(tier => (
          <GlowCard key={tier.id} className="cursor-pointer h-full !bg-none !border-none">
            <div 
              className={`rounded-lg p-6 h-full min-h-[400px] md:min-h-[420px] flex flex-col transition-all duration-200 border ${
                selectedTier === tier.id 
                  ? 'bg-gradient-to-br from-[#2665cb]/20 via-[#2665cb]/10 to-transparent border-[#2665cb]/50' 
                  : 'bg-gradient-to-br from-gray-800/50 via-gray-900/50 to-black/50 border-gray-600/50'
              }`}
              onClick={() => setSelectedTier(tier.id)}
            >
              <div className="text-center mb-4">
                <h3 className="font-exo text-xl font-semibold mb-2">{tier.name}</h3>
                <div className="mb-4">
                  <div className="text-3xl font-bold" style={{ color: '#2665cb' }}>${tier.price}</div>
                  {tier.originalValue && (
                    <div className="text-sm text-slate-400">
                      <span className="line-through">${tier.originalValue} value</span>
                       <span style={{ color: '#2665cb' }} className="ml-2">
                         Save ${tier.originalValue - tier.price}
                       </span>
                    </div>
                  )}
                </div>
              </div>
              
              <ul className="space-y-3 mb-6 flex-1">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <Check style={{ color: '#2665cb' }} className="w-4 h-4 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex justify-center mt-auto">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedTier === tier.id 
                    ? 'border-[#2665cb]' 
                    : 'border-white/40'
                } ${selectedTier === tier.id ? 'bg-[#2665cb]' : ''}`}>
                  {selectedTier === tier.id && (
                    <div className="w-full h-full rounded-full bg-[#2665cb]"></div>
                  )}
                </div>
              </div>
            </div>
          </GlowCard>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <Button 
          onClick={handlePreOrder} 
          disabled={!selectedTier} 
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:ring-1 hover:ring-primary/30 hover:shadow-lg hover:shadow-primary/20 hover:shadow-[0_0_20px_rgba(38,101,203,0.4)] font-exo font-semibold px-8 py-4 h-12 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          {selectedTier ? 'Pre-Order Now' : 'Select a Package'}
        </Button>
        
        <div className="mt-4 flex justify-center">
          <img 
            src="/lovable-uploads/7d84dfb4-4db3-4adb-87f0-36f33c0f8daa.png" 
            alt="Powered by Stripe" 
            className="h-6 opacity-80 brightness-0 saturate-100"
            style={{ filter: 'brightness(0) saturate(100%) invert(35%) sepia(78%) saturate(2446%) hue-rotate(214deg) brightness(97%) contrast(90%)' }}
          />
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          {children}
        </SheetTrigger>
        <SheetContent 
          side="bottom" 
          className={`${contentClassName} max-h-[90vh] overflow-y-auto rounded-t-xl`}
        >
          <SheetHeader>
            <SheetTitle className="font-exo text-2xl text-center text-white mb-6">
              Pre-Oder LCS
            </SheetTitle>
          </SheetHeader>
          {renderContent()}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className={`${contentClassName} max-w-4xl max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className="font-exo text-2xl text-center text-white mb-6">
            Pre-Oder LCS
          </DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default PreOrderDialog;