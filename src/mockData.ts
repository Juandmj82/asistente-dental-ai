import type { Cita, Paciente, PlanTratamiento, PacienteEspera } from './types';

export const PACIENTES_INICIALES: Paciente[] = [
  {
    id: 'pac-1',
    nombreCompleto: 'Andrés Camilo Ospina',
    telefonoE164: '+573105551234',
    consentimientoDatos: true,
    fechaConsentimiento: '2026-10-15T09:00:00Z'
  },
  {
    id: 'pac-2',
    nombreCompleto: 'Mariana Duque Gómez',
    telefonoE164: '+573158884321',
    consentimientoDatos: true,
    fechaConsentimiento: '2026-09-20T11:30:00Z'
  },
  {
    id: 'pac-3',
    nombreCompleto: 'Sebastián Barrientos',
    telefonoE164: '+573204449876',
    consentimientoDatos: true,
    fechaConsentimiento: '2026-10-02T15:45:00Z'
  },
  {
    id: 'pac-4',
    nombreCompleto: 'Laura Sofía Castro',
    telefonoE164: '+573007776543',
    consentimientoDatos: true,
    fechaConsentimiento: '2026-08-11T14:15:00Z'
  },
  {
    id: 'pac-5',
    nombreCompleto: 'Carlos Alberto Restrepo',
    telefonoE164: '+573123332111',
    consentimientoDatos: true,
    fechaConsentimiento: '2026-10-25T10:00:00Z'
  }
];

export const PLANES_INICIALES: PlanTratamiento[] = [
  {
    id: 'plan-1',
    pacienteId: 'pac-1',
    pacienteNombre: 'Andrés Camilo Ospina',
    tipo: 'ORTODONCIA',
    totalSesionesEstimadas: 18,
    sesionesCompletadas: 5,
    estado: 'ACTIVO',
    diasMaximosEntreCitas: 30,
    ultimaCitaFecha: '2026-10-05'
  },
  {
    id: 'plan-2',
    pacienteId: 'pac-2',
    pacienteNombre: 'Mariana Duque Gómez',
    tipo: 'ENDODONCIA',
    totalSesionesEstimadas: 3,
    sesionesCompletadas: 1,
    estado: 'EN_RIESGO_ABANDONO', // Lleva 35 días sin agendar la 2da sesión
    diasMaximosEntreCitas: 21,
    ultimaCitaFecha: '2026-09-22'
  },
  {
    id: 'plan-3',
    pacienteId: 'pac-4',
    pacienteNombre: 'Laura Sofía Castro',
    tipo: 'ORTODONCIA',
    totalSesionesEstimadas: 24,
    sesionesCompletadas: 8,
    estado: 'EN_RIESGO_ABANDONO', // No tiene próxima cita
    diasMaximosEntreCitas: 28,
    ultimaCitaFecha: '2026-09-15'
  }
];

export const CITAS_INICIALES: Cita[] = [
  {
    id: 'cita-1',
    googleEventId: 'gcal_evt_101',
    pacienteId: 'pac-1',
    pacienteNombre: 'Andrés Camilo Ospina',
    pacienteTelefono: '+573105551234',
    planTratamientoId: 'plan-1',
    tipoTratamiento: 'ORTODONCIA',
    fechaHora: '2026-11-03T09:00:00-05:00',
    duracionMinutos: 45,
    estado: 'RECORDATORIO_24H_ENVIADO',
    notasAsistente: 'Cambio de arcos y ligaduras'
  },
  {
    id: 'cita-2',
    googleEventId: 'gcal_evt_102',
    pacienteId: 'pac-3',
    pacienteNombre: 'Sebastián Barrientos',
    pacienteTelefono: '+573204449876',
    tipoTratamiento: 'LIMPIEZA',
    fechaHora: '2026-11-03T10:30:00-05:00',
    duracionMinutos: 45,
    estado: 'CONFIRMADA',
    notasAsistente: 'Profilaxis anual'
  },
  {
    id: 'cita-3',
    googleEventId: 'gcal_evt_103',
    pacienteId: 'pac-5',
    pacienteNombre: 'Carlos Alberto Restrepo',
    pacienteTelefono: '+573123332111',
    tipoTratamiento: 'VALORACION_INICIAL',
    fechaHora: '2026-11-03T14:30:00-05:00',
    duracionMinutos: 60,
    estado: 'PROGRAMADA',
    notasAsistente: 'Primera vez - referido por familiar'
  }
];

export const ESPERA_INICIALES: PacienteEspera[] = [
  {
    id: 'esp-1',
    pacienteId: 'pac-6',
    pacienteNombre: 'Felipe Morales',
    pacienteTelefono: '+573149997788',
    tipoTratamiento: 'ORTODONCIA',
    disponibilidadFranja: 'Mañana (09:00 - 12:00)',
    creadoEn: '2026-10-31T08:15:00Z',
    estado: 'PENDIENTE'
  },
  {
    id: 'esp-2',
    pacienteId: 'pac-7',
    pacienteNombre: 'Camila Montoya',
    pacienteTelefono: '+573182223344',
    tipoTratamiento: 'VALORACION_INICIAL',
    disponibilidadFranja: 'Tarde después de 2:00 PM',
    creadoEn: '2026-11-01T14:20:00Z',
    estado: 'PENDIENTE'
  }
];
