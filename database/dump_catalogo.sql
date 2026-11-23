-- =========================================================
-- RESPALDO DE BASE DE DATOS RELACIONAL (dump_catalogo.sql)
-- Proyecto: Play The Game Store — Catálogo Digital Gamer
-- Motor: PostgreSQL 18.6 | Autor: José Muñoz León
-- =========================================================

\restrict ctk3Dq1yUtZhmiihxyDxvqMSlFI7ctStTWh8Jk9YX8pzAcepELmCZkdOUk5aEsD

-- ======================================================
-- 1. CONFIGURACIÓN INICIAL DE LA SESIÓN DE RESTAURACIÓN
-- ======================================================
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';              -- Codificación UTF-8 para soportar tildes y caracteres en español
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';
SET default_table_access_method = heap;

-- =================================================================
-- 2. CREACIÓN DE TABLA 'categorias' Y SU SECUENCIA AUTOINCREMENTAL
-- =================================================================
CREATE TABLE public.categorias (
    categoria_id integer NOT NULL,         -- Identificador único de la categoría (Llave Primaria)
    nombre character varying(80) NOT NULL  -- Nombre descriptivo del rubro (ej. Shooter, Consolas)
);

ALTER TABLE public.categorias OWNER TO postgres;

-- Secuencia automática para generar IDs correlativos en 'categorias' (1, 2, 3...)
CREATE SEQUENCE public.categorias_categoria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.categorias_categoria_id_seq OWNER TO postgres;
ALTER SEQUENCE public.categorias_categoria_id_seq OWNED BY public.categorias.categoria_id;

-- ================================================================
-- 3. CREACIÓN DE TABLA 'productos' Y SU SECUENCIA AUTOINCREMENTAL
-- ================================================================
CREATE TABLE public.productos (
    producto_id integer NOT NULL,          -- Identificador único del producto (Llave Primaria)
    nombre character varying(120) NOT NULL,-- Título del videojuego, consola o periférico
    descripcion text,                      -- Reseña o características técnicas del producto
    precio numeric(10,2) NOT NULL,         -- Precio en pesos chilenos (CLP) con 2 decimales
    imagen_url text,                       -- Ruta local (assets/img/...) o URL externa de la carátula
    categoria_id integer NOT NULL          -- Llave Foránea que vincula el producto con su categoría
);

ALTER TABLE public.productos OWNER TO postgres;

-- Secuencia automática para generar IDs correlativos en 'productos'
CREATE SEQUENCE public.productos_producto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.productos_producto_id_seq OWNER TO postgres;
ALTER SEQUENCE public.productos_producto_id_seq OWNED BY public.productos.producto_id;

-- =====================================================================
-- 4. ASIGNACIÓN DE VALORES POR DEFECTO (AUTOINCREMENTO EN COLUMNAS ID)
-- =====================================================================
ALTER TABLE ONLY public.categorias ALTER COLUMN categoria_id SET DEFAULT nextval('public.categorias_categoria_id_seq'::regclass);
ALTER TABLE ONLY public.productos ALTER COLUMN producto_id SET DEFAULT nextval('public.productos_producto_id_seq'::regclass);

-- ===============================================================
-- 5. INSERCIÓN DE DATOS INICIALES: 8 CATEGORÍAS DEL CATÁLOGO
-- (No modificar los espacios/tabuladores dentro del bloque COPY)
-- ===============================================================
COPY public.categorias (categoria_id, nombre) FROM stdin;
1	Shooter
2	MMORPG
3	Strategy
4	Anime
5	Sports
6	Consolas
7	Periféricos Gamer
8	Suscripciones y Gift Cards
\.

-- ===============================================================
-- 6. INSERCIÓN DE DATOS INICIALES: 28 PRODUCTOS REGISTRADOS
-- (No modificar los espacios/tabuladores dentro del bloque COPY)
-- ===============================================================
COPY public.productos (producto_id, nombre, descripcion, precio, imagen_url, categoria_id) FROM stdin;
1	Overwatch 2	Shooter táctico por equipos basado en héroes.	29990.00	assets/img/overwatch2.jpg	1
2	PUBG: BATTLEGROUNDS	Battle royale de supervivencia en mapas abiertos.	19990.00	assets/img/pubg.jpg	1
3	Throne And Liberty	MMORPG multiplataforma de fantasía épica.	39990.00	assets/img/throne_liberty.jpg	2
4	Neverwinter	MMORPG de acción 3D basado en Dungeons & Dragons.	18990.00	assets/img/neverwinter.jpg	2
5	Elvenar	Juego de estrategia y construcción de ciudades.	9990.00	assets/img/elvenar.jpg	3
6	Game Of Thrones Winter Is Coming	Estrategia en tiempo real ambientada en Westeros.	14990.00	assets/img/got.jpg	3
7	Neverness to Everness	Acción estilo anime con exploración urbana.	15990.00	assets/img/neverness.jpg	4
8	Brawlhalla	Combates de plataformas 2D multijugador.	11990.00	assets/img/brawlhalla.jpg	5
9	Valorant	Shooter táctico 5v5 basado en personajes y precisión.	25990.00	assets/img/Valorant.jpg	1
10	Genshin Impact	RPG de acción en mundo abierto con estética anime.	34990.00	assets/img/genshin.jpg	4
11	Rocket League	Fútbol arcade de alta velocidad con vehículos.	17990.00	assets/img/rocket_league.jpg	5
12	World of Tanks	Combate táctico multijugador de vehículos blindados.	24990.00	assets/img/world_of_tanks.jpg	3
13	Pes 6	Simula partidos de fútbol con tus equipos y jugadores favoritos con el recién introducido Modo Desafío Internacional.	10000.00	assets/img/pes-6.jpg	5
14	PlayStation 5 Slim 1TB	Consola de última generación con unidad de disco y control DualSense.	549990.00	assets/img/ps5-slim.jpg	6
15	Teclado Mecánico RGB 60%	Switches mecánicos táctiles, retroiluminación personalizable y cable trenzado.	49990.00	assets/img/teclado-rgb.jpg	7
16	Control Inalámbrico Xbox Carbon Black	Mando ergonómico compatible con Xbox Series, PC y dispositivos móviles.	59990.00	assets/img/control-xbox.jpg	7
17	Xbox Game Pass Ultimate 3 Meses	Acceso ilimitado a cientos de videojuegos en consola, PC y nube.	29990.00	assets/img/game-pass-3m.jpg	8
18	Xbox Series X 1TB	Consola de alto rendimiento con resolución 4K nativa, 120 FPS y unidad de disco.	529990.00	assets/img/xbox-series-x.jpg	6
19	Nintendo Switch Modelo OLED	Pantalla OLED vibrante de 7 pulgadas, soporte ancho ajustable y 64 GB de almacenamiento.	349990.00	assets/img/nintendo-switch-oled.jpg	6
20	Valve Steam Deck OLED 512GB	Consola portátil para jugar tu biblioteca de PC en cualquier lugar con pantalla HDR.	649990.00	assets/img/steam-deck-oled.jpg	6
21	Mouse Gamer Logitech G502 HERO	Sensor óptico de 25.600 DPI, 11 botones programables y sistema de pesas ajustables.	44990.00	assets/img/mouse-logitech-g502.jpg	7
22	Audífonos HyperX Cloud II	Sonido envolvente virtual 7.1, almohadillas de espuma viscoelástica y micrófono desmontable.	69990.00	assets/img/audifonos-hyperx.jpg	7
23	Monitor Gamer Curvo 24" 144Hz	Panel Full HD de 1ms de respuesta y tasa de refresco de 144Hz para juegos competitivos.	149990.00	assets/img/monitor-gamer-144hz.jpg	7
24	PlayStation Plus Extra 12 Meses	Acceso al catálogo de cientos de juegos de PS4 y PS5, multijugador online y descuentos exclusivos.	79990.00	assets/img/ps-plus-extra.jpg	8
25	Tarjeta de Regalo Steam $20.000 CLP	Saldo digital instantáneo para comprar videojuegos, DLC y software en la tienda de Steam.	20000.00	assets/img/steam-giftcard-20.jpg	8
26	Nintendo Switch Online 12 Meses	Juego en línea, guardado de datos en la nube y catálogo clásico de NES, SNES y Game Boy.	19990.00	assets/img/nintendo-online-12m.jpg	8
27	Suscripción EA Play 12 Meses (PC / Consola)	Acceso ilimitado a títulos de EA Sports FC, Battlefield, Need for Speed y pruebas anticipadas.	29990.00	assets/img/ea-play-12m.jpg	8
28	Gift Card Riot Games 4280 RP / VP	Código digital canjeable por Riot Points o Valorant Points para aspectos y pases de batalla.	32990.00	assets/img/riot-points-giftcard.jpg	8
\.

-- ========================================================================
-- 7. SINCRONIZACIÓN DE SECUENCIAS (CONTADORES DE ID)
-- Ajusta el contador al último ID cargado (8 y 28) para evitar colisiones
-- ========================================================================
SELECT pg_catalog.setval('public.categorias_categoria_id_seq', 8, true);
SELECT pg_catalog.setval('public.productos_producto_id_seq', 28, true);

-- ======================================================================
-- 8. RESTRICCIONES DE INTEGRIDAD: LLAVES PRIMARIAS (PK) Y FORÁNEAS (FK)
-- ======================================================================
-- Llave Primaria de 'categorias'
ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (categoria_id);

-- Llave Primaria de 'productos'
ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_pkey PRIMARY KEY (producto_id);

-- Llave Foránea que relaciona cada producto con una categoría válida
ALTER TABLE ONLY public.productos
    ADD CONSTRAINT fk_categoria FOREIGN KEY (categoria_id) REFERENCES public.categorias(categoria_id);

-- ==================================
-- FIN DEL RESPALDO DE BASE DE DATOS
-- ==================================
\unrestrict ctk3Dq1yUtZhmiihxyDxvqMSlFI7ctStTWh8Jk9YX8pzAcepELmCZkdOUk5aEsD
