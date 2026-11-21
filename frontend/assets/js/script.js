// Rutas de la API del servidor backend
const API = { productos: '/api/productos', categorias: '/api/categorias' };

// Lista en memoria donde se guardan todos los productos traídos de PostgreSQL
let productos = [];

// Atajo para seleccionar elementos del HTML por su ID sin repetir document.getElementById
const $ = id => document.getElementById(id);

// =======================================================
// 1. CARGAR CATEGORÍAS EN EL FILTRO Y EN EL FORMULARIO
// =======================================================
async function cargarCategorias() {
    try {
        // Pide la lista de categorías al backend
        const res = await fetch(API.categorias);
        const categorias = await res.json();

        // Llena el selector de filtro (usa el nombre de la categoría para filtrar en pantalla)
        $('filtro-categoria').innerHTML = '<option value="all">Todas las categorías</option>' +
            categorias.map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('');

        // Llena el selector del formulario (usa el categoria_id para guardar la llave foránea en la BD)
        $('select-categoria-form').innerHTML = '<option value="">Selecciona una categoría...</option>' +
            categorias.map(c => `<option value="${c.categoria_id}">${c.nombre}</option>`).join('');
    } catch (error) {
        console.error('Error al cargar categorías:', error);
    }
}

// =====================================
// 2. TRAER PRODUCTOS DESDE POSTGRESQL
// =====================================
async function cargarProductos() {
    // Muestra un ícono de carga mientras responde el servidor
    $('estado-carga').innerHTML = `<div class="spinner-border text-info"></div><p class="text-info mt-2">Cargando catálogo...</p>`;

    try {
        // Consulta todos los productos al backend
        const res = await fetch(API.productos);
        if (!res.ok) throw new Error();

        // Guarda los datos recibidos en la variable global y limpia el mensaje de carga
        productos = await res.json();
        $('estado-carga').innerHTML = '';
        
        // Llena el selector del apartado de eliminación con los productos actuales
        $('select-eliminar-producto').innerHTML = '<option value="">Selecciona un producto...</option>' +
            productos.map(p => `<option value="${p.producto_id}">ID #${p.producto_id} — ${p.nombre}</option>`).join('');

        // Dibuja las tarjetas en la pantalla
        filtrarYMostrar();
    } catch {
        // Si el servidor Node está apagado o falla la BD, muestra alerta roja
        $('estado-carga').innerHTML = `<div class="alert alert-danger">Error de conexión con el servidor (localhost:3000).</div>`;
    }
}

// =============================================
// 3. FILTRAR EN MEMORIA Y DIBUJAR LAS TARJETAS
// =============================================
function filtrarYMostrar() {
    // Obtiene lo que el usuario escribió en el buscador y la categoría seleccionada
    const texto = $('filtro-nombre').value.trim().toLowerCase();
    const cat = $('filtro-categoria').value;

    // Filtra la lista según el nombre y la categoría elegida
    const filtrados = productos.filter(j =>
        j.nombre.toLowerCase().includes(texto) && (cat === 'all' || j.categoria === cat)
    );

    // Actualiza la insignia con la cantidad de resultados encontrados
    $('contador-resultados').textContent = `${filtrados.length} resultado(s)`;

    // Si no hay coincidencias, muestra un mensaje informativo
    if (!filtrados.length) {
        $('galeria-productos').innerHTML = `<p class="col-12 text-center text-secondary my-5 fs-5">No se encontraron videojuegos.</p>`;
        return;
    }

    // Transforma cada producto filtrado en una tarjeta HTML de Bootstrap
    $('galeria-productos').innerHTML = filtrados.map(j => {
        // Formatea el precio en pesos chilenos o muestra "Gratis" si vale 0
        const precio = Number(j.precio) === 0 ? 'Gratis' : `$${Number(j.precio).toLocaleString('es-CL')} CLP`;

        // Genera una imagen de respaldo por si la URL de la foto falla o viene vacía
        const imgRespaldo = crearImagenRespaldo(j.nombre, j.categoria);

        return `
        <article class="col-12 col-sm-6 col-md-4 col-lg-3">
            <div class="card h-100 game-card text-white shadow-sm">
                <!-- Imagen del juego con respaldo automático si falla el enlace -->
                <img src="${j.imagen_url}" onerror="this.onerror=null; this.src='${imgRespaldo}';" class="card-img-top" alt="${j.nombre}">
                
                <div class="card-body d-flex flex-column">
    <!-- Título a ancho completo y descripción -->
    <h3 class="h5 card-title fw-bold text-info mb-2">${j.nombre}</h3>
    <p class="card-text small text-light opacity-75 mb-3">${j.descripcion}</p>

    <!-- Categoría alineada a la derecha justo arriba de la línea divisoria -->
    <div class="mt-auto text-end mb-2">
        <span class="badge bg-info text-dark">${j.categoria}</span>
    </div>

    <!-- Pie de la tarjeta: Precio e ID -->
    <div class="pt-2 border-top border-secondary d-flex justify-content-between align-items-center">
        <span class="fw-bold">${precio}</span>
        <small class="text-secondary">ID #${j.producto_id}</small>
    </div>
</div>

            </div>
        </article>`;
    }).join('');
}

// =====================================================
// 4. GENERAR IMAGEN DE RESPALDO (SVG) SI FALLA LA FOTO
// =====================================================
function crearImagenRespaldo(titulo, categoria) {
    // Crea un gráfico vectorial oscuro con el nombre y categoría del producto
    const svg = `<svg xmlns="http://w3.org" width="600" height="340" viewBox="0 0 600 340">
        <rect width="600" height="340" fill="#0f172a"/>
        <text x="300" y="150" font-family="Arial" font-size="16" fill="#0dcaf0" text-anchor="middle">${categoria.toUpperCase()}</text>
        <text x="300" y="185" font-family="Arial" font-size="26" font-weight="bold" fill="#ffffff" text-anchor="middle">${titulo}</text>
    </svg>`;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

// =================================================
// 5. GUARDAR NUEVO PRODUCTO EN POSTGRESQL (POST)
// =================================================
$('form-nuevo-juego').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario

    // Recopila los valores escritos por el usuario incluyendo la contraseña
    const datos = {
        nombre: $('input-nombre').value,
        categoria_id: $('select-categoria-form').value,
        precio: $('input-precio').value,
        imagen_url: $('input-imagen').value,
        descripcion: $('input-descripcion').value,
        password: $('input-password-agregar').value
    };

    try {
        // Envía los datos en formato JSON al servidor backend
        const res = await fetch(API.productos, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const data = await res.json();

        // Si el servidor rechaza la petición (ej. contraseña incorrecta), muestra el aviso
        if (!res.ok) {
            $('alerta-formulario').innerHTML = `<div class="alert alert-danger py-2 mb-0">${data.error}</div>`;
            return;
        }

        // Muestra alerta verde, limpia el formulario y recarga el catálogo
        $('alerta-formulario').innerHTML = `<div class="alert alert-success py-2 mb-0">¡Videojuego guardado en PostgreSQL!</div>`;
        e.target.reset();
        await cargarProductos();

        // Borra la alerta verde después de 3 segundos
        setTimeout(() => $('alerta-formulario').innerHTML = '', 3000);
    } catch {
        $('alerta-formulario').innerHTML = `<div class="alert alert-danger py-2 mb-0">Error al guardar en el servidor.</div>`;
    }
});

// ==================================================
// 6. ELIMINAR PRODUCTO DE POSTGRESQL CON CONTRASEÑA
// ==================================================
$('form-eliminar-juego').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = $('select-eliminar-producto').value;
    const password = $('input-password-eliminar').value;

    if (!id || !password) return;

    try {
        // Envía la petición DELETE junto con la contraseña en el cuerpo (body)
        const res = await fetch(`${API.productos}/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        const data = await res.json();

        // Si el servidor responde error (ej. 401 contraseña incorrecta), muestra el mensaje
        if (!res.ok) {
            $('alerta-eliminar').innerHTML = `<div class="alert alert-danger py-2 mb-0">${data.error}</div>`;
            return;
        }

        // Si la clave fue correcta, limpia el formulario y recarga el catálogo
        $('alerta-eliminar').innerHTML = `<div class="alert alert-success py-2 mb-0">Producto eliminado correctamente de PostgreSQL.</div>`;
        e.target.reset();
        await cargarProductos();
        setTimeout(() => $('alerta-eliminar').innerHTML = '', 3000);
    } catch {
        $('alerta-eliminar').innerHTML = `<div class="alert alert-danger py-2 mb-0">Error de conexión con el servidor.</div>`;
    }
});

// ==========================================
// 7. EVENTOS DE FILTRADO Y ARRANQUE INICIAL
// ==========================================

// Filtra automáticamente cada vez que se escribe o se cambia la categoría
$('filtro-nombre').addEventListener('input', filtrarYMostrar);
$('filtro-categoria').addEventListener('change', filtrarYMostrar);

// Botón para vaciar los filtros y mostrar todos los productos nuevamente
$('btn-limpiar').addEventListener('click', () => {
    $('filtro-nombre').value = '';
    $('filtro-categoria').value = 'all';
    filtrarYMostrar();
});

// Ejecuta la carga inicial de categorías y productos apenas termina de cargar el HTML
document.addEventListener('DOMContentLoaded', () => {
    cargarCategorias();
    cargarProductos();
});
