import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-sm rounded-lg p-8">
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          
          <div className="prose prose-gray max-w-none text-white/90 space-y-6">
            <p className="text-lg">
              Last Updated: August 2, 2025
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and playing Last Chad Standing ("the Game"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our game.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Game Description</h2>
              <p>
                Last Chad Standing is a competitive multiplayer game where players compete to be the last surviving player. The game may include in-game purchases, rewards, and community features.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Player Conduct</h2>
              <p>Players agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Play fairly and not use cheats, hacks, or exploits</li>
                <li>Respect other players and maintain appropriate conduct</li>
                <li>Not engage in harassment, toxic behavior, or discrimination</li>
                <li>Not attempt to disrupt game servers or other players' experiences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Virtual Items and Purchases</h2>
              <p>
                The Game may offer virtual items, currency, or other digital goods for purchase. All purchases are final and non-refundable unless required by law. Virtual items have no real-world value and cannot be exchanged for real money.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Account Security</h2>
              <p>
                You are responsible for maintaining the security of your account and all activities that occur under your account. Notify us immediately of any unauthorized use.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Intellectual Property</h2>
              <p>
                All game content, including but not limited to graphics, sounds, text, and code, is owned by Last Chad Standing and protected by copyright and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your access to the Game at any time for violation of these terms or for any other reason we deem appropriate.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Limitation of Liability</h2>
              <p>
                The Game is provided "as is" without warranties. We are not liable for any damages arising from your use of the Game, including but not limited to loss of data, interruption of service, or any indirect damages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Changes to Terms</h2>
              <p>
                We may update these Terms of Service at any time. Continued use of the Game after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us through our official social media channels or support system.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;