/**
 * raw_questions.js — Banco de preguntas recicladas del proyecto anterior.
 *
 * ════════════════════════════════════════════════════════════════════
 *  INSTRUCCIÓN PARA MARCELO:
 *  Pega aquí el contenido completo de tu antiguo archivo 'gameData.js'
 *  (o el array de preguntas) reemplazando el array RAW_QUESTIONS_LEGACY.
 *
 *  Cuando lo hagas, ejecuta: node scripts/processQuestions.mjs
 *  Ese script asignará cada pregunta al nodo correcto en islands.js
 *  según la temática (paleozoico / mesozoico / cenozoico) y dificultad.
 * ════════════════════════════════════════════════════════════════════
 *
 * Formato esperado de cada pregunta legacy:
 * {
 *   question:  string,
 *   options:   string[4],
 *   answer:    number (0-3, índice de la opción correcta),
 *   topic?:    string (ej: 'dinosaurios', 'paleozoico', 'geologia'),
 *   difficulty?: 'easy' | 'medium' | 'hard'
 * }
 *
 * Si las preguntas antiguas tienen otro formato, el procesador
 * intentará normalizarlas automáticamente.
 */

export const RAW_QUESTIONS_LEGACY = [
  { name: "Formación de la Luna", year: -4500000000, era: "Hadeico", emoji: "🌑", summary: "La Luna se formó tras un impacto gigante entre la proto-Tierra y un cuerpo del tamaño de Marte, llamado Theia.", theme: "Geología" },
  { name: "Aparición del oxígeno en la atmósfera", year: -2400000000, era: "Arcaico", emoji: "💨", summary: "La Gran Oxidación cambió la atmósfera terrestre gracias a las cianobacterias.", theme: "Geología" },
  { name: "Primeras plantas terrestres", year: -470000000, era: "Paleozoico", emoji: "🌿", summary: "Las primeras plantas vasculares colonizaron la tierra firme, transformando el paisaje.", theme: "Escala del tiempo geológico" },
  { name: "Formación del supercontinente Pangea", year: -335000000, era: "Paleozoico", emoji: "🌍", summary: "Todos los continentes se unieron en Pangea durante el período Carbonífero.", theme: "Escala del tiempo geológico" },
  { name: "Aparición de los primeros dinosaurios", year: -230000000, era: "Mesozoico", emoji: "🦖", summary: "Los primeros dinosaurios surgieron en el Triásico como pequeños bípedos.", theme: "Paleontología y Evolución" },
  { name: "Era de los dinosaurios gigantes (Jurásico)", year: -201000000, era: "Mesozoico", emoji: "🦕", summary: "El Jurásico marcó el apogeo de dinosaurios gigantes como el Brachiosaurus.", theme: "Paleontología y Evolución" },
  { name: "Extinción de los dinosaurios", year: -66000000, era: "Mesozoico", emoji: "☄️", summary: "Un asteroide de 10 km impactó en Yucatán causando la extinción masiva del Cretácico-Paleógeno.", theme: "Paleontología y Evolución" },
  { name: "Formación de la Cordillera de los Andes", year: -25000000, era: "Cenozoico", emoji: "⛰️", summary: "La subducción de la placa de Nazca bajo la placa Sudamericana levantó los Andes.", theme: "Vulcanismo y Tectónica" },
  { name: "Formación del Gran Cañón", year: -6000000, era: "Cenozoico", emoji: "🏜️", summary: "El río Colorado esculpió el Gran Cañón a través de millones de años de erosión fluvial.", theme: "Geología" },
  { name: "Aparición del Mamut Lanudo", year: -5000000, era: "Cenozoico", emoji: "🦣", summary: "El mamut lanudo evolucionó en Siberia adaptándose a las condiciones frías del Pleistoceno.", theme: "Paleontología y Evolución" },
  { name: "Último Máximo Glacial", year: -20000, era: "Cenozoico", emoji: "🧊", summary: "Hace 20.000 años grandes masas de hielo cubrían el norte de Europa, Asia y América.", theme: "Escala del tiempo geológico" },
  { name: "Darwin presencia el terremoto de Concepción", year: 1835, era: "Cenozoico", emoji: "📓", summary: "Darwin fue testigo del terremoto de Concepción de 1835, influenciando sus teorías geológicas.", theme: "Geología de Chile" },
  { name: "Gran Terremoto de San Francisco", year: 1906, era: "Cenozoico", emoji: "🏚️", summary: "El terremoto de 1906 destruyó San Francisco y fue un hito en el estudio de fallas geológicas.", theme: "Peligros Geológicos" },
  { name: "Alfred Wegener propone la Deriva Continental", year: 1912, era: "Cenozoico", emoji: "🗺️", summary: "Wegener propuso que los continentes habían estado unidos, fundando la teoría de la deriva continental.", theme: "Tectónica de Placas" },
  { name: "Terremoto de Valdivia", year: 1960, era: "Cenozoico", emoji: "🌊", summary: "El terremoto de Valdivia fue el más poderoso registrado en la historia, con magnitud 9,5 Mw.", theme: "Geología de Chile" },
  { name: "Erupción del Monte Santa Helena", year: 1980, era: "Cenozoico", emoji: "🌋", summary: "La erupción del Monte Santa Helena fue la más mortífera en la historia de los Estados Unidos.", theme: "Vulcanismo y Tectónica" },
  { name: "Terremoto de Chile 27F 8,8 Mw", year: 2010, era: "Cenozoico", emoji: "🏗️", summary: "El terremoto del 27F tuvo magnitud 8,8 Mw y generó un tsunami que afectó la costa chilena.", theme: "Geología de Chile" },
  { name: "Erupción del Volcán Hunga Tonga", year: 2022, era: "Cenozoico", emoji: "💥", summary: "La erupción del Hunga Tonga fue una de las más poderosas del siglo XXI.", theme: "Vulcanismo y Tectónica" },
  { name: "Primera imagen de un Agujero Negro", year: 2019, era: "Cenozoico", emoji: "🔭", summary: "El Event Horizon Telescope capturó la primera imagen de un agujero negro en la galaxia M87.", theme: "Geología" },
  { name: "Descubrimiento de la Falla de San Andrés", year: 1895, era: "Cenozoico", emoji: "🔬", summary: "Andrew Lawson identificó por primera vez la Falla de San Andrés en California.", theme: "Geología" },
  // HISTÓRICOS
  { name: "Invención de la rueda", year: -3500, era: "Prehistoria", emoji: "⚙️", summary: "La rueda fue inventada en Mesopotamia, revolucionando el transporte y la maquinaria.", theme: "Imperios de la antigüedad" },
  { name: "Construcción de la Gran Pirámide de Giza", year: -2560, era: "Edad Antigua", emoji: "🏺", summary: "La Gran Pirámide fue construida como tumba del faraón Keops durante el Imperio Antiguo egipcio.", theme: "Imperios de la antigüedad" },
  { name: "Fundación de la Gran Muralla China", year: -221, era: "Edad Antigua", emoji: "🏯", summary: "El emperador Qin Shi Huang inició la Gran Muralla para proteger el Imperio Chino.", theme: "Imperios de la antigüedad" },
  { name: "Coronación de Carlomagno", year: 800, era: "Edad Media", emoji: "👑", summary: "Carlomagno fue coronado Emperador del Sacro Imperio Romano Germánico por el Papa León III.", theme: "Revoluciones del mundo" },
  { name: "Viajes de Marco Polo a China", year: 1271, era: "Edad Media", emoji: "🧭", summary: "Marco Polo emprendió su viaje a China en 1271, abriendo rutas comerciales entre Europa y Asia.", theme: "Grandes exploradores" },
  { name: "La imprenta de Gutenberg", year: 1440, era: "Edad Moderna", emoji: "📰", summary: "Gutenberg inventó la imprenta de tipos móviles, revolucionando la difusión del conocimiento.", theme: "Inventos tecnológicos" },
  { name: "Llegada de Colón a América", year: 1492, era: "Edad Moderna", emoji: "⛵", summary: "El 12 de octubre de 1492 Colón llegó a América, iniciando la era de los grandes descubrimientos.", theme: "Grandes exploradores" },
  { name: "Da Vinci pinta la Mona Lisa", year: 1503, era: "Edad Moderna", emoji: "🖼️", summary: "Leonardo da Vinci comenzó la Mona Lisa alrededor de 1503, la obra de arte más famosa del mundo.", theme: "Grandes pintores" },
  { name: "Newton describe la gravedad", year: 1687, era: "Edad Moderna", emoji: "🍎", summary: "Newton publicó los Principia Mathematica describiendo la ley de la gravitación universal.", theme: "Descubrimientos científicos" },
  { name: "Independencia de los Estados Unidos", year: 1776, era: "Edad Moderna", emoji: "🗽", summary: "El 4 de julio de 1776 las Trece Colonias declararon independencia de Gran Bretaña, fundando los EE.UU.", theme: "Revoluciones del mundo" },
  { name: "Revolución Francesa", year: 1789, era: "Edad Moderna", emoji: "🔥", summary: "La Revolución Francesa de 1789 derrocó la monarquía y proclamó libertad, igualdad y fraternidad.", theme: "Revoluciones del mundo" },
  { name: "Hundimiento del Titanic", year: 1912, era: "Época Contemporánea", emoji: "🚢", summary: "El Titanic se hundió el 15 de abril de 1912 tras chocar con un iceberg, causando 1.500 muertes.", theme: "Historia de Chile" },
  { name: "Inicio de la Primera Guerra Mundial", year: 1914, era: "Época Contemporánea", emoji: "💣", summary: "La Primera Guerra Mundial comenzó en 1914 tras el asesinato del archiduque Francisco Fernando.", theme: "Guerras Mundiales" },
  { name: "Fin de la Segunda Guerra Mundial", year: 1945, era: "Época Contemporánea", emoji: "🕊️", summary: "La Segunda Guerra Mundial terminó en 1945 con la rendición de Alemania y Japón.", theme: "Guerras Mundiales" },
  { name: "Laika: el primer ser vivo en órbita", year: 1957, era: "Época Contemporánea", emoji: "🐕", summary: "Laika fue el primer ser vivo en orbitar la Tierra a bordo del Sputnik 2.", theme: "Exploración espacial" },
  { name: "Apolo 11: El hombre llega a la Luna", year: 1969, era: "Época Contemporánea", emoji: "🌕", summary: "El 20 de julio de 1969 Neil Armstrong y Buzz Aldrin fueron los primeros humanos en pisar la Luna.", theme: "Exploración espacial" },
  { name: "Caída del Muro de Berlín", year: 1989, era: "Época Contemporánea", emoji: "🧱", summary: "El 9 de noviembre de 1989 cayó el Muro de Berlín, simbolizando el fin de la Guerra Fría.", theme: "Guerras Mundiales" },
  { name: "Revolución Digital e Internet", year: 1991, era: "Época Contemporánea", emoji: "💻", summary: "En 1991 Tim Berners-Lee lanzó la World Wide Web al público, iniciando la revolución de Internet.", theme: "Inventos tecnológicos" },
  { name: "Lanzamiento de YouTube", year: 2005, era: "Época Contemporánea", emoji: "▶️", summary: "YouTube fue lanzado en 2005, convirtiéndose en la plataforma de vídeo más popular del mundo.", theme: "Inventos tecnológicos" },
  { name: "Lanzamiento del primer iPhone", year: 2007, era: "Época Contemporánea", emoji: "📱", summary: "Apple lanzó el primer iPhone en 2007, iniciando la era de los smartphones modernos.", theme: "Inventos tecnológicos" },
]
