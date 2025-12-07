import React from 'react';
import { Scissors, User, Shirt, Sparkles } from 'lucide-react';
import { AppMode } from '../types';

interface HeaderProps {
  currentMode: AppMode;
  onNavigate: (mode: AppMode) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentMode, onNavigate }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center space-x-2 cursor-pointer group" 
          onClick={() => onNavigate(AppMode.HOME)}
        >
          <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-500 transition-colors">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            StyleAI
          </span>
        </div>

        <nav className="flex items-center space-x-1 sm:space-x-4">
          <button
            onClick={() => onNavigate(AppMode.FACE)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all ${
              currentMode === AppMode.FACE 
                ? 'bg-zinc-800 text-white' 
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
            }`}
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline text-sm font-medium">Face & Hair</span>
          </button>
          
          <button
            onClick={() => onNavigate(AppMode.BODY)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all ${
              currentMode === AppMode.BODY 
                ? 'bg-zinc-800 text-white' 
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
            }`}
          >
            <Shirt className="h-4 w-4" />
            <span className="hidden sm:inline text-sm font-medium">Full Body</span>
          </button>
        </nav>
      </div>
    </header>
  );
};