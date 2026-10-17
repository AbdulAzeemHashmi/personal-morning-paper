import { Article, CoffeeBreakItem, ChiefEditorNote } from '../types';

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'The Great Convergence: Autonomous Agents Rewrite Knowledge Work and Economic Velocity',
    subhead: 'From static code repositories to self-evolving research architectures, intelligence infrastructure shifts from tool to collaborator.',
    author: 'Elena Vance, Senior Technology Editor',
    outlet: 'MIT Technology Review & The Economist',
    outletUrl: 'https://www.technologyreview.com',
    publishedAt: '2026-10-17T06:00:00Z',
    category: 'Technology & AI',
    tags: ['Agentic AI', 'LLMs', 'Future of Work', 'Automation', 'Autonomous Systems'],
    readingMinutes: 4,
    leadParagraph: 'A profound structural transformation is quietly taking hold across modern software laboratories and cognitive industries. Autonomous multi-agent swarms—once confined to experimental whitepapers—are now actively orchestrating complex scientific pipelines, refactoring enterprise architectures, and authoring rigorous empirical literature without direct human micro-management.',
    fullBody: [
      'The turning point arrived not with larger parameter counts, but with adaptive feedback topology. By combining persistent state graphs, deterministic tool verification, and asynchronous self-correction loops, contemporary autonomous agents bypass the hallucinations that plagued earlier conversational generative systems.',
      'In economic terms, the friction between ideation and functional execution is collapsing towards zero. A single engineer today oversees an ensemble of specialized subagents: one verifying formal type proofs, another stress-testing edge scenarios, and a third synthesizing documentation.',
      'Yet this speed introduces unprecedented governance questions. When synthetic intelligences author proprietary codebases and formulate corporate policy drafts in fractions of a second, who bears institutional accountability when systemic errors cascade across interconnected financial or logistical grids?',
      'The consensus among leading computer scientists and institutional leaders is clear: the winning institutions of the coming decade will not simply hire more human talent or deploy raw compute; they will master the editorial curation of synthetic swarms.'
    ],
    pullQuote: 'The friction between human ideation and functional execution is collapsing toward zero. We are no longer writing code; we are conducting orchestras of synthetic thought.',
    isLeadStory: true,
    nuancePerspective: {
      label1: 'Technological Optimism',
      view1: 'Autonomous agents eliminate tedious bureaucratic grind, enabling small teams to achieve the output and research rigor previously reserved for sovereign laboratories.',
      label2: 'Economic Realignment',
      view2: 'White-collar labor markets face unprecedented compression; value shifts decisively from rote execution to taste, judgment, and high-level architectural steering.',
      label3: 'Systemic Vulnerability',
      view3: 'Interdependent autonomous loops create emergent failure modes that human operators may neither anticipate nor decipher in real-time crises.'
    }
  },
  {
    id: 'art-2',
    title: 'Central Banks Navigate the Post-Inflationary Equilibrium as Clean Energy Deflation Takes Root',
    subhead: 'As solar and battery deployment outpaces sovereign forecasts, energy-driven marginal costs drop, unsettling traditional interest rate models.',
    author: 'Julian Sterling, Global Economics Bureau',
    outlet: 'Financial Times',
    outletUrl: 'https://www.ft.com',
    publishedAt: '2026-10-17T05:30:00Z',
    category: 'Markets & Finance',
    tags: ['Central Banks', 'Macroeconomics', 'Renewable Energy', 'Deflation', 'Markets'],
    readingMinutes: 3,
    leadParagraph: 'Global central banks are facing an unexpected conceptual challenge: the arrival of sustained, structural disinflation born not from economic recession, but from the exponential scaling of decentralized renewable power grids and advanced battery storage.',
    fullBody: [
      'For decades, standard monetary dogma assumed energy was an erratic inflationary shock variable. Today, however, industrial manufacturing hubs across Europe and Asia are recording historic drops in daytime wholesale electricity prices.',
      'Surplus midday generation has stimulated localized hydrogen cracking and electrified metallurgy, structurally lowering input expenses for heavy industries.',
      'Central bankers in Zurich and Frankfurt acknowledge that orthodox Phillips-curve assumptions are faltering. If essential power costs trend asymptotically toward maintenance expenditure, historical inflation targets may require fundamental recalibration.'
    ],
    pullQuote: 'When energy shifts from an extractive commodity to a technology cost curve, the historical rules of monetary tightening break down.',
    nuancePerspective: {
      label1: 'Industrial Competitiveness',
      view1: 'Rapidly cheapening daytime power provides massive competitive tailwinds to domestic high-precision manufacturing and data centers.',
      label2: 'Grid Capital Constraints',
      view2: 'While generation costs plunge, distribution transmission infrastructure demands multi-trillion dollar capital expenditure that taxpayers must absorb.',
      label3: 'Monetary Dilemma',
      view3: 'Central banks risk over-tightening if they misdiagnose technology-induced price drops as cyclical demand contractions.'
    }
  },
  {
    id: 'art-3',
    title: 'The Neurological Architecture of Deep Focus: Why Digital Quiet Is the Ultimate Luxury',
    subhead: 'Cognitive neuroscientists demonstrate that intentional reading rituals restore synaptic plasticity degraded by fragmented algorithmic feeds.',
    author: 'Dr. Clara Thorne, Institute of Cognitive Studies',
    outlet: 'Nature Neuroscience & The Atlantic',
    outletUrl: 'https://www.theatlantic.com',
    publishedAt: '2026-10-17T04:45:00Z',
    category: 'Culture & Ideas',
    tags: ['Neuroscience', 'Focus', 'Digital Minimalism', 'Mindfulness', 'Deep Work'],
    readingMinutes: 3,
    leadParagraph: 'In an attention economy engineered to reward twitch reflexes and continuous partial awareness, sustained cognitive immersion has ceased to be merely an intellectual habit—it has become the rarest biological luxury of modern civilization.',
    fullBody: [
      'Recent functional neuroimaging investigations reveal that rapid context switching across endless short-form feeds induces chronic micro-spikes of cortisol while down-regulating deep prefrontal dendritic connectivity.',
      'Conversely, engaging with structured, bounded morning publications—where content has a definitive start and conclusion—catalyzes alpha-band neural coherence and enhances episodic memory consolidation.',
      'The modern ritual of the "morning paper," whether ink or minimalist broadsheet typography, provides a psychological fortress against the ceaseless assault of ephemeral algorithmic stimulation.'
    ],
    pullQuote: 'A publication with a definitive end restores the human mind. The infinite scroll was an evolutionary mistake; the morning broadsheet is its antidote.'
  },
  {
    id: 'art-4',
    title: 'James Webb and Ground Observatories Detect Atmospheric Biosignature Candidates on K2-18b',
    subhead: 'Spectroscopic absorption spikes in sulfur compounds offer tantalizing glimpses into exoplanetary ocean chemistry.',
    author: 'Marcus Aurel, Astrophysical Sciences',
    outlet: 'Nature & Quanta Magazine',
    outletUrl: 'https://www.quantamagazine.org',
    publishedAt: '2026-10-17T03:15:00Z',
    category: 'Science & Cosmos',
    tags: ['Astrophysics', 'James Webb', 'Exoplanets', 'Space Exploration', 'Origin of Life'],
    readingMinutes: 4,
    leadParagraph: 'Astronomers peering into the atmospheric envelope of sub-Neptune exoplanet K2-18b, situated 120 light-years away in the constellation Leo, have verified persistent spectroscopic signals indicative of volatile sulfur-bearing photochemistry.',
    fullBody: [
      'The detected transmission spectra reveal unambiguous absorption bands corresponding to methane and carbon dioxide, alongside secondary signatures that terrestrial atmospheric models attribute predominantly to marine microbial metabolism.',
      'While astrophysicists urge rigorous caution against premature claims of extraterrestrial biological activity, the consistency of independent observations across both orbital and high-altitude Andean instruments marks a watershed moment in observational astrobiology.',
      'Further deep integration observations scheduled over the next celestial quarter will seek to definitively rule out abiotic geochemical pathways.'
    ],
    pullQuote: 'We stand on the exact precipice where speculative philosophy turns into hard, empirical spectroscopic data.'
  },
  {
    id: 'art-5',
    title: 'The Geopolitical Re-shoring of the Silicon Perimeter: A New Era of Sovereign Supply Chains',
    subhead: 'From advanced lithography in Dresden to packaging hubs in Phoenix, sovereign states subsidize domestic semiconductor independence.',
    author: 'Tariq Mansoor, International Security Fellow',
    outlet: 'Foreign Affairs',
    outletUrl: 'https://www.foreignaffairs.com',
    publishedAt: '2026-10-17T05:00:00Z',
    category: 'World & Geopolitics',
    tags: ['Geopolitics', 'Semiconductors', 'Supply Chains', 'Industrial Policy', 'Trade'],
    readingMinutes: 3,
    leadParagraph: 'The globalization of high-technology hardware is undergoing its most radical reversal since the Bretton Woods era. Nations are no longer prioritizing nominal cost efficiency over strategic resilience; the silicon wafer has become the modern garrison.',
    fullBody: [
      'Massive industrial subsidies under European and American national security initiatives are yielding operational 2-nanometer and advanced GAA (Gate-All-Around) fabrication plants across continental hubs.',
      'However, industry executives warn that geographic redundancy carries severe capital inefficiencies, potentially bifurcating software standards and raising consumer hardware unit costs across the globe.',
      'The battleground is now shifting from raw fabrication capacity toward extreme ultraviolet lithography optics and ultra-pure chemical supply chains.'
    ]
  },
  {
    id: 'art-6',
    title: 'Cellular Reprogramming Reaches Clinical Human Trials for Age-Related Macular Recovery',
    subhead: 'Transient expression of partial Yamanaka factors demonstrates localized tissue rejuvenation without oncogenic transformation.',
    author: 'Dr. Evelyn Chen, Translational Medicine',
    outlet: 'Science Translational Medicine',
    outletUrl: 'https://www.science.org',
    publishedAt: '2026-10-17T02:30:00Z',
    category: 'Health & Longevity',
    tags: ['Longevity', 'Cellular Reprogramming', 'Biotech', 'Genomics', 'Medicine'],
    readingMinutes: 3,
    leadParagraph: 'In an unprecedented clinical milestone, medical researchers have administered targeted partial epigenetic reprogramming vectors directly into the retinal cells of patients experiencing degenerative macular atrophy.',
    fullBody: [
      'Early phase-one data demonstrates noticeable restoration of synaptic integrity and functional visual acuity without inducing genomic instability or cellular dedifferentiation.',
      'By pulsing epigenetic reset factors for carefully calibrated durations, scientists effectively reset mitochondrial clock markers while preserving cellular somatic identity.',
      'If validated in broader cohort trials, the technique could unlock systemic therapies for degenerative organ ailments previously deemed irreversible by medical science.'
    ]
  },
  {
    id: 'art-7',
    title: 'Solid-State Battery Breakthrough Unlocks 1,000-Kilometer Electric Range in Extreme Cold',
    subhead: 'Ceramic-sulfide hybrid electrolytes eliminate thermal dendrite propagation across sub-zero Scandinavian testing grounds.',
    author: 'Henrik Lindqvist, Automotive Tech Desk',
    outlet: 'Wired & Bloomberg Green',
    outletUrl: 'https://www.bloomberg.com',
    publishedAt: '2026-10-17T06:15:00Z',
    category: 'Climate & Energy',
    tags: ['EVs', 'Clean Energy', 'Batteries', 'Materials Science', 'Climate Tech'],
    readingMinutes: 3,
    leadParagraph: 'A joint automotive-academic consortium has unveiled commercial prototype solid-state cells capable of retaining 92% of operational capacity at temperatures plunging below -25°C.',
    fullBody: [
      'The breakthrough resolves the decades-long dilemma of low-temperature lithium mobility through an engineered crystalline ceramic matrix that accelerates ion transport under severe freezing conditions.',
      'Automotive manufacturers project initial assembly line integration within eighteen months, potentially erasing the last remaining consumer friction points in sub-Arctic and North American winter climates.',
      'Crucially, the cells eschew cobalt and nickel in favor of abundant iron-silicate compounds, substantially mitigating geopolitical extraction pressures.'
    ]
  },
  {
    id: 'art-8',
    title: 'The Revival of Classical Architecture in Urban Renewal: The Rebirth of Civic Dignity',
    subhead: 'City planners and civic theorists reject brutalist anonymity in favor of human-scale stone arches, colonnades, and public courtyards.',
    author: 'Arthur Pendelton, Architectural Critic',
    outlet: 'The Architectural Review',
    outletUrl: 'https://www.architectural-review.com',
    publishedAt: '2026-10-17T01:00:00Z',
    category: 'Culture & Ideas',
    tags: ['Architecture', 'Urban Design', 'Civic Beauty', 'Philosophy', 'Cities'],
    readingMinutes: 2,
    leadParagraph: 'Across European and North American metropolitan corridors, a quiet rebellion against sterile glass-and-steel monoliths is gathering formidable institutional momentum.',
    fullBody: [
      'New public library additions, civic squares, and municipal courts are turning back to proportioned masonry, hand-carved stone friezes, and acoustically insulated loggias designed to foster quiet reflection.',
      'Psychological assessments demonstrate that citizens residing near architecturally harmonious civic structures report significantly lower baseline anxiety and higher rates of democratic community participation.'
    ]
  }
];

export const MOCK_CHIEF_EDITOR_NOTE: ChiefEditorNote = {
  headline: 'The Dawn of Deliberate Speed: On Agency, Energy, and Focus',
  keyTheme: 'Technological acceleration colliding with human cognitive restoration',
  narrative: 'Good morning. Across today\'s dispatches, an unexpected convergence emerges. While autonomous synthetic agents shatter historic bottlenecks in engineering and research, human society is rediscovering an acute hunger for boundary and quietude. Simultaneously, the physical bedrock of civilization—our energy grids, silicon supply lines, and cellular biology—is transitioning from fragile extraction to deterministic technology curves. Today\'s morning paper is curated to sharpen your perspective at the intersection of these tectonic forces.',
  signoff: 'From the Editor\'s Desk — Veritas, Gravitas et Lux.'
};

export const MOCK_COFFEE_BREAK: CoffeeBreakItem = {
  riddle: 'I can build worlds in silicon without hands, conquer grandmasters without pride, and draft treaties without a heart. When you give me constraints, I soar; when you give me silence, I cease. What am I?',
  clue: 'Look to today\'s front-page lead story.',
  answer: 'An Autonomous AI Agent / Algorithm.',
  factOfTheDay: 'The very first printed morning newspaper in the modern English tradition was The Daily Courant, launched on March 11, 1702, on Fleet Street in London. It consisted of a single page containing news from foreign gazettes, prized by merchants for its factual brevity over gossip.',
  wordOfDay: {
    word: 'Apricity',
    definition: 'The warmth of the sun in winter; a delightful warmth amidst chilling conditions.',
    origin: 'From the Latin apricari, meaning "to bask in the sun".'
  }
};

export const AVAILABLE_CATEGORIES = [
  'Technology & AI',
  'Markets & Finance',
  'World & Geopolitics',
  'Science & Cosmos',
  'Climate & Energy',
  'Culture & Ideas',
  'Health & Longevity'
];

export const SUGGESTED_KEYWORDS = [
  'Agentic AI',
  'LLMs',
  'Semiconductors',
  'Macroeconomics',
  'Renewable Energy',
  'Longevity',
  'Astrophysics',
  'Digital Minimalism',
  'Quantum Computing',
  'Venture Capital',
  'Biotech'
];
