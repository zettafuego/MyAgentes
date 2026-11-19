import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  ListMusic,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { audio, type Track } from '../lib/audio';
import type { SuitTheme } from '../lib/theme';
import { themeText } from '../lib/theme';

interface Props {
  suitTheme: SuitTheme;
  isAudioMuted: boolean;
  onChangeAudioMuted: (muted: boolean) => void;
  /** Ocultar en primer persona / HUD */
  hidden?: boolean;
}

export function MusicPlayer({ suitTheme, isAudioMuted, onChangeAudioMuted, hidden }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(audio.getIsPlaying());
  const [trackIndex, setTrackIndex] = useState(audio.trackIndex);
  const [volume, setVolume] = useState(audio.volume);
  const [playlist, setPlaylist] = useState<Track[]>(audio.playlist);

  useEffect(() => {
    return audio.subscribe(() => {
      setPlaying(audio.getIsPlaying());
      setTrackIndex(audio.trackIndex);
      setVolume(audio.volume);
      setPlaylist([...audio.playlist]);
      onChangeAudioMuted(!audio.getIsPlaying());
    });
  }, [onChangeAudioMuted]);

  if (hidden) return null;

  const track = playlist[trackIndex] ?? playlist[0];
  const t = themeText(suitTheme);
  const accentBorder =
    suitTheme === 'punk' ? 'border-fuchsia-400/35 hover:border-fuchsia-400/55' : 'border-sky-400/30 hover:border-sky-400/50';
  const accentActive =
    suitTheme === 'punk' ? 'bg-fuchsia-500/15 text-fuchsia-200' : 'bg-sky-500/15 text-sky-200';

  const togglePlay = () => {
    audio.playClickTick();
    const now = audio.toggleAmbientHum();
    onChangeAudioMuted(!now);
  };

  const selectTrack = (i: number) => {
    audio.playClickTick();
    audio.playTrack(i);
    onChangeAudioMuted(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 pointer-events-auto select-none max-w-[min(360px,calc(100vw-3rem))]">
      <AnimatePresence mode="wait">
        {expanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className={`rounded-2xl border bg-black/80 backdrop-blur-xl shadow-2xl overflow-hidden ${accentBorder}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-b border-white/8">
              <div className="flex items-center gap-2 min-w-0">
                <ListMusic size={14} className={t} />
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/50 truncate">
                  Lista musical
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  audio.playClickTick();
                  setExpanded(false);
                }}
                className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                title="Minimizar"
              >
                <ChevronDown size={14} />
              </button>
            </div>

            {/* Now playing */}
            <div className="px-3 py-3 border-b border-white/5">
              <p className="font-mono text-[7px] uppercase tracking-widest text-white/35 mb-1">
                Sonando
              </p>
              <p className={`text-sm font-medium leading-snug truncate ${playing ? t : 'text-white/80'}`}>
                {track?.title ?? '—'}
              </p>
              <p className="font-mono text-[9px] text-white/40 mt-0.5 truncate">{track?.artist}</p>

              <div className="flex items-center justify-center gap-3 mt-3">
                <button
                  type="button"
                  onClick={() => {
                    audio.playClickTick();
                    audio.prevTrack();
                    onChangeAudioMuted(false);
                  }}
                  className="p-2 rounded-full text-white/55 hover:text-white hover:bg-white/5 transition-colors"
                  title="Anterior"
                >
                  <SkipBack size={16} />
                </button>
                <button
                  type="button"
                  onClick={togglePlay}
                  className={`p-3 rounded-full border transition-all ${
                    playing
                      ? suitTheme === 'punk'
                        ? 'border-fuchsia-400/50 bg-fuchsia-500/20 text-fuchsia-200'
                        : 'border-sky-400/40 bg-sky-500/20 text-sky-100'
                      : 'border-white/15 bg-white/5 text-white/80 hover:bg-white/10'
                  }`}
                  title={playing ? 'Pausar' : 'Reproducir'}
                >
                  {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audio.playClickTick();
                    audio.nextTrack();
                    onChangeAudioMuted(false);
                  }}
                  className="p-2 rounded-full text-white/55 hover:text-white hover:bg-white/5 transition-colors"
                  title="Siguiente"
                >
                  <SkipForward size={16} />
                </button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-2 mt-3 px-1">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="text-white/40 hover:text-white/70"
                  title={playing ? 'Silenciar' : 'Activar'}
                >
                  {playing ? <Volume2 size={12} /> : <VolumeX size={12} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    audio.setVolume(v);
                    setVolume(v);
                  }}
                  className="flex-1 h-1 accent-fuchsia-400 cursor-pointer"
                  aria-label="Volumen"
                />
                <span className="font-mono text-[8px] text-white/30 w-7 text-right">
                  {Math.round(volume * 100)}
                </span>
              </div>
            </div>

            {/* Track list */}
            <ul className="max-h-48 overflow-y-auto scrollbar-thin py-1">
              {playlist.map((item, i) => {
                const active = i === trackIndex;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => selectTrack(i)}
                      className={`w-full text-left px-3 py-2.5 flex items-start gap-2.5 transition-colors ${
                        active ? accentActive : 'hover:bg-white/5 text-white/70'
                      }`}
                    >
                      <span className="font-mono text-[9px] text-white/30 w-4 pt-0.5 shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block text-[11px] leading-snug truncate ${active ? 'font-semibold' : ''}`}>
                          {item.title}
                        </span>
                        <span className="block font-mono text-[8px] text-white/35 uppercase tracking-wide mt-0.5">
                          {item.artist}
                          {item.kind === 'mp3' ? ' · MP3' : ' · Synth'}
                        </span>
                      </span>
                      {active && playing && (
                        <span className={`shrink-0 pt-1 ${t}`}>
                          <span className="inline-flex gap-0.5 items-end h-3">
                            <span className="w-0.5 h-1.5 bg-current animate-pulse" />
                            <span className="w-0.5 h-2.5 bg-current animate-pulse [animation-delay:120ms]" />
                            <span className="w-0.5 h-2 bg-current animate-pulse [animation-delay:240ms]" />
                          </span>
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        ) : (
          <motion.div
            key="mini"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className={`flex items-center gap-2 rounded-full border bg-black/70 backdrop-blur-md shadow-xl pl-2 pr-1.5 py-1.5 ${accentBorder}`}
          >
            <button
              type="button"
              onClick={togglePlay}
              className={`p-2 rounded-full transition-colors ${
                playing
                  ? suitTheme === 'punk'
                    ? 'text-fuchsia-300'
                    : 'text-sky-300'
                  : 'text-white/50 hover:text-white'
              }`}
              title={playing ? 'Pausar' : 'Reproducir'}
            >
              {playing ? <Pause size={14} className="animate-pulse" /> : isAudioMuted ? <VolumeX size={14} /> : <Play size={14} />}
            </button>

            <button
              type="button"
              onClick={() => {
                audio.playClickTick();
                setExpanded(true);
              }}
              className="min-w-0 flex flex-col items-start text-left max-w-[160px] sm:max-w-[200px] py-0.5"
              title="Expandir lista musical"
            >
              <span className="font-mono text-[7px] uppercase tracking-[0.25em] text-white/35 leading-none mb-0.5">
                {playing ? 'En vivo' : 'Música'}
              </span>
              <span className="text-[10px] text-white/75 truncate w-full leading-tight">
                {track?.title ?? 'Lista'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                audio.playClickTick();
                setExpanded(true);
              }}
              className="p-2 rounded-full text-white/45 hover:text-white hover:bg-white/5 transition-colors"
              title="Lista / maximizar"
            >
              <ChevronUp size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
