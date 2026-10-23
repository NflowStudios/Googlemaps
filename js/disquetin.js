/* ============================================================
   FRECUENCIA 84 — disquetin.js
   El asistente Disquetín: sprite, animación, corrupción y diálogo
   ============================================================ */
window.F84 = window.F84 || {};

F84.disq = (function () {
  'use strict';
  const U = F84.U, core = F84.core, audio = F84.audio, spr = F84.sprites;

  let cv, ctx, bubble, lineEl;
  let t0 = performance.now();
  let blinkAt = 2500, blinking = false;
  let talking = false, talkFrame = 0, talkTimer = null;
  let queue = [], current = null, typeTimer = null, hideTimer = null;
  let frozenUntil = 0;
  let spinUntil = 0;
  const SCALE = 7; // 16px * 7 = 112

  function stage() { return core.dqStage(); }
  function corrLevel() { return [0, 0, 0.16, 0.5, 0.9][stage()] || 0; }

  function init() {
    const holder = document.getElementById('disquetin');
    cv = document.getElementById('disqCanvas');
    cv.width = 16 * SCALE; cv.height = 16 * SCALE;
    ctx = cv.getContext('2d');
    bubble = document.getElementById('disqBubble');
    lineEl = bubble.querySelector('.dq-line');
    holder.addEventListener('click', () => {
      audio.S.click();
      wiggle();
      if (!current && queue.length === 0) sayRandomIdle();
    });
    bubble.addEventListener('click', () => skipType());
    requestAnimationFrame(loop);
  }

  function wiggle() {
    spinUntil = performance.now() + 500;
  }

  function sayRandomIdle() {
    const st = stage();
    const lines = F84.data2.DQ.idle[st] || F84.data2.DQ.idle[1];
    if (core.state.post) {
      const post = core.state.post;
      if (post === 'A' && F84.data2.DQ.ctx.post_a.length) { say(U.rnd(F84.data2.DQ.ctx.post_a)); return; }
      if (post === 'B' && F84.data2.DQ.ctx.post_b.length) { say(U.rnd(F84.data2.DQ.ctx.post_b)); return; }
      if (post === 'C' && F84.data2.DQ.ctx.post_c.length) { say(U.rnd(F84.data2.DQ.ctx.post_c)); return; }
    }
    say(U.rnd(lines));
  }

  /* ---------- bucle de animación ---------- */
  function loop(t) {
    requestAnimationFrame(loop);
    if (!ctx) return;
    const frozen = t < frozenUntil;
    // congelarse por momentos en etapas altas
    if (!frozen && stage() >= 3 && Math.random() < 0.002) {
      frozenUntil = t + 800 + Math.random() * 1600;
    }
    if (frozen) { draw(lastFrame, 0); return; }

    const el = (t - t0) / 1000;
    let frame = spr.DQ.idle;
    if (talking && current) {
      frame = (talkFrame % 2 === 0) ? spr.DQ.talk1 : spr.DQ.talk2;
      if (t - talkTimer > 130) { talkFrame++; talkTimer = t; }
    }
    if (blinking) frame = spr.DQ.blink;
    if (stage() >= 4) frame = spr.DQ.scared;

    // parpadeo
    if (!talking && t > blinkAt) {
      blinking = true;
      if (t > blinkAt + 160) { blinking = false; blinkAt = t + 2200 + Math.random() * 3800; }
    }
    lastFrame = frame;

    const bob = (stage() >= 4) ? Math.sin(el * 1.1) * 2 : Math.sin(el * 2.2) * 4;
    const spin = t < spinUntil ? ((t - (spinUntil - 500)) / 500) * Math.PI * 2 : 0;
    draw(frame, bob, spin);
  }
  let lastFrame = null;

  function draw(frame, bob, spin) {
    frame = frame || spr.DQ.idle;
    ctx.clearRect(0, 0, cv.width, cv.height);
    let rows = frame;
    const lv = corrLevel();
    if (lv > 0 && Math.random() < 0.9) {
      rows = spr.corrupt(frame, lv);
    }
    ctx.save();
    ctx.translate(cv.width / 2, cv.height / 2 + (bob || 0));
    if (spin) ctx.rotate(spin);
    ctx.translate(-cv.width / 2, -cv.height / 2);
    const h = rows.length, w = rows[0] ? rows[0].length : 16;
    for (let y = 0; y < h; y++) {
      const row = rows[y] || '';
      for (let x = 0; x < row.length; x++) {
        const ch = row[x];
        if (ch === '.' || ch === ' ') continue;
        ctx.fillStyle = spr.PAL[ch] || '#f0f';
        ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
      }
    }
    ctx.restore();
  }

  /* ---------- diálogo ---------- */
  function say(text, autoHide) {
    if (!text) return;
    if (current) { if (queue.length < 3) queue.push({ text, autoHide }); return; }
    show(text, autoHide);
  }
  function sequence(lines, done) {
    lines.forEach(l => queue.push({ text: l, seq: true }));
    if (queue.length && !current) {
      const first = queue.shift();
      show(first.text, first.autoHide, first.seq);
    }
    seqDone = done || null;
  }
  let seqDone = null;

  function show(text, autoHide, seq) {
    current = { text, autoHide, seq };
    talking = true; talkFrame = 0; talkTimer = performance.now();
    bubble.classList.add('show');
    lineEl.textContent = '';
    const chars = text.split('');
    let i = 0;
    const speed = core.state.settings.fastText ? 9 : 20;
    clearInterval(typeTimer);
    typeTimer = setInterval(() => {
      if (i >= chars.length) {
        clearInterval(typeTimer);
        talking = false;
        const hold = Math.min(9000, 2400 + text.length * 55);
        hideTimer = setTimeout(() => next(), autoHide ? Math.min(9000, 2600 + text.length * 45) : hold);
        return;
      }
      lineEl.textContent += chars[i];
      if (i % 2 === 0 && chars[i] !== ' ') audio.dqBlip(stage() - 1);
      i++;
    }, speed);
  }
  function next() {
    current = null;
    if (queue.length) {
      const nx = queue.shift();
      show(nx.text, nx.autoHide, nx.seq);
    } else {
      bubble.classList.remove('show');
      if (seqDone) { const d = seqDone; seqDone = null; setTimeout(d, 300); }
    }
  }
  function skipType() {
    if (current && typeTimer) {
      clearInterval(typeTimer);
      lineEl.textContent = current.text;
      talking = false;
      clearTimeout(hideTimer);
      hideTimer = setTimeout(next, 700);
    }
  }

  /* ---------- ayuda contextual ---------- */
  function help() {
    const f = core.flag.bind(core);
    let line = null;
    if (!f('read_leer_primero')) line = 'CONSEJO AMIGABLE N.º 1: leé LEER_PRIMERO.TXT. Fue lo último que escribió... alguien.';
    else if (!f('unlock_radio84')) line = F84.data2.DQ.ctx.hint_dates;
    else if (!f('repair_sector7')) line = 'la carpeta SECTOR-7 está dañada. REGDISK.EXE reconstruye sectores. ¡yo confío en vos!';
    else if (!f('tape_rec4')) line = 'la cinta 04 se llama «la profunda». no se escucha de día. escuchala igual.';
    else if (!f('mail_logged')) line = F84.data2.DQ.ctx.hint_mail;
    else if (!f('puerta_visible')) line = 'leé todo el correo. sobre todo lo que no debería existir.';
    else if (!core.state.post) line = F84.data2.DQ.ctx.hint_puerta;
    else line = U.rnd(['todo terminó. todo sigue.', 'gracias por jugar conmigo. «jugar». qué palabra elegí.', '¿volvemos a empezar? yo no recuerdo el inicio. vos sí.']);
    say(line);
  }

  /* pistas automáticas si el jugador se atasca */
  function startHints() {
    let lastHint = Date.now();
    setInterval(() => {
      if (Date.now() - lastHint < 180000) return;
      if (current || queue.length) return;
      if (document.hidden || core.state.post) return;
      const f = core.flag.bind(core);
      let line = null;
      if (core.state.chapter === 1 && f('read_leer_primero') && !f('unlock_radio84')) line = F84.data2.DQ.ctx.hint_dates;
      else if (core.state.chapter === 2 && f('unlock_radio84') && !f('repair_sector7')) line = 'REGDISK.EXE está dentro de RADIO-84. los sectores dañados no se arreglan solos. ¡ojalá!';
      else if (core.state.chapter === 3 && !f('mail_logged')) line = F84.data2.DQ.ctx.hint_mail;
      else if (core.state.chapter === 4 && !f('puerta_open')) line = F84.data2.DQ.ctx.hint_puerta;
      if (line) { say(line, true); lastHint = Date.now(); }
    }, 45000);
  }

  return { init, say, sequence, help, startHints, skipType, isTalking: () => !!current };
})();
