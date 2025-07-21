import React from 'react';

const GameDocumentation = () => {
  return (
    <>
      {/* Game Blueprint Header */}
      <div className="mb-12 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Game Blueprint: Last Chad Standing</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><strong>Genre:</strong> Third-Person Fighter Battle Royale</div>
          <div><strong>Players:</strong> 20-100 players per lobby</div>
          <div><strong>Platforms:</strong> PC, next-gen consoles</div>
          <div><strong>Rating:</strong> Mature audiences (PEGI 18+)</div>
        </div>
      </div>

      {/* Core Concept */}
      <section id="core-concept" className="mb-12">
        <h2 className="text-4xl font-bold">1. Core Concept</h2>
        <p>Last Chad Standing is a high-intensity, fast paced, third person fighter battle royale. Players choose from a cast of customizable fighters, each trained in unique fight styles and abilities, in a fast-paced, melee-focused environment. The game emphasizes brutal hand-to-hand combat in an open-world island setting, with dynamic environmental hazards and blood-soaked brawls to the death. Only one Chad can remain standing, and he takes home the loot for his troubles.</p>
        
        <br />
        
        <h3 className="font-bold">Overview</h3>
        <p>Players are thrown onto the island via helicopter, scattered randomly, and must use both wits and combat prowess to survive against at least 19 other players. The shrinking cage forces fighters into close quarters, ensuring non stop action. Combat is visceral, utilizing a mix of strikes, grappling, weaponry, and brutal finishers.</p>
      </section>

      {/* Helicopter Drop Image */}
      <div className="my-8 w-full">
        <img src="/lovable-uploads/1615e7da-29d5-454e-a2fe-57f5abf91d56.png" alt="Helicopter dropping players onto the island" className="w-full h-auto rounded-lg shadow-md" />
      </div>

      {/* Game World */}
      <section id="game-world" className="mb-12">
        <h2 className="text-3xl font-bold">2. Game World & Environment</h2>
        <h3 className="text-2xl font-bold"></h3>
        <p>The map is a relatively small, derelict resort island filled with destructible environments, including beaches, dense jungles, abandoned industrial areas, and decaying urban ruins. The environment offers both vertical and horizontal exploration opportunities, such as:</p>
        <ul>
          <li><strong>Beaches:</strong> Wide open spaces where players can be easily spotted but have more visibility.</li>
          <li><strong>Jungle:</strong> Dense cover where players can ambush or be ambushed.</li>
          <li><strong>Resort Ruins:</strong> Multi-level buildings, providing vantage points for striking down on other players.</li>
          <li><strong>Industrial Complex:</strong> Space to camp but comes with environmental and structural hazards</li>
        </ul>
        <p>There are environmental traps like collapsing floors, explosive barrels, and natural hazards (e.g., lava flows, flooding). The environment also dynamically changes over time due to the collapsing zone, adding urgency to exploration.</p>
      </section>

      {/* Aerial Drop Combat Image */}
      <div className="my-8 w-full">
        <img src="/lovable-uploads/b31c9ab4-6dcf-4a77-bdf6-7e82e5a8c66a.png" alt="Aerial view of combat on the island" className="w-full h-auto rounded-lg shadow-md" />
      </div>

      {/* Gameplay Mechanics */}
      <section id="gameplay-mechanics" className="mb-12">
        <h2 className="text-3xl font-bold">3. Gameplay Mechanics</h2>
        <p>Players are thrown out of a helicopter flying erratically over the island, with random ejection points adding an element of chaos and unpredictability to the start of each match.</p>
        <br />
        <h3 className="text-2xl font-bold">Combat System</h3>
        <p>Combat is the heart of Last Chad Standing. It focuses on hand-to-hand fighting with a realistic physics engine. Every hit feels weighty, and the results of brutal combat are visually emphasized with blood, broken bones, and dismemberment.</p>
        {/* Continue with rest of game mechanics content... */}
      </section>

      {/* Additional sections would continue here in the same pattern */}
    </>
  );
};

export default GameDocumentation;
