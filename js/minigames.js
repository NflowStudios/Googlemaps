/* ============================================================
   FRECUENCIA 84 — minigames.js
   REGDISK: reconstrucción de sectores (puzzle de nodos)
   INYECTOR: inyección de patrones de código
   ============================================================ */
window.F84 = window.F84 || {};

F84.mini = (function () {
  'use strict';
  const U = F84.U, core = F84.core, audio = F84.audio, spr = F84.sprites;

  /* ============ REGDISK — puzzle de nodos ============ */
  const N = 1, E = 2, S = 4, W = 8;
  const DX = { }, DY = { };
  DX[E] = 1; DX[W] = -1; DY[S] = 1; DY[N] = -1;
  const OPP = { 1: 4, 4: 1, 2: 8, 8: 2 };

  function regdisk() {
    if (core.flag('repair_sector7')) {
      F84.ui.msgBox({ title: 'REGDISK', icon: 'disk', text: 'No hay sectores dañados en la cola de reparación.<br>(Por ahora.)' });
      return;
    }
    F84.ui.wm.open({
      id: 'regdisk', title: 'REGDISK.EXE — Reconstructor de sectores', icon: 'disk', w: 480, h: 570,
      content(body, win) {
        const wrap = U.el('div', 'reg');
        const cv = U.el('canvas'); const GS = 6, TS = 58;
        cv.width = GS * TS; cv.height = GS * TS;
        const status = U.el('div', 'r-status', 'Sector 7 de 340.204 — reconectá el flujo de datos de <b>ORIGEN</b> a <b>DESTINO</b>.');
        const help = U.el('div', 'r-help', 'Clic en un nodo para rotarlo 90°. Los nodos rojos están corruptos: giran solos de vez en cuando.');
        wrap.appendChild(cv); wrap.appendChild(status); wrap.appendChild(help);
        body.appendChild(wrap);
        const ctx = cv.getContext('2d');

        // generación del camino
        const grid = [];
        for (let y = 0; y < GS; y++) { grid.push(new Array(GS).fill(0)); }
        const r0 = 1 + Math.floor(Math.random() * 4), r1 = 1 + Math.floor(Math.random() * 4);
        let cx = 0, cy = r0, dir = E;
        const path = [[0, r0]];
        grid[r0][0] |= E;
        let guard = 0;
        while (!(cx === GS - 1 && cy === r1) && guard++ < 200) {
          const r = Math.random();
          if (cx === GS - 1) { dir = cy < r1 ? S : cy > r1 ? N : E; }
          else if (r < 0.58) dir = E;
          else if (r < 0.79) dir = cy < GS - 1 && cy <= r1 ? S : N;
          else dir = cy > 0 && cy >= r1 ? N : S;
          const nx = cx + (DX[dir] || 0), ny = cy + (DY[dir] || 0);
          if (nx < 0 || ny < 0 || nx >= GS || ny >= GS) continue;
          if (path.some(p => p[0] === nx && p[1] === ny)) { dir = E; continue; }
          grid[cy][cx] |= dir;
          const oppIn = OPP[dir];
          grid[ny][nx] |= oppIn;
          cx = nx; cy = ny;
          path.push([nx, ny]);
        }
        grid[r0][0] = E;                    // origen
        grid[r1][GS - 1] = W;               // destino
        // relleno aleatorio
        const shapes = [N | E, E | S, S | W, W | N, N | S, E | W, N | E | S, E | S | W];
        for (let y = 0; y < GS; y++) for (let x = 0; x < GS; x++) {
          if ((x === 0 && y === r0) || (x === GS - 1 && y === r1)) continue;
          if (grid[y][x] === 0) grid[y][x] = Math.random() < 0.22 ? 0 : shapes[Math.floor(Math.random() * shapes.length)];
        }
        const isPath = (x, y) => path.some(p => p[0] === x && p[1] === y);
        // desordenar (sin tocar origen ni destino)
        for (let y = 0; y < GS; y++) for (let x = 0; x < GS; x++) {
          if ((x === 0 && y === r0) || (x === GS - 1 && y === r1)) continue;
          const r = Math.floor(Math.random() * 4);
          for (let i = 0; i < r; i++) grid[y][x] = ((grid[y][x] << 1) | (grid[y][x] >> 3)) & 15;
        }
        // si quedó resuelto de casualidad, girar un nodo más
        let guardFix = 0;
        while (solvedCheck() && guardFix++ < 20) {
          const fx = Math.floor(Math.random() * GS), fy = Math.floor(Math.random() * GS);
          if ((fx === 0 && fy === r0) || (fx === GS - 1 && fy === r1)) continue;
          if (!grid[fy][fx]) continue;
          grid[fy][fx] = ((grid[fy][fx] << 1) | (grid[fy][fx] >> 3)) & 15;
        }

        function rotate(m) { return ((m << 1) | (m >> 3)) & 15; }
        function reach() {
          const seen = new Set();
          const stack = [[0, r0]];
          seen.add('0,' + r0);
          while (stack.length) {
            const [x, y] = stack.pop();
            [N, E, S, W].forEach(d => {
              if (!(grid[y][x] & d)) return;
              const nx = x + (DX[d] || 0), ny = y + (DY[d] || 0);
              if (nx < 0 || ny < 0 || nx >= GS || ny >= GS) return;
              if (!(grid[ny][nx] & OPP[d])) return;
              const k = nx + ',' + ny;
              if (!seen.has(k)) { seen.add(k); stack.push([nx, ny]); }
            });
          }
          return seen;
        }
        function solvedCheck() { return reach().has((GS - 1) + ',' + r1); }

        let done = false;
        function draw() {
          const connected = reach();
          ctx.fillStyle = '#101418'; ctx.fillRect(0, 0, cv.width, cv.height);
          // rejilla
          ctx.strokeStyle = '#1c2329';
          for (let i = 0; i <= GS; i++) {
            ctx.beginPath(); ctx.moveTo(i * TS, 0); ctx.lineTo(i * TS, cv.height); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i * TS); ctx.lineTo(cv.width, i * TS); ctx.stroke();
          }
          for (let y = 0; y < GS; y++) for (let x = 0; x < GS; x++) {
            const m = grid[y][x];
            const cxp = x * TS + TS / 2, cyp = y * TS + TS / 2;
            const on = connected.has(x + ',' + y);
            const orig = (x === 0 && y === r0), dest = (x === GS - 1 && y === r1);
            if (!m && !orig && !dest) {
              ctx.fillStyle = '#3a1518'; ctx.fillRect(x * TS + 6, y * TS + 6, TS - 12, TS - 12);
              ctx.fillStyle = '#57232a';
              for (let i = 0; i < 5; i++) ctx.fillRect(x * TS + 8 + Math.random() * (TS - 16), y * TS + 8 + Math.random() * (TS - 16), 3, 3);
              continue;
            }
            ctx.lineWidth = 6; ctx.lineCap = 'round';
            ctx.strokeStyle = on ? '#3fae6a' : (isPath(x, y) ? '#7d7d74' : '#8f1d1d');
            const mid = { [N]: [cxp, cyp, cxp, y * TS], [E]: [cxp, cyp, (x + 1) * TS, cyp], [S]: [cxp, cyp, cxp, (y + 1) * TS], [W]: [cxp, cyp, x * TS, cyp] };
            [N, E, S, W].forEach(d => {
              if (m & d) { const l = mid[d]; ctx.beginPath(); ctx.moveTo(l[0], l[1]); ctx.lineTo(l[2], l[3]); ctx.stroke(); }
            });
            if (m) { ctx.fillStyle = on ? '#3fae6a' : '#8f1d1d'; ctx.fillRect(cxp - 5, cyp - 5, 10, 10); }
            if (orig) {
              ctx.fillStyle = on ? '#3fae6a' : '#d8a020';
              ctx.fillRect(x * TS + 6, y * TS + 6, TS - 12, TS - 12);
              ctx.fillStyle = '#101418'; ctx.font = 'bold 13px VT323, monospace'; ctx.textAlign = 'center';
              ctx.fillText('ORIGEN', cxp, cyp + 4);
            }
            if (dest) {
              ctx.strokeStyle = on ? '#3fae6a' : '#d8a020'; ctx.lineWidth = 3;
              ctx.strokeRect(x * TS + 8, y * TS + 8, TS - 16, TS - 16);
              ctx.fillStyle = on ? '#3fae6a' : '#d8a020'; ctx.font = 'bold 12px VT323, monospace'; ctx.textAlign = 'center';
              ctx.fillText('SECTOR', cxp, cyp - 2); ctx.fillText('7', cxp, cyp + 12);
            }
          }
        }
        cv.addEventListener('click', e => {
          if (done) return;
          const r = cv.getBoundingClientRect();
          const x = Math.floor(((e.clientX - r.left) / r.width) * GS);
          const y = Math.floor(((e.clientY - r.top) / r.height) * GS);
          if (x < 0 || y < 0 || x >= GS || y >= GS) return;
          if ((x === 0 && y === r0) || (x === GS - 1 && y === r1)) { audio.S.boop(); return; }
          grid[y][x] = rotate(grid[y][x]);
          audio.S.click();
          draw();
          if (solvedCheck()) winSeq();
        });
        function winSeq() {
          done = true;
          draw();
          audio.S.success(); audio.S.hdd();
          status.innerHTML = '<b>SECTOR RECONSTRUIDO.</b> Reindexando 3 archivos…';
          let flashes = 0;
          const iv = setInterval(() => {
            draw(); if (++flashes > 5) {
              clearInterval(iv);
              core.setFlag('repair_sector7');
              core.addCorr(6);
              F84.ui.wm.close('exp_radio84');
              core.bus.emit('repair_sector7');
              if (F84.disq) F84.disq.say(F84.data2.DQ.ctx.repair_sector, true);
              setTimeout(() => {
                F84.ui.wm.close(win.id);
                F84.ui.msgBox({
                  title: 'REGDISK — Completo', icon: 'disk',
                  text: 'Sector 7 reconstruido.<br>3 archivos recuperados en <b>C:\\RADIO-84\\SECTOR-7</b>:<br><br>04_grabacion_profunda.wav<br>mapa_senal.png<br>identidad_oyente.txt<br><br><span style="color:#8f1d1d">(uno de ellos late.)</span>'
                });
              }, 900);
            }
          }, 160);
        }
        // nodos malignos que giran solos
        const malign = setInterval(() => {
          if (done) { clearInterval(malign); return; }
          if (Math.random() < 0.4) {
            const x = Math.floor(Math.random() * GS), y = Math.floor(Math.random() * GS);
            if ((x === 0 && y === r0) || (x === GS - 1 && y === r1)) return;
            grid[y][x] = rotate(grid[y][x]);
            audio.S.tick();
            draw();
          }
        }, 4000);
        win.opts.onClose = () => { clearInterval(malign); };
        draw();
      }
    });
  }

  /* ============ INYECTOR — patrones ============ */
  /* container-based: se puede montar en una ventana o en el final */
  function injectorMount(el, opts, onWin) {
    opts = opts || {};
    const rounds = opts.rounds || 5;
    const hard = !!opts.hard;
    el.innerHTML = '';
    const w = U.el('div', 'iny');
    const roundLbl = U.el('div', 'i-round', '');
    const pattern = U.el('div', 'i-pattern');
    const timer = U.el('div', 'i-timer'); timer.appendChild(U.el('i'));
    const inp = U.el('input', 'field95'); inp.style.maxWidth = '300px';
    inp.placeholder = 'escribí el patrón y pulsá ENTER';
    inp.spellcheck = false;
    const lives = U.el('div', 'i-lives', '');
    const msg = U.el('div', null, ''); msg.style.minHeight = '26px'; msg.style.textAlign = 'center';
    w.appendChild(roundLbl); w.appendChild(pattern); w.appendChild(timer);
    w.appendChild(inp); w.appendChild(lives); w.appendChild(msg);
    if (opts.label) w.insertBefore(U.el('div', null, opts.label), roundLbl);
    el.appendChild(w);

    let round = 0, life = 2, tokens = [], lock = false, showTimer = null;

    function setLives() { lives.textContent = 'intentos: ' + '♦'.repeat(life); }
    function startRound() {
      round++;
      if (round > rounds) { win(); return; }
      roundLbl.textContent = 'RONDA ' + round + ' / ' + rounds + (hard ? ' — CANAL DIRECTO' : '');
      setLives();
      lock = true; inp.value = ''; inp.disabled = true;
      const len = 3 + round + (hard ? 1 : 0);
      tokens = [];
      const hex = '0123456789ABCDEF';
      for (let i = 0; i < len; i++) tokens.push(hex[Math.floor(Math.random() * 16)] + hex[Math.floor(Math.random() * 16)]);
      pattern.innerHTML = '';
      tokens.forEach(t => pattern.appendChild(U.el('b', null, t)));
      msg.textContent = 'memorizá el patrón…';
      const showMs = Math.max(1400, (hard ? 3200 : 4200) - round * 350);
      const bar = timer.querySelector('i');
      bar.style.transition = 'none'; bar.style.width = '100%';
      void bar.offsetWidth;
      bar.style.transition = 'width ' + showMs + 'ms linear'; bar.style.width = '0%';
      audio.S.chime();
      showTimer = setTimeout(() => {
        pattern.querySelectorAll('b').forEach(b => b.classList.add('hide'));
        msg.textContent = 'inyectá el patrón (ENTER para confirmar)';
        inp.disabled = false; lock = false;
        inp.focus();
      }, showMs);
    }
    function submit() {
      if (lock) return;
      const a = U.normPw(inp.value);
      const b = tokens.join('');
      if (a === b) {
        audio.S.success(); msg.textContent = '✔ patrón aceptado';
        msg.style.color = '#2f6b2f';
        setTimeout(startRound, 700);
      } else {
        life--; setLives();
        audio.S.error(); F84.core.fx.burst(0.15, 0.35);
        msg.style.color = '#8f1d1d';
        w.classList.remove('shake'); void w.offsetWidth; w.classList.add('shake');
        if (life <= 0) {
          msg.textContent = '✘ patrón perdido — el canal se cierra';
          lock = true; inp.disabled = true;
          setTimeout(() => { life = 2; round = 0; startRound(); }, 1600);
        } else {
          msg.textContent = '✘ error de inyección (' + (tokens.length) + ' bytes)';
          setTimeout(() => {
            pattern.querySelectorAll('b').forEach(x => x.classList.remove('hide'));
            msg.textContent = 'de nuevo. memorizá…';
            setTimeout(() => {
              pattern.querySelectorAll('b').forEach(x => x.classList.add('hide'));
              inp.value = ''; inp.focus();
            }, Math.max(1200, 2600 - round * 300));
          }, 800);
        }
      }
    }
    function win() {
      lock = true; inp.disabled = true;
      pattern.innerHTML = '';
      msg.style.color = '#2f6b2f';
      msg.textContent = '■ CÓDIGO INYECTADO COMPLETO ■';
      audio.S.success();
      if (onWin) setTimeout(onWin, 800);
    }
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
    startRound();
  }

  function injector() {
    F84.ui.wm.open({
      id: 'inyector', title: 'INYECTOR.EXE — Antivirus de señales', icon: 'iny', w: 500, h: 400,
      content(body) {
        injectorMount(body, { label: '<b>INYECTOR v1.4</b> — patrón de contra-código de J.V.' }, () => {
          if (F84.disq) F84.disq.say(F84.data2.DQ.ctx.injector_done, true);
          F84.ui.msgBox({ title: 'INYECTOR', icon: 'iny', text: 'Patrón estabilizado.<br>El canal quedó sellado... por ahora.' });
        });
      }
    });
  }

  function injectorForced(onWin) {
    F84.ui.wm.open({
      id: 'inyector', title: 'INYECTOR.EXE — Canal abierto', icon: 'iny', w: 500, h: 420,
      content(body) {
        injectorMount(body, { label: '<b>INYECTOR v1.4</b> — sellá el canal con el contra-código de J.V.<br><span style="color:#8f1d1d">la señal opone resistencia: memorizá rápido.</span>' }, onWin);
      }
    });
  }

  return { regdisk, injector, injectorForced, injectorMount };
})();
