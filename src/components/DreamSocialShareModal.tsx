import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Download,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Twitter,
  Instagram,
  Linkedin,
  RefreshCw,
  Send,
  Eye,
} from 'lucide-react';
import { DreamEntry } from '../types';

interface DreamSocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  dream: DreamEntry;
}

type Platform = 'twitter' | 'instagram' | 'whatsapp' | 'linkedin';
type Tone = 'poetic' | 'jungian' | 'mysterious' | 'minimal';

export const DreamSocialShareModal: React.FC<DreamSocialShareModalProps> = ({
  isOpen,
  onClose,
  dream,
}) => {
  const [activePlatform, setActivePlatform] = useState<Platform>('twitter');
  const [activeTone, setActiveTone] = useState<Tone>('poetic');
  const [postContent, setPostContent] = useState<string>('');
  const [isGeneratingCaption, setIsGeneratingCaption] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState<boolean>(false);
  const [cardPreviewUrl, setCardPreviewUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate initial default caption based on dream details
  useEffect(() => {
    if (!dream) return;
    generateDefaultCaption(activePlatform, activeTone);
  }, [dream, activePlatform, activeTone]);

  const generateDefaultCaption = (platform: Platform, tone: Tone) => {
    const title = dream.analysis?.title || 'Waking Dream';
    const emotion = dream.analysis?.emotionalCore || '';
    const archetypes = dream.analysis?.archetypes.map((a) => a.name).join(', ') || '';
    const tags = dream.tags && dream.tags.length > 0 ? dream.tags.join(' ') : '#Oneiric #CarlJung #DreamJournal';

    if (platform === 'twitter') {
      if (tone === 'poetic') {
        setPostContent(
          `🌙 "${title}"\n\nDesperté con esta visión del inconsciente: ${emotion}\n\nArquetipos revelados: ${archetypes}\n\n${tags} #Surrealism #AIArt`
        );
      } else if (tone === 'jungian') {
        setPostContent(
          `Ψ Análisis Junguiano de mi sueño: "${title}"\n\nEl inconsciente colectivo manifestando: ${archetypes}.\n"Hasta que lo inconsciente no se haga consciente, dirigirá tu vida."\n\n${tags}`
        );
      } else {
        setPostContent(
          `Recordé esto al abrir los ojos: "${title}". Pintado por IA surrealista en 4K.\n\n${tags}`
        );
      }
    } else if (platform === 'instagram') {
      setPostContent(
        `✦ ${title} ✦\n\nAl despertar hoy, mi primer acto fue grabar este fragmento onírico antes de que el ego consciente lo disolviera.\n\n🔮 Atmósfera: ${dream.analysis?.atmosphere || 'Surrealista'}\n⚡ Tensión emocional: "${emotion}"\n🏛️ Arquetipos activos: ${archetypes}\n\n«${dream.transcript.slice(0, 180)}...»\n\n¿Alguna vez has tenido un sueño con símbolos similares? Te leo en los comentarios 👇\n\n${tags} #Oneiric #CarlJung #Arquetipos #PsicologiaAnalitica #ArteSurrealista #LucidDreaming #Inconsciente`
      );
    } else if (platform === 'whatsapp') {
      setPostContent(
        `🌌 *Sueño registrado en Oneiric: ${title}*\n\nAcabo de grabar este sueño al despertar:\n_"${dream.transcript.slice(0, 220)}..."_\n\n🔮 *Arquetipos Junguianos:* ${archetypes}\n✨ *Tensión subconsciente:* ${emotion}`
      );
    } else if (platform === 'linkedin') {
      setPostContent(
        `💡 El poder del inconsciente en la resolución creativa de problemas.\n\nHoy registré mi sueño matutino en Oneiric: "${title}".\n\nCarl Jung sostenía que los sueños no son meros ecos del pasado, sino anticipaciones del futuro psicológico y diálogos con nuestra Sombra creativa.\n\nArquetipos identificados: ${archetypes}.\n\n¿Integras la intuición y el análisis onírico en tus procesos de pensamiento creativo? #Creatividad #Psicologia #CarlJung #Innovacion #Oneiric`
      );
    }
  };

  // Call Gemini to generate a creative tailored caption
  const handleGenerateAICaption = async () => {
    setIsGeneratingCaption(true);
    try {
      const res = await fetch('/api/generate-social-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dream,
          platform: activePlatform,
          tone: activeTone,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.postText) {
          setPostContent(data.postText);
        }
      }
    } catch (err) {
      console.warn('AI caption generation failed:', err);
    } finally {
      setIsGeneratingCaption(false);
    }
  };

  // Copy text to clipboard
  const handleCopyText = () => {
    navigator.clipboard.writeText(postContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Native Web Share API
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: dream.analysis?.title || 'Mi sueño en Oneiric',
          text: postContent,
        });
      } catch (err) {
        console.warn('Native share cancelled or failed:', err);
      }
    } else {
      handleCopyText();
    }
  };

  // Direct Social Share Intents
  const handleDirectShare = (platform: Platform) => {
    const encoded = encodeURIComponent(postContent);
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encoded}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          window.location.href
        )}`,
        '_blank'
      );
    } else {
      handleCopyText();
    }
  };

  // Generate Composite Visual Story Card using HTML5 Canvas
  const handleGenerateCompositeCard = () => {
    if (!dream.image?.url) return;
    setIsGeneratingCard(true);

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920; // 9:16 Instagram/TikTok Story format
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = dream.image.url;

    img.onload = () => {
      // 1. Dark cosmic background
      ctx.fillStyle = '#08090d';
      ctx.fillRect(0, 0, 1080, 1920);

      // 2. Draw surrealist painting in center/top
      const imgHeight = 1180;
      ctx.drawImage(img, 0, 120, 1080, imgHeight);

      // 3. Atmospheric dark vignettes and gradient overlay
      const gradient = ctx.createLinearGradient(0, 950, 0, 1920);
      gradient.addColorStop(0, 'rgba(8, 9, 13, 0)');
      gradient.addColorStop(0.35, 'rgba(8, 9, 13, 0.85)');
      gradient.addColorStop(0.65, '#08090d');
      gradient.addColorStop(1, '#08090d');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 900, 1080, 1020);

      // Top subtle gradient
      const topGrad = ctx.createLinearGradient(0, 0, 0, 250);
      topGrad.addColorStop(0, '#08090d');
      topGrad.addColorStop(1, 'rgba(8, 9, 13, 0)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, 1080, 250);

      // 4. Header branding
      ctx.fillStyle = '#a5b4fc';
      ctx.font = 'bold 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '6px';
      ctx.fillText('ONEIRIC • SUB CONSCIOUS JOURNAL', 540, 80);

      // 5. Dream Title (Cinzel/Serif style)
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 54px Georgia, serif';
      ctx.textAlign = 'center';
      const title = dream.analysis?.title || 'Surrealist Dream';
      ctx.fillText(title, 540, 1360);

      // 6. Subconscious Emotional Core quote
      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'italic 34px Georgia, serif';
      const quote = `"${dream.analysis?.emotionalCore || dream.transcript.slice(0, 90)}..."`;
      ctx.fillText(quote, 540, 1435);

      // 7. Archetype badges
      const archetypes = dream.analysis?.archetypes.map((a) => a.name) || ['The Unconscious'];
      const badgesText = archetypes.slice(0, 3).join('   •   ');
      ctx.fillStyle = '#e0e7ff';
      ctx.font = '600 28px sans-serif';
      ctx.fillText(`ARCHETYPES:  ${badgesText}`, 540, 1540);

      // 8. Tags row
      if (dream.tags && dream.tags.length > 0) {
        ctx.fillStyle = '#c084fc';
        ctx.font = '500 26px sans-serif';
        ctx.fillText(dream.tags.join('   '), 540, 1610);
      }

      // 9. Jungian philosophical watermark
      ctx.fillStyle = '#64748b';
      ctx.font = '24px Georgia, serif';
      ctx.fillText('«Who looks outside, dreams; who looks inside, awakes.» — C.G. Jung', 540, 1820);

      // 10. Frame border
      ctx.strokeStyle = 'rgba(165, 180, 252, 0.25)';
      ctx.lineWidth = 14;
      ctx.strokeRect(30, 30, 1020, 1860);

      const dataUrl = canvas.toDataURL('image/png');
      setCardPreviewUrl(dataUrl);

      // Trigger instant download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `oneiric-story-${dream.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsGeneratingCard(false);
    };

    img.onerror = () => {
      setIsGeneratingCard(false);
      alert('Could not load image to generate card.');
    };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-indigo-500/30 bg-[#0d111d] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/60 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950/60">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif-dream text-base font-bold text-slate-100">
                Compartir Sueño en Redes Sociales
              </h3>
              <p className="text-xs text-slate-400">
                Genera posts optimizados, texto con IA y tarjeta visual para Stories
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Platform Selector Tabs */}
          <div className="flex rounded-2xl border border-slate-800 bg-slate-950/70 p-1">
            {[
              { id: 'twitter', label: 'X / Twitter', icon: Twitter },
              { id: 'instagram', label: 'Instagram / Stories', icon: Instagram },
              { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
              { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
            ].map((p) => {
              const Icon = p.icon;
              const isActive = activePlatform === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePlatform(p.id as Platform)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* Dream Artwork Thumbnail Preview */}
          <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-3">
            {dream.image?.url && (
              <img
                src={dream.image.url}
                alt="Thumbnail"
                className="h-20 w-20 rounded-xl object-cover border border-slate-700 shadow-md shrink-0"
              />
            )}
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
                Obra Surrealista Asociada
              </span>
              <h4 className="font-serif-dream text-sm font-bold text-slate-100 truncate">
                {dream.analysis?.title || 'Sueño sin título'}
              </h4>
              <p className="text-xs text-slate-400 line-clamp-1 italic mt-0.5">
                "{dream.analysis?.emotionalCore || dream.transcript}"
              </p>
              {dream.tags && (
                <div className="flex gap-1 mt-1">
                  {dream.tags.map((t) => (
                    <span key={t} className="text-[10px] text-purple-300 font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Story Card Download Button */}
            {dream.image?.url && (
              <button
                onClick={handleGenerateCompositeCard}
                disabled={isGeneratingCard}
                className="shrink-0 flex flex-col items-center justify-center gap-1 rounded-xl border border-purple-500/30 bg-purple-950/50 p-2 text-[11px] font-semibold text-purple-200 hover:bg-purple-900/60 transition-colors"
                title="Descargar tarjeta para Instagram Stories (9:16)"
              >
                <Download className={`h-4 w-4 ${isGeneratingCard ? 'animate-bounce' : ''}`} />
                <span>Story PNG</span>
              </button>
            )}
          </div>

          {/* Tone Selector & AI Prompt Enhancement */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 mr-1">Tono:</span>
              {[
                { id: 'poetic', label: 'Poético' },
                { id: 'jungian', label: 'Junguiano' },
                { id: 'mysterious', label: 'Misterioso' },
                { id: 'minimal', label: 'Corto' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTone(t.id as Tone)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium border transition-colors ${
                    activeTone === t.id
                      ? 'border-indigo-400 bg-indigo-950 text-indigo-200'
                      : 'border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerateAICaption}
              disabled={isGeneratingCaption}
              className="flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-950/40 px-3 py-1 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/50 hover:text-white transition-colors disabled:opacity-50"
            >
              <Sparkles className={`h-3.5 w-3.5 ${isGeneratingCaption ? 'animate-spin' : ''}`} />
              <span>{isGeneratingCaption ? 'Redactando con IA...' : 'Reescribir con IA'}</span>
            </button>
          </div>

          {/* Editable Post Text Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5 text-xs text-slate-400">
              <span>Texto listo para publicar:</span>
              <span className="font-mono">{postContent.length} caracteres</span>
            </div>
            <textarea
              rows={6}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="w-full rounded-2xl border border-slate-800 bg-slate-950/90 p-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors leading-relaxed font-sans"
            />
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-slate-900/80 px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copiar Texto</span>
                </>
              )}
            </button>

            {/* Native Share button */}
            <button
              onClick={handleNativeShare}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
              title="Abrir menú nativo de compartir"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Compartir</span>
            </button>
          </div>

          {/* Direct Platform Action Button */}
          <button
            onClick={() => handleDirectShare(activePlatform)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-950/60 hover:from-indigo-500 hover:to-purple-500 transition-all hover:scale-105"
          >
            {activePlatform === 'twitter' && <Twitter className="h-4 w-4" />}
            {activePlatform === 'whatsapp' && <MessageCircle className="h-4 w-4" />}
            {activePlatform === 'instagram' && <Instagram className="h-4 w-4" />}
            {activePlatform === 'linkedin' && <Linkedin className="h-4 w-4" />}
            <span>
              {activePlatform === 'twitter'
                ? 'Publicar en X (Twitter)'
                : activePlatform === 'whatsapp'
                ? 'Enviar a WhatsApp'
                : activePlatform === 'instagram'
                ? 'Copiar & Descargar Story'
                : 'Compartir en LinkedIn'}
            </span>
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
