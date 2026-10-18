/**
 * Authentic 19th-Century Broadsheet Woodcut & Engraving Library
 * Generates Victorian-era monochrome ink etchings with cross-hatching,
 * framing borders, and thematic allegories for newspaper lead articles.
 */

export interface WoodcutConfig {
  title: string;
  category: string;
  theme?: string;
  seed?: number;
}

export function generateBroadsheetWoodcutSvg(config: WoodcutConfig): string {
  const { title, category } = config;
  const escapedTitle = (title || 'Daily Dispatch')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .slice(0, 52);

  const catLower = (category || '').toLowerCase();

  // Motif determination based on beat
  let motifIcon = '';
  let motifCaption = 'Allegorical Vignette of the Day';

  if (catLower.includes('tech') || catLower.includes('ai') || catLower.includes('agent')) {
    motifCaption = 'The Mechanical Mind & Telegraphic Apparatus';
    motifIcon = `
      <!-- Gears & Telegraph apparatus -->
      <g stroke="#1c1917" stroke-width="2.5" fill="none">
        <circle cx="400" cy="205" r="54" stroke-dasharray="6,4" />
        <circle cx="400" cy="205" r="38" stroke-width="3" />
        <circle cx="400" cy="205" r="14" fill="#1c1917" />
        <!-- Cog teeth -->
        ${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => `
          <line x1="400" y1="205" x2="${400 + Math.cos(deg * Math.PI / 180) * 64}" y2="${205 + Math.sin(deg * Math.PI / 180) * 64}" stroke-width="4" />
        `).join('')}
        <!-- Interlocking pinion -->
        <circle cx="475" cy="235" r="30" stroke-dasharray="4,3" />
        <circle cx="475" cy="235" r="10" fill="#1c1917" />
        <circle cx="325" cy="235" r="30" stroke-dasharray="4,3" />
        <circle cx="325" cy="235" r="10" fill="#1c1917" />
        <!-- Telegraph lightning rays -->
        <path d="M 360 140 L 375 160 L 395 155 L 400 130 L 415 155 L 435 150 L 450 170" stroke="#78350f" stroke-width="2" />
        <path d="M 280 180 L 320 200 M 480 200 L 520 180" stroke="#78350f" stroke-dasharray="3,3" />
      </g>
    `;
  } else if (catLower.includes('financ') || catLower.includes('econom') || catLower.includes('market')) {
    motifCaption = 'The Scales of Commerce & Merchant Ledger';
    motifIcon = `
      <!-- Scales of commerce -->
      <g stroke="#1c1917" stroke-width="2.5" fill="none">
        <line x1="400" y1="120" x2="400" y2="280" stroke-width="5" />
        <line x1="320" y1="150" x2="480" y2="150" stroke-width="4" />
        <!-- Left Pan -->
        <path d="M 320 150 L 290 220 L 350 220 Z" stroke-width="2" />
        <path d="M 280 220 Q 320 245 360 220 Z" fill="#292524" />
        <!-- Right Pan -->
        <path d="M 480 150 L 450 220 L 510 220 Z" stroke-width="2" />
        <path d="M 440 220 Q 480 245 520 220 Z" fill="#292524" />
        <!-- Pedestal base -->
        <path d="M 350 280 L 450 280 L 470 295 L 330 295 Z" fill="#1c1917" />
      </g>
    `;
  } else if (catLower.includes('sci') || catLower.includes('space') || catLower.includes('health')) {
    motifCaption = 'The Armillary Sphere & Celestial Astrolabe';
    motifIcon = `
      <!-- Celestial Astrolabe -->
      <g stroke="#1c1917" stroke-width="2.5" fill="none">
        <circle cx="400" cy="205" r="60" stroke-width="3" />
        <ellipse cx="400" cy="205" rx="60" ry="24" transform="rotate(-25 400 205)" stroke-dasharray="5,3" />
        <ellipse cx="400" cy="205" rx="60" ry="24" transform="rotate(25 400 205)" stroke-dasharray="5,3" />
        <circle cx="400" cy="205" r="16" fill="#78350f" />
        <!-- Sun rays -->
        ${[0, 45, 90, 135, 180, 225, 270, 315].map(deg => `
          <line x1="${400 + Math.cos(deg * Math.PI / 180) * 65}" y1="${205 + Math.sin(deg * Math.PI / 180) * 65}" x2="${400 + Math.cos(deg * Math.PI / 180) * 82}" y2="${205 + Math.sin(deg * Math.PI / 180) * 82}" stroke="#1c1917" stroke-width="2" />
        `).join('')}
      </g>
    `;
  } else {
    motifCaption = 'The Gutenberg Press & Chronicle Broadsheet';
    motifIcon = `
      <!-- Broadsheet Printing Press -->
      <g stroke="#1c1917" stroke-width="2.5" fill="none">
        <rect x="340" y="130" width="120" height="150" stroke-width="4" />
        <line x1="340" y1="170" x2="460" y2="170" stroke-width="3" />
        <line x1="340" y1="210" x2="460" y2="210" stroke-width="2" stroke-dasharray="4,4" />
        <line x1="340" y1="240" x2="460" y2="240" stroke-width="2" stroke-dasharray="4,4" />
        <circle cx="400" cy="115" r="12" fill="#1c1917" />
        <line x1="400" y1="127" x2="400" y2="170" stroke-width="6" />
        <!-- Screw spindle lever -->
        <line x1="320" y1="120" x2="480" y2="120" stroke-width="5" />
        <circle cx="320" cy="120" r="6" fill="#78350f" />
        <circle cx="480" cy="120" r="6" fill="#78350f" />
      </g>
    `;
  }

  // Cross-hatching shading lines in background
  const hatchingLines = [];
  for (let x = 60; x <= 740; x += 18) {
    hatchingLines.push(`<line x1="${x}" y1="50" x2="${x + 40}" y2="350" stroke="#d6cdb8" stroke-width="0.8" opacity="0.6"/>`);
  }
  for (let x = 740; x >= 60; x -= 24) {
    hatchingLines.push(`<line x1="${x}" y1="50" x2="${x - 30}" y2="350" stroke="#e7dfcf" stroke-width="0.6" opacity="0.4"/>`);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 420" width="100%" height="auto" style="background:#f4efe6; font-family:'Playfair Display', Georgia, serif;">
  <defs>
    <!-- Paper texture & engraved plate gradient -->
    <linearGradient id="agedPaper" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f7f2e7" />
      <stop offset="50%" stop-color="#f2ebd9" />
      <stop offset="100%" stop-color="#ebe2cd" />
    </linearGradient>
    <pattern id="hatchPattern" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="12" stroke="#292524" stroke-width="0.6" opacity="0.15" />
    </pattern>
  </defs>

  <!-- Parchment Plate Background -->
  <rect x="0" y="0" width="800" height="420" fill="url(#agedPaper)" />
  <rect x="15" y="15" width="770" height="390" fill="url(#hatchPattern)" />

  <!-- Victorian Engraver Framing Borders -->
  <rect x="18" y="18" width="764" height="384" fill="none" stroke="#1c1917" stroke-width="3" />
  <rect x="24" y="24" width="752" height="372" fill="none" stroke="#78350f" stroke-width="1" stroke-dasharray="6,3" />
  <rect x="28" y="28" width="744" height="364" fill="none" stroke="#1c1917" stroke-width="0.8" />

  <!-- Corner Rosettes -->
  <g fill="#1c1917">
    <rect x="20" y="20" width="8" height="8" />
    <rect x="772" y="20" width="8" height="8" />
    <rect x="20" y="392" width="8" height="8" />
    <rect x="772" y="392" width="8" height="8" />
  </g>

  <!-- Background Cross-Hatching -->
  <g>${hatchingLines.join('')}</g>

  <!-- Header Banner Ribbon -->
  <g>
    <path d="M 180 44 L 620 44 L 600 66 L 620 88 L 180 88 L 200 66 Z" fill="#1c1917" />
    <text x="400" y="68" text-anchor="middle" font-size="12" font-weight="700" fill="#f5efe6" letter-spacing="3" text-transform="uppercase" font-family="'Cinzel', Georgia, serif">
      JIMMY MORNING CHRONICLE • EDITORIAL ENGRAVING
    </text>
  </g>

  <!-- Central Illustrated Archway / Medallion -->
  <ellipse cx="400" cy="205" rx="190" ry="105" fill="#f9f6ee" stroke="#1c1917" stroke-width="3" />
  <ellipse cx="400" cy="205" rx="180" ry="98" fill="none" stroke="#78350f" stroke-width="1.2" stroke-dasharray="4,3" />

  <!-- Central Thematic Motif -->
  ${motifIcon}

  <!-- Sunburst Vignette Radiants -->
  <g stroke="#1c1917" stroke-width="1" opacity="0.35">
    <line x1="210" y1="205" x2="140" y2="205" stroke-dasharray="3,3" />
    <line x1="590" y1="205" x2="660" y2="205" stroke-dasharray="3,3" />
    <line x1="400" y1="100" x2="400" y2="88" stroke-dasharray="2,2" />
    <line x1="400" y1="310" x2="400" y2="330" stroke-dasharray="2,2" />
  </g>

  <!-- Bottom Cartouche for Figure Label & Caption -->
  <rect x="100" y="332" width="600" height="52" fill="#fdfcf8" stroke="#1c1917" stroke-width="2" />
  <line x1="104" y1="336" x2="696" y2="336" stroke="#78350f" stroke-width="0.8" />

  <text x="400" y="352" text-anchor="middle" font-size="11.5" font-weight="bold" fill="#1c1917" font-family="'Cinzel', Georgia, serif" letter-spacing="1">
    FIG. 1: ${escapedTitle.toUpperCase()}
  </text>
  <text x="400" y="371" text-anchor="middle" font-size="10.5" font-style="italic" fill="#57534e">
    ${motifCaption} • Art Directed by Gemini AI
  </text>
</svg>`;
}

export function svgToDataUrl(svgString: string): string {
  if (typeof Buffer !== 'undefined') {
    const base64 = Buffer.from(svgString).toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
  }
  // Browser fallback
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}
