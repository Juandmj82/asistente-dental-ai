---
name: dental-brand-design-apple-aesthetic
description: Sistema de diseño editorial inspirado en la estética de Apple (minimalismo radical, tipografía refinada, superficies cerámicas, contraste sutil y microinteracciones de alta gama) para la Clínica Dental San Jerónimo.
version: 2.0.0
---

# Skill: Identidad Visual y Sistema de Diseño — Estilo Apple

Esta skill instruye al agente y a los desarrolladores a construir interfaces médicas que se alejen por completo de los dashboards genéricos de IA (evitando degradados cliché púrpura/cian, tarjetas saturadas con bordes pesados y tipografías genéricas). En su lugar, aplica los principios de diseño industrial y digital de **Apple**.

---

## 1. Filosofía de Marca y Dirección de Arte

* **Concepto:** *«Precisión clínica, calidez invisible»*.
* **Referente:** La elegancia sobria de `apple.com`: generosidad de aire blanco, contraste tipográfico preciso, superficies translúcidas con desenfoque de fondo (*glassmorphism* tenue), esquinas perfectamente suavizadas (*squircle* / radios continuos) y ausencia de adornos innecesarios.
* **Sensación al usuario:** Más parecido a un dispositivo de diseño que a un software administrativo aburrido. Transmite pulcritud, exactitud quirúrgica y confianza premium.

---

## 2. Paleta de Color Cerámica y Acentos de Luz

Evitar a toda costa los colores brillantes de juguete o fondos grises planos de plantillas baratas.

* **Fondo Principal:** `#FBFBFD` (el icónico blanco cerámico cálido de Apple).
* **Superficies / Tarjetas elevadas:**
  * Fondo: `rgba(255, 255, 255, 0.82)` con filtro `backdrop-blur-md`.
  * Borde: `1px solid rgba(0, 0, 0, 0.05)` (borde ultra-delgado, casi imperceptible pero nítido).
  * Sombra: `0 4px 20px -2px rgba(0, 0, 0, 0.03)` (sombra difusa y natural).
* **Tipografía y Contraste:**
  * Texto primario: `#1D1D1F` (negro carbón profundo de Apple, nunca `#000000` puro).
  * Texto secundario: `#86868B` (gris editorial neutro).
  * Texto terciario / pies de foto: `#A1A1A6`.
* **Acentos Funcionales:**
  * **Azul Sistema Apple:** `#0071E3` (Hover: `#0077ED`) para acciones principales, botones de confirmación y estados activos.
  * **Verde Bio-Salud:** `#34C759` para estados de confirmación y asistencia garantizada.
  * **Ámbar Precaución:** `#FF9F0A` para citas pendientes de confirmación o alerta de 24h.
  * **Coral / Baja:** `#FF3B30` para cancelaciones o tratamientos en riesgo de abandono.

---

## 3. Tipografía y Composición Espacial

* **Fuente:** `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif`.
* **Tracking y Kerning:**
  * Títulos principales: `tracking-tight` (`-0.025em`) con peso tipográfico `font-semibold` o `font-medium` (Apple casi nunca usa negritas pesadas agresivas).
  * Números y métricas: Numerales elegantes con `font-semibold` y unidades sutiles en texto secundario.
  * Textos descriptivos: `leading-relaxed` con suficiente interlineado para lectura descansada.
* **Espaciado y Proporciones:**
  * Padding generoso: Las tarjetas respiran con `p-6` o `p-8`.
  * Radios: `rounded-3xl` (24px a 28px) en tarjetas principales; `rounded-full` en píldoras y botones de llamada a la acción.

---

## 4. Componentes y Patrones de Interfaz

* **Botones Estilo Apple:**
  * *Primario:* Botón tipo píldora (`rounded-full`), fondo `#0071E3`, texto blanco nítido, padding `px-5 py-2`, micro-interacción de escala sutil al pulsar (`active:scale-98`).
  * *Secundario / Botón de Vidrio:* Fondo `rgba(0, 0, 0, 0.04)` hover `rgba(0, 0, 0, 0.07)`, texto `#1D1D1F`, sin bordes agresivos.
* **Píldoras de Estado (Badges):**
  * Fondos tenues al 10% de opacidad del color funcional con texto nítido: ej. `bg-[#34C759]/10 text-[#248A3D]`.
* **Segmented Controls (Pestañas de Navegación):**
  * Barra de control encapsulada en cápsula gris suave `bg-[#E5E5EA]/50` con el selector activo en blanco puro flotante con sombra suave `shadow-sm rounded-full`.

---

## 5. Tono Editorial y Microcopy

* Directo, seguro y sin rodeos.
* Cero exclamaciones forzadas ni emojis innecesarios en la interfaz.
* Uso de oraciones cortas y afirmativas:
  * En lugar de: *"¡Bienvenido al sistema inteligente de gestión dental de vanguardia!"*
  * Usar: *"Agenda del consultorio. Gestionada con precisión."*
