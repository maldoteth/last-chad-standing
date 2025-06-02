
import React from 'react';
import { ArrowLeft, FileText, Book, Code, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Documents = () => {
  const documentSections = [
    {
      title: "Getting Started",
      icon: <Book size={20} />,
      items: [
        { title: "Introduction to Last Chad Standing", href: "#intro" },
        { title: "Game Rules & Mechanics", href: "#rules" },
        { title: "Character Creation", href: "#characters" },
        { title: "First Match Guide", href: "#first-match" }
      ]
    },
    {
      title: "Game Mechanics",
      icon: <Code size={20} />,
      items: [
        { title: "Combat System", href: "#combat" },
        { title: "Training & Skills", href: "#training" },
        { title: "Equipment & Gear", href: "#equipment" },
        { title: "Battle Royale Rules", href: "#battle-royale" }
      ]
    },
    {
      title: "Community",
      icon: <Users size={20} />,
      items: [
        { title: "Tournaments", href: "#tournaments" },
        { title: "Leaderboards", href: "#leaderboards" },
        { title: "Discord Community", href: "#discord" },
        { title: "Streaming Guidelines", href: "#streaming" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Game</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">Documentation</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-6 sticky top-24">
              {documentSections.map((section) => (
                <div key={section.title} className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-900 font-medium">
                    {section.icon}
                    <span>{section.title}</span>
                  </div>
                  <ul className="space-y-2 ml-6">
                    {section.items.map((item) => (
                      <li key={item.title}>
                        <a 
                          href={item.href}
                          className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="prose prose-gray max-w-none">
                <h1 id="intro">Welcome to Last Chad Standing</h1>
                <p className="text-lg text-gray-600 mb-8">
                  The first MMA Battle Royale game where strength, strategy, and survival collide.
                </p>

                <section id="rules" className="mb-12">
                  <h2>Game Rules & Mechanics</h2>
                  <p>
                    Last Chad Standing combines traditional MMA fighting with battle royale elements. 
                    Players compete in an ever-shrinking arena where only the strongest survive.
                  </p>
                  <ul>
                    <li>Up to 100 players per match</li>
                    <li>Real-time combat system</li>
                    <li>Dynamic arena shrinking</li>
                    <li>Equipment and skill progression</li>
                  </ul>
                </section>

                <section id="characters" className="mb-12">
                  <h2>Character Creation</h2>
                  <p>
                    Create your ultimate fighter with our comprehensive character creation system.
                    Choose from various fighting styles, customize your appearance, and develop your skills.
                  </p>
                </section>

                <section id="first-match" className="mb-12">
                  <h2>Your First Match</h2>
                  <p>
                    New to the game? Here's everything you need to know to jump into your first battle royale match.
                  </p>
                  <ol>
                    <li>Complete the tutorial</li>
                    <li>Customize your character</li>
                    <li>Join a match lobby</li>
                    <li>Survive and be the last chad standing!</li>
                  </ol>
                </section>

                <section id="combat" className="mb-12">
                  <h2>Combat System</h2>
                  <p>
                    Master our intuitive yet deep combat system featuring striking, grappling, and ground game mechanics.
                  </p>
                </section>

                <section id="tournaments" className="mb-12">
                  <h2>Tournaments & Events</h2>
                  <p>
                    Compete in weekly tournaments and special events to prove you're the ultimate fighter.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
