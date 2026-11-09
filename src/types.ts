export interface DreamArchetype {
  name: string;
  symbolicManifestation: string;
  psychologicalMeaning: string;
}

export interface DreamSymbol {
  symbol: string;
  archetypalMeaning: string;
  personalReflection: string;
}

export interface DreamAnalysis {
  title: string;
  emotionalCore: string;
  atmosphere: string;
  archetypes: DreamArchetype[];
  symbols: DreamSymbol[];
  jungianSynthesis: string;
  integrationPractice: string;
  surrealistArtPrompt: string;
  suggestedQuestions: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface DreamEntry {
  id: string;
  createdAt: string;
  transcript: string;
  hasAudio: boolean;
  audioBlobUrl?: string;
  image?: {
    url: string;
    size: '1K' | '2K' | '4K';
    aspectRatio: string;
    prompt: string;
  };
  analysis?: DreamAnalysis;
  chatMessages: ChatMessage[];
  status: 'idle' | 'recording' | 'transcribing' | 'analyzing' | 'generating_image' | 'ready' | 'error';
  errorMessage?: string;
}
