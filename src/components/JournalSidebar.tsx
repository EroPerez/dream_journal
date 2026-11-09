import React, { useState } from 'react';
import {
  BookMarked,
  Plus,
  Search,
  Calendar,
  Sparkles,
  Download,
  Trash2,
  X,
  Compass,
  Filter,
  Tag,
  Hash,
} from 'lucide-react';
import { DreamEntry } from '../types';

interface JournalSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  dreams: DreamEntry[];
  selectedDreamId: string | null;
  onSelectDream: (id: string) => void;
  onNewDreamClick: () => void;
  onDeleteDream: (id: string) => void;
  onExportJournal: () => void;
  onLoadSamples: () => void;
  onOpenCalendar: () => void;
  activeView: 'canvas' | 'calendar';
}

export const JournalSidebar: React.FC<JournalSidebarProps> = ({
  isOpen,
  onClose,
  dreams,
  selectedDreamId,
  onSelectDream,
  onNewDreamClick,
  onDeleteDream,
  onExportJournal,
  onLoadSamples,
  onOpenCalendar,
  activeView,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArchetypeFilter, setSelectedArchetypeFilter] = useState<string>('ALL');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('ALL');
  const [filterMode, setFilterMode] = useState<'archetypes' | 'tags'>('tags');

  // Extract all unique archetype names across dreams
  const allArchetypes = Array.from(
    new Set(
      dreams.flatMap((d) => d.analysis?.archetypes.map((a) => a.name) || [])
    )
  );

  // Extract all unique tags and their frequency counts
  const tagCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const d of dreams) {
      for (const t of d.tags || []) {
        counts[t] = (counts[t] || 0) + 1;
      }
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [dreams]);

  const filteredDreams = dreams.filter((dream) => {
    const matchesSearch =
      searchQuery === '' ||
      dream.analysis?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dream.transcript.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dream.analysis?.emotionalCore.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dream.analysis?.symbols.some((s) => s.symbol.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (dream.tags && dream.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesArchetype =
      selectedArchetypeFilter === 'ALL' ||
      dream.analysis?.archetypes.some((a) => a.name === selectedArchetypeFilter);

    const matchesTag =
      selectedTagFilter === 'ALL' ||
      (dream.tags && dream.tags.includes(selectedTagFilter));

    return matchesSearch && matchesArchetype && matchesTag;
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-80 sm:w-96 flex flex-col border-r border-slate-800 bg-[#0a0d18] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <BookMarked className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif-dream text-sm font-bold tracking-wide text-indigo-100">
                Dream Archive
              </h2>
              <span className="text-[11px] text-slate-400">
                {dreams.length} recorded waking memories
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Button: Record New Dream & View Calendar */}
        <div className="p-4 border-b border-slate-800/60 space-y-2">
          <button
            onClick={() => {
              onNewDreamClick();
              if (window.innerWidth < 1024) onClose();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-950/50 hover:from-indigo-500 hover:to-purple-500 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Record Fresh Dream</span>
          </button>

          <button
            onClick={() => {
              onOpenCalendar();
              if (window.innerWidth < 1024) onClose();
            }}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-semibold border transition-all ${
              activeView === 'calendar'
                ? 'bg-indigo-950/80 border-indigo-400 text-indigo-100 shadow-md shadow-indigo-950/40'
                : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700 hover:bg-slate-900/70'
            }`}
          >
            <Calendar className="h-4 w-4 text-indigo-400" />
            <span>Monthly Calendar & Heatmap</span>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="p-4 space-y-2.5 border-b border-slate-800/60">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search symbols, emotions, tags..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          {/* Filter Mode Selector: Tags vs Archetypes */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex rounded-lg border border-slate-800 bg-slate-900/70 p-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => setFilterMode('tags')}
                className={`flex items-center gap-1 rounded-md px-2 py-0.5 font-medium transition-colors ${
                  filterMode === 'tags'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Hash className="h-3 w-3" />
                <span>Tags ({tagCounts.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('archetypes')}
                className={`flex items-center gap-1 rounded-md px-2 py-0.5 font-medium transition-colors ${
                  filterMode === 'archetypes'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Compass className="h-3 w-3" />
                <span>Archetypes</span>
              </button>
            </div>

            {(selectedTagFilter !== 'ALL' || selectedArchetypeFilter !== 'ALL' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedTagFilter('ALL');
                  setSelectedArchetypeFilter('ALL');
                  setSearchQuery('');
                }}
                className="text-[10px] text-indigo-400 hover:underline"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Tag Filter Chips Carousel */}
          {filterMode === 'tags' && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-[11px]">
              <button
                onClick={() => setSelectedTagFilter('ALL')}
                className={`rounded-lg px-2.5 py-1 font-medium transition-colors shrink-0 ${
                  selectedTagFilter === 'ALL'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                All Tags
              </button>
              {tagCounts.map(([tag, count]) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTagFilter(selectedTagFilter === tag ? 'ALL' : tag)}
                  className={`shrink-0 flex items-center gap-1 rounded-lg px-2 py-1 font-medium transition-colors border ${
                    selectedTagFilter === tag
                      ? 'border-purple-500 bg-purple-950/80 text-purple-200 ring-1 ring-purple-400/50'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span>{tag}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({count})</span>
                </button>
              ))}
            </div>
          )}

          {/* Archetypes Filter Chips Carousel */}
          {filterMode === 'archetypes' && allArchetypes.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-[11px]">
              <button
                onClick={() => setSelectedArchetypeFilter('ALL')}
                className={`rounded-lg px-2.5 py-1 font-medium transition-colors shrink-0 ${
                  selectedArchetypeFilter === 'ALL'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                All
              </button>
              {allArchetypes.map((arch) => (
                <button
                  key={arch}
                  onClick={() => setSelectedArchetypeFilter(selectedArchetypeFilter === arch ? 'ALL' : arch)}
                  className={`shrink-0 rounded-lg px-2.5 py-1 font-medium transition-colors ${
                    selectedArchetypeFilter === arch
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  {arch}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dream List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredDreams.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs">
              No recorded dreams match this filter.
            </div>
          ) : (
            filteredDreams.map((dream) => {
              const isSelected = dream.id === selectedDreamId;
              return (
                <div
                  key={dream.id}
                  onClick={() => {
                    onSelectDream(dream.id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`group relative flex cursor-pointer gap-3 rounded-2xl p-3 border transition-all ${
                    isSelected
                      ? 'border-indigo-500/50 bg-indigo-950/40 shadow-md shadow-indigo-950/40'
                      : 'border-slate-800/80 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-950 border border-slate-800">
                    {dream.image?.url ? (
                      <img
                        src={dream.image.url}
                        alt="Thumbnail"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-600">
                        <Sparkles className="h-6 w-6" />
                      </div>
                    )}
                    {dream.image?.size && (
                      <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 text-[9px] font-mono text-indigo-300">
                        {dream.image.size}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif-dream text-xs font-semibold text-slate-100 truncate group-hover:text-indigo-200 transition-colors">
                      {dream.analysis?.title || 'Fragmented Dream Memory'}
                    </h4>

                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(dream.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      <span>•</span>
                      <span className="truncate max-w-[90px]">
                        {dream.analysis?.archetypes?.[0]?.name || 'Archetypal'}
                      </span>
                    </div>

                    {/* Tag badges */}
                    {dream.tags && dream.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 mt-1.5">
                        {dream.tags.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className={`rounded px-1.5 py-0.5 text-[9px] font-semibold border ${
                              selectedTagFilter === t
                                ? 'border-purple-400 bg-purple-900/80 text-white'
                                : 'border-purple-500/20 bg-purple-950/40 text-purple-300'
                            }`}
                          >
                            {t}
                          </span>
                        ))}
                        {dream.tags.length > 2 && (
                          <span className="text-[9px] text-slate-400 font-mono">
                            +{dream.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    <p className="mt-1 text-[11px] text-slate-400 line-clamp-1 italic">
                      "{dream.transcript}"
                    </p>
                  </div>

                  {/* Delete option */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this dream from your subconscious journal?')) {
                        onDeleteDream(dream.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-red-400 transition-opacity self-start"
                    title="Delete dream"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        <div className="border-t border-slate-800/80 bg-slate-950/70 p-4 flex items-center justify-between">
          <button
            onClick={onExportJournal}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Archive</span>
          </button>

          <button
            onClick={onLoadSamples}
            className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <Sparkles className="h-3 w-3" />
            <span>Sample Presets</span>
          </button>
        </div>
      </aside>
    </>
  );
};
