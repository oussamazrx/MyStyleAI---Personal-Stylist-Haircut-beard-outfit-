import React from 'react';
import { Sparkles, Scissors, Glasses, Shirt } from 'lucide-react';
import { AppMode } from '../types';
import { Button } from './Button';

interface FeaturesProps {
  onNavigate: (mode: AppMode) => void;
}

export const Features: React.FC<FeaturesProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="max-w-3xl space-y-6">
        <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-sm font-medium mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Powered by Gemini 2.5 Flash</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
          Your Personal <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            AI Stylist
          </span>
        </h1>
        
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Upload your photo and let our AI suggest the perfect haircut, beard style, glasses, or fashion outfit tailored specifically to your features.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Button 
            className="w-full sm:w-auto h-12 px-8 text-lg"
            onClick={() => onNavigate(AppMode.FACE)}
          >
            <Scissors className="mr-2 h-5 w-5" />
            Try Face Stylist
          </Button>
          <Button 
            variant="secondary"
            className="w-full sm:w-auto h-12 px-8 text-lg"
            onClick={() => onNavigate(AppMode.BODY)}
          >
            <Shirt className="mr-2 h-5 w-5" />
            Try Outfit Planner
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 text-left">
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <div className="h-10 w-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <Scissors className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Smart Haircuts</h3>
            <p className="text-zinc-400">Analyzes your face shape to suggest cuts that balance and enhance your natural features.</p>
          </div>
          
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <div className="h-10 w-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <Glasses className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Virtual Accessories</h3>
            <p className="text-zinc-400">Find the perfect frames and beard styles to complete your look without commitment.</p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <div className="h-10 w-10 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4">
              <Shirt className="h-6 w-6 text-pink-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Fashion Try-On</h3>
            <p className="text-zinc-400">Visualize new outfits on your body type with generative AI fashion advice.</p>
          </div>
        </div>
      </div>
    </div>
  );
};