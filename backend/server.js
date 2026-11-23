// =====================================================================
// IMPORTACIÓN DE MÓDULOS Y DEPENDENCIAS DEL SERVIDOR
// =====================================================================
const express = require('express');      // Framework web para crear el servidor y las rutas de la API REST
const cors = require('cors');            // Middleware para habilitar peticiones entre distintos orígenes (CORS)
const path = require('path');            // Módulo nativo de Node.js para manejar rutas de carpetas de forma segura
const { Pool } = require('pg');          // Cliente oficial de PostgreSQL con soporte para pool de conexiones
require('dotenv').config();              // Lee el archivo .env y carga sus variables en process.env

// Inicialización de la instancia de Express y definición del puerto (Render asigna uno dinámico o usa 3000)
const app = express();
const PORT = process.env.PORT || 3000;

// =====================================================================
// CONFIGURACIÓN DE MIDDLEWARES GLOBALES
// =====================================================================
app.use(cors());                         // Permite que el navegador consuma la API sin bloqueos de seguridad
app.use(express.json());                 // Convierte automáticamente el cuerpo (body) de las peticiones JSON en objetos JS
app.use(express.static(path.join(__dirname, '../frontend'))); // Entrega los archivos públicos (HTML, CSS, JS, videos)

// =====================================================================
// CONEXIÓN A LA BASE DE DATOS POSTGRESQL (LOCAL Y PRODUCCIÓN EN RENDER)
// =====================================================================
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Cadena de conexión completa usada al desplegar en Render
    host: process.env.DB_HOST,                  // Dirección del servidor (ej. localhost)
    port: process.env.DB_PORT,                  // Puerto de PostgreSQL (por defecto 5432)
    database: process.env.DB_DATABASE,          // Nombre de la base de datos local
    user: process.env.DB_USER,                  // Usuario de PostgreSQL (ej. postgres)
    password: process.env.DB_PASSWORD,          // Contraseña del usuario de PostgreSQL
    // Activa SSL solo cuando existe DATABASE_URL (requerido por servidores en la nube como Render)
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// ===============================================================
// 1. OBTENER TODOS LOS PRODUCTOS CON SU CATEGORÍA (PETICIÓN GET)
// ===============================================================
app.get('/api/productos', async (req, res) => {
    try {
        // Consulta SQL que cruza 'productos' y 'categorias' para obtener el nombre legible de la categoría
        const sql = `
            SELECT p.*, c.nombre AS categoria 
            FROM productos p
            JOIN categorias c ON p.categoria_id = c.categoria_id
            ORDER BY p.producto_id DESC
        `;
        // Ejecuta la consulta y extrae el arreglo de registros (rows)
        const { rows } = await pool.query(sql);
        res.json(rows); // Responde al frontend con el listado completo en formato JSON
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// ===========================================================
// 2. OBTENER TODAS LAS CATEGORÍAS DISPONIBLES (PETICIÓN GET)
// ===========================================================
app.get('/api/categorias', async (req, res) => {
    try {
        // Consulta todas las categorías ordenadas alfabéticamente para llenar los selectores del HTML
        const { rows } = await pool.query('SELECT * FROM categorias ORDER BY nombre ASC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
});

// ================================================================
// 3. GUARDAR UN NUEVO PRODUCTO EN LA BD (PETICIÓN POST PROTEGIDA)
// ================================================================
app.post('/api/productos', async (req, res) => {
    // Extrae los datos enviados desde el formulario en el cuerpo de la petición
    const { nombre, descripcion, precio, imagen_url, categoria_id, password } = req.body;

    // Barrera de seguridad: valida que la clave enviada coincida con ADMIN_PASSWORD del entorno
    if (!password || password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Contraseña incorrecta. No autorizado para agregar.' });
    }

    // Validación de campos mínimos requeridos antes de consultar la base de datos
    if (!nombre || precio == null || !categoria_id) {
        return res.status(400).json({ error: 'Faltan datos obligatorios.' });
    }

    try {
        // Consulta SQL parametrizada ($1 a $5) para prevenir ataques de inyección SQL (SQL Injection)
        const sql = `
            INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id)
            VALUES ($1, $2, $3, $4, $5) RETURNING *
        `;
        // Sanitiza textos y asigna valores de respaldo si descripción o imagen vienen vacías
        const valores = [
            nombre.trim(),
            descripcion?.trim() || 'Sin descripción disponible.',
            Number(precio),
            imagen_url?.trim() || 'assets/img/default.jpg',
            Number(categoria_id)
        ];

        // Inserta el registro y devuelve el objeto creado con código HTTP 201 (Created)
        const { rows } = await pool.query(sql, valores);
        res.status(201).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al guardar el producto' });
    }
});

// ==============================================================
// 4. ELIMINAR UN PRODUCTO EXISTENTE (PETICIÓN DELETE PROTEGIDA)
// ==============================================================
app.delete('/api/productos/:id', async (req, res) => {
    const { id } = req.params;        // Obtiene el ID del producto desde la URL (/api/productos/5)
    const { password } = req.body;    // Obtiene la contraseña de administrador desde el cuerpo JSON

    // Verifica autorización antes de ejecutar el borrado
    if (!password || password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Contraseña incorrecta. No autorizado para eliminar.' });
    }

    try {
        // Elimina el registro coincidente usando parámetro seguro ($1)
        const resultado = await pool.query('DELETE FROM productos WHERE producto_id = $1 RETURNING *', [id]);
        
        // Si rowCount es 0, el ID no existía en la base de datos
        if (resultado.rowCount === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar el videojuego' });
    }
});

// ======================================
// ENCENDIDO Y ESCUCHA DEL SERVIDOR HTTP
// ======================================
app.listen(PORT, () => console.log(`Servidor activo en http://localhost:${PORT}`));
