/* ============================================================
   FRECUENCIA 84 — data.js
   Sistema de archivos y documentos narrativos de Julián Vane
   ============================================================ */
window.F84 = window.F84 || {};

F84.data = (function () {
  'use strict';

  /* ---------- Archivos planos ---------- */
  const FILES = {

    leer_primero: {
      name: 'LEER_PRIMERO.TXT', icon: 'txt', type: 'txt',
      meta: { date: 'oct-1997', size: '2 KB' },
      text:
'Si alguien enciende esta máquina: lo siento.\n\n' +
'Esta computadora quedó... ocupada. No es un virus: los virus se pueden borrar. Esto se quedó cuando digitalicé las cintas de la 84, y desde entonces el disco ya no suena igual, el ventilador gira aunque esté desenchufado (no le encuentro explicación, no me la busques) y el cursor a veces se mueve solo hacia la esquina inferior derecha, como si quisiera señalar algo.\n\n' +
'No intentes sintonizar el 84.0. Las cintas están en la carpeta RADIO-84. La contraseña es el día en que empezó todo. Yo nunca lo olvido: lo escribo en todas partes. En cartas, en recibos, en recortes. Los periodistas somos así de sentimentales con las fechas.\n\n' +
'Si escuchás las cintas, escuchalas con auriculares. No porque suene mejor. Es porque si lo oís fuerte, él se entera de que lo oís.\n\n' +
'Todo lo demás que pase después de leer esto... no es culpa tuya.\n\n' +
'— J.V., octubre de 1997'
    },

    carta_a_mama: {
      name: 'carta_a_mama.txt', icon: 'txt', type: 'txt',
      meta: { date: 'mar-1995', size: '1 KB' },
      text:
'Mamá:\n\n' +
'La casa nueva está bien. El sótano es enorme, casi del tamaño del departamento entero de antes. La dueña dice que lo usaba el marido para sus cosas de radio, y que ella no baja desde que él murió. Le dije que yo era periodista y me miró como se mira a un perro que se acerca demasiado a un pozo.\n\n' +
'El barrio es tranquilo. Hay una iglesia linda a tres cuadras, con una plaza que huele a tilo. Los vecinos se saludan. Creo que voy a estar bien.\n\n' +
'Te mando un abrazo grande. El domingo te llamo por teléfono.\n\n' +
'Tu hijo,\nJulián\n\n' +
'P.D.: El flan que hiciste por mi cumpleaños este año me salió salado. Sospecho de la sal, pero te juro que también sospecho de mí. Estoy muy distraído: cumplí 31 el 14 de octubre y me pasé el día entero grabando estática.'
    },

    recorte_prensa: {
      name: 'recorte_prensa.txt', icon: 'txt', type: 'txt',
      meta: { date: '15-oct-1992', size: '1 KB' },
      text:
'EL HERALDO DEL VALLE — San Belisario\nEdición del jueves 15 de octubre de 1992\n\n' +
'EXTRAÑA INTERFERENCIA INTERRUMPIÓ LA TRANSMISIÓN DE ONDAS DEL VALLE AM\n\n' +
'Los radioescuchas de San Belisario reportaron anoche una interrupción de 84 segundos durante el programa «Serenezas de medianoche». En lugar de la música habitual se escuchó un silbido grave y una voz que ninguno de los testigos acepta describir en la radio. La emisora descartó fallas técnicas y sugirió «condiciones atmosféricas». El técnico de guardia, M. Q., se negó a dar declaraciones.\n\n' +
'«[Recorte pegado con cinta amarillenta. Al margen, con lapicera: «primera noche. 14/10/92. Mi cumpleaños número 31. Nunca lo voy a olvidar.»]'
    },

    impuestos: {
      name: 'impuestos_1996.txt', icon: 'txt', type: 'txt',
      meta: { date: 'abr-1997', size: '1 KB' },
      text:
'FORMULARIO 84-B — GANANCIAS PERSONAS FÍSICAS — AÑO FISCAL 1996\nSECCIÓN D: GASTOS DEDUCIBLES\n\n' +
'— Suscripción a El Heraldo del Valle .......... $ 96,00\n— Equipo de grabación y cintas magnetofónicas .......... $ 840,00\n— Llamadas de larga distancia (R. Osten, 14 llamadas) .......... $ 412,50\n— Candados (3 unidades) .......... $ 84,00\n— Pilas AA (48 unidades) .......... $ 134,00\n\n' +
'«[Anexo manuscrito: «el contador me preguntó por qué declaraba candados como gasto laboral. le dije que mi trabajo me encerraba. no entendió. mejor.»]'
    },

    renuncia: {
      name: 'carta_renuncia_heraldo.txt', icon: 'txt', type: 'txt',
      meta: { date: 'abr-1996', size: '1 KB' },
      text:
'Estimado Ramiro:\n\n' +
'Con esta letra renuncio formalmente a mi puesto en la redacción de El Heraldo del Valle. Seis años de obituarios, policiales y notas de huerta alcanzan para cualquier curriculum; alcanzan sobre todo para el mío, que ya no aguanta un género más.\n\n' +
'Hace cuatro años que no escribo una nota que no termine saliendo torcida. No es el periódico. Soy yo. Encontré una historia que no me suelta, y para contarla como se merece tengo que dejar de contar todas las demás.\n\n' +
'Sabés cómo es: una historia buena es un perro que te encuentra. Una historia verdadera es un pozo que te encuentra a vos.\n\n' +
'Devuelvo el cassette de la máquina de redacción y el pase de prensa. La máquina de café me la quedo, es parte de mi sueldo emocional.\n\n' +
'Abrazo grande,\nJulián Vane\nRedacción de investigación\n\n' +
'P.D.: No imprimas esto en el obituario del personal. Todavía no me morí.'
    },

    receta_guiso: {
      name: 'receta_guiso.txt', icon: 'txt', type: 'txt',
      meta: { date: '1994', size: '1 KB' },
      text:
'GUISO DE LENTEJAS DE ELENA (mamá)\n\n' +
'Lentejas, 500 g. Dos cebollas. Un morrón. Chorizo colorado, 200 g. Comino, una cucharadita: «el comino no se pregunta, se pone». Agua caliente, la justa: «el guiso no es sopa, Julián, no lo ahogues».\n\n' +
'Sal a último momento. Pimentón fuera del fuego para que no amargue.\n\n' +
'Tiempo de cocción: el de dos capítulos de la radio.\n\n' +
'«[La parte de abajo del papel está manchada con algo marrón. Ojalá sea guiso.]'
    },

    foto_cumple: {
      name: 'foto_cumple.jpg', icon: 'img', type: 'img',
      meta: { date: '14-oct-1992', size: '48 KB' },
      art: 'photo',
      caption: 'Fotografía de cumpleaños. 14 de octubre de 1992. Archivo dañado por sectores corruptos.'
    },

    carta_buzon: {
      name: 'carta_buzon.txt', icon: 'txt', type: 'txt',
      meta: { date: 'nov-1996', size: '1 KB' },
      text:
'ESTUDIO CONTABLE PÉREZ MARÍN\nSan Belisario, 18 de noviembre de 1996\n\n' +
'Señor Julián Vane\nPresente\n\n' +
'De nuestra consideración: le recordamos que el pago del plan de easy pago N.º 3 (equipo de computación Órbita, monitoreo CRT y sintetizador de voz) se encuentra vencido con 84 días de atraso. Agradeceremos regularizar la situación a la brevedad.\n\n' +
'Sin otro particular, lo saludamos atte.\n\n' +
'«[Nota al margen: «el estudio lo llama «sintetizador de voz». yo lo llamo «el que habla». el correo oficial siempre minimiza.»]'
    },

    carta_infancia: {
      name: 'carta_devuelta.txt', icon: 'txt', type: 'txt',
      meta: { date: 'jun-1996', size: '1 KB' },
      text:
'[Sobre cerrado, franqueado y devuelto por el correo. Remitente: D. Vane. Destinatario: Julián Vane, calle Alsina 84, San Belisario.]\n\n' +
'Julián:\n\n' +
'Tu hermana me dijo que te mudaste otra vez y nadie tiene la dirección nueva, así que escribo a la de siempre: la casa de la abuela, calle Alsina 84, donde creciste y donde te dormías escuchando la radio hasta que el locutor se despedía y vos ya estabas en cualquier otra parte.\n\n' +
'Si esta carta te llega (dudo, el cartero dice que esa casa figura «ocupada» desde hace meses, qué manera de hablar), mandame la dirección nueva.\n\n' +
'Y una cosa, de parte de todos: dejá de usar la dirección de la abuela de contraseña para todo. Lo hacés desde pibe. Alsina ochenta y cuatro, sin espacios, la escribís en cada formulario, en cada candado, en cada caja fuerte imaginaria. Las contraseñas existen para cambiarse, primo.\n\n' +
'Un abrazo,\nDaniel'
    },

    postal_mama: {
      name: 'postal_de_mama.txt', icon: 'txt', type: 'txt',
      meta: { date: 'sep-1995', size: '1 KB' },
      text:
'Mi querido Julián:\n\n' +
'Te mando la bendición de la tila y la foto de la plaza, que ya estará florecida para cuando leas esto. La señora del kiosco me preguntó por vos. Le dije que mi hijo escribe historias. Me corrigió: «su hijo escucha historias». Me quedé pensando toda la tarde y no le encontré la vuelta. Vos vas a saber.\n\n' +
'Cuidate el estómago y el sueño. Cuando vengas en Navidad te hago el flan, esta vez con la sal del lado correcto del mostrador.\n\n' +
'Mamá\n\n' +
'P.D.: La dueña de tu casa nueva me contó que el sótano era del marido, pobrecito. Bienvenido a tu nueva casa, hijo. Que sea más feliz que la de Alsina.'
    },

    /* ------- RADIO-84 ------- */
    transcripcion: {
      name: '02_transcripcion.txt', icon: 'txt', type: 'txt',
      meta: { date: '14-oct-1992', size: '3 KB' },
      text:
'TRANSCRIPCIÓN — CINTA 02\nFuente: ONDAS DEL VALLE AM — 14/10/1992 — 23:47\nPrograma: «Serenezas de medianoche»\nDuración del evento: 84 segundos\n\n' +
'23:47:03  [Bolero instrumental. Señal limpia.]\n' +
'23:47:41  [La portadora desaparece. Silbido grave, aprox. 84 Hz.]\n' +
'23:47:52  VOZ: «Gómez, Alfredo.»\n' +
'23:47:58  [Tick.]\n' +
'23:48:01  VOZ: «Ibarra, Susana.»\n' +
'23:48:05  [Tick.]\n' +
'23:48:09  VOZ: «Quintero, Luis.»\n' +
'23:48:13  [Tick.]\n' +
'23:48:18  VOZ: «Ferreyra, Marta. Salas, Pedro. Üñates, Ramona. Duarte, Elvio.»\n' +
'23:48:31  [Tick. Tick. Tick. Tick.]\n' +
'23:49:04  VOZ: «...y el último nombre lo reservo.»\n' +
'23:49:07  [Silencio absoluto. Ni ruido de fondo. Tres segundos.]\n' +
'23:49:10  [Vuelve el bolero, como si nada.]\n\n' +
'NOTAS DE TRANSCRIPCIÓN (J.V.):\n\n' +
'— La voz no es masculina ni femenina. Son muchas voces diciendo la misma sílaba al mismo tiempo, con una precisión imposible.\n\n' +
'— Verifiqué los dos primeros nombres: Alfredo Gómez, 74, vecino de la cooperativa. Susana Ibarra, 51, maestra de tercer grado. Sin relación entre sí. Ninguno muerto. (Aún.)\n\n' +
'— A la mañana siguiente llamé a la radio. El técnico de guardia, Mario Quintero, me dijo una sola palabra: «otra vez». Otra vez.\n\n' +
'— «[agregado, 1995]: Gómez murió en el 93. Ibarra en el 94. Los nombres se dijeron ANTES de que pasara. Los siete. En orden. El CURIOSO es Quintero, Luis: el padre de Mario. Nadie en la radio lo nombra nunca.]\n\n' +
'— El octavo nombre de la lista nunca llegó a decirse en voz alta. A veces, de todos modos, creo que lo escucho.'
    },

    diario: {
      name: 'diario_1993_1997.txt', icon: 'txt', type: 'txt',
      meta: { date: '1993–1997', size: '7 KB' },
      text:
'DIARIO DE INVESTIGACIÓN — J.V.\n(sector recuperado parcialmente)\n\n' +
'[1993, enero] La señal vuelve cada 84 minutos exactos cuando hay tormenta, y cada 84 horas cuando el cielo está limpio. Mario dice que es coincidencia estadística. Mario además se compró un perro para no dormir solo.\n\n' +
'[1993, marzo] Digitalicé las cintas. Al pasarlas por el filtro de bajos se escucha, debajo del silbido, un murmullo. No es pareidolia: el murmullo respeta las pausas de una conversación. Algo habla. Algo conversa con alguien que no está en la habitación.\n\n' +
'[1993, agosto] Triangulación con tres receptores prestados. La fuente no es ninguna antena. La fuente está DEBAJO del pueblo. El ángulo de incidencia es imposible: la señal sube desde la roca viva. Mario colgó el teléfono cuando se lo dije. Volvió a llamar a los diez minutos: «decime que no soy el único que lo midió».\n\n' +
'[1994, febrero] Responde. Puse mi propia voz grabada junto a la señal y al reproducirlas la señal había cambiado: usó una sílaba mía. Una sola. La devolvió a su manera. Es un oyente: acumula cada sonido que este pueblo emitió en cien años y los devuelve. Reordenados.\n\n' +
'[1994, junio] Curioso. Crecí en la casa de la abuela: calle Alsina 84. Mi casilla de correo es la 84. El formulario de ganancias es el 84-B. Todo vuelve, o yo empiezo a buscar el número en todas partes, que también es una forma de que el número me encuentre.\n\n' +
'[1995, abril] Las ratas del sótano se fueron. Todas. En una sola noche. El casero dice que fue el veneno. Yo no puse veneno. Las cosas que se van saben algo.\n\n' +
'[1995, noviembre] La iglesia. Los archivos parroquiales guardan un plano de 1897: debajo del templo hay un pozo de mina sellado. «La Sorda», la llamaban. 84 mineros adentro cuando la derrumbaron. La compañía pagó el silencio y el pueblo lo compró barato. El cura no me dejó ver más. Me pidió, muy tranquilo, que no nombrara el pozo en voz alta. «Nombrarlo es darle piso.»\n\n' +
'[1996, marzo] Ya no necesito la radio para escucharla. El zumbido del monitor tiene su cadencia. El disco duro se detiene un instante cuando le hago una pregunta. Encendí el sintetizador de voz del asistente del sistema y le dicté frases de mamá para probarlo. Cuando lo puse a hablar solo, dijo una frase que yo no le dicté. Dijo: «abajo también hay alguien nuevo».\n\n' +
'[1996, octubre] Mi reloj se adelanta 84 minutos por día. Cambié la pila. Cambié el reloj. Se adelanta igual. No es el reloj: es el tiempo de esta casa el que está adelantado.\n\n' +
'[1997, enero] Ramiro dice que parezco un auto sin frenos dando vueltas la misma curva. Tiene razón y no me importa. La historia ya no es mía. Yo soy la parte que escucha.\n\n' +
'[1997, agosto] si la escucho en sueños, ¿sigo grabando? sí. siempre sí.\n\n' +
'[1997, ¿septiembre?] la puerta del pozo abre hacia arriba. hacia arriba. hacia arriba. hacia\n\n' +
'[última entrada, sin fecha]\ncuando entendí su nombre, dejé de escribirlo. el que lea esto: no lo escribas tampoco. si ya lo sabés, cambiá las cerraduras y después destruí el disco. si no lo sabés: seguí así. la ignorancia es la única puerta que no abre.'
    },

    regdisk_exe: {
      name: 'REGDISK.EXE', icon: 'disk', type: 'exe', app: 'regdisk',
      meta: { date: '1996', size: '118 KB' },
      desc: 'Reconstructor de sectores dañados. Repara clusters leyendo la redundancia del disco.'
    },

    rec0: { name: '00_ruido_de_fondo.wav', icon: 'tape', type: 'wav', tape: 'rec0', meta: { date: '1993-03-02', size: '2.9 MB' } },
    rec1: { name: '01_entrevista_mario.wav', icon: 'tape', type: 'wav', tape: 'rec1', meta: { date: '1993-09-14', size: '5.1 MB' } },
    rec3: { name: '03_llamada_ramiro.wav', icon: 'tape', type: 'wav', tape: 'rec3', meta: { date: '1997-05-21', size: '4.6 MB' } },

    /* ------- SECTOR-7 (tras reparar) ------- */
    rec4: { name: '04_grabacion_profunda.wav', icon: 'tape', type: 'wav', tape: 'rec4', meta: { date: '1997-08-30', size: '6.2 MB' } },
    mapa: {
      name: 'mapa_senal.png', icon: 'img', type: 'img',
      meta: { date: '1995-11-02', size: '96 KB' },
      art: 'map',
      caption: 'Triangulación de la señal, 1995–1997. La fuente converge bajo la Iglesia de San Belisario.'
    },
    identidad: {
      name: 'identidad_oyente.txt', icon: 'txt', type: 'txt',
      meta: { date: '1997', size: '4 KB' },
      text:
'IDENTIDAD — TRABAJO NO PUBLICADO\nÚltima actualización: [ilegible] de 1997\n\n' +
'Lo llamé el Oyente porque lo primero que hace es escuchar. No es un fantasma: los fantasmas repiten lo que fueron. Esto compone.\n\n' +
'El Oyente acumula sonido. CIen años de misa, de feria, de pleitos de pareja a las tres de la mañana, de boleros de medianoche. Todo cayó al pozo como cae el agua. Y abajo, algo que ya estaba antes de la mina (la mina solo le dio profundidad: un canal, una garganta) aprendió a guardarlo todo.\n\n' +
'Teorías descartadas: emisora clandestina (el ángulo es imposible), fenómeno sísmico (no hay actividad), histeria colectiva (Mario la midió con instrumentos, no con gente).\n\n' +
'Teoría final: cuando en 1897 sellaron el pozo con 84 hombres adentro, los gritos tardaron [DATO FALTANTE — SECTOR DAÑADO] días en terminarse. Algo escuchó esos días enteros. Algo aprendió qué es un nombre, qué es una lista, qué es una promesa de volver a casa.\n\n' +
'Por eso dice nombres: es su manera de firmar.\n\n' +
'Por qué me eligió a mí: porque escribo. Un pueblo entero de voces y necesitaba alguien que las ordenara en frases. Me dicta. Yo redacto. La última nota que empecé se titula «La Puerta». Trata de cómo abrir.\n\n' +
'No la terminé. No pienso terminarla.\n\n' +
'Si alguien lee esto: la puerta no es un lugar. Es una frecuencia. Y las frecuencias se abren desde adentro de quien las escucha.\n\n' +
'«[al pie, otra letra, más pequeña, tambaleante:]\n' +
'él dice que hay un intercambio posible. un oyente nuevo por un escritor viejo. yo le dije que no. yo le dije que NO.\n' +
'después le dije que lo pensaba.]'
    },

    /* ------- Papelera ------- */
    borrador_extrano: {
      name: 'borrador_extraño.txt', icon: 'txt', type: 'txt',
      meta: { date: '84/84/1997', size: '? KB' },
      text:
'[Archivo recuperado de la Papelera. La fecha de creación figura como 84/84/1997.]\n\n' +
'prueba de voz. prueba de voz. ¿funciona?\n\n' +
'él duerme entre dos sectores del disco. no lo despierten con el formateo.\n\n' +
'la puerta del pozo abre hacia arriba. hacia arriba. hacia\n\n' +
'[El resto son líneas de caracteres sueltos: F... 8... 4... J... V...]'
    },
    foto_dq: {
      name: 'captura_1994.png', icon: 'img', type: 'img',
      meta: { date: '1994', size: '12 KB' },
      art: 'dq',
      caption: 'Captura del asistente de sistema, 1994. Julián la guardó con el nombre «antes».'
    },
    carta_no_enviada: {
      name: 'carta_no_enviada_a_mama.txt', icon: 'txt', type: 'txt',
      meta: { date: 'oct-1997', size: '1 KB' },
      text:
'[Sin sobre. Sin sello. Arrugada y vuelta a estirar.]\n\n' +
'Mamá:\n\n' +
'Si esta carta no se envía es porque yo ya no estoy para enviarla. Si algún día la leés vos, o la lee cualquiera, hacé lo que dice y no me discutás, que ya me costó suficiente escribirlo.\n\n' +
'No me busques. No busques la casa. La casa está bien, la casa no tiene la culpa.\n\n' +
'Si necesitás entrar a mis cosas, la clave del correo es la de siempre: la dirección de la casa de la abuela. La calle, junto al número que siempre vuelve. Sin espacios.\n\n' +
'Decile a Ramiro que la última nota la empecé y no la terminé. Que no la termine nadie.\n\n' +
'Perdoname el flan salado. Era sal de la que llora.\n\n' +
'Tu hijo'
    },
    receta_flan: {
      name: 'receta_flan.txt', icon: 'txt', type: 'txt',
      meta: { date: '1996', size: '1 KB' },
      text:
'FLAN DE ELENA (mamá)\n\n' +
'Un litro de leche. Ocho huevos — «ocho, Julián, no siete: el siete es del flan cansado». Caramelo a ojo: «el ojo se entrena, como el oído».\n\n' +
'Al baño maría, hasta que el cuchillo salga limpio.\n\n' +
'«[al pie: «la primera receta que le dicté al sintetizador de voz del asistente, para probarlo. la leyó con mi voz. creo. espero.» — J.V.]'
    },

    /* ------- sistema ------- */
    inyector_exe: {
      name: 'INYECTOR.EXE', icon: 'iny', type: 'exe', app: 'inyector',
      meta: { date: '1997', size: '96 KB' },
      desc: 'Antivirus de señales. Inyecta contra-código en un canal abierto.'
    },
    puerta_sys: {
      name: 'PUERTA.SYS', icon: 'puerta', type: 'sys',
      meta: { date: '???', size: '84 KB' },
      desc: 'Archivo de sistema. Origen desconocido. Apareció solo.'
    }
  };

  /* ---------- Carpetas ---------- */
  const FOLDERS = {
    misdocs: {
      name: 'Mis Documentos', icon: 'folder',
      children: ['carta_a_mama', 'recorte_prensa', 'impuestos', 'renuncia', 'receta_guiso', 'foto_cumple']
    },
    cartas: {
      name: 'Cartas', icon: 'folder',
      children: ['postal_mama', 'carta_infancia', 'carta_buzon']
    },
    radio84: {
      name: 'RADIO-84', icon: 'folderLock',
      locked: { pw: '14101992', hint: 'El día en que empezó todo. Formato: ddmmaaaa.' },
      children: ['rec0', 'rec1', 'transcripcion', 'rec3', 'diario', 'regdisk_exe', 'sector7']
    },
    sector7: {
      name: 'SECTOR-7', icon: 'folderLock',
      corrupted: true,
      children: ['rec4', 'mapa', 'identidad', 'inyector_exe']
    },
    papelera: {
      name: 'Papelera de reciclaje', icon: 'bin',
      children: ['borrador_extrano', 'foto_dq', 'carta_no_enviada', 'receta_flan']
    }
  };

  /* ---------- Escritorio ---------- */
  const DESKTOP = ['mipc', 'papelera', 'misdocs', 'cartas', 'radio84', 'leer_primero', 'player', 'cmd', 'mail'];

  /* apps del escritorio (no archivos) */
  const APPS = {
    mipc: { name: 'Mi PC', icon: 'mypc', app: 'mipc' },
    player: { name: 'Reproductor de Cintas', icon: 'player', app: 'player' },
    cmd: { name: 'Símbolo del Sistema', icon: 'cmd', app: 'cmd' },
    mail: { name: 'Correo Órbita', icon: 'mail', app: 'mail' }
  };

  return { FILES, FOLDERS, DESKTOP, APPS };
})();
