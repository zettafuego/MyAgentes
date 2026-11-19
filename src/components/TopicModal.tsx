import { useEffect, useRef, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Send,
  Database,
  BarChart3,
  CheckCircle2,
  Play,
  Loader2,
  FileText,
  Terminal,
  Sparkles,
} from 'lucide-react';
import { audio } from '../lib/audio';
import type { TopicId } from '../data/agents';
import type { SuitTheme } from '../lib/theme';

interface Props {
  activeTopic: TopicId | null;
  onClose: () => void;
  onSyncAndChat: (topic: TopicId, theme: SuitTheme) => void;
  suitTheme: SuitTheme;
}

export function TopicModal({ activeTopic, onClose, onSyncAndChat }: Props) {
  const [crmLogs, setCrmLogs] = useState([
    '⚛️ SISTEMA: Enlace cuántico establecido.',
    '📡 UPLINK: Sincronizando con base de datos de atención...',
    '✅ INTEGRACIÓN: HubSpot conectado [Rendimiento: 100%]',
    '✅ INTEGRACIÓN: Salesforce API v58 [Conexión activa]',
    '🤖 AGENTE: Esperando consulta de cliente...',
  ]);
  const [crmInput, setCrmInput] = useState('');
  const [sessions, setSessions] = useState(142);
  const [csat, setCsat] = useState(98.4);
  const [injecting, setInjecting] = useState(false);
  const [txStatus, setTxStatus] = useState('SISTEMA_OPERACIONES: En espera de transacciones...');
  const [txCount, setTxCount] = useState(12435);
  const [chart, setChart] = useState([40, 50, 45, 60, 55, 70, 65, 80]);
  const [report, setReport] = useState<{ label: string; value: string }[] | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [devopsLogs, setDevopsLogs] = useState([
    '🛠️ SYSTEM: Initializing pipeline compiler...',
    '📦 DEPLOY: Loading docker configurations...',
    '🔍 LINT: Running ESLint and Prettier assertions... OK',
    '🧪 TEST: Executing Jest unit suite [128/128 passed]',
    '🚀 RELEASE: Built assets successfully.',
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTopic === 'DesarrolloDevOps') endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [devopsLogs, activeTopic]);

  useEffect(() => {
    if (!activeTopic) return;
    let iv: ReturnType<typeof setInterval> | undefined;
    let chartIv: ReturnType<typeof setInterval> | undefined;

    if (activeTopic === 'DesarrolloDevOps') {
      const extra = [
        '🔍 SCAN: SonarQube analyzing code quality... 0 vulnerabilities',
        '📦 DOCKER: Bundling node-alpine deployment image...',
        '🌐 AWS: Syncing deployment to ECS cluster in eu-west-1...',
        '🛡️ SECURITY: SSL certificates validation complete.',
        '📡 ROUTER: Mapping internal load balancers...',
        '🚀 DEPLOY: Rolling release deployed on 14 nodes. Health: 100%',
        '🤖 AGENTE: Pipeline DevOps en espera de nuevos commits.',
      ];
      let i = 0;
      iv = setInterval(() => {
        if (i < extra.length) {
          setDevopsLogs((l) => [...l, extra[i]]);
          i++;
        } else i = 0;
      }, 3000);
    }
    if (activeTopic === 'AnalisisDecision') {
      chartIv = setInterval(() => {
        setChart((c) => [...c.slice(1), 50 + Math.round(Math.random() * 40)]);
      }, 1500);
    }
    return () => {
      if (iv) clearInterval(iv);
      if (chartIv) clearInterval(chartIv);
    };
  }, [activeTopic]);

  if (!activeTopic) return null;

  const meta = (() => {
    switch (activeTopic) {
      case 'SoporteEmpresarial':
        return {
          title: 'Soporte y Atención // Asistente CRM',
          subtitle: 'Canales de Atención 24/7 y Bases de Conocimiento Autónomas',
          theme: 'corp' as SuitTheme,
          neon: 'text-sky-300',
          border: 'border-slate-500/30 shadow-[0_0_50px_rgba(125,211,252,0.12)]',
          btn: 'bg-slate-700 hover:bg-slate-600',
          description:
            'Optimiza la experiencia de tus clientes implementando un agente de atención empático integrado con Salesforce, HubSpot y mensajería omnicanal.',
        };
      case 'OperacionesBackoffice':
        return {
          title: 'Operaciones // Enrutador de Back-office',
          subtitle: 'Automatización de ERPs, Pedidos y Contabilidad Interna',
          theme: 'corp' as SuitTheme,
          neon: 'text-sky-300',
          border: 'border-slate-500/30 shadow-[0_0_50px_rgba(100,116,139,0.15)]',
          btn: 'bg-slate-700 hover:bg-slate-600',
          description:
            'Elimina la carga de tareas administrativas repetitivas mediante agentes que auditan órdenes de facturación y se sincronizan al instante con ERPs corporativos como SAP.',
        };
      case 'AnalisisDecision':
        return {
          title: 'Análisis & BI // Núcleo Analítico',
          subtitle: 'Generación de Reportes e Interpretación de Datos en Tiempo Real',
          theme: 'corp' as SuitTheme,
          neon: 'text-sky-300',
          border: 'border-slate-500/30 shadow-[0_0_50px_rgba(100,116,139,0.15)]',
          btn: 'bg-slate-700 hover:bg-slate-600',
          description:
            'Habilita la consulta interactiva de métricas corporativas. El agente BI procesa big-data, extrae resúmenes ejecutivos del ROI y minimiza errores de interpretación.',
        };
      case 'DesarrolloDevOps':
        return {
          title: 'DevOps & Código // Pipeline Inspector',
          subtitle: 'Auditoría de Código Heredado y Mantenimiento de Despliegues',
          theme: 'punk' as SuitTheme,
          neon: 'text-fuchsia-400',
          border: 'border-fuchsia-500/30 shadow-[0_0_50px_rgba(232,121,249,0.15)]',
          btn: 'bg-fuchsia-600 hover:bg-fuchsia-500',
          description:
            'Despliega agentes de desarrollo que escriben tests unitarios de forma autónoma, auditan código legacy para migración y monitorean pipelines CI/CD.',
        };
    }
  })();

  const onCrm = (e: FormEvent) => {
    e.preventDefault();
    if (!crmInput.trim()) return;
    audio.playNeuralTypingChar();
    const msg = crmInput;
    setCrmLogs((l) => [...l, `👤 CLIENTE: ${msg}`]);
    setCrmInput('');
    setTimeout(() => {
      audio.playNeuralTypingChar();
      let reply =
        '🤖 AGENTE: Entendido. Transfiriendo consulta al núcleo cuántico de análisis. Procesando resolución autónoma...';
      if (/hola|buenos/i.test(msg))
        reply =
          '🤖 AGENTE: Saludos. Enlace establecido. Su consulta ha sido sincronizada con el CRM. SLA de atención: 0.12 segundos.';
      else if (/salesforce|crm/i.test(msg))
        reply =
          '🤖 AGENTE: Verificando HubSpot/Salesforce token... Estatus: Sincronizado. 0 incidencias abiertas en la cuenta vinculada.';
      setCrmLogs((l) => [...l, reply]);
      setSessions((s) => s + 1);
      setCsat((c) => Math.min(c + 0.1, 100));
    }, 1200);
  };

  const injectTx = () => {
    if (injecting) return;
    audio.playClickTick();
    setInjecting(true);
    setTxStatus('📡 SISTEMA: Inyectando transacción de prueba... [Módulo Facturación]');
    setTimeout(() => setTxStatus('⚙️ SISTEMA: Reglas de validación aplicadas. Impuestos y SKU verificados.'), 1500);
    setTimeout(() => {
      setTxStatus('✅ SISTEMA: Transacción confirmada y cargada exitosamente en SAP ERP.');
      setTxCount((n) => n + 1);
      setInjecting(false);
    }, 3200);
  };

  const genReport = () => {
    if (loadingReport) return;
    audio.playClickTick();
    setLoadingReport(true);
    setReport(null);
    setTimeout(() => {
      setReport([
        { label: 'HORAS DE TRABAJO AHORRADAS', value: '348 hrs/mes' },
        { label: 'REDUCCIÓN DE COSTO FACTURA', value: '45.2% de ahorro' },
        { label: 'LATENCIA DB BIGQUERY', value: '12ms de RTT' },
        { label: 'MIGRACIÓN ERP COMPLETA', value: '100% Completada' },
      ]);
      setLoadingReport(false);
      audio.playNeuralTypingChar();
    }, 1800);
  };

  const forceDeploy = () => {
    audio.playClickTick();
    setDevopsLogs((l) => [
      ...l,
      '⚡ FORCE DEPLOY triggered by administrator.',
      '🐳 DOCKER: Terminating outdated node containers...',
      '🐳 DOCKER: Initializing cluster replication pool...',
      '🛡️ SAFETY: Health checks: PASS.',
      '✅ SUCCESS: Cluster deployed in 840ms. Systems are synchronized!',
    ]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`absolute left-4 right-4 sm:left-12 sm:right-auto top-6 bottom-6 sm:w-[450px] max-w-full z-40 pointer-events-auto flex flex-col bg-black/80 border backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl ${meta.border}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
      <div className="relative px-6 py-5 border-b border-white/10 flex justify-between items-center bg-black/40">
        <div>
          <span className={`font-mono text-[8px] font-bold uppercase tracking-widest leading-none ${meta.neon}`}>
            ANÁLISIS DE ENTORNO // HOLOGRÁFICO
          </span>
          <h2 className="text-sm font-semibold uppercase text-white tracking-wider mt-1">{meta.title}</h2>
        </div>
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

      <div className="flex-1 overflow-y-auto p-6 space-y-5 relative scrollbar-thin scrollbar-thumb-white/10">
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-2">
          <p className="font-mono text-[8px] uppercase tracking-wider text-white/40 font-bold">Resumen de Mapeo</p>
          <h4 className="text-[10px] text-white/80 font-bold uppercase tracking-tight">{meta.subtitle}</h4>
          <p className="font-mono text-[9px] text-white/50 leading-relaxed uppercase tracking-wide">{meta.description}</p>
        </div>

        {activeTopic === 'SoporteEmpresarial' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/50 border border-white/5 rounded-xl p-3 text-center">
                <span className="text-lg font-light text-blue-400 font-mono">{sessions}</span>
                <p className="font-mono text-[7px] text-white/40 uppercase tracking-widest mt-1">Sesiones Procesadas</p>
              </div>
              <div className="bg-black/50 border border-white/5 rounded-xl p-3 text-center">
                <span className="text-lg font-light text-blue-400 font-mono">{csat.toFixed(1)}%</span>
                <p className="font-mono text-[7px] text-white/40 uppercase tracking-widest mt-1">Calificación CSAT</p>
              </div>
            </div>
            <div className="bg-black/60 border border-white/5 rounded-2xl overflow-hidden flex flex-col h-[220px]">
              <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex items-center justify-between">
                <span className="font-mono text-[8px] text-white/50 uppercase tracking-widest">Consola CRM Live</span>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2 font-mono text-[9px] text-white/70">
                {crmLogs.map((line, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-lg leading-relaxed ${
                      line.startsWith('👤')
                        ? 'bg-blue-500/10 border border-blue-500/20 text-blue-300 ml-4'
                        : line.startsWith('🤖')
                          ? 'bg-white/5 border border-white/5 text-white/90 mr-4'
                          : 'text-white/40'
                    }`}
                  >
                    {line}
                  </div>
                ))}
              </div>
              <form onSubmit={onCrm} className="p-2 bg-black/40 border-t border-white/5 flex gap-2">
                <input
                  value={crmInput}
                  onChange={(e) => setCrmInput(e.target.value)}
                  placeholder="Simula un mensaje: 'Hola', 'Salesforce'..."
                  className="flex-1 bg-white/5 border border-white/5 rounded-lg px-3 py-1.5 font-mono text-[9px] text-white placeholder-white/20 outline-none focus:border-blue-500/30"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded-lg">
                  <Send size={10} />
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTopic === 'OperacionesBackoffice' && (
          <div className="space-y-4">
            <div className="bg-black/50 border border-white/5 rounded-xl p-4 text-center space-y-1">
              <span className="text-xl font-light text-rose-400 font-mono tracking-widest">{txCount}</span>
              <p className="font-mono text-[7px] text-white/40 uppercase tracking-widest">
                Transacciones Automatizadas SAP
              </p>
            </div>
            <div className="bg-black/60 border border-white/5 rounded-2xl p-4 space-y-4">
              <span className="font-mono text-[8px] text-white/50 uppercase tracking-widest block mb-2 text-center">
                FLUJO DE DATOS ERP EN TIEMPO REAL
              </span>
              <div className="relative h-20 w-full bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-between px-6">
                <div className="absolute top-1/2 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-rose-500/40 via-purple-500/40 to-emerald-500/40 -translate-y-1/2 z-0" />
                {injecting && (
                  <motion.div
                    animate={{ left: ['18%', '50%', '82%'] }}
                    transition={{ duration: 3, ease: 'easeInOut' }}
                    className="absolute top-1/2 w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)] -translate-y-1/2 -translate-x-1/2 z-10"
                  />
                )}
                {[
                  { icon: Database, label: '1. ERP Data', box: 'bg-rose-500/10 border-rose-500/30 text-rose-400' },
                  { icon: BarChart3, label: '2. Reglas IA', box: 'bg-purple-500/10 border-purple-500/30 text-purple-400' },
                  { icon: CheckCircle2, label: '3. SAP Sync', box: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
                ].map(({ icon: Icon, label, box }) => (
                  <div key={label} className="relative z-10 flex flex-col items-center gap-1.5">
                    <div className={`p-2 rounded-lg border ${box}`}>
                      <Icon size={14} />
                    </div>
                    <span className="font-mono text-[7px] text-white/40 uppercase">{label}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-center h-[34px] flex items-center justify-center">
                <span className="font-mono text-[8px] uppercase tracking-tight truncate w-full text-rose-300">
                  {txStatus}
                </span>
              </div>
              <button
                onClick={injectTx}
                disabled={injecting}
                className="w-full py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-mono text-[9px] uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <Play size={10} className="fill-current" /> Inyectar Transacción de Prueba
              </button>
            </div>
          </div>
        )}

        {activeTopic === 'AnalisisDecision' && (
          <div className="space-y-4">
            <div className="bg-black/60 border border-white/5 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-[8px] uppercase tracking-widest text-white/40 mb-1 font-bold">
                <span>Rendimiento de Consultas BI (QPS)</span>
                <span className="text-rose-400">Live Data</span>
              </div>
              <div className="h-24 w-full bg-white/[0.01] border border-white/5 rounded-xl overflow-hidden relative flex items-end">
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <path
                    d={`M 0 ${100 - chart[0]} L 50 ${100 - chart[1]} L 100 ${100 - chart[2]} L 150 ${100 - chart[3]} L 200 ${100 - chart[4]} L 250 ${100 - chart[5]} L 300 ${100 - chart[6]} L 400 ${100 - chart[7]}`}
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2"
                  />
                </svg>
                <div className="absolute right-3 top-3 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="font-mono text-[8px] text-white/50">{chart[chart.length - 1]} OPS/SEC</span>
                </div>
              </div>
            </div>
            <div className="bg-black/60 border border-white/5 rounded-2xl p-4 min-h-[140px] flex flex-col justify-center">
              {loadingReport ? (
                <div className="flex flex-col items-center gap-3 py-6">
                  <Loader2 className="animate-spin text-rose-400" size={18} />
                  <span className="font-mono text-[8px] text-rose-300 uppercase tracking-widest animate-pulse">
                    Extrayendo analíticas SAP BigQuery...
                  </span>
                </div>
              ) : report ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 pb-1 border-b border-white/5 mb-1">
                    <FileText size={10} className="text-rose-400" />
                    <span className="font-mono text-[8px] uppercase tracking-wider text-rose-300 font-bold">
                      REPORTE FINANCIERO IA OK
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {report.map((r) => (
                      <div key={r.label} className="bg-white/[0.02] border border-white/5 rounded-lg p-2">
                        <span className="font-mono text-[7px] text-white/30 uppercase block">{r.label}</span>
                        <span className="font-mono text-[9px] text-white font-semibold block mt-0.5">{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <p className="font-mono text-[8px] text-white/30 uppercase tracking-wider">
                    REPORTE DIRECTIVO DE RETORNO EN ESPERA
                  </p>
                  <button
                    onClick={genReport}
                    className="mx-auto py-2 px-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Loader2 size={10} /> Generar Reporte Directivo
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTopic === 'DesarrolloDevOps' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {[
                ['99.8%', 'Build Uptime'],
                ['1.2m', 'CI/CD Cycle'],
                ['99.1%', 'Tests Coverage'],
              ].map(([v, l]) => (
                <div key={l} className="bg-black/50 border border-white/5 rounded-xl p-2.5 text-center">
                  <span className="text-sm font-light text-emerald-400 font-mono">{v}</span>
                  <p className="font-mono text-[6px] text-white/40 uppercase tracking-widest mt-1">{l}</p>
                </div>
              ))}
            </div>
            <div className="bg-black/60 border border-white/5 rounded-2xl overflow-hidden flex flex-col h-[200px]">
              <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex items-center justify-between">
                <span className="font-mono text-[8px] text-white/50 uppercase tracking-widest">Pipeline DevOps Log</span>
                <Terminal size={10} className="text-emerald-400 animate-pulse" />
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-1.5 font-mono text-[8px] text-emerald-300">
                {devopsLogs.map((l, i) => (
                  <div key={i} className="break-all">
                    {l}
                  </div>
                ))}
                <div ref={endRef} />
              </div>
              <div className="p-2 bg-black/40 border-t border-white/5">
                <button
                  onClick={forceDeploy}
                  className="w-full py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-[8px] uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 size={10} /> Forzar Deploy de Producción (Force Sync)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 border-t border-white/10 bg-black/50 space-y-3 select-none">
        <button
          onClick={() => {
            audio.playClickTick();
            onSyncAndChat(activeTopic, meta.theme);
          }}
          className={`w-full py-3.5 rounded-2xl text-white font-mono text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2.5 ${meta.btn}`}
        >
          <Sparkles size={12} className="animate-spin-slow" />
          Sincronizar Cerebro e Iniciar Enlace de Chat
        </button>
        <div className="flex justify-between items-center px-1">
          <span className="font-mono text-[7px] text-white/20 uppercase tracking-wider">CANAL: LOCAL_HOLO_NODE</span>
          <span className="font-mono text-[7px] text-white/20 uppercase tracking-wider font-semibold">
            STATUS: DIAG_READY ↵
          </span>
        </div>
      </div>
    </motion.div>
  );
}
