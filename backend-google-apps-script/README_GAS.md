# Guía de Conexión: Google Sheets & Google Apps Script
### SEGIP Gabinete Jurídico — Sistema de Saneamiento de Datos

Esta guía detalla los pasos para desplegar el backend institucional en Google Sheets y Apps Script de manera segura, con soporte para control de concurrencia (`LockService`) y acceso autorizado.

---

### Paso 1: Crear la Hoja de Cálculo Centralizada

1. Abra [Google Drive](https://drive.google.com) con la cuenta institucional de Google del SEGIP.
2. Cree una nueva hoja de cálculo llamada: `SEGIP - Gabinete Jurídico (Base de Datos Saneamiento)`.

---

### Paso 2: Vincular el Script de Backend

1. En el menú superior de la hoja de cálculo, ingrese a:
   **Extensiones** > **Apps Script**.
2. Asigne el nombre del proyecto: `SEGIP_Backend_Saneamiento`.
3. Reemplace el contenido del archivo `Código.gs` (o `Code.gs`) por el código provisto en:
   `backend-google-apps-script/Code.gs`.
4. En el selector de funciones, seleccione `inicializarHojas` y haga clic en **Ejecutar**.
   - Conceda los permisos solicitados por Google.
   - Esto creará automáticamente las pestañas `TRAMITES_SANEAMIENTO` y `HISTORIAL_AUDITORIA` con su formato institucional azul `#0A3871`.

---

### Paso 3: Implementar como Aplicación Web (Web App)

1. En la esquina superior derecha de Apps Script, haga clic en el botón azul **Implementar** > **Nueva implementación**.
2. En el icono de engranaje (Seleccionar tipo), elija **Aplicación web**.
3. Configure los siguientes parámetros:
   - **Descripción**: `SEGIP API v1.0 Saneamiento`
   - **Ejecutar como**: `Yo (tu cuenta institucional)`
   - **Quién tiene acceso**: `Cualquier usuario` (necesario para recibir las peticiones seguras desde el frontend web de Vercel).
4. Haga clic en **Implementar**.
5. Copie la **URL de la aplicación web** generada (tiene la estructura `https://script.google.com/macros/s/AKfycb.../exec`).

---

### Paso 4: Configurar en el Sistema Web

1. Abra el sistema web del SEGIP Gabinete Jurídico.
2. Vaya al menú lateral o inferior **Configuración**.
3. Pegue la URL de la Web App en el campo **URL de la Web App de Google Apps Script**.
4. Haga clic en **Guardar configuración** y luego en **Probar conexión**.
5. El sistema activará el badge verde `Sincronización activa` e intercambiará datos automáticamente cada 12 segundos con Google Sheets.

---

### Seguridad y Concurrencia

- **LockService**: Garantiza que dos operadores no generen el mismo número correlativo ni sobreescriban datos simultáneamente.
- **Inmutabilidad de Trámites Finalizados**: El servidor valida que ningún trámite en estado `FINALIZADO` pueda volver a estado `PENDIENTE`.
- **Modo Resiliente**: Si se presenta un microcorte de internet, los datos se almacenan de manera protegida en la sesión local y se sincronizan al restablecerse la conectividad.
