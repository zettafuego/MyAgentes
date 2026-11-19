import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Volume2, VolumeX, RotateCcw, X, Terminal, Send, Loader2 } from 'lucide-react';
import { audio } from '../lib/audio';
import type { SuitTheme } from '../lib/theme';
import { themeBg, themeBgStrong, themePanel, themeText } from '../lib/theme';
import type { TopicId } from '../data/agents';

interface Msg {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
}

const INIT_MSG =
  'Hola. Soy el asistente del portafolio de **Eduardo Sanchez (Zettafuego)**. Puedo contarte sobre sus **10 años tatuando**, su experiencia en **SSOMA / ingeniería**, skills tech o cómo **agendar una cita**. ¿Qué te interesa?';

const LOCAL_REPLIES: Record<string, string> = {
  SoporteEmpresarial:
    '**Citas de tatuaje**\n\nEduardo lleva **10 años tatuando** (línea fina, neotradicional y color). Revisa la galería al hacer scroll.\n\nPara agendar: **977 740 994** o **eduardoxstrange@gmail.com** (Lima, Perú).\n\nCuéntame estilo, zona del cuerpo y tamaño aproximado.',
  OperacionesBackoffice:
    '**Experiencia profesional**\n\nEduardo lidera SSOMA, permisología e innovación tech:\n\n- Coordinador Técnico en Sinba Sura (SSOMA + apps + dashboards)\n- Minería subterránea y HVAC en retail\n- Innovación en Waffles Tech (Unity, Scrum)\n\nDescarga el **CV 2026** desde el botón del portafolio.',
  AnalisisDecision:
    '**Skills & formación**\n\n- Tech: Python, React, JS, Kotlin, Unity, Blender, OpenCV, IA\n- SSOMA: ISO 9001/14001/45001, PETS, IPERC, alto riesgo\n- Arte: Bellas Artes (pintura), **10 años de tatuaje**\n- Maestría en IA (en curso) + Ingeniería de Minas (UNC)',
  DesarrolloDevOps:
    '**Contacto**\n\n- Email: eduardoxstrange@gmail.com\n- Tel: 977 740 994\n- Lima, Perú — Jr. Tellería 1365 Dpto. 101\n- Alias artístico: **Zettafuego**\n\nTambién puedes descargar `EduardoSanchezCV2026.pdf` desde la web.',
};

function InlineCode({ text }: { text: string }) {
  return text.split(/(`.*?`)/g).map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="bg-white/10 text-cyan-300 px-1 py-0.5 rounded font-mono text-[10px] break-all">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function BoldText({ text }: { text: string }) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-blue-300 font-semibold">
          <InlineCode text={part.slice(2, -2)} />
        </strong>
      );
    }
    return (
      <span key={i}>
        <InlineCode text={part} />
      </span>
    );
  });
}

function MarkdownLite({ content }: { content: string }) {
  return (
    <>
      {content.split(/(```[\s\S]*?```)/g).map((block, bi) => {
        if (block.startsWith('```')) {
          const m = block.match(/```(\w*)\n([\s\S]*?)```/);
          const lang = m ? m[1] : '';
          const code = m ? m[2] : block.slice(3, -3);
          return (
            <div
              key={bi}
              className="my-2 bg-black/50 border border-white/5 rounded-lg p-3 font-mono text-[11px] overflow-x-auto max-w-full text-blue-300 select-text"
            >
              {lang && (
                <div className="text-[9px] text-white/30 uppercase tracking-wider mb-1 border-b border-white/5 pb-1 select-none">
                  {lang}
                </div>
              )}
              <pre className="whitespace-pre overflow-x-auto leading-relaxed">
                <code>{code.trim()}</code>
              </pre>
            </div>
          );
        }
        const lines = block.split('\n');
        return (
          <div key={bi} className="space-y-1.5 break-words max-w-full overflow-hidden">
            {lines.map((line, li) => {
              const t = line.trim();
              if (!t) return <div key={li} className="h-2" />;
              const bullet = t.match(/^[-*•]\s+(.*)/);
              const num = t.match(/^(\d+)\.\s+(.*)/);
              if (bullet) {
                return (
                  <div key={li} className="flex gap-2 items-start pl-1 text-xs text-white/90 break-words max-w-full">
                    <span className="text-blue-400 select-none mt-1 text-[10px]">•</span>
                    <span className="flex-1 min-w-0">
                      <BoldText text={bullet[1]} />
                    </span>
                  </div>
                );
              }
              if (num) {
                return (
                  <div key={li} className="flex gap-2 items-start pl-1 text-xs text-white/90 break-words max-w-full">
                    <span className="text-blue-400 select-none font-mono text-[10px] font-semibold">{num[1]}.</span>
                    <span className="flex-1 min-w-0">
                      <BoldText text={num[2]} />
                    </span>
                  </div>
                );
              }
              return (
                <p key={li} className="text-xs text-white/90 leading-relaxed break-words max-w-full">
                  <BoldText text={line} />
                </p>
              );
            })}
          </div>
        );
      })}
    </>
  );
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedTopic: TopicId | null;
  onClearTopic: () => void;
  onThinkingChange: (v: boolean) => void;
  suitTheme: SuitTheme;
}

export function ChatPanel({
  isOpen,
  onClose,
  selectedTopic,
  onClearTopic,
  onThinkingChange,
  suitTheme,
}: Props) {
  const [messages, setMessages] = useState<Msg[]>(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('eduardo_portfolio_chat');
      if (raw) {
        try {
          return JSON.parse(raw) as Msg[];
        } catch {
          /* ignore */
        }
      }
    }
    return [{ id: 'init', role: 'assistant', content: INIT_MSG }];
  });
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const themeRef = useRef(suitTheme);

  const isPunk = suitTheme === 'punk';
  const accent = themeText(suitTheme);
  const accentBg = themeBg(suitTheme);
  const accentBtn = themeBgStrong(suitTheme);
  const panelBorder = themePanel(suitTheme);
  const title = isPunk ? 'Zettafuego // Neo-Punk' : 'Eduardo // Corporativo';
  const placeholder = busy
    ? 'Procesando...'
    : isPunk
      ? 'Arte, tatuaje, citas, vibes...'
      : 'Experiencia, skills, CV, proyectos...';

  useEffect(() => {
    localStorage.setItem('eduardo_portfolio_chat', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (themeRef.current !== suitTheme) {
      themeRef.current = suitTheme;
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setSpeaking(false);
      let text = '';
      if (suitTheme === 'punk') {
        text =
          '⚡ Modo NEO-PUNK activo: magenta, cian y energía cruda. Ideal para hablar de tatuaje, arte y Zettafuego. ¿Qué pieza o estilo te late?';
      } else {
        text =
          '◆ Modo CORPORATIVO activo: navy y plata, look ejecutivo. Ideal para SSOMA, CV, skills tech y proyectos. ¿Qué te interesa del perfil profesional?';
      }
      const id = Math.random().toString(36).slice(2, 11);
      setMessages((m) => [...m, { id, role: 'assistant', content: text }]);
      if (voiceOn) speak(text, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suitTheme]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
      if (e.key === '/' && isOpen) {
        const ae = document.activeElement as HTMLElement | null;
        if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable)) return;
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  useEffect(() => {
    if (selectedTopic && isOpen) {
      sendPreset(selectedTopic);
      onClearTopic();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTopic, isOpen]);

  useEffect(() => {
    if (!isOpen && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  }, [isOpen]);

  const speak = (text: string, force = false) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    if (!voiceOn && !force) return;
    const clean = text
      .trim()
      .replace(/```[\s\S]*?```/g, ' [código omitido] ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/[-*•]\s+/g, '')
      .replace(/\s+/g, ' ');
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = 'es-ES';
    const voice = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().includes('es'));
    if (voice) u.voice = voice;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  const typeOut = async (text: string, id: string) => {
    const words = text.split(' ');
    let acc = '';
    setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, content: '', isTyping: true } : m)));
    for (let i = 0; i < words.length; i++) {
      acc += (i === 0 ? '' : ' ') + words[i];
      setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, content: acc } : m)));
      if (i % 2 === 0) audio.playNeuralTypingChar();
      await new Promise((r) => setTimeout(r, 25 + Math.random() * 20));
    }
    setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, isTyping: false } : m)));
  };

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    audio.playClickTick();
    const user: Msg = { id: Math.random().toString(36).slice(2, 11), role: 'user', content: text };
    setMessages((m) => [...m, user]);
    setInput('');
    setBusy(true);
    onThinkingChange(true);

    const history = [...messages, user].map((m) => ({ role: m.role, content: m.content }));
    let reply = '';
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, theme: suitTheme }),
      });
      if (!res.ok) throw new Error('La terminal cuántica devolvió un error de transmisión.');
      const data = await res.json();
      reply = data.text || 'Señal perdida. Reintente.';
    } catch {
      // Offline / local fallback
      const key = Object.keys(LOCAL_REPLIES).find((k) => text.includes(k) || text.length > 20);
      reply =
        LOCAL_REPLIES[key as keyof typeof LOCAL_REPLIES] ||
        `He recibido tu consulta: *"${text.slice(0, 80)}"*.\n\nEn modo local (sin API), te resumo el valor de **my agentes**: orquestación multi-agente para CRM, BI, DevOps y back-office con ROI medible (-45% costo, 99.8% uptime).\n\nActiva un tema (Neutrón / Súpernova / Matriz) o elige una sugerencia para profundizar.`;
    }

    const id = Math.random().toString(36).slice(2, 11);
    setMessages((m) => [...m, { id, role: 'assistant', content: reply }]);
    setBusy(false);
    onThinkingChange(false);
    if (voiceOn) speak(reply);
    await typeOut(reply, id);
  };

  const sendPreset = (id: TopicId) => {
    const map: Record<TopicId, string> = {
      SoporteEmpresarial: 'Quiero info sobre citas de tatuaje y los 10 años de experiencia de Eduardo como tatuador.',
      OperacionesBackoffice: 'Cuéntame la experiencia profesional de Eduardo en SSOMA, minería e innovación.',
      AnalisisDecision: '¿Qué skills tech y formación tiene Eduardo Sanchez?',
      DesarrolloDevOps: '¿Cómo contacto a Eduardo y dónde descargo su CV 2026?',
    };
    void send(map[id] || `Cuéntame sobre cómo integrar un agente autónomo para: ${id}`);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const toggleVoice = () => {
    audio.playClickTick();
    const next = !voiceOn;
    setVoiceOn(next);
    if (!next) {
      setSpeaking(false);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    } else {
      const last = [...messages].reverse().find((m) => m.role === 'assistant');
      if (last) speak(last.content, true);
    }
  };

  const reset = () => {
    audio.playClickTick();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setSpeaking(false);
    localStorage.removeItem('eduardo_portfolio_chat');
    setMessages([{ id: 'init', role: 'assistant', content: INIT_MSG }]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="monolith-hologram-chat-panel"
          initial={{
            opacity: 0,
            scaleY: 0.05,
            scaleX: 0.85,
            skewX: -12,
            y: 45,
          }}
          animate={{ opacity: 1, scaleY: 1, scaleX: 1, skewX: 0, y: 0 }}
          exit={{ opacity: 0, scaleY: 0.05, scaleX: 0.95, skewX: 10, y: 20, transition: { duration: 0.3 } }}
          transition={{ type: 'spring', damping: 22, stiffness: 140 }}
          className={`absolute left-4 right-4 sm:left-auto sm:right-12 top-6 bottom-6 sm:w-[420px] max-w-full z-50 pointer-events-auto flex flex-col bg-black/70 border overflow-hidden transition-[border-color] duration-500 ${panelBorder} rounded-2xl backdrop-blur-xl`}
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
          <div className="relative px-5 py-5 border-b border-white/10 flex justify-between items-center bg-black/40 select-none">
            <div className="space-y-1">
              <p className={`text-[10px] font-bold uppercase tracking-widest leading-none ${accent}`}>
                Interfaz de IA
              </p>
              <h2 className="text-xs font-semibold uppercase text-white tracking-wider flex items-center gap-2">
                {title}
                <span className="relative flex h-1.5 w-1.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${accentBg}`} />
                  <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${accentBg}`} />
                </span>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {speaking && (
                <div className="flex items-end gap-[2.5px] h-[13px] px-1 mr-1">
                  {[4, 8, 3, 6].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [h, 13 - h, h] }}
                      transition={{ repeat: Infinity, duration: 0.5 + i * 0.1, ease: 'easeInOut' }}
                      className={`w-[2px] rounded-sm ${isPunk ? 'bg-fuchsia-400' : 'bg-sky-300'}`}
                    />
                  ))}
                </div>
              )}
              <button onClick={toggleVoice} className={`p-1.5 rounded-lg border transition-all ${accent} bg-white/5 border-white/10`}>
                {voiceOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
              </button>
              <button onClick={reset} className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-white/50 hover:text-fuchsia-400">
                <RotateCcw size={14} />
              </button>
              <button
                onClick={() => {
                  audio.playClickTick();
                  onClose();
                }}
                className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-white/50 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="bg-white/[0.02] border-b border-white/5 px-5 py-2 flex items-center gap-2 select-none">
            <Terminal size={10} className={accent} />
            <span className="font-mono text-[8px] text-white/40 uppercase tracking-widest font-semibold">
              UPLINK_DE_PROCESOS // CONSOLA ACTIVA...
            </span>
          </div>

          <div
            ref={listRef}
            className="flex-1 overflow-y-auto overflow-x-hidden px-5 py-4 space-y-4 relative scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent bg-gradient-to-b from-black/20 to-black/40 w-full"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col max-w-[88%] ${m.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                <div className="font-mono text-[7px] text-white/30 uppercase tracking-[0.15em] mb-1">
                  {m.role === 'user' ? 'VISITANTE' : 'PORTAFOLIO_AI'}
                </div>
                <div
                  className={`px-4 py-3 rounded-xl font-sans text-xs leading-relaxed shadow-lg w-full break-words overflow-hidden ${
                    m.role === 'user'
                      ? `${accentBg} text-white font-medium rounded-tr-none`
                      : 'bg-white/[0.04] text-white border border-white/10 rounded-tl-none font-light'
                  }`}
                >
                  {m.role === 'assistant' ? <MarkdownLite content={m.content} /> : m.content}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex flex-col items-start max-w-[80%] mr-auto">
                <div className="font-mono text-[7px] text-white/30 uppercase tracking-wider mb-1">PORTAFOLIO_AI</div>
                <div className="flex gap-2 items-center bg-white/[0.04] rounded-xl rounded-tl-none px-4 py-3 text-xs shadow-xl border border-white/10">
                  <Loader2 className={`animate-spin ${accent}`} size={12} />
                  <span className={`font-mono text-[8px] tracking-widest uppercase animate-pulse ${accent}`}>
                    Consultando portafolio...
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="px-5 py-2.5 border-t border-white/5 bg-black/20 select-none flex flex-wrap gap-1.5 items-center">
            <span className="font-mono text-[7px] text-white/30 uppercase tracking-wider mr-1">SUGERENCIAS:</span>
            {(
              [
                ['SoporteEmpresarial', 'Tatuaje / citas'],
                ['OperacionesBackoffice', 'Experiencia'],
                ['AnalisisDecision', 'Skills'],
                ['DesarrolloDevOps', 'Contacto'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => sendPreset(id)}
                disabled={busy}
                className="text-[8px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-white/70 hover:text-white border border-white/10 transition-colors disabled:opacity-40"
              >
                {label}
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-white/10 bg-black/50">
            <form onSubmit={onSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={busy}
                placeholder={placeholder}
                className={`flex-1 bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5 font-mono text-xs text-white placeholder-white/20 outline-none ${
                  isPunk ? 'focus:border-fuchsia-400' : 'focus:border-sky-400'
                }`}
              />
              <button
                type="submit"
                disabled={!input.trim() || busy}
                className={`p-2.5 rounded-xl text-white flex items-center justify-center transition-all shadow-md active:scale-95 disabled:opacity-30 ${accentBtn}`}
              >
                <Send size={14} />
              </button>
            </form>
            <div className="flex justify-between items-center mt-2.5 px-1 select-none pointer-events-none">
              <span className="font-mono text-[7px] text-white/20 uppercase tracking-wider">
                EDUARDO SANCHEZ · ZETTAFUEGO
              </span>
              <span className="font-mono text-[7px] text-white/20 uppercase tracking-wider font-semibold">
                LIMA · 977 740 994 ↵
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
