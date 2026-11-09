import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Compass,
  Layers,
  Flame,
  ArrowRight,
  Plus,
  Eye,
  Filter,
  Moon,
  Clock,
  Shield,
} from 'lucide-react';
import { DreamEntry, DreamArchetype } from '../types';

interface DreamCalendarViewProps {
  dreams: DreamEntry[];
  selectedDreamId: string | null;
  onSelectDream: (dreamId: string) => void;
  onRecordDream: () => void;
  onOpenCanvasView: () => void;
  onLoadSamples?: () => void;
}

// Color schemes for recognized Jungian archetypes
export const ARCHETYPE_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  'The Shadow': {
    bg: 'bg-amber-950/40',
    text: 'text-amber-300',
    border: 'border-amber-500/40',
    dot: 'bg-amber-400',
  },
  'The Anima': {
    bg: 'bg-fuchsia-950/40',
    text: 'text-fuchsia-300',
    border: 'border-fuchsia-500/40',
    dot: 'bg-fuchsia-400',
  },
  'The Animus': {
    bg: 'bg-pink-950/40',
    text: 'text-pink-300',
    border: 'border-pink-500/40',
    dot: 'bg-pink-400',
  },
  'The Self': {
    bg: 'bg-emerald-950/40',
    text: 'text-emerald-300',
    border: 'border-emerald-500/40',
    dot: 'bg-emerald-400',
  },
  'The Threshold Guardian': {
    bg: 'bg-sky-950/40',
    text: 'text-sky-300',
    border: 'border-sky-500/40',
    dot: 'bg-sky-400',
  },
  'The Trickster': {
    bg: 'bg-rose-950/40',
    text: 'text-rose-300',
    border: 'border-rose-500/40',
    dot: 'bg-rose-400',
  },
  'The Persona': {
    bg: 'bg-purple-950/40',
    text: 'text-purple-300',
    border: 'border-purple-500/40',
    dot: 'bg-purple-400',
  },
  'The Wise Old Man': {
    bg: 'bg-orange-950/40',
    text: 'text-orange-300',
    border: 'border-orange-500/40',
    dot: 'bg-orange-400',
  },
  'The Great Mother': {
    bg: 'bg-teal-950/40',
    text: 'text-teal-300',
    border: 'border-teal-500/40',
    dot: 'bg-teal-400',
  },
};

export const getArchetypeStyle = (name: string) => {
  for (const [key, val] of Object.entries(ARCHETYPE_COLORS)) {
    if (name.toLowerCase().includes(key.toLowerCase().replace('the ', ''))) {
      return val;
    }
  }
  return {
    bg: 'bg-indigo-950/40',
    text: 'text-indigo-300',
    border: 'border-indigo-500/40',
    dot: 'bg-indigo-400',
  };
};

export const DreamCalendarView: React.FC<DreamCalendarViewProps> = ({
  dreams,
  selectedDreamId,
  onSelectDream,
  onRecordDream,
  onOpenCanvasView,
  onLoadSamples,
}) => {
  // Current view date (defaulting to November 2026 based on anchor date)
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date('2026-11-01T00:00:00'));
  const [selectedDayString, setSelectedDayString] = useState<string | null>('2026-11-09');
  const [archetypeFilter, setArchetypeFilter] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleCurrentMonth = () => {
    setCurrentDate(new Date('2026-11-01T00:00:00'));
    setSelectedDayString('2026-11-09');
  };

  // Group dreams by date string 'YYYY-MM-DD'
  const dreamsByDate = useMemo(() => {
    const map: Record<string, DreamEntry[]> = {};
    for (const dream of dreams) {
      const d = new Date(dream.createdAt);
      // Format as YYYY-MM-DD in local time
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;
      if (!map[key]) map[key] = [];
      map[key].push(dream);
    }
    return map;
  }, [dreams]);

  // Archetype frequency metrics for the selected month
  const monthlyMetrics = useMemo(() => {
    const archetypeCounts: Record<string, number> = {};
    let totalMonthDreams = 0;

    for (const dream of dreams) {
      const d = new Date(dream.createdAt);
      if (d.getFullYear() === year && d.getMonth() === month) {
        totalMonthDreams++;
        for (const arch of dream.analysis?.archetypes || []) {
          archetypeCounts[arch.name] = (archetypeCounts[arch.name] || 0) + 1;
        }
      }
    }

    const sortedArchetypes = Object.entries(archetypeCounts).sort((a, b) => b[1] - a[1]);

    return {
      totalMonthDreams,
      sortedArchetypes,
    };
  }, [dreams, year, month]);

  // Calendar matrix calculation
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
    const totalDaysInMonth = lastDayOfMonth.getDate();

    const days = [];

    // Previous month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      const prevDate = new Date(year, month - 1, dayNum);
      const key = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(
        2,
        '0'
      )}-${String(dayNum).padStart(2, '0')}`;
      days.push({
        date: prevDate,
        dayNumber: dayNum,
        isCurrentMonth: false,
        dateKey: key,
        dreams: dreamsByDate[key] || [],
      });
    }

    // Current month days
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const curDate = new Date(year, month, d);
      const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        date: curDate,
        dayNumber: d,
        isCurrentMonth: true,
        dateKey: key,
        dreams: dreamsByDate[key] || [],
      });
    }

    // Next month padding to fill out 35 or 42 cells (6 rows * 7 cols)
    const remaining = (7 - (days.length % 7)) % 7;
    for (let nextDay = 1; nextDay <= remaining; nextDay++) {
      const nextDate = new Date(year, month + 1, nextDay);
      const key = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(
        2,
        '0'
      )}-${String(nextDay).padStart(2, '0')}`;
      days.push({
        date: nextDate,
        dayNumber: nextDay,
        isCurrentMonth: false,
        dateKey: key,
        dreams: dreamsByDate[key] || [],
      });
    }

    return days;
  }, [year, month, dreamsByDate]);

  // Selected Day's dreams
  const selectedDayDreams = selectedDayString ? dreamsByDate[selectedDayString] || [] : [];
  const selectedDayParsed = selectedDayString ? new Date(selectedDayString + 'T00:00:00') : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Month Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-slate-800 bg-[#0d111e]/90 p-6 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950/60">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif-dream text-xl font-bold tracking-wide text-slate-100">
                {currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </h2>
              <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
                {monthlyMetrics.totalMonthDreams} Dreams
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Daily frequency heatmap & Jungian archetypal patterns
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {onLoadSamples && (
            <button
              onClick={onLoadSamples}
              className="flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-950/40 px-3 py-1.5 text-xs font-medium text-indigo-300 hover:bg-indigo-900/50 hover:text-white transition-colors"
              title="Populate full November dream dataset"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Load Full Month Presets</span>
            </button>
          )}

          <button
            onClick={handleCurrentMonth}
            className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            November 2026
          </button>
          <div className="flex rounded-xl border border-slate-800 bg-slate-900/60 p-1">
            <button
              onClick={handlePrevMonth}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              title="Next Month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Archetype Filter & Trend Chips */}
      {monthlyMetrics.sortedArchetypes.length > 0 && (
        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-indigo-400" />
              Filter Calendar by Archetype:
            </span>
            {archetypeFilter && (
              <button
                onClick={() => setArchetypeFilter(null)}
                className="text-[11px] text-indigo-400 hover:underline font-medium"
              >
                Clear Filter (Showing all)
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setArchetypeFilter(null)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all border ${
                archetypeFilter === null
                  ? 'border-indigo-400 bg-indigo-950/70 text-indigo-200 shadow-sm'
                  : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
              }`}
            >
              All Manifestations ({monthlyMetrics.totalMonthDreams})
            </button>

            {monthlyMetrics.sortedArchetypes.map(([name, count]) => {
              const style = getArchetypeStyle(name);
              const isSelected = archetypeFilter === name;
              return (
                <button
                  key={name}
                  onClick={() => setArchetypeFilter(isSelected ? null : name)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all border ${
                    isSelected
                      ? `${style.bg} ${style.border} ${style.text} ring-1 ring-indigo-400/50 shadow-md`
                      : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                  <span>{name}</span>
                  <span className="text-[10px] opacity-75 font-mono">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Calendar Grid & Day Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid (2 cols on large screen) */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-[#0a0d18]/90 p-5 sm:p-6 backdrop-blur-xl shadow-2xl">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((cell, idx) => {
              const hasDreams = cell.dreams.length > 0;
              const isSelected = cell.dateKey === selectedDayString;
              const isToday = cell.dateKey === '2026-11-09';

              // Check if cell matches active archetype filter
              const matchesFilter =
                archetypeFilter === null ||
                cell.dreams.some((d) =>
                  d.analysis?.archetypes.some((a) => a.name === archetypeFilter)
                );

              const isDimmed = !cell.isCurrentMonth || (hasDreams && !matchesFilter);

              // Distinct key archetypes for this day (deduplicated)
              const dayArchetypes: DreamArchetype[] = Array.from(
                new Map(
                  cell.dreams
                    .flatMap((d) => d.analysis?.archetypes || [])
                    .map((a) => [a.name, a])
                ).values()
              );

              // Heat intensity class based on frequency
              let heatClass = 'bg-slate-900/20 border-slate-800/60 text-slate-400';
              if (hasDreams && cell.isCurrentMonth) {
                if (cell.dreams.length >= 2) {
                  heatClass =
                    'bg-gradient-to-br from-indigo-950/70 via-purple-950/60 to-slate-900 border-indigo-500/50 text-indigo-100 shadow-md shadow-indigo-950/40';
                } else {
                  heatClass =
                    'bg-indigo-950/40 border-indigo-500/30 text-indigo-200 hover:border-indigo-400/60';
                }
              }

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDayString(cell.dateKey)}
                  className={`group relative flex flex-col justify-between min-h-[92px] sm:min-h-[105px] p-2 rounded-2xl border transition-all cursor-pointer ${heatClass} ${
                    isSelected
                      ? 'ring-2 ring-indigo-400 border-indigo-400 bg-indigo-950/80 shadow-lg shadow-indigo-900/50 scale-[1.02] z-10'
                      : 'hover:scale-[1.01]'
                  } ${isDimmed ? 'opacity-35 hover:opacity-75' : ''}`}
                >
                  {/* Top Bar inside cell: Day number + dream frequency badge */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                        isToday
                          ? 'bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-sm ring-2 ring-indigo-400/40'
                          : isSelected
                          ? 'text-indigo-200 font-bold'
                          : cell.isCurrentMonth
                          ? 'text-slate-200'
                          : 'text-slate-400'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {hasDreams && (
                      <span
                        className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                          cell.dreams.length >= 2
                            ? 'bg-purple-500/30 text-purple-200 border border-purple-400/40'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}
                      >
                        <Moon className="h-2.5 w-2.5" />
                        <span>{cell.dreams.length}</span>
                      </span>
                    )}
                  </div>

                  {/* Archetype visual markers on the cell */}
                  {hasDreams ? (
                    <div className="mt-1 space-y-1">
                      {/* Up to 2 Archetype Pills */}
                      <div className="flex flex-col gap-1">
                        {dayArchetypes.slice(0, 2).map((arch, aIdx) => {
                          const style = getArchetypeStyle(arch.name);
                          return (
                            <span
                              key={aIdx}
                              className={`flex items-center gap-1 truncate rounded-md px-1.5 py-0.5 text-[9px] font-semibold border ${style.bg} ${style.border} ${style.text}`}
                              title={`${arch.name}: ${arch.symbolicManifestation}`}
                            >
                              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} />
                              <span className="truncate">{arch.name.replace('The ', '')}</span>
                            </span>
                          );
                        })}
                        {dayArchetypes.length > 2 && (
                          <span className="text-[8px] font-mono text-slate-400 px-1">
                            +{dayArchetypes.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] text-slate-400">+ Add</span>
                    </div>
                  )}

                  {/* Tiny Thumbnail preview if present */}
                  {hasDreams && cell.dreams[0]?.image?.url && (
                    <div className="mt-1 flex items-center justify-end">
                      <div className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-800 border border-slate-700" />
                No recording
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500/60 border border-indigo-400" />
                1 Dream
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-purple-500 border border-purple-300" />
                2+ Dreams (Intense REM)
              </span>
            </div>
            <span className="text-slate-400">
              Click any calendar day to inspect archetypes & surrealist visions
            </span>
          </div>
        </div>

        {/* Selected Day Inspector Panel (1 col) */}
        <div className="rounded-3xl border border-indigo-500/30 bg-[#0d1222]/95 p-6 backdrop-blur-xl flex flex-col justify-between shadow-2xl">
          <div>
            {/* Inspector Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-5">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                  <Compass className="h-3.5 w-3.5" />
                  Nocturnal Inspector
                </span>
                <h3 className="font-serif-dream text-base font-bold text-slate-100 mt-0.5">
                  {selectedDayParsed
                    ? selectedDayParsed.toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Select a Date'}
                </h3>
              </div>

              {selectedDayDreams.length > 0 && (
                <span className="rounded-full bg-indigo-500/20 px-2.5 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
                  {selectedDayDreams.length} {selectedDayDreams.length === 1 ? 'Dream' : 'Dreams'}
                </span>
              )}
            </div>

            {/* List of dreams for this day */}
            {selectedDayDreams.length > 0 ? (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {selectedDayDreams.map((dream, dIdx) => (
                  <div
                    key={dream.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 transition-all hover:border-indigo-500/40"
                  >
                    {/* Header info */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(dream.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <h4 className="font-serif-dream text-sm font-semibold text-slate-100 truncate mt-0.5">
                          {dream.analysis?.title || 'Waking Dream'}
                        </h4>
                      </div>

                      {dream.image?.url && (
                        <img
                          src={dream.image.url}
                          alt="Thumbnail"
                          className="h-12 w-12 rounded-xl object-cover border border-slate-700 shrink-0"
                        />
                      )}
                    </div>

                    {/* Emotional core */}
                    <p className="text-xs text-slate-300 line-clamp-2 italic mb-3">
                      "{dream.analysis?.emotionalCore || dream.transcript}"
                    </p>

                    {/* Archetype Badges */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Manifested Archetypes:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {dream.analysis?.archetypes.map((arch, aIdx) => {
                          const style = getArchetypeStyle(arch.name);
                          return (
                            <span
                              key={aIdx}
                              className={`flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-semibold border ${style.bg} ${style.border} ${style.text}`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                              <span>{arch.name}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Open in Studio Button */}
                    <button
                      onClick={() => {
                        onSelectDream(dream.id);
                        onOpenCanvasView();
                      }}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600/30 border border-indigo-500/40 py-2 text-xs font-semibold text-indigo-200 hover:bg-indigo-600/50 hover:text-white transition-all"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Open Canvas & Jungian Chat</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Moon className="h-10 w-10 text-slate-600 mb-3" />
                <h4 className="font-serif-dream text-sm font-medium text-slate-300">
                  No Dream Recorded On This Date
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  Dreams from this morning may have dissolved into the waking ego. Record now to capture fresh fragments.
                </p>

                <button
                  onClick={onRecordDream}
                  className="mt-5 flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-lg hover:from-indigo-500 hover:to-purple-500 transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>Record Dream for This Day</span>
                </button>
              </div>
            )}
          </div>

          {/* Footer stats on psychic activity */}
          <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-indigo-400" />
              Subconscious Map
            </span>
            <span>Synchronized with Local Journal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
