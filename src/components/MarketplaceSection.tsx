
import React from 'react';

const MarketplaceSection = () => {
  return (
    <div className="container mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Marketplace</h1>
        <p className="text-gray-300">Browse and trade NFTs and game items</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Featured Items</h3>
          <p className="text-gray-300">Discover the latest featured items in the marketplace.</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">My Items</h3>
          <p className="text-gray-300">View and manage your owned items.</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Trading History</h3>
          <p className="text-gray-300">Track your trading activity and history.</p>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceSection;
