/* ============================================================
   FRECUENCIA 84 — ui2.js
   Reproductor de cintas, correo, terminal, gestor de tareas
   ============================================================ */
window.F84 = window.F84 || {};

F84.ui2 = (function () {
  'use strict';
  const U = F84.U, core = F84.core, D = F84.data, audio = F84.audio, spr = F84.sprites;
  const wm = () => F84.ui.wm;

  /* ============ REPRODUCTOR DE CINTAS ============ */
  function fmtT(s) { const m = Math.floor(s / 60), ss = Math.floor(s % 60); return String(m).padStart(2, '0') + ':' + String(ss).padStart(2, '0'); }

  function openPlayer(f, fid) {
    const tape = F84.data2.TAPES[f.tape];
    let handle = null, raf = null, cueEl, timeEl, vuL, vuR, waveCv;
    wm().open({
      id: 'tape_' + fid, title: f.name + ' — Reproductor', icon: 'tape', w: 540, h: 510,
      onClose() { stop(); },
      content(body, win) {
        const w = U.el('div', 'player');
        w.appendChild(U.el('div', 'p-title', U.esc(f.name)));
        w.appendChild(U.el('div', 'p-meta', U.esc(tape.desc) + ' — ' + (f.meta.date || '') + ' — ' + fmtT(tape.dur)));
        const meters = U.el('div', 'p-meters');
        vuL = U.el('canvas', 'vu'); vuL.width = 26; vuL.height = 80;
        vuR = U.el('canvas', 'vu'); vuR.width = 26; vuR.height = 80;
        waveCv = U.el('canvas', 'wave'); waveCv.width = 380; waveCv.height = 80;
        meters.appendChild(vuL); meters.appendChild(waveCv); meters.appendChild(vuR);
        w.appendChild(meters);
        timeEl = U.el('div', 'p-time', '00:00 / ' + fmtT(tape.dur));
        w.appendChild(timeEl);
        const ctrl = U.el('div', 'p-ctrl');
        const bp = U.el('button', 'btn95', '▶ REPRODUCIR');
        const bs = U.el('button', 'btn95', '⏹ DETENER');
        ctrl.appendChild(bp); ctrl.appendChild(bs);
        w.appendChild(ctrl);
        cueEl = U.el('div', 'p-sub', '— pulsa REPRODUCIR —');
        w.appendChild(cueEl);
        body.appendChild(w);

        function metersLoop() {
          raf = requestAnimationFrame(metersLoop);
          if (!handle) return;
          try {
            const an = handle.analyser;
            const data = new Uint8Array(an.fftSize);
            an.getByteTimeDomainData(data);
            let sum = 0;
            for (let i = 0; i < data.length; i++) { const v = (data[i] - 128) / 128; sum += v * v; }
            const rms = Math.sqrt(sum / data.length);
            drawVU(vuL, rms); drawVU(vuR, rms * 0.82 + Math.random() * 0.05);
            const ctx = waveCv.getContext('2d');
            ctx.fillStyle = '#0c0e10'; ctx.fillRect(0, 0, 380, 80);
            ctx.strokeStyle = '#3fae6a'; ctx.lineWidth = 2; ctx.beginPath();
            for (let i = 0; i < data.length; i += 4) {
              const x = (i / data.length) * 380, y = 40 + ((data[i] - 128) / 128) * 38;
              i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.stroke();
            timeEl.textContent = fmtT(Math.max(0, audio.now() - handle.t0)) + ' / ' + fmtT(tape.dur);
          } catch (e) { }
        }
        function drawVU(cv, v) {
          const ctx = cv.getContext('2d');
          ctx.fillStyle = '#0c0e10'; ctx.fillRect(0, 0, 26, 80);
          const h = Math.min(78, Math.round(U.clamp(v * 3.2, 0, 1) * 78));
          for (let i = 0; i < h; i++) {
            const frac = i / 78;
            ctx.fillStyle = frac > 0.82 ? '#c02020' : frac > 0.6 ? '#d8a020' : '#3fae6a';
            ctx.fillRect(4, 78 - i, 18, 1);
          }
        }
        function play() {
          stop();
          audio.S.hdd();
          cueEl.textContent = '...';
          handle = audio.playTape(tape, {
            onCue(text) {
              cueEl.textContent = text || '';
              if (text) audio.S.tick();
            },
            onEnd() {
              stop();
              core.bus.emit('tape_end', { id: f.tape, fid });
            }
          });
          if (!raf) metersLoop();
        }
        function stop() {
          if (handle) { handle.stop(); handle = null; }
          if (raf) { cancelAnimationFrame(raf); raf = null; }
          timeEl.textContent = '00:00 / ' + fmtT(tape.dur);
          const wl = waveCv.getContext('2d');
          wl.fillStyle = '#0c0e10'; wl.fillRect(0, 0, 380, 80);
          drawVU(vuL, 0); drawVU(vuR, 0);
        }
        win.stop = stop;
        bp.addEventListener('click', play);
        bs.addEventListener('click', () => { stop(); cueEl.textContent = '— pulsa REPRODUCIR —'; });
        drawVU(vuL, 0); drawVU(vuR, 0);
      }
    });
  }

  function openPlayerEmpty() {
    wm().open({
      id: 'player_empty', title: 'Reproductor de Cintas', icon: 'player', w: 460, h: 240,
      content(body) {
        const w = U.el('div', 'player');
        w.appendChild(U.el('div', 'p-title', 'SIN CINTA CARGADA'));
        w.appendChild(U.el('div', 'p-meta', 'Abrí un archivo .wav desde una carpeta para reproducirlo.'));
        const sub = U.el('div', 'p-sub', 'consejo del manual: usar auriculares. «si lo oís fuerte, él se entera de que lo oís.»');
        w.appendChild(sub);
        body.appendChild(w);
      }
    });
  }

  /* ============ CORREO ÓRBITA ============ */
  function openMail() {
    wm().open({
      id: 'mail', title: 'Correo Órbita — JVANE', icon: 'mail', w: 680, h: 470,
      content(body, win) {
        if (core.flag('mail_logged')) renderMail(body, win);
        else renderLogin(body, win);
      }
    });
  }
  function renderLogin(body, win) {
    const M = F84.data2.MAIL;
    const w = U.el('div', 'mail-login');
    w.appendChild(U.el('div', null, '<b>CORREO ÓRBITA</b> — sin conexión desde 1997<br>El buzón local contiene mensajes sin leer.')).style.textAlign = 'center';
    let attempts = 0;
    const lf = U.el('div', 'lf');
    lf.appendChild(U.el('label', null, 'Usuario:'));
    const u = U.el('input', 'field95'); u.value = 'JVANE'; u.spellcheck = false;
    lf.appendChild(u);
    lf.appendChild(U.el('label', null, 'Contraseña:'));
    const p = U.el('input', 'field95'); p.type = 'password'; p.spellcheck = false;
    lf.appendChild(p);
    const err = U.el('div', 'pw-err');
    lf.appendChild(err);
    const bt = U.el('button', 'btn95', 'Conectar');
    bt.style.margin = '0 auto';
    lf.appendChild(bt);
    w.appendChild(lf);
    body.appendChild(w);
    setTimeout(() => p.focus(), 60);
    const submit = () => {
      if (U.normPw(u.value) !== M.user) { attempts++; audio.S.error(); err.textContent = 'Usuario incorrecto (¿o el usuario cambió?).'; return; }
      if (U.normPw(p.value) !== M.pass) {
        attempts++; audio.S.error();
        err.textContent = 'Contraseña incorrecta.';
        w.classList.remove('shake'); void w.offsetWidth; w.classList.add('shake');
        if (attempts >= 2) err.textContent = 'Pista: ' + M.hint;
        if (attempts === 2 && F84.disq) F84.disq.say(F84.data2.DQ.ctx.hint_mail, true);
        return;
      }
      core.setFlag('mail_logged');
      audio.S.success();
      if (F84.disq) F84.disq.say(F84.data2.DQ.ctx.mail_login, true);
      core.bus.emit('mail_logged');
      body.innerHTML = '';
      renderMail(body, win);
    };
    bt.addEventListener('click', submit);
    p.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
  }
  function renderMail(body, win) {
    const M = F84.data2.MAIL;
    const wrap = U.el('div', 'mail');
    const folders = U.el('div', 'mail-folders');
    const list = U.el('div', 'mail-list');
    const read = U.el('div', 'mail-read');
    wrap.appendChild(folders); wrap.appendChild(list); wrap.appendChild(read);
    body.appendChild(wrap);
    let curBox = 'bandeja';
    function renderFolders() {
      folders.innerHTML = '';
      [['bandeja', 'Bandeja de entrada'], ['enviados', 'Enviados']].forEach(b => {
        const d = U.el('div', null, b[1]);
        if (b[0] === curBox) d.classList.add('cur');
        d.addEventListener('click', () => { curBox = b[0]; audio.S.click(); renderFolders(); renderList(); read.innerHTML = '<div style="color:#999">— seleccioná un mensaje —</div>'; });
        folders.appendChild(d);
      });
      const comp = U.el('div', null, '✉ Redactar');
      comp.style.marginTop = '14px'; comp.style.color = '#555';
      comp.addEventListener('click', () => F84.ui.msgBox({ title: 'Redactar', icon: 'warn', text: 'Sin conexión desde 1997.<br>El borrador quedaría solo en el disco.<br>(Hay cosas que ya están solas en el disco.)' }));
      folders.appendChild(comp);
    }
    function renderList() {
      list.innerHTML = '';
      M.boxes[curBox].forEach(id => {
        const m = M.mails[id];
        const row = U.el('div', 'mrow' + (core.state.mailRead[id] ? '' : ' unread'));
        row.innerHTML = '<div class="from">' + U.esc(m.from) + '</div><div class="subj">' + U.esc(m.subj) + '</div><div class="date">' + U.esc(m.date) + '</div>';
        row.addEventListener('click', () => {
          audio.S.click();
          list.querySelectorAll('.mrow').forEach(r => r.classList.remove('cur'));
          row.classList.add('cur');
          readMail(id);
        });
        list.appendChild(row);
      });
    }
    function readMail(id) {
      const m = M.mails[id];
      read.innerHTML = '';
      const h = U.el('div', 'mh');
      h.innerHTML = '<b>' + U.esc(m.subj) + '</b><br>De: ' + U.esc(m.from) + ' — ' + U.esc(m.date);
      read.appendChild(h);
      read.appendChild(U.el('div', null, U.esc(m.body).replace(/\n/g, '<br>')));
      if (!core.state.mailRead[id]) {
        core.state.mailRead[id] = true; core.save();
        audio.S.hdd();
        core.bus.emit('mail_read', { id });
        renderList();
      }
    }
    renderFolders(); renderList();
    read.innerHTML = '<div style="color:#999">— seleccioná un mensaje —</div>';
  }

  /* ============ SÍMBOLO DEL SISTEMA ============ */
  function openTerminal() {
    wm().open({
      id: 'cmd', title: 'Símbolo del Sistema', icon: 'cmd', w: 600, h: 400,
      content(body, win) {
        const log = U.el('div', 'term');
        const rowIn = U.el('div', 'term-input-row');
        const ps = U.el('span', 'ps', 'C:\\ÓRBITA&gt; ');
        const inp = U.el('input'); inp.spellcheck = false; inp.autocomplete = 'off';
        rowIn.appendChild(ps); rowIn.appendChild(inp);
        body.appendChild(log); body.appendChild(rowIn);

        let cwd = 'root';
        const state = core.state;
        const print = (html, cls) => { const d = U.el('div', cls || null, html); log.appendChild(d); log.scrollTop = log.scrollHeight; };

        print('ÓRBITA [Versión 4.2.2es]');
        print('(C) Tecnología Órbita S.A. 1995. Todos los derechos, menos uno.');
        print('');
        print('Escribí <b>AYUDA</b> para ver comandos.', 'dimt');
        print('');

        const dirNames = {
          root: 'C:\\ÓRBITA', misdocs: 'C:\\ÓRBITA\\MIS DOC~1', cartas: 'C:\\ÓRBITA\\CARTAS',
          radio84: 'C:\\ÓRBITA\\RADIO-84', sector7: 'C:\\ÓRBITA\\RADIO-84\\SECTOR-7', papelera: 'C:\\ÓRBITA\\PAPELERA'
        };
        function prompt() { ps.textContent = dirNames[cwd] + '> '; }

        function runDir() {
          if (cwd === 'root') {
            print(' MIS DOC~1      <DIR>', 'in');
            print(' CARTAS         <DIR>', 'in');
            print(' RADIO-84       <DIR>  ' + (core.flag('unlock_radio84') ? '' : '[protegida]'), 'in');
            print(' PAPELERA       <DIR>', 'in');
            print(' LEER_PR~1 TXT      ' + (D.FILES.leer_primero.meta.size || '2 KB'), 'in');
            if (core.flag('puerta_visible')) print(' PUERTA   SYS     84 KB   <span class="err">¿?</span>', 'in');
          } else {
            const fo = D.FOLDERS[cwd];
            (fo.children || []).forEach(id => {
              const f = D.FILES[id]; if (!f) return;
              print(' ' + f.name.padEnd(20).slice(0, 20) + ' ' + (f.meta.size || ''), 'in');
            });
            if (cwd === 'radio84' && !core.flag('repair_sector7')) print(' SECTOR-7        <DIR>   <span class="err">[CORRUPTO]</span>', 'in');
          }
        }

        function exec(raw) {
          const line = raw.trim();
          if (!line) return;
          print('<span class="dimt">' + (dirNames[cwd]) + '&gt;</span> ' + U.esc(line), 'in');
          const parts = line.split(/\s+/);
          const cmd = parts[0].toUpperCase();
          const arg = parts.slice(1).join(' ');
          switch (cmd) {
            case 'AYUDA': case 'HELP':
              print('AYUDA — esta pantalla<br>DIR — listar directorio<br>CD [carpeta] — cambiar directorio (CD .. para volver)<br>VER — versión del sistema<br>FECHA — fecha del sistema<br>ECO [texto] — repetir texto<br>LIMPIAR — limpiar pantalla<br>SALIR — cerrar');
              break;
            case 'DIR': runDir(); break;
            case 'VER': print("ÓRBITA '95 — Versión 4.2.2es «Belisario»"); break;
            case 'FECHA': print('La fecha del sistema es incorrecta.'); print('El sistema cree que es 1997. El sistema está en paz con eso.', 'dimt'); break;
            case 'HORA': print('La hora del sistema no es una hora. Es un patrón de 84 minutos.', 'dimt'); break;
            case 'ECO': case 'ECHO':
              if (U.normNum(arg) === '84') print('84', 'err');
              else print(U.esc(arg) || 'ECO está activado.');
              break;
            case 'LIMPIAR': case 'CLS': log.innerHTML = ''; break;
            case 'SALIR': case 'EXIT': wm().close(win.id); return;
            case 'CD': {
              if (arg === '..' || arg === '/') { cwd = 'root'; prompt(); break; }
              const a = arg.toUpperCase().replace(/\\/g, '');
              const map = { 'MIS': 'misdocs', 'MISDOC~1': 'misdocs', 'MIS DOCUMENTOS': 'misdocs', 'CARTAS': 'cartas', 'RADIO-84': 'radio84', 'RADIO84': 'radio84', 'PAPELERA': 'papelera', 'SECTOR-7': 'sector7', 'SECTOR7': 'sector7' };
              const target = map[a] || (a === 'RADIO' ? 'radio84' : null);
              if (!target) { print('La ruta no existe: ' + U.esc(arg), 'err'); break; }
              if (target === 'radio84' && !core.flag('unlock_radio84')) { print('Acceso denegado: la carpeta está protegida con contraseña.', 'err'); print('Los candados no se abren desde acá.', 'dimt'); break; }
              if (target === 'sector7') {
                if (cwd !== 'radio84') { print('Primero entrá a RADIO-84.', 'err'); break; }
                if (!core.flag('repair_sector7')) { print('El directorio está corrupto. Ejecutá REGDISK.EXE.', 'err'); break; }
              }
              cwd = target; prompt();
              break;
            }
            case 'FORMAT':
              if (line.toUpperCase().indexOf('C:') >= 0) {
                print('El sistema está protegido contra formateo.', 'err');
                print('Hay un archivo abierto que no permite el desmontaje: PUERTA.SYS', 'dimt');
                print('(Si la puerta está abierta, respondé desde ella.)', 'dimt');
              } else print('Sintaxis: FORMAT C:', 'err');
              break;
            default:
              if (U.normNum(line) === '84') {
                const c = (state.flags.t84 || 0) + 1; state.flags.t84 = c; core.save();
                if (c === 1) print('……', 'dimt');
                else if (c === 2) { print('no lo llames.', 'err'); }
                else { if (state.settings.flashes) core.fx.micro(); print('DEJÁ DE MARCAR.', 'err'); }
              } else if (U.normPw(line) === 'OYENTE') {
                const c = (state.flags.tOyente || 0) + 1; state.flags.tOyente = c; core.save();
                if (c === 1) print('NO DEBES NOMBRARLO DOS VECES.', 'err');
                else { audio.S.stab(); if (state.settings.flashes) core.fx.micro(); core.addCorr(3); print('YA TE ESCUCHÉ TECLEAR.', 'err'); }
              } else print('Comando o nombre de archivo incorrecto: ' + U.esc(cmd), 'err');
          }
        }
        inp.addEventListener('keydown', e => {
          if (e.key === 'Enter') { audio.S.click(); exec(inp.value); inp.value = ''; log.scrollTop = log.scrollHeight; }
        });
        body.addEventListener('click', () => inp.focus());
        setTimeout(() => inp.focus(), 80);
      }
    });
  }

  /* ============ BSOD ============ */
  function bsod(cb) {
    const el = document.getElementById('bsod');
    if (!el) return;
    audio.S.bsod();
    el.innerHTML =
      '<span class="bs-head">ÓRBITA \'95</span><br><br>' +
      'Ha ocurrido un problema en el sistema:<br>' +
      'EXCEPCIÓN NO MANEJADA: SEÑAL_84_EN_RAM<br><br>' +
      '* Pulsá cualquier tecla para reiniciar el gestor.<br>' +
      '* Ponte cómodo. Él también lo está.<br><br>' +
      '<span style="opacity:.7">_ </span>';
    el.classList.add('show');
    const off = () => {
      el.classList.remove('show');
      window.removeEventListener('keydown', off);
      window.removeEventListener('pointerdown', off);
      if (cb) setTimeout(cb, 400);
    };
    setTimeout(() => {
      window.addEventListener('keydown', off);
      window.addEventListener('pointerdown', off);
    }, 900);
  }

  /* ============ GESTOR DE TAREAS ============ */
  const tm = {
    wave: null,
    open(manual) {
      wm().open({
        id: 'taskmgr', title: 'Gestor de tareas — Órbita', icon: 'gear', w: 520, h: 460,
        onClose(win) {
          if (tm.wave) { bsod(() => tm.open(false)); return false; }
        },
        content(body, win) {
          const w = U.el('div', 'tm');
          const table = U.el('table');
          table.innerHTML = '<thead><tr><th>Proceso</th><th>PID</th><th style="text-align:right">RAM</th></tr></thead>';
          const tbody = U.el('tbody');
          table.appendChild(tbody);
          const rambar = U.el('div', 'rambar'); rambar.appendChild(U.el('i'));
          const purge = U.el('div', 'purge'); purge.style.display = 'none';
          purge.innerHTML = 'PURGA.EXE instalándose: <i><b></b></i>';
          const ctrl = U.el('div', null);
          const kill = U.el('button', 'btn95', 'Finalizar tarea');
          kill.disabled = true;
          ctrl.appendChild(kill);
          const status = U.el('div', null, '— procesos del sistema —');
          status.style.fontSize = '17px';
          w.appendChild(table); w.appendChild(rambar); w.appendChild(purge); w.appendChild(ctrl); w.appendChild(status);
          body.appendChild(w);

          let sel = null;
          const st = {
            procs: [], timer: null, purge: 0, spawn: 0, manual: !!manual, done: false
          };
          const benign = [
            ['EXPLORADOR.EXE', 2.1], ['DISQUETIN.SYS', 1.4], ['RELOJ.EXE', 0.3],
            ['BLOCNOTA.EXE', 1.9], ['SONIDO95.DLL', 0.8], ['RATON.COM', 0.2]
          ];
          function seed(manualMode) {
            st.procs = [];
            benign.forEach((b, i) => st.procs.push({ name: b[0], pid: 100 + i * 7, ram: b[1], hostile: false }));
            if (manualMode && core.state.chapter >= 3) {
              st.procs.push({ name: 'SEÑAL.EXE', pid: 84, ram: 8.4, hostile: true });
            }
            if (!manualMode) {
              for (let i = 0; i < 2; i++) st.procs.push({ name: 'SEÑAL.EXE', pid: 84 + i, ram: 12 + Math.random() * 20, hostile: true });
              purge.style.display = 'block';
            }
            render();
          }
          function total() { return st.procs.reduce((a, p) => a + p.ram, 0); }
          function render() {
            tbody.innerHTML = '';
            const MAX = 9;
            st.procs.slice(0, MAX).forEach((p, i) => {
              const tr = U.el('tr', (p.hostile ? 'hostile ' : '') + (sel === i ? 'sel' : ''));
              tr.innerHTML = '<td>' + U.esc(p.name) + '</td><td>' + p.pid + '</td><td style="text-align:right">' + p.ram.toFixed(1) + ' MB</td>';
              tr.addEventListener('click', () => { sel = i; kill.disabled = false; render(); });
              tbody.appendChild(tr);
            });
            if (st.procs.length > MAX) {
              const tr = U.el('tr');
              tr.innerHTML = '<td colspan="3" style="color:#777">… y ' + (st.procs.length - MAX) + ' proceso(s) más</td>';
              tbody.appendChild(tr);
            }
            const t = total();
            rambar.querySelector('i').style.width = Math.min(100, (t / 512) * 100) + '%';
            rambar.classList.toggle('warn', t > 300 && t <= 420);
            rambar.classList.toggle('crit', t > 420);
            purge.querySelector('b').style.width = st.purge + '%';
            status.textContent = tm.wave ? 'RAM total: ' + t.toFixed(0) + ' MB / 512 MB — ¡finalizá los procesos SEÑAL!' : '— procesos del sistema —';
          }
          function tick() {
            if (st.done) return;
            if (tm.wave && !st.manual) {
              // oleada hostil
              st.procs.forEach(p => { if (p.hostile) p.ram += 2.5 + Math.random() * 6; });
              st.spawn -= 0.25;
              if (st.spawn <= 0) {
                st.spawn = Math.max(1.2, 3.4 - (st.purge / 100) * 2);
                st.procs.push({ name: 'SEÑAL.EXE', pid: 84 + Math.floor(Math.random() * 900), ram: 8 + Math.random() * 16, hostile: true });
                audio.S.tick();
              }
              st.purge = Math.min(100, st.purge + 100 / 160); // ~40 s a 4 ticks/s
              purge.querySelector('b').style.width = st.purge + '%';
              if (st.purge >= 100) { winWave(); return; }
              if (total() >= 512) {
                stopTimer();
                bsod(() => { st.purge = Math.max(0, st.purge - 15); seed(false); startTimer(); });
                return;
              }
            } else if (st.manual && core.state.chapter >= 3) {
              const h = st.procs.find(p => p.hostile);
              if (h) h.ram += 0.4 + Math.random() * 1.2;
            }
            render();
          }
          function startTimer() { st.timer = setInterval(tick, 250); }
          function stopTimer() { if (st.timer) clearInterval(st.timer); st.timer = null; }
          function winWave() {
            st.done = true; stopTimer();
            st.procs = st.procs.filter(p => !p.hostile);
            render();
            audio.S.success();
            const cb = tm.wave; tm.wave = null;
            purge.style.display = 'none';
            if (F84.disq) F84.disq.say(F84.data2.DQ.ctx.taskmgr_win, true);
            if (cb) setTimeout(cb, 1200);
          }
          kill.addEventListener('click', () => {
            if (sel === null || !st.procs[sel]) return;
            const p = st.procs[sel];
            if (p.hostile) {
              audio.S.pop(); core.fx.burst(0.12, 0.35);
              st.procs.splice(sel, 1);
              sel = null; kill.disabled = true;
              if (tm.wave && !st.manual) {
                // respawn
                setTimeout(() => {
                  if (tm.wave && !st.done) {
                    st.procs.push({ name: 'SEÑAL.EXE', pid: 84 + Math.floor(Math.random() * 900), ram: 8 + Math.random() * 10, hostile: true });
                    render();
                  }
                }, 1800);
              }
            } else {
              audio.S.error();
              status.textContent = 'No se puede finalizar ' + p.name + ': el proceso se niega con educación.';
              setTimeout(() => render(), 900);
              return;
            }
            render();
          });

          win.tmState = st;
          if (tm.wave) { st.manual = false; }
          seed(st.manual);
          startTimer();
          win.onCloseExtra = stopTimer;
          const origClose = win.opts.onClose;
          win.opts.onClose = (w2) => {
            stopTimer();
            if (tm.wave) { bsod(() => tm.open(false)); return false; }
            if (origClose) return origClose(w2);
          };
        }
      });
    },
    waveStart(cb) {
      // cerrar sin disparar el onClose de oleada
      const prev = tm.wave;
      tm.wave = null;
      F84.ui.wm.close('taskmgr');
      tm.wave = cb || prev;
      setTimeout(() => tm.open(false), 300);
    }
  };

  return { openPlayer, openPlayerEmpty, openMail, openTerminal, bsod, tm };
})();
