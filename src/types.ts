export type TipoTratamiento =
  | 'VALORACION_INICIAL'
  | 'CONTROL_GENERAL'
  | 'LIMPIEZA'
  | 'ORTODONCIA'
  | 'ENDODONCIA'
  | 'OTRO';

export type EstadoPlan =
  | 'ACTIVO'
  | 'FINALIZADO'
  | 'EN_RIESGO_ABANDONO'
  | 'ABANDONADO';

export type EstadoCita =
  | 'PROGRAMADA'
  | 'RECORDATORIO_48H_ENVIADO'
  | 'RECORDATORIO_24H_ENVIADO'
  | 'CONFIRMADA'
  | 'SOLICITA_REPROGRAMAR'
  | 'CANCELADA'
  | 'ASISTIO'
  | 'NO_ASISTIO';

export interface Paciente {
  id: string;
  nombreCompleto: string;
  telefonoE164: string;
  consentimientoDatos: boolean;
  fechaConsentimiento: string;
}

export interface PlanTratamiento {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  tipo: TipoTratamiento;
  totalSesionesEstimadas: number;
  sesionesCompletadas: number;
  estado: EstadoPlan;
  diasMaximosEntreCitas: number;
  ultimaCitaFecha?: string;
}

export interface Cita {
  id: string;
  googleEventId: string;
  pacienteId: string;
  pacienteNombre: string;
  pacienteTelefono: string;
  planTratamientoId?: string;
  tipoTratamiento: TipoTratamiento;
  fechaHora: string; // ISO string
  duracionMinutos: number;
  estado: EstadoCita;
  notasAsistente?: string;
  requiereAprobacion?: boolean;
  propuestaReagendamiento?: string;
}

export interface PacienteEspera {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  pacienteTelefono: string;
  tipoTratamiento: TipoTratamiento;
  disponibilidadFranja: string;
  creadoEn: string;
  estado: 'PENDIENTE' | 'NOTIFICADO' | 'REASIGNADO';
}

export interface ClasificacionIA {
  intencion: 'CONFIRMAR' | 'REPROGRAMAR' | 'CANCELAR' | 'DUDA_HORARIO' | 'NO_RECONOCIDO';
  confianza: number;
  fecha_propuesta: string | null;
  requiere_humano: boolean;
  razonamiento?: string;
  modelo?: string;
  tokens?: number;
}

export interface MensajeChat {
  id: string;
  remitente: 'paciente' | 'sistema' | 'asistente';
  texto: string;
  timestamp: string;
  clasificacion?: ClasificacionIA;
}
