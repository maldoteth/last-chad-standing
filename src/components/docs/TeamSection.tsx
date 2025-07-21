import React from 'react';

const TeamSection = () => {
  return (
    <section id="founding-team" className="mb-12">
      <h2 className="text-3xl font-bold">Founding Team</h2>
      <p className="mb-6">Meet the team behind Last Chad Standing.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Team Member 1 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
            <img 
              src="/lovable-uploads/909e4c87-a878-40aa-96be-f612a1dbac06.png" 
              alt="Chris - Founder" 
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-xl font-bold text-center mb-2">Chris</h3>
          <p className="text-gray-600 text-center mb-4">Founder & CEO</p>
          <p className="text-sm text-gray-700 text-center">
            Visionary behind Last Chad Standing with extensive experience in game development and blockchain technology.
          </p>
        </div>

        {/* Team Member 2 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
            <img 
              src="/lovable-uploads/7d4ea94f-0c4d-459f-bded-b68a2bd272d6.png" 
              alt="Alex - Lead Developer" 
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-xl font-bold text-center mb-2">Alex</h3>
          <p className="text-gray-600 text-center mb-4">Lead Developer</p>
          <p className="text-sm text-gray-700 text-center">
            Technical lead responsible for the game engine and core combat mechanics that make Last Chad Standing unique.
          </p>
        </div>

        {/* Team Member 3 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
            <img 
              src="/lovable-uploads/dd15acda-3123-4e95-916c-ba6ef8db31fd.png" 
              alt="Jordan - Art Director" 
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-xl font-bold text-center mb-2">Jordan</h3>
          <p className="text-gray-600 text-center mb-4">Art Director</p>
          <p className="text-sm text-gray-700 text-center">
            Creative director bringing the brutal and visceral world of Last Chad Standing to life through stunning visuals.
          </p>
        </div>
      </div>

      {/* Profit Share Information */}
      <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <h3 className="text-2xl font-bold mb-4">Profit Share Program</h3>
        <p className="text-gray-700 mb-4">
          As part of our commitment to the community, Last Chad Standing implements a profit share program where token holders receive a portion of the game's revenue.
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><strong>Revenue Share:</strong> 25% of net profits distributed to $LCS token holders</li>
          <li><strong>Distribution Method:</strong> Quarterly distributions based on token holdings</li>
          <li><strong>Minimum Holding:</strong> 10,000 $LCS tokens to be eligible</li>
          <li><strong>Revenue Sources:</strong> In-game purchases, NFT marketplace fees, tournament entry fees</li>
        </ul>
        <div className="mt-4 p-4 bg-white rounded border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> Profit share distributions are subject to game revenue performance and regulatory compliance. Detailed terms and conditions will be provided in the official token documentation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;