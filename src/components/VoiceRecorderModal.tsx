import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  X,
  FileText,
  Sliders,
  AlertCircle,
  HelpCircle,
  Tag,
  Hash,
} from 'lucide-react';

interface VoiceRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitDream: (
    dreamText: string,
    audioBlob: Blob | null,
    imageSize: '1K' | '2K' | '4K',
    aspectRatio: string,
    initialTags: string[]
  ) => Promise<void>;
  isProcessing: boolean;
  processingStep: string;
}

export const VoiceRecorderModal: React.FC<VoiceRecorderModalProps> = ({
  isOpen,
  onClose,
  onSubmitDream,
  isProcessing,
  processingStep,
}) => {
  const [activeTab, setActiveTab] = useState<'voice' | 'text'>('voice');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [manualText, setManualText] = useState('');
  const [selectedSize, setSelectedSize] = useState<'1K' | '2K' | '4K'>('2K');
  const [selectedAspect, setSelectedAspect] = useState<string>('1:1');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      stopTracks();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, []);

  const stopTracks = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
    }
  };

  const startRecording = async () => {
    setMicError(null);
    audioChunksRef.current = [];
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecordingDuration(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Set up AudioContext for real-time visualizer level
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyserRef.current = analyser;

        const updateLevel = () => {
          if (!analyserRef.current) return;
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
          setAudioLevel(Math.min(100, Math.round((average / 128) * 100)));
          animFrameRef.current = requestAnimationFrame(updateLevel);
        };
        updateLevel();
      } catch (err) {
        console.warn('AudioContext visualization setup failed:', err);
      }

      // Determine supported mimeType
      const mimeTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
      let selectedMime = '';
      for (const m of mimeTypes) {
        if (MediaRecorder.isTypeSupported(m)) {
          selectedMime = m;
          break;
        }
      }

      const recorder = new MediaRecorder(stream, selectedMime ? { mimeType: selectedMime } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, {
          type: selectedMime || 'audio/webm',
        });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setIsRecording(false);
        setIsPaused(false);
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        setAudioLevel(0);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start(250); // Record in 250ms chunks
      setIsRecording(true);
      setIsPaused(false);

      timerIntervalRef.current = window.setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access failed:', err);
      setMicError(
        'Unable to access microphone. Please check browser permissions, or switch to the "Write Memory" tab to transcribe by text.'
      );
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
  };

  const pauseResumeRecording = () => {
    if (!mediaRecorderRef.current) return;
    if (isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    } else {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const togglePreviewAudio = () => {
    if (!previewAudioRef.current) return;
    if (isPlayingAudio) {
      previewAudioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      previewAudioRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (activeTab === 'voice' && !audioBlob) {
      return;
    }
    if (activeTab === 'text' && !manualText.trim()) {
      return;
    }

    await onSubmitDream(manualText, audioBlob, selectedSize, selectedAspect, selectedTags);
  };

  const loadPromptSnippet = (text: string) => {
    setManualText((prev) => (prev ? `${prev}\n\n${text}` : text));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-indigo-500/30 bg-[#0d111c] shadow-2xl shadow-indigo-950/50">
        {/* Glow decoration */}
        <div className="absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif-dream text-lg font-semibold tracking-wide text-indigo-100">
                Record Waking Dream
              </h2>
              <p className="text-xs text-slate-400">
                Capture fragmented memories before the waking ego dissolves them
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800/80 bg-slate-900/50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'voice'
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mic className="h-4 w-4" />
            Voice Recording
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'text'
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="h-4 w-4" />
            Write / Edit Memory
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'voice' ? (
            <div className="flex flex-col items-center justify-center py-4">
              {micError ? (
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-200">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                  <span>{micError}</span>
                </div>
              ) : null}

              {/* Central Mic Visualizer */}
              <div className="relative flex items-center justify-center my-6">
                {isRecording && (
                  <div
                    className="absolute rounded-full bg-indigo-500/20 blur-xl transition-all duration-150"
                    style={{
                      width: `${120 + audioLevel * 1.4}px`,
                      height: `${120 + audioLevel * 1.4}px`,
                    }}
                  />
                )}

                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing}
                  className={`relative flex h-28 w-28 items-center justify-center rounded-full transition-all duration-300 shadow-xl ${
                    isRecording
                      ? 'bg-rose-600 text-white shadow-rose-900/60 ring-4 ring-rose-500/40 animate-pulse'
                      : audioBlob
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-950/60'
                      : 'bg-gradient-to-tr from-indigo-700 via-indigo-600 to-purple-600 text-white hover:scale-105 shadow-indigo-900/50'
                  }`}
                >
                  {isRecording ? (
                    <Square className="h-10 w-10 fill-current" />
                  ) : (
                    <Mic className="h-10 w-10" />
                  )}
                </button>
              </div>

              {/* Status and Timer */}
              <div className="text-center">
                {isRecording ? (
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-3 py-1 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-wider">
                      <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                      Recording Sleep Memory
                    </div>
                    <p className="font-mono text-2xl font-semibold text-slate-100">
                      {formatSeconds(recordingDuration)}
                    </p>
                    <p className="text-xs text-slate-400 max-w-xs">
                      Speak freely about what you felt, the surreal places, odd creatures, or sudden shifts.
                    </p>
                  </div>
                ) : audioBlob ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-emerald-400 flex items-center justify-center gap-1.5">
                      <Volume2 className="h-4 w-4" />
                      Voice Memory Captured ({formatSeconds(recordingDuration)})
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={togglePreviewAudio}
                        className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
                      >
                        {isPlayingAudio ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                        {isPlayingAudio ? 'Pause' : 'Listen Preview'}
                      </button>
                      <button
                        type="button"
                        onClick={startRecording}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Re-record
                      </button>
                    </div>
                    {audioUrl && (
                      <audio
                        ref={previewAudioRef}
                        src={audioUrl}
                        onEnded={() => setIsPlayingAudio(false)}
                        className="hidden"
                      />
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="font-serif-dream text-sm font-medium text-slate-200">
                      Tap the microphone to speak
                    </p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm">
                      Describe your dream as if it just happened. The AI will transcribe your words with gemini-3.5-transcribe, analyze Jungian archetypes, and paint the scene.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Describe your dream in your own words:
                </label>
                <textarea
                  rows={5}
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder="I woke up inside a towering cathedral whose stained-glass windows were alive and swimming with golden koi fish..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
                />
              </div>

              {/* Fast prompt starters */}
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Spark your memory:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'The landscape looked like...',
                    'I met a strange figure who...',
                    'An object was glowing and...',
                    'I suddenly realized I was...',
                  ].map((starter) => (
                    <button
                      key={starter}
                      type="button"
                      onClick={() => loadPromptSnippet(starter)}
                      className="rounded-md border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-xs text-slate-300 hover:border-indigo-500/50 hover:bg-indigo-950/30 transition-all"
                    >
                      + {starter}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Dream Category Tags Picker */}
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-purple-400" />
                Categorize Dream (Emotions & States)
              </label>
              <span className="text-[11px] text-slate-400">Tap to toggle tags</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {[
                '#lucid',
                '#nightmare',
                '#recurring',
                '#flying',
                '#water',
                '#shadow-work',
                '#healing',
                '#prophetic',
                '#numinous',
              ].map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      setSelectedTags((prev) =>
                        isSelected ? prev.filter((t) => t !== tag) : [...prev, tag]
                      )
                    }
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'border-purple-400 bg-purple-950 text-purple-200 shadow-sm'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Surrealist Image Generation Affordances (1K, 2K, 4K) */}
          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5" />
                Surrealist Art Render Resolution (gemini-3-pro-image-preview)
              </label>
              <span className="text-[11px] text-slate-400">Specifies model canvas scale</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['1K', '2K', '4K'] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`flex flex-col items-center justify-center rounded-xl p-2.5 border transition-all text-left ${
                    selectedSize === size
                      ? 'border-indigo-400 bg-indigo-950/60 text-indigo-100 shadow-sm shadow-indigo-900/40'
                      : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="font-serif-dream text-sm font-bold">{size}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {size === '1K'
                      ? 'Standard 1024px'
                      : size === '2K'
                      ? 'High-Def 2048px'
                      : 'Masterpiece 4096px'}
                  </span>
                </button>
              ))}
            </div>

            {/* Aspect Ratio */}
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-400">Aspect Ratio:</span>
              <div className="flex gap-1.5">
                {[
                  { id: '1:1', label: '1:1 Square' },
                  { id: '16:9', label: '16:9 Wide' },
                  { id: '4:3', label: '4:3 Classic' },
                ].map((aspect) => (
                  <button
                    key={aspect.id}
                    type="button"
                    onClick={() => setSelectedAspect(aspect.id)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium border transition-colors ${
                      selectedAspect === aspect.id
                        ? 'border-indigo-400 bg-indigo-500/20 text-indigo-200'
                        : 'border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {aspect.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-800/80 bg-slate-900/60 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="rounded-xl px-4 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              isProcessing ||
              (activeTab === 'voice' && !audioBlob) ||
              (activeTab === 'text' && !manualText.trim())
            }
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-950/60 hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>{processingStep || 'Processing Subconscious...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Transcribe & Unveil Archetypes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
