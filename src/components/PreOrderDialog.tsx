import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
}

const PreOrderDialog = ({ children }: PreOrderDialogProps) => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

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
      <DialogContent className="bg-black/90 border border-white/20 backdrop-blur-sm text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-exo text-2xl text-center text-white mb-6">
            Pre-Order Last Chad Standing
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-3 gap-6">
          {preOrderTiers.map(tier => (
            <div 
              key={tier.id} 
              className={`relative border rounded-lg p-6 cursor-pointer transition-all duration-200 ${
                selectedTier === tier.id 
                  ? 'border-cyan-400 bg-cyan-400/10' 
                  : 'border-white/20 bg-black/20 hover:border-white/40'
              } ${tier.popular ? 'ring-2 ring-cyan-400/50' : ''}`} 
              onClick={() => setSelectedTier(tier.id)}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-cyan-400 text-black px-3 py-1 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap">
                    MOST POPULAR
                  </span>
                </div>
              )}
              
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
              
              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-cyan-400 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex justify-center">
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
          <p className="text-xs text-slate-400 mt-3">Secure payment processing • Limit 1 per customer</p>
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