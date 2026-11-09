import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  BookOpen,
  MessageCircleQuestion,
  ChevronDown,
  ChevronUp,
  Volume2,
  Copy,
  Check,
  Feather,
  Flame,
  Shield,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { DreamEntry, DreamSymbol, DreamArchetype } from '../types';

interface PsychologicalInterpretationProps {
  dream: DreamEntry;
  onAskAboutSymbol: (symbol: string, question?: string) => void;
}

export const PsychologicalInterpretation: React.FC<PsychologicalInterpretationProps> = ({
  dream,
  onAskAboutSymbol,
}) => {
  const [showFullTranscript, setShowFullTranscript] = useState(false);
  const [copiedTranscript, setCopiedTranscript] = useState(false);

  const analysis = dream.analysis;
  if (!analysis) return null;

  const handleCopyTranscript = () => {
    navigator.clipboard.writeText(dream.transcript);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2000);
  };

  // Helper to pick distinct archetype icons or colors
  const getArchetypeBadgeColor = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('shadow')) return 'border-amber-500/40 bg-amber-950/30 text-amber-300';
    if (lower.includes('anima') || lower.includes('animus')) return 'border-fuchsia-500/40 bg-fuchsia-950/30 text-fuchsia-300';
    if (lower.includes('self')) return 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300';
    if (lower.includes('threshold') || lower.includes('guardian')) return 'border-blue-500/40 bg-blue-950/30 text-blue-300';
    if (lower.includes('trickster')) return 'border-rose-500/40 bg-rose-950/30 text-rose-300';
    return 'border-indigo-500/40 bg-indigo-950/30 text-indigo-300';
  };

  return (
    <div className="space-y-8">
      {/* Dream Title & Core Emotional Theme */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0d111e]/90 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-300">
              <Compass className="h-3.5 w-3.5" />
              Jungian Archetypal Interpretation
            </span>
            <span className="text-xs text-slate-400">
              Recorded on {new Date(dream.createdAt).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          <div>
            <h1 className="font-serif-dream text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
              {analysis.title}
            </h1>
            <div className="mt-3 flex items-start gap-2.5 rounded-2xl border border-indigo-500/20 bg-indigo-950/30 p-4">
              <Flame className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Core Subconscious Tension & Emotional Valence
                </h4>
                <p className="mt-1 text-sm leading-relaxed text-slate-200">
                  {analysis.emotionalCore}
                </p>
              </div>
            </div>
          </div>

          {/* Atmosphere tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-medium text-slate-400">Atmosphere:</span>
            {analysis.atmosphere.split(/[,•|]/).map((tag, idx) => {
              const cleanTag = tag.trim();
              if (!cleanTag) return null;
              return (
                <span
                  key={idx}
                  className="rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-xs font-medium text-slate-300"
                >
                  {cleanTag}
                </span>
              );
            })}
          </div>

          {/* Collapsible raw transcript */}
          <div className="mt-2 rounded-2xl border border-slate-800/80 bg-slate-950/50 p-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowFullTranscript(!showFullTranscript)}
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors"
              >
                <Feather className="h-4 w-4 text-indigo-400" />
                <span>Original Waking Transcript</span>
                {showFullTranscript ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>

              <button
                type="button"
                onClick={handleCopyTranscript}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
              >
                {copiedTranscript ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>

            {showFullTranscript && (
              <div className="mt-3 pt-3 border-t border-slate-800/60">
                <p className="text-sm leading-relaxed text-slate-300 italic font-serif">
                  "{dream.transcript}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recognized Archetypes Grid */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-400" />
            <h3 className="font-serif-dream text-lg font-semibold tracking-wide text-slate-100">
              Recognized Jungian Archetypes
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {analysis.archetypes.length} Manifestations Identified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analysis.archetypes.map((archetype: DreamArchetype, idx: number) => {
            const badgeClass = getArchetypeBadgeColor(archetype.name);
            return (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#0d1222]/80 p-5 transition-all hover:border-slate-700 hover:shadow-lg hover:shadow-indigo-950/20"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${badgeClass}`}>
                      {archetype.name}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">#{idx + 1}</span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        In the Dream:
                      </span>
                      <p className="text-xs leading-relaxed text-slate-200 mt-0.5">
                        {archetype.symbolicManifestation}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/60">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                        Psychological Meaning:
                      </span>
                      <p className="text-xs leading-relaxed text-slate-300 mt-0.5">
                        {archetype.psychologicalMeaning}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onAskAboutSymbol(
                      archetype.name,
                      `How does the archetype of "${archetype.name}" in this dream relate to my personal individuation?`
                    )
                  }
                  className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 py-2 text-xs font-medium text-slate-300 hover:border-indigo-500/40 hover:bg-indigo-950/30 hover:text-indigo-200 transition-colors"
                >
                  <MessageCircleQuestion className="h-3.5 w-3.5" />
                  <span>Discuss Archetype with Jung</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subconscious Symbols Explorer */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-400" />
            <h3 className="font-serif-dream text-lg font-semibold tracking-wide text-slate-100">
              Key Subconscious Symbols & Amplification
            </h3>
          </div>
          <span className="text-xs text-slate-400">Click any symbol to explore in Chat</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.symbols.map((symbolItem: DreamSymbol, idx: number) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-[#0e1424] to-[#0a0d18] p-5 hover:border-indigo-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-serif-dream text-base font-semibold text-indigo-100 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    {symbolItem.symbol}
                  </h4>
                </div>

                <p className="text-xs leading-relaxed text-slate-300 mb-3">
                  <strong className="text-indigo-300 font-semibold">Archetypal Resonance: </strong>
                  {symbolItem.archetypalMeaning}
                </p>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-300">
                  <p className="font-semibold text-amber-300 text-[11px] uppercase tracking-wider mb-0.5">
                    Personal Inquiry:
                  </p>
                  <p className="italic text-slate-300">"{symbolItem.personalReflection}"</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() =>
                    onAskAboutSymbol(
                      symbolItem.symbol,
                      `Can you amplify the symbol "${symbolItem.symbol}" that appeared in my dream? What is the unconscious asking me to recognize?`
                    )
                  }
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600/30 border border-indigo-500/40 px-3 py-1.5 text-xs font-medium text-indigo-200 hover:bg-indigo-600/50 hover:text-white transition-colors"
                >
                  <MessageCircleQuestion className="h-3.5 w-3.5" />
                  <span>Ask Jung About This Symbol</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Synthesis & Integration Practice Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jungian Synthesis (2 cols) */}
        <div className="lg:col-span-2 rounded-3xl border border-indigo-500/30 bg-[#0d1222]/90 p-6 sm:p-7 backdrop-blur-md">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-serif-dream text-base font-semibold text-indigo-100">
                The Jungian Synthesis
              </h3>
              <p className="text-[11px] text-slate-400">
                Dialogue between the Unconscious & Waking Ego
              </p>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-slate-200 font-serif whitespace-pre-line">
            {analysis.jungianSynthesis}
          </p>
        </div>

        {/* Waking Integration Ritual / Practice (1 col) */}
        <div className="rounded-3xl border border-amber-500/30 bg-[#14121a]/90 p-6 sm:p-7 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                <Flame className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-serif-dream text-base font-semibold text-amber-100">
                  Waking Integration
                </h3>
                <p className="text-[11px] text-amber-300/70">
                  Active Imagination Practice
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-300">
              {analysis.integrationPractice}
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-amber-500/20">
            <p className="text-[11px] text-slate-400 italic">
              "Until you make the unconscious conscious, it will direct your life and you will call it fate."
              <br />
              <span className="text-amber-400/80 font-serif not-italic mt-1 block">
                — C.G. Jung
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
