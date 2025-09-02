import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GlowCard } from '@/components/ui/spotlight-card';

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
  name: 'Game Only',
  price: 10,
  features: ['Full game access', 'Standard gameplay experience']
}, {
  id: 'special-edition',
  name: 'Special Edition',
  price: 100,
  originalValue: 200,
  popular: true,
  features: ['Early access', '15 skin packs', '15 cosmetic packs', 'Worth $200 total value']
}, {
  id: 'ultimate-edition',
  name: 'Ultimate Edition',
  price: 500,
  originalValue: 1000,
  features: ['First access privilege', 'Exclusive in-game badge', '50 skin packs', '50 cosmetic packs', '50 ultimate packs', 'Worth $1000 total value']
}];

interface PreOrderDialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const PreOrderDialog = ({ children, open: externalOpen, onOpenChange: externalOnOpenChange }: PreOrderDialogProps) => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [internalOpen, setInternalOpen] = useState(false);
  const { toast } = useToast();

  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = externalOnOpenChange || setInternalOpen;

  const handlePreOrder = () => {
    if (!selectedTier) return;

    toast({
      title: "Coming Soon!",
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700/50 backdrop-blur-md text-white max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl before:absolute before:inset-0 before:bg-gradient-to-br before:from-gray-800/20 before:via-transparent before:to-gray-900/30 before:pointer-events-none">
        <DialogHeader>
          <DialogTitle className="font-exo text-2xl text-center text-white mb-6">
            Pre-Order Last Chad Standing
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-3 gap-6">
          {preOrderTiers.map(tier => (
            <GlowCard key={tier.id} className="cursor-pointer h-full !bg-none !border-none">
              <div 
                className={`rounded-lg p-6 h-full min-h-[400px] flex flex-col transition-all duration-200 border ${
                  selectedTier === tier.id 
                    ? 'bg-gradient-to-br from-cyan-500/20 via-cyan-400/10 to-transparent border-cyan-400/50' 
                    : 'bg-gradient-to-br from-gray-800/50 via-gray-900/50 to-black/50 border-gray-600/50'
                }`} 
                onClick={() => setSelectedTier(tier.id)}
              >
                <div className="text-center mb-4">
                  <h3 className="font-exo text-xl font-semibold mb-2">{tier.name}</h3>
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-cyan-400">${tier.price}</div>
                    {tier.originalValue && (
                      <div className="text-sm text-slate-400">
                        <span className="line-through">${tier.originalValue} value</span>
                        <span className="text-cyan-400 ml-2">
                          Save ${tier.originalValue - tier.price}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <ul className="space-y-3 mb-6 flex-1">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="w-4 h-4 text-cyan-400 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex justify-center mt-auto">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedTier === tier.id 
                      ? 'border-cyan-400 bg-cyan-400' 
                      : 'border-white/40'
                  }`}>
                    {selectedTier === tier.id && (
                      <div className="w-full h-full rounded-full bg-cyan-400"></div>
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
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:ring-1 hover:ring-primary/30 hover:shadow-lg hover:shadow-primary/20 font-exo font-semibold px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {selectedTier ? 'Pre-Order Now' : 'Select a Package'}
          </Button>
          
          <div className="mt-4 flex justify-center">
            <img 
              src="/lovable-uploads/7d84dfb4-4db3-4adb-87f0-36f33c0f8daa.png" 
              alt="Powered by Stripe" 
              className="h-8 opacity-80"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreOrderDialog;