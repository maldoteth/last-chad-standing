
import React from 'react';

const ProfileSection = () => {
  return (
    <div className="container mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Profile</h1>
        <p className="text-gray-300">Manage your account and view your progress</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Account Info</h3>
          <p className="text-gray-300">Your account details and settings.</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Achievements</h3>
          <p className="text-gray-300">Track your game achievements and progress.</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Wallet</h3>
          <p className="text-gray-300">Manage your wallet and transactions.</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Settings</h3>
          <p className="text-gray-300">Customize your game preferences.</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
