import React from 'react';
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom";

const Game = () => {
  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 py-4">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="text-lg font-bold">
            <Link to="/">
              My Website
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center space-x-6">
            <Link to="/" className="hover:text-gray-300">
              Home
            </Link>
            <Link to="/docs" className="hover:text-gray-300">
              Docs
            </Link>
            <Link to="/blog" className="hover:text-gray-300">
              Blog
            </Link>
            <Link to="/game" className="hover:text-gray-300">
              Game
            </Link>
            <Button asChild variant="secondary">
              <Link to="/admin">
                Admin
              </Link>
            </Button>
          </nav>

          {/* Mobile Navigation (Hamburger Menu) */}
          <div className="md:hidden">
            {/* Add hamburger menu icon here */}
            {/* Implement mobile menu functionality */}
            Menu
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">
          Welcome to the Game Page!
        </h1>
        <p className="text-gray-400">
          This is where the game content will go.
        </p>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-center py-4">
        <p className="text-gray-500">
          © {new Date().getFullYear()} My Website. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Game;
