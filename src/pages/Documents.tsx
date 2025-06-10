import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Search, FileText, Users, Zap, Trophy, DollarSign, BookOpen, Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import DocumentSearch from '@/components/DocumentSearch';

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const navigationItems = [
    { icon: FileText, label: 'Whitepaper', href: '#whitepaper' },
    { icon: Users, label: 'Community Guidelines', href: '#community' },
    { icon: Zap, label: 'Tournament Rules', href: '#tournament' },
    { icon: Trophy, label: 'Leaderboard System', href: '#leaderboard' },
    { icon: DollarSign, label: 'Tokenomics', href: '#tokenomics' },
    { icon: BookOpen, label: 'Game Mechanics', href: '#mechanics' },
    { icon: Image, label: 'Brand Assets', href: '/brand-assets', isRoute: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <img 
              src="/lovable-uploads/af18551a-62b4-4f17-84d9-0215cff91604.png" 
              alt="Last Chad Standing Logo" 
              className="h-24 w-auto border-2 border-red-500"
            />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Documentation
              </h1>
              <p className="text-xl text-white/80 mt-2">
                Everything you need to know about Last Chad Standing
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 sticky top-8">
              <h2 className="text-xl font-bold mb-4">Navigation</h2>
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  if (item.isRoute) {
                    return (
                      <Link
                        key={item.label}
                        to={item.href}
                        className="flex items-center gap-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-3 transition-all duration-200"
                      >
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  }
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-3 transition-all duration-200"
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </a>
                  );
                })}
              </nav>

              {/* Contact Section */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <h3 className="text-lg font-semibold mb-3">Contact</h3>
                <p className="text-white/70 text-sm mb-3">
                  Have questions? Reach out to us:
                </p>
                <a 
                  href="mailto:support@lastchadstanding.com" 
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  support@lastchadstanding.com
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-white/50" size={20} />
                <Input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            </div>

            {/* Search Component */}
            <DocumentSearch searchQuery={searchQuery} />

            {/* Content Sections */}
            <section id="whitepaper" className="mb-16">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <FileText className="text-blue-400" />
                    Whitepaper
                  </h2>
                  <p className="text-white/80 mb-4">
                    Last Chad Standing (LCS) is a competitive mobile game that combines elements of trivia, strategy, and social competition. Players compete in daily tournaments to be the "Last Chad Standing" and win prizes.
                  </p>
                  <p className="text-white/80 mb-4">
                    The game features a unique elimination system where players must answer questions correctly and strategically use power-ups to stay in the game. As rounds progress, the difficulty increases and the stakes get higher.
                  </p>
                  <p className="text-white/80">
                    Our vision is to create a global competitive platform that rewards knowledge, quick thinking, and strategic gameplay while building a vibrant community of players.
                  </p>
                </CardContent>
              </Card>
            </section>

            <section id="community" className="mb-16">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Users className="text-green-400" />
                    Community Guidelines
                  </h2>
                  <div className="space-y-4 text-white/80">
                    <p>
                      At Last Chad Standing, we're committed to fostering a positive and inclusive community. Please follow these guidelines:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Be respectful to other players</li>
                      <li>No hate speech, discrimination, or harassment</li>
                      <li>Don't cheat or exploit game mechanics</li>
                      <li>Keep your username and profile appropriate</li>
                      <li>Report any violations or concerns to our moderation team</li>
                    </ul>
                    <p>
                      Violations of these guidelines may result in warnings, temporary suspension, or permanent bans depending on severity and frequency.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="tournament" className="mb-16">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Zap className="text-yellow-400" />
                    Tournament Rules
                  </h2>
                  <div className="space-y-4 text-white/80">
                    <p>
                      Tournaments are the heart of Last Chad Standing. Here's how they work:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Daily tournaments start at specific times (check the app for schedule)</li>
                      <li>Players must register at least 5 minutes before start time</li>
                      <li>Each tournament consists of multiple rounds of increasing difficulty</li>
                      <li>Players have limited time to answer each question</li>
                      <li>Incorrect answers or timeout results in elimination</li>
                      <li>Power-ups can be used strategically to stay in the game</li>
                      <li>The last player remaining wins the grand prize</li>
                      <li>Runner-ups may receive smaller prizes depending on the tournament</li>
                    </ul>
                    <p>
                      Special tournaments with unique rules and bigger prizes are held monthly.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="leaderboard" className="mb-16">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Trophy className="text-amber-400" />
                    Leaderboard System
                  </h2>
                  <div className="space-y-4 text-white/80">
                    <p>
                      Our leaderboard system tracks player performance across multiple dimensions:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Daily Leaderboard:</strong> Resets every 24 hours, shows top performers in daily tournaments</li>
                      <li><strong>Weekly Leaderboard:</strong> Tracks cumulative performance over a week</li>
                      <li><strong>Monthly Leaderboard:</strong> Shows the most consistent players over a month</li>
                      <li><strong>All-Time Leaderboard:</strong> Historical record of the best players since launch</li>
                      <li><strong>Category Leaderboards:</strong> Track performance in specific question categories</li>
                    </ul>
                    <p>
                      Leaderboard rankings are determined by a combination of wins, average placement, correct answer rate, and speed.
                    </p>
                    <p>
                      Top leaderboard positions earn special badges, exclusive cosmetics, and may qualify for invitation-only tournaments.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="tokenomics" className="mb-16">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <DollarSign className="text-purple-400" />
                    Tokenomics
                  </h2>
                  <div className="space-y-4 text-white/80">
                    <p>
                      Last Chad Standing features an in-game economy powered by LCS Tokens:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Earning Tokens:</strong> Win tournaments, complete daily challenges, refer friends</li>
                      <li><strong>Using Tokens:</strong> Purchase power-ups, cosmetic items, tournament entries</li>
                      <li><strong>Token Distribution:</strong> 40% player rewards, 25% development, 20% prize pools, 15% operations</li>
                      <li><strong>Token Supply:</strong> Limited to 1 billion tokens, with controlled release schedule</li>
                    </ul>
                    <p>
                      Premium features can be accessed through a subscription model or one-time token purchases.
                    </p>
                    <p>
                      Tournament prize pools are funded through entry fees and supplemented by the company's token allocation.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="mechanics" className="mb-16">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <BookOpen className="text-red-400" />
                    Game Mechanics
                  </h2>
                  <div className="space-y-4 text-white/80">
                    <p>
                      Last Chad Standing features several core gameplay mechanics:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Question Types:</strong> Multiple choice, true/false, picture identification, audio recognition</li>
                      <li><strong>Power-ups:</strong> Extra life, time extension, 50/50 (eliminates two wrong answers), question skip</li>
                      <li><strong>Elimination System:</strong> Players are eliminated after incorrect answers or timeouts</li>
                      <li><strong>Difficulty Progression:</strong> Questions become harder as rounds progress</li>
                      <li><strong>Speed Bonus:</strong> Faster correct answers earn bonus points</li>
                      <li><strong>Category Specialization:</strong> Players can earn badges in categories they excel at</li>
                    </ul>
                    <p>
                      The game also features special event mechanics like Double Elimination rounds, Lightning Rounds (shorter time limits), and Category Focus rounds.
                    </p>
                    <p>
                      Strategic use of power-ups and managing your "confidence meter" are key to success in high-stakes tournaments.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
