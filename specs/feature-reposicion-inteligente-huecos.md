# Paso 2: SPEC — Reposición Inteligente de Huecos y Reenganche de Tratamientos

**Feature:** `feature-reposicion-huecos-y-reenganche`  
**Autor:** Juan D. — Senior Product Engineer  
**Metodología:** Spec-Driven Development (SDD) — Clase 3: "Que funcione y que se use"  
**Usuario Objetivo:** Paola Andrea (Asistente Dental) y Dra. Marcela (Odontóloga)  

---

## 1. Definición del Problema y Oportunidad
Cuando un paciente cancela o pide reprogramar su cita a través de WhatsApp, el espacio en el sillón dental queda libre y la asistente rara vez logra reasignarlo a tiempo de forma manual. Por otra parte, pacientes que abandonan tratamientos multisesión (Ortodoncia / Endodoncia) representan una fuga de ingresos crítica para el consultorio.

Esta nueva característica introduce un **motor determinista de reposición asistida de huecos** en tiempo real y un **radar de reenganche preventivo** para que la asistente recupere ingresos en un solo toque.

---

## 2. Criterios de Aceptación Verificables

1. **Detección Automática de Hueco:**
   * Al confirmarse una cancelación o reprogramación con al menos 4 horas de anticipación, el sistema debe identificar automáticamente la franja horaria liberada y buscar en la lista de espera al paciente más antiguo (criterio FIFO) que coincida con el tipo de tratamiento.
2. **Notificación Asistida con 1 Solo Clic (Human-in-the-Loop):**
   * El sistema debe desplegar una tarjeta visual clara para Paola con el candidato ideal y un botón: `[Ofrecer espacio]`. Al presionarlo, se genera y despacha la plantilla de WhatsApp al paciente en lista de espera y se congela el espacio por 30 minutos.
3. **Radar de Reenganche Multisesión:**
   * El sistema debe listar diariamente a los pacientes de Ortodoncia o Endodoncia que lleven más de 21 días desde su última sesión completada sin tener una cita futura agendada en Google Calendar, ofreciendo botones directos de acción: `[Reenganchar por WhatsApp]` y `[Registrar Llamada]`.
4. **Cero Datos Clínicos (Ley 1581 de 2012):**
   * Ninguna tarjeta ni mensaje de reenganche debe contener diagnósticos o antecedentes médicos. Solo metadatos operativos (número de sesión completada sobre el total estimado).

---

## 3. Métricas de Éxito de Producto

* **Tasa de Ocupación de Huecos Liberados:** Reasignar con éxito al menos el **50% de las cancelaciones** con pacientes de lista de espera en menos de 2 horas desde la liberación del espacio.
* **Tiempo de Reacción de la Asistente (Time to Action):** Reducir el tiempo necesario para ofrecer un espacio cancelado de 25 minutos manuales a **menos de 60 segundos** (1 clic en la interfaz).
* **Retención de Tratamientos Multisesión:** Lograr que el **80% de los pacientes alertados en riesgo de abandono** agenden su siguiente sesión dentro de los 5 días posteriores a la alerta.
* **Reducción de Absentismo Total:** Mantener la inasistencia general del consultorio en $\le 12\%$ sostenido.
