import { DreamEntry } from './types';

export const SAMPLE_DREAMS: DreamEntry[] = [
  {
    id: 'dream-sample-1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    transcript:
      "I woke up in an endless library where the floors were filled with ankle-deep dark water. The water was perfectly still like black glass, reflecting stone archways that stretched into infinite mist. I was holding a heavy bronze birdcage, but instead of a bird, inside was a glowing mechanical pocket watch that ticked backward. Every time it ticked, ripples spread across the water. A tall, faceless figure dressed in a tailored midnight-blue coat stood at the threshold of a spiral staircase leading up into the clouds. He didn't speak with a voice, but I felt him asking: 'Are you ready to surrender the debt of lost hours?' I was terrified of dropping the cage, yet desperately relieved.",
    hasAudio: false,
    image: {
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
      size: '2K',
      aspectRatio: '1:1',
      prompt:
        'Surrealist oil painting in the style of René Magritte and Giorgio de Chirico: an endless gothic library floor submerged in shallow black mirror water, floating antique books, a glowing mechanical birdcage containing a reverse-spinning clock, and a mysterious tall faceless silhouette on a spiral marble staircase reaching toward twilight clouds.',
    },
    analysis: {
      title: 'The Submerged Archive of Backward Time',
      emotionalCore:
        'Profound temporal anxiety intertwined with a covert longing to release neurotic control over the unlived past.',
      atmosphere: 'Chiaroscuro, Submerged Stillness, Metaphysical Reverie, Twilight Solitude',
      archetypes: [
        {
          name: 'The Threshold Guardian',
          symbolicManifestation: 'The faceless figure in the midnight-blue coat blocking the cloud staircase.',
          psychologicalMeaning:
            'A personification of the ego’s defense mechanisms preventing premature ascent into higher consciousness until current psychological debt is acknowledged.',
        },
        {
          name: 'The Shadow & The Self',
          symbolicManifestation: 'The dark water acting as an infinite mirror.',
          psychologicalMeaning:
            'Water in dream analysis almost invariably denotes the boundless depths of the collective unconscious. Looking into black water indicates confrontation with the repressed unconscious.',
        },
        {
          name: 'The Chronos Complex / The False Persona',
          symbolicManifestation: 'The birdcage holding a backward-ticking watch.',
          psychologicalMeaning:
            'The desperate attempt of the conscious mind to imprison and regulate the mystery of psychic time within a rigid mechanical construct.',
        },
      ],
      symbols: [
        {
          symbol: 'Ankle-deep Dark Water',
          archetypalMeaning:
            'The primordial ocean of the unconscious; calm yet immense, mirroring your concealed emotional currents.',
          personalReflection: 'What submerged truths or emotional reservoirs in your waking life are you cautiously wading through without diving in?',
        },
        {
          symbol: 'Backward-Ticking Watch in a Cage',
          archetypalMeaning:
            'Regret, temporal arrest, and the futility of holding onto bygone decisions or missed opportunities.',
          personalReflection: 'Where are you trying to undo or bargain with past choices rather than stepping into the present?',
        },
        {
          symbol: 'Spiral Staircase to the Clouds',
          archetypalMeaning:
            'Individuation and transcendence; the winding path toward integration and spiritual clarity.',
          personalReflection: 'What next stage of personal evolution awaits you if you put down your emotional baggage?',
        },
      ],
      jungianSynthesis:
        'This dream is a classical invitation to Individuation. The ego has trapped itself in an intellectual archive (the library of memory and rationalization), attempting to imprison Time itself inside a cage. The faceless guardian is not a hostile enemy, but a necessary psychic function: asking whether you are prepared to surrender the obsession with rectifying yesterday so you may ascend into your authentic Self.',
      integrationPractice:
        'Perform an active imagination journaling exercise: Sit in quiet meditation, imagine holding the bronze cage over the dark water, open the latch, let the watch dissolve into the water, and write down the first sensation your physical body experiences.',
      surrealistArtPrompt:
        'Surrealist oil painting of an endless gothic library floor submerged in still black water, a floating glowing bronze birdcage holding a ticking reverse pocket watch, a mysterious faceless figure on a celestial spiral staircase, metaphysical twilight lighting in the style of René Magritte and Salvador Dalí.',
      suggestedQuestions: [
        'Why did the watch tick backward instead of forward?',
        'How can I identify the Threshold Guardian in my waking daily life?',
        'Does the dark water signify danger or untapped psychic potential?',
        'What should I say to the faceless figure in the blue coat?',
      ],
    },
    chatMessages: [
      {
        id: 'msg-1',
        role: 'assistant',
        content:
          'Welcome to your subconscious sanctuary. I have analyzed your dream, "The Submerged Archive of Backward Time". The backward-ticking watch trapped inside the birdcage is an arresting symbol of unresolved temporal debt. What particular sensation or question lingers most intensely for you upon reflection?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 7).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
    status: 'ready',
  },
  {
    id: 'dream-sample-2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(), // yesterday
    transcript:
      "I was wandering through an orchard where the trees grew giant keys made of heavy amber and blown glass instead of fruit. In the center of the grove, a silver wolf with human green eyes was guarding a dormant stone furnace. She looked at me without aggression and nudged an emerald key into my palm with her nose. When I looked closely at the key, I saw my own reflection crying tears that turned into tiny pearls.",
    hasAudio: false,
    image: {
      url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
      size: '4K',
      aspectRatio: '1:1',
      prompt:
        'Surrealist fine art painting in the style of Remedios Varo and Salvador Dalí: an ethereal moonlit orchard with trees bearing giant luminous amber and glass keys, an enigmatic silver wolf with emerald human eyes, a cold stone alchemical furnace, and glowing tears crystalizing into pearls.',
    },
    analysis: {
      title: 'The Orchard of Amber Keys & The Silver Wolf',
      emotionalCore:
        'Awakening of instinctual feminine wisdom (Anima) and the transmutation of grief into psychic treasure.',
      atmosphere: 'Luminous Alchemical Moonshine, Chthonic Grace, Emerald and Amber Radiance',
      archetypes: [
        {
          name: 'The Anima / Instinctual Guide',
          symbolicManifestation: 'The silver wolf possessing conscious, human green eyes.',
          psychologicalMeaning:
            'A bridge between primal instinct and higher consciousness; an animal guide delivering the key to your repressed emotional treasury.',
        },
        {
          name: 'The Alchemical Vessel (Athanor)',
          symbolicManifestation: 'The dormant stone furnace awaiting rekindling.',
          psychologicalMeaning:
            'The psyche’s container where psychological transformation (the Magnum Opus) takes place.',
        },
      ],
      symbols: [
        {
          symbol: 'Keys growing as fruit',
          archetypalMeaning: 'Unrealized latent capabilities and secret passages within the self.',
          personalReflection: 'Which unexplored aspect of your creative or instinctual nature is ripening for discovery?',
        },
        {
          symbol: 'Tears turning into pearls',
          archetypalMeaning: 'Alchemical transmutation: suffering crystallizing into enduring wisdom and beauty.',
          personalReflection: 'How has recent sadness or vulnerability secretly forged your inner resilience?',
        },
      ],
      jungianSynthesis:
        'The unconscious is assuring you that your past grief was not wasted. The wolf, representative of nature’s innate intelligence, bestows upon you the means to unlock your own transformation. By honoring your emotional tears as pearls rather than weaknesses, the dormant furnace of your spirit is ready to be lit.',
      integrationPractice:
        'Keep a small pebble or smooth token in your pocket this week. Whenever self-doubt arises, touch it as a reminder of the emerald key given by your instinctual ally.',
      surrealistArtPrompt:
        'Surrealist masterpiece painting of an orchard where translucent amber keys grow from twisting branches, a noble silver wolf with sentient green eyes beside a stone furnace, pearls falling like tears, atmospheric moonlight.',
      suggestedQuestions: [
        'What does the wolf want me to unlock with the emerald key?',
        'Why was the stone furnace cold and dormant?',
        'How does Jungian psychology view animal guides in dreams?',
      ],
    },
    chatMessages: [
      {
        id: 'msg-s2-1',
        role: 'assistant',
        content:
          'In alchemical psychology, tears that harden into pearls represent the "Lapis Philosophorum"—the philosopher\'s stone created through patient suffering. The silver wolf is a benevolent Anima figure offering you the instrument of liberation. How does this resonate with your current life chapter?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 27).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
    status: 'ready',
  },
];
