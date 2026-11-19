import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Loader } from './components/Loader';
import { Scene3D } from './components/Scene3D';
import { UIOverlay, type PanelId } from './components/UIOverlay';
import { ChatPanel } from './components/ChatPanel';
import { ScrollReports } from './components/ScrollReports';
import { TattooGallery } from './components/TattooGallery';
import { InitModal } from './components/InitModal';
import { ChambaPopup } from './components/ChambaPopup';
import { HUDVisor } from './components/HUDVisor';
import { MusicPlayer } from './components/MusicPlayer';
import { audio } from './lib/audio';
import type { SuitTheme } from './lib/theme';
import { applyThemeToDocument, themeFab, themeScrollHint } from './lib/theme';
import { SCROLL_VOICE } from './data/portfolio';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [suitTheme, setSuitTheme] = useState<SuitTheme>('corp');
  /** Warp: objetivo por defecto 100X, sube progresivamente al entrar */
  const [warpSpeed, setWarpSpeed] = useState(1);
  const [warpUserLocked, setWarpUserLocked] = useState(false);
  const [audioMuted, setAudioMuted] = useState(true);
  const [firstPerson, setFirstPerson] = useState(false);
  const [tourStep, setTourStep] = useState<number | null>(null);
  const [spokenSections, setSpokenSections] = useState<Set<number>>(new Set());
  const [chambaOpen, setChambaOpen] = useState(false);
  const [chambaShown, setChambaShown] = useState(false);
  /** Rotación continua del astronauta sobre su eje Y */
  const [modelSpinning, setModelSpinning] = useState(false);

  useEffect(() => {
    applyThemeToDocument(suitTheme);
  }, [suitTheme]);

  // Warp por defecto 100: arranca bajo y sube progresivamente (~7s)
  useEffect(() => {
    if (loading || warpUserLocked) return;
    const from = 1;
    const to = 100;
    const durationMs = 7000;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / durationMs, 1);
      // ease-out: sube rápido al inicio y se estabiliza en 100
      const ease = 1 - Math.pow(1 - p, 2.2);
      setWarpSpeed(Math.max(1, Math.round(from + (to - from) * ease)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [loading, warpUserLocked]);

  // Aviso "Chambeador 3000" aparece un rato después de entrar (no al inicio)
  useEffect(() => {
    if (loading || tourStep === 0 || tourStep === null || chambaShown) return;
    const timer = window.setTimeout(() => {
      setChambaOpen(true);
      setChambaShown(true);
      audio.playClickTick();
    }, 14000); // ~14s después de entrar
    return () => window.clearTimeout(timer);
  }, [loading, tourStep, chambaShown]);

  useEffect(() => {
    let loopTimer: ReturnType<typeof setTimeout> | null = null;
    let looping = false;

    const onScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - window.innerHeight;

      if (vh > 0) {
        const section = Math.min(Math.floor((y + vh / 2) / vh), 4);
        if (section > 0 && !spokenSections.has(section) && !audioMuted) {
          setSpokenSections((s) => new Set(s).add(section));
          const text = SCROLL_VOICE[section];
          if (text && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.lang = 'es-ES';
            u.rate = 1.05;
            u.pitch = 1.1;
            u.volume = 0.65;
            window.speechSynthesis.speak(u);
          }
        }
      }

      if (!looping) {
        if (max > 0 && y >= max - 10) {
          if (!loopTimer) {
            loopTimer = setTimeout(() => {
              looping = true;
              audio.playClickTick();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setTimeout(() => {
                looping = false;
              }, 1800);
              loopTimer = null;
            }, 4000);
          }
        } else if (loopTimer) {
          clearTimeout(loopTimer);
          loopTimer = null;
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (loopTimer) clearTimeout(loopTimer);
    };
  }, [audioMuted, spokenSections]);

  const openPanel = (id: PanelId) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#050505] text-white select-none font-sans overflow-x-hidden animate-fade-in">
      <Loader
        onComplete={() => {
          setLoading(false);
          setTourStep(0);
        }}
      />

      {!loading && (
        <>
          <div className="fixed inset-0 pointer-events-none opacity-20 z-10">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-white" />
            <div className="absolute top-0 left-0 h-full w-[1px] bg-white" />
            <div className="absolute top-1/4 left-0 w-full h-[1px] bg-white/10" />
            <div className="absolute top-0 left-1/4 h-full w-[1px] bg-white/10" />
          </div>
          <div
            className={`fixed bottom-12 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent to-transparent z-10 pointer-events-none ${
              suitTheme === 'punk' ? 'via-fuchsia-500/50' : 'via-sky-400/40'
            }`}
          />

          <div className="fixed inset-0 z-0 pointer-events-none">
            <Scene3D
              onActivate={() => setChatOpen(true)}
              isThinking={thinking}
              suitTheme={suitTheme}
              warpSpeed={warpSpeed}
              isFirstPerson={firstPerson}
              modelSpinning={modelSpinning}
            />
          </div>

          <MusicPlayer
            suitTheme={suitTheme}
            isAudioMuted={audioMuted}
            onChangeAudioMuted={setAudioMuted}
            hidden={firstPerson}
          />

          {/* z-30: por encima del contenido scroll para que NEO-PUNK / CORPORATIVO y girar sigan clicables */}
          <div className="fixed inset-0 z-30 pointer-events-none">
            <UIOverlay
              onOpenPanel={openPanel}
              suitTheme={suitTheme}
              onChangeTheme={setSuitTheme}
              warpSpeed={warpSpeed}
              onChangeWarpSpeed={(n) => {
                setWarpUserLocked(true);
                setWarpSpeed(n);
              }}
              isFirstPerson={firstPerson}
              onChangeFirstPerson={setFirstPerson}
              modelSpinning={modelSpinning}
              onToggleModelSpin={() => setModelSpinning((v) => !v)}
              tourStep={tourStep}
              onNextStep={() => {
                audio.playClickTick();
                if (tourStep !== null && tourStep < 4) setTourStep(tourStep + 1);
                else setTourStep(-1);
              }}
              onSkipTour={() => {
                audio.playClickTick();
                setTourStep(-1);
              }}
            />

            <AnimatePresence>
              {!firstPerson && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: [0.3, 0.8, 0.3], y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 2.2 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-1"
                >
                  <span className="text-[7px] font-mono tracking-[0.4em] uppercase text-white/30 whitespace-nowrap">
                    Desliza · galería & CV
                  </span>
                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    className={`w-[1px] h-5 bg-gradient-to-b from-current to-transparent ${themeScrollHint(suitTheme)}`}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {!chatOpen && !firstPerson && (
                <motion.button
                  onClick={() => {
                    audio.playUplinkSweep();
                    setChatOpen(true);
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className={`absolute bottom-6 right-6 z-40 p-4 rounded-full border backdrop-blur-md bg-black/75 shadow-2xl pointer-events-auto flex items-center justify-center cursor-pointer group ${themeFab(suitTheme)}`}
                >
                  <MessageCircle size={18} className="animate-pulse" />
                  <span className="absolute right-full mr-3 bg-black/90 border border-white/10 rounded px-2 py-1 font-mono text-[7px] text-white/80 uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                    Preguntar / cita
                  </span>
                </motion.button>
              )}
            </AnimatePresence>

            <HUDVisor
              open={firstPerson}
              suitTheme={suitTheme}
              warpSpeed={warpSpeed}
              onExit={() => setFirstPerson(false)}
            />

            <ChatPanel
              isOpen={chatOpen}
              onClose={() => setChatOpen(false)}
              selectedTopic={null}
              onClearTopic={() => {}}
              onThinkingChange={setThinking}
              suitTheme={suitTheme}
            />
          </div>

          {/* Content scroll: hero spacer → gallery → CV sections
              pointer-events-none en el spacer: si no, bloquea clics del UI (tema, etc.) */}
          <div className="relative z-20">
            <div className="h-screen pointer-events-none" aria-hidden />
            <div className="pointer-events-auto">
              <TattooGallery suitTheme={suitTheme} />
              <ScrollReports suitTheme={suitTheme} />
            </div>
          </div>

          <InitModal
            open={tourStep === 0}
            onInit={() => {
              setAudioMuted(false);
              setTourStep(1);
            }}
          />

          <ChambaPopup
            open={chambaOpen && !firstPerson}
            onClose={() => setChambaOpen(false)}
            suitTheme={suitTheme}
          />
        </>
      )}
    </div>
  );
}
