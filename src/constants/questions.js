import { supabase } from '../lib/supabaseClient'

const ERA_MAP = {
  'contemporanea': 'Época Contemporánea',
  'antigua': 'Edad Antigua',
  'media': 'Edad Media',
  'prehistoria_h': 'Prehistoria',
  'moderna': 'Edad Moderna',
  'geologica': 'is_geo'
}

/**
 * Obtiene eventos de Supabase y los transforma en preguntas.
 */
export async function getQuestionsForNode(islandEraId, nodeTheme, mode = 'first', count = 5) {
  try {
    let query = supabase.from('events_db').select('*');

    // 1. FILTRO POR ERA (Obligatorio)
    if (islandEraId === 'geologica') {
      query = query.eq('is_geo', true);
    } else {
      query = query.eq('era', ERA_MAP[islandEraId]);
    }

    // 2. FILTRO POR TEMA (Búsqueda Flexible)
    // Usamos 'ilike' para que "Deportes" encuentre "Finales Champions League"
    if (nodeTheme) {
      query = query.or(`theme.ilike.%${nodeTheme}%, theme.ilike.%Historia%, theme.ilike.%Ciencia%`);
    }

    const { data: events, error } = await query;

    // 3. FALLBACK: Si no hay eventos suficientes, traemos cualquiera de esa Era
    if (error || !events || events.length < 2) {
      const { data: fallback } = await supabase
        .from('events_db')
        .select('*')
        .eq('era', ERA_MAP[islandEraId])
        .limit(20);
      return formatQuestions(fallback || [], mode, count);
    }

    return formatQuestions(events, mode, count);
  } catch (e) {
    console.error("Error en Códice Supabase:", e);
    return [];
  }
}

function formatQuestions(events, mode, count) {
  // Mezcla aleatoria de los eventos obtenidos
  const pool = [...events].sort(() => 0.5 - Math.random());

  if (mode === 'first') {
    return Array.from({ length: count }).map(() => {
      // Tomamos 2 eventos al azar para el duelo
      const pair = [...pool].sort(() => 0.5 - Math.random()).slice(0, 2);
      if (pair.length < 2) return null;

      const answer = pair[0].year < pair[1].year ? 0 : 1;
      return {
        type: 'first',
        event1: pair[0],
        event2: pair[1],
        answer,
        theme: pair[0].theme,
        ...pair[answer] // Datos para la EventCard
      };
    }).filter(Boolean);
  }

  if (mode === 'ladder') {
    return pool.slice(0, count).map(event => {
      // Generamos distractores de la misma era
      const distractors = pool.filter(e => e.id !== event.id).slice(0, 3);
      const options = [event.name, ...distractors.map(d => d.name)].sort(() => 0.5 - Math.random());

      return {
        question: `¿Qué ocurrió en el año ${Math.abs(event.year)} ${event.year < 0 ? 'a.C.' : 'd.C.'}?`,
        options,
        answer: options.indexOf(event.name),
        ...event
      };
    });
  }
  return [];
}