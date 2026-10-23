/* ============================================================
   FRECUENCIA 84 — game.js
   Arranque, capítulos, secuencia final y endings
   ============================================================ */
window.F84 = window.F84 || {};

F84.game = (function () {
  'use strict';
  const U = F84.U, core = F84.core, audio = F84.audio, spr = F84.sprites;

  const QS = new URLSearchParams(location.search);

  /* ============ ARRANQUE ============ */
  function typeInto(target, lines, opts, done) {
    opts = opts || {};
    target.innerHTML = '';
    let li = 0, canceled = false;
    function finishAll() {
      if (canceled) return; canceled = true;
      target.innerHTML = '';
      lines.forEach(l => target.appendChild(U.el('div', null, l === '' ? '&nbsp;' : U.esc(l))));
      if (done) setTimeout(done, 30);
    }
    function step() {
      if (canceled) return;
      if (li >= lines.length) { if (done) setTimeout(done, 30); return; }
      const line = lines[li];
      const div = U.el('div', null, '&nbsp;');
      target.appendChild(div);
      if (line === '') { li++; setTimeout(step, opts.lineDelay || 70); return; }
      let ci = 0;
      (function typeChar() {
        if (canceled) return;
        ci++;
        div.textContent = line.slice(0, ci);
        if (ci < line.length) setTimeout(typeChar, opts.charDelay !== undefined ? opts.charDelay : 9);
        else { li++; setTimeout(step, opts.lineDelay || 70); }
      })();
    }
    step();
    return { skip: finishAll };
  }

  function runPowerOn() {
    const power = document.getElementById('powerScreen');
    const screen = document.getElementById('screen');
    const btn = document.getElementById('powerBtn');
    const endingsBadge = document.getElementById('powerEndings');

    if (endingsBadge && core.state.endings.length) {
      endingsBadge.textContent = 'FINALES DESCUBIERTOS: ' + core.state.endings.length + ' / 3';
    }

    btn.addEventListener('click', () => {
      if (!audio.init()) { /* sin audio: seguimos igual */ }
      audio.S.hdd();
      power.style.display = 'none';
      screen.classList.add('on');
      setTimeout(() => screen.classList.remove('on'), 950);
      setTimeout(runBios, 700);
    }, { once: true });
  }

  function runBios() {
    const bios = document.getElementById('biosScreen');
    bios.style.display = 'block';
    audio.S.boop();

    const lines = [
      'ÓRBITA BIOS (C) 1994 Tecnología Órbita S.A.',
      'Versión 3.07ES',
      '',
      'Procesador: Órbita 486DX2 a 66 MHz',
      'Comprobando memoria: 24576 KB correctos',
      '',
      'Detectando unidades...',
      '   A: Disquete 3½ .......... ausente',
      '   C: DISCO MAESTRO ........ 340 MB — 3 SECTORES DAÑADOS',
      '   D: CD-ROM ÓRBITA ........ vacío',
      '',
      'Advertencia: el reloj del sistema no funciona correctamente.',
      '(El sistema cree que es 1997. El sistema está en paz con eso.)',
      '',
      'Cargando ÓRBITA \'95 ...'
    ];

    // memoria que cuenta
    let memDone = false;
    const typer = typeInto(bios, lines, { charDelay: QS.get('fastboot') ? 0 : 6, lineDelay: QS.get('fastboot') ? 0 : 55 }, () => {
      memDone = true;
      setTimeout(afterBios, QS.get('fastboot') ? 100 : 600);
    });

    // animación del contador de memoria
    const memLine = () => bios.querySelectorAll('div')[4];
    let memVal = 0;
    const memIv = setInterval(() => {
      const el = memLine();
      if (!el) return;
      memVal = Math.min(24576, memVal + 2048);
      el.textContent = 'Comprobando memoria: ' + memVal + ' KB correctos';
      if (memVal >= 24576 || memDone) clearInterval(memIv);
    }, QS.get('fastboot') ? 1 : 40);

    const skipper = e => {
      if (e && e.type === 'keydown' && !(e.key === 'Enter' || e.key === ' ')) return;
      typer.skip();
      clearInterval(memIv);
      memDone = true;
    };
    bios.addEventListener('click', skipper);
    window.addEventListener('keydown', skipper, { once: true });
  }

  function afterBios() {
    const bios = document.getElementById('biosScreen');
    bios.style.display = 'none';
    if (core.hasSave() && core.state.started) {
      const menu = document.getElementById('bootMenu');
      menu.style.display = 'flex';
      const c = menu.querySelector('[data-act="cont"]');
      const n = menu.querySelector('[data-act="new"]');
      const lbl = menu.querySelector('.bm-title');
      lbl.innerHTML = 'Partida encontrada — capítulo ' + core.state.chapter + ' / 4';
      const go = act => {
        menu.style.display = 'none';
        if (act === 'new') { core.wipe(); core.load(); }
        runOsLoad();
      };
      c.onclick = () => go('cont');
      n.onclick = () => go('new');
    } else {
      runOsLoad();
    }
  }

  function runOsLoad() {
    const load = document.getElementById('osLoad');
    load.style.display = 'flex';
    const bar = load.querySelector('.bar i');
    let p = 0;
    const iv = setInterval(() => {
      p += 4 + Math.random() * 7;
      if (p >= 100) {
        p = 100; clearInterval(iv);
        setTimeout(() => { load.style.display = 'none'; startDesktop(); }, 500);
      }
      bar.style.width = p + '%';
      if (Math.random() < 0.3) audio.S.hdd();
    }, QS.get('fastboot') ? 10 : 110);
  }

  /* ============ ESCRITORIO ============ */
  function startDesktop() {
    document.getElementById('desktop').classList.add('show');
    core.state.started = true; core.save();
    F84.ui.init();
    F84.disq.init();
    core.clock.start();
    core.applySettings();
    core.saver.init();
    core.initTitleTrick();
    audio.S.chime();
    setCorrFromState();

    if (QS.get('fastboot')) { F84.debug._ready = true; }

    // bienvenida o resumen
    setTimeout(() => {
      if (core.state.chapter >= 2 && core.state.started) {
        const rc = F84.data2.DQ.recap[Math.min(4, core.state.chapter)];
        if (rc && !core.state.post) F84.disq.say(rc);
      }
      if (!core.flag('welcome_done')) {
        F84.disq.sequence(F84.data2.DQ.welcome, () => {
          core.setFlag('welcome_done');
          const ic = document.querySelector('.dicon[data-fid="leer_primero"]');
          if (ic) ic.classList.add('pulse-cue');
        });
      }
    }, 1100);

    core.scares.start();
    F84.disq.startHints();
    wireStory();
  }

  function setCorrFromState() {
    const c = core.state.corr;
    core.state.corr = 0;
    core.setCorr(c);
  }

  /* ============ PROGRESIÓN ============ */
  function wireStory() {
    const bus = core.bus;

    bus.on('read', d => {
      const { id } = d;
      if (id === 'leer_primero') {
        const ic = document.querySelector('.dicon[data-fid="leer_primero"]');
        if (ic) ic.classList.remove('pulse-cue');
        core.addCorr(3);
      }
      if (id === 'identidad') {
        core.addCorr(10);
        core.once('identidad_dq', () => F84.disq.say('ese archivo describe... lo que habla cuando yo no hablo. no lo leas dos veces.', true));
      }
      if (id === 'borrador_extrano') {
        core.addCorr(4);
        core.once('borrador_dq', () => F84.disq.say('ese archivo no lo escribió el usuario anterior. o sí. o no. ja.', true));
      }
      if (id === 'foto_dq') {
        core.once('fotodq_dq', () => F84.disq.say('¡ese soy yo! ...¿por qué tengo sombrero en el recuerdo y miedo en el presente?', true));
      }
    });

    bus.on('unlock_radio84', () => {
      core.setChapter(2);
      core.addCorr(8);
    });

    bus.on('repair_sector7', () => {
      core.addCorr(6);
    });

    bus.on('tape_end', d => {
      if (d.id === 'rec0') {
        core.addCorr(4);
        core.once('rec0_dq', () => F84.disq.say('¿encontrás el murmullo? yo también lo encuentro. siempre lo encuentro.', true));
      }
      if (d.id === 'rec4') {
        core.setFlag('tape_rec4');
        core.once('rec4_scare', rec4Scare);
      }
    });

    bus.on('mail_read', d => {
      if (d.id === 'm3') core.once('m3_corr', () => core.addCorr(3));
      if (d.id === 'm5') { /* requisito del final C: leído */ }
      if (d.id === 'm6') {
        core.addCorr(8);
        core.once('m6_seq', mailSequence);
      }
    });

    bus.on('puerta_open', () => finale());

    bus.on('shutdown_request', () => {
      if (core.state.chapter >= 3 && !core.state.post) {
        if (!core.flag('shut_refuse_done')) {
          core.setFlag('shut_refuse_done');
          audio.S.powerdown();
          const screen = document.getElementById('screen');
          screen.classList.add('off');
          F84.disq.say(F84.data2.DQ.ctx.shutdown_refuse);
          setTimeout(() => {
            screen.classList.remove('off');
            screen.classList.add('on');
            setTimeout(() => screen.classList.remove('on'), 950);
            core.fx.bigGlitch();
            audio.S.stab();
          }, 2100);
        } else {
          F84.ui.msgBox({ title: 'Apagar', icon: 'err', text: 'El sistema no permite apagarse ahora.<br>Algo está usando el monitor.' });
        }
      } else {
        realShutdown();
      }
    });
  }

  function rec4Scare() {
    core.fx.bigGlitch();
    setTimeout(() => core.fx.bigGlitch(), 500);
    audio.S.stab();
    // Disquetín se congela
    setTimeout(() => {
      F84.disq.say(F84.data2.DQ.ctx.rec4_scare, true);
      core.setCorr(Math.max(core.state.corr, 45));
      core.setChapter(3);
      setTimeout(() => {
        F84.disq.say('el correo de Julián tiene 6 mensajes. uno se envió 7 días después de que nadie lo viera más.', true);
      }, 6500);
    }, 1400);
  }

  function mailSequence() {
    F84.disq.say(F84.data2.DQ.ctx.mail_m6, true);
    setTimeout(() => {
      core.fx.bigGlitch();
      audio.S.stab();
      F84.ui.msgBox({
        title: 'ALERTA DEL SISTEMA', icon: 'err', w: 430,
        text: '<b>SEÑAL.EXE</b> está invadiendo la memoria RAM.<br>El sistema puede colapsar.<br><br>Abrí el <b>Gestor de tareas</b> y finaliza los procesos hostiles<br>mientras PURGA.EXE se instala.',
        buttons: [{ label: 'Abrir gestor', cb: startWave }]
      });
    }, 2600);
  }

  function startWave() {
    F84.ui2.tm.waveStart(() => {
      F84.disq.say('la RAM está limpia... pero el canal quedó abierto. hay que inyectar el contra-código de Julián. ahora.', true);
      setTimeout(() => {
        F84.mini.injectorForced(puertaReveal);
      }, 5200);
    });
  }

  function puertaReveal() {
    core.setFlag('puerta_visible');
    core.setChapter(4);
    core.addCorr(12);
    core.fx.bigGlitch();
    audio.S.stab();
    F84.ui.desktop.addIcon('puerta_sys');
    F84.disq.say('PUERTA.SYS. apareció solo. no lo abras. ...abrilo. no lo abras. ...', true);
  }

  /* ============ FINAL ============ */
  const el = id => document.getElementById(id);

  function finale() {
    core.setFlag('puerta_open');
    document.body.classList.add('finale');
    audio.S.powerdown();
    setTimeout(() => audio.S.stab(), 800);
    F84.ui.wm.closeAll();
    const layer = el('endingLayer');
    layer.classList.add('show');
    layer.innerHTML = '';

    const eligible = core.flag('read_borrador_extrano') && core.flag('read_foto_dq') && !!core.state.mailRead.m5;

    const lines = F84.data2.ENTITY_FINALE.slice();
    let i = 0;
    function nextLine() {
      if (i >= lines.length) { choices(); return; }
      const text = lines[i++];
      const d = U.el('div', 'entity');
      layer.innerHTML = '';
      layer.appendChild(d);
      typeInto(d, [text], { charDelay: 55, lineDelay: 200 }, () => { });
      audio.speak(text.replace(/\n/g, ' '));
      if (core.state.settings.flashes && Math.random() < 0.6) core.fx.micro();
      setTimeout(nextLine, 1600 + text.length * 95);
    }
    core.fx.bigGlitch();
    nextLine();

    function choices() {
      layer.innerHTML = '';
      layer.appendChild(U.el('div', 'fin-sub', 'LA SEÑAL ESPERA UNA RESPUESTA'));
      const btns = U.el('div', 'fin-btns');
      const bB = U.el('button', 'btn95', 'RESPONDER A LA SEÑAL');
      const bA = U.el('button', 'btn95', 'ESCRIBIR: FORMAT C:');
      bB.addEventListener('click', endingB);
      bA.addEventListener('click', endingA);
      btns.appendChild(bB); btns.appendChild(bA);
      if (eligible) {
        const bC = U.el('button', 'btn95', 'USAR EL CÓDIGO DE JULIÁN');
        bC.style.color = '#2f6b2f';
        bC.addEventListener('click', endingC);
        btns.appendChild(bC);
        layer.appendChild(U.el('div', 'fin-sub', '(llevás todo lo que él dejó: el borrador, la captura, su recordatorio)'));
      } else {
        layer.appendChild(U.el('div', 'fin-sub', '(hay restos de Julián que nunca encontraste)'));
      }
      layer.appendChild(btns);
    }
  }

  function endCard(key) {
    const E = F84.data2.ENDINGS[key];
    if (!core.state.endings.includes(key)) core.state.endings.push(key);
    core.state.post = key;
    core.save();
    const layer = el('endingLayer');
    layer.innerHTML = '';
    layer.appendChild(U.el('div', 'fin-title', E.title));
    const body = U.el('div');
    layer.appendChild(body);
    const lines = E.lines.map(l => l);
    typeInto(body, lines, { charDelay: 40, lineDelay: 700 }, () => {
      layer.appendChild(U.el('div', 'fin-sub', 'FIN ' + core.state.endings.length + ' DE 3 — «' + E.title + '»'));
      const btns = U.el('div', 'fin-btns');
      const bBack = U.el('button', 'btn95', 'VOLVER AL ESCRITORIO');
      const bRe = U.el('button', 'btn95', 'REINICIAR HISTORIA');
      bBack.addEventListener('click', () => {
        layer.classList.remove('show');
        document.body.classList.remove('finale');
        core.setCorr(key === 'A' ? 25 : key === 'B' ? 100 : 8);
        F84.disq.say(key === 'A' ? U.rnd(F84.data2.DQ.ctx.post_a) : key === 'B' ? U.rnd(F84.data2.DQ.ctx.post_b) : U.rnd(F84.data2.DQ.ctx.post_c));
      });
      bRe.addEventListener('click', () => { core.wipe(); location.reload(); });
      btns.appendChild(bBack); btns.appendChild(bRe);
      layer.appendChild(btns);
    });
  }

  function endingA() {
    const layer = el('endingLayer');
    layer.innerHTML = '';
    const box = U.el('div');
    box.style.cssText = 'max-width:560px;text-align:left';
    layer.appendChild(box);
    const lines = ['FORMATEANDO LA UNIDAD C: ...'];
    const files = ['LEER_PRIMERO.TXT', 'carta_a_mama.txt', 'diario_1993_1997.txt', '02_transcripcion.txt', '04_grabacion_profunda.wav', 'mapa_senal.png', 'identidad_oyente.txt', 'RADIO-84\\', 'PUERTA.SYS'];
    files.forEach(f => lines.push('  borrando ' + f + ' ... ok'));
    lines.push('');
    lines.push('formato completo: 84 segundos.');
    typeInto(box, lines, { charDelay: 8, lineDelay: 240 }, () => {
      audio.S.hdd();
      setTimeout(() => {
        audio.S.powerdown();
        if (core.state.settings.flashes) {
          layer.style.background = '#fff';
          setTimeout(() => { layer.style.background = '#000'; endCard('A'); }, 350);
        } else endCard('A');
      }, 1200);
    });
    audio.S.hdd();
  }

  function endingB() {
    const layer = el('endingLayer');
    layer.innerHTML = '';
    layer.appendChild(U.el('div', 'fin-sub', 'LA SEÑAL PREGUNTA:'));
    const inp = U.el('input');
    inp.maxLength = 24; inp.placeholder = '¿cómo te llamás?';
    layer.appendChild(inp);
    setTimeout(() => inp.focus(), 100);
    function respond() {
      const name = inp.value.trim();
      layer.innerHTML = '';
      const d = U.el('div', 'entity');
      layer.appendChild(d);
      audio.playTape(F84.data2.TAPES.rec5, {});
      const l1 = name ? 'QUÉ NOMBRE TAN... SONORO.' : 'NO IMPORTA. LOS NOMBRES SOBRAN.';
      typeInto(d, [l1, 'NOS VAMOS A ESCUCHAR MUCHO.'], { charDelay: 60, lineDelay: 400 }, () => { });
      audio.speak(name ? 'Qué nombre tan... sonoro.' : 'No importa. Los nombres sobran.');
      setTimeout(() => {
        audio.speak('Nos vamos a escuchar mucho.');
        core.fx.bigGlitch();
      }, 2600);
      setTimeout(() => { audio.stopTape(); endCard('B'); }, 5400);
    }
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') respond(); });
  }

  function endingC() {
    const layer = el('endingLayer');
    layer.innerHTML = '';
    layer.appendChild(U.el('div', 'fin-sub', 'INYECTANDO EL CÓDIGO DE JULIÁN — CANAL DIRECTO'));
    const mount = U.el('div');
    mount.style.cssText = 'flex:1;display:flex;align-items:center;justify-content:center;width:100%';
    layer.appendChild(mount);
    F84.mini.injectorMount(mount, { hard: true, rounds: 5 }, () => {
      layer.innerHTML = '';
      audio.S.stab();
      core.fx.burst(0.9, 0.9);
      setTimeout(() => {
        const d = U.el('div', 'entity');
        layer.appendChild(d);
        typeInto(d, ['LA SEÑAL GRITA CON LAS 84 VOCES A LA VEZ.', '', '(después, un silencio nuevo. un silencio limpio.)'], { charDelay: 45, lineDelay: 600 }, () => { });
        setTimeout(() => {
          layer.innerHTML = '';
          const w = U.el('div');
          w.style.cssText = 'font-size:clamp(18px,2.6vmin,26px);color:#c9c9c4';
          layer.appendChild(w);
          typeInto(w, ['«...gracias.»', '(una voz muy pequeña. cansada. humana.)'], { charDelay: 70, lineDelay: 900 }, () => {
            setTimeout(() => endCard('C'), 1400);
          });
          audio.speak('Gracias.', { rate: 0.7, pitch: 0.05 });
        }, 5200);
      }, 1200);
    });
  }

  function realShutdown() {
    audio.S.powerdown();
    const screen = el('screen');
    screen.classList.add('off');
    setTimeout(() => location.reload(), 750);
  }

  /* ============ DEBUG ============ */
  F84.debug = {
    jump(n) {
      core.state.chapter = n; core.save();
      if (n >= 2) core.setFlag('unlock_radio84');
      if (n >= 3) { core.setFlag('repair_sector7'); core.setFlag('tape_rec4'); core.setFlag('mail_logged'); }
      if (n >= 4) { core.setFlag('puerta_visible'); F84.ui.desktop.addIcon('puerta_sys'); }
      core.setCorr([0, 10, 40, 60, 75][n] || 0);
      location.reload();
    },
    corr(n) { core.setCorr(n); },
    ending(k) { finale(); setTimeout(() => { if (k === 'A') endingA(); if (k === 'B') endingB(); if (k === 'C') endingC(); }, 500); },
    give(f) { core.setFlag(f); },
    tape(id) { const f = Object.entries(F84.data.FILES).find(([k, v]) => v.tape === id); if (f) F84.ui.openFile(f[0]); }
  };

  /* ============ INIT ============ */
  function init() {
    core.load();
    core.applySettings();
    spr.initCursor();
    runPowerOn();
  }

  document.addEventListener('DOMContentLoaded', init);

  return { init, finale };
})();
