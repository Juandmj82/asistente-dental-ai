# 🦷 Asistente Dental AI — Agenda Inteligente y Retención de Pacientes

Sistema inteligente para consultorios odontológicos diseñado bajo la metodología **Spec-Driven Development (SDD)** para la certificación del curso *Product Engineer con AI* de **CódigoFacilito** (profesor Uriel Hernández).

---

## 🎯 Objetivos de Producto y Métricas

1. **Reducción del Absentismo:** Disminución del 30% al ≤ 12% mediante recordatorios multicanal deterministas (T-48h y T-24h).
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

## ⚡ Suite de Validación Externa (20 Casos en Español Colombiano)

El clasificador de lenguaje natural evalúa expresiones y modismos colombianos con **100% de precisión**:
* *"De una doc, allá estaré firme"* ➔ `CONFIRMAR`
* *"Me salió un chicharrón en el camello, me toca moverla"* ➔ `REPROGRAMAR`
* *"Vecina qué pena, ¿será que me la puede pasar pal viernes en la tardecita?"* ➔ `REPROGRAMAR`
* *"Parce tengo la muela que me estalla"* ➔ `NO_RECONOCIDO` (Escala inmediatamente a humano)

---

## 🚀 Despliegue en Producción

El proyecto está construido con **Vite + React + TypeScript + Tailwind CSS** y optimizado para desplegarse con un clic en **Vercel** o **Netlify**:

```bash
npm install
npm run build
npm run preview
```
