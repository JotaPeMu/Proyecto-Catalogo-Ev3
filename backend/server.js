// Importación de librerías necesarias para el servidor y la base de datos
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config(); // Carga las credenciales desde el archivo .env

// Inicialización de la aplicación Express y definición del puerto
const app = express();
const PORT = process.env.PORT || 3000;

// =============================
// CONFIGURACIÓN DE MIDDLEWARES
// =============================
app.use(cors()); // Permite peticiones entre frontend y backend sin bloqueos de seguridad
app.use(express.json()); // Permite leer datos en formato JSON enviados desde formularios
app.use(express.static(path.join(__dirname, '../frontend'))); // Sirve los archivos HTML, CSS y JS

// ======================
// CONEXIÓN A POSTGRESQL
// ======================
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Toma la URL completa cuando corre en Render
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false // Obligatorio para Render
});

// =======================================================
// 1. OBTENER TODOS LOS PRODUCTOS CON SU CATEGORÍA (GET)
// =======================================================
app.get('/api/productos', async (req, res) => {
    try {
        // Une las tablas productos y categorias para traer el nombre de la categoría
        const sql = `
            SELECT p.*, c.nombre AS categoria 
            FROM productos p
            JOIN categorias c ON p.categoria_id = c.categoria_id
            ORDER BY p.producto_id DESC
        `;
        const { rows } = await pool.query(sql);
        res.json(rows); // Devuelve la lista completa en formato JSON
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// ==================================================
// 2. OBTENER TODAS LAS CATEGORÍAS DISPONIBLES (GET)
// ==================================================
app.get('/api/categorias', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM categorias ORDER BY nombre ASC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
});

// =======================================================
// 3. GUARDAR UN NUEVO VIDEOJUEGO EN LA BD (POST)
// =======================================================
app.post('/api/productos', async (req, res) => {
    const { nombre, descripcion, precio, imagen_url, categoria_id, password } = req.body;

    // Verifica que la contraseña coincida con la guardada en .env / Render
    if (!password || password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Contraseña incorrecta. No autorizado para agregar.' });
    }

    // Validación básica: exige que vengan los campos obligatorios
    if (!nombre || precio == null || !categoria_id) {
        return res.status(400).json({ error: 'Faltan datos obligatorios.' });
    }

    try {
        // Consulta parametrizada ($1..$5) para evitar inyección SQL
        const sql = `
            INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id)
            VALUES ($1, $2, $3, $4, $5) RETURNING *
        `;
        // Limpia espacios y asigna valores por defecto si descripción o imagen vienen vacías
        const valores = [
            nombre.trim(),
            descripcion?.trim() || 'Sin descripción disponible.',
            Number(precio),
            imagen_url?.trim() || 'assets/img/default.jpg',
            Number(categoria_id)
        ];

        const { rows } = await pool.query(sql, valores);
        res.status(201).json(rows); // Devuelve el producto recién creado
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al guardar el videojuego' });
    }
});

// =======================================================
// 4. ELIMINAR UN PRODUCTO CON AUTORIZACIÓN (DELETE)
// =======================================================
app.delete('/api/productos/:id', async (req, res) => {
    const { id } = req.params;
    const { password } = req.body; // Recibe la contraseña enviada desde el formulario

    // Verifica que la contraseña coincida con la guardada en el archivo .env
    if (!password || password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Contraseña incorrecta. No autorizado para eliminar.' });
    }

    try {
        const resultado = await pool.query('DELETE FROM productos WHERE producto_id = $1 RETURNING *', [id]);
        if (resultado.rowCount === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar el videojuego' });
    }
});


// =======================
// ENCENDIDO DEL SERVIDOR
// =======================
app.listen(PORT, () => console.log(`Servidor activo en http://localhost:${PORT}`));
