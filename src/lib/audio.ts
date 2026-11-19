/**
 * Motor de audio: SFX (Web Audio) + playlist MP3 de fondo
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  /** Ruta pública (public/) o null = generador synth */
  src: string | null;
  kind: 'mp3' | 'synth';
}

/** Lista musical del portafolio (archivos en /public) */
export const PLAYLIST: Track[] = [
  {
    id: 'cajamarca',
    title: 'Cajamarca',
    artist: 'Default',
    // Nombre de archivo con puntos: se sirve tal cual desde /public
    src: encodeURI('/Cajamarca.exe.mp3'),
    kind: 'mp3',
  },
  {
    id: 'algunas-veces',
    title: 'Algunas veces (cover nueva dirección)',
    artist: 'Zettafuego',
    src: encodeURI('/Algunas veces (cover nueva dirección).mp3'),
    kind: 'mp3',
  },
];

type Listener = () => void;

class AudioEngine {
  ctx: AudioContext | null = null;
  isAmbientPlaying = false;
  trackIndex = 0;
  volume = 0.7;

  private media: HTMLAudioElement | null = null;
  private listeners = new Set<Listener>();

  // ── synth fallback (si no hay MP3 o se agrega track kind:synth) ──
  ambientGain: GainNode | null = null;
  sequencerTimer: ReturnType<typeof setInterval> | null = null;
  vocalTimer: ReturnType<typeof setInterval> | null = null;
  step = 0;
  bpm = 118;
  distortion: WaveShaperNode | null = null;

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch {
        /* ignore */
      }
    });
  }

  get currentTrack(): Track {
    return PLAYLIST[this.trackIndex] ?? PLAYLIST[0];
  }

  get playlist(): Track[] {
    return PLAYLIST;
  }

  initCtx() {
    if (!this.ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AC();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch((e) => console.warn('Failed to resume AudioContext:', e));
    }
  }

  private ensureMedia() {
    if (this.media) return this.media;
    const el = new Audio();
    el.loop = true;
    el.preload = 'auto';
    el.volume = this.volume;
    el.addEventListener('play', () => {
      this.isAmbientPlaying = true;
      this.notify();
    });
    el.addEventListener('pause', () => {
      // pause por cambio de pista o stop
      if (!this.media || this.media.paused) {
        this.isAmbientPlaying = false;
        this.notify();
      }
    });
    el.addEventListener('ended', () => {
      // por si loop falla en algún navegador
      if (this.isAmbientPlaying && this.media) {
        this.media.currentTime = 0;
        void this.media.play().catch(() => {});
      }
    });
    el.addEventListener('error', () => {
      console.warn('Error cargando pista:', this.currentTrack.title, el.error);
      this.isAmbientPlaying = false;
      this.notify();
    });
    this.media = el;
    return el;
  }

  setVolume(v: number) {
    this.volume = Math.min(1, Math.max(0, v));
    if (this.media) this.media.volume = this.volume;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(this.volume * 0.72, this.ctx.currentTime, 0.05);
    }
    this.notify();
  }

  /** Reproduce la pista actual (MP3 o synth) */
  startAmbientHum() {
    try {
      this.initCtx();
      const track = this.currentTrack;
      if (track.kind === 'mp3' && track.src) {
        this.stopSynth();
        const el = this.ensureMedia();
        const full = track.src;
        if (!el.src.endsWith(full) && el.getAttribute('data-src') !== full) {
          el.src = full;
          el.setAttribute('data-src', full);
        }
        el.volume = this.volume;
        el.loop = true;
        void el.play()
          .then(() => {
            this.isAmbientPlaying = true;
            this.notify();
          })
          .catch((e) => {
            console.warn('Autoplay bloqueado o error de audio:', e);
            this.isAmbientPlaying = false;
            this.notify();
          });
      } else {
        this.stopMedia();
        this.startSynth();
      }
    } catch (e) {
      console.warn('Unable to start ambient music:', e);
    }
  }

  stopAmbientHum() {
    this.stopMedia();
    this.stopSynth();
    this.isAmbientPlaying = false;
    this.notify();
  }

  private stopMedia() {
    if (this.media) {
      try {
        this.media.pause();
        this.media.currentTime = 0;
      } catch {
        /* ignore */
      }
    }
  }

  toggleAmbientHum() {
    if (this.isAmbientPlaying) this.stopAmbientHum();
    else this.startAmbientHum();
    return this.isAmbientPlaying;
  }

  getIsPlaying() {
    return this.isAmbientPlaying;
  }

  playTrack(index: number) {
    if (index < 0 || index >= PLAYLIST.length) return;
    this.stopAmbientHum();
    this.trackIndex = index;
    this.notify();
    // al elegir pista de la lista, siempre intenta reproducir
    this.startAmbientHum();
  }

  nextTrack() {
    const next = (this.trackIndex + 1) % PLAYLIST.length;
    this.playTrack(next);
  }

  prevTrack() {
    const prev = (this.trackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    this.playTrack(prev);
  }

  // ── Synth (opcional / legacy) ─────────────────────────────────

  private msPerStep() {
    return 60_000 / this.bpm / 4;
  }

  private makeDistortion(amount = 28) {
    if (!this.ctx) return null;
    const n = 256;
    const curve = new Float32Array(n);
    const k = amount;
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1;
      curve[i] = ((Math.PI + k) * x) / (Math.PI + k * Math.abs(x));
    }
    const ws = this.ctx.createWaveShaper();
    ws.curve = curve;
    ws.oversample = '2x';
    return ws;
  }

  private playKick(t: number) {
    if (!this.ctx || !this.ambientGain) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(130, t);
    o.frequency.exponentialRampToValueAtTime(45, t + 0.14);
    g.gain.setValueAtTime(0.7, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
    o.connect(g);
    g.connect(this.ambientGain);
    o.start(t);
    o.stop(t + 0.35);
  }

  private playSnare(t: number) {
    if (!this.ctx || !this.ambientGain) return;
    const o = this.ctx.createOscillator();
    const g1 = this.ctx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(180, t);
    o.frequency.exponentialRampToValueAtTime(120, t + 0.1);
    g1.gain.setValueAtTime(0.2, t);
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    o.connect(g1);
    g1.connect(this.ambientGain);
    o.start(t);
    o.stop(t + 0.16);
    const len = this.ctx.sampleRate * 0.14;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(2200, t);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.28, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    src.connect(bp);
    bp.connect(g);
    g.connect(this.ambientGain);
    src.start(t);
    src.stop(t + 0.17);
  }

  private playHat(t: number, open = false) {
    if (!this.ctx || !this.ambientGain) return;
    const len = this.ctx.sampleRate * (open ? 0.2 : 0.04);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const hp = this.ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(open ? 6000 : 9500, t);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(open ? 0.08 : 0.045, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + (open ? 0.18 : 0.035));
    src.connect(hp);
    hp.connect(g);
    g.connect(this.ambientGain);
    src.start(t);
    src.stop(t + (open ? 0.22 : 0.05));
  }

  private playPowerChord(t: number, root: number, duration = 0.45) {
    if (!this.ctx || !this.ambientGain) return;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(0.11, t + 0.02);
    g.gain.setValueAtTime(0.09, t + duration * 0.5);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    const dest = this.distortion || this.ambientGain;
    g.connect(dest);
    [root, root * 1.5, root * 2].forEach((f, i) => {
      if (!this.ctx) return;
      const o = this.ctx.createOscillator();
      o.type = i === 1 ? 'square' : 'sawtooth';
      o.frequency.setValueAtTime(f, t);
      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(1800, t);
      lp.frequency.exponentialRampToValueAtTime(600, t + duration);
      o.connect(lp);
      lp.connect(g);
      o.start(t);
      o.stop(t + duration + 0.05);
    });
  }

  private playBass(t: number, freq: number) {
    if (!this.ctx || !this.ambientGain) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(freq, t);
    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(420, t);
    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(0.16, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    o.connect(lp);
    lp.connect(g);
    g.connect(this.ambientGain);
    o.start(t);
    o.stop(t + 0.25);
  }

  private tickStep() {
    if (!this.ctx || !this.isAmbientPlaying || !this.ambientGain) return;
    const t = this.ctx.currentTime + 0.02;
    const s = this.step % 16;
    if (s === 0 || s === 8) this.playKick(t);
    if (s === 4 || s === 12) this.playSnare(t);
    if (s === 7 || s === 15) this.playKick(t + 0.01);
    if (s % 2 === 0) this.playHat(t, false);
    if (s === 6 || s === 14) this.playHat(t, true);
    const bassMap = [82.41, 0, 82.41, 0, 98, 0, 110, 0, 82.41, 0, 73.42, 0, 82.41, 98, 0, 110];
    if (bassMap[s] > 0) this.playBass(t, bassMap[s]);
    if (s === 0) this.playPowerChord(t, 82.41, 0.55);
    if (s === 4) this.playPowerChord(t, 110, 0.45);
    if (s === 8) this.playPowerChord(t, 98, 0.5);
    if (s === 12) this.playPowerChord(t, 82.41, 0.5);
    this.step += 1;
  }

  private speakVocal() {
    if (!this.isAmbientPlaying || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance('Cállate y baila');
      u.lang = 'es-ES';
      u.rate = 0.92;
      u.pitch = 0.78;
      u.volume = 0.95;
      const voices = window.speechSynthesis.getVoices();
      const es =
        voices.find((v) => v.lang.toLowerCase().startsWith('es') && /male|hombre|jorge|pablo|diego/i.test(v.name)) ||
        voices.find((v) => v.lang.toLowerCase().startsWith('es'));
      if (es) u.voice = es;
      window.speechSynthesis.speak(u);
    } catch (e) {
      console.warn('Vocalista TTS falló:', e);
    }
  }

  private startSynth() {
    try {
      this.initCtx();
      if (!this.ctx || this.isAmbientPlaying) return;
      const t0 = this.ctx.currentTime;
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, t0);
      this.ambientGain.gain.linearRampToValueAtTime(this.volume * 0.72, t0 + 0.6);
      this.distortion = this.makeDistortion(22);
      if (this.distortion) this.distortion.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);
      this.isAmbientPlaying = true;
      this.step = 0;
      if ('speechSynthesis' in window) window.speechSynthesis.getVoices();
      this.sequencerTimer = setInterval(() => this.tickStep(), this.msPerStep());
      const barMs = (60_000 / this.bpm) * 4;
      setTimeout(() => {
        if (this.isAmbientPlaying) this.speakVocal();
      }, barMs * 2);
      this.vocalTimer = setInterval(() => {
        if (this.isAmbientPlaying) this.speakVocal();
      }, barMs * 8);
      this.notify();
    } catch (e) {
      console.warn('Unable to start synth ambient:', e);
    }
  }

  private stopSynth() {
    try {
      if (this.sequencerTimer) {
        clearInterval(this.sequencerTimer);
        this.sequencerTimer = null;
      }
      if (this.vocalTimer) {
        clearInterval(this.vocalTimer);
        this.vocalTimer = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (this.ambientGain) {
        try {
          this.ambientGain.disconnect();
        } catch {
          /* ignore */
        }
        this.ambientGain = null;
      }
      if (this.distortion) {
        try {
          this.distortion.disconnect();
        } catch {
          /* ignore */
        }
        this.distortion = null;
      }
      this.step = 0;
    } catch (e) {
      console.warn('Unable to stop synth ambient:', e);
    }
  }

  // ── SFX ───────────────────────────────────────────────────────

  playUplinkSweep() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      [164.81, 220, 277.18, 329.63].forEach((freq, i) => {
        if (!this.ctx) return;
        const start = t + i * 0.07;
        const o = this.ctx.createOscillator();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(freq, start);
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0, start);
        g.gain.linearRampToValueAtTime(0.07, start + 0.03);
        g.gain.exponentialRampToValueAtTime(1e-4, start + 0.45);
        o.connect(g);
        g.connect(this.ctx.destination);
        o.start(start);
        o.stop(start + 0.5);
      });
    } catch (e) {
      console.warn('Uplink chime failed:', e);
    }
  }

  playClickTick() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(660, t);
      g.gain.setValueAtTime(0.05, t);
      g.gain.exponentialRampToValueAtTime(1e-4, t + 0.08);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(t);
      o.stop(t + 0.1);
    } catch {
      /* ignore */
    }
  }

  playNeuralTypingChar() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(900 + Math.random() * 300, t);
      g.gain.setValueAtTime(0.012, t);
      g.gain.exponentialRampToValueAtTime(1e-4, t + 0.03);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(t);
      o.stop(t + 0.04);
    } catch {
      /* ignore */
    }
  }

  playWarpComplete() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      [164.81, 220, 277.18, 329.63].forEach((freq, i) => {
        if (!this.ctx) return;
        const start = t + i * 0.08;
        const o = this.ctx.createOscillator();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(freq, start);
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0.09, start);
        g.gain.exponentialRampToValueAtTime(1e-4, start + 0.9);
        o.connect(g);
        g.connect(this.ctx.destination);
        o.start(start);
        o.stop(start + 1);
      });
    } catch (e) {
      console.warn('Warp complete audio failed:', e);
    }
  }
}

export const audio = new AudioEngine();

if (typeof window !== 'undefined') {
  const resume = () => {
    if (audio.ctx && audio.ctx.state === 'suspended') {
      audio.ctx.resume().catch(() => {});
    }
    if ('speechSynthesis' in window) window.speechSynthesis.getVoices();
  };
  window.addEventListener('click', resume, { once: true, capture: true });
  window.addEventListener('touchstart', resume, { once: true, capture: true });
  if ('speechSynthesis' in window) {
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      window.speechSynthesis.getVoices();
    });
  }
}
