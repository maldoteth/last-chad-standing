import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy = () => {
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
            Privacy Policy
          </h1>
          
          <div className="prose prose-gray max-w-none text-white/90 space-y-6">
            <p className="text-lg">
              Last Updated: August 2, 2025
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-white mb-2">Personal Information</h3>
              <p>
                We may collect personal information you provide directly, such as:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Username and display name</li>
                <li>Email address (if provided)</li>
                <li>Profile information and preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-2">Game Data</h3>
              <p>
                We automatically collect game-related information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Gameplay statistics and performance data</li>
                <li>In-game achievements and progress</li>
                <li>Device information and technical data</li>
                <li>IP address and general location information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
              <p>We use collected information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and improve the gaming experience</li>
                <li>Maintain player accounts and save game progress</li>
                <li>Enable multiplayer features and matchmaking</li>
                <li>Prevent cheating and maintain fair play</li>
                <li>Communicate important game updates</li>
                <li>Analyze game performance and player behavior</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Information Sharing</h2>
              <p>
                We do not sell your personal information. We may share information in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>With service providers who help us operate the game</li>
                <li>To comply with legal obligations or protect our rights</li>
                <li>In connection with a business transfer or acquisition</li>
                <li>With your consent for specific purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Data Retention</h2>
              <p>
                We retain your information for as long as necessary to provide our services and comply with legal obligations. Inactive accounts may be deleted after a reasonable period of inactivity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibent text-white mb-4">6. Third-Party Services</h2>
              <p>
                Our game may integrate with third-party services for analytics, advertising, or social features. These services have their own privacy policies, and we encourage you to review them.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Children's Privacy</h2>
              <p>
                Our game is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will delete the information promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Your Rights</h2>
              <p>
                Depending on your location, you may have rights regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access to your personal information</li>
                <li>Correction of inaccurate information</li>
                <li>Deletion of your information</li>
                <li>Data portability</li>
                <li>Opting out of certain data processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy in the game or through other communication methods.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or our data practices, please contact us through our official support channels or social media.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;