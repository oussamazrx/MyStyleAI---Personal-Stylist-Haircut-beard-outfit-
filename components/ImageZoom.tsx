import React from 'react';
import { X } from 'lucide-react';

interface ImageZoomProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageZoom: React.FC<ImageZoomProps> = ({ src, alt, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <button 
        className="absolute top-4 right-4 p-2 bg-zinc-800 rounded-full text-white hover:bg-zinc-700 transition-colors"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </button>
      <img 
        src={src} 
        alt={alt} 
        className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
      />
    </div>
  );
};