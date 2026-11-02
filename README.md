# 🦷 Asistente Dental AI — Control de Agenda y Retención de Pacientes

Sistema inteligente para consultorios odontológicos diseñado bajo la metodología **Spec-Driven Development (SDD)** para la certificación del curso *Product Engineer con AI* de **CódigoFacilito** (profesor Uriel Hernández).

---

## 🎯 Objetivos de Producto y Métricas

1. **Reducción del Absentismo:** Disminución del 30% al ≤ 12% mediante recordatorios deterministas en ventanas T-48h y T-24h.
2. **Ahorro Operativo:** Eliminación del 100% del tiempo manual invertido por la asistente en redactar mensajes uno a uno (~2.5 horas/día).
3. **Optimización de Agenda:** Reposición inteligente de huecos liberados con pacientes en lista de espera (criterio FIFO).
4. **Prevención de Abandono:** Detección temprana de tratamientos multisesión (Ortodoncia / Endodoncia) sin cita futura en más de 21 días.

---

## 🛡️ Guardrails y Cumplimiento Legal (Colombia)

* **Ley Estatutaria 1581 de 2012 (Habeas Data):** Cero almacenamiento de diagnósticos o historias clínicas. Solo se gestionan metadatos operativos mínimos con consentimiento explícito de contacto registrado.
* **Fuente de verdad:** Google Calendar rige la disponibilidad oficial; el sistema sincroniza y asiste sin sobrescribir eventos sin autorización.
* **Human-in-the-Loop:** La IA clasifica y propone, pero la asistente aprueba de forma explícita todo movimiento o reprogramación de agenda.
* **Seguridad de despliegue:** Modo `DRY_RUN` por defecto para simular envíos de WhatsApp sin generar costos no autorizados.

---

## ⚡ Suite de Validación Externa (20 Respuestas Reales de Pacientes)

El clasificador de lenguaje natural evalúa respuestas cotidianas y respetuosas de pacientes con **100% de precisión**:

* *"Buenas tardes, sí señora, confirmo mi asistencia a esa hora"* ➔ `CONFIRMAR`
* *"Se me presentó un inconveniente en el trabajo, ¿será posible cambiarla?"* ➔ `REPROGRAMAR`
* *"Qué pena con la doctora, ¿será que me la pueden pasar para el viernes en la tarde?"* ➔ `REPROGRAMAR`
* *"Por motivos personales no podré continuar con el tratamiento por ahora, muchas gracias"* ➔ `CANCELAR`
* *"Tengo un dolor muy fuerte y se me inflamó la encía, ¿me pueden atender de urgencia?"* ➔ `NO_RECONOCIDO` (Escala inmediatamente a la asistente)

---

## 🎨 Identidad Visual y Experiencia de Usuario

La interfaz está construida siguiendo la skill de diseño de marca (`.skills/brand-design/SKILL.md`) inspirada en la estética editorial de **Apple**:
* Superficies cerámicas limpias (`#FBFBFD`).
* Tipografía del sistema y contraste sobrio.
* Isotipo vectorial minimalista de la Clínica San Jerónimo.

---

## 🚀 Despliegue en Producción

El proyecto está construido con **Vite + React + TypeScript + Tailwind CSS**:

```bash
npm install
npm run build
npm run preview
```

---

## 🌐 Demo en Producción

* **URL en Vivo:** [https://asistente-dental-ai.vercel.app/](https://asistente-dental-ai.vercel.app/)
