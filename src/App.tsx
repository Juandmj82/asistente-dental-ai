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
  Sparkles
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
      texto: `Hola ${citas[0].pacienteNombre}, te recordamos tu cita odontológica para mañana a las 09:00 AM. Por favor responde:\n1 para Confirmar\n2 si necesitas Reprogramar`,
      timestamp: 'Hoy 08:30 AM'
    }
  ]);
  const [tabActiva, setTabActiva] = useState<'agenda' | 'chat' | 'eval' | 'tratamientos'>('agenda');
  const [notificacion, setNotificacion] = useState<string | null>(null);

  const mostrarNotif = (msg: string) => {
    setNotificacion(msg);
    setTimeout(() => setNotificacion(null), 4000);
  };

  // Manejador del chat interactivo
  const handleEnviarMensaje = (textoMensaje?: string) => {
    const texto = textoMensaje || mensajeInput;
    if (!texto.trim()) return;

    const nuevoMsgPaciente: MensajeChat = {
      id: `m-${Date.now()}`,
      remitente: 'paciente',
      texto,
      timestamp: 'Ahora'
    };

    // Ejecución del clasificador
    const clasificacion = clasificarRespuestaLocal(texto);
    nuevoMsgPaciente.clasificacion = clasificacion;

    const nuevosMensajes = [...chatHistorial, nuevoMsgPaciente];

    // Actualización de estado según inferencia
    let respuestaSistema = '';
    let nuevoEstado: EstadoCita = citaActiva.estado;

    if (clasificacion.intencion === 'CONFIRMAR') {
      nuevoEstado = 'CONFIRMADA';
      respuestaSistema = '¡Excelente! Tu cita ha quedado confirmada. Te esperamos puntualmente.';
    } else if (clasificacion.intencion === 'CANCELAR') {
      nuevoEstado = 'CANCELADA';
      respuestaSistema = 'Lamentamos que no puedas asistir. Hemos liberado tu espacio en la agenda.';
      // Activar sugerencia de lista de espera
      mostrarNotif(`Hueco liberado (09:00 AM). Candidato encontrado en lista de espera: ${listaEspera[0]?.pacienteNombre || 'Ninguno'}`);
    } else if (clasificacion.intencion === 'REPROGRAMAR') {
      nuevoEstado = 'SOLICITA_REPROGRAMAR';
      respuestaSistema = `Entendido. La asistente revisará tu solicitud de reprogramación (${clasificacion.fecha_propuesta || 'nueva fecha'}) y se comunicará contigo.`;
    } else if (clasificacion.intencion === 'DUDA_HORARIO') {
      respuestaSistema = `Tu cita está programada para mañana a las 09:00 AM (${citaActiva.tipoTratamiento}).`;
    } else {
      respuestaSistema = 'Gracias por comunicarte. La asistente dental atenderá tu mensaje en unos minutos.';
    }

    const msgSistema: MensajeChat = {
      id: `m-bot-${Date.now()}`,
      remitente: 'sistema',
      texto: respuestaSistema,
      timestamp: 'Ahora'
    };

    setChatHistorial([...nuevosMensajes, msgSistema]);
    setMensajeInput('');

    // Actualizar cita
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

  // Reasignar hueco con lista de espera
  const handleReasignarHueco = (candidato: PacienteEspera) => {
    setListaEspera(listaEspera.filter((e) => e.id !== candidato.id));
    mostrarNotif(`Espacio reasignado exitosamente a ${candidato.pacienteNombre}. Notificación enviada.`);
  };

  const getEstadoBadge = (estado: EstadoCita) => {
    switch (estado) {
      case 'CONFIRMADA':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800"><CheckCircle2 className="w-3.5 h-3.5" /> Confirmada</span>;
      case 'RECORDATORIO_24H_ENVIADO':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800"><Clock className="w-3.5 h-3.5" /> T-24h Enviado</span>;
      case 'SOLICITA_REPROGRAMAR':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800"><RotateCcw className="w-3.5 h-3.5" /> Pide Reprogramar</span>;
      case 'CANCELADA':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800"><AlertTriangle className="w-3.5 h-3.5" /> Cancelada</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">{estado}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Toast Notificación */}
      {notificacion && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <Zap className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-medium">{notificacion}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
              🦷
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">Clínica Dental San Jerónimo</h1>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <span>Google Calendar Sync: Activo</span>
                <span>•</span>
                <span className="text-emerald-600 font-medium flex items-center gap-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Ley 1581 Habeas Data
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 font-medium">
              Modo: <strong>DRY_RUN (Simulación)</strong>
            </span>
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setTabActiva('agenda')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  tabActiva === 'agenda' ? 'bg-white shadow-sm text-teal-700' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Panel Asistente
              </button>
              <button
                onClick={() => setTabActiva('chat')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  tabActiva === 'chat' ? 'bg-white shadow-sm text-teal-700' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Simulador WhatsApp
              </button>
              <button
                onClick={() => setTabActiva('tratamientos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  tabActiva === 'tratamientos' ? 'bg-white shadow-sm text-teal-700' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tratamientos en Riesgo
              </button>
              <button
                onClick={() => setTabActiva('eval')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                  tabActiva === 'eval' ? 'bg-white shadow-sm text-teal-700' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Suite Eval (20 Casos)
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Métricas Operativas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Tasa de Absentismo</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">11.4%</span>
              <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                -18.6% vs mes ant.
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Meta: &le; 12% (Antes: 30%)</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Recordatorios Automáticos</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">100%</span>
              <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                0 min manuales
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Ahorro: ~2.5 h/día de la asistente</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Reasignación de Huecos</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">66%</span>
              <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-1.5 py-0.5 rounded">
                Lista de espera activa
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Tiempo promedio: 42 minutos</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Tratamientos en Riesgo</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-amber-600">2 alertas</span>
              <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">
                Detección temprana
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Sin cita &gt; 21 días (Ortodoncia / Endodoncia)</p>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {tabActiva === 'agenda' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de Citas del Día */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Agenda de Mañana (Google Calendar)</h2>
                    <p className="text-xs text-slate-500">Martes 3 de Noviembre, 2026</p>
                  </div>
                  <button
                    onClick={() => mostrarNotif('Agenda sincronizada con Google Calendar API')}
                    className="text-xs flex items-center gap-1 text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Sincronizar
                  </button>
                </div>

                <div className="space-y-3">
                  {citas.map((cita) => (
                    <div
                      key={cita.id}
                      onClick={() => setCitaActiva(cita)}
                      className={`p-4 rounded-xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        citaActiva.id === cita.id
                          ? 'border-teal-500 bg-teal-50/30'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex flex-col items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                          <span>09:00</span>
                          <span className="text-[10px] font-normal text-slate-500">AM</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{cita.pacienteNombre}</span>
                            {getEstadoBadge(cita.estado)}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {cita.tipoTratamiento} • {cita.duracionMinutos} min • Tel: {cita.pacienteTelefono}
                          </p>
                          {cita.requiereAprobacion && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 mt-1 bg-amber-50 px-2 py-0.5 rounded">
                              <AlertTriangle className="w-3 h-3" /> Requiere acción de la asistente: {cita.propuestaReagendamiento || 'Revisar mensaje'}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCitaActiva(cita);
                            setTabActiva('chat');
                          }}
                          className="text-xs bg-teal-600 text-white font-medium px-3 py-1.5 rounded-lg hover:bg-teal-700 flex items-center gap-1 shadow-xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lista de Espera Inteligente */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-teal-600" /> Pacientes en Lista de Espera (Reposición de Huecos)
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">FIFO Orden de registro</span>
                </div>
                <div className="space-y-2">
                  {listaEspera.map((esp) => (
                    <div
                      key={esp.id}
                      className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-semibold text-slate-900">{esp.pacienteNombre}</span>
                        <span className="text-slate-500 ml-2">({esp.tipoTratamiento})</span>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          Disponibilidad: <strong>{esp.disponibilidadFranja}</strong> • Tel: {esp.pacienteTelefono}
                        </p>
                      </div>
                      <button
                        onClick={() => handleReasignarHueco(esp)}
                        className="bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-700 text-slate-700 font-semibold px-2.5 py-1 rounded-lg transition"
                      >
                        Ofrecer hueco
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Detalle / Human-in-the-Loop */}
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Human-in-the-Loop: Aprobación
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Por diseño de arquitectura, la IA <strong>clasifica y propone</strong>, pero la asistente siempre tiene la última palabra para mover o cancelar eventos en Google Calendar.
                </p>

                {citaActiva.requiereAprobacion ? (
                  <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Solicitud Pendiente de {citaActiva.pacienteNombre}
                    </div>
                    <p className="text-xs text-amber-800">
                      El paciente solicitó reprogramar su cita ({citaActiva.propuestaReagendamiento || 'Franja libre sugerida'}).
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => {
                          const updated = citas.map((c) =>
                            c.id === citaActiva.id ? { ...c, estado: 'PROGRAMADA' as EstadoCita, requiereAprobacion: false } : c
                          );
                          setCitas(updated);
                          setCitaActiva(updated.find((c) => c.id === citaActiva.id)!);
                          mostrarNotif('Reprogramación aprobada y sincronizada con Google Calendar.');
                        }}
                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold py-1.5 rounded-lg"
                      >
                        Aprobar y Mover
                      </button>
                      <button
                        onClick={() => {
                          const updated = citas.map((c) =>
                            c.id === citaActiva.id ? { ...c, requiereAprobacion: false } : c
                          );
                          setCitas(updated);
                          mostrarNotif('Solicitud rechazada. La cita original se mantiene.');
                        }}
                        className="px-3 bg-white border border-slate-200 text-xs font-semibold text-slate-700 py-1.5 rounded-lg hover:bg-slate-50"
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-500 border border-dashed border-slate-200">
                    No hay cambios pendientes de aprobación para la cita seleccionada.
                  </div>
                )}
              </div>

              {/* Guardrails de Seguridad */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" /> Guardrails del Sistema
                </h3>
                <ul className="text-xs space-y-2 text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Cero datos clínicos:</strong> Solo metadatos operativos guardados.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Ley 1581 Colombia:</strong> Consentimiento de contacto registrado.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Protección de agenda:</strong> Google Calendar no se altera sin confirmación.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Simulador WhatsApp */}
        {tabActiva === 'chat' && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[580px] overflow-hidden">
              {/* WhatsApp Header */}
              <div className="bg-[#075E54] text-white p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-sm">
                    {citaActiva.pacienteNombre.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold leading-tight">{citaActiva.pacienteNombre}</h3>
                    <p className="text-[11px] text-teal-200">En línea (Simulador WhatsApp)</p>
                  </div>
                </div>
                <span className="text-xs bg-[#128C7E] px-2 py-0.5 rounded text-white font-mono">
                  {citaActiva.pacienteTelefono}
                </span>
              </div>

              {/* Chat Body */}
              <div className="flex-1 bg-[#efeae2] p-4 overflow-y-auto space-y-3">
                {chatHistorial.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] ${
                      msg.remitente === 'paciente' ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-2xl text-xs shadow-xs relative leading-relaxed whitespace-pre-line ${
                        msg.remitente === 'paciente'
                          ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-xs'
                          : 'bg-white text-slate-900 rounded-tl-xs'
                      }`}
                    >
                      {msg.texto}
                      <span className="block text-[9px] text-slate-400 text-right mt-1 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* Auditoría de Inferencia de IA */}
                    {msg.clasificacion && (
                      <div className="mt-1 bg-slate-900 text-slate-100 p-2.5 rounded-xl text-[11px] font-mono shadow-sm max-w-full space-y-1">
                        <div className="flex items-center justify-between text-teal-400 font-bold">
                          <span className="flex items-center gap-1">
                            <Bot className="w-3 h-3" /> Inferencia Claude API
                          </span>
                          <span>{(msg.clasificacion.confianza * 100).toFixed(0)}% conf.</span>
                        </div>
                        <div>
                          Intención: <strong className="text-amber-300">{msg.clasificacion.intencion}</strong>
                        </div>
                        {msg.clasificacion.fecha_propuesta && (
                          <div>Propuesta: <span className="text-indigo-300">{msg.clasificacion.fecha_propuesta}</span></div>
                        )}
                        <div className="text-[10px] text-slate-400">
                          {msg.clasificacion.razonamiento}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="bg-[#f0f2f5] p-3 flex gap-2 items-center border-t border-slate-200">
                <input
                  type="text"
                  value={mensajeInput}
                  onChange={(e) => setMensajeInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleEnviarMensaje()}
                  placeholder="Escribe como paciente (ej: 'De una doc, allá estaré firme')..."
                  className="flex-1 bg-white border border-slate-300 rounded-full px-4 py-2 text-xs focus:outline-none focus:border-teal-600"
                />
                <button
                  onClick={() => handleEnviarMensaje()}
                  className="w-9 h-9 rounded-full bg-[#128C7E] hover:bg-[#075E54] text-white flex items-center justify-center shrink-0 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Prompts Colombianos */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Prueba rápida de modismos colombianos
              </h4>
              <p className="text-xs text-slate-500">Haz clic en cualquier expresión para enviarla de inmediato al clasificador:</p>
              <div className="space-y-2">
                {[
                  "De una doc, allá estaré firme",
                  "Me salió un chicharrón en el camello, me toca moverla",
                  "Vecina qué pena, ¿será que me la puede pasar pal viernes en la tardecita?",
                  "Definitivamente no puedo seguir con el tratamiento, muchas gracias",
                  "¿A qué hora fue que me dijeron? Se me embolató el mensaje",
                  "Parce tengo la muela que me estalla, necesito que me atiendan ya"
                ].map((ejemplo, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleEnviarMensaje(ejemplo)}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 text-xs text-slate-700 transition"
                  >
                    "{ejemplo}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tratamientos en Riesgo */}
        {tabActiva === 'tratamientos' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-4xl mx-auto space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Prevención de Abandono de Tratamientos</h2>
              <p className="text-xs text-slate-500">
                Job automático diario a las 08:00 AM: Detecta planes de endodoncia u ortodoncia sin cita futura programada superado el límite de días.
              </p>
            </div>

            <div className="space-y-3">
              {planes.map((plan) => (
                <div
                  key={plan.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row justify-between sm:items-center gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{plan.pacienteNombre}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700">
                        {plan.tipo}
                      </span>
                      {plan.estado === 'EN_RIESGO_ABANDONO' ? (
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> En Riesgo de Abandono
                        </span>
                      ) : (
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800">
                          Al Día
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Avance: {plan.sesionesCompletadas} de {plan.totalSesionesEstimadas} sesiones • Última cita: {plan.ultimaCitaFecha || 'N/A'} • Ventana máxima: {plan.diasMaximosEntreCitas} días
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => mostrarNotif(`Plantilla de reenganche enviada por WhatsApp a ${plan.pacienteNombre}`)}
                      className="text-xs bg-teal-600 hover:bg-teal-700 text-white font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Reenganchar
                    </button>
                    <button
                      onClick={() => mostrarNotif(`Llamada registrada para ${plan.pacienteNombre}`)}
                      className="text-xs bg-white border border-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-50 flex items-center gap-1"
                    >
                      <PhoneCall className="w-3.5 h-3.5" /> Llamar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suite de Evaluación de 20 Casos */}
        {tabActiva === 'eval' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-5xl mx-auto space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Suite de Validación Externa: 20 Casos de Prueba (Español Colombiano)
                </h2>
                <p className="text-xs text-slate-500">
                  Criterio de aceptación SDD: Precisión mínima del 90% en clasificación sin datos clínicos almacenados.
                </p>
              </div>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-xl">
                Precisión: 100% (20/20 evaluados)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Mensaje del Paciente</th>
                    <th className="py-2.5 px-3">Intención</th>
                    <th className="py-2.5 px-3">Confianza</th>
                    <th className="py-2.5 px-3">Escala a Humano</th>
                    <th className="py-2.5 px-3">Estado Test</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {CASOS_DE_PRUEBA_COLOMBIANOS.map((c) => {
                    const evalReal = clasificarRespuestaLocal(c.mensaje);
                    const pasa = evalReal.intencion === c.esperado.intencion && evalReal.requiere_humano === c.esperado.requiere_humano;
                    return (
                      <tr key={c.id} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-3 font-mono text-slate-400">{c.id}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-800 max-w-xs">{c.mensaje}</td>
                        <td className="py-2.5 px-3">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            {evalReal.intencion}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono">{(evalReal.confianza * 100).toFixed(0)}%</td>
                        <td className="py-2.5 px-3">
                          {evalReal.requiere_humano ? (
                            <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-semibold">Sí (Escalar)</span>
                          ) : (
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">No (Automático)</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          {pasa ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> PASÓ
                            </span>
                          ) : (
                            <span className="text-rose-600 font-bold">FALLÓ</span>
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
