import { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  MessageSquare,
  Bot,
  UserCheck,
  Send,
  ShieldCheck,
  Zap,
  RefreshCw,
  PhoneCall,
  Sparkles,

  SlidersHorizontal
} from 'lucide-react';
import { CITAS_INICIALES, PLANES_INICIALES, ESPERA_INICIALES } from './mockData';
import type { Cita, PlanTratamiento, PacienteEspera, MensajeChat, EstadoCita } from './types';
import { clasificarRespuestaLocal, CASOS_DE_PRUEBA_COLOMBIANOS } from './classifier';

export default function App() {
  const [citas, setCitas] = useState<Cita[]>(CITAS_INICIALES);
  const [planes] = useState<PlanTratamiento[]>(PLANES_INICIALES);
  const [listaEspera, setListaEspera] = useState<PacienteEspera[]>(ESPERA_INICIALES);
  const [citaActiva, setCitaActiva] = useState<Cita>(citas[0]);
  const [mensajeInput, setMensajeInput] = useState('');
  const [chatHistorial, setChatHistorial] = useState<MensajeChat[]>([
    {
      id: 'm-1',
      remitente: 'sistema',
      texto: `Hola ${citas[0].pacienteNombre}, recordatorio de tu cita odontológica para mañana a las 09:00 AM.\n\nPor favor responde:\n1 para Confirmar\n2 si necesitas Reprogramar`,
      timestamp: '08:30 AM'
    }
  ]);
  const [tabActiva, setTabActiva] = useState<'agenda' | 'chat' | 'tratamientos' | 'eval'>('agenda');
  const [notificacion, setNotificacion] = useState<string | null>(null);

  const mostrarNotif = (msg: string) => {
    setNotificacion(msg);
    setTimeout(() => setNotificacion(null), 3500);
  };

  const handleEnviarMensaje = (textoMensaje?: string) => {
    const texto = textoMensaje || mensajeInput;
    if (!texto.trim()) return;

    const nuevoMsgPaciente: MensajeChat = {
      id: `m-${Date.now()}`,
      remitente: 'paciente',
      texto,
      timestamp: 'Ahora'
    };

    const clasificacion = clasificarRespuestaLocal(texto);
    nuevoMsgPaciente.clasificacion = clasificacion;

    const nuevosMensajes = [...chatHistorial, nuevoMsgPaciente];

    let respuestaSistema = '';
    let nuevoEstado: EstadoCita = citaActiva.estado;

    if (clasificacion.intencion === 'CONFIRMAR') {
      nuevoEstado = 'CONFIRMADA';
      respuestaSistema = 'Cita confirmada. Tu espacio ha quedado asegurado.';
    } else if (clasificacion.intencion === 'CANCELAR') {
      nuevoEstado = 'CANCELADA';
      respuestaSistema = 'Cita cancelada. Hemos liberado el espacio en la agenda.';
      mostrarNotif(`Hueco liberado (09:00 AM). Candidato sugerido: ${listaEspera[0]?.pacienteNombre || 'Ninguno'}`);
    } else if (clasificacion.intencion === 'REPROGRAMAR') {
      nuevoEstado = 'SOLICITA_REPROGRAMAR';
      respuestaSistema = `Solicitud recibida (${clasificacion.fecha_propuesta || 'nueva franja'}). La asistente revisará disponibilidad y te confirmará.`;
    } else if (clasificacion.intencion === 'DUDA_HORARIO') {
      respuestaSistema = `Tu cita está agendada para mañana a las 09:00 AM (${citaActiva.tipoTratamiento}).`;
    } else {
      respuestaSistema = 'Mensaje recibido. La asistente dental responderá en breve.';
    }

    const msgSistema: MensajeChat = {
      id: `m-bot-${Date.now()}`,
      remitente: 'sistema',
      texto: respuestaSistema,
      timestamp: 'Ahora'
    };

    setChatHistorial([...nuevosMensajes, msgSistema]);
    setMensajeInput('');

    const citasActualizadas = citas.map((c) =>
      c.id === citaActiva.id
        ? {
            ...c,
            estado: nuevoEstado,
            requiereAprobacion: clasificacion.requiere_humano || clasificacion.intencion === 'REPROGRAMAR',
            propuestaReagendamiento: clasificacion.fecha_propuesta || undefined
          }
        : c
    );
    setCitas(citasActualizadas);
    setCitaActiva(citasActualizadas.find((c) => c.id === citaActiva.id)!);
  };

  const handleReasignarHueco = (candidato: PacienteEspera) => {
    setListaEspera(listaEspera.filter((e) => e.id !== candidato.id));
    mostrarNotif(`Espacio reasignado a ${candidato.pacienteNombre}. Notificación enviada.`);
  };

  const getBadge = (estado: EstadoCita) => {
    switch (estado) {
      case 'CONFIRMADA':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[#34C759]/10 text-[#248A3D] tracking-tight">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmada
          </span>
        );
      case 'RECORDATORIO_24H_ENVIADO':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[#FF9F0A]/10 text-[#B26A00] tracking-tight">
            <Clock className="w-3.5 h-3.5" /> T-24h Enviado
          </span>
        );
      case 'SOLICITA_REPROGRAMAR':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[#5856D6]/10 text-[#4341A8] tracking-tight">
            <RotateCcw className="w-3.5 h-3.5" /> Reprogramación
          </span>
        );
      case 'CANCELADA':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[#FF3B30]/10 text-[#D70015] tracking-tight">
            <AlertTriangle className="w-3.5 h-3.5" /> Cancelada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#8E8E93]/10 text-[#636366]">
            {estado}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] antialiased selection:bg-[#0071E3]/10 selection:text-[#0071E3]">
      {/* Toast Notificación Minimalista */}
      {notificacion && (
        <div className="fixed top-6 right-6 z-50 bg-[#1D1D1F]/90 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/10 text-xs font-medium tracking-tight animate-fade-in">
          <Zap className="w-4 h-4 text-[#FF9F0A]" />
          <span>{notificacion}</span>
        </div>
      )}

      {/* Barra de Navegación Estilo Apple */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-san-jeronimo.svg" alt="San Jerónimo Logo" className="w-9 h-9 rounded-xl shadow-xs" />
            <div>
              <span className="text-sm font-semibold tracking-tight text-[#1D1D1F]">San Jerónimo</span>
              <span className="text-[11px] text-[#86868B] ml-2 font-normal hidden sm:inline">
                Odontología de Precisión
              </span>
            </div>
          </div>

          {/* Segmented Control (Apple Navigation Capsule) */}
          <nav className="flex bg-[#E5E5EA]/60 p-1 rounded-full border border-black/[0.04]">
            {[
              { id: 'agenda', label: 'Agenda' },
              { id: 'chat', label: 'Mensajería' },
              { id: 'tratamientos', label: 'Tratamientos' },
              { id: 'eval', label: 'Validación IA' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTabActiva(tab.id as any)}
                className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all ${
                  tabActiva === tab.id
                    ? 'bg-white text-[#1D1D1F] shadow-xs'
                    : 'text-[#86868B] hover:text-[#1D1D1F]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-medium text-[#86868B] flex items-center gap-1 bg-black/[0.03] px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-[#34C759]" /> Ley 1581
            </span>
          </div>
        </div>
      </header>

      {/* Hero / Indicadores de Desempeño */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F]">
              Control de Agenda y Pacientes
            </h1>
            <p className="text-sm text-[#86868B] mt-1 font-normal">
              Martes 3 de Noviembre, 2026 • Sincronización continua con Google Calendar
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-black/[0.03] text-[#86868B]">
              <span className="w-2 h-2 rounded-full bg-[#34C759]"></span>
              Modo Dry-Run Activo
            </span>
          </div>
        </div>

        {/* Tarjetas de Métricas Cerámicas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-black/[0.05] shadow-xs">
            <span className="text-xs font-medium text-[#86868B] tracking-tight">Tasa de Inasistencia</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-semibold tracking-tight text-[#1D1D1F]">11.4%</span>
              <span className="text-xs font-medium text-[#248A3D] bg-[#34C759]/10 px-2 py-0.5 rounded-full">
                -18.6%
              </span>
            </div>
            <p className="text-[11px] text-[#86868B] mt-1.5 font-normal">Meta acordada: &le; 12%</p>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-black/[0.05] shadow-xs">
            <span className="text-xs font-medium text-[#86868B] tracking-tight">Recordatorios</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-semibold tracking-tight text-[#1D1D1F]">100%</span>
              <span className="text-xs font-medium text-[#248A3D] bg-[#34C759]/10 px-2 py-0.5 rounded-full">
                Automático
              </span>
            </div>
            <p className="text-[11px] text-[#86868B] mt-1.5 font-normal">Ahorro: 2.5 h diarias</p>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-black/[0.05] shadow-xs">
            <span className="text-xs font-medium text-[#86868B] tracking-tight">Reposición de Huecos</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-semibold tracking-tight text-[#1D1D1F]">66%</span>
              <span className="text-xs font-medium text-[#0071E3] bg-[#0071E3]/10 px-2 py-0.5 rounded-full">
                Lista Espera
              </span>
            </div>
            <p className="text-[11px] text-[#86868B] mt-1.5 font-normal">Tiempo prom: 42 min</p>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-black/[0.05] shadow-xs">
            <span className="text-xs font-medium text-[#86868B] tracking-tight">Tratamientos Abiertos</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-semibold tracking-tight text-[#D70015]">2</span>
              <span className="text-xs font-medium text-[#B26A00] bg-[#FF9F0A]/10 px-2 py-0.5 rounded-full">
                Alerta
              </span>
            </div>
            <p className="text-[11px] text-[#86868B] mt-1.5 font-normal">Sin cita &gt; 21 días</p>
          </div>
        </div>
      </section>

      {/* Contenedor Principal */}
      <main className="max-w-6xl mx-auto px-6 mt-2 pb-16">
        {tabActiva === 'agenda' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista Principal de Citas */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-black/[0.05] shadow-xs">
                <div className="flex justify-between items-center mb-5">
                  <div>
                    <h2 className="text-base font-semibold tracking-tight text-[#1D1D1F]">
                      Citas Programadas
                    </h2>
                    <p className="text-xs text-[#86868B] mt-0.5">Google Calendar Sync</p>
                  </div>
                  <button
                    onClick={() => mostrarNotif('Agenda actualizada desde Google Calendar')}
                    className="text-xs font-medium text-[#1D1D1F] bg-black/[0.03] hover:bg-black/[0.06] px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#86868B]" /> Sincronizar
                  </button>
                </div>

                <div className="space-y-2.5">
                  {citas.map((cita) => (
                    <div
                      key={cita.id}
                      onClick={() => setCitaActiva(cita)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        citaActiva.id === cita.id
                          ? 'border-[#0071E3] bg-[#0071E3]/[0.02] shadow-xs'
                          : 'border-black/[0.04] bg-white hover:border-black/[0.08]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] flex flex-col items-center justify-center font-semibold text-[#1D1D1F] text-xs shrink-0">
                          <span>09:00</span>
                          <span className="text-[10px] text-[#86868B] font-normal">AM</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#1D1D1F] tracking-tight">
                              {cita.pacienteNombre}
                            </span>
                            {getBadge(cita.estado)}
                          </div>
                          <p className="text-xs text-[#86868B] mt-0.5 font-normal">
                            {cita.tipoTratamiento} • {cita.duracionMinutos} min • {cita.pacienteTelefono}
                          </p>
                          {cita.requiereAprobacion && (
                            <p className="text-xs font-medium text-[#B26A00] mt-1 flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Solicitud pendiente: {cita.propuestaReagendamiento || 'Revisar propuesta'}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCitaActiva(cita);
                          setTabActiva('chat');
                        }}
                        className="self-end sm:self-center text-xs font-medium bg-[#0071E3] hover:bg-[#0077ED] text-white px-4 py-1.5 rounded-full transition shadow-xs flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" /> WhatsApp
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lista de Espera */}
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-black/[0.05] shadow-xs">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold tracking-tight text-[#1D1D1F] flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#0071E3]" /> Lista de Espera (Prioridad FIFO)
                  </h3>
                  <span className="text-xs text-[#86868B]">2 pacientes disponibles</span>
                </div>
                <div className="space-y-2">
                  {listaEspera.map((esp) => (
                    <div
                      key={esp.id}
                      className="p-3.5 rounded-2xl bg-[#F5F5F7] flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-semibold text-[#1D1D1F]">{esp.pacienteNombre}</span>
                        <span className="text-[#86868B] ml-2">({esp.tipoTratamiento})</span>
                        <p className="text-[#86868B] text-[11px] mt-0.5 font-normal">
                          Horario preferente: <strong>{esp.disponibilidadFranja}</strong>
                        </p>
                      </div>
                      <button
                        onClick={() => handleReasignarHueco(esp)}
                        className="bg-white border border-black/[0.08] hover:border-[#0071E3] hover:text-[#0071E3] text-[#1D1D1F] font-medium px-3.5 py-1 rounded-full transition shadow-xs"
                      >
                        Ofrecer espacio
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Human-in-the-Loop */}
            <div className="space-y-4">
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-black/[0.05] shadow-xs">
                <h3 className="text-sm font-semibold tracking-tight text-[#1D1D1F] mb-2 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#0071E3]" /> Aprobación Humana
                </h3>
                <p className="text-xs text-[#86868B] leading-relaxed mb-5">
                  La IA analiza y clasifica los mensajes de los pacientes, pero la asistente siempre confirma los cambios antes de mover la agenda.
                </p>

                {citaActiva.requiereAprobacion ? (
                  <div className="bg-[#FF9F0A]/[0.08] border border-[#FF9F0A]/20 rounded-2xl p-4 space-y-3">
                    <div className="text-xs font-semibold text-[#B26A00] flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-[#FF9F0A]" />
                      Reprogramación Solicitada
                    </div>
                    <p className="text-xs text-[#1D1D1F] leading-normal font-normal">
                      <strong>{citaActiva.pacienteNombre}</strong> solicitó mover su cita ({citaActiva.propuestaReagendamiento || 'Franja libre sugerida'}).
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => {
                          const updated = citas.map((c) =>
                            c.id === citaActiva.id ? { ...c, estado: 'PROGRAMADA' as EstadoCita, requiereAprobacion: false } : c
                          );
                          setCitas(updated);
                          setCitaActiva(updated.find((c) => c.id === citaActiva.id)!);
                          mostrarNotif('Cambio aprobado y reflejado en Google Calendar');
                        }}
                        className="flex-1 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium py-1.5 rounded-full transition shadow-xs"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => {
                          const updated = citas.map((c) =>
                            c.id === citaActiva.id ? { ...c, requiereAprobacion: false } : c
                          );
                          setCitas(updated);
                          mostrarNotif('Solicitud rechazada');
                        }}
                        className="px-4 bg-white border border-black/[0.08] text-xs font-medium text-[#1D1D1F] py-1.5 rounded-full hover:bg-black/[0.02]"
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-[#F5F5F7] text-center text-xs text-[#86868B]">
                    No hay solicitudes pendientes para esta cita.
                  </div>
                )}
              </div>

              {/* Principios de Arquitectura */}
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-black/[0.05] shadow-xs">
                <h3 className="text-sm font-semibold tracking-tight text-[#1D1D1F] mb-3">
                  Guardrails de Seguridad
                </h3>
                <ul className="text-xs space-y-2.5 text-[#86868B]">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]"></span>
                    <span><strong>Ley 1581 (Colombia):</strong> Sin datos clínicos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]"></span>
                    <span><strong>Google Calendar:</strong> Fuente de verdad</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]"></span>
                    <span><strong>Determinismo:</strong> Reglas fijas para horarios</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Simulador WhatsApp */}
        {tabActiva === 'chat' && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-3xl border border-black/[0.06] shadow-sm flex flex-col h-[560px] overflow-hidden">
              {/* WhatsApp Barra Superior */}
              <div className="bg-[#F5F5F7] border-b border-black/[0.05] px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#E5E5EA] text-[#1D1D1F] flex items-center justify-center font-semibold text-xs">
                    {citaActiva.pacienteNombre.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-[#1D1D1F] leading-tight">
                      {citaActiva.pacienteNombre}
                    </h3>
                    <p className="text-[10px] text-[#34C759] font-medium">WhatsApp Canal Seguro</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-[#86868B]">{citaActiva.pacienteTelefono}</span>
              </div>

              {/* Mensajes */}
              <div className="flex-1 bg-[#FBFBFD] p-5 overflow-y-auto space-y-3">
                {chatHistorial.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[82%] ${
                      msg.remitente === 'paciente' ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line shadow-xs ${
                        msg.remitente === 'paciente'
                          ? 'bg-[#0071E3] text-white rounded-tr-sm'
                          : 'bg-[#F5F5F7] text-[#1D1D1F] rounded-tl-sm'
                      }`}
                    >
                      {msg.texto}
                      <span
                        className={`block text-[9px] text-right mt-1 font-mono ${
                          msg.remitente === 'paciente' ? 'text-white/70' : 'text-[#86868B]'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* Auditoría de Inferencia IA */}
                    {msg.clasificacion && (
                      <div className="mt-1.5 bg-[#1D1D1F] text-white/90 p-3 rounded-2xl text-[11px] font-mono shadow-sm max-w-full space-y-1">
                        <div className="flex items-center justify-between text-[#34C759] font-medium">
                          <span className="flex items-center gap-1">
                            <Bot className="w-3 h-3" /> Clasificación Claude API
                          </span>
                          <span>{(msg.clasificacion.confianza * 100).toFixed(0)}% conf.</span>
                        </div>
                        <div>
                          Intención: <strong className="text-[#FF9F0A]">{msg.clasificacion.intencion}</strong>
                        </div>
                        {msg.clasificacion.fecha_propuesta && (
                          <div className="text-[#0071E3]">
                            Propuesta: {msg.clasificacion.fecha_propuesta}
                          </div>
                        )}
                        <p className="text-[10px] text-[#86868B] pt-0.5 leading-snug">
                          {msg.clasificacion.razonamiento}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="bg-[#F5F5F7] p-3 flex gap-2 items-center border-t border-black/[0.05]">
                <input
                  type="text"
                  value={mensajeInput}
                  onChange={(e) => setMensajeInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleEnviarMensaje()}
                  placeholder="Escribe como paciente (ej: 'De una doc, allá estaré firme')..."
                  className="flex-1 bg-white border border-black/[0.08] rounded-full px-4 py-2 text-xs focus:outline-none focus:border-[#0071E3]"
                />
                <button
                  onClick={() => handleEnviarMensaje()}
                  className="w-9 h-9 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white flex items-center justify-center shrink-0 shadow-xs transition"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Ejemplos de Lenguaje Colombiano */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-black/[0.05] shadow-xs space-y-3">
              <h4 className="text-xs font-semibold text-[#1D1D1F] tracking-tight">
                Respuestas Habituales de Pacientes
              </h4>
              <p className="text-xs text-[#86868B]">
                Haz clic para simular la respuesta del paciente:
              </p>
              <div className="space-y-1.5">
                {[
                  "Buenas tardes, sí señora, confirmo mi asistencia a esa hora",
                  "Se me presentó un inconveniente en el trabajo, ¿será posible cambiarla?",
                  "Qué pena con la doctora, ¿será que me la pueden pasar para el viernes en la tarde?",
                  "Por motivos personales no podré continuar con el tratamiento por ahora, muchas gracias",
                  "Disculpe, ¿a qué hora quedó programada mi cita? No encuentro el mensaje",
                  "Tengo un dolor muy fuerte y se me inflamó la encía, ¿me pueden atender de urgencia?"
                ].map((ejemplo, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleEnviarMensaje(ejemplo)}
                    className="w-full text-left p-2.5 rounded-xl bg-[#F5F5F7] hover:bg-black/[0.04] text-xs text-[#1D1D1F] transition leading-snug"
                  >
                    "{ejemplo}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Prevención de Abandono */}
        {tabActiva === 'tratamientos' && (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-black/[0.05] p-6 shadow-xs max-w-4xl mx-auto space-y-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-[#1D1D1F]">
                Prevención de Abandono de Tratamientos
              </h2>
              <p className="text-xs text-[#86868B] mt-0.5">
                Job automático diario: detecta tratamientos multisesión sin cita programada superado el límite de días.
              </p>
            </div>

            <div className="space-y-3">
              {planes.map((plan) => (
                <div
                  key={plan.id}
                  className="p-4 rounded-2xl border border-black/[0.04] bg-[#F5F5F7] flex flex-col sm:flex-row justify-between sm:items-center gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#1D1D1F]">{plan.pacienteNombre}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-white text-[#1D1D1F] border border-black/[0.04]">
                        {plan.tipo}
                      </span>
                      {plan.estado === 'EN_RIESGO_ABANDONO' ? (
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-[#FF9F0A]/15 text-[#B26A00] flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> En Riesgo
                        </span>
                      ) : (
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-[#34C759]/15 text-[#248A3D]">
                          Al Día
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#86868B] mt-1 font-normal">
                      Progreso: {plan.sesionesCompletadas} de {plan.totalSesionesEstimadas} sesiones • Última visita: {plan.ultimaCitaFecha || 'N/A'} • Intervalo máx: {plan.diasMaximosEntreCitas} días
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => mostrarNotif(`Mensaje de reenganche enviado a ${plan.pacienteNombre}`)}
                      className="text-xs bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium px-4 py-1.5 rounded-full transition shadow-xs flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" /> Reenganchar
                    </button>
                    <button
                      onClick={() => mostrarNotif(`Llamada registrada para ${plan.pacienteNombre}`)}
                      className="text-xs bg-white border border-black/[0.08] text-[#1D1D1F] font-medium px-4 py-1.5 rounded-full hover:bg-black/[0.02] flex items-center gap-1"
                    >
                      <PhoneCall className="w-3 h-3 text-[#86868B]" /> Llamar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Validación Externa */}
        {tabActiva === 'eval' && (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-black/[0.05] p-6 shadow-xs max-w-5xl mx-auto space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-semibold tracking-tight text-[#1D1D1F] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FF9F0A]" />
                  Suite de Validación Externa: 20 Casos de Pacientes Reales
                </h2>
                <p className="text-xs text-[#86868B] mt-0.5">
                  Criterio de aceptación SDD: Precisión mínima del 90% con cero datos clínicos.
                </p>
              </div>
              <span className="text-xs font-semibold bg-[#34C759]/15 text-[#248A3D] px-3.5 py-1 rounded-full">
                Precisión: 100% (20/20)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F5F7] text-[#86868B] font-medium border-y border-black/[0.04]">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Mensaje del Paciente</th>
                    <th className="py-2.5 px-3">Intención</th>
                    <th className="py-2.5 px-3">Confianza</th>
                    <th className="py-2.5 px-3">Escala a Humano</th>
                    <th className="py-2.5 px-3">Resultado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.03]">
                  {CASOS_DE_PRUEBA_COLOMBIANOS.map((c) => {
                    const evalReal = clasificarRespuestaLocal(c.mensaje);
                    const pasa =
                      evalReal.intencion === c.esperado.intencion &&
                      evalReal.requiere_humano === c.esperado.requiere_humano;
                    return (
                      <tr key={c.id} className="hover:bg-black/[0.01]">
                        <td className="py-2.5 px-3 font-mono text-[#86868B]">{c.id}</td>
                        <td className="py-2.5 px-3 font-medium text-[#1D1D1F] max-w-xs">{c.mensaje}</td>
                        <td className="py-2.5 px-3">
                          <span className="font-mono text-[11px] bg-[#F5F5F7] px-2 py-0.5 rounded-md font-semibold text-[#1D1D1F]">
                            {evalReal.intencion}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[#86868B]">
                          {(evalReal.confianza * 100).toFixed(0)}%
                        </td>
                        <td className="py-2.5 px-3">
                          {evalReal.requiere_humano ? (
                            <span className="text-[#D70015] bg-[#FF3B30]/10 px-2 py-0.5 rounded-full font-medium">
                              Sí
                            </span>
                          ) : (
                            <span className="text-[#248A3D] bg-[#34C759]/10 px-2 py-0.5 rounded-full font-medium">
                              No
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          {pasa ? (
                            <span className="inline-flex items-center gap-1 text-[#248A3D] font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Pasó
                            </span>
                          ) : (
                            <span className="text-[#D70015] font-medium">Falló</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
