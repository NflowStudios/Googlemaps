/* ============================================================
   FRECUENCIA 84 — sprites.js
   Íconos pixel-art, frames de Disquetín y arte generativo
   ============================================================ */
window.F84 = window.F84 || {};

F84.sprites = (function () {
  'use strict';

  /* paleta global de caracteres */
  const PAL = {
    k: '#0a0a0a', w: '#f2f2ee', W: '#ffffff', g: '#c3c7cb', d: '#3a3a44',
    y: '#e3c14e', Y: '#f0df8a', o: '#c46a1f', b: '#2f5fd0', c: '#18a3a3',
    r: '#a82020', m: '#9aa0a8', G: '#7ba05b', p: '#e8e4d8', t: '#0e7d7d',
    n: '#000082', s: '#4f7d3a', D: '#22222a', R: '#d84040'
  };

  /* ---------- Íconos 16x16 ---------- */
  const ICONS = {
    mypc: [
      '................',
      '.ggggggggggggg..',
      '.gkkkkkkkkkkkg..',
      '.gktttttttttkg..',
      '.gktttttttttkg..',
      '.gkttGGtttttkg..',
      '.gkttGGtttttkg..',
      '.gktttttttTtkg..',
      '.gkkkkkkkkkkkg..',
      '.ggggggggggggg..',
      '....ggggggg.....',
      '...gggggggggg...',
      '...gkkkkkkkkg...',
      '...gggggggggg...',
      '................',
      '................'
    ],
    folder: [
      '................',
      '................',
      '..yyyy..........',
      '..yyyyyyyyyyyy..',
      '..yYYYYYYYYYYy..',
      '..yYYYYYYYYYYy..',
      '..yYYYYYYYYYYy..',
      '..yYYYYYYYYYYy..',
      '..yYYYYYYYYYYy..',
      '..yYYYYYYYYYYy..',
      '..yYYYYYYYYYYy..',
      '..yyyyyyyyyyyy..',
      '................',
      '................',
      '................',
      '................'
    ],
    folderLock: [
      '................',
      '................',
      '..DDDD..........',
      '..DDDDDDDDDDDD..',
      '..DdddddddddD...',
      '..DddkkkdddD....',
      '..Dddk.kdddD....',
      '..Dddk.kdddD....',
      '..DddkkkdddD....',
      '..DdddyddddD....',
      '..DdddyydddD....',
      '..DDDDDDDDDD....',
      '................',
      '................',
      '................',
      '................'
    ],
    txt: [
      '................',
      '...kkkkkkkk.....',
      '...kwwwwwwkk....',
      '...kwwwwwwkwk...',
      '...kwkkkwwwkk...',
      '...kwwwwwwwk....',
      '...kwkkkkwwk....',
      '...kwwwwwwwk....',
      '...kwkkkwwwk....',
      '...kwwwwwwwk....',
      '...kwkkwwwwk....',
      '...kwwwwwwwk....',
      '...kwwwwwwwk....',
      '...kkkkkkkkk....',
      '................',
      '................'
    ],
    tape: [
      '................',
      '..kkkkkkkkkkkk..',
      '.kggggggggggggk.',
      '.kggggggggggggk.',
      '.kgkwwkggkwwkgk.',
      '.kgkwkkggkwkkgk.',
      '.kgkwwkggkwwkgk.',
      '.kggggggggggggk.',
      '.kgkkkkkkkkkkgk.',
      '.kgkppppppppkgk.',
      '.kgkkkkkkkkkkgk.',
      '.kggggggggggggk.',
      '..kkkkkkkkkkkk..',
      '................',
      '................',
      '................'
    ],
    img: [
      '................',
      '...kkkkkkkk.....',
      '...kbbbbbbk.....',
      '...kbbyybbk.....',
      '...kbbbyybk.....',
      '...kbbbbbbk.....',
      '...kbGGbbbk.....',
      '...kbGGGbbk.....',
      '...kbGGGGbk.....',
      '...kGGGGGGk.....',
      '...ksGGGGsk.....',
      '...kkkkkkkk.....',
      '................',
      '................',
      '................',
      '................'
    ],
    bin: [
      '................',
      '..ggggggggggg...',
      '...gkgkgkgkg....',
      '...ggggggggg....',
      '....ggggggg.....',
      '....gwgwggg.....',
      '....ggggggg.....',
      '.....ggggg......',
      '.....gpgpg......',
      '.....ggggg......',
      '......ggg.......',
      '......ggg.......',
      '.......g........',
      '................',
      '................',
      '................'
    ],
    cmd: [
      'kkkkkkkkkkkkkkkk',
      'kwwwwwwwwwwwwwwk',
      'kwkkwkkwkkwwwwwk',
      'kwwwwwwwwwwwwwwk',
      'kkkkkkkkkkkkkkkk',
      'kkkkkkkkkkkkkkkk',
      'kwkkkwwkkkkkkkkk',
      'kwwkkkkkkkkkkkkk',
      'kkkkkkkkkkkkkkkk',
      'kwkkkkkkkkkkkkkk',
      'kkkkkkkkkkkwkkkk',
      'kkkkkkkkkkkkkkkk',
      'kkkkkkkkkkkkkkkk',
      'kkkkkkkkkkkkkkkk',
      '................',
      '................'
    ],
    player: [
      '.kkkkkkkkkkkkk..',
      '.kgggggggggggk..',
      '.kgrgggggggrgk..',
      '.kgggggggggggk..',
      '.kgkkkkkkkkggk..',
      '.kgkccwccwckgk..',
      '.kgkkkkkkkkggk..',
      '.kgggggggggggk..',
      '.kgGkkkkkkkrkk..',
      '.kgggggggggggk..',
      '.kkkkkkkkkkkkk..',
      '................',
      '................',
      '................',
      '................',
      '................'
    ],
    disk: [
      '................',
      '..bbbbbbbbbbb...',
      '..bmmmmmmmmmb...',
      '..bmmkkkkkmmb...',
      '..bmmkkkkkmmb...',
      '..bmmmmmmmmmb...',
      '..bbbbbbbbbbb...',
      '..bpppppppppb...',
      '..bpppppppppb...',
      '..bpppppppppb...',
      '..bpppppppppb...',
      '..bpppppppppb...',
      '..bbbbbbbbbbb...',
      '................',
      '................',
      '................'
    ],
    iny: [
      '................',
      '..rrrrrrrrrrr...',
      '..rWWWWWWWWWr...',
      '..rWkkkkkkkWr...',
      '..rWkGGGGGkWr...',
      '..rWkGrrrGkWr...',
      '..rWkGrGrGkWr...',
      '..rWkGGGGGkWr...',
      '..rWkkkkkkkWr...',
      '..rWWWWWWWWWr...',
      '..rrrrrrrrrrr...',
      '................',
      '................',
      '................',
      '................',
      '................'
    ],
    mail: [
      '................',
      '..kkkkkkkkkkk...',
      '..kwwwwwwwwwk...',
      '..kwgggggggwk...',
      '..kwgggggggwk...',
      '..kwwgggggwwk...',
      '..kwwwgggwwwk...',
      '..kwwwwgwwwwk...',
      '..kwwwwwwwwwk...',
      '..kwwwwwwwwwk...',
      '..kkkkkkkkkkk...',
      '................',
      '................',
      '................',
      '................',
      '................'
    ],
    gear: [
      '.kkkkkkkkkkkkk..',
      '.kwwwwwwwwwwwk..',
      '.kwkkkkkkkkkwk..',
      '.kwkkkkkkkkkwk..',
      '.kwwwkkkkkwwwk..',
      '.kwwkkkkkkkwwk..',
      '.kwwkkkkkkkwwk..',
      '.kwwwkkkkkwwwk..',
      '.kwkkkkkkkkkwk..',
      '.kwrkkkkkkkrwk..',
      '.kwwwwwwwwwwwk..',
      '.kkkkkkkkkkkkk..',
      '................',
      '................',
      '................',
      '................'
    ],
    lock: [
      '......kkkk......',
      '.....kk..kk.....',
      '.....kk..kk.....',
      '....kkkkkkkk....',
      '....kyyyyyyk....',
      '....kyykkyyk....',
      '....kyykkyyk....',
      '....kyyyyyyk....',
      '....kkkkkkkk....',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................'
    ],
    warn: [
      '.......kk.......',
      '......kyyk......',
      '......kyyk......',
      '.....kyyyyk.....',
      '.....kykyyk.....',
      '.....kykyyk.....',
      '....kyyykyyk....',
      '....kyykkyyk....',
      '....kyyyyyyk....',
      '...kyyyyyyyyk...',
      '...kkkkkkkkkk...',
      '................',
      '................',
      '................',
      '................',
      '................'
    ],
    err: [
      '....kkkkkkkk....',
      '...krrrrrrrrk...',
      '..krrkkrrkkrrk..',
      '..krrrkkkkrrrk..',
      '..krrrrkkrrrrk..',
      '...krrrkkrrrk...',
      '....krrkkrrk....',
      '.....krrrrk.....',
      '......krrk......',
      '.......kk.......',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................'
    ],
    info: [
      '....kkkkkkkk....',
      '...kbbbbbbbbk...',
      '..kbbbkkbbbbbk..',
      '..kbbbbbbbbbbk..',
      '..kbbbkkbbbbbk..',
      '..kbbbkkbbbbbk..',
      '..kbbbbbbbbbbk..',
      '...kbbbbbbbbk...',
      '....kkkkkkkk....',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................'
    ],
    puerta: [
      '..kkkkkkkkkk....',
      '..kddddddddk....',
      '..kdkkkkkkdk....',
      '..kdkkkkkkdk....',
      '..kddddddddk....',
      '..kdkkkkkkdk....',
      '..kdkkkkkkdk....',
      '..kddddddddk....',
      '..kdddddddyk....',
      '..kddddddddk....',
      '..kkkkkkkkkk....',
      '................',
      '................',
      '................',
      '................',
      '................'
    ],
    spkOn: [
      '.....kk.........',
      '....kkk....k....',
      '...kwkk...k.k...',
      '..kwwwk..k...k..',
      '..kwwwk.k.....k.',
      '..kwwwk.k.....k.',
      '..kwwwk..k...k..',
      '...kwkk...k.k...',
      '....kkk....k....',
      '.....kk.........',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................'
    ],
    spkOff: [
      '.....kk.........',
      '....kkk.........',
      '...kwkk..k...k..',
      '..kwwwk..k.k.k..',
      '..kwwwk...k.k...',
      '..kwwwk..k.k.k..',
      '..kwwwk..k...k..',
      '...kwkk.........',
      '....kkk.........',
      '.....kk.........',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................'
    ]
  };

  /* ---------- Disquetín 16x16 ---------- */
  const DQ = {
    idle: [
      '................',
      '..dddddddddddd..',
      '..dmmmmmmmmmmd..',
      '..dmmmmmmmmmmd..',
      '..dmmmmmmmmmmd..',
      '..dmmmmmmmmmmd..',
      '..dddddddddddd..',
      '..drrrrrrrrrrd..',
      '..dwwwwwwwwwwd..',
      '..dwwkwwwwkwwd..',
      '..dwwkwwwwkwwd..',
      '..dwwwwwwwwwwd..',
      '..dwwwkkkkwwwd..',
      '..dwwwwwwwwwwd..',
      '..dddddddddddd..',
      '................'
    ],
    blink: [
      '................',
      '..dddddddddddd..',
      '..dmmmmmmmmmmd..',
      '..dmmmmmmmmmmd..',
      '..dmmmmmmmmmmd..',
      '..dmmmmmmmmmmd..',
      '..dddddddddddd..',
      '..drrrrrrrrrrd..',
      '..dwwwwwwwwwwd..',
      '..dwwwwwwwwwwd..',
      '..dwwkkwwkkwwd..',
      '..dwwwwwwwwwwd..',
      '..dwwwkkkkwwwd..',
      '..dwwwwwwwwwwd..',
      '..dddddddddddd..',
      '................'
    ],
    talk1: [
      '................',
      '..dddddddddddd..',
      '..dmmmmmmmmmmd..',
      '..dmmmmmmmmmmd..',
      '..dmmmmmmmmmmd..',
      '..dmmmmmmmmmmd..',
      '..dddddddddddd..',
      '..drrrrrrrrrrd..',
      '..dwwwwwwwwwwd..',
      '..dwwkwwwwkwwd..',
      '..dwwkwwwwkwwd..',
      '..dwwwwwwwwwwd..',
      '..dwwkkkkkwwwd..',
      '..dwwwwwwwwwwd..',
      '..dddddddddddd..',
      '................'
    ],
    talk2: [
      '................',
      '..dddddddddddd..',
      '..dmmmmmmmmmmd..',
      '..dmmmmmmmmmmd..',
      '..dmmmmmmmmmmd..',
      '..dmmmmmmmmmmd..',
      '..dddddddddddd..',
      '..drrrrrrrrrrd..',
      '..dwwwwwwwwwwd..',
      '..dwwkwwwwkwwd..',
      '..dwwkwwwwkwwd..',
      '..dwwwwwwwwwwd..',
      '..dwkkkkkkkkwd..',
      '..dwwwwwwwwwwd..',
      '..dddddddddddd..',
      '................'
    ],
    scared: [
      '................',
      '..dddddddddddd..',
      '..dmmmmmmmmmmd..',
      '..dmmmmmmmmmmd..',
      '..dmmmmmmmmmmd..',
      '..dmmmmmmmmmmd..',
      '..dddddddddddd..',
      '..drrrrrrrrrrd..',
      '..dwwkkwwkkwwd..',
      '..dwkkkwkkkkwd..',
      '..dwkkkwkkkkwd..',
      '..dwwkkwwkkwwd..',
      '..dwwkkkkkwwd..',
      '..dwwkwwkwwwd...',
      '..dddddddddddd..',
      '................'
    ],
    hat: [
      '.......yy.......',
      '......yyyy......',
      '......yyyy......',
      '.....ryyyyr.....',
      '.....ryyyyr.....',
      '..dddddddddddd..',
      '..dmmmmmmmmmmd..',
      '..drrrrrrrrrrd..',
      '..dwwwwwwwwwwd..',
      '..dwwkwwwwkwwd..',
      '..dwwkwwwwkwwd..',
      '..dwwwwwwwwwwd..',
      '..dwwwkkkkwwwd..',
      '..dwwwwwwwwwwd..',
      '..dddddddddddd..',
      '................'
    ]
  };

  /* ---------- Render básico ---------- */
  function renderRows(rows, scale) {
    const h = rows.length, w = rows[0] ? rows[0].length : 16;
    const cv = document.createElement('canvas');
    cv.width = w * scale; cv.height = h * scale;
    const ctx = cv.getContext('2d');
    for (let y = 0; y < h; y++) {
      const row = rows[y] || '';
      for (let x = 0; x < row.length; x++) {
        const ch = row[x];
        if (ch === '.' || ch === ' ') continue;
        ctx.fillStyle = PAL[ch] || '#f0f';
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
    return cv;
  }

  const iconCache = {};
  function icon(name, size) {
    const key = name + '_' + size;
    if (!iconCache[key]) {
      const src = renderRows(ICONS[name] || ICONS.txt, 4); // 64px base
      const cv = document.createElement('canvas');
      cv.width = size; cv.height = size;
      const ctx = cv.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(src, 0, 0, size, size);
      iconCache[key] = cv;
    }
    return iconCache[key];
  }
  function iconEl(name, size) { const c = icon(name, size); const el = c.cloneNode(); el.getContext('2d').drawImage(c, 0, 0); return el; }

  /* ---------- Corrupción procedural de frames ---------- */
  function corrupt(rows, level, rnd) {
    const r = rnd || Math.random;
    const out = rows.map(s => s.split(''));
    const n = rows.length;
    // desplazamiento de filas (datamosh)
    const shifts = Math.round(level * 6 * r() + level * 2);
    for (let i = 0; i < shifts; i++) {
      const y = Math.floor(r() * n);
      const amt = Math.floor(r() * 3) + 1;
      const row = out[y];
      if (!row) continue;
      if (r() < 0.6) { row.push(...row.splice(0, amt)); } else { const cut = row.splice(row.length - amt); row.unshift(...cut); }
    }
    // ruido de píxeles
    const noise = Math.round(level * 24 * r());
    for (let i = 0; i < noise; i++) {
      const y = Math.floor(r() * n), x = Math.floor(r() * 16);
      if (out[y] && x < out[y].length) out[y][x] = r() < 0.5 ? 'k' : 'w';
    }
    // ojos a estática (nivel alto)
    if (level > 0.45) {
      for (let y = 9; y <= 10; y++) {
        for (let x = 4; x <= 11; x++) {
          if (out[y] && out[y][x] === 'w' && r() < 0.5) out[y][x] = r() < 0.5 ? 'k' : 'W';
        }
      }
    }
    return out.map(a => a.join(''));
  }

  /* ---------- Arte generativo (imágenes del juego) ---------- */
  function seededRnd(seed) {
    let s = seed;
    return function () { s = (s * 1103515245 + 12345) & 0x7fffffff; return (s % 1000) / 1000; };
  }

  function drawMap() {
    const cv = document.createElement('canvas'); cv.width = 480; cv.height = 360;
    const x = cv.getContext('2d');
    x.fillStyle = '#e8e4d8'; x.fillRect(0, 0, 480, 360);
    // rejilla
    x.strokeStyle = '#c9c4b4'; x.lineWidth = 1;
    for (let i = 0; i <= 12; i++) { x.beginPath(); x.moveTo(i * 40, 0); x.lineTo(i * 40, 360); x.stroke(); x.beginPath(); x.moveTo(0, i * 30); x.lineTo(480, i * 30); x.stroke(); }
    const rnd = seededRnd(84);
    x.strokeStyle = '#5a5648'; x.lineWidth = 2; x.setLineDash([]);
    // calles
    x.beginPath(); x.moveTo(30, 330); x.bezierCurveTo(140, 300, 130, 120, 250, 170); x.bezierCurveTo(340, 205, 380, 150, 450, 120); x.stroke();
    x.beginPath(); x.moveTo(40, 60); x.bezierCurveTo(160, 90, 260, 40, 420, 250); x.stroke();
    // espiral hacia la iglesia
    const cx = 255, cy = 178;
    x.strokeStyle = '#8f1d1d'; x.lineWidth = 2;
    x.beginPath();
    let ang = 0, rad = 6;
    x.moveTo(cx + rad, cy);
    for (let i = 0; i < 90; i++) { ang += 0.35; rad += 2.1; x.lineTo(cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad * 0.75); if (rad > 130) break; }
    x.stroke();
    // puntos de medición
    x.fillStyle = '#2f2b20';
    const pts = [[110, 300], [180, 90], [380, 210], [90, 140], [400, 90]];
    pts.forEach(p => { x.fillRect(p[0] - 3, p[1] - 3, 6, 6); });
    x.font = '15px VT323, monospace'; x.fillStyle = '#2f2b20';
    pts.forEach((p, i) => x.fillText('M' + (i + 1), p[0] + 7, p[1] + 4));
    // iglesia (objetivo)
    x.fillStyle = '#8f1d1d';
    x.fillRect(cx - 5, cy - 5, 10, 10);
    x.beginPath(); x.moveTo(cx - 8, cy - 5); x.lineTo(cx, cy - 16); x.lineTo(cx + 8, cy - 5); x.closePath(); x.fill();
    x.font = '17px VT323, monospace';
    x.fillText('IGLESIA SAN BELISARIO', cx - 80, cy + 26);
    x.fillText('FUENTE: 84.0 — PROF.: ???', cx - 80, cy + 44);
    // anotaciones manuscritas
    x.strokeStyle = '#2f2b20'; x.setLineDash([5, 4]);
    pts.forEach(p => { x.beginPath(); x.moveTo(p[0], p[1]); x.lineTo(cx, cy); x.stroke(); });
    x.setLineDash([]);
    x.save(); x.translate(60, 330); x.rotate(-0.12);
    x.fillStyle = '#8f1d1d'; x.font = '19px VT323, monospace';
    x.fillText('viene de ABAJO — no del cielo', 0, 0);
    x.restore();
    x.fillStyle = '#2f2b20'; x.font = '15px VT323, monospace';
    x.fillText('triangulación 1995-1997 — J.V.', 300, 345);
    return cv;
  }

  function drawPhoto() {
    const cv = document.createElement('canvas'); cv.width = 480; cv.height = 360;
    const x = cv.getContext('2d');
    const g = x.createLinearGradient(0, 0, 0, 360);
    g.addColorStop(0, '#b8a888'); g.addColorStop(0.55, '#8a7a60'); g.addColorStop(0.56, '#4a4238'); g.addColorStop(1, '#2a2620');
    x.fillStyle = g; x.fillRect(0, 0, 480, 360);
    const rnd = seededRnd(1410);
    // siluetas borrosas
    x.fillStyle = 'rgba(30,26,20,.55)';
    x.beginPath(); x.ellipse(200, 210, 60, 110, 0, 0, 7); x.fill();
    x.beginPath(); x.ellipse(300, 220, 50, 100, 0, 0, 7); x.fill();
    x.fillStyle = 'rgba(240,230,210,.25)';
    x.beginPath(); x.ellipse(196, 140, 26, 30, 0, 0, 7); x.fill();
    // ruido y rayas de deterioro
    for (let i = 0; i < 9000; i++) {
      const px = Math.floor(rnd() * 480), py = Math.floor(rnd() * 360);
      x.fillStyle = rnd() < 0.5 ? 'rgba(0,0,0,.14)' : 'rgba(255,255,255,.09)';
      x.fillRect(px, py, 1, 1);
    }
    for (let i = 0; i < 26; i++) {
      const px = Math.floor(rnd() * 480);
      x.fillStyle = 'rgba(20,18,14,.5)';
      x.fillRect(px, 0, 1 + Math.floor(rnd() * 2), 360);
    }
    // sello
    x.save(); x.translate(240, 180); x.rotate(-0.28);
    x.strokeStyle = '#8f1d1d'; x.lineWidth = 5; x.globalAlpha = 0.85;
    x.strokeRect(-140, -36, 280, 72);
    x.fillStyle = '#8f1d1d'; x.font = 'bold 44px VT323, monospace'; x.textAlign = 'center';
    x.fillText('DATO DAÑADO', 0, 15);
    x.restore();
    x.font = '16px VT323, monospace'; x.fillStyle = '#2a2620'; x.textAlign = 'left';
    x.fillText('14-10-1992 ·cumple 31·', 12, 348);
    return cv;
  }

  function drawPhotoDQ() {
    const cv = document.createElement('canvas'); cv.width = 480; cv.height = 360;
    const x = cv.getContext('2d');
    x.fillStyle = '#20242c'; x.fillRect(0, 0, 480, 360);
    const rnd = seededRnd(7);
    for (let i = 0; i < 2200; i++) {
      x.fillStyle = 'rgba(255,255,255,' + (rnd() * 0.06) + ')';
      x.fillRect(rnd() * 480, rnd() * 360, 1, 1);
    }
    const spr = renderRows(DQ.hat, 14);
    x.drawImage(spr, 480 / 2 - spr.width / 2, 90);
    x.font = '22px VT323, monospace'; x.fillStyle = '#c9c9c4'; x.textAlign = 'center';
    x.fillText('captura_1994 — "antes".', 240, 330);
    return cv;
  }

  /* ---------- Cursor pixel ---------- */
  function initCursor() {
    const cv = document.createElement('canvas'); cv.width = 16; cv.height = 16;
    const x = cv.getContext('2d');
    const map = [
      'k...............',
      'kk..............',
      'kwk.............',
      'kwwk............',
      'kwwwk...........',
      'kwwwwk..........',
      'kwwwwwk.........',
      'kwwwwwwk........',
      'kwwwwwwwk.......',
      'kwwwwkkkkk......',
      'kwwkwk..........',
      'kwk.kwk.........',
      'kk..kwk.........',
      'k....kwk........',
      '.....kk.........',
      '................'
    ];
    for (let yy = 0; yy < 16; yy++) for (let xx = 0; xx < 16; xx++) {
      const ch = map[yy][xx]; if (ch === '.') continue;
      x.fillStyle = ch === 'k' ? '#000' : '#fff';
      x.fillRect(xx, yy, 1, 1);
    }
    try { document.body.style.cursor = 'url(' + cv.toDataURL() + ') 0 0, default'; } catch (e) { /* ignore */ }
  }

  return { PAL, ICONS, DQ, renderRows, icon, iconEl, corrupt, drawMap, drawPhoto, drawPhotoDQ, initCursor };
})();
