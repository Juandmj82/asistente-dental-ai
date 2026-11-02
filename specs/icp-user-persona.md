# Paso 1: ICP (Ideal Customer Profile) y User Persona

**Proyecto:** Asistente Dental AI — Clínica Dental San Jerónimo  
**Rol:** Senior Product Engineer  
**Metodología:** Producto Centrado en el Usuario (Clase 3)  

---

## 1. ICP (Ideal Customer Profile) — Perfil de Cliente Ideal

| Atributo | Definición para el Consultorio |
|---|---|
| **Tipo de Negocio** | Consultorio odontológico independiente / Clínica dental boutique pequeña. |
| **Tamaño del Equipo** | 1 Odontóloga titular (propietaria) + 1 Asistente administrativa y de sillón. |
| **Ubicación Geográfica** | Bogotá, Colombia (sectores urbanos residenciales o comerciales de estratos 3 a 5: ej. Chapinero, Cedritos, Modelia). |
| **Volumen de Pacientes** | 30 a 50 citas semanales por sillón. |
| **Stack Actual de Agenda** | Google Calendar (fuente de verdad indiscutible) + WhatsApp Web para contacto. |
| **Dolor Principal** | Pérdida mensual recurrente de ingresos por ausentismo no avisado (~30% de inasistencia) y fuga de tratamientos multisesión (Ortodoncia / Endodoncia). |
| **Presupuesto Tecnológico** | Bajo o nulo para software de suscripción costoso y complejo (no quieren pagar ERPs médicos pesados de \$100+ USD/mes que nadie sabe usar). |
| **Barrera de Adopción** | Resistencia al cambio: la odontóloga no quiere abandonar su Google Calendar en el móvil ni aprender una interfaz complicada. |

---

## 2. User Persona Principal: La Asistente Dental

> *"Necesito atender a los pacientes que están en sala de espera sin tener que pasarme dos horas pegada al celular escribiendo los mismos recordatorios una y otra vez."*

### Perfil Demográfico y Laboral
* **Nombre:** Paola Andrea Cárdenas
* **Edad:** 29 años
* **Cargo:** Asistente Administrativa y Auxiliar de Consultorio
* **Experiencia:** 4 años en el sector dental
* **Dispositivos:** Celular corporativo (Motorola / Xiaomi con WhatsApp Business) y un computador de escritorio en recepción con Windows y Google Chrome.

### Dolores Diarios (Pain Points)
1. **Sobrecarga matutina repetitiva:** Llega a las 07:30 AM y pasa hasta las 10:00 AM abriendo chats de WhatsApp para recordar citas de mañana una por una.
2. **Mensajes informales sin procesar:** Los pacientes responden tarde, con dudas de horarios o cancelan a último minuto, y no tiene tiempo de avisarle a los pacientes que están en lista de espera.
3. **Pérdida de la pista en tratamientos largos:** Cuando un paciente de endodoncia o brackets termina una sesión y dice *"yo le escribo luego para cuadrar la siguiente"*, el seguimiento se olvida y el tratamiento queda abandonado.

### Objetivos y Motivaciones
* Poder enfocarse en la atención presencial de los pacientes y en la desinfección/asistencia clínica.
* Que el sistema le avise de forma clara y sin rodeos cuando alguien cancela para llenar el hueco en minutos con un solo clic.
* No tener que aprender herramientas difíciles: todo debe ser intuitivo y resolver el problema en 1 o 2 clics.

---

## 3. User Persona Secundario: La Odontóloga Titular

* **Nombre:** Dra. Marcela Restrepo (39 años)
* **Preocupación:** Rentabilidad del sillón dental y continuidad de los tratamientos de sus pacientes.
* **Comportamiento:** Mira su agenda personal desde la aplicación móvil de Google Calendar. Si el sistema no se sincroniza con Google Calendar, no lo usará.
