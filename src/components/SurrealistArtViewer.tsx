import React, { useState } from 'react';
import {
  Maximize2,
  Download,
  RotateCw,
  Sparkles,
  Palette,
  Info,
  Check,
  Eye,
  Share2,
} from 'lucide-react';
import { DreamEntry } from '../types';

interface SurrealistArtViewerProps {
  dream: DreamEntry;
  onRegenerateImage: (size: '1K' | '2K' | '4K', aspectRatio: string) => Promise<void>;
  isGenerating: boolean;
  onOpenLightbox: (imageUrl: string, title: string) => void;
  onOpenShare?: () => void;
}

export const SurrealistArtViewer: React.FC<SurrealistArtViewerProps> = ({
  dream,
  onRegenerateImage,
  isGenerating,
  onOpenLightbox,
  onOpenShare,
}) => {
  const [showPromptInfo, setShowPromptInfo] = useState(false);
  const [selectedSize, setSelectedSize] = useState<'1K' | '2K' | '4K'>(
    dream.image?.size || '2K'
  );
  const [selectedAspect, setSelectedAspect] = useState<string>(
    dream.image?.aspectRatio || '1:1'
  );
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleDownload = () => {
    if (!dream.image?.url) return;
    const link = document.createElement('a');
    link.href = dream.image.url;
    link.download = `oneiric-dream-${dream.id}-${selectedSize}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyPromptText = () => {
    if (!dream.image?.prompt) return;
    navigator.clipboard.writeText(dream.image.prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-[#0d111d] shadow-2xl transition-all">
      {/* Top Bar with metadata and size indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-900/40 px-6 py-3.5 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
            <Palette className="h-4 w-4" />
          </div>
          <div>
            <span className="font-serif-dream text-xs font-semibold uppercase tracking-wider text-indigo-200">
              Subconscious Surrealist Vision
            </span>
            <span className="ml-2 text-[11px] text-slate-400">
              Model: gemini-3-pro-image-preview
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Active resolution badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/50 px-3 py-1 text-xs font-medium text-indigo-300">
            <Sparkles className="h-3 w-3 text-indigo-400" />
            {dream.image?.size || selectedSize} Resolution
          </span>

          {/* Share to social button */}
          {onOpenShare && (
            <button
              onClick={onOpenShare}
              className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-950/60 px-2.5 py-1 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/60 hover:text-white transition-colors"
              title="Compartir en Redes Sociales"
            >
              <Share2 className="h-3.5 w-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Compartir</span>
            </button>
          )}

          {/* Lightbox button */}
          {dream.image?.url && (
            <button
              onClick={() => onOpenLightbox(dream.image!.url, dream.analysis?.title || 'Surrealist Dream')}
              className="rounded-lg border border-slate-800 bg-slate-900/60 p-1.5 text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-colors"
              title="Expand full screen"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          )}

          {/* Download button */}
          {dream.image?.url && (
            <button
              onClick={handleDownload}
              className="rounded-lg border border-slate-800 bg-slate-900/60 p-1.5 text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-colors"
              title="Download image"
            >
              <Download className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Image Display */}
      <div className="relative aspect-square sm:aspect-[16/10] max-h-[580px] w-full overflow-hidden bg-slate-950 flex items-center justify-center">
        {dream.image?.url ? (
          <>
            <img
              src={dream.image.url}
              alt={dream.analysis?.title || 'Surrealist Dream Painting'}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
            />

            {/* Subtle atmospheric vignette */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08090d] via-transparent to-black/20" />

            {/* Quick overlay buttons */}
            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between opacity-95 transition-opacity">
              <div className="max-w-xl rounded-xl bg-black/60 px-4 py-2.5 backdrop-blur-md border border-white/10">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300">
                  {dream.analysis?.atmosphere || 'Surrealist Dreamscape'}
                </p>
                <p className="text-xs text-slate-200 line-clamp-1 mt-0.5">
                  {dream.analysis?.emotionalCore || 'Subconscious manifestation'}
                </p>
              </div>

              <button
                onClick={() => setShowPromptInfo(!showPromptInfo)}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs font-medium text-slate-200 backdrop-blur-md hover:bg-black/80 transition-colors"
              >
                <Info className="h-3.5 w-3.5 text-indigo-400" />
                <span>Prompt & Style</span>
              </button>
            </div>
          </>
        ) : isGenerating ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="relative mb-6">
              <div className="h-20 w-20 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <Palette className="absolute inset-0 m-auto h-8 w-8 text-indigo-400 animate-pulse" />
            </div>
            <h3 className="font-serif-dream text-base font-semibold text-slate-200">
              Conjuring Surrealist Canvas in {selectedSize}...
            </h3>
            <p className="mt-1.5 max-w-sm text-xs text-slate-400">
              Translating dream symbols through Magritte, Dalí, and De Chirico aesthetics via gemini-3-pro-image-preview.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Palette className="mb-4 h-12 w-12 text-slate-600" />
            <h3 className="font-serif-dream text-base font-medium text-slate-300">
              No Surrealist Vision Generated Yet
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm">
              Click below to generate an evocative painting of this dream's emotional core.
            </p>
          </div>
        )}

        {/* Loading Overlay when regenerating */}
        {isGenerating && dream.image?.url && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="h-14 w-14 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin mb-3" />
            <span className="font-serif-dream text-sm font-medium text-indigo-200">
              Re-rendering at {selectedSize} resolution...
            </span>
          </div>
        )}
      </div>

      {/* Prompt and Influences Drawer */}
      {showPromptInfo && (
        <div className="border-t border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
              Surrealist Synthesized Prompt
            </span>
            <button
              onClick={copyPromptText}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
            >
              {copiedPrompt ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3" />
                  <span>Copy Prompt</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs leading-relaxed text-slate-300 bg-black/40 p-3 rounded-xl border border-white/5 font-mono">
            {dream.image?.prompt || dream.analysis?.surrealistArtPrompt || 'Surrealist dream visualization'}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-400">
            <span className="rounded-md bg-indigo-950/60 px-2 py-0.5 border border-indigo-500/20 text-indigo-300">
              Subconscious Surrealism
            </span>
            <span className="rounded-md bg-slate-800/80 px-2 py-0.5 text-slate-300">
              René Magritte
            </span>
            <span className="rounded-md bg-slate-800/80 px-2 py-0.5 text-slate-300">
              Salvador Dalí
            </span>
            <span className="rounded-md bg-slate-800/80 px-2 py-0.5 text-slate-300">
              Giorgio de Chirico
            </span>
          </div>
        </div>
      )}

      {/* Affordance: Re-render controls for 1K, 2K, 4K */}
      <div className="border-t border-slate-800/80 bg-slate-950/60 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-300">Re-render Quality:</span>
            <div className="flex rounded-xl bg-slate-900/80 p-1 border border-slate-800">
              {(['1K', '2K', '4K'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    selectedSize === size
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            <div className="flex rounded-xl bg-slate-900/80 p-1 border border-slate-800 ml-1">
              {[
                { id: '1:1', label: '1:1' },
                { id: '16:9', label: '16:9' },
                { id: '4:3', label: '4:3' },
              ].map((aspect) => (
                <button
                  key={aspect.id}
                  onClick={() => setSelectedAspect(aspect.id)}
                  className={`rounded-lg px-2 py-1 text-xs font-medium transition-all ${
                    selectedAspect === aspect.id
                      ? 'bg-indigo-500/30 text-indigo-200'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {aspect.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => onRegenerateImage(selectedSize, selectedAspect)}
            disabled={isGenerating}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-2 text-xs font-medium text-indigo-200 hover:bg-indigo-900/50 hover:text-white transition-all disabled:opacity-50"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Generate New Vision ({selectedSize})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
