import React, { useState } from 'react';
import { Palette, Sparkles, RefreshCw, Download, Check, X, Image as ImageIcon, Wand2, Layers, Compass } from 'lucide-react';

interface GeminiImageStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToCover: (imageUrl: string) => void;
  currentArticleTitle?: string;
  currentArticleCategory?: string;
}

const PRESET_STORIES = [
  {
    title: 'The Great Convergence: Autonomous Agents in Industry',
    category: 'Technology & AI',
    prompt: 'Allegorical Victorian broadsheet woodcut engraving of autonomous thinking machines, gears, and telegraphs transforming human labor.'
  },
  {
    title: 'Central Banks & Renewable Energy Deflation',
    category: 'Markets & Finance',
    prompt: 'Monochrome 19th-century newspaper engraving of the scales of commerce, merchant ledgers, and sunburst renewable power.'
  },
  {
    title: 'Neurological Architecture of Deep Focus',
    category: 'Culture & Ideas',
    prompt: 'Vintage broadsheet etching of a scholar in a Victorian library shielded from digital noise by classical stone arches.'
  },
  {
    title: 'Atmospheric Biosignatures on Exoplanet K2-18b',
    category: 'Science & Cosmos',
    prompt: 'Victorian celestial astrolabe and telescope revealing organic molecular spectra in distant stellar constellations.'
  },
  {
    title: 'The Geopolitical Silicon Perimeter',
    category: 'World & Geopolitics',
    prompt: 'Engraved broadsheet map of maritime trade routes, sovereign foundries, and crystalline silicon wafers.'
  }
];

const STYLES = [
  { id: 'woodcut', name: '19th-Century Woodcut', desc: 'Monochrome hatching and bold ink borders' },
  { id: 'copperplate', name: 'Copperplate Etching', desc: 'Fine microscopic cross-hatching and scrollwork' },
  { id: 'political', name: 'Fleet Street Editorial', desc: 'Allegorical figures of progress and statecraft' },
  { id: 'cartouche', name: 'Classical Cartouche', desc: 'Central ornamental medallion with laurel ribbons' }
];

export const GeminiImageStudioModal: React.FC<GeminiImageStudioModalProps> = ({
  isOpen,
  onClose,
  onApplyToCover,
  currentArticleTitle,
  currentArticleCategory
}) => {
  const [prompt, setPrompt] = useState<string>(
    currentArticleTitle
      ? `Allegorical broadsheet woodcut engraving for ${currentArticleTitle}. Key theme: ${currentArticleCategory || 'Frontier Intelligence'}.`
      : PRESET_STORIES[0].prompt
  );
  const [selectedStyle, setSelectedStyle] = useState<string>('woodcut');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '1:1' | '4:3'>('16:9');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationMeta, setGenerationMeta] = useState<{ model: string; provider: string; caption: string } | null>(null);
  const [applied, setApplied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (customPrompt?: string) => {
    const effectivePrompt = customPrompt || prompt;
    if (!effectivePrompt.trim()) return;

    setIsGenerating(true);
    setErrorMsg(null);
    setApplied(false);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${effectivePrompt} Style: ${selectedStyle}`,
          title: currentArticleTitle || 'Cover Dispatch',
          category: currentArticleCategory || 'Editorial',
          aspectRatio
        })
      });

      const data = await res.json();
      if (data.success && data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        setGenerationMeta({
          model: data.model || 'gemini-imagen-3',
          provider: data.provider || 'gemini-api',
          caption: data.caption || `Fig. 1: ${currentArticleTitle || 'Editorial Engraving'}`
        });
      } else {
        setErrorMsg(data.error || 'Image generation failed');
      }
    } catch (err: any) {
      console.error('Gemini image generation failed:', err);
      setErrorMsg(err.message || 'Network error communicating with Gemini API');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (!generatedImage) return;
    onApplyToCover(generatedImage);
    setApplied(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const a = document.createElement('a');
    a.href = generatedImage;
    a.download = `gemini-broadsheet-illustration-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: '920px', width: '95%' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Palette size={20} color="var(--accent-amber)" />
            <span style={{ fontFamily: 'var(--font-masthead)', fontWeight: 800, fontSize: '1.25rem' }}>
              Gemini API Image Studio : Broadsheet Engraving Suite
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '82vh', overflowY: 'auto' }}>
          <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
            Powered by the <strong>Google Gemini API</strong> (Imagen 3 and Gemini Flash vector synthesis). The Visual Art Director Agent (DaVinci-5) crafts authentic 19th-century Victorian newspaper broadsheet woodcuts with monochrome hatching, ornate borders, and allegorical symbols.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            {/* Left Controls */}
            <div>
              {/* Presets */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-amber)', display: 'block', marginBottom: '6px' }}>
                  Headline Prompts (Quick Select)
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {PRESET_STORIES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() => {
                        setPrompt(preset.prompt);
                        handleGenerate(preset.prompt);
                      }}
                      style={{ textAlign: 'left', fontSize: '11.5px', padding: '6px 10px', justifyContent: 'flex-start' }}
                    >
                      <Wand2 size={12} color="var(--accent-amber)" />
                      <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {preset.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Prompt */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-amber)', display: 'block', marginBottom: '6px' }}>
                  Engraving Prompt
                </label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Describe the editorial scene to engrave..."
                  style={{ width: '100%', fontSize: '12.5px', padding: '8px 10px', fontFamily: 'var(--font-ui)', lineHeight: 1.5 }}
                />
              </div>

              {/* Style selector */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-amber)', display: 'block', marginBottom: '6px' }}>
                  Engraving Technique
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                  {STYLES.map(style => (
                    <button
                      key={style.id}
                      type="button"
                      className={`btn btn-sm ${selectedStyle === style.id ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setSelectedStyle(style.id)}
                      style={{ padding: '6px 8px', fontSize: '11px', justifyContent: 'flex-start' }}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-amber)', display: 'block', marginBottom: '6px' }}>
                  Aspect Ratio
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(['16:9', '1:1', '4:3'] as const).map(ratio => (
                    <button
                      key={ratio}
                      type="button"
                      className={`btn btn-sm ${aspectRatio === ratio ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setAspectRatio(ratio)}
                      style={{ padding: '4px 12px', fontSize: '11px' }}
                    >
                      {ratio} {ratio === '16:9' ? '(Broadsheet Standard)' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleGenerate()}
                disabled={isGenerating}
                style={{ width: '100%', padding: '10px 16px', fontSize: '13px', fontWeight: 700 }}
              >
                <RefreshCw size={14} className={isGenerating ? 'audio-pulse' : ''} />
                {isGenerating ? 'Engraving with Gemini API...' : 'Generate with Gemini API'}
              </button>

              {errorMsg && (
                <div style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '4px', fontSize: '11.5px', color: 'var(--accent-rose)' }}>
                  {errorMsg}
                </div>
              )}
            </div>

            {/* Right Canvas Display */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-amber)', display: 'block', marginBottom: '6px' }}>
                Editorial Engraving Plate (Live Preview)
              </label>

              <div
                style={{
                  minHeight: '280px',
                  backgroundColor: '#f4efe6',
                  border: '2px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                {isGenerating ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <RefreshCw size={28} color="var(--accent-amber)" className="audio-pulse" style={{ marginBottom: '12px' }} />
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1c1917', marginBottom: '4px' }}>
                      Visual Art Director Agent (DaVinci-5) Engraving...
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#78350f', fontStyle: 'italic' }}>
                      Calling Google Gemini API • Synthesizing cross-hatching and broadsheet plate
                    </div>
                  </div>
                ) : generatedImage ? (
                  <div style={{ width: '100%' }}>
                    <img
                      src={generatedImage}
                      alt="Gemini generated woodcut"
                      style={{
                        width: '100%',
                        maxHeight: '280px',
                        objectFit: 'contain',
                        display: 'block',
                        borderRadius: '4px',
                        border: '1px solid #d6cdb8',
                        backgroundColor: '#f4efe6'
                      }}
                    />
                    {generationMeta && (
                      <div style={{ marginTop: '8px', fontSize: '11px', color: '#57534e', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                        <span>
                          <strong>{generationMeta.caption}</strong>
                        </span>
                        <span style={{ backgroundColor: '#e7dfcf', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>
                          Engine: {generationMeta.model} ({generationMeta.provider})
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#78716c' }}>
                    <ImageIcon size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#44403c' }}>
                      No Plate Engraved Yet
                    </div>
                    <div style={{ fontSize: '11.5px', marginTop: '4px' }}>
                      Select a headline prompt or type a custom description, then click "Generate with Gemini API".
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons for Generated Image */}
              {generatedImage && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleApply}
                    style={{ flex: '1 1 auto', fontSize: '12px', padding: '8px 12px' }}
                  >
                    {applied ? <Check size={13} /> : <Compass size={13} />}
                    {applied ? 'Applied to Front Page!' : 'Set as Front Page Cover Plate'}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleDownload}
                    title="Download SVG illustration"
                    style={{ padding: '8px 12px', fontSize: '12px' }}
                  >
                    <Download size={13} /> Download
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
