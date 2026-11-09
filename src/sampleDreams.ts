import { DreamEntry } from './types';

// Anchor around current time (Nov 2026)
const now = new Date('2026-11-09T08:00:00-08:00');

export const SAMPLE_DREAMS: DreamEntry[] = [
  {
    id: 'dream-sample-1',
    createdAt: new Date('2026-11-09T07:15:00-08:00').toISOString(),
    transcript:
      "I woke up in an endless library where the floors were filled with ankle-deep dark water. The water was perfectly still like black glass, reflecting stone archways that stretched into infinite mist. I was holding a heavy bronze birdcage, but instead of a bird, inside was a glowing mechanical pocket watch that ticked backward. Every time it ticked, ripples spread across the water. A tall, faceless figure dressed in a tailored midnight-blue coat stood at the threshold of a spiral staircase leading up into the clouds. He didn't speak with a voice, but I felt him asking: 'Are you ready to surrender the debt of lost hours?' I was terrified of dropping the cage, yet desperately relieved.",
    hasAudio: false,
    tags: ['#recurring', '#shadow-work', '#water', '#temporal-anxiety'],
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
          name: 'The Shadow',
          symbolicManifestation: 'The dark water acting as an infinite mirror.',
          psychologicalMeaning:
            'Water in dream analysis almost invariably denotes the boundless depths of the collective unconscious and confrontation with the repressed self.',
        },
        {
          name: 'The Persona',
          symbolicManifestation: 'The bronze birdcage holding a backward-ticking watch.',
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
        timestamp: '07:22 AM',
      },
    ],
    status: 'ready',
  },
  {
    id: 'dream-sample-1b',
    createdAt: new Date('2026-11-09T03:40:00-08:00').toISOString(),
    transcript:
      "Earlier in the night, I dreamed of walking upon a shoreline made entirely of broken black obsidian glass. A giant translucent butterfly with stained-glass wings was resting upon a petrified wooden throne. When it flapped its wings, small sparks of violet lightning lit up the fog, revealing a quiet lighthouse with no keeper.",
    hasAudio: false,
    tags: ['#lucid', '#metamorphosis', '#healing', '#numinous'],
    image: {
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
      size: '1K',
      aspectRatio: '1:1',
      prompt:
        'Surrealist painting in the style of Salvador Dalí and Remedios Varo: an obsidian glass shoreline, a petrified throne carrying a gigantic stained-glass butterfly emitting violet electric sparks, a solitary distant lighthouse piercing violet mist.',
    },
    analysis: {
      title: 'The Stained-Glass Butterfly & The Obsidian Shore',
      emotionalCore: 'Fragile hope and radical transformation amidst sharp, protective psychological defenses.',
      atmosphere: 'Violet Twilight, Electric Silence, Volcanic Glass, Solitary Guidance',
      archetypes: [
        {
          name: 'The Self',
          symbolicManifestation: 'The stained-glass butterfly resting on the petrified throne.',
          psychologicalMeaning:
            'The transcendent soul undergoing psychic metamorphosis, claiming sovereignty even in jagged terrain.',
        },
        {
          name: 'The Shadow',
          symbolicManifestation: 'The sharp obsidian glass shoreline.',
          psychologicalMeaning:
            'Defensive armoring formed from past wounding that now threatens to cut the ego if tread upon without awareness.',
        },
      ],
      symbols: [
        {
          symbol: 'Stained-Glass Butterfly',
          archetypalMeaning: 'Psyche (the soul), fragility married with radiant illumination.',
          personalReflection: 'What tender, creative aspect of yourself needs protection as it reorganizes?',
        },
        {
          symbol: 'Lighthouse without a Keeper',
          archetypalMeaning: 'Autonomous inner guidance from the transpersonal Self.',
          personalReflection: 'Can you trust inner intuition when external authorities are absent?',
        },
      ],
      jungianSynthesis:
        'A night of dual messages: before confronting the temporal archive of the waking hours, the unconscious demonstrated that the fragile soul (Psyche) is sovereign even upon jagged ground.',
      integrationPractice:
        'Light a candle in a dark room. Watch the flame flicker and notice where your breath softens.',
      surrealistArtPrompt:
        'Surrealist nocturnal oil painting of a glowing crystalline butterfly on an ancient throne over black obsidian sand, distant beacon of purple light.',
      suggestedQuestions: [
        'What does the obsidian shore represent regarding past trauma?',
        'Why did the lighthouse have no keeper?',
      ],
    },
    chatMessages: [],
    status: 'ready',
  },
  {
    id: 'dream-sample-2',
    createdAt: new Date('2026-11-08T06:50:00-08:00').toISOString(),
    transcript:
      "I was wandering through an orchard where the trees grew giant keys made of heavy amber and blown glass instead of fruit. In the center of the grove, a silver wolf with human green eyes was guarding a dormant stone furnace. She looked at me without aggression and nudged an emerald key into my palm with her nose. When I looked closely at the key, I saw my own reflection crying tears that turned into tiny pearls.",
    hasAudio: false,
    tags: ['#alchemical', '#animal-guide', '#healing', '#lucid'],
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
          name: 'The Anima',
          symbolicManifestation: 'The silver wolf possessing conscious, human green eyes.',
          psychologicalMeaning:
            'A bridge between primal instinct and higher consciousness; an animal guide delivering the key to your repressed emotional treasury.',
        },
        {
          name: 'The Self',
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
        'The unconscious is assuring you that your past grief was not wasted. The wolf, representative of nature’s innate intelligence, bestows upon you the means to unlock your own transformation.',
      integrationPractice:
        'Keep a small pebble or smooth token in your pocket this week. Touch it when self-doubt arises.',
      surrealistArtPrompt:
        'Surrealist masterpiece painting of an orchard where translucent amber keys grow from twisting branches, a noble silver wolf with sentient green eyes beside a stone furnace.',
      suggestedQuestions: [
        'What does the wolf want me to unlock with the emerald key?',
        'Why was the stone furnace cold and dormant?',
      ],
    },
    chatMessages: [
      {
        id: 'msg-s2-1',
        role: 'assistant',
        content:
          'In alchemical psychology, tears that harden into pearls represent the "Lapis Philosophorum". The silver wolf is a benevolent Anima figure offering you the instrument of liberation. How does this resonate with your current life chapter?',
        timestamp: '07:10 AM',
      },
    ],
    status: 'ready',
  },
  {
    id: 'dream-sample-3',
    createdAt: new Date('2026-11-06T07:30:00-08:00').toISOString(),
    transcript:
      "I was attending a lavish masked ball inside a ballroom carved out of solid ice. Everyone wore identical porcelain masks representing peaceful smiling faces, but their actual hands underneath their gloves were made of dried autumn leaves. A woman whose gown was woven from living ivy took my hand and whispered: 'Take off your mask before the sun warms the chandeliers.' When I reached to unfasten my mask, it had grown warm flesh and nerve endings.",
    hasAudio: false,
    tags: ['#nightmare', '#persona', '#social', '#frozen'],
    image: {
      url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80',
      size: '2K',
      aspectRatio: '1:1',
      prompt:
        'Surrealist oil painting in the style of René Magritte: an ice cavern ballroom with elegant figures wearing smiling porcelain masks, delicate hands of dry leaves, glowing chandeliers melting droplets of liquid gold.',
    },
    analysis: {
      title: 'The Glacial Masquerade of Fused Faces',
      emotionalCore: 'Suffocation under social expectations and dread of losing true identity to the Persona.',
      atmosphere: 'Glacial Frigidity, Golden Opulence, Uncanny Dissimulation, Fragile Foliage',
      archetypes: [
        {
          name: 'The Persona',
          symbolicManifestation: 'The smiling porcelain mask that fused into human flesh.',
          psychologicalMeaning:
            'The social mask that has become so thoroughly identified with the ego that genuine vulnerability feels life-threatening.',
        },
        {
          name: 'The Great Mother',
          symbolicManifestation: 'The woman in the gown of living ivy urging authenticity.',
          psychologicalMeaning:
            'Nature and organic life rebelling against rigid, frozen social conformity.',
        },
      ],
      symbols: [
        {
          symbol: 'Ballroom of Solid Ice',
          archetypalMeaning: 'Emotional detachment, preserved decorum at the expense of warmth.',
          personalReflection: 'Where in your social life are you keeping interactions strictly polite yet frozen?',
        },
        {
          symbol: 'Hands of Autumn Leaves',
          archetypalMeaning: 'Transience, fragility, and unacknowledged mortality.',
          personalReflection: 'What truth are you hiding behind your professional composure?',
        },
      ],
      jungianSynthesis:
        'The dream urgently warns against over-identification with the Persona. When the mask becomes your skin, you cease to live from the instinctual center.',
      integrationPractice:
        'Spend 15 minutes journaling on: "If I didn\'t care what anyone thought of me today, what would I stop doing?"',
      surrealistArtPrompt:
        'Surrealist painting of figures in a crystal ice palace with porcelain masks, melting candles, ivy vines twisting through frozen pillars.',
      suggestedQuestions: [
        'How do I safely remove a Persona that feels fused to my identity?',
        'What does the woman in ivy signify for my creative life?',
      ],
    },
    chatMessages: [],
    status: 'ready',
  },
  {
    id: 'dream-sample-4',
    createdAt: new Date('2026-11-04T06:15:00-08:00').toISOString(),
    transcript:
      "I was standing atop a colossal telescope made of brass and bone in the middle of a red desert. An elder astronomer with a beard of spun starlight handed me a lens crafted from pure honey. Looking through it, instead of constellations, I saw every house I have ever lived in stacked on top of one another like a spiraling tower, each room glowing with the voice of someone I once loved.",
    hasAudio: false,
    tags: ['#ancestral', '#numinous', '#wise-elder', '#cosmic'],
    image: {
      url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
      size: '2K',
      aspectRatio: '1:1',
      prompt:
        'Surrealist visionary painting in the style of Giorgio de Chirico and Max Ernst: a towering antique telescope in an expansive crimson desert under a sky of swirling nebulas, an elder sage with starlight beard, stacked miniature glowing houses spiraling into the cosmos.',
    },
    analysis: {
      title: 'The Desert Observatory & The Lens of Honey',
      emotionalCore: 'Nostalgic reverence for ancestral memory and reconciliation with past chapters of the Self.',
      atmosphere: 'Cosmic Warmth, Crimson Horizon, Nostalgic Reverence, Vast Desert Silence',
      archetypes: [
        {
          name: 'The Wise Old Man',
          symbolicManifestation: 'The elder astronomer with a beard of spun starlight.',
          psychologicalMeaning:
            'The archetype of wisdom, meaning, and deep transpersonal orientation assisting the ego in seeing the master pattern.',
        },
        {
          name: 'The Self',
          symbolicManifestation: 'The spiraling tower of all past homes illuminated in unity.',
          psychologicalMeaning:
            'Wholeness; the integration of every chronological developmental stage into a singular psychic temple.',
        },
      ],
      symbols: [
        {
          symbol: 'Lens of Honey',
          archetypalMeaning: 'Viewing life history through sweet forgiveness and golden nourishment rather than bitter critique.',
          personalReflection: 'Can you view your past clumsy beginnings with warmth and grace?',
        },
      ],
      jungianSynthesis:
        'The Wise Old Man bestows the lens of compassion. Every home you ever lived in is not a discarded past, but a layer of your inner cathedral.',
      integrationPractice:
        'Write a short letter of gratitude to one home or neighborhood you lived in as a child.',
      surrealistArtPrompt:
        'Surrealist masterpiece of an observatory in red desert dunes, spiraling tower of miniature glowing houses reaching into starlit space.',
      suggestedQuestions: [
        'What does the honey lens teach about self-forgiveness?',
        'How does Jung define the Wise Old Man archetype in dreams?',
      ],
    },
    chatMessages: [],
    status: 'ready',
  },
  {
    id: 'dream-sample-5',
    createdAt: new Date('2026-11-02T05:55:00-08:00').toISOString(),
    transcript:
      "I was running through a labyrinth made of mirrored hedges. Every time I turned a corner, a jester dressed in checkerboard velvet offered me a pair of scissors to cut my own shadow off. When I finally stopped running, the shadow turned out to be a frightened black panther cub shivering in the cold.",
    hasAudio: false,
    tags: ['#trickster', '#labyrinth', '#shadow-work', '#recurring'],
    image: {
      url: 'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=1600&q=80',
      size: '2K',
      aspectRatio: '1:1',
      prompt:
        'Surrealist painting in the style of René Magritte: a maze of tall mirror hedges reflecting dark night skies, a mischievous harlequin holding silver shears, and a tender black panther cub with luminescent amber eyes.',
    },
    analysis: {
      title: 'The Mirror Labyrinth & The Panther Shadow',
      emotionalCore: 'Confrontation with the Trickster and uncovering the tender vulnerability concealed within the Shadow.',
      atmosphere: 'Perplexing Reflection, Velvet Darkness, Playful Menace, Tender Revelation',
      archetypes: [
        {
          name: 'The Trickster',
          symbolicManifestation: 'The jester offering scissors to sever the shadow.',
          psychologicalMeaning:
            'The destabilizing psychic force that exposes ego absurdities—attempting to cut off one’s own shadow is the height of ego hubris.',
        },
        {
          name: 'The Shadow',
          symbolicManifestation: 'The shivering black panther cub.',
          psychologicalMeaning:
            'Repressed instinct and fierce power that, when disowned, appears terrifying, but at its root is a wounded instinct seeking safety and belonging.',
        },
      ],
      symbols: [
        {
          symbol: 'Mirrored Hedges',
          archetypalMeaning: 'Self-absorption and projection; seeing your own anxieties projected everywhere.',
          personalReflection: 'What qualities you dislike in others are actually mirrors of your disowned traits?',
        },
        {
          symbol: 'Severed Shadow with Scissors',
          archetypalMeaning: 'Psychic splitting and denial of instinctual vitality.',
          personalReflection: 'Where have you tried to edit yourself to look "harmless" at the expense of your inner strength?',
        },
      ],
      jungianSynthesis:
        'The Shadow is not evil; it is merely primitive, unadapted, and awkward. When you cease fleeing the black panther, you discover it is merely an exiled part of your own instinctual heart.',
      integrationPractice:
        'Place a hand over your heart and acknowledge one emotion you often feel ashamed of feeling (e.g., rage, ambition, envy). Welcome it as the cub.',
      surrealistArtPrompt:
        'Surrealist painting of mirrored hedge maze reflecting midnight moons, a velvet jester silhouette, a delicate black panther cub with glowing eyes.',
      suggestedQuestions: [
        'How does the Trickster guide us toward wholeness by playing tricks?',
        'How can I integrate the panther cub into my waking strength?',
      ],
    },
    chatMessages: [],
    status: 'ready',
  },
];
