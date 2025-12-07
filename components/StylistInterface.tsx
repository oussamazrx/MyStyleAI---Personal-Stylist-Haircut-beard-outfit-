import React, { useState, useRef } from 'react';
import { Upload, X, Wand2, ArrowRight, RefreshCcw, Camera, Sparkles, ZoomIn, Loader2, Download } from 'lucide-react';
import { Button } from './Button';
import { analyzeImage, generateStyleVisualization } from '../services/geminiService';
import { AppMode, StylistState } from '../types';
import { ImageZoom } from './ImageZoom';

interface StylistInterfaceProps {
  mode: AppMode;
}

export const StylistInterface: React.FC<StylistInterfaceProps> = ({ mode }) => {
  const [state, setState] = useState<StylistState>({
    image: null,
    previewUrl: null,
    isAnalyzing: false,
    analysis: null,
    generatedImages: {},
    loadingImages: {},
    error: null
  });
  
  const [customPrompt, setCustomPrompt] = useState('');
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setState(prev => ({ 
        ...prev, 
        image: file, 
        previewUrl: url, 
        analysis: null, 
        generatedImages: {},
        loadingImages: {},
        error: null 
      }));
    }
  };

  const handleAnalyze = async () => {
    if (!state.image) return;
    
    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));
    
    try {
      const result = await analyzeImage(state.image, mode === AppMode.FACE ? 'FACE' : 'BODY');
      setState(prev => ({ ...prev, analysis: result, isAnalyzing: false }));
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        isAnalyzing: false, 
        error: err instanceof Error ? err.message : "Failed to analyze image" 
      }));
    }
  };

  const handleGenerate = async (index: number, promptToUse: string) => {
    if (!state.image) return;

    setState(prev => ({ 
      ...prev, 
      loadingImages: { ...prev.loadingImages, [index]: true },
      error: null 
    }));

    try {
      const resultUrl = await generateStyleVisualization(state.image, promptToUse);
      setState(prev => ({ 
        ...prev, 
        generatedImages: { ...prev.generatedImages, [index]: resultUrl },
        loadingImages: { ...prev.loadingImages, [index]: false }
      }));
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        loadingImages: { ...prev.loadingImages, [index]: false },
        error: err instanceof Error ? err.message : "Failed to generate visualization" 
      }));
    }
  };

  const handleCustomGenerate = async () => {
    if (!state.image || !customPrompt) return;
    // Use index -1 for custom prompt
    handleGenerate(-1, customPrompt);
  };

  const reset = () => {
    if (state.previewUrl) URL.revokeObjectURL(state.previewUrl);
    setState({
      image: null,
      previewUrl: null,
      isAnalyzing: false,
      analysis: null,
      generatedImages: {},
      loadingImages: {},
      error: null
    });
    setCustomPrompt('');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-fade-in relative">
      <ImageZoom 
        isOpen={!!zoomImage} 
        src={zoomImage || ''} 
        alt="Zoomed View" 
        onClose={() => setZoomImage(null)} 
      />

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {mode === AppMode.FACE ? 'Face & Hair Stylist' : 'Full Body Fashion'}
          </h2>
          <p className="text-zinc-400">
            {mode === AppMode.FACE 
              ? 'Find the perfect cut and specs for your face shape.' 
              : 'Discover outfits that complement your body type.'}
          </p>
        </div>
        {state.image && (
          <Button variant="outline" onClick={reset}>
            <RefreshCcw className="mr-2 h-4 w-4" /> Start Over
          </Button>
        )}
      </div>

      {!state.image ? (
        <div 
          className="border-2 border-dashed border-zinc-700 rounded-3xl h-96 flex flex-col items-center justify-center bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-indigo-500/50 transition-all cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileSelect} 
          />
          <div className="h-20 w-20 bg-zinc-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Upload className="h-10 w-10 text-zinc-400 group-hover:text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Upload your photo</h3>
          <p className="text-zinc-500">Supports JPG, PNG (Max 5MB)</p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Main Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left: Original Image */}
            <div className="md:col-span-4 space-y-4">
              <div className="relative group rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 aspect-[3/4]">
                <img 
                  src={state.previewUrl!} 
                  alt="Original" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer" onClick={() => setZoomImage(state.previewUrl)}>
                   <ZoomIn className="text-white h-8 w-8 drop-shadow-md" />
                </div>
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10">
                  Original Image
                </div>
              </div>

              {!state.analysis && (
                <Button 
                  className="w-full py-4 text-lg" 
                  onClick={handleAnalyze}
                  isLoading={state.isAnalyzing}
                >
                  <Wand2 className="mr-2 h-5 w-5" />
                  Analyze {mode === AppMode.FACE ? 'Face' : 'Body'}
                </Button>
              )}
               {state.error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm">
                  {state.error}
                </div>
              )}
            </div>

            {/* Right: Analysis & Results */}
            <div className="md:col-span-8">
              {state.analysis ? (
                <div className="space-y-8 animate-slide-up">
                  
                  {/* Analysis Summary */}
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Sparkles className="mr-2 h-5 w-5 text-indigo-400" />
                      AI Analysis
                    </h3>
                    <p className="text-zinc-300 italic mb-4 leading-relaxed">"{state.analysis.reasoning}"</p>
                    <div className="flex flex-wrap gap-2">
                      {state.analysis.features.map((feature, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-sm border border-zinc-700">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Suggestions Grid */}
                  <div>
                    <h4 className="text-lg font-medium text-white mb-4">Recommended Styles for You</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {state.analysis.suggestions.map((suggestion, i) => (
                        <div key={i} className="flex flex-col rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-indigo-500/30 transition-all group">
                          
                          {/* Image Area */}
                          <div className="aspect-[3/4] bg-zinc-950 relative border-b border-zinc-800">
                            {state.generatedImages[i] ? (
                              <div className="w-full h-full relative group/img">
                                <img 
                                  src={state.generatedImages[i]} 
                                  alt={suggestion.name} 
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-all flex items-center justify-center gap-2 opacity-0 group-hover/img:opacity-100">
                                   <button 
                                      className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 backdrop-blur-sm"
                                      onClick={() => setZoomImage(state.generatedImages[i])}
                                   >
                                     <ZoomIn className="h-5 w-5" />
                                   </button>
                                   <button 
                                      className="p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 shadow-lg"
                                      onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = state.generatedImages[i];
                                        link.download = `style-ai-${suggestion.name.replace(/\s+/g, '-').toLowerCase()}.png`;
                                        link.click();
                                      }}
                                   >
                                     <Download className="h-5 w-5" />
                                   </button>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                                {state.loadingImages[i] ? (
                                  <div className="flex flex-col items-center text-indigo-400">
                                    <Loader2 className="h-8 w-8 animate-spin mb-2" />
                                    <span className="text-sm">Applying Style...</span>
                                  </div>
                                ) : (
                                  <>
                                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3 text-zinc-600">
                                      <Camera className="h-6 w-6" />
                                    </div>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleGenerate(i, `${suggestion.name} - ${suggestion.description}`)}
                                    >
                                      Visualize This Look
                                    </Button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Content Area */}
                          <div className="p-4 flex-1 flex flex-col">
                            <h5 className="font-semibold text-white mb-1">{suggestion.name}</h5>
                            <p className="text-sm text-zinc-400 leading-snug mb-3 flex-1">{suggestion.description}</p>
                            {state.generatedImages[i] && (
                               <Button 
                                variant="secondary" 
                                size="sm" 
                                className="w-full mt-auto"
                                onClick={() => handleGenerate(i, `${suggestion.name} - ${suggestion.description}`)}
                                isLoading={state.loadingImages[i]}
                               >
                                 Regenerate
                               </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Custom Prompt */}
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Try Custom Style</h3>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder={mode === AppMode.FACE ? "e.g., Pink mohawk with star glasses" : "e.g., 1920s gangster suit"}
                        className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                      <Button 
                        onClick={handleCustomGenerate}
                        disabled={!customPrompt.trim() || state.loadingImages[-1]}
                      >
                        Generate
                      </Button>
                    </div>

                    {/* Custom Result Area */}
                    {(state.generatedImages[-1] || state.loadingImages[-1]) && (
                      <div className="relative rounded-xl overflow-hidden border border-zinc-700 aspect-[16/9] bg-black">
                         {state.loadingImages[-1] ? (
                            <div className="absolute inset-0 flex items-center justify-center text-indigo-400 bg-zinc-900">
                               <Loader2 className="h-10 w-10 animate-spin" />
                            </div>
                         ) : (
                            <div className="w-full h-full relative group">
                               <img src={state.generatedImages[-1]} className="w-full h-full object-contain" />
                               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer" onClick={() => setZoomImage(state.generatedImages[-1])}>
                                  <ZoomIn className="text-white h-10 w-10" />
                               </div>
                            </div>
                         )}
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                <div className="h-full min-h-[400px] rounded-2xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center p-8 text-center text-zinc-500">
                  <div className="h-16 w-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                    <ArrowRight className="h-6 w-6 text-zinc-700" />
                  </div>
                  <p className="max-w-xs">Upload your photo and click "Analyze" to see your personalized style recommendations.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
