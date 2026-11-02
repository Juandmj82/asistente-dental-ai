# AGENTS.md — Contexto Persistente para el Agente

Este archivo define las directrices arquitectónicas, el alcance de producto, las restricciones legales y el flujo de trabajo para cualquier agente de IA que interactúe con el proyecto **Asistente Dental AI**.

---

## 1. Misión del Proyecto
Construir una solución de software con IA para un consultorio dental (1 doctora, 1 asistente) que reduzca la inasistencia a citas, automatice recordatorios por WhatsApp y prevenga el abandono de tratamientos multisesión, manteniendo a Google Calendar como la fuente de verdad.

---

## 2. Restricciones No Negociables
1. **Google Calendar manda:** La agenda oficial reside en Google Calendar. El agente nunca debe sobrescribir ni mover citas de manera autónoma sin confirmación explícita de la asistente (Human-in-the-Loop).
2. **Ley 1581 de 2012 (Habeas Data Colombia):** Queda estrictamente prohibido persistir datos de salud, diagnósticos, historial clínico o anamnesis. Solo se procesan metadatos operativos (nombre, teléfono, fecha y categoría administrativa).
3. **Determinismo sobre IA:**
   - La lógica de horarios, transiciones de estado, cálculo de fechas y lista de espera es 100% determinista.
   - La IA solo se utiliza para clasificar texto libre en lenguaje natural hacia esquemas JSON tipados.
4. **Modo Dry-Run obligatorio:** Ningún mensaje sale a la red de WhatsApp en producción sin validación previa en modo simulado.

---

## 3. Guía de Marca y Estilo
* Todo componente visual debe adherirse a la skill de diseño de marca definida en `.skills/brand-design/SKILL.md`.
* Colores: Primario `#0D9488` (`teal-600`), fondos limpios `#F8FAFC` (`slate-50`), y tarjetas `#FFFFFF` con bordes redondeados.

---

## 4. Estructura del Repositorio
```
asistente-dental-ai/
├── AGENTS.md                          # Este archivo de contexto persistente (Punto 1)
├── specs/
│   └── spec.md                        # Especificación funcional y técnica (Punto 2)
├── .skills/
│   └── brand-design/
│       └── SKILL.md                   # Skill de diseño de marca (Punto 3)
├── src/
│   ├── App.tsx                        # Interfaz interactiva y Human-in-the-Loop
│   ├── classifier.ts                  # Clasificador de lenguaje natural y 20 casos eval
│   ├── mockData.ts                    # Datos de prueba para Google Calendar y tratamientos
│   └── types.ts                       # Tipado estricto TypeScript
└── README.md                          # Documentación del proyecto
```
