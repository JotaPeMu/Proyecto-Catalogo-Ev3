# Play The Game Store — Catálogo Digital Gamer
Aplicación web Full-Stack desarrollada para la **Evaluación Parcial N° 3 de Diseño y Desarrollo de Software** del **CFT Estatal Región de Valparaíso**.

El sistema permite administrar un catálogo interactivo de productos gamer conectado en tiempo real a una base de datos relacional **PostgreSQL**, ofreciendo lectura mediante consultas relacionales (`INNER JOIN`), filtrado dinámico en pantalla y registro de nuevos títulos desde la interfaz web.

---

## Arquitectura y Tecnologías Utilizadas

* **Base de Datos:** PostgreSQL (tablas normalizadas `categorias` y `productos` con llave foránea y consultas `INNER JOIN`).
* **Backend:** Node.js con **Express**, **pg** (node-postgres), **CORS** y **dotenv**.
* **Frontend:** HTML5 Semántico, CSS3 personalizado con efectos multimedia y **Bootstrap 5.3.9**.
* **Control de Versiones:** Git y GitHub.

---

## Estructura del Proyecto

```text
Proyecto_Catalogo_EV3/
├── .gitignore
├── README.md
├── database/
│   └── dump_catalogo.sql
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
└── frontend/
    ├── index.html
    ├── nosotros.html
    ├── contacto.html
    └── assets/
        ├── css/
        │   └── style.css
        ├── img/
        │   └── (Carátulas oficiales de los productos)
        ├── js/
        │   └── script.js
        └── video/
            └── video.mp4
```

---

## Instrucciones de Instalación y Ejecución Local

### 1. Configurar la Base de Datos (PostgreSQL)
1. Abrir **pgAdmin 4** y crear una nueva base de datos llamada `catalogo_juegos_db`.
2. Abrir el **Query Tool** sobre `catalogo_juegos_db`, cargar el archivo `database/dump_catalogo.sql` y ejecutarlo (`F5`) para crear las tablas y poblar los registros iniciales.

### 2. Configurar y Levantar el Servidor Backend
1. Abrir una terminal en la carpeta `backend/` e instalar las dependencias:
   ```bash
   cd backend
   npm install
   ```
   *(Nota para Windows PowerShell: Si la política de ejecución bloquea `npm`, ejecutar `npm.cmd install` o abrir la terminal en modo Command Prompt / CMD).*

2. Crear un archivo `.env` dentro de `backend/` tomando como referencia `.env.example` e ingresando las credenciales locales de PostgreSQL:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_DATABASE=catalogo_juegos_db
   DB_USER=postgres
   DB_PASSWORD=tu_password_aqui
   ADMIN_PASSWORD=tu_clave_admin_aqui
   ```
3. Iniciar el servidor:
   ```bash
   node server.js
   ```

### 3. Visualizar la Aplicación Web
* Abrir el navegador y acceder a: **`http://localhost:3000/`**
* Desde la barra de navegación superior es posible recorrer las **3 secciones principales**:
  * **Inicio y Catálogo (`index.html`):** Visualización de tarjetas, búsqueda por nombre, filtrado por categoría y formulario desplegable para insertar nuevos productos en PostgreSQL.
  * **Quiénes Somos (`nosotros.html`):** Historia, misión, visión, valores y stack tecnológico del proyecto.
  * **Contacto (`contacto.html`):** Formulario interactivo de consultas y canales institucionales.

---

## Autor

* **José Muñoz León** — TNS en Informática mención Ciberseguridad (CFT Estatal Región de Valparaíso).
