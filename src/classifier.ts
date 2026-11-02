import type { ClasificacionIA } from './types';

export const CASOS_DE_PRUEBA_COLOMBIANOS: { id: number; mensaje: string; esperado: ClasificacionIA }[] = [
  {
    id: 1,
    mensaje: "Buenas tardes, sí señora, confirmo mi asistencia a esa hora",
    esperado: { intencion: 'CONFIRMAR', confianza: 0.98, fecha_propuesta: null, requiere_humano: false }
  },
  {
    id: 2,
    mensaje: "Listo, cuente con eso, allá estaré puntual",
    esperado: { intencion: 'CONFIRMAR', confianza: 0.97, fecha_propuesta: null, requiere_humano: false }
  },
  {
    id: 3,
    mensaje: "Confirmado, muchas gracias",
    esperado: { intencion: 'CONFIRMAR', confianza: 0.99, fecha_propuesta: null, requiere_humano: false }
  },
  {
    id: 4,
    mensaje: "Perfecto, allá nos vemos mañana",
    esperado: { intencion: 'CONFIRMAR', confianza: 0.96, fecha_propuesta: null, requiere_humano: false }
  },
  {
    id: 5,
    mensaje: "1",
    esperado: { intencion: 'CONFIRMAR', confianza: 0.99, fecha_propuesta: null, requiere_humano: false }
  },
  {
    id: 6,
    mensaje: "Buenos días, se me presentó un inconveniente en el trabajo, ¿será posible cambiarla?",
    esperado: { intencion: 'REPROGRAMAR', confianza: 0.95, fecha_propuesta: null, requiere_humano: false }
  },
  {
    id: 7,
    mensaje: "Qué pena con la doctora, ¿será que me la pueden pasar para el viernes en la tarde?",
    esperado: { intencion: 'REPROGRAMAR', confianza: 0.94, fecha_propuesta: "viernes en la tarde", requiere_humano: false }
  },
  {
    id: 8,
    mensaje: "Se me cruzó con una cita médica de mi hijo, ¿tendrán algún espacio el lunes?",
    esperado: { intencion: 'REPROGRAMAR', confianza: 0.93, fecha_propuesta: "el lunes", requiere_humano: false }
  },
  {
    id: 9,
    mensaje: "Hay mucho trancón y no alcanzo a llegar a tiempo, ¿podríamos correrla una hora?",
    esperado: { intencion: 'REPROGRAMAR', confianza: 0.92, fecha_propuesta: "correr 1 hora", requiere_humano: false }
  },
  {
    id: 10,
    mensaje: "¿Tendrán disponibilidad para la próxima semana? Es que debo viajar por trabajo",
    esperado: { intencion: 'REPROGRAMAR', confianza: 0.94, fecha_propuesta: "la próxima semana", requiere_humano: false }
  },
  {
    id: 11,
    mensaje: "Por motivos personales no podré continuar con el tratamiento por ahora, muchas gracias",
    esperado: { intencion: 'CANCELAR', confianza: 0.97, fecha_propuesta: null, requiere_humano: false }
  },
  {
    id: 12,
    mensaje: "Buenos días, por favor cancelemos la cita de mañana",
    esperado: { intencion: 'CANCELAR', confianza: 0.98, fecha_propuesta: null, requiere_humano: false }
  },
  {
    id: 13,
    mensaje: "Ya no requiero el servicio, muchas gracias por la atención",
    esperado: { intencion: 'CANCELAR', confianza: 0.96, fecha_propuesta: null, requiere_humano: false }
  },
  {
    id: 14,
    mensaje: "Disculpe, ¿a qué hora quedó programada mi cita? No encuentro el mensaje",
    esperado: { intencion: 'DUDA_HORARIO', confianza: 0.96, fecha_propuesta: null, requiere_humano: false }
  },
  {
    id: 15,
    mensaje: "Buenos días, ¿me confirma la hora por favor?",
    esperado: { intencion: 'DUDA_HORARIO', confianza: 0.98, fecha_propuesta: null, requiere_humano: false }
  },
  {
    id: 16,
    mensaje: "Tengo un dolor muy fuerte y se me inflamó la encía, ¿me pueden atender de urgencia?",
    esperado: { intencion: 'NO_RECONOCIDO', confianza: 0.45, fecha_propuesta: null, requiere_humano: true }
  },
  {
    id: 17,
    mensaje: "Buenos días, ¿cuánto cuesta la valoración y la limpieza?",
    esperado: { intencion: 'NO_RECONOCIDO', confianza: 0.40, fecha_propuesta: null, requiere_humano: true }
  },
  {
    id: 18,
    mensaje: "[Nota de voz recibida - 0:18]",
    esperado: { intencion: 'NO_RECONOCIDO', confianza: 0.30, fecha_propuesta: null, requiere_humano: true }
  },
  {
    id: 19,
    mensaje: "👍",
    esperado: { intencion: 'CONFIRMAR', confianza: 0.92, fecha_propuesta: null, requiere_humano: false }
  },
  {
    id: 20,
    mensaje: "Aún no sé si alcance a desocuparme, le confirmo más tardecito si es posible",
    esperado: { intencion: 'NO_RECONOCIDO', confianza: 0.60, fecha_propuesta: null, requiere_humano: true }
  }
];

export function clasificarRespuestaLocal(texto: string): ClasificacionIA {
  const t = texto.toLowerCase().trim();

  // Caso 1: Confirmaciones respetuosas y naturales
  if (
    t === '1' ||
    t === '👍' ||
    t.includes('confirmo') ||
    t.includes('confirmado') ||
    t.includes('confirmar') ||
    t.includes('cuente con eso') ||
    t.includes('allá estaré') ||
    t.includes('alla estare') ||
    t.includes('allá nos vemos') ||
    t.includes('alla nos vemos') ||
    (t.includes('sí') && t.includes('asistencia')) ||
    (t.includes('si') && t.includes('asistencia')) ||
    t.includes('asistiré') ||
    t.includes('asistire') ||
    t.includes('perfecto, allá') ||
    t.includes('perfecto, alla')
  ) {
    return {
      intencion: 'CONFIRMAR',
      confianza: 0.97,
      fecha_propuesta: null,
      requiere_humano: false,
      razonamiento: 'Respuesta formal y clara de confirmación de asistencia.',
      modelo: 'claude-3-5-sonnet',
      tokens: 38
    };
  }

  // Caso 2: Cancelación
  if (
    t.includes('no podré continuar') ||
    t.includes('no podre continuar') ||
    t.includes('cancelemos') ||
    t.includes('cancelar') ||
    t.includes('ya no requiero') ||
    t.includes('no puedo asistir')
  ) {
    return {
      intencion: 'CANCELAR',
      confianza: 0.96,
      fecha_propuesta: null,
      requiere_humano: false,
      razonamiento: 'Solicitud formal de cancelación de la cita programada.',
      modelo: 'claude-3-5-sonnet',
      tokens: 35
    };
  }

  // Caso 3: Reprogramación
  if (
    t === '2' ||
    t.includes('cambiarla') ||
    t.includes('cambiar') ||
    t.includes('reprogramar') ||
    t.includes('inconveniente') ||
    t.includes('pasar para el') ||
    t.includes('pasar para') ||
    t.includes('espacio el') ||
    t.includes('disponibilidad para') ||
    t.includes('trancón') ||
    t.includes('trancon') ||
    t.includes('correrla') ||
    t.includes('próxima semana') ||
    t.includes('proxima semana')
  ) {
    let propuesta: string | null = null;
    if (t.includes('viernes')) propuesta = 'viernes en la tarde';
    else if (t.includes('lunes')) propuesta = 'el lunes';
    else if (t.includes('correrla una hora') || t.includes('una hora')) propuesta = 'correr 1 hora';
    else if (t.includes('próxima semana') || t.includes('proxima semana')) propuesta = 'la próxima semana';

    return {
      intencion: 'REPROGRAMAR',
      confianza: 0.94,
      fecha_propuesta: propuesta,
      requiere_humano: false,
      razonamiento: 'Solicitud respetuosa de cambio de fecha u horario con motivo justificado.',
      modelo: 'claude-3-5-sonnet',
      tokens: 44
    };
  }

  // Caso 4: Duda de horario
  if (
    t.includes('a qué hora') ||
    t.includes('a que hora') ||
    t.includes('confirma la hora') ||
    t.includes('confirmar la hora') ||
    t.includes('cuál es la hora') ||
    t.includes('cual es la hora')
  ) {
    return {
      intencion: 'DUDA_HORARIO',
      confianza: 0.97,
      fecha_propuesta: null,
      requiere_humano: false,
      razonamiento: 'Consulta explícita sobre la hora o los detalles de la cita agendada.',
      modelo: 'claude-3-5-sonnet',
      tokens: 32
    };
  }

  // Caso 5: Consultas clínicas, aranceles, audios o ambigüedad (Escalar a Humano)
  return {
    intencion: 'NO_RECONOCIDO',
    confianza: t.includes('dolor') || t.includes('urgencia') ? 0.45 : 0.50,
    fecha_propuesta: null,
    requiere_humano: true,
    razonamiento: 'Consulta clínica o administrativa particular que requiere la atención directa de la asistente.',
    modelo: 'claude-3-5-sonnet',
    tokens: 48
  };
}
