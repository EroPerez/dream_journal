import React from 'react';
import { X, Download, Maximize2 } from 'lucide-react';

interface ImageLightboxProps {
  isOpen: boolean;
  imageUrl: string;
  title: string;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  imageUrl,
  title,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-full.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Controls */}
      <div
        className="absolute top-4 right-6 flex items-center gap-3 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-medium text-white hover:bg-white/20 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Save Masterpiece</span>
        </button>
        <button
          onClick={onClose}
          className="rounded-xl border border-white/20 bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div
        className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={title}
          className="max-h-[85vh] max-w-full object-contain rounded-2xl"
        />
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-center">
          <h3 className="font-serif-dream text-base font-semibold text-white tracking-wide">
            {title}
          </h3>
          <p className="text-xs text-slate-300">
            Surrealist Canvas • gemini-3-pro-image-preview
          </p>
        </div>
      </div>
    </div>
  );
};
