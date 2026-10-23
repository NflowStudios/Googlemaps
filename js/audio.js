/* ============================================================
   FRECUENCIA 84 — audio.js
   Motor de audio 100% sintetizado (WebAudio) + voz de la entidad
   ============================================================ */
window.F84 = window.F84 || {};

F84.audio = (function () {
  'use strict';

  let actx = null, master = null;
  let muted = false, volume = 0.8;
  let whiteBuf = null, brownBuf = null;
  let amb = { hum1: null, hum2: null, airG: null, d84a: null, d84b: null, droneG: null };
  let currentTape = null;

  /* ---------- init ---------- */
  function init() {
    if (actx) { actx.resume && actx.resume(); return true; }
    try {
      actx = new (window.AudioContext || window.webkitAudioContext)();
      master = actx.createGain();
      master.gain.value = muted ? 0 : volume;
      master.connect(actx.destination);
      whiteBuf = mkWhite(); brownBuf = mkBrown();
      startAmbience();
      // red de seguridad: si el navegador suspende el audio, reanudar en cualquier gesto
      document.addEventListener('pointerdown', () => { if (actx && actx.state === 'suspended') actx.resume(); });
      document.addEventListener('keydown', () => { if (actx && actx.state === 'suspended') actx.resume(); });
      return true;
    } catch (e) { return false; }
  }
  function mkWhite() {
    const b = actx.createBuffer(1, actx.sampleRate * 2, actx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }
  function mkBrown() {
    const b = actx.createBuffer(1, actx.sampleRate * 3, actx.sampleRate);
    const d = b.getChannelData(0); let last = 0;
    for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.2; }
    return b;
  }
  function ok() { return !!actx; }
  function now() { return actx ? actx.currentTime : 0; }

  function setVolume(v) { volume = v; if (master && !muted) master.gain.value = v; }
  function setMuted(m) { muted = m; if (master) master.gain.value = m ? 0 : volume; }
  function isMuted() { return muted; }

  /* ---------- ambiencia ---------- */
  function startAmbience() {
    // zumbido del CRT
    amb.hum1 = osc(55, 'sine', 0.012); amb.hum2 = osc(110, 'sine', 0.006);
    // aire (ruido marrón filtrado)
    const air = actx.createBufferSource(); air.buffer = brownBuf; air.loop = true;
    const lp = actx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 420;
    amb.airG = actx.createGain(); amb.airG.gain.value = 0.02;
    air.connect(lp); lp.connect(amb.airG); amb.airG.connect(master); air.start();
    // drone de la 84 (crece con el terror)
    amb.d84a = actx.createOscillator(); amb.d84a.type = 'sine'; amb.d84a.frequency.value = 84;
    amb.d84b = actx.createOscillator(); amb.d84b.type = 'sine'; amb.d84b.frequency.value = 84.7;
    amb.droneG = actx.createGain(); amb.droneG.gain.value = 0;
    amb.d84a.connect(amb.droneG); amb.d84b.connect(amb.droneG); amb.droneG.connect(master);
    amb.d84a.start(); amb.d84b.start();
  }
  function osc(freq, type, gain) {
    const o = actx.createOscillator(); o.type = type; o.frequency.value = freq;
    const g = actx.createGain(); g.gain.value = gain;
    o.connect(g); g.connect(master); o.start(); return o;
  }
  function setDread(level) {
    if (!actx) return;
    const t = now();
    amb.droneG.gain.cancelScheduledValues(t);
    amb.droneG.gain.linearRampToValueAtTime(0.05 * level, t + 3);
    amb.airG.gain.linearRampToValueAtTime(0.02 + 0.03 * level, t + 3);
  }

  /* ---------- bloques de construcción ---------- */
  function tone(freq, t0, dur, type, gain, dest) {
    if (!actx) return;
    const o = actx.createOscillator(); o.type = type || 'square'; o.frequency.value = freq;
    const g = actx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(gain || 0.08, t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(dest || master);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }
  function noiseHit(dest, t0, dur, gain, filterType, freq) {
    if (!actx) return;
    const s = actx.createBufferSource(); s.buffer = whiteBuf; s.loop = true;
    const f = actx.createBiquadFilter(); f.type = filterType || 'lowpass'; f.frequency.value = freq || 1000;
    const g = actx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(f); f.connect(g); g.connect(dest || master);
    s.start(t0); s.stop(t0 + dur + 0.05);
  }

  /* murmullo "voz" ininteligible: ruido pasa-banda con envolvente silábica */
  function murmur(dest, t0, dur, opt) {
    if (!actx) return;
    opt = opt || {};
    const s = actx.createBufferSource(); s.buffer = whiteBuf; s.loop = true;
    const bp = actx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = opt.q || 5;
    const steps = Math.max(4, Math.floor(dur * 3));
    const curve = new Float32Array(steps);
    const lo = opt.lo || 200, hi = opt.hi || 1100;
    for (let i = 0; i < steps; i++) curve[i] = lo + Math.random() * (hi - lo);
    try { bp.frequency.setValueCurveAtTime(curve, t0, dur); } catch (e) { bp.frequency.value = (lo + hi) / 2; }
    const g = actx.createGain(); g.gain.value = 0;
    const envSteps = Math.max(8, Math.floor(dur * 9));
    const env = new Float32Array(envSteps);
    for (let i = 0; i < envSteps; i++) env[i] = Math.random() < 0.62 ? (0.25 + Math.random() * 0.75) : 0.04;
    try { g.gain.setValueCurveAtTime(env, t0, dur); } catch (e) { g.gain.value = 0.3; }
    const out = actx.createGain(); out.gain.value = opt.gain || 0.16;
    s.connect(bp); bp.connect(g); g.connect(out); out.connect(dest || master);
    s.start(t0); s.stop(t0 + dur + 0.1);
  }
  function drone(dest, t0, dur, freq, gainAmt, type) {
    if (!actx) return;
    const o = actx.createOscillator(); o.type = type || 'sine'; o.frequency.value = freq;
    const g = actx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(gainAmt, t0 + dur * 0.35);
    g.gain.setValueAtTime(gainAmt, t0 + dur * 0.8);
    g.gain.linearRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(dest || master);
    o.start(t0); o.stop(t0 + dur + 0.1);
  }
  function noiseBed(dest, t0, dur, cut, gainAmt, brown) {
    if (!actx) return;
    const s = actx.createBufferSource(); s.buffer = brown ? brownBuf : whiteBuf; s.loop = true;
    const f = actx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = cut || 3000;
    const g = actx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(gainAmt, t0 + 0.4);
    g.gain.setValueAtTime(gainAmt, t0 + dur * 0.85);
    g.gain.linearRampToValueAtTime(0.0001, t0 + dur);
    s.connect(f); f.connect(g); g.connect(dest || master);
    s.start(t0); s.stop(t0 + dur + 0.1);
  }
  function heterodyne(dest, t0, dur, gainAmt) {
    if (!actx) return;
    const o = actx.createOscillator(); o.type = 'sine'; o.frequency.value = 1240;
    const l = actx.createOscillator(); l.type = 'sine'; l.frequency.value = 0.4;
    const lg = actx.createGain(); lg.gain.value = 180;
    l.connect(lg); lg.connect(o.frequency);
    const g = actx.createGain(); g.gain.value = gainAmt || 0.015;
    o.connect(g); g.connect(dest || master);
    o.start(t0); o.stop(t0 + dur); l.start(t0); l.stop(t0 + dur);
  }
  function tick(dest, t0, freq) { tone(freq || 1750, t0, 0.03, 'square', 0.06, dest); }
  function heartbeat(dest, t0, dur, gainAmt) {
    if (!actx) return;
    const beatT = 1.45;
    for (let t = 0; t < dur; t += beatT) {
      thump(t0 + t, gainAmt || 0.2); thump(t0 + t + 0.22, (gainAmt || 0.2) * 0.7);
    }
    function thump(tt, ga) {
      const o = actx.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(58, tt); o.frequency.exponentialRampToValueAtTime(38, tt + 0.14);
      const g = actx.createGain();
      g.gain.setValueAtTime(0.0001, tt); g.gain.linearRampToValueAtTime(ga, tt + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, tt + 0.16);
      o.connect(g); g.connect(dest || master); o.start(tt); o.stop(tt + 0.2);
    }
  }
  function whisperPan(dest, t0, dur) {
    if (!actx) return;
    const s = actx.createBufferSource(); s.buffer = whiteBuf; s.loop = true;
    const bp = actx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2600; bp.Q.value = 9;
    const g = actx.createGain(); g.gain.value = 0;
    const p = actx.createStereoPanner ? actx.createStereoPanner() : null;
    const steps = Math.floor(dur * 5);
    for (let i = 0; i < steps; i++) {
      const tt = t0 + (dur * i) / steps;
      g.gain.setValueAtTime(0.0001, tt);
      g.gain.linearRampToValueAtTime(0.02 + Math.random() * 0.05, tt + 0.08);
      g.gain.linearRampToValueAtTime(0.0001, tt + 0.24);
      if (p) p.pan.setValueAtTime(Math.random() * 2 - 1, tt);
    }
    s.connect(bp); bp.connect(g);
    if (p) { g.connect(p); p.connect(dest || master); } else { g.connect(dest || master); }
    s.start(t0); s.stop(t0 + dur);
  }

  /* ---------- SFX de interfaz ---------- */
  const S = {
    click() { if (!ok()) return; const t = now(); tone(950, t, 0.018, 'square', 0.045); noiseHit(null, t, 0.02, 0.02, 'highpass', 3000); },
    open() { if (!ok()) return; const t = now(); noiseHit(null, t, 0.07, 0.05, 'bandpass', 900); tone(520, t + 0.01, 0.05, 'square', 0.03); },
    close() { if (!ok()) return; const t = now(); noiseHit(null, t, 0.06, 0.04, 'bandpass', 600); tone(320, t + 0.01, 0.05, 'square', 0.03); },
    error() { if (!ok()) return; const t = now(); tone(200, t, 0.14, 'square', 0.07); tone(150, t + 0.16, 0.2, 'square', 0.07); },
    success() { if (!ok()) return; const t = now(); [523, 659, 784].forEach((f, i) => tone(f, t + i * 0.09, 0.16, 'square', 0.05)); },
    chime() { if (!ok()) return; const t = now(); [523, 659, 784, 1046].forEach((f, i) => tone(f, t + i * 0.12, 0.4, 'square', 0.045)); },
    hdd() { if (!ok()) return; const t = now(); let tt = t; const n = 3 + Math.floor(Math.random() * 4);
      for (let i = 0; i < n; i++) { noiseHit(null, tt, 0.05, 0.05 + Math.random() * 0.04, 'lowpass', 850 + Math.random() * 500); tt += 0.06 + Math.random() * 0.09; } },
    diskErr() { if (!ok()) return; const t = now(); [520, 430, 340].forEach((f, i) => tone(f, t + i * 0.14, 0.11, 'square', 0.06)); noiseHit(null, t + 0.45, 0.3, 0.05, 'lowpass', 700); },
    pop() { if (!ok()) return; tone(760 + Math.random() * 200, now(), 0.05, 'square', 0.06); },
    stab() { if (!ok()) return; const t = now(); [80, 84.5, 89].forEach(f => tone(f, t, 0.5, 'sawtooth', 0.09)); noiseHit(null, t, 0.4, 0.16, 'highpass', 1400); },
    tick() { if (!ok()) return; tick(null, now(), 1600); },
    ticks3() { if (!ok()) return; const t = now(); [0, 0.5, 1.0].forEach(d => tick(null, t + d, 1450)); },
    boop() { if (!ok()) return; tone(340, now(), 0.09, 'square', 0.05); },
    powerdown() { if (!ok()) return; const t = now(); const o = actx.createOscillator(); o.type = 'sawtooth';
      o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(28, t + 1.1);
      const g = actx.createGain(); g.gain.setValueAtTime(0.09, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + 1.3); },
    bsod() { if (!ok()) return; const t = now(); tone(160, t, 1.6, 'square', 0.06); noiseHit(null, t, 1.2, 0.1, 'lowpass', 500); }
  };

  /* voz de Disquetín (blips por carácter) */
  function dqBlip(stage) {
    if (!ok()) return;
    const t = now();
    const cfg = [
      { f: 740, j: 180, type: 'square' },
      { f: 600, j: 140, type: 'square' },
      { f: 380, j: 110, type: 'square' },
      { f: 210, j: 70, type: 'sawtooth' },
      { f: 95, j: 18, type: 'sawtooth' }
    ][Math.min(4, stage)] || { f: 700, j: 150, type: 'square' };
    tone(cfg.f + (Math.random() * 2 - 1) * cfg.j, t, 0.035, cfg.type, 0.035);
  }

  /* ---------- voz de la entidad (speechSynthesis con respaldo) ---------- */
  function speak(text, opt, onEnd) {
    opt = opt || {};
    let done = false;
    const finish = () => { if (!done) { done = true; if (onEnd) onEnd(); } };
    try {
      if (!window.speechSynthesis) throw 0;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'es-ES'; u.rate = opt.rate || 0.55; u.pitch = opt.pitch || 0.1; u.volume = muted ? 0 : Math.min(1, volume + 0.2);
      const vs = speechSynthesis.getVoices();
      const v = vs.find(vv => vv.lang && vv.lang.toLowerCase().indexOf('es') === 0);
      if (v) u.voice = v;
      u.onend = finish; u.onerror = finish;
      speechSynthesis.speak(u);
      setTimeout(finish, 1500 + text.length * 130);
      return;
    } catch (e) { /* respaldo */ }
    if (ok()) { const t = now(); drone(master, t, 1.4, 92, 0.08, 'sawtooth'); [92, 97, 88].forEach(f => tone(f, t + 0.1, 1.1, 'sawtooth', 0.05)); }
    setTimeout(finish, 1600);
  }

  /* ---------- reproductor de cintas ---------- */
  function stopTape() {
    if (currentTape) { try { currentTape.stop(); } catch (e) { } currentTape = null; }
  }
  function playTape(tape, handlers) {
    if (!ok()) return null;
    stopTape();
    handlers = handlers || {};
    const g = actx.createGain(); g.gain.value = 1;
    const an = actx.createAnalyser(); an.fftSize = 512;
    g.connect(an); an.connect(master);
    const t0 = now() + 0.08;
    const nodes = { sources: [], timer: null, cueIdx: 0, raf: null };
    const stop = () => {
      nodes.sources.forEach(s => { try { s.stop(); } catch (e) { } try { s.disconnect(); } catch (e) { } });
      if (nodes.timer) clearInterval(nodes.timer);
      try { g.disconnect(); } catch (e) { }
      if (currentTape === handle) currentTape = null;
    };
    const H = { tone, noiseHit, murmur, drone, noiseBed, heterodyne, tick, heartbeat, whisperPan, actx };
    tape.render(H, g, t0, tape.dur);
    nodes.timer = setInterval(() => {
      const el = now() - t0;
      if (el >= tape.dur) {
        stop(); if (handlers.onEnd) handlers.onEnd(); return;
      }
      const cues = tape.cues || [];
      while (nodes.cueIdx < cues.length && el >= cues[nodes.cueIdx].t) {
        if (handlers.onCue) handlers.onCue(cues[nodes.cueIdx].text);
        nodes.cueIdx++;
      }
    }, 120);
    const handle = { stop, analyser: an, t0, dur: tape.dur, gain: g };
    currentTape = handle;
    return handle;
  }

  /* ráfaga de estática visual-auditiva (sustos) */
  function staticBurst(dur, gainAmt) {
    if (!ok()) return;
    noiseHit(null, now(), dur || 0.45, gainAmt || 0.16, 'highpass', 900);
    tone(84, now(), dur || 0.45, 'square', (gainAmt || 0.16) * 0.5);
  }

  return { init, ok, now, setVolume, setMuted, isMuted, setDread, S, dqBlip, speak, playTape, stopTape, staticBurst, murmur, drone, noiseBed, tone };
})();
