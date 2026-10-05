import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Sparkles, ArrowRight, X, Film } from 'lucide-react';
import { AD_SCENES } from '../data/chocolates';

interface CinematicAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShopNow: () => void;
  inlineMode?: boolean;
}

export const CinematicAdExperience: React.FC<CinematicAdModalProps> = ({
  isOpen,
  onClose,
  onShopNow,
  inlineMode = false,
}) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const currentScene = AD_SCENES[currentSceneIndex];

  // Ambient luxury chord synthesizer using Web Audio API
  const startAmbientSoundtrack = () => {
    try {
      if (isMuted) return;
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.04, ctx.currentTime);
        masterGain.connect(ctx.destination);

        // Warm Fmaj9 ambient pad frequencies
        const freqs = [174.61, 220.0, 261.63, 329.63, 392.0];
        freqs.forEach((f) => {
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, ctx.currentTime);
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(600, ctx.currentTime);
          osc.connect(filter);
          filter.connect(masterGain);
          osc.start();
        });

        audioCtxRef.current = ctx;
        gainNodeRef.current = masterGain;
      } else if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    } catch {
      // Ignore audio errors if blocked by browser policy
    }
  };

  const stopAmbientSoundtrack = () => {
    try {
      if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
        audioCtxRef.current.suspend();
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    if (isOpen && !inlineMode) {
      setIsPlaying(true);
    }
    return () => {
      stopAmbientSoundtrack();
    };
  }, [isOpen, inlineMode]);

  useEffect(() => {
    if (isPlaying && !isMuted) {
      startAmbientSoundtrack();
    } else {
      stopAmbientSoundtrack();
    }
  }, [isPlaying, isMuted]);

  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = 50;
    const step = (intervalMs / currentScene.durationMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) {
          if (currentSceneIndex < AD_SCENES.length - 1) {
            setCurrentSceneIndex((idx) => idx + 1);
            return 0;
          } else {
            setIsPlaying(false);
            return 100;
          }
        }
        return prev + step;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, currentSceneIndex, currentScene.durationMs]);

  const handleSceneSelect = (index: number) => {
    setCurrentSceneIndex(index);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleRestart = () => {
    setCurrentSceneIndex(0);
    setProgress(0);
    setIsPlaying(true);
  };

  if (!isOpen && !inlineMode) return null;

  const isFinalScene = currentSceneIndex === AD_SCENES.length - 1;

  const playerContent = (
    <div className="relative w-full overflow-hidden rounded-2xl bg-[#120A07] text-[#FBF9F5] border border-[#C59B27]/25 shadow-2xl">
      {/* 16:9 Cinematic Viewport */}
      <div className="relative aspect-[16/9] min-h-[380px] sm:min-h-[460px] w-full overflow-hidden bg-[#0E0705]">
        {AD_SCENES.map((scene, idx) => {
          const isActive = idx === currentSceneIndex;
          return (
            <div
              key={scene.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={scene.image}
                alt={scene.title}
                referrerPolicy="no-referrer"
                className={`h-full w-full object-cover transition-transform duration-[6000ms] ease-out ${
                  isActive && isPlaying ? 'scale-105' : 'scale-100'
                }`}
              />
              {/* Measured Luxury Scrim for guaranteed 4.5:1 contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0705] via-[#0E0705]/55 to-[#0E0705]/25" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0E0705]/80 via-transparent to-transparent" />
            </div>
          );
        })}

        {/* Top Bar inside Film Frame */}
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3 text-xs tracking-widest uppercase text-[#E6D5B8]">
            <Film className="w-4 h-4 text-[#C59B27]" />
            <span>DESHAWN Campaign Film</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#C59B27] font-medium">{currentScene.label}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C110C]/80 hover:bg-[#1C110C] text-xs text-[#FBF9F5] border border-[#FBF9F5]/15 transition-colors cursor-pointer whitespace-nowrap"
              title={isMuted ? 'Unmute Ambient Score' : 'Mute Ambient Score'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-[#C59B27]" /> : <Volume2 className="w-3.5 h-3.5 text-[#C59B27]" />}
              <span className="hidden sm:inline">{isMuted ? 'Audio Off' : 'Ambient Score'}</span>
            </button>
            {!inlineMode && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg bg-[#1C110C]/80 hover:bg-[#1C110C] text-[#FBF9F5] border border-[#FBF9F5]/15 transition-colors cursor-pointer"
                aria-label="Close commercial"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Center/Bottom Narrative Content */}
        <div className="absolute inset-x-0 bottom-0 z-20 p-6 sm:p-10 md:p-12 flex flex-col justify-end">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs sm:text-sm tracking-widest uppercase text-[#C59B27] font-medium">
              {currentScene.caption}
            </p>
            <h3
              className="font-serif-display text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#FBF9F5] leading-[1.12]"
              style={{ textWrap: 'balance' }}
            >
              {currentScene.title}
            </h3>
            <p className="text-sm sm:text-base text-[#E5DEC9]/90 leading-relaxed max-w-xl">
              {currentScene.narration}
            </p>

            {/* Final Scene Brand Crest & Tagline CTA */}
            {isFinalScene && (
              <div className="pt-4 flex flex-wrap items-center gap-4 animate-fadeIn">
                <button
                  type="button"
                  onClick={() => {
                    stopAmbientSoundtrack();
                    onShopNow();
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#C59B27] hover:bg-[#b38b1f] text-[#120A07] font-semibold text-sm transition-all cursor-pointer whitespace-nowrap shadow-lg"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-xs tracking-widest uppercase text-[#E6D5B8]">
                  DESHAWN — Taste the Extraordinary.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Storyboard Scrubber & Controls */}
      <div className="bg-[#160D09] px-6 py-4 border-t border-[#FBF9F5]/10">
        {/* 6 Scene Progress Segments */}
        <div className="grid grid-cols-6 gap-2 mb-4">
          {AD_SCENES.map((scene, idx) => {
            const isCompleted = idx < currentSceneIndex;
            const isCurrent = idx === currentSceneIndex;
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => handleSceneSelect(idx)}
                className="group text-left focus:outline-none cursor-pointer"
              >
                <div className="h-1.5 w-full rounded-full bg-[#FBF9F5]/15 overflow-hidden mb-1.5">
                  <div
                    className="h-full bg-[#C59B27] transition-all duration-75"
                    style={{
                      width: isCompleted ? '100%' : isCurrent ? `${progress}%` : '0%',
                    }}
                  />
                </div>
                <span
                  className={`block text-[11px] truncate transition-colors ${
                    isCurrent ? 'text-[#C59B27] font-semibold' : 'text-[#A3968C] group-hover:text-[#FBF9F5]'
                  }`}
                >
                  0{scene.id}. {scene.label.split('·')[1]?.trim()}
                </span>
              </button>
            );
          })}
        </div>

        {/* Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FBF9F5]/10 hover:bg-[#FBF9F5]/15 text-[#FBF9F5] text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-[#C59B27]" /> : <Play className="w-3.5 h-3.5 text-[#C59B27]" />}
              <span>{isPlaying ? 'Pause Film' : 'Play Commercial'}</span>
            </button>
            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[#A3968C] hover:text-[#FBF9F5] text-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-[#A3968C] hidden md:inline">
              DESHAWN — Taste the Extraordinary.
            </span>
            <button
              type="button"
              onClick={() => {
                stopAmbientSoundtrack();
                onShopNow();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C59B27] hover:bg-[#b38b1f] text-[#120A07] text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Shop Chocolates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (inlineMode) {
    return playerContent;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-5xl">{playerContent}</div>
    </div>
  );
};
