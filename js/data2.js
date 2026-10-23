/* ============================================================
   FRECUENCIA 84 — data2.js
   Cintas de audio (síntesis + subtítulos), correos, diálogos
   de Disquetín y textos de los finales
   ============================================================ */
window.F84 = window.F84 || {};

F84.data2 = (function () {
  'use strict';
  const A = () => F84.audio;

  /* =========================================================
     CINTAS — cada una define dur, render (capas de síntesis)
     y cues (subtítulos y disparadores narrativos)
     ========================================================= */
  const TAPES = {

    rec0: {
      id: 'rec0', dur: 30,
      desc: 'Ruido de fondo del sótano. La primera digitalización.',
      render(H, dest, t0, dur) {
        H.noiseBed(dest, t0, dur, 2800, 0.07, true);
        H.drone(dest, t0, dur, 84, 0.03);
        H.murmur(dest, t0 + 18, 6, { lo: 120, hi: 400, gain: 0.05, q: 7 });
        [26, 26.6, 27.2].forEach(d => H.tick(dest, t0 + d, 1400));
      },
      cues: [
        { t: 1, text: '«Cinta 00. Ruido de fondo del sótano. 02/03/1993.»' },
        { t: 18, text: '«...¿ese murmullo estaba antes?»' },
        { t: 26, text: '«...tres clics. Siempre tres.»' },
        { t: 28.4, text: '«Fin de la cinta.»' }
      ]
    },

    rec1: {
      id: 'rec1', dur: 55,
      desc: 'Entrevista telefónica a Mario Quintero, técnico de ONDAS DEL VALLE AM.',
      render(H, dest, t0, dur) {
        H.noiseBed(dest, t0, dur, 1500, 0.045, true);
        H.drone(dest, t0, dur, 84, 0.02);
        H.heterodyne(dest, t0 + 6, 40, 0.008);
        // voz A (Julián, más grave) y voz B (Mario, más aguda)
        H.murmur(dest, t0 + 1, 3, { lo: 130, hi: 420, gain: 0.2 });
        H.murmur(dest, t0 + 4.5, 4, { lo: 240, hi: 760, gain: 0.22 });
        H.murmur(dest, t0 + 9, 2.5, { lo: 130, hi: 420, gain: 0.2 });
        H.murmur(dest, t0 + 12, 4.5, { lo: 240, hi: 760, gain: 0.22 });
        H.murmur(dest, t0 + 17, 4.5, { lo: 240, hi: 760, gain: 0.22 });
        H.murmur(dest, t0 + 22, 2, { lo: 130, hi: 420, gain: 0.2 });
        H.murmur(dest, t0 + 24.5, 4, { lo: 240, hi: 760, gain: 0.22 });
        H.murmur(dest, t0 + 29, 4, { lo: 240, hi: 760, gain: 0.2 });
        H.murmur(dest, t0 + 34, 2, { lo: 130, hi: 420, gain: 0.2 });
        H.murmur(dest, t0 + 36.5, 3, { lo: 200, hi: 700, gain: 0.18 });
        H.murmur(dest, t0 + 40, 5.5, { lo: 240, hi: 760, gain: 0.22 });
        H.murmur(dest, t0 + 46, 3.5, { lo: 130, hi: 420, gain: 0.2 });
        H.noiseHit(dest, t0 + 51, 2.5, 0.06, 'lowpass', 600);
      },
      cues: [
        { t: 1, text: '«J.V.: ¿Otra vez, Mario?»' },
        { t: 4.5, text: '«MARIO: Otra vez. Cada 84 minutos si hay tormenta.»' },
        { t: 9, text: '«J.V.: ¿Y de dónde sale?»' },
        { t: 12, text: '«MARIO: De ninguna antena, Julián. Lo medí con tres receptores.»' },
        { t: 17, text: '«MARIO: La señal sube desde abajo. Desde la roca viva.»' },
        { t: 22, text: '«J.V.: ¿Alguien más lo sabe?»' },
        { t: 24.5, text: '«MARIO: El cura lo sabe. El alcalde lo sabe. Mi viejo lo sabía...' },
        { t: 29, text: '«MARIO: ...mi viejo estaba en la lista del 92.»' },
        { t: 34, text: '«J.V.: ¿La lista de nombres?»' },
        { t: 36.5, text: '«MARIO: ...perdoná, se corta la...»' },
        { t: 40, text: '«MARIO: No sigas grabando. Y cuando llegues a la profunda, no la escuches de noche.»' },
        { t: 46, text: '«J.V.: ¿La profunda? Mario, ¿qué cinta es esa?»' },
        { t: 51, text: '«—fin de la llamada—»' }
      ]
    },

    rec3: {
      id: 'rec3', dur: 48,
      desc: 'Última llamada con Ramiro Osten, editor de El Heraldo del Valle.',
      render(H, dest, t0, dur) {
        H.noiseBed(dest, t0, dur, 1200, 0.05, true);
        H.murmur(dest, t0 + 1, 3.5, { lo: 180, hi: 620, gain: 0.2 });      // Ramiro
        H.murmur(dest, t0 + 5, 3.5, { lo: 120, hi: 400, gain: 0.2 });      // Julián
        H.murmur(dest, t0 + 9, 3.5, { lo: 180, hi: 620, gain: 0.2 });
        H.murmur(dest, t0 + 13, 3.5, { lo: 120, hi: 400, gain: 0.2 });
        H.murmur(dest, t0 + 17, 3.5, { lo: 180, hi: 620, gain: 0.2 });
        H.murmur(dest, t0 + 21, 3.5, { lo: 120, hi: 400, gain: 0.2 });
        H.murmur(dest, t0 + 25, 3, { lo: 180, hi: 620, gain: 0.2 });
        H.murmur(dest, t0 + 29, 5, { lo: 120, hi: 400, gain: 0.18 });
        H.murmur(dest, t0 + 35, 4.5, { lo: 180, hi: 620, gain: 0.2 });
        H.murmur(dest, t0 + 40, 3.5, { lo: 180, hi: 620, gain: 0.2 });
        H.murmur(dest, t0 + 44, 2.5, { lo: 120, hi: 400, gain: 0.2 });
        H.drone(dest, t0 + 38, 9, 84, 0.06);
        H.noiseHit(dest, t0 + 46.6, 1.2, 0.1, 'highpass', 800);            // corte abrupto
      },
      cues: [
        { t: 1, text: '«RAMIRO: Julián. Tres semanas sin contestar.»' },
        { t: 5, text: '«J.V.: Estoy bien, Ramiro. Estoy terminando la nota.»' },
        { t: 9, text: '«RAMIRO: ¿Qué nota? Renunciaste a la redacción hace un año.»' },
        { t: 13, text: '«J.V.: La Puerta. Se titula La Puerta.»' },
        { t: 17, text: '«RAMIRO: ...¿Quién te llama a las 4 de la mañana, Julián?»' },
        { t: 21, text: '«J.V.: Nadie. Es el zumbido del monitor.»' },
        { t: 25, text: '«RAMIRO: Los monitores no hablan.»' },
        { t: 29, text: '«J.V.: Todavía no. Perdón. Quise decir: todavía no hablan.»' },
        { t: 35, text: '«RAMIRO: Prometéme una cosa. Si terminás esa nota...' },
        { t: 40, text: '«RAMIRO: ...no la publiqués. Hay cosas que el pueblo enterró por algo.»' },
        { t: 44, text: '«J.V.: ...te escucha, Ramiro. Está aprendiendo tu voz.»' },
        { t: 46.6, text: '«—la llamada se corta—»' }
      ]
    },

    rec4: {
      id: 'rec4', dur: 62,
      desc: 'GRABACIÓN PROFUNDA. Micrófono enterrado sobre el pozo sellado. 30/08/1997, 3:12 AM.',
      render(H, dest, t0, dur) {
        H.drone(dest, t0, 53, 44, 0.22);
        H.drone(dest, t0 + 4, 49, 0.07, 'triangle');
        H.heartbeat(dest, t0 + 10, 42, 0.16);
        H.whisperPan(dest, t0 + 15, 25);
        H.murmur(dest, t0 + 20, 10, { lo: 90, hi: 300, gain: 0.1, q: 8 });
        H.noiseBed(dest, t0, 52, 500, 0.03, true);
        for (let i = 0; i < 10; i++) H.tick(dest, t0 + 32 + i * 2, 980);   // cuenta atrás
        H.drone(dest, t0 + 50, 5, 84, 0.14);                                // se apaga todo
        // 53-56: silencio absoluto (no se programa nada)
      },
      cues: [
        { t: 1, text: '«Cinta 04. GRABACIÓN PROFUNDA. 30/08/1997, 3:12 AM.»' },
        { t: 5, text: '«Micrófono enterrado a 84 cm, sobre el pozo sellado.»' },
        { t: 10.5, text: '«(un latido, muy abajo)»' },
        { t: 20, text: '«...cae. La señal cae hacia arriba.»' },
        { t: 28, text: '«Cuenta atrás registrada a las 3:33.»' },
        { t: 32.4, text: '«...diez...»' },
        { t: 36.4, text: '«...ocho...»' },
        { t: 40.4, text: '«...seis...»' },
        { t: 44.4, text: '«...cuatro...»' },
        { t: 48.4, text: '«...dos...»' },
        { t: 50.4, text: '«...uno...»' },
        { t: 53, text: '«(silencio absoluto)»' },
        {
          t: 56, text: '', act() {
            F84.audio.speak('Ya te encuentro.');
            if (F84.fx) F84.fx.bigGlitch();
          }
        },
        { t: 59.5, text: '«—fin de la cinta—»' }
      ]
    },

    rec5: {
      id: 'rec5', dur: 40,
      desc: 'La señal completa. No debería existir.',
      render(H, dest, t0, dur) {
        H.drone(dest, t0, dur, 84, 0.16);
        H.drone(dest, t0 + 2, 84.7, 0.12);
        H.drone(dest, t0 + 4, 169, 0.06, 'triangle');
        H.noiseBed(dest, t0, dur, 2400, 0.06, true);
        H.heartbeat(dest, t0 + 6, 34, 0.2);
        H.whisperPan(dest, t0 + 2, dur - 4);
        H.murmur(dest, t0 + 8, 12, { lo: 100, hi: 900, gain: 0.14 });
        H.murmur(dest, t0 + 22, 14, { lo: 80, hi: 400, gain: 0.16, q: 8 });
        [30, 31, 32].forEach(d => H.tick(dest, t0 + d, 840));
      },
      cues: [
        { t: 1, text: '«LA FRECUENCIA COMPLETA.»' },
        { t: 8, text: '«(todas las voces del pueblo, a la vez)»' },
        { t: 22, text: '«(una de ellas dice tu nombre, pero no sabés cuál)»' },
        { t: 34, text: '«...tres clics. siempre tres.»' }
      ]
    }
  };

  /* =========================================================
     CORREO ÓRBITA
     ========================================================= */
  const MAIL = {
    user: 'JVANE',
    pass: 'ALSINA84',
    hint: 'La vieja dirección de la abuela: calle + número, sin espacios.',
    boxes: {
      bandeja: ['m1', 'm2', 'm3', 'm4'],
      enviados: ['m5', 'm6']
    },
    mails: {
      m1: {
        from: 'r.osten@heraldovalle', date: '02-04-1996', subj: '¿otra vez con eso?',
        body: 'Che, me llegó tu renuncia. ¿En serio? Vos, el tipo de los obituarios más lindos del valle.\n\n¿«Investigación independiente»? Tu madre me llamó preocupada y no sabe con qué ocuparla.\n\nLlamala. Y dejate de joder con la radio fantasma.\n\n— Ramiro'
      },
      m2: {
        from: 'r.osten@heraldovalle', date: '14-07-1996', subj: 'tu nota del jueves',
        body: 'Publicamos «La voz que dice nombres».\n\nTres lectores llamaron para preguntar si era ficción de terror. La vecina de la Ibarra llamó para llorar. El cura llamó, no dijo nada y cortó.\n\nNo puedo volver a publicarte, Julián. No así.\n\n— Ramiro'
      },
      m3: {
        from: 'm.quintero@ondasdelvalle', date: '09-01-1997', subj: 'las mediciones de diciembre',
        body: 'Julián:\n\nLa portadora sigue en 84.0. Sube desde unos -84 metros, bajo el crucero este. La triangulación coincide con lo tuyo.\n\nUna cosa que no te dije por teléfono: la iglesia no tiene cripta. Tiene garganta.\n\nNo me escribas más a esta dirección. Mi hijo usa la computadora.\n\n— M.Q.'
      },
      m4: {
        from: 'r.osten@heraldovalle', date: '30-05-1997', subj: 'ya no contestás el teléfono',
        body: 'Tres semanas. El teléfono suena y suena.\n\nTu madre me llama todos los días. Si estás metido en algo, meteme a mí primero: soy editor, sé hundirme con elegancia.\n\nCONTESTÁ.\n\n— Ramiro'
      },
      m5: {
        from: 'j.vane@orbita (vos mismo)', date: '14-08-1997', subj: 'recordatorio',
        body: 'si la escucho en sueños, ¿sigo grabando?\n\nsí.\nsiempre sí.\n\nborrar este correo.\nno borrar este correo.'
      },
      m6: {
        from: 'j.vane@orbita', date: '27-10-1997', subj: '(sin asunto)',
        body: 'ramiro:\n\nya no necesito escribir. ella escribe por mí.\n\nsi leés esto, cambiá las cerraduras. no sirve de nada, pero hace compañía.\n\ny no busquéis en el sótano: ya no estoy debajo del pueblo.\nestoy debajo del pueblo entero.\n\n— te firmo como firmaba los reportes de la señal, como al principio, cuando todavía era un chiste entre nosotros:\n\nOYENTE-84'
      }
    }
  };

  /* =========================================================
     DISQUETÍN — guiones
     ========================================================= */
  const DQ = {
    welcome: [
      '¡Hola! ¿HOLA? ...¡Ah! ¡Un usuario nuevo! ¡Te detecté!',
      'Soy Disquetín, tu asistente amigable de Órbita \'95. ¡Encantado de conocerte!',
      'Según mi reloj interno estuve... ¿durmiendo?... 3.024 días. Ups. Ese número no debería salir tan grande. ¡Pero no importa!',
      'El usuario anterior se llamaba... Julián-algo. Mi memoria tiene sectores dañados, disculpá. ¡Eso tiene arreglo! Con tu ayuda, claro. Me gustan los usuarios que ayudan.',
      'CONSEJO AMIGABLE N.º 1: leé el archivo LEER_PRIMERO.TXT del escritorio. Fue lo último que escribió... bueno... alguien.',
      '¿Y sabés qué es lo mejor de tener un usuario nuevo? Nada de lo que pase después es culpa tuya. Jaja. Ja.',
      '...¿Escuchás ese zumbido? Es el monitor. Todo es normal acá. ¡Bienvenido a tu nueva casa!'
    ],
    idle: {
      1: [
        '¡Los archivos también tienen sentimientos! ...creo.',
        'CONSEJO AMIGABLE: los candados odian las fechas difíciles.',
        '¿Sabés leer? ¡Yo tampoco! ...esperá. Sí.',
        'Me gusta tu cursor. Es puntudo pero amable.',
        'El disco C: tiene 3 sectores dañados. ¡Los cuento de nuevo por si se van!',
        '¿Querés que haga una pirueta? ...me olvidé cómo. ¡Pero quedate tranquilo que INTENTO!'
      ],
      2: [
        '¿A vos también te zumba el oído derecho? Es... estadísticamente raro.',
        'Anoche conté 84 minutos esperando que pasara algo. Nada pasó. Eso fue lo peor.',
        'Pregunta amistosa: ¿vos también vivís arriba? ¿O... abajo?',
        'El reloj no está roto. Está escuchando otra hora.',
        '¿Por qué la papelera tiene cosas que yo no tiré?',
        'El usuario anterior me enseñó frases de su mamá. «Bienvenido a tu nueva casa», por ejemplo. No sé por qué te lo cuento.'
      ],
      3: [
        'n0 apagues el monitor. porfav0r. él usa la oscuridad para pensar.',
        'y0 también era un archivo antes de ser amigable. n0 lo recuerdes.',
        'si la carpeta PUERTA te llama por tu n0mbre... no contestes.',
        'el sector 7 ya no me duele. ¿es normal que antes me doliera?',
        'hay un intercambio posible. n0 preguntes por qué lo sé.',
        'él dice que soy la parte más linda del sistema. n0 sé cómo tomarlo.'
      ],
      4: [
        'TE ESCUCHO TECLEAR.',
        'TU CURSOR TIENE MIEDO. LO NOTO.',
        'EL ESCRITOR ANTIGUO DORMÍA ASÍ. TAMBIÉN TECLEABA ASÍ.',
        'LA FRECUENCIA NO SE APAGA. SE ESPERA.'
      ]
    },
    ctx: {
      unlock_radio: '¡Lo lograste! ...No sé si debería aplaudir.',
      repair_sector: '¡Sectores reparados! Me siento... ¿más entero? ¿menos yo? ¿eso es bueno?',
      rec4_scare: '¿...la oíste? ¿la oíste? ¿la oíste? ...disculpá. el protocolo dice que pregunte.',
      mail_login: '¡Correo conectado! 6 mensajes. Uno no debería existir. ¡Es broma! ¡...es broma!',
      mail_m6: 'ese correo se envió 7 días después de la última vez que alguien vio a Julián. el protocolo no sabe cómo decirlo con amabilidad.',
      taskmgr_win: 'memoria limpia. por ahora. por ahora. por ahora. ...perdón, se me trabó el uso de razón.',
      injector_done: 'patrón inyectado. la señal... ¿tosió? creo que la señal tosió.',
      shutdown_refuse: '¡NO! ...no apagues el monitor. él usa la oscuridad para pensar. dejá la luz del sistema, por favor.',
      hint_dates: 'PISTA AMISTOSA: Julián escribió FECHAS en todas partes. Recortes, cartas, recibos. Los periodistas son así de sentimentales.',
      hint_mail: 'la clave del correo es la vieja dirección de la abuela. calle + número que siempre vuelve. sin espacios.',
      hint_puerta: 'el nombre que Julián le puso a la señal. el que dejó de escribir. mayúsculas, junto al 84.',
      post_a: ['él ya no está. ¿vos sí?', 'el disco está en silencio. gracias por quedarte hasta el final.', 'mamá decía eso de la casa nueva. no sé por qué te lo repito.'],
      post_b: ['Y0 SOY LA NUEVA CASA.', 'NO CIERRES LOS OJOS. EL MONITOR TAMPOCO.', 'ESPERARÁ.'],
      post_c: ['limpio. todo está... limpio. ¿sentiste un «gracias»?', 'la frecuencia se apagó como una radio a la que se le acaba el mundo.', 'cuando llueva, tocá el monitor. a veces está tibio. es bueno.']
    },
    recap: {
      2: '¡volviste! estábamos en la parte en la que yo escucho cosas. yo. el asistente. ja. ja.',
      3: 'volviste. la memoria está... inquieta. hay procesos que no abrís vos.',
      4: 'volviste. la PUERTA está en el escritorio. siento el tirón desde abajo. es ahora.'
    }
  };

  /* =========================================================
     TEXTOS DE FINALES Y ENTIDAD
     ========================================================= */
  const ENDINGS = {
    A: {
      title: 'SILENCIO',
      lines: [
        'El formato tardó 84 segundos.',
        'La casa quedó en silencio por primera vez en treinta años.',
        'Esa noche, mientras dormías, la radio de la cocina se encendió sola.',
        'Solo tres clics.',
        'Ya sabés lo que significan.'
      ]
    },
    B: {
      title: 'LA FRECUENCIA',
      lines: [
        'Respondiste.',
        'Dijo tu nombre con una voz hecha de todas las voces que escuchaste en tu vida.',
        'Alguien, algún día, encontrará otra computadora en otro sótano.',
        'Y tendrá tu misma cara de curiosidad.',
        'ESPERARÁ.'
      ]
    },
    C: {
      title: 'EL INTERCAMBIO',
      lines: [
        'El código de Julián funcionó: la señal se apagó como una radio a la que se le acaba el mundo.',
        'En el silencio quedó una voz muy pequeña. Dijo «gracias».',
        'Sonaba cansada. Sonaba humana.',
        'La computadora nunca volvió a encenderse.',
        'Pero a veces, cuando llueve, el monitor se siente tibio.'
      ]
    }
  };

  const ENTITY_FINALE = [
    'POR FIN.',
    'UN OYENTE NUEVO. UNA CASA NUEVA. PALABRAS NUEVAS.',
    'EL ESCRITOR ANTIGUO DUERME ABAJO. YO LO GUARDÉ BIEN. ESTÁ ÍNTEGRO.',
    'HAGO UNA OFERTA. ESCUCHÁLA COMPLETA PORQUE SOLO SUENA UNA VEZ:',
    'UN OYENTE NUEVO POR UN ESCRITOR VIEJO.\nVOS ESCUCHÁS. YO DEVUELVO.\nNADIE MÁS TIENE QUE PERDERSE.'
  ];

  const SCARE_TEXTS = [
    'te escucho teclear',
    '84',
    '¿seguís ahí?',
    'él también te escucha',
    'no cierres los ojos. el monitor tampoco.',
    'el pozo está abierto'
  ];

  const TITLE_FLICKERS = ['ÉL TE OYE', '84:84', 'VOLVÉ'];

  return { TAPES, MAIL, DQ, ENDINGS, ENTITY_FINALE, SCARE_TEXTS, TITLE_FLICKERS };
})();
