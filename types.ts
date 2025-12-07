export enum AppMode {
  HOME = 'HOME',
  FACE = 'FACE',
  BODY = 'BODY'
}

export interface StyleSuggestion {
  name: string;
  description: string;
}

export interface AnalysisResult {
  features: string[];
  suggestions: StyleSuggestion[];
  reasoning: string;
}

export interface StylistState {
  image: File | null;
  previewUrl: string | null;
  isAnalyzing: boolean;
  analysis: AnalysisResult | null;
  // Map of suggestion index to generated image URL
  generatedImages: Record<number, string>;
  // Map of suggestion index to loading state
  loadingImages: Record<number, boolean>;
  error: string | null;
}
