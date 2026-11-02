---
name: dental-brand-design
description: Guía de identidad visual, tono de voz y diseño de marca para la Clínica Dental San Jerónimo.
version: 1.0.0
---

# Skill: Diseño de Marca — Clínica Dental San Jerónimo

Esta skill instruye a los agentes sobre cómo aplicar consistentemente la identidad visual, el sistema de diseño y el tono de comunicación en todas las interfaces y mensajes del consultorio.

## 1. Identidad y Propuesta de Valor
* **Nombre:** Clínica Dental San Jerónimo
* **Esencia:** Odontología cercana, profesional, sin dolor y transparente.
* **Público objetivo:** Familias y profesionales en Bogotá que valoran la puntualidad y el trato humano.

## 2. Paleta de Colores y Significado
* **Primario (Teal / Verde Azulado Médico):**
  * Hex: `#0D9488` (Tailwind `teal-600`) / Hover: `#0F766E` (`teal-700`)
  * Transmite higiene clínica, calma, salud y confianza médica sin la frialdad del azul hospitalario genérico.
* **Acentos de Estado:**
  * **Confirmado / Éxito:** `#059669` (Tailwind `emerald-600`) y fondos `emerald-50`.
  * **Atención / T-24h / Alerta:** `#D97706` (Tailwind `amber-600`) y fondos `amber-50`.
  * **Urgencia / Cancelación:** `#E11D48` (Tailwind `rose-600`) y fondos `rose-50`.
* **Neutros y Superficies:**
  * Fondo general: `#F8FAFC` (Tailwind `slate-50`).
  * Contenedores / Tarjetas: `#FFFFFF` con borde fino `#E2E8F0` (`slate-200`) y esquinas redondeadas `rounded-2xl`.
  * Texto principal: `#0F172A` (`slate-900`) y texto secundario `#64748B` (`slate-500`).

## 3. Tipografía y Jerarquía
* **Familia tipográfica:** `Inter`, tipografía sin gracias moderna, legible en pantallas táctiles y dispositivos móviles.
* **Escala:**
  * Títulos de sección: `text-base` / `text-lg` en negrita (`font-bold`).
  * Etiquetas de estado: `text-xs` en seminegrita (`font-semibold`) con `px-2.5 py-0.5 rounded-full`.
  * Textos de apoyo / metadatos: `text-xs` o `text-[11px]`.

## 4. Tono de Comunicación (Copywriting)
* **Canal WhatsApp:**
  * Cercano, cálido pero formal y sumamente claro.
  * Nunca usar jerga médica incomprensible (ej. decir "cita para limpieza preventiva" en vez de "sesión de profilaxis periodontal").
  * Opciones cerradas para facilitar la respuesta: *"1 para Confirmar o 2 si necesitas Reprogramar"*.
* **Interfaz de la Asistente:**
  * Accionable y directo al punto.
  * Los botones deben describir la acción exacta: `Aprobar y Mover`, `Ofrecer hueco`, `Reenganchar`.

## 5. Criterios de Aceptación de Diseño
* Cualquier nueva vista debe utilizar los tokens de color `teal`, `emerald`, `amber` y `slate`.
* Mantener consistencia visual con bordes suaves (`rounded-xl` y `rounded-2xl`) y sombras sutiles (`shadow-xs` / `shadow-sm`).
* Las alertas de pacientes en riesgo o cambios pendientes siempre deben incluir un icono descriptivo de `lucide-react`.
