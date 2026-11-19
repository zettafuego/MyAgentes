import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import {
  AGENTS,
  AGENT_DIAGNOSTICS,
  AGENT_METRICS,
  AGENT_STREAMS,
  type AgentNode,
} from '../data/agents';
import { audio } from '../lib/audio';
import type { SuitTheme } from '../lib/theme';
import { hexPoints, themeBg, themeBorderCard, themeText } from '../lib/theme';

const HEADINGS = ['000°', '090°', '180°', '270°'];

const SPECTRAL: Record<string, string> = {
  O: 'shadow-[0_0_8px_#93c5fd] bg-blue-300',
  B: 'shadow-[0_0_8px_#bae6fd] bg-sky-200',
  A: 'shadow-[0_0_8px_#ffffff] bg-white',
  F: 'shadow-[0_0_8px_#fef08a] bg-yellow-100',
  G: 'shadow-[0_0_8px_#fde047] bg-yellow-400',
  K: 'shadow-[0_0_8px_#fed7aa] bg-orange-300',
  M: 'shadow-[0_0_8px_#fca5a5] bg-rose-400',
};

interface Props {
  open: boolean;
  suitTheme: SuitTheme;
  warpSpeed: number;
  onExit: () => void;
}

export function HUDVisor({ open, suitTheme, warpSpeed, onExit }: Props) {
  const [mapping, setMapping] = useState(false);
  const [active, setActive] = useState<AgentNode>(AGENTS[0]);
  const [selected, setSelected] = useState<AgentNode>(AGENTS[0]);
  const [linked, setLinked] = useState<Set<string>>(new Set(['supervisor']));
  const [syncing, setSyncing] = useState(false);
  const [syncPct, setSyncPct] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [mesh, setMesh] = useState(100);
  const [radarAngle, setRadarAngle] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [tick, setTick] = useState(0);
  const radarRef = useRef<HTMLDivElement>(null);
  const t = themeText(suitTheme);
  const bg = themeBg(suitTheme);
  const border = themeBorderCard(suitTheme);

  useEffect(() => {
    if (!open) return;
    const iv = setInterval(() => setRadarAngle((a) => (a + 0.8) % 360), 30);
    return () => clearInterval(iv);
  }, [open]);

  useEffect(() => {
    const iv = setInterval(() => setTick((n) => n + 1), 3000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (!syncing || !selected) return;
    const iv = setInterval(() => {
      setSyncPct((p) => {
        const n = p + 1.25;
        if (n >= 100) {
          clearInterval(iv);
          audio.playWarpComplete();
          setActive(selected);
          setLinked((s) => new Set(s).add(selected.id));
          setTokens((tok) => tok + Math.ceil(selected.latency * 12 + 50));
          setSyncing(false);
          return 0;
        }
        return n;
      });
    }, 40);
    return () => clearInterval(iv);
  }, [syncing, selected]);

  if (!open) return null;

  const onRadarMove = (e: MouseEvent) => {
    if (!radarRef.current) return;
    const r = radarRef.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    setMouse({
      x: (e.clientX - cx) / (r.width / 2),
      y: (e.clientY - cy) / (r.height / 2),
    });
  };

  const startLink = (agent: AgentNode) => {
    setSelected(agent);
    audio.playClickTick();
    if (agent.id !== active.id) {
      setSyncing(true);
      setSyncPct(0);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-6 sm:p-12 select-none"
      >
        <div
          className={`absolute inset-0 border-[3px] rounded-[40px] pointer-events-none ${
            suitTheme === 'punk'
              ? 'shadow-[inset_0_0_80px_rgba(232,121,249,0.35)] border-fuchsia-500/15'
              : 'shadow-[inset_0_0_80px_rgba(125,211,252,0.2)] border-slate-400/15'
          }`}
        />

        <div className="flex justify-between items-start w-full relative z-10">
          <div className="space-y-1">
            <span className={`font-mono text-[9px] font-bold uppercase tracking-widest leading-none ${t}`}>
              SISTEMA_TACTICO_AR // VÍNCULO DIRECTO
            </span>
            <h2 className="text-xs font-semibold uppercase text-white/95 tracking-wider mt-1 flex items-center gap-2">
              {mapping ? 'SISTEMA DE DEFENSA ESTELAR' : 'VISOR HUD ACTIVO'}
              <span className="relative flex h-1.5 w-1.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${bg}`} />
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${bg}`} />
              </span>
            </h2>
          </div>
          <div className="text-right font-mono text-[8px] text-white/40 space-y-0.5">
            <p className="uppercase font-bold text-white/60">SECTOR_PILOTO_CALIBRADO</p>
            <p>WARP VELOCITY: {warpSpeed * 284} KM/S</p>
          </div>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-5">
          <div
            ref={radarRef}
            onMouseMove={onRadarMove}
            onMouseLeave={() => setMouse({ x: 0, y: 0 })}
            className="relative w-80 h-80 rounded-full border border-white/10 flex items-center justify-center pointer-events-auto cursor-default overflow-hidden bg-black/35 backdrop-blur-[2px]"
            style={{
              transform: `perspective(1000px) rotateX(${mouse.y * -4}deg) rotateY(${mouse.x * 4}deg)`,
              transition: 'transform 0.15s ease-out',
            }}
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
              <g style={{ transformOrigin: '160px 160px', animation: 'spin 45s linear infinite' }}>
                <polygon points={hexPoints(160, 160, 142)} fill="none" stroke="rgba(59,130,246,0.08)" strokeWidth="1" />
                <polygon
                  points={hexPoints(160, 160, 85)}
                  fill="none"
                  stroke="rgba(59,130,246,0.05)"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
              </g>
              <g
                style={{
                  transformOrigin: '160px 160px',
                  transform: `rotate(${-radarAngle * 0.15 + mouse.x * -16}deg) translate(${mouse.x * -4}px, ${mouse.y * -4}px)`,
                }}
                className="opacity-30"
              >
                <circle cx="160" cy="160" r="148" fill="none" stroke="currentColor" strokeWidth="0.75" className={t} />
                {HEADINGS.map((h, i) => {
                  const a = ((i * 90 - 90) * Math.PI) / 180;
                  return (
                    <text
                      key={h}
                      x={160 + Math.cos(a) * 135}
                      y={160 + Math.sin(a) * 135 + 2.5}
                      textAnchor="middle"
                      className={`font-mono text-[6px] font-bold ${t}`}
                      fill="currentColor"
                    >
                      {h}
                    </text>
                  );
                })}
              </g>

              {mapping &&
                AGENTS.map((agent) => {
                  if (agent.id === active.id) return null;
                  const isSel = selected?.id === agent.id;
                  const isLinked = linked.has(agent.id);
                  const x1 = 160 + active.x;
                  const y1 = 160 + active.y;
                  const x2 = 160 + agent.x;
                  const y2 = 160 + agent.y;
                  const streams = AGENT_STREAMS[agent.id] || ['SINCRO EN CURSO // ENLACE ESTABLE'];
                  const stream = streams[tick % streams.length];
                  return (
                    <g key={agent.id}>
                      <path
                        id={`path-${agent.id}`}
                        d={`M ${x1} ${y1} L ${x2} ${y2}`}
                        fill="none"
                        stroke={
                          isSel
                            ? 'rgba(59,130,246,0.45)'
                            : isLinked
                              ? 'rgba(255,255,255,0.06)'
                              : 'rgba(255,255,255,0.02)'
                        }
                        strokeWidth={isSel ? 1.5 : 0.75}
                        strokeDasharray={isSel ? '3,3' : '4,6'}
                      />
                      {isLinked && (
                        <text className="font-mono text-[4.5px] tracking-widest font-bold fill-white/50 uppercase opacity-40">
                          <textPath href={`#path-${agent.id}`} startOffset="0%">
                            {stream}
                            <animate
                              attributeName="startOffset"
                              from="0%"
                              to="100%"
                              dur={isSel ? '5s' : '9s'}
                              repeatCount="indefinite"
                            />
                          </textPath>
                        </text>
                      )}
                    </g>
                  );
                })}
            </svg>

            <div
              style={{
                transform: `rotate(${radarAngle}deg)`,
                transformOrigin: 'center',
                position: 'absolute',
                width: '100%',
                height: '100%',
              }}
              className="rounded-full pointer-events-none z-10 opacity-30"
            >
              <div
                className="w-1/2 h-full"
                style={{
                  background: `conic-gradient(from 270deg, transparent 240deg, ${
                    suitTheme === 'punk' ? 'rgba(232,121,249,0.2)' : 'rgba(125,211,252,0.15)'
                  } 360deg)`,
                }}
              />
            </div>

            {mapping &&
              AGENTS.map((agent) => {
                const isActive = agent.id === active.id;
                const isSel = selected?.id === agent.id;
                return (
                  <div
                    key={agent.id}
                    style={{
                      left: `calc(50% + ${agent.x}px)`,
                      top: `calc(50% + ${agent.y}px)`,
                      transform: `translate(-50%, -50%) translate(${mouse.x * -8}px, ${mouse.y * -8}px)`,
                      position: 'absolute',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      startLink(agent);
                    }}
                    className="w-8 h-8 flex items-center justify-center z-20 cursor-pointer pointer-events-auto group"
                  >
                    {isActive && (
                      <motion.div
                        animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ repeat: Infinity, duration: 2.2 }}
                        className={`absolute w-5 h-5 rounded-full border border-dashed ${
                          suitTheme === 'punk' ? 'border-fuchsia-400' : 'border-sky-300'
                        }`}
                      />
                    )}
                    {isSel && (
                      <div className="absolute w-7 h-7 flex items-center justify-center animate-spin-slow">
                        <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 ${border.split(' ')[0]}`} />
                        <div className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 ${border.split(' ')[0]}`} />
                        <div className={`absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 ${border.split(' ')[0]}`} />
                        <div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 ${border.split(' ')[0]}`} />
                      </div>
                    )}
                    <div
                      className={`w-3.5 h-3.5 rounded-full transition-all duration-300 group-hover:scale-125 ${SPECTRAL[agent.spectral] || SPECTRAL.G}`}
                    />
                    <div className="absolute bottom-6 bg-black/85 border border-white/10 rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all pointer-events-none font-mono text-[7px] text-white/90 whitespace-nowrap shadow-xl z-30">
                      {agent.name} ({agent.latency.toFixed(1)} ms | Load: {agent.cognitiveLoad}%)
                    </div>
                  </div>
                );
              })}

            {syncing && (
              <div className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-center bg-black/55 backdrop-blur-[1px]">
                <motion.div
                  animate={{ scale: [0.98, 1.02, 0.98] }}
                  transition={{ duration: 0.15, repeat: Infinity }}
                  className="text-center z-30 flex flex-col items-center"
                >
                  <span className={`font-mono text-[8px] font-bold uppercase tracking-[0.25em] ${t} animate-pulse`}>
                    SINCRO DE RED MULTI-AGENTE INICIADA
                  </span>
                  <h3 className="text-lg font-bold tracking-tight text-white font-mono mt-0.5">
                    SYNC INDEX {((syncPct / 100) * 9.8).toFixed(2)}
                  </h3>
                  <div className="w-40 h-1 bg-white/10 rounded-full overflow-hidden mt-2.5 border border-white/5">
                    <motion.div style={{ width: `${syncPct}%` }} className={`h-full ${bg}`} />
                  </div>
                  <span className="font-mono text-[6px] text-white/40 block mt-1.5 uppercase tracking-widest">
                    ENLAZANDO CON {selected?.name.toUpperCase()}
                  </span>
                </motion.div>
              </div>
            )}

            {!mapping && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 rounded-full pointer-events-auto z-30 text-center p-6">
                <Sparkles size={24} className={`animate-pulse mb-2 ${t}`} />
                <p className="font-mono text-[7px] text-white/40 uppercase tracking-widest max-w-[180px] leading-relaxed mb-3">
                  NÚCLEO DE RED OPTIMIZADO. INICIA LA ENTRADA AL CENTRO DE ORQUESTACIÓN MULTI-AGENTE.
                </p>
                <button
                  onClick={() => {
                    audio.playClickTick();
                    setTokens(0);
                    setMesh(100);
                    setActive(AGENTS[0]);
                    setSelected(AGENTS[0]);
                    setLinked(new Set(['supervisor']));
                    setMapping(true);
                  }}
                  className={`py-2 px-4 rounded-xl border font-mono text-[8px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-2xl pointer-events-auto ${
                    suitTheme === 'punk'
                      ? 'bg-fuchsia-600/10 border-fuchsia-500/40 text-fuchsia-300'
                      : 'bg-slate-600/20 border-sky-400/30 text-sky-200'
                  }`}
                >
                  Iniciar Mapeo de Red
                </button>
              </div>
            )}
          </div>

          {mapping && selected && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`w-80 rounded-xl border p-3.5 backdrop-blur-md bg-black/75 pointer-events-auto font-mono text-[9px] z-30 select-text ${
                suitTheme === 'punk'
                  ? 'border-fuchsia-500/30 text-fuchsia-100'
                  : 'border-slate-500/30 text-sky-100'
              }`}
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-1.5 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full animate-ping ${bg}`} />
                  <span className={`font-bold tracking-widest uppercase text-[10px] ${t}`}>
                    JARVIS // SWARM DIAGNOSTICS
                  </span>
                </div>
                <span className="text-white/40 text-[8px]">SEC_OP_OK</span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-left mb-2">
                <div>
                  <span className="text-white/40 text-[7px] uppercase font-bold">AGENTE</span>
                  <span className="text-white font-semibold uppercase text-[8px] block mt-0.5 truncate">
                    {selected.name}
                  </span>
                </div>
                <div>
                  <span className="text-white/40 text-[7px] uppercase font-bold">CLASE</span>
                  <span className="text-white font-semibold uppercase text-[8px] block mt-0.5 truncate">
                    {AGENT_DIAGNOSTICS[selected.id]?.class}
                  </span>
                </div>
                <div>
                  <span className="text-white/40 text-[7px] uppercase font-bold">LATENCIA</span>
                  <span className="text-white uppercase text-[8px] block mt-0.5">
                    {selected.latency.toFixed(1)} ms // Load: {selected.cognitiveLoad}%
                  </span>
                </div>
                <div>
                  <span className="text-white/40 text-[7px] uppercase font-bold">UPTIME</span>
                  <span className="text-white uppercase text-[8px] block mt-0.5">
                    {AGENT_DIAGNOSTICS[selected.id]?.uptime} // {AGENT_METRICS[selected.id]?.roi}
                  </span>
                </div>
              </div>
              <div className="border-t border-white/5 pt-2 space-y-1">
                <div className="bg-white/[0.02] border border-white/5 rounded px-2 py-1">
                  <span className="text-white/40 text-[6.5px] uppercase font-bold">SINERGIA</span>
                  <span className={`font-semibold uppercase text-[7.5px] block mt-0.5 ${t}`}>
                    {AGENT_DIAGNOSTICS[selected.id]?.synergy}
                  </span>
                </div>
                <p className="text-white/60 uppercase text-[7.5px] text-justify">
                  {AGENT_DIAGNOSTICS[selected.id]?.behavior}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex justify-between items-center w-full my-auto px-4 z-10 pointer-events-none">
          <div className="w-[110px] space-y-3 bg-black/40 border border-white/5 rounded-xl p-3 backdrop-blur-md pointer-events-none">
            <span className="text-[7px] uppercase tracking-wider text-white/30 font-bold font-mono">
              {mapping ? 'NÚCLEO QUANTUM' : 'TELEMETRÍA RED'}
            </span>
            {mapping ? (
              <>
                <div>
                  <span className="text-[6px] text-white/40 uppercase block">TOKENS_ENRUTADOS</span>
                  <span className={`text-xs font-semibold ${t}`}>{tokens} TOKENS</span>
                </div>
                <div>
                  <span className="text-[6px] text-white/40 uppercase block">AGENTE ACTIVO</span>
                  <span className="text-[9px] font-semibold text-white truncate block">{active.name}</span>
                </div>
                <div>
                  <div className="flex justify-between text-[6px] text-white/40 uppercase">
                    <span>ESTABILIDAD</span>
                    <span className={t}>{mesh}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div style={{ width: `${mesh}%` }} className={`h-full ${bg}`} />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-0.5 text-[6px] font-mono text-white/40">
                <p>
                  THRUST: <span className={t}>{warpSpeed}%</span>
                </p>
                <p>MESH SYNC: 99.8%</p>
              </div>
            )}
          </div>
          <div className="w-[110px] space-y-3 bg-black/40 border border-white/5 rounded-xl p-3 backdrop-blur-md text-right font-mono">
            <span className="text-[7px] uppercase tracking-wider text-white/30 font-bold">MÉTRICAS DE RED</span>
            <div className="space-y-0.5 text-[6px] text-white/40">
              <p>
                MESH SYNC: <span className="text-emerald-400 font-bold">99.8%</span>
              </p>
              <p>
                TOKEN RATE: <span className="text-white/80">480 T/S</span>
              </p>
              <p>
                ERROR RATE: <span className="text-white/80">0.01%</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 w-full relative z-10 pointer-events-auto">
          <button
            onClick={() => {
              audio.playUplinkSweep();
              setMapping(false);
              onExit();
            }}
            className="py-2.5 px-6 rounded-xl border border-white/10 hover:border-white/20 bg-black/60 hover:bg-black/80 text-white font-mono text-[9px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 shadow-2xl"
          >
            <X size={10} className="text-rose-400" />
            Salir del Modo Visor (Desacoplar)
          </button>
          <div className="flex justify-between w-full max-w-[280px] text-[6px] font-mono text-white/20 uppercase tracking-widest pointer-events-none">
            <span>GAL_REF: SECTOR_SOL_3</span>
            <span>PORT: 3000 // RCV_UPLINK</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
