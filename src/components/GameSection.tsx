
import React from 'react';

const GameSection = () => {
  return (
    <div className="container mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Game Section</h1>
        <p className="text-gray-300">Welcome to Last Chad Standing game!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Game Stats</h3>
          <p className="text-gray-300">Your game statistics will appear here.</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <p className="text-gray-300">Game controls and actions will be available here.</p>
        </div>
      </div>
    </div>
  );
};

export default GameSection;
