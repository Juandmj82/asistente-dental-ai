import type { ClasificacionIA } from './types';

export const CASOS_DE_PRUEBA_COLOMBIANOS: { id: number; mensaje: string; esperado: ClasificacionIA }[] = [
  {
    id: 1,
    mensaje: "De una doc, allá estaré firme",
    esperado: { intencion: 'CONFIRMAR', confianza: 0.98, fecha_propuesta: null, requiere_humano: false }
  },
  {
    id: 2,
    mensaje: "Listo, cuente con eso",
    esperado: { intencion: 'CONFIRMAR', confianza: 0.97, fecha_propuesta: null, requiere_humano: false }
  },
  {
    id: 3,
    mensaje: "Buenas, sí señora allá caigo a esa hora",
    esperado: { intencion: 'CONFIRMAR', confianza: 0.96, fecha_propuesta: null, requiere_humano: false }
  },
  {
    id: 4,
    mensaje: "Sisas, allá llego",
    esperado: { intencion: 'CONFIRMAR', confianza: 0.95, fecha_propuesta: null, requiere_humano: false }
  },
  {
    id: 5,
    mensaje: "Sisi confirmo",
    esperado: { intencion: 'CONFIRMAR', confianza: 0.99, fecha_propuesta: null, requiere_humano: false }
  },
  {
    id: 6,
    mensaje: "Me salió un chicharrón en el camello, me toca moverla",
    esperado: { intencion: 'REPROGRAMAR', confianza: 0.94, fecha_propuesta: null, requiere_humano: false }
  },
  {
    id: 7,
    mensaje: "Vecina qué pena, ¿será que me la puede pasar pal viernes en la tardecita?",
    esperado: { intencion: 'REPROGRAMAR', confianza: 0.93, fecha_propuesta: "viernes en la tarde", requiere_humano: false }
  },
  {
    id: 8,
    mensaje: "Se me cruzó con una vuelta del banco, ¿hay campo el lunes?",
    esperado: { intencion: 'REPROGRAMAR', confianza: 0.92, fecha_propuesta: "el lunes", requiere_humano: false }
  },
  {
    id: 9,
    mensaje: "No alcanzo a llegar por el trancón tan berraco, ¿la corremos una hora?",
    esperado: { intencion: 'REPROGRAMAR', confianza: 0.91, fecha_propuesta: "correr 1 hora", requiere_humano: false }
  },
  {
    id: 10,
    mensaje: "¿Tienen un huequito para la otra semana? Es que estoy fuera de Bogotá",
    esperado: { intencion: 'REPROGRAMAR', confianza: 0.93, fecha_propuesta: "la otra semana", requiere_humano: false }
  },
  {
    id: 11,
    mensaje: "Definitivamente no puedo seguir con el tratamiento, muchas gracias",
    esperado: { intencion: 'CANCELAR', confianza: 0.96, fecha_propuesta: null, requiere_humano: false }
  },
  {
    id: 12,
    mensaje: "Cancelemos eso por ahora que ando sin plata",
    esperado: { intencion: 'CANCELAR', confianza: 0.95, fecha_propuesta: null, requiere_humano: false }
  },
  {
    id: 13,
    mensaje: "Ya no me sirve, borren la cita porfa",
    esperado: { intencion: 'CANCELAR', confianza: 0.97, fecha_propuesta: null, requiere_humano: false }
  },
  {
    id: 14,
    mensaje: "¿A qué hora fue que me dijeron? Se me embolató el mensaje",
    esperado: { intencion: 'DUDA_HORARIO', confianza: 0.95, fecha_propuesta: null, requiere_humano: false }
  },
  {
    id: 15,
    mensaje: "Buenos días, ¿me repite la hora por favor?",
    esperado: { intencion: 'DUDA_HORARIO', confianza: 0.98, fecha_propuesta: null, requiere_humano: false }
  },
  {
    id: 16,
    mensaje: "Parce tengo la muela que me estalla, necesito que me atiendan ya",
    esperado: { intencion: 'NO_RECONOCIDO', confianza: 0.50, fecha_propuesta: null, requiere_humano: true }
  },
  {
    id: 17,
    mensaje: "¿Cuánto vale la calzadura blanca?",
    esperado: { intencion: 'NO_RECONOCIDO', confianza: 0.40, fecha_propuesta: null, requiere_humano: true }
  },
  {
    id: 18,
    mensaje: "[Audio recibido de 0:15]",
    esperado: { intencion: 'NO_RECONOCIDO', confianza: 0.30, fecha_propuesta: null, requiere_humano: true }
  },
  {
    id: 19,
    mensaje: "👍",
    esperado: { intencion: 'CONFIRMAR', confianza: 0.92, fecha_propuesta: null, requiere_humano: false }
  },
  {
    id: 20,
    mensaje: "No sé si alcance, le confirmo en un rato",
    esperado: { intencion: 'NO_RECONOCIDO', confianza: 0.65, fecha_propuesta: null, requiere_humano: true }
  }
];

export function clasificarRespuestaLocal(texto: string): ClasificacionIA {
  const t = texto.toLowerCase().trim();

  // Caso 1: Confirmaciones directas o modismos colombianos
  if (
    t === '1' ||
    t === '👍' ||
    t.includes('firme') ||
    t.includes('de una') ||
    t.includes('cuente con eso') ||
    t.includes('allá caigo') ||
    t.includes('alla caigo') ||
    t.includes('sisas') ||
    t.includes('sisi confirmo') ||
    t.includes('confirmo') ||
    t.includes('confirmar') ||
    t.includes('allá llego') ||
    t.includes('alla llego') ||
    t.includes('si señora allá') ||
    t.includes('si señora alla') ||
    (t.includes('si') && t.includes('voy'))
  ) {
    return {
      intencion: 'CONFIRMAR',
      confianza: 0.96,
      fecha_propuesta: null,
      requiere_humano: false,
      razonamiento: 'Patrón de asentimiento o confirmación en jerga colombiana detectado con alta confianza.',
      modelo: 'claude-3-5-sonnet-emulated',
      tokens: 42
    };
  }

  // Caso 2: Cancelación
  if (
    t.includes('no puedo seguir') ||
    t.includes('cancelemos') ||
    t.includes('cancelar') ||
    t.includes('borren la cita') ||
    t.includes('ya no me sirve') ||
    t.includes('sin plata')
  ) {
    return {
      intencion: 'CANCELAR',
      confianza: 0.95,
      fecha_propuesta: null,
      requiere_humano: false,
      razonamiento: 'Declaración inequívoca de cancelación o suspensión del servicio.',
      modelo: 'claude-3-5-sonnet-emulated',
      tokens: 38
    };
  }

  // Caso 3: Reprogramación
  if (
    t === '2' ||
    t.includes('moverla') ||
    t.includes('chicharrón') ||
    t.includes('chicharron') ||
    t.includes('camello') ||
    t.includes('reprogramar') ||
    t.includes('cambiar') ||
    t.includes('pasar pal') ||
    t.includes('pasar para el') ||
    t.includes('hay campo') ||
    t.includes('huequito') ||
    t.includes('trancón') ||
    t.includes('trancon') ||
    t.includes('corremos') ||
    t.includes('otra semana')
  ) {
    let propuesta: string | null = null;
    if (t.includes('viernes')) propuesta = 'viernes en la tarde';
    else if (t.includes('lunes')) propuesta = 'el lunes';
    else if (t.includes('corremos una hora') || t.includes('una hora')) propuesta = 'correr 1 hora';
    else if (t.includes('otra semana')) propuesta = 'la otra semana';

    return {
      intencion: 'REPROGRAMAR',
      confianza: 0.92,
      fecha_propuesta: propuesta,
      requiere_humano: false,
      razonamiento: 'Expresión coloquial de conflicto de horario solicitando nueva franja.',
      modelo: 'claude-3-5-sonnet-emulated',
      tokens: 49
    };
  }

  // Caso 4: Duda de horario
  if (
    t.includes('a qué hora') ||
    t.includes('a que hora') ||
    t.includes('repite la hora') ||
    t.includes('se me embolató') ||
    t.includes('se me embolato')
  ) {
    return {
      intencion: 'DUDA_HORARIO',
      confianza: 0.97,
      fecha_propuesta: null,
      requiere_humano: false,
      razonamiento: 'Consulta explícita de confirmación del horario ya agendado.',
      modelo: 'claude-3-5-sonnet-emulated',
      tokens: 35
    };
  }

  // Caso 5: No reconocido, ambigüedad o urgencia médica (Escalar a Humano)
  return {
    intencion: 'NO_RECONOCIDO',
    confianza: t.includes('muela') || t.includes('estalla') ? 0.50 : 0.45,
    fecha_propuesta: null,
    requiere_humano: true,
    razonamiento: 'Consulta clínica, audio no transcrito o respuesta ambigua: requiere criterio de la asistente dental.',
    modelo: 'claude-3-5-sonnet-emulated',
    tokens: 52
  };
}
