========================================================================
DOCUMENTACIÓN DE CONFIGURACIÓN DEL PROYECTO (package.json)
Play The Game Store — API REST con Express y PostgreSQL
Desarrollado por: José Muñoz León
========================================================================

1. IDENTIFICACIÓN DEL PAQUETE
- "name": "backend" -> Nombre interno del módulo del servidor.
- "version": "1.0.0" -> Versión inicial estable del proyecto.
- "description" -> Resumen funcional de la API REST.
- "main": "server.js" -> Archivo principal que arranca la aplicación.
- "author": "José Muñoz León" -> Autor del desarrollo.
- "license": "ISC" -> Licencia de software libre bajo la cual se distribuye.
- "type": "commonjs" -> Indica el uso de require() y module.exports en Node.js.

2. SCRIPTS DE EJECUCIÓN (Comandos de terminal)
- "start": "node server.js"
  Se ejecuta con: npm start
  Función: Inicia el servidor en modo estándar/producción.

- "dev": "node --watch server.js"
  Se ejecuta con: npm run dev
  Función: Inicia el servidor en modo desarrollo, reiniciándose
  automáticamente cada vez que se guarda un cambio en server.js.

3. DEPENDENCIAS INSTALADAS (Librerías del Backend)
- "express" (^5.3.0): Framework web para crear el servidor HTTP, servir
  los archivos estáticos (HTML/CSS/JS) y gestionar los endpoints REST.
- "pg" (^8.23.1): Driver oficial (node-postgres) que permite conectar
  Node.js con PostgreSQL y ejecutar consultas SQL.
- "cors" (^2.8.6): Middleware que habilita las peticiones entre el
  frontend y el backend sin bloqueos de seguridad de origen cruzado.
- "dotenv" (^18.0.10): Carga variables de entorno desde el archivo .env
  (credenciales de base de datos, puerto y contraseña de administrador).

4. ARCHIVO DE BLOQUEO DE DEPENDENCIAS (package-lock.json)
- Función: Es generado automáticamente por npm al ejecutar "npm install".
- Propósito: Registra el árbol exacto de versiones, subdependencias y
  hashes de integridad de cada paquete instalado (express, pg, cors, dotenv).
- Importancia: Garantiza que cualquier otro desarrollador o servidor que
  instale el proyecto obtenga exactamente las mismas versiones y evita
  fallos por actualizaciones incompatibles.
- Nota técnica: Nunca debe editarse manualmente ni contener comentarios.

5. CARPETA DE DEPENDENCIAS INSTALADAS (node_modules/)
- Función: Almacena el código fuente de todos los paquetes instalados
  mediante npm (express, pg, cors, dotenv y sus subdependencias).
- Regeneración: Si se borra o se descarga el proyecto en otro equipo,
  se reconstruye por completo ejecutando el comando: npm install
- Control de versiones (Git): Está excluida en el archivo .gitignore
  para evitar subir miles de archivos innecesarios al repositorio.

========================================================================

