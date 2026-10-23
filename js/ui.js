/* ============================================================
   FRECUENCIA 84 — ui.js
   Gestor de ventanas, escritorio, taskbar, explorador, bloc de
   notas, visor, Mi PC y configuración
   ============================================================ */
window.F84 = window.F84 || {};

F84.ui = (function () {
  'use strict';
  const U = F84.U, core = F84.core, D = F84.data, audio = F84.audio, spr = F84.sprites;

  /* ============ GESTOR DE VENTANAS ============ */
  let seq = 0;
  const wm = {
    z: 60,
    wins: new Map(),
    layer: null,
    init() { wm.layer = document.getElementById('windowsLayer'); },
    open(opts) {
      if (opts.id && wm.wins.has(opts.id)) { wm.focus(opts.id); return wm.wins.get(opts.id); }
      const id = opts.id || 'w' + (++seq);
      const el = U.el('div', 'win');
      const w = opts.w || 480, h = opts.h || 360;
      const n = wm.wins.size;
      const x = opts.x !== undefined ? opts.x : Math.min(70 + n * 26, 300);
      const y = opts.y !== undefined ? opts.y : Math.min(40 + n * 24, 190);
      el.style.width = w + 'px'; el.style.height = h + 'px';
      el.style.left = x + 'px'; el.style.top = y + 'px';
      el.dataset.id = id;

      const tb = U.el('div', 'titlebar');
      const ico = spr.iconEl(opts.icon || 'txt', 18); ico.className = 't-ico';
      tb.appendChild(ico);
      tb.appendChild(U.el('div', 't-title', U.esc(opts.title || 'Ventana')));
      const btns = U.el('div', 't-btns');
      const bMin = U.el('button', 't-btn', '<span class="glyph">_</span>'); bMin.title = 'Minimizar';
      const bCls = U.el('button', 't-btn close', '<span class="glyph">×</span>'); bCls.title = 'Cerrar';
      btns.appendChild(bMin); btns.appendChild(bCls);
      tb.appendChild(btns);

      const body = U.el('div', 'win-body');
      el.appendChild(tb); el.appendChild(body);
      wm.layer.appendChild(el);

      const win = { id, el, body, opts, min: false };
      wm.wins.set(id, win);

      // eventos
      el.addEventListener('pointerdown', () => wm.focus(id));
      bCls.addEventListener('click', e => { e.stopPropagation(); wm.close(id); });
      bMin.addEventListener('click', e => { e.stopPropagation(); wm.minimize(id); });
      wm.drag(el, tb);

      // botón de taskbar
      const tbtn = U.el('button', 'taskbtn', U.esc(opts.title || 'Ventana'));
      tbtn.addEventListener('click', () => {
        const ww = wm.wins.get(id); if (!ww) return;
        if (ww.min) { wm.restore(id); } else if (el.classList.contains('focused')) { wm.minimize(id); } else { wm.focus(id); }
      });
      document.getElementById('taskWins').appendChild(tbtn);
      win.tbtn = tbtn;

      wm.focus(id);
      audio.S.open(); audio.S.hdd();
      if (opts.content) opts.content(body, win);
      return win;
    },
    close(id) {
      const win = wm.wins.get(id);
      if (!win) return;
      if (win.opts && win.opts.onClose) { try { win.opts.onClose(win); } catch (e) { } }
      win.el.remove(); win.tbtn.remove();
      wm.wins.delete(id);
      audio.S.close();
    },
    closeAll() { Array.from(wm.wins.keys()).forEach(id => wm.close(id)); },
    focus(id) {
      const win = wm.wins.get(id); if (!win) return;
      wm.wins.forEach(w => { w.el.classList.remove('focused'); w.tbtn.classList.remove('active'); });
      win.el.classList.add('focused'); win.tbtn.classList.add('active');
      win.el.style.zIndex = ++wm.z;
      if (win.min) wm.restore(id);
    },
    minimize(id) {
      const win = wm.wins.get(id); if (!win) return;
      win.min = true; win.el.style.display = 'none'; win.tbtn.classList.remove('active');
    },
    restore(id) {
      const win = wm.wins.get(id); if (!win) return;
      win.min = false; win.el.style.display = 'flex'; wm.focus(id);
    },
    drag(el, handle) {
      handle.addEventListener('pointerdown', e => {
        if (e.target.closest('.t-btn')) return;
        const layerR = wm.layer.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        const ox = e.clientX - r.left, oy = e.clientY - r.top;
        handle.setPointerCapture(e.pointerId);
        const mv = ev => {
          let nx = ev.clientX - layerR.left - ox, ny = ev.clientY - layerR.top - oy;
          nx = U.clamp(nx, -r.width + 70, layerR.width - 60);
          ny = U.clamp(ny, 0, layerR.height - 28);
          el.style.left = nx + 'px'; el.style.top = ny + 'px';
        };
        const up = () => { handle.removeEventListener('pointermove', mv); handle.removeEventListener('pointerup', up); };
        handle.addEventListener('pointermove', mv);
        handle.addEventListener('pointerup', up);
      });
    }
  };

  /* ============ DIÁLOGOS ============ */
  function msgBox(o) {
    const w = wm.open({
      title: o.title || 'Órbita \'95', icon: o.icon || 'info', w: o.w || 380, h: 170,
      content(body, win) {
        const wrap = U.el('div', 'msgwrap');
        const ic = spr.iconEl(o.icon || 'info', 44); ic.className = 'micon';
        wrap.appendChild(ic);
        wrap.appendChild(U.el('div', 'mtext', o.text));
        const row = U.el('div', 'mrow');
        (o.buttons || [{ label: 'Aceptar' }]).forEach(b => {
          const bt = U.el('button', 'btn95', U.esc(b.label));
          bt.addEventListener('click', () => { wm.close(win.id); if (b.cb) b.cb(); });
          row.appendChild(bt);
        });
        wrap.appendChild(row);
        body.appendChild(wrap);
      }
    });
    return w;
  }

  function pwDialog(o) {
    // o: {title, icon, label, hint, validate(input)->true|errorMsg, disqHintKey}
    let attempts = 0;
    const win = wm.open({
      title: o.title || 'Protegido', icon: o.icon || 'lock', w: 380, h: 230,
      content(body, win) {
        const wrap = U.el('div', 'msgwrap');
        wrap.style.padding = '10px';
        const ic = spr.iconEl('lock', 40);
        wrap.appendChild(ic);
        wrap.appendChild(U.el('div', 'mtext', o.label || 'Escribí la contraseña:'));
        const inp = U.el('input', 'field95'); inp.type = 'text'; inp.autocomplete = 'off';
        inp.style.maxWidth = '260px'; inp.spellcheck = false;
        wrap.appendChild(inp);
        const err = U.el('div', 'pw-err');
        wrap.appendChild(err);
        const row = U.el('div', 'mrow');
        const ok = U.el('button', 'btn95', 'Aceptar');
        const ca = U.el('button', 'btn95', 'Cancelar');
        row.appendChild(ok); row.appendChild(ca);
        wrap.appendChild(row);
        body.appendChild(wrap);
        setTimeout(() => inp.focus(), 60);

        const submit = () => {
          const res = o.validate(inp.value);
          if (res === true) { wm.close(win.id); if (o.onOk) o.onOk(); return; }
          attempts++;
          audio.S.error();
          err.textContent = res || 'Contraseña incorrecta.';
          wrap.classList.remove('shake'); void wrap.offsetWidth; wrap.classList.add('shake');
          inp.select();
          if (attempts >= 2 && o.hint) err.textContent += ' — ' + o.hint;
          if (attempts === 2 && F84.disq && o.disqHintKey) F84.disq.say(F84.data2.DQ.ctx[o.disqHintKey] || '', true);
        };
        ok.addEventListener('click', submit);
        ca.addEventListener('click', () => wm.close(win.id));
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
      }
    });
    return win;
  }

  /* ============ ESCRITORIO ============ */
  const desktop = {
    sel: null,
    render() {
      const layer = document.getElementById('icons');
      layer.innerHTML = '';
      D.DESKTOP.forEach(id => desktop.addIcon(id));
      if (core.flag('puerta_visible')) desktop.addIcon('puerta_sys');
      desktop.refreshIcons();
    },
    addIcon(fid) {
      let icon, name;
      if (D.APPS[fid]) { icon = D.APPS[fid].icon; name = D.APPS[fid].name; }
      else if (D.FOLDERS[fid]) { icon = desktop.iconFor(fid); name = D.FOLDERS[fid].name; }
      else { const f = D.FILES[fid]; if (!f) return; icon = desktop.iconFor(fid); name = f.name; }
      const el = U.el('div', 'dicon'); el.dataset.fid = fid;
      const cv = spr.iconEl(icon, 48);
      el.appendChild(cv);
      el.appendChild(U.el('span', null, U.esc(name)));
      el.addEventListener('click', e => { e.stopPropagation(); desktop.select(el); audio.S.click(); });
      el.addEventListener('dblclick', () => desktop.open(fid));
      document.getElementById('icons').appendChild(el);
    },
    iconFor(fid) {
      if (D.FOLDERS[fid]) {
        if (fid === 'radio84') return core.flag('unlock_radio84') ? 'folder' : 'folderLock';
        return D.FOLDERS[fid].icon;
      }
      const f = D.FILES[fid];
      if (!f) return 'txt';
      if (f.type === 'wav') return 'tape';
      return f.icon;
    },
    select(el) {
      document.querySelectorAll('.dicon').forEach(d => d.classList.remove('sel'));
      if (el) { el.classList.add('sel'); desktop.sel = el.dataset.fid; }
    },
    open(fid) {
      audio.S.click();
      if (D.APPS[fid]) { openApp(D.APPS[fid].app); return; }
      if (D.FOLDERS[fid]) { openFolderOrDialog(fid); return; }
      const f = D.FILES[fid];
      if (!f) return;
      if (fid === 'puerta_sys') { openPuerta(); return; }
      if (f.type === 'exe') { launchExe(f, fid); return; }
      openFile(fid);
    },
    refreshIcons() {
      const r84 = document.querySelector('.dicon[data-fid="radio84"]');
      if (r84 && core.flag('unlock_radio84')) {
        const cv = r84.querySelector('canvas');
        const nw = spr.iconEl('folder', 48);
        cv.getContext('2d').drawImage(nw, 0, 0);
      }
    }
  };

  /* apertura genérica de archivos */
  function openFile(fid) {
    const f = D.FILES[fid];
    if (!f) return;
    core.setFlag('read_' + fid);
    core.bus.emit('read', { id: fid });
    if (f.type === 'txt') openNotepad(f, fid);
    else if (f.type === 'img') openViewer(f, fid);
    else if (f.type === 'wav') F84.ui2.openPlayer(f, fid);
  }

  function launchExe(f, fid) {
    core.setFlag('read_' + fid);
    core.bus.emit('exe', { id: fid });
    if (f.app === 'regdisk') {
      if (!core.flag('repair_sector7') && core.flag('unlock_radio84')) F84.mini.regdisk();
      else msgBox({ title: 'REGDISK', icon: 'disk', text: 'No hay sectores dañados en la cola de reparación.<br>(Por ahora.)' });
    } else if (f.app === 'inyector') {
      F84.mini.injector();
    }
  }

  /* ============ BLOC DE NOTAS ============ */
  function openNotepad(f, fid) {
    wm.open({
      id: 'np_' + fid, title: f.name + ' — Bloc de Notas', icon: 'txt', w: 580, h: 440,
      content(body) {
        const mb = U.el('div', 'menubar');
        mb.appendChild(U.el('span', null, '<u>A</u>rchivo'));
        mb.appendChild(U.el('span', 'dis', '<u>E</u>dición'));
        mb.appendChild(U.el('span', 'dis', '<u>B</u>úsqueda'));
        body.appendChild(mb);
        const np = U.el('div', 'np-body');
        const html = U.esc(f.text)
          .split(/\n\n/)
          .map(p => '<p>' + p.replace(/\n/g, '<br>') + '</p>')
          .join('')
          .replace(/«([^»]*)»/g, '<span class="nota">«$1»</span>');
        np.innerHTML = html;
        body.appendChild(np);
        const sb = U.el('div', 'statusbar');
        sb.appendChild(U.el('div', 'cell', (f.meta && f.meta.size) || '1 KB'));
        sb.appendChild(U.el('div', 'cell', 'líneas: ' + (f.text.split('\n').length)));
        body.appendChild(sb);
      }
    });
  }

  /* ============ VISOR DE IMÁGENES ============ */
  function openViewer(f, fid) {
    wm.open({
      id: 'img_' + fid, title: f.name + ' — Visor Órbita', icon: 'img', w: 560, h: 470,
      content(body) {
        const holder = U.el('div', null);
        holder.style.cssText = 'flex:1;display:flex;align-items:center;justify-content:center;background:#20242c;overflow:hidden;padding:8px';
        const cv = f.art === 'map' ? spr.drawMap() : f.art === 'dq' ? spr.drawPhotoDQ() : spr.drawPhoto();
        const maxW = 520, maxH = 350;
        const sc = Math.min(maxW / cv.width, maxH / cv.height);
        cv.style.width = (cv.width * sc) + 'px'; cv.style.height = (cv.height * sc) + 'px';
        holder.appendChild(cv);
        body.appendChild(holder);
        const cap = U.el('div', null, U.esc(f.caption || ''));
        cap.style.cssText = 'padding:8px 12px;font-size:18px;border-top:1px solid #999;background:#c3c7cb';
        body.appendChild(cap);
      }
    });
  }

  /* ============ EXPLORADOR ============ */
  function openExplorer(folderId) {
    const fo = D.FOLDERS[folderId];
    let cur = folderId;
    wm.open({
      id: 'exp_' + folderId, title: 'Explorando — C:\\' + (fo ? fo.name.toUpperCase() : ''), icon: 'folder', w: 640, h: 430,
      content(body, win) {
        const wrap = U.el('div', 'exp');
        const tree = U.el('div', 'exp-tree');
        const files = U.el('div', 'exp-files');
        wrap.appendChild(tree); wrap.appendChild(files);
        body.appendChild(wrap);
        const sb = U.el('div', 'statusbar');
        body.appendChild(sb);

        function renderTree() {
          tree.innerHTML = '';
          const root = U.el('div', 'node', 'C:\\');
          root.addEventListener('click', () => { audio.S.click(); });
          tree.appendChild(root);
          ['misdocs', 'cartas', 'radio84', 'papelera'].forEach(id => {
            const f = D.FOLDERS[id];
            const n = U.el('div', 'node', (id === 'radio84' && !core.flag('unlock_radio84') ? '🔒 ' : '') + f.name);
            n.style.paddingLeft = '22px';
            if (id === cur) n.classList.add('cur');
            n.addEventListener('click', () => { audio.S.click(); openFolderOrDialog(id); });
            tree.appendChild(n);
            if (id === 'radio84' && cur === 'sector7') {
              const s7 = U.el('div', 'node', (core.flag('repair_sector7') ? '' : '🔒 ') + 'SECTOR-7');
              s7.style.paddingLeft = '38px'; s7.classList.add('cur');
              s7.addEventListener('click', () => { audio.S.click(); openFolderOrDialog('sector7'); });
              tree.appendChild(s7);
            }
          });
        }
        function renderFiles() {
          files.innerHTML = '';
          const f = D.FOLDERS[cur];
          if (!f) return;
          if (cur === 'radio84') {
            const s7row = folderRow('sector7', D.FOLDERS.sector7.name, 'folderLock', core.flag('repair_sector7') ? '' : 'CORRUPTO');
            files.appendChild(s7row);
          }
          f.children.forEach(id => {
            const fl = D.FILES[id]; if (!fl) return;
            files.appendChild(fileRow(id, fl));
          });
          sb.innerHTML = '';
          sb.appendChild(U.el('div', 'cell', (f.children.length + (cur === 'radio84' ? 1 : 0)) + ' objeto(s)'));
          sb.appendChild(U.el('div', 'cell', 'C:\\' + f.name.toUpperCase()));
        }
        function fileRow(id, fl) {
          const row = U.el('div', 'frow');
          row.appendChild(spr.iconEl(fl.icon, 26));
          row.appendChild(U.el('span', null, U.esc(fl.name)));
          if (fl.type === 'wav' || fl.type === 'exe' || fl.type === 'sys') {
            const lb = U.el('span', 'lockbadge', fl.type === 'sys' ? 'SISTEMA' : '');
            row.appendChild(lb);
          }
          row.appendChild(U.el('span', 'meta', (fl.meta && fl.meta.size) || ''));
          row.addEventListener('click', () => { files.querySelectorAll('.frow').forEach(r => r.classList.remove('sel')); row.classList.add('sel'); audio.S.click(); });
          row.addEventListener('dblclick', () => openFile(id));
          return row;
        }
        function folderRow(id, name, icon, badge) {
          const row = U.el('div', 'frow');
          row.appendChild(spr.iconEl(icon, 26));
          row.appendChild(U.el('span', null, U.esc(name)));
          if (badge) row.appendChild(U.el('span', 'lockbadge', badge));
          row.addEventListener('click', () => { files.querySelectorAll('.frow').forEach(r => r.classList.remove('sel')); row.classList.add('sel'); audio.S.click(); });
          row.addEventListener('dblclick', () => openFolderOrDialog(id));
          return row;
        }
        function goto(id) { cur = id; renderTree(); renderFiles(); }
        win.goto = goto;
        renderTree(); renderFiles();
      }
    });
  }

  /* apertura de carpetas con candados */
  function openFolderOrDialog(folderId) {
    const fo = D.FOLDERS[folderId];
    if (!fo) return;
    if (fo.locked && !core.flag('unlock_' + folderId)) {
      if (folderId === 'radio84') {
        pwDialog({
          title: 'RADIO-84 — Protegida', icon: 'folderLock',
          label: 'Esta carpeta está protegida con contraseña.',
          hint: fo.locked.hint,
          disqHintKey: 'hint_dates',
          validate(v) { return U.normNum(v) === fo.locked.pw ? true : 'Contraseña incorrecta.'; },
          onOk() {
            core.setFlag('unlock_radio84');
            desktop.refreshIcons();
            core.addCorr(8);
            if (F84.disq) F84.disq.say(F84.data2.DQ.ctx.unlock_radio, true);
            openExplorer('radio84');
            core.bus.emit('unlock_radio84');
          }
        });
      }
      return;
    }
    if (fo.corrupted && !core.flag('repair_sector7')) {
      msgBox({
        title: 'SECTOR-7 — Dañado', icon: 'err', w: 420,
        text: 'Esta carpeta reside en sectores físicamente dañados del disco.<br>Los archivos existen, pero el índice está destruido.<br><br>¿Ejecutar REGDISK.EXE para reconstruir?',
        buttons: [
          { label: 'Reparar', cb() { F84.mini.regdisk(); } },
          { label: 'Cancelar' }
        ]
      });
      return;
    }
    openExplorer(folderId);
  }

  /* ============ PUERTA.SYS ============ */
  function openPuerta() {
    if (core.state.post) { msgBox({ title: 'PUERTA.SYS', icon: 'puerta', text: 'El archivo no contiene datos legibles.<br>La puerta ya no está aquí.' }); return; }
    pwDialog({
      title: 'PUERTA.SYS — Sistema', icon: 'puerta',
      label: 'ARCHIVO DE SISTEMA BLOQUEADO<br><small>Escribe el nombre que Julián le puso a la señal:</small>',
      hint: 'mayúsculas + el número',
      disqHintKey: 'hint_puerta',
      validate(v) {
        const n = U.normPw(v);
        return (n === 'OYENTE84' || n === 'ELOYENTE84') ? true : 'ACCESO DENEGADO.';
      },
      onOk() { core.bus.emit('puerta_open'); }
    });
  }

  /* ============ MI PC ============ */
  function openMiPc() {
    wm.open({
      id: 'mipc', title: 'Mi PC', icon: 'mypc', w: 440, h: 420,
      content(body) {
        const b = U.el('div', 'setbody');
        b.innerHTML =
          '<div class="grp"><h4>Unidades de disco</h4>' +
          '<div>💾 A: Disquete 3½ — <i>ausente</i></div>' +
          '<div>🖥 C: DISCO MAESTRO — 340 MB — 61% usado</div>' +
          '<div style="color:#8f1d1d">⚠ 3 sectores dañados (84 anómalos)</div>' +
          '<div>💿 D: CD-ROM ÓRBITA — vacío</div></div>' +
          '<div class="grp"><h4>Propiedades del sistema</h4>' +
          '<div>Órbita \'95 — Versión 4.2.2es «Belisario»</div>' +
          '<div>Usuario registrado: <b>J.VANE</b></div>' +
          '<div>Días de evaluación: 3.024 (licencia vencida)</div>' +
          '<div>Asistente: Disquetín v2.1 — <i>activo</i></div></div>';
        const bt = U.el('button', 'btn95', 'Comprobar sectores');
        bt.addEventListener('click', () => {
          audio.S.hdd();
          bt.disabled = true; bt.textContent = 'Comprobando...';
          setTimeout(() => { bt.disabled = false; bt.textContent = 'Comprobar sectores'; audio.S.diskErr(); msgBox({ title: 'Comprobación', icon: 'warn', text: 'Se encontraron 3 sectores dañados.<br>El sector 84 responde con un <b>latido</b>.<br>Se recomienda no volver a comprobar de noche.' }); }, 2200);
        });
        b.appendChild(bt);
        body.appendChild(b);
      }
    });
  }

  /* ============ CONFIGURACIÓN ============ */
  function openSettings() {
    wm.open({
      id: 'settings', title: 'Configuración — Panel de control', icon: 'gear', w: 460, h: 500,
      content(body) {
        const s = core.state.settings;
        const b = U.el('div', 'setbody');
        const mk = (label, key, extra) => {
          const lb = U.el('label');
          const cb = U.el('input'); cb.type = 'checkbox'; cb.checked = !!s[key];
          cb.addEventListener('change', () => { s[key] = cb.checked; core.applySettings(); audio.S.click(); });
          lb.appendChild(cb); lb.appendChild(U.el('span', null, label + (extra || '')));
          return lb;
        };
        const g1 = U.el('div', 'grp'); g1.appendChild(U.el('h4', null, 'Pantalla'));
        g1.appendChild(mk('Filtro CRT (curvatura + scanlines)', 'crt'));
        g1.appendChild(mk('Efectos de pantalla (destellos)', 'flashes'));
        g1.appendChild(mk('Texto rápido (typewriter veloz)', 'fastText'));
        b.appendChild(g1);
        const g2 = U.el('div', 'grp'); g2.appendChild(U.el('h4', null, 'Sonido'));
        const vl = U.el('label');
        const rg = U.el('input'); rg.type = 'range'; rg.min = 0; rg.max = 100; rg.value = Math.round(s.vol * 100);
        rg.addEventListener('input', () => { s.vol = rg.value / 100; core.applySettings(); });
        vl.appendChild(rg); vl.appendChild(U.el('span', null, 'Volumen general'));
        g2.appendChild(vl);
        g2.appendChild(mk('Voz del sistema (entidad)', 'voice'));
        b.appendChild(g2);
        const g3 = U.el('div', 'grp'); g3.appendChild(U.el('h4', null, 'Partida'));
        g3.appendChild(U.el('div', null, 'Capítulo actual: ' + core.state.chapter + ' / 4'));
        g3.appendChild(U.el('div', null, 'Finales descubiertos: ' + core.state.endings.length + ' / 3'));
        const del = U.el('button', 'btn95', 'Borrar partida');
        del.style.color = '#8f1d1d';
        del.addEventListener('click', () => {
          msgBox({
            title: 'Borrar partida', icon: 'warn', text: '¿Borrar TODO el progreso?<br>La entidad conserva copias. Vos no.',
            buttons: [{ label: 'Borrar', cb() { core.wipe(); location.reload(); } }, { label: 'Cancelar' }]
          });
        });
        g3.appendChild(del);
        b.appendChild(g3);
        body.appendChild(b);
      }
    });
  }

  /* ============ ROUTER DE APPS ============ */
  function openApp(app) {
    switch (app) {
      case 'mipc': openMiPc(); break;
      case 'settings': openSettings(); break;
      case 'explorer': openExplorer('misdocs'); break;
      case 'player': F84.ui2.openPlayerEmpty(); break;
      case 'cmd': F84.ui2.openTerminal(); break;
      case 'mail': F84.ui2.openMail(); break;
      case 'taskmgr': F84.ui2.openTaskMgr(true); break;
    }
  }

  /* ============ MENÚ INICIO ============ */
  const startMenu = {
    el: null,
    init() {
      startMenu.el = document.getElementById('startMenu');
      document.getElementById('startBtn').addEventListener('click', e => { e.stopPropagation(); startMenu.toggle(); });
      document.addEventListener('click', e => { if (!e.target.closest('#startMenu') && !e.target.closest('#startBtn')) startMenu.hide(); });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') startMenu.hide(); });
    },
    toggle() { const el = startMenu.el; const on = el.classList.toggle('show'); document.getElementById('startBtn').classList.toggle('pressed', on); audio.S.click(); },
    hide() { startMenu.el.classList.remove('show'); document.getElementById('startBtn').classList.remove('pressed'); }
  };

  function buildStartMenu() {
    const items = startMenu.el.querySelector('.sm-items');
    const mk = (icon, label, cb) => {
      const it = U.el('div', 'sm-item');
      it.appendChild(spr.iconEl(icon, 22));
      it.appendChild(U.el('span', null, label));
      it.addEventListener('click', () => { startMenu.hide(); cb(); });
      return it;
    };
    // Programas
    const progs = U.el('div', 'sm-item');
    progs.appendChild(spr.iconEl('folder', 22));
    progs.appendChild(U.el('span', null, 'Programas ▸'));
    const sub = U.el('div', 'sm-sub');
    [['player', 'Reproductor de Cintas', () => openApp('player')],
    ['cmd', 'Símbolo del Sistema', () => openApp('cmd')],
    ['mail', 'Correo Órbita', () => openApp('mail')],
    ['gear', 'Gestor de tareas', () => openApp('taskmgr')],
    ['disk', 'REGDISK — sectores', () => { if (!core.flag('repair_sector7') && core.flag('unlock_radio84')) F84.mini.regdisk(); else msgBox({ title: 'REGDISK', icon: 'disk', text: 'No hay sectores dañados en la cola.' }); }]]
      .forEach(a => sub.appendChild(mk(a[0], a[1], a[2])));
    progs.appendChild(sub);
    progs.addEventListener('mouseenter', () => sub.classList.add('show'));
    items.appendChild(progs);
    // Documentos
    const docs = U.el('div', 'sm-item');
    docs.appendChild(spr.iconEl('folder', 22));
    docs.appendChild(U.el('span', null, 'Documentos ▸'));
    const dsub = U.el('div', 'sm-sub');
    dsub.appendChild(mk('txt', 'LEER_PRIMERO.TXT', () => openFile('leer_primero')));
    dsub.appendChild(mk('txt', 'diario_1993_1997.txt', () => { if (core.flag('unlock_radio84')) openFile('diario'); else msgBox({ title: 'Documento', icon: 'warn', text: 'No se encuentra el archivo.<br>Está en una carpeta protegida.' }); }));
    docs.appendChild(dsub);
    docs.addEventListener('mouseenter', () => dsub.classList.add('show'));
    items.appendChild(docs);
    items.appendChild(U.el('div', 'sm-sep'));
    items.appendChild(mk('gear', 'Configuración…', () => openApp('settings')));
    items.appendChild(mk('info', 'Ayuda (preguntarle a Disquetín)', () => {
      if (F84.disq) F84.disq.help();
    }));
    items.appendChild(U.el('div', 'sm-sep'));
    items.appendChild(mk('err', 'Apagar…', () => core.bus.emit('shutdown_request')));
  }

  /* ============ INIT ============ */
  function init() {
    wm.init();
    startMenu.init();
    buildStartMenu();
    desktop.render();
    // bandeja: volumen
    const tray = document.getElementById('tray');
    const vol = document.getElementById('volBtn');
    vol.addEventListener('click', () => {
      const m = !audio.isMuted();
      audio.setMuted(m);
      vol.innerHTML = '';
      vol.appendChild(spr.iconEl(m ? 'spkOff' : 'spkOn', 18));
      audio.S.click();
    });
    document.getElementById('desktop').addEventListener('click', e => {
      if (e.target.id === 'desktop' || e.target.id === 'icons') desktop.select(null);
    });
  }

  return { wm, desktop, msgBox, pwDialog, openFile, openFolderOrDialog, openExplorer, openApp, openSettings, openPuerta, init };
})();
