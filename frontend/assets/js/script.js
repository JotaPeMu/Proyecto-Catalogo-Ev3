// =======================================================
// CONFIGURACIÓN GLOBAL Y VARIABLES DE ESTADO
// =======================================================

// Endpoints (rutas) de la API REST en nuestro servidor Express
const API = { productos: '/api/productos', categorias: '/api/categorias' };

// Arreglo en memoria que almacena todos los productos traídos de PostgreSQL para filtrar sin recargar
let productos = [];

// Función auxiliar (atajo) para obtener elementos del DOM por su atributo 'id' sin repetir document.getElementById
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

        // Llena el selector del formulario (usa la categoria_id para guardar la llave foránea en la BD)
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

        // Actualiza también el menú desplegable de "Eliminar Producto" con los registros vigentes
        $('select-eliminar-producto').innerHTML = '<option value="">Selecciona un producto...</option>' +
            productos.map(p => `<option value="${p.producto_id}">ID #${p.producto_id} — ${p.nombre}</option>`).join('');

        // Renderiza las tarjetas en la galería aplicando los filtros activos
        filtrarYMostrar();
    } catch {
        // Si el servidor Node está apagado o falla la conexión a PostgreSQL, muestra una alerta roja
        $('estado-carga').innerHTML = `<div class="alert alert-danger">Error de conexión con el servidor (localhost:3000).</div>`;
    }
}

// =============================================
// 3. FILTRAR EN MEMORIA Y DIBUJAR LAS TARJETAS
// =============================================
function filtrarYMostrar() {
    // Captura el texto escrito en el buscador (en minúsculas) y la categoría elegida
    const texto = $('filtro-nombre').value.trim().toLowerCase();
    const cat = $('filtro-categoria').value;

    // Filtra el arreglo en memoria buscando coincidencias parciales de nombre y categoría exacta
    const filtrados = productos.filter(j =>
        j.nombre.toLowerCase().includes(texto) && (cat === 'all' || j.categoria === cat)
    );

    // Ordena una copia de los resultados según la opción elegida
    const orden = $('orden-productos').value;
    if (orden === 'precio-asc') filtrados.sort((a, b) => Number(a.precio) - Number(b.precio));
    if (orden === 'precio-desc') filtrados.sort((a, b) => Number(b.precio) - Number(a.precio));
    if (orden === 'nombre-asc') filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));

    // Actualiza la insignia con la cantidad de resultados encontrados
    $('contador-resultados').textContent = `${filtrados.length} resultado(s)`;

    // Si no hay coincidencias, muestra un mensaje informativo
    if (!filtrados.length) {
        $('galeria-productos').innerHTML = `<p class="col-12 text-center text-secondary my-5 fs-5">No se encontraron productos.</p>`;
        return;
    }

    // Transforma cada producto filtrado en una tarjeta HTML de Bootstrap
    $('galeria-productos').innerHTML = filtrados.map(j => {
        // Formatea el precio en pesos chilenos o muestra "Gratis" si vale 0
        const precio = Number(j.precio) === 0 ? 'Gratis' : `$${Number(j.precio).toLocaleString('es-CL')} CLP`;

        // Genera una imagen de respaldo por si la URL de la foto falla o viene vacía
        const imgRespaldo = crearImagenRespaldo(j.nombre, j.categoria);

        return `
        <article class="col">
            <div class="card h-100 game-card text-white" style="cursor: pointer;" onclick="verDetalle(${j.producto_id})">
                <!-- Imagen del juego con respaldo automático si falla el enlace -->
                <img src="${j.imagen_url}" onerror="this.onerror=null; this.src='${imgRespaldo}';" class="card-img-top" alt="${j.nombre}">
                
                <!-- card-body: envuelve TODO el contenido de texto para dar márgenes internos uniformes -->
                <div class="card-body d-flex flex-column">
                    <!-- Título a ancho completo y descripción -->
                    <h3 class="h6 card-title fw-bold text-info mb-2">${j.nombre}</h3>
                    <p class="card-text small text-light opacity-75 mb-3">${j.descripcion}</p>

                    <!-- Categoría alineada a la derecha justo arriba de la línea divisoria -->
                    <div class="mt-auto text-end mb-2">
                        <span class="badge bg-info text-dark">${j.categoria}</span>
                    </div>
                    
                    <!-- Pie de la tarjeta: Precio e ID -->
                    <div class="pt-2 border-top border-secondary d-flex justify-content-between align-items-center">
                        <span class="fw-bold small">${precio}</span>
                        <small class="text-secondary">ID #${j.producto_id}</small>
                    </div>
                </div>
            </div>
        </article>`;
    }).join('');
}

// =======================================================
// 3.1 ABRIR MODAL CON EL DETALLE COMPLETO DEL PRODUCTO
// =======================================================
function verDetalle(id) {
    // Busca el producto seleccionado dentro del arreglo en memoria
    const juego = productos.find(p => p.producto_id === id);
    if (!juego) return;

    const precio = Number(juego.precio) === 0 ? 'Gratis' : `$${Number(juego.precio).toLocaleString('es-CL')} CLP`;
    const imgRespaldo = crearImagenRespaldo(juego.nombre, juego.categoria);

    // Rellena los elementos del modal con los datos del producto
    $('modalTitulo').textContent = juego.nombre;
    $('modalCategoria').textContent = juego.categoria;
    $('modalId').textContent = `ID #${juego.producto_id}`;
    $('modalDescripcion').textContent = juego.descripcion;
    $('modalPrecio').textContent = precio;

    const img = $('modalImagen');
    img.src = juego.imagen_url;
    img.alt = juego.nombre;
    img.onerror = () => { img.onerror = null; img.src = imgRespaldo; };

    // Abre la ventana emergente usando la API JavaScript de Bootstrap 5
    const modal = new bootstrap.Modal($('modalDetalleProducto'));
    modal.show();
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

// ==============================================================
// 5. GUARDAR NUEVO PRODUCTO EN POSTGRESQL CON CONTRASEÑA (POST)
// ==============================================================
$('form-nuevo-juego').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario

    // Recopila los valores escritos por el usuario incluyendo la contraseña de administrador
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

        // Si el backend devuelve error (ej. contraseña inválida o datos incompletos), muestra una alerta roja
        if (!res.ok) {
            $('alerta-formulario').innerHTML = `<div class="alert alert-danger py-2 mb-0">${data.error}</div>`;
            setTimeout(() => $('alerta-formulario').innerHTML = '', 3000); // Desaparece tras 3 segundos
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
        setTimeout(() => $('alerta-formulario').innerHTML = '', 3000); // Desaparece tras 3 segundos
    }
});

// ==================================================
// 6. ELIMINAR PRODUCTO DE POSTGRESQL CON CONTRASEÑA
// ==================================================
$('form-eliminar-juego').addEventListener('submit', async (e) => {
    e.preventDefault();  // Evita que el formulario recargue la página al enviarse

    // Captura el ID del producto seleccionado y la contraseña ingresada
    const id = $('select-eliminar-producto').value;
    const password = $('input-password-eliminar').value;

    // Detiene la ejecución si falta alguno de los dos datos obligatorios
    if (!id || !password) return;

    try {
        // Envía una petición DELETE al endpoint específico del producto (/api/productos/:id)
        const res = await fetch(`${API.productos}/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        const data = await res.json();

        // Si el backend rechaza la operación (ej. 401 contraseña incorrecta), muestra una alerta roja
        if (!res.ok) {
            $('alerta-eliminar').innerHTML = `<div class="alert alert-danger py-2 mb-0">${data.error}</div>`;
            setTimeout(() => $('alerta-eliminar').innerHTML = '', 3000); // Desaparece tras 3 segundos
            return;
        }

        // Si la clave fue correcta, muestra una alerta verde, vacía los campos y actualiza el catálogo desde PostgreSQL
        $('alerta-eliminar').innerHTML = `<div class="alert alert-success py-2 mb-0">Producto eliminado correctamente de PostgreSQL.</div>`;
        e.target.reset();
        await cargarProductos();
        // Oculta la notificación de éxito automáticamente tras 3 segundos (3000 ms)
        setTimeout(() => $('alerta-eliminar').innerHTML = '', 3000);
    } catch {
        // Si falla la red o el servidor Express no responde, muestra una alerta de error de conexión
        $('alerta-eliminar').innerHTML = `<div class="alert alert-danger py-2 mb-0">Error de conexión con el servidor.</div>`;
        setTimeout(() => $('alerta-eliminar').innerHTML = '', 3000); // Desaparece tras 3 segundos
    }

});

// ==========================================
// 7. EVENTOS DE FILTRADO Y ARRANQUE INICIAL
// ==========================================

// Ejecuta filtrarYMostrar() en tiempo real cada vez que el usuario escribe o cambia la categoría
$('filtro-nombre').addEventListener('input', filtrarYMostrar);
$('filtro-categoria').addEventListener('change', filtrarYMostrar);
$('orden-productos').addEventListener('change', filtrarYMostrar);


// Botón para restablecer los controles de búsqueda y vuelve a mostrar todos los productos registrados
$('btn-limpiar').addEventListener('click', () => {
    $('filtro-nombre').value = '';
    $('filtro-categoria').value = 'all';
    $('orden-productos').value = 'recientes';
    filtrarYMostrar();
});

// Ejecuta la carga inicial de categorías y productos apenas termina de cargar el HTML
document.addEventListener('DOMContentLoaded', () => {
    cargarCategorias();
    cargarProductos();
});
