import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import StoreCarousel from '@/components/StoreCarousel';
import { useStore } from '@/hooks/useStore';

const Game = () => {
  const { storeItems, loading, purchaseItem, userBalance } = useStore();
  const [packs, setPacks] = useState([]);
  const [otherItems, setOtherItems] = useState([]);

  useEffect(() => {
    // Separate packs from other items
    const packsList = storeItems.filter(item => item.category === 'packs');
    const othersList = storeItems.filter(item => item.category !== 'packs');
    setPacks(packsList);
    setOtherItems(othersList);
  }, [storeItems]);

  const scrollToPacksSection = () => {
    const packsSection = document.getElementById('packs-section');
    if (packsSection) {
      packsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderStoreItem = (item, idx) => (
    <div key={item.id} className="flex flex-col items-center p-2 bg-gray-900 rounded-md">
      <img src={item.image_url || '/placeholder.png'} alt={item.name} className="w-24 h-24 object-contain" />
      <div className="mt-2 text-center">
        <h3 className="text-sm font-semibold">{item.name}</h3>
        <p className="text-xs text-gray-400">{item.rarity}</p>
        <p className="text-xs mt-1">{item.price} coins</p>
        <Button
          size="sm"
          className="mt-2 w-full"
          onClick={() => purchaseItem(item.id, item.name, item.price)}
          disabled={userBalance.coins < item.price}
        >
          Buy
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <header className="p-4 flex justify-between items-center border-b border-gray-800">
        <h1 className="text-2xl font-bold">Game Store</h1>
        <Button
          onClick={scrollToPacksSection}
          className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 text-xs h-7 relative z-10 transition-all duration-300 w-full max-w-xs"
        >
          Buy Now
        </Button>
      </header>

      <main className="p-6 space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Featured Packs</h2>
          <div id="packs-section">
            {loading ? (
              <p>Loading packs...</p>
            ) : packs.length > 0 ? (
              <StoreCarousel items={packs} renderItem={renderStoreItem} desktopMode />
            ) : (
              <p>No packs available.</p>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Other Items</h2>
          {loading ? (
            <p>Loading items...</p>
          ) : otherItems.length > 0 ? (
            <StoreCarousel items={otherItems} renderItem={renderStoreItem} />
          ) : (
            <p>No items available.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Game;
