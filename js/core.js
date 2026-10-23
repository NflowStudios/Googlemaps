/* ============================================================
   FRECUENCIA 84 — core.js
   Estado, guardado, corrupción, eventos de terror, utilidades
   ============================================================ */
window.F84 = window.F84 || {};

F84.U = (function () {
  'use strict';
  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function normPw(s) { return String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }
  function normNum(s) { return String(s || '').replace(/[^0-9]/g, ''); }
  return { el, esc, clamp, rnd, normPw, normNum };
})();

F84.core = (function () {
  'use strict';
  const U = F84.U;
  const SAVE_KEY = 'f84_save_v2';

  const DEFAULTS = {
    savever: 2,
    chapter: 1,
    corr: 0,
    flags: {},
    endings: [],
    post: null,
    mailRead: {},
    settings: { crt: true, flashes: true, fastText: false, vol: 0.8, voice: true },
    started: false
  };
  let state = JSON.parse(JSON.stringify(DEFAULTS));

  /* ---------- bus ---------- */
  const busMap = {};
  const bus = {
    on(ev, fn) { (busMap[ev] = busMap[ev] || []).push(fn); },
    emit(ev, data) { (busMap[ev] || []).forEach(fn => { try { fn(data); } catch (e) { console.error(e); } }); }
  };

  /* ---------- guardado ---------- */
  /* IMPORTANTE: load()/wipe() MUTAN el objeto state existente (nunca lo
     reasignan) para que la referencia exportada en F84.core.state siga
     siendo válida para todos los módulos. */
  function save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) { }
  }
  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const s = JSON.parse(raw);
      if (!s || s.savever !== 2) return false;
      Object.keys(state).forEach(k => delete state[k]);
      Object.assign(state, JSON.parse(JSON.stringify(DEFAULTS)), s);
      state.settings = Object.assign({}, DEFAULTS.settings, s.settings || {});
      return true;
    } catch (e) { return false; }
  }
  function wipe() {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) { }
    Object.keys(state).forEach(k => delete state[k]);
    Object.assign(state, JSON.parse(JSON.stringify(DEFAULTS)));
  }
  function hasSave() { try { return !!localStorage.getItem(SAVE_KEY); } catch (e) { return false; } }

  /* ---------- flags / once ---------- */
  function flag(k) { return !!state.flags[k]; }
  function setFlag(k, v) { state.flags[k] = (v === undefined ? true : v); save(); }
  function once(key, fn) {
    const k = 'once_' + key;
    if (state.flags[k]) return;
    state.flags[k] = true; save();
    try { fn(); } catch (e) { console.error(e); }
  }

  /* ---------- etapa de Disquetín ---------- */
  function dqStage() {
    let s = U.clamp(state.chapter, 1, 4);
    if (state.corr >= 45 && s < 2) s = 2;
    if (state.corr >= 70 && s < 3) s = 3;
    if (state.post === 'B') s = 4;
    return s;
  }

  /* ---------- corrupción ---------- */
  function setCorr(n) {
    state.corr = U.clamp(n, 0, 100);
    const lvl = state.corr < 15 ? 1 : state.corr < 30 ? 2 : state.corr < 55 ? 3 : state.corr < 80 ? 4 : 5;
    document.body.classList.remove('corr-1', 'corr-2', 'corr-3', 'corr-4', 'corr-5');
    document.body.classList.add('corr-' + lvl);
    if (F84.audio.ok) F84.audio.setDread(state.corr / 100);
    save();
    bus.emit('corr', state.corr);
  }
  function addCorr(n) { setCorr(state.corr + n); }

  /* ---------- capítulos ---------- */
  function setChapter(n, opts) {
    if (n <= state.chapter && !(opts && opts.force)) return;
    state.chapter = n;
    save();
    bus.emit('chapter', n);
  }

  /* ---------- ajustes ---------- */
  function applySettings() {
    const s = state.settings;
    document.body.classList.toggle('crt-off', !s.crt);
    document.body.classList.toggle('flashes-off', !s.flashes);
    if (F84.audio.ok) F84.audio.setVolume(s.vol);
    save();
  }

  /* ---------- efectos visuales ---------- */
  const fx = {
    burst(dur, intensity) {
      if (!state.settings.flashes && intensity > 0.3) dur = Math.min(dur, 0.12);
      const cv = document.getElementById('fxCanvas');
      if (!cv) return;
      const ctx = cv.getContext('2d');
      cv.style.display = 'block';
      const W = 160, H = 100;
      cv.width = W; cv.height = H;
      const img = ctx.createImageData(W, H);
      const t0 = performance.now();
      const ms = dur * 1000;
      (function frame(t) {
        const el = t - t0;
        const fade = Math.max(0, 1 - el / ms);
        const d = img.data;
        for (let i = 0; i < d.length; i += 4) {
          const v = Math.random() * 255;
          d[i] = v; d[i + 1] = v; d[i + 2] = v; d[i + 3] = Math.floor(235 * fade * intensity);
        }
        ctx.putImageData(img, 0, 0);
        if (el < ms) requestAnimationFrame(frame);
        else { cv.style.display = 'none'; ctx.clearRect(0, 0, W, H); }
      })(t0);
    },
    bigGlitch() {
      if (document.body.classList.contains('bigglitch')) return;
      document.body.classList.add('bigglitch');
      F84.audio.staticBurst(0.4, 0.18);
      fx.burst(0.38, 0.7);
      setTimeout(() => document.body.classList.remove('bigglitch'), 420);
    },
    micro() {
      F84.audio.staticBurst(0.18, 0.1);
      fx.burst(0.14, 0.4);
    }
  };

  /* ---------- reloj ---------- */
  const clock = {
    base: new Date('1997-04-12T21:33:00').getTime(),
    t0: Date.now(),
    timer: null,
    start() {
      if (clock.timer) clearInterval(clock.timer);
      clock.t0 = Date.now();
      clock.timer = setInterval(clock.tick, 1000);
      clock.tick();
    },
    tick() {
      const c = document.getElementById('clock');
      if (!c) return;
      if (state.corr >= 30 && Math.random() < 0.02) {
        c.textContent = '84:84';
        c.classList.add('glitch');
        setTimeout(() => { c.classList.remove('glitch'); clock.tick(true); }, 700);
        return;
      }
      const d = new Date(clock.base + (Date.now() - clock.t0));
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const mo = String(d.getMonth() + 1).padStart(2, '0');
      c.textContent = hh + ':' + mm + '  ' + dd + '/' + mo + '/97';
      c.title = 'El reloj del sistema funciona. Más o menos.';
    }
  };

  /* ---------- eventos de terror ambientales ---------- */
  const scares = {
    last: 0,
    cooldown: 100,
    go(force) {
      const now = Date.now();
      if (!force && now - scares.last < scares.cooldown * 1000) return;
      if (document.body.classList.contains('finale')) return;
      scares.last = now;
      scares.cooldown = 70 + Math.random() * 60;
      const pool = [];
      if (F84.ui && state.chapter >= 2) pool.push('sinTitulo', 'static', 'disqWhisper');
      if (state.chapter >= 3) pool.push('clock84', 'title', 'wallMsg');
      if (!pool.length) return;
      const ev = U.rnd(pool);
      try { scares['ev_' + ev](); } catch (e) { }
    },
    ev_sinTitulo() {
      const F = F84.ui;
      if (!F || !F.wm) return;
      const txt = U.rnd(F84.data2.SCARE_TEXTS);
      const w = F.wm.open({
        title: 'Sin título', w: 300, h: 150,
        x: 90 + Math.random() * 260, y: 70 + Math.random() * 160,
        content(body, win) {
          const wrap = U.el('div', 'msgwrap');
          wrap.appendChild(F84.sprites.iconEl('err', 40)).className = 'micon';
          wrap.querySelector('.micon').style.width = '40px';
          const t = U.el('div', 'mtext', U.esc(txt));
          t.style.color = '#8f1d1d';
          wrap.appendChild(t);
          body.appendChild(wrap);
          setTimeout(() => { try { F.wm.close(win.id); } catch (e) { } }, 8000);
        }
      });
    },
    ev_static() { fx.micro(); },
    ev_disqWhisper() {
      if (F84.disq) F84.disq.say(F84.core.dqStage() >= 3 ? '...' : U.rnd(['...', '¿hola?', 'alguien tecleó.', 'ese zumbido no era yo.']), true);
    },
    ev_clock84() {
      const c = document.getElementById('clock');
      if (!c) return;
      c.textContent = '84:84'; c.classList.add('glitch');
      F84.audio.S.tick();
      setTimeout(() => c.classList.remove('glitch'), 900);
    },
    ev_title() {
      const old = document.title;
      document.title = U.rnd(F84.data2.TITLE_FLICKERS);
      setTimeout(() => { document.title = old; }, 2500);
    },
    ev_wallMsg() {
      const wm = document.getElementById('wallMsg');
      if (!wm || wm.dataset.used) return;
      wm.dataset.used = '1';
      wm.textContent = 'el pozo está abierto';
      wm.style.opacity = '1';
      setTimeout(() => { wm.style.opacity = '0'; }, 9000);
    },
    start() {
      setInterval(() => {
        if (document.hidden) return;
        const p = Math.min(0.55, 0.06 + state.corr / 200);
        if (Math.random() < p) scares.go();
      }, 15000);
    }
  };

  /* ---------- salvapantallas ---------- */
  const saver = {
    lastInput: Date.now(),
    active: false,
    lastShown: 0,
    init() {
      ['pointermove', 'pointerdown', 'keydown'].forEach(ev =>
        window.addEventListener(ev, () => {
          saver.lastInput = Date.now();
          if (saver.active) saver.hide();
        }, { passive: true }));
      setInterval(saver.check, 5000);
    },
    check() {
      if (saver.active) return;
      if (state.chapter < 3 || state.post || document.body.classList.contains('finale')) return;
      if (Date.now() - saver.lastInput < 75000) return;
      if (Date.now() - saver.lastShown < 240000) return;
      saver.show();
    },
    show() {
      const s = document.getElementById('saver');
      if (!s) return;
      saver.active = true; saver.lastShown = Date.now();
      const n = s.querySelector('.s84');
      if (n) { n.style.animation = 'none'; void n.offsetWidth; n.style.animation = ''; }
      s.classList.add('show');
      F84.audio.S.tick();
    },
    hide() {
      const s = document.getElementById('saver');
      if (s) s.classList.remove('show');
      saver.active = false;
      if (state.settings.flashes) fx.micro();
    }
  };

  /* ---------- trampa del foco (pestaña) ---------- */
  function initTitleTrick() {
    let original = document.title;
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && state.chapter >= 3 && !state.post) {
        document.title = 'volvé';
      } else {
        document.title = original;
        if (!document.hidden && state.chapter >= 3 && Math.random() < 0.4 && state.settings.flashes) {
          setTimeout(() => fx.micro(), 300);
        }
      }
    });
  }

  return {
    state, bus, save, load, wipe, hasSave, flag, setFlag, once,
    dqStage, setCorr, addCorr, setChapter, applySettings, fx, clock, scares, saver,
    initTitleTrick
  };
})();
