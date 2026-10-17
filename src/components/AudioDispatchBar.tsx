import React, { useState, useEffect } from 'react';
import { PaperEdition, ReaderProfile } from '../types';
import { AudioNarrator } from '../utils/audioNarrator';
import { Volume2, Play, Pause, Square, FastForward } from 'lucide-react';

interface AudioDispatchBarProps {
  edition: PaperEdition;
  profile: ReaderProfile;
}

export const AudioDispatchBar: React.FC<AudioDispatchBarProps> = ({ edition, profile }) => {
  const [audioState, setAudioState] = useState<{ isPlaying: boolean; isPaused: boolean; progressText: string }>({
    isPlaying: false,
    isPaused: false,
    progressText: ''
  });
  const [speed, setSpeed] = useState<number>(1.0);

  useEffect(() => {
    const unsubscribe = AudioNarrator.subscribe(state => {
      setAudioState(state);
    });
    return () => {
      unsubscribe();
      AudioNarrator.stop();
    };
  }, []);

  const handleTogglePlay = () => {
    if (!audioState.isPlaying) {
      AudioNarrator.play(edition, profile.name);
    } else if (audioState.isPaused) {
      AudioNarrator.resume();
    } else {
      AudioNarrator.pause();
    }
  };

  const handleStop = () => {
    AudioNarrator.stop();
  };

  const cycleSpeed = () => {
    const nextSpeed = speed === 1.0 ? 1.25 : speed === 1.25 ? 1.5 : 1.0;
    setSpeed(nextSpeed);
    AudioNarrator.setRate(nextSpeed);
  };

  return (
    <div className="modern-audio-bar">
      <div className="audio-bar-left">
        <span className="audio-icon-badge">
          <Volume2 size={15} />
        </span>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-amber)' }}>
            Daily Spoken Digest {audioState.isPlaying && <span className="audio-pulse" />}
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {audioState.isPlaying ? (
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                {audioState.progressText}
              </span>
            ) : (
              'Listen to an AI-curated spoken audio briefing of today\'s top stories'
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          className={`btn btn-sm ${audioState.isPlaying && !audioState.isPaused ? 'btn-primary' : 'btn-outline'}`}
          onClick={handleTogglePlay}
        >
          {audioState.isPlaying && !audioState.isPaused ? (
            <>
              <Pause size={12} /> Pause
            </>
          ) : (
            <>
              <Play size={12} /> {audioState.isPaused ? 'Resume' : 'Listen Now'}
            </>
          )}
        </button>

        {audioState.isPlaying && (
          <button className="btn btn-sm btn-outline" onClick={handleStop} title="Stop Audio">
            <Square size={12} />
          </button>
        )}

        <button
          className="btn btn-sm btn-outline"
          onClick={cycleSpeed}
          title="Adjust Playback Speed"
        >
          <FastForward size={12} /> {speed}x
        </button>
      </div>
    </div>
  );
};

