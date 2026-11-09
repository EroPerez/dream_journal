import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Support audio base64 uploads up to 50MB
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Shared Gemini client initialized per SKILL.md guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: Audio transcription using gemini-3.5-transcribe
app.post('/api/transcribe', async (req: Request, res: Response): Promise<void> => {
  try {
    const { audioData, mimeType } = req.body;
    if (!audioData) {
      res.status(400).json({ error: 'Audio data is required' });
      return;
    }

    const cleanBase64 = audioData.includes('base64,')
      ? audioData.split('base64,')[1]
      : audioData;

    const audioPart = {
      inlineData: {
        mimeType: mimeType || 'audio/webm',
        data: cleanBase64,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          audioPart,
          {
            text: 'Transcribe this voice recording of someone describing a dream they just had upon waking. Provide an accurate, faithful transcript preserving their authentic emotional nuances, fragmented memories, stream-of-consciousness descriptions, and imagery without summarizing or omitting details.',
          },
        ],
      },
    });

    const transcript = response.text || '';
    res.json({ transcript });
  } catch (error: any) {
    console.error('Transcription error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to transcribe audio. Please check your API key.',
    });
  }
});

// Endpoint: Psychological dream interpretation using gemini-3.8-flash
app.post('/api/analyze-dream', async (req: Request, res: Response): Promise<void> => {
  try {
    const { dreamText } = req.body;
    if (!dreamText || !dreamText.trim()) {
      res.status(400).json({ error: 'Dream text is required' });
      return;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Perform an in-depth, rigorous Jungian and psychological archetypal analysis of the following dream recorded upon waking:\n\n"${dreamText}"`,
      config: {
        systemInstruction: `You are Dr. Carl Jung and a master archetypal psychologist specializing in the Collective Unconscious, dream amplification, active imagination, and symbolic integration.
Analyze the dream with immense depth, empathy, and intellectual rigor.
Extract:
1. An evocative, poetic title for the dream.
2. The core emotional theme and subconscious tension.
3. Surreal atmospheric qualities (e.g. "Chiaroscuro, Submerged Gravity, Mythic dread").
4. Recognized archetypes (The Shadow, Anima/Animus, The Persona, The Trickster, The Self, The Great Mother, The Wise Old Man, The Threshold Guardian, etc.) that manifest in the dream, how they appeared, and their deep psychological meaning.
5. Key symbols that appeared in the dream, their archetypal/mythic resonance, and an introspective waking-life question.
6. A deep Jungian synthesis explaining what the unconscious is trying to communicate to the waking ego.
7. An actionable integration ritual or journaling practice for the dreamer.
8. A high-concept, vivid surrealist visual art prompt in the style of René Magritte, Salvador Dalí, and Giorgio de Chirico, translating the dream's core emotional theme into a striking surrealist masterpiece.
9. 4 provocative follow-up questions the dreamer might want to ask you about specific symbols.
10. 3 to 5 lowercase hashtag categories for this dream (e.g., #lucid, #nightmare, #recurring, #shadow-work, #water, #flying, #transformation).`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Evocative, poetic dream title' },
            emotionalCore: { type: Type.STRING, description: 'Core emotional conflict or unconscious desire' },
            atmosphere: { type: Type.STRING, description: 'Surrealist atmosphere keywords' },
            archetypes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: 'Archetype name, e.g. The Shadow, The Anima' },
                  symbolicManifestation: { type: Type.STRING, description: 'How it appeared in the dream' },
                  psychologicalMeaning: { type: Type.STRING, description: 'Analytical psychological interpretation' },
                },
                required: ['name', 'symbolicManifestation', 'psychologicalMeaning'],
              },
            },
            symbols: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  symbol: { type: Type.STRING, description: 'Symbolic object, figure, or setting' },
                  archetypalMeaning: { type: Type.STRING, description: 'Mythic and subconscious significance' },
                  personalReflection: { type: Type.STRING, description: 'Probing question for self-inquiry' },
                },
                required: ['symbol', 'archetypalMeaning', 'personalReflection'],
              },
            },
            jungianSynthesis: { type: Type.STRING, description: 'Comprehensive psychological synthesis of the dream message' },
            integrationPractice: { type: Type.STRING, description: 'Concrete waking-life integration practice or reflection' },
            surrealistArtPrompt: { type: Type.STRING, description: 'Rich, evocative prompt describing a surrealist painting representing this dream' },
            suggestedQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '4 insightful follow-up questions for the dream analyst chat',
            },
            suggestedTags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 to 5 lowercase hashtag categories e.g. #lucid, #recurring, #shadow-work',
            },
          },
          required: [
            'title',
            'emotionalCore',
            'atmosphere',
            'archetypes',
            'symbols',
            'jungianSynthesis',
            'integrationPractice',
            'surrealistArtPrompt',
            'suggestedQuestions',
            'suggestedTags',
          ],
        },
      },
    });

    const analysisJson = response.text ? JSON.parse(response.text) : null;
    res.json({ analysis: analysisJson });
  } catch (error: any) {
    console.error('Dream analysis error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to analyze dream. Please try again.',
    });
  }
});

// Endpoint: Generate surrealist image using gemini-3-pro-image-preview with 1K, 2K, 4K size affordance
app.post('/api/generate-image', async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, imageSize = '1K', aspectRatio = '1:1' } = req.body;
    if (!prompt) {
      res.status(400).json({ error: 'Image prompt is required' });
      return;
    }

    const validatedSize = ['1K', '2K', '4K'].includes(imageSize) ? imageSize : '1K';
    const validatedAspect = ['1:1', '3:4', '4:3', '9:16', '16:9'].includes(aspectRatio)
      ? aspectRatio
      : '1:1';

    // Enhance prompt to guarantee museum-grade surrealist aesthetic
    const enrichedPrompt = `Surrealist fine art painting capturing the subconscious dream realm: ${prompt}. Influenced by René Magritte, Salvador Dalí, Giorgio de Chirico, and Remedios Varo. Impossible dream architecture, floating metaphysical elements, uncanny light, rich oil textures, symbolic subconscious tension, poetic atmosphere, hyper-detailed visionary fine art masterpiece.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: enrichedPrompt,
          },
        ],
      },
      config: {
        imageConfig: {
          imageSize: validatedSize as '1K' | '2K' | '4K',
          aspectRatio: validatedAspect,
        },
      },
    });

    let imageUrl = '';
    const parts = response.candidates?.[0]?.content?.parts ?? [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mime};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      throw new Error('No image was returned by the model.');
    }

    res.json({ imageUrl, size: validatedSize, aspectRatio: validatedAspect });
  } catch (error: any) {
    console.error('Image generation error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate surrealist dream image.',
    });
  }
});

// Endpoint: Multi-turn Chat using gemini-3.8-flash
app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages, dreamContext } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Messages array is required' });
      return;
    }

    const systemInstruction = `You are Dr. Carl Jung and a profound archetypal psychoanalyst assisting a dreamer in exploring the symbols, hidden meanings, and collective unconscious patterns of their waking dream.
Always stay in character as an insightful, empathetic, wise analytical psychologist.
Cite archetypal concepts (The Shadow, Anima/Animus, The Persona, Individuation, Active Imagination, Synchronicity, The Self, Collective Unconscious) and unpack symbols with mythic, historical, and psychological depth.
Connect user inquiries directly back to their specific dream narrative and waking emotional life.

CURRENT DREAM CONTEXT:
${dreamContext ? JSON.stringify(dreamContext, null, 2) : 'No specific dream provided yet.'}`;

    // Convert messages into chat format for gemini-3.8-flash
    // We can use ai.chats.create with previous history
    const chat = ai.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction,
      },
      history: messages.slice(0, -1).map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
    });

    const lastMessage = messages[messages.length - 1];
    const response = await chat.sendMessage({
      message: lastMessage.content,
    });

    res.json({
      reply: response.text || '',
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to process chat message.',
    });
  }
});

// Endpoint: Generate optimized social media post using gemini-3.8-flash
app.post('/api/generate-social-post', async (req: Request, res: Response): Promise<void> => {
  try {
    const { dream, platform = 'twitter', tone = 'poetic', language = 'auto' } = req.body;
    if (!dream) {
      res.status(400).json({ error: 'Dream data is required' });
      return;
    }

    const platformGuides: Record<string, string> = {
      twitter: 'Concise, magnetic Twitter/X post under 280 characters with an evocative opening, key dream symbol or quote, and 3-4 trending hashtags (#Oneiric #CarlJung #LucidDreaming #Surrealism).',
      instagram: 'Engaging Instagram caption with a poetic hook, vivid sensory description of the dream, Jungian psychological reflection, interactive question for followers ("Have you ever had a dream like this?"), and aesthetic hashtags.',
      whatsapp: 'Personal, thoughtful WhatsApp / Telegram message sharing a bizarre and beautiful dream with close friends, including an insightful Jungian takeaway and clean formatting.',
      linkedin: 'Reflective, intellectual thought-leadership post analyzing subconscious creativity, archetypal problem-solving, and how dream integration fuels conscious waking innovation and psychological maturity.',
    };

    const guide = platformGuides[platform] || platformGuides.twitter;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Create an exceptional, ready-to-publish social media post for the following dream:\n\nTitle: "${dream.analysis?.title || 'Waking Dream'}"\nTranscript: "${dream.transcript}"\nEmotional Core: "${dream.analysis?.emotionalCore || ''}"\nKey Archetypes: ${JSON.stringify(dream.analysis?.archetypes?.map((a: any) => a.name) || [])}\nAtmosphere: "${dream.analysis?.atmosphere || ''}"\n\nPlatform Target: ${platform} (${guide})\nTone: ${tone} (e.g. poetic, analytical, mysterious, reflective)\nLanguage: ${language === 'auto' ? 'Match the language of the user or dream text (Spanish or English)' : language}. Return ONLY the ready-to-copy post text without conversational filler.`,
    });

    res.json({ postText: response.text || '' });
  } catch (error: any) {
    console.error('Social post generation error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate social media post.',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dream Journal server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
