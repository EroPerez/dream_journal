import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  MessageSquare,
  HelpCircle,
  RotateCcw,
  Compass,
  CornerDownLeft,
} from 'lucide-react';
import { DreamEntry, ChatMessage } from '../types';

interface JungianChatInterfaceProps {
  dream: DreamEntry;
  onSendMessage: (text: string) => Promise<void>;
  isSending: boolean;
  activeSymbolQuery?: string;
}

export const JungianChatInterface: React.FC<JungianChatInterfaceProps> = ({
  dream,
  onSendMessage,
  isSending,
  activeSymbolQuery,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [dream.chatMessages, isSending]);

  // When parent triggers a symbol inquiry, focus and populate input
  useEffect(() => {
    if (activeSymbolQuery) {
      setInput(activeSymbolQuery);
      inputRef.current?.focus();
    }
  }, [activeSymbolQuery]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isSending) return;

    const messageText = input.trim();
    setInput('');
    await onSendMessage(messageText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickQuestion = (question: string) => {
    onSendMessage(question);
  };

  return (
    <div className="flex flex-col h-[650px] rounded-3xl border border-indigo-500/30 bg-[#0d111d] shadow-2xl overflow-hidden backdrop-blur-xl">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/60 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-700 to-purple-600 text-white shadow-md shadow-indigo-950/50">
            <Compass className="h-5 w-5" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0d111d] bg-emerald-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-dream text-sm font-semibold tracking-wide text-slate-100">
                Dr. Carl Jung
              </h3>
              <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-medium text-indigo-300">
                Archetypal Analyst
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Inquiring into symbols & archetypes from "{dream.analysis?.title || 'Your Dream'}"
            </p>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-500 hidden sm:block">
          Model: gemini-3.8-flash
        </div>
      </div>

      {/* Suggested Questions Pill Carousel */}
      {dream.analysis?.suggestedQuestions && dream.analysis.suggestedQuestions.length > 0 && (
        <div className="border-b border-slate-800/80 bg-slate-950/40 px-6 py-2.5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Inquire:
            </span>
            {dream.analysis.suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickQuestion(q)}
                disabled={isSending}
                className="shrink-0 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs text-slate-300 hover:border-indigo-500/50 hover:bg-indigo-950/40 hover:text-indigo-200 transition-all disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages Scrollable Thread */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {dream.chatMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-400">
            <MessageSquare className="h-10 w-10 text-slate-600 mb-2" />
            <h4 className="font-serif-dream text-sm font-medium text-slate-300">
              Dialogue with the Subconscious
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Ask about any recurring motif, enigmatic figure, or peculiar feeling from your dream.
            </p>
          </div>
        ) : (
          dream.chatMessages.map((msg: ChatMessage) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs">
                  <Compass className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none shadow-md shadow-indigo-950/40'
                    : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-line">{msg.content}</div>
                <div
                  className={`mt-1.5 text-[10px] ${
                    msg.role === 'user' ? 'text-indigo-200/80 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-600/30 text-purple-200 border border-purple-500/30 text-xs">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))
        )}

        {/* Typing indicator */}
        {isSending && (
          <div className="flex gap-3 justify-start">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
              <Compass className="h-4 w-4 animate-spin" />
            </div>
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 rounded-bl-none">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-slate-400 ml-2 font-serif italic">
                  Amplify subconscious symbols...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Symbol Chips Bar */}
      {dream.analysis?.symbols && dream.analysis.symbols.length > 0 && (
        <div className="border-t border-slate-800/60 bg-slate-950/50 px-6 py-2">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">
              Symbols:
            </span>
            {dream.analysis.symbols.map((sym, i) => (
              <button
                key={i}
                type="button"
                onClick={() =>
                  setInput(
                    `Dr. Jung, what is the archetypal significance of the "${sym.symbol}" in this dream?`
                  )
                }
                className="shrink-0 rounded-md border border-slate-800 bg-slate-900/60 px-2 py-0.5 text-[11px] text-slate-300 hover:border-indigo-500/40 hover:text-indigo-200 transition-colors"
              >
                {sym.symbol}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <form onSubmit={handleSend} className="border-t border-slate-800 bg-slate-900/90 p-4">
        <div className="flex items-center gap-2">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Dr. Jung about a specific symbol, shadow figure, or waking tension..."
            className="flex-1 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors resize-none max-h-32"
          />

          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-950/50 hover:bg-indigo-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Send inquiry"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>Role: Master Analytical Psychologist</span>
        </div>
      </form>
    </div>
  );
};
