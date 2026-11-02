# Feature Spec: Recordatorios Automáticos y Clasificación de Respuestas con IA

**Feature:** `feature-recordatorios-confirmacion`  
**Autor:** Juan D. — Senior Product Engineer  
**Metodología:** Spec-Driven Development (SDD)  
**Proyecto:** Clínica Dental San Jerónimo  

---

## 1. Definición del Problema
Cerca del 30% de los pacientes de la doctora no asisten a sus citas agendadas en Google Calendar. La asistente dedica entre 2 y 3 horas diarias a enviar recordatorios individuales por WhatsApp y leer respuestas informales en lenguaje coloquial que muchas veces quedan sin procesar a tiempo, provocando huecos vacíos y pérdida de ingresos.

---

## 2. Diseño de la Solución

### 2.1 Flujo Operativo y Reglas Deterministas
1. **Detección T-48h:** El sistema identifica citas en estado `PROGRAMADA` y despacha el primer mensaje plantilla:
   > *"Hola [Nombre], te recordamos tu cita odontológica para el [Día] a las [Hora]. Por favor responde: 1 para Confirmar o 2 si necesitas Reprogramar."*
2. **Detección T-24h:** Si no hay respuesta tras 24 horas, despacha el segundo aviso de urgencia.
3. **Clasificación con IA (Claude API):** Cuando el paciente responde con texto libre (ej. *"De una doc, allá estaré"* o *"Me salió un chicharrón en el camello, me toca moverla"*), el modelo analiza el texto y retorna un JSON estructurado:
   ```json
   {
     "intencion": "CONFIRMAR | REPROGRAMAR | CANCELAR | DUDA_HORARIO | NO_RECONOCIDO",
     "confianza": 0.95,
     "fecha_propuesta": "string | null",
     "requiere_humano": false
   }
   ```
4. **Human-in-the-Loop:** Si la intención es `REPROGRAMAR` o `requiere_humano = true`, la cita pasa a la cola de aprobación de la asistente con la propuesta de nueva fecha para su visto bueno antes de tocar Google Calendar.

---

## 3. Criterios de Aceptación Verificables (3 a 5 Criterios)

* **Criterio 1 (Determinismo de Estados):** Una respuesta clasificada como `CONFIRMAR` debe actualizar la cita a estado `CONFIRMADA` en el panel y en la base de datos sin requerir intervención manual de la asistente.
* **Criterio 2 (Precisión de Modismos Colombianos):** El clasificador de IA debe alcanzar una precisión $\ge 90\%$ evaluado sobre la suite oficial de 20 expresiones coloquiales colombianas.
* **Criterio 3 (Control Humano en Reprogramaciones):** Ninguna solicitud de reprogramación o cancelación modificará eventos en Google Calendar de manera 100% autónoma; debe quedar en estado `requiereAprobacion = true` en el panel.
* **Criterio 4 (Cumplimiento Legal Ley 1581):** Los mensajes y los registros de auditoría de IA no deben persistir datos clínicos ni diagnósticos de los pacientes bajo ninguna circunstancia.
