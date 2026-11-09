import React, { useState, useEffect } from 'react';
import {
  Mic,
  Sparkles,
  BookMarked,
  Layers,
  Compass,
  Menu,
  RotateCw,
  Plus,
  AlertCircle,
  Volume2,
  ShieldCheck,
  Share2,
  Calendar as CalendarIcon,
} from 'lucide-react';

import { DreamEntry, ChatMessage } from './types';
import { SAMPLE_DREAMS } from './sampleDreams';
import { VoiceRecorderModal } from './components/VoiceRecorderModal';
import { SurrealistArtViewer } from './components/SurrealistArtViewer';
import { PsychologicalInterpretation } from './components/PsychologicalInterpretation';
import { JungianChatInterface } from './components/JungianChatInterface';
import { JournalSidebar } from './components/JournalSidebar';
import { ImageLightbox } from './components/ImageLightbox';
import { DreamCalendarView } from './components/DreamCalendarView';

const STORAGE_KEY = 'oneiric_subconscious_dreams_v1';

export default function App() {
  const [dreams, setDreams] = useState<DreamEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved dreams:', e);
    }
    return SAMPLE_DREAMS;
  });

  const [selectedDreamId, setSelectedDreamId] = useState<string>(() => {
    return dreams[0]?.id || '';
  });

  const [isRecorderOpen, setIsRecorderOpen] = useState(false);
  const [isProcessingDream, setIsProcessingDream] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSymbolQuery, setActiveSymbolQuery] = useState<string>('');
  const [currentView, setCurrentView] = useState<'canvas' | 'calendar'>('canvas');
  const [lightboxData, setLightboxData] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: '',
    title: '',
  });
  const [appError, setAppError] = useState<string | null>(null);

  // Sync dreams to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dreams));
    } catch (e) {
      console.warn('Failed to persist dreams to localStorage:', e);
    }
  }, [dreams]);

  const activeDream = dreams.find((d) => d.id === selectedDreamId) || dreams[0] || null;

  // Handler: Full Dream Processing Pipeline
  const handleProcessDream = async (
    manualText: string,
    audioBlob: Blob | null,
    imageSize: '1K' | '2K' | '4K',
    aspectRatio: string
  ) => {
    setIsProcessingDream(true);
    setAppError(null);

    let dreamTranscript = manualText;

    try {
      // Step 1: Transcribe Audio if provided
      if (audioBlob) {
        setProcessingStep('Transcribing waking speech (gemini-3.5-transcribe)...');
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onloadend = () => {
            const result = reader.result as string;
            resolve(result);
          };
          reader.onerror = reject;
        });
        reader.readAsDataURL(audioBlob);
        const base64Audio = await base64Promise;

        const transcribeRes = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioData: base64Audio,
            mimeType: audioBlob.type || 'audio/webm',
          }),
        });

        if (!transcribeRes.ok) {
          const errData = await transcribeRes.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to transcribe audio recording.');
        }

        const transcribeData = await transcribeRes.json();
        dreamTranscript = transcribeData.transcript || manualText;
      }

      if (!dreamTranscript.trim()) {
        throw new Error('No dream narrative could be extracted.');
      }

      // Step 2: Psychological Archetypal Analysis (gemini-3.8-flash)
      setProcessingStep('Synthesizing Jungian archetypes & symbols (gemini-3.8-flash)...');
      const analyzeRes = await fetch('/api/analyze-dream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dreamText: dreamTranscript }),
      });

      if (!analyzeRes.ok) {
        const errData = await analyzeRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to analyze dream archetypes.');
      }

      const { analysis } = await analyzeRes.json();

      // Step 3: Surrealist Art Generation (gemini-3-pro-image-preview)
      setProcessingStep(`Painting surrealist dream canvas at ${imageSize} (gemini-3-pro-image-preview)...`);
      let generatedImage = undefined;

      try {
        const imageRes = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: analysis.surrealistArtPrompt || dreamTranscript,
            imageSize,
            aspectRatio,
          }),
        });

        if (imageRes.ok) {
          const imgData = await imageRes.json();
          generatedImage = {
            url: imgData.imageUrl,
            size: imageSize,
            aspectRatio,
            prompt: analysis.surrealistArtPrompt,
          };
        } else {
          console.warn('Image generation endpoint returned non-200; falling back to dream placeholder.');
        }
      } catch (imgErr) {
        console.warn('Image generation failed gracefully:', imgErr);
      }

      // Fallback placeholder image if image generation failed or was empty
      if (!generatedImage) {
        generatedImage = {
          url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
          size: imageSize,
          aspectRatio,
          prompt: analysis.surrealistArtPrompt,
        };
      }

      // Step 4: Construct new dream entry
      const initialAssistantMessage: ChatMessage = {
        id: `msg-init-${Date.now()}`,
        role: 'assistant',
        content: `I have received your dream, "${analysis.title}". It resonates strongly with the archetype of ${
          analysis.archetypes[0]?.name || 'the Collective Unconscious'
        }. When you examine the emotional core of "${analysis.emotionalCore}", what immediate thoughts or memories surface?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const newDream: DreamEntry = {
        id: `dream-${Date.now()}`,
        createdAt: new Date().toISOString(),
        transcript: dreamTranscript,
        hasAudio: !!audioBlob,
        image: generatedImage,
        analysis,
        chatMessages: [initialAssistantMessage],
        status: 'ready',
      };

      setDreams((prev) => [newDream, ...prev]);
      setSelectedDreamId(newDream.id);
      setIsRecorderOpen(false);
    } catch (err: any) {
      console.error('Dream processing failed:', err);
      setAppError(err?.message || 'An error occurred while processing your dream.');
    } finally {
      setIsProcessingDream(false);
      setProcessingStep('');
    }
  };

  // Handler: Regenerate Surrealist Artwork in 1K, 2K, or 4K
  const handleRegenerateImage = async (size: '1K' | '2K' | '4K', aspectRatio: string) => {
    if (!activeDream || !activeDream.analysis) return;
    setIsGeneratingImage(true);
    setAppError(null);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: activeDream.analysis.surrealistArtPrompt || activeDream.transcript,
          imageSize: size,
          aspectRatio,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to render surrealist image.');
      }

      const data = await res.json();
      const updatedImage = {
        url: data.imageUrl,
        size,
        aspectRatio,
        prompt: activeDream.analysis.surrealistArtPrompt,
      };

      setDreams((prev) =>
        prev.map((d) => (d.id === activeDream.id ? { ...d, image: updatedImage } : d))
      );
    } catch (err: any) {
      console.error('Image regeneration error:', err);
      setAppError(err?.message || 'Failed to regenerate image at specified size.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Handler: Send Chat message to Dr. Carl Jung
  const handleSendMessage = async (text: string) => {
    if (!activeDream || !text.trim() || isSendingChat) return;

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...activeDream.chatMessages, userMessage];

    // Optimistically update message list
    setDreams((prev) =>
      prev.map((d) => (d.id === activeDream.id ? { ...d, chatMessages: updatedMessages } : d))
    );
    setIsSendingChat(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          dreamContext: {
            title: activeDream.analysis?.title,
            transcript: activeDream.transcript,
            emotionalCore: activeDream.analysis?.emotionalCore,
            archetypes: activeDream.analysis?.archetypes,
            symbols: activeDream.analysis?.symbols,
            synthesis: activeDream.analysis?.jungianSynthesis,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to receive analysis response.');
      }

      const data = await res.json();
      const assistantMessage: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'The unconscious remains shrouded in mystery.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setDreams((prev) =>
        prev.map((d) =>
          d.id === activeDream.id
            ? { ...d, chatMessages: [...updatedMessages, assistantMessage] }
            : d
        )
      );
    } catch (err: any) {
      console.error('Chat send error:', err);
      const errorMessage: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content: `I apologize; a distortion occurred while amplifying this symbol: ${err?.message || 'Please try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setDreams((prev) =>
        prev.map((d) =>
          d.id === activeDream.id
            ? { ...d, chatMessages: [...updatedMessages, errorMessage] }
            : d
        )
      );
    } finally {
      setIsSendingChat(false);
      setActiveSymbolQuery('');
    }
  };

  // Handler: When clicking "Ask Jung About This Symbol" in the interpretation card
  const handleAskAboutSymbol = (symbolName: string, promptText?: string) => {
    const question =
      promptText ||
      `Dr. Jung, what does the symbol "${symbolName}" mean in my subconscious dream?`;
    handleSendMessage(question);

    // Smoothly scroll down to the chat interface
    const chatElement = document.getElementById('jungian-chat-section');
    if (chatElement) {
      chatElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handler: Delete dream
  const handleDeleteDream = (id: string) => {
    setDreams((prev) => {
      const remaining = prev.filter((d) => d.id !== id);
      if (selectedDreamId === id && remaining.length > 0) {
        setSelectedDreamId(remaining[0].id);
      }
      return remaining;
    });
  };

  // Handler: Export journal archive
  const handleExportJournal = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dreams, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `oneiric-dream-journal-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Handler: Reset/Load sample dreams
  const handleLoadSamples = () => {
    setDreams(SAMPLE_DREAMS);
    setSelectedDreamId(SAMPLE_DREAMS[0].id);
  };

  // Summary counts
  const totalArchetypes = dreams.reduce(
    (acc, d) => acc + (d.analysis?.archetypes.length || 0),
    0
  );
  const totalSymbols = dreams.reduce(
    (acc, d) => acc + (d.analysis?.symbols.length || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#07080d] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#090c16]/80 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white transition-colors"
              title="Open Dream Archives"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-950/60 font-serif-dream font-bold text-lg">
                Ψ
              </div>
              <div>
                <h1 className="font-serif-dream text-base font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-indigo-200 to-purple-200">
                  ONEIRIC
                </h1>
                <p className="text-[10px] tracking-widest uppercase font-semibold text-indigo-400/80 hidden sm:block">
                  Subconscious Dream Journal & Archetypal Analyst
                </p>
              </div>
            </div>

            {/* View Switcher Tabs */}
            <div className="hidden lg:flex items-center ml-4 rounded-xl border border-slate-800 bg-slate-900/60 p-1">
              <button
                onClick={() => setCurrentView('canvas')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  currentView === 'canvas'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Studio Canvas</span>
              </button>
              <button
                onClick={() => setCurrentView('calendar')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  currentView === 'calendar'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CalendarIcon className="h-3.5 w-3.5" />
                <span>Monthly Calendar</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-3">
            {/* Mobile View Switcher */}
            <div className="flex lg:hidden rounded-lg border border-slate-800 bg-slate-900/60 p-1">
              <button
                onClick={() => setCurrentView('canvas')}
                className={`p-1.5 rounded-md text-xs ${
                  currentView === 'canvas' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
                title="Studio Canvas"
              >
                <Sparkles className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentView('calendar')}
                className={`p-1.5 rounded-md text-xs ${
                  currentView === 'calendar' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
                title="Monthly Calendar"
              >
                <CalendarIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-400 border-r border-slate-800/80 pr-4">
              <button
                onClick={() => setCurrentView('calendar')}
                className="flex items-center gap-1.5 hover:text-indigo-300 transition-colors"
                title="View Calendar Grid"
              >
                <CalendarIcon className="h-3.5 w-3.5 text-indigo-400" />
                <strong className="text-slate-200">{dreams.length}</strong> Dreams
              </button>
              <span className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-purple-400" />
                <strong className="text-slate-200">{totalArchetypes}</strong> Archetypes
              </span>
            </div>

            <button
              onClick={() => setIsRecorderOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-950/60 hover:from-indigo-500 hover:to-purple-500 transition-all hover:scale-105 active:scale-95"
            >
              <Mic className="h-4 w-4" />
              <span className="hidden sm:inline">Record Waking Dream</span>
              <span className="sm:hidden">Record</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Sidebar */}
        <JournalSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          dreams={dreams}
          selectedDreamId={selectedDreamId}
          onSelectDream={(id) => {
            setSelectedDreamId(id);
            setCurrentView('canvas');
          }}
          onNewDreamClick={() => setIsRecorderOpen(true)}
          onDeleteDream={handleDeleteDream}
          onExportJournal={handleExportJournal}
          onLoadSamples={handleLoadSamples}
          onOpenCalendar={() => setCurrentView('calendar')}
          activeView={currentView}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 dream-radial-bg">
          <div className="max-w-5xl mx-auto space-y-10">
            {/* App Alert Banner if any error */}
            {appError && (
              <div className="flex items-center justify-between rounded-2xl border border-red-500/30 bg-red-950/40 p-4 text-xs text-red-200">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                  <span>{appError}</span>
                </div>
                <button
                  onClick={() => setAppError(null)}
                  className="rounded-lg p-1 text-red-400 hover:bg-red-900/40"
                >
                  ✕
                </button>
              </div>
            )}

            {currentView === 'calendar' ? (
              <DreamCalendarView
                dreams={dreams}
                selectedDreamId={selectedDreamId}
                onSelectDream={(id) => {
                  setSelectedDreamId(id);
                }}
                onRecordDream={() => setIsRecorderOpen(true)}
                onOpenCanvasView={() => setCurrentView('canvas')}
                onLoadSamples={handleLoadSamples}
              />
            ) : activeDream ? (
              <>
                {/* 1. Surrealist Vision Image Display (gemini-3-pro-image-preview with 1K, 2K, 4K affordance) */}
                <section>
                  <SurrealistArtViewer
                    dream={activeDream}
                    onRegenerateImage={handleRegenerateImage}
                    isGenerating={isGeneratingImage}
                    onOpenLightbox={(url, title) =>
                      setLightboxData({ isOpen: true, url, title })
                    }
                  />
                </section>

                {/* 2. Structured Psychological Interpretation (Recognized Jungian Archetypes & Symbols) */}
                <section>
                  <PsychologicalInterpretation
                    dream={activeDream}
                    onAskAboutSymbol={handleAskAboutSymbol}
                  />
                </section>

                {/* 3. Multi-turn Archetypal Dream Analyst Chat (gemini-3.8-flash) */}
                <section id="jungian-chat-section">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Compass className="h-5 w-5 text-indigo-400" />
                      <h2 className="font-serif-dream text-lg font-semibold tracking-wide text-slate-100">
                        Inquire with Dr. Carl Jung
                      </h2>
                    </div>
                    <span className="text-xs text-slate-400">
                      Multi-Turn Subconscious Symbol Exploration
                    </span>
                  </div>

                  <JungianChatInterface
                    dream={activeDream}
                    onSendMessage={handleSendMessage}
                    isSending={isSendingChat}
                    activeSymbolQuery={activeSymbolQuery}
                  />
                </section>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
                  <Mic className="h-8 w-8" />
                </div>
                <h3 className="font-serif-dream text-lg font-semibold text-slate-200">
                  Your Subconscious Journal is Quiet
                </h3>
                <p className="mt-2 max-w-md text-xs text-slate-400">
                  Record your fresh waking dream immediately to transcribe memory, generate surrealist imagery, and uncover deep Jungian archetypes.
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => setIsRecorderOpen(true)}
                    className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-950/60 hover:bg-indigo-500 transition-colors"
                  >
                    <Mic className="h-4 w-4" />
                    <span>Record Dream Now</span>
                  </button>
                  <button
                    onClick={handleLoadSamples}
                    className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    Load Sample Dreams
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Voice Recorder Modal */}
      <VoiceRecorderModal
        isOpen={isRecorderOpen}
        onClose={() => setIsRecorderOpen(false)}
        onSubmitDream={handleProcessDream}
        isProcessing={isProcessingDream}
        processingStep={processingStep}
      />

      {/* High-Resolution Artwork Lightbox */}
      <ImageLightbox
        isOpen={lightboxData.isOpen}
        imageUrl={lightboxData.url}
        title={lightboxData.title}
        onClose={() => setLightboxData({ isOpen: false, url: '', title: '' })}
      />
    </div>
  );
}
