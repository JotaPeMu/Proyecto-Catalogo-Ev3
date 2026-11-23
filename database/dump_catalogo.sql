--
-- PostgreSQL database dump
--

\restrict ZJhFtNnFMWE56ujQLuANJrcOlaXd2MECdYFAaPe3nAzaPWVGti5iImba4afbnlM

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-11-23 12:03:18

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 16389)
-- Name: categorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorias (
    categoria_id integer NOT NULL,
    nombre character varying(80) NOT NULL
);


ALTER TABLE public.categorias OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16394)
-- Name: categorias_categoria_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categorias_categoria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categorias_categoria_id_seq OWNER TO postgres;

--
-- TOC entry 5024 (class 0 OID 0)
-- Dependencies: 220
-- Name: categorias_categoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categorias_categoria_id_seq OWNED BY public.categorias.categoria_id;


--
-- TOC entry 221 (class 1259 OID 16395)
-- Name: productos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productos (
    producto_id integer NOT NULL,
    nombre character varying(120) NOT NULL,
    descripcion text,
    precio numeric(10,2) NOT NULL,
    imagen_url text,
    categoria_id integer NOT NULL
);


ALTER TABLE public.productos OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16404)
-- Name: productos_producto_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.productos_producto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.productos_producto_id_seq OWNER TO postgres;

--
-- TOC entry 5025 (class 0 OID 0)
-- Dependencies: 222
-- Name: productos_producto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.productos_producto_id_seq OWNED BY public.productos.producto_id;


--
-- TOC entry 4861 (class 2604 OID 16405)
-- Name: categorias categoria_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias ALTER COLUMN categoria_id SET DEFAULT nextval('public.categorias_categoria_id_seq'::regclass);


--
-- TOC entry 4862 (class 2604 OID 16406)
-- Name: productos producto_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos ALTER COLUMN producto_id SET DEFAULT nextval('public.productos_producto_id_seq'::regclass);


--
-- TOC entry 5015 (class 0 OID 16389)
-- Dependencies: 219
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.categorias VALUES (1, 'Shooter');
INSERT INTO public.categorias VALUES (2, 'MMORPG');
INSERT INTO public.categorias VALUES (3, 'Strategy');
INSERT INTO public.categorias VALUES (4, 'Anime');
INSERT INTO public.categorias VALUES (5, 'Sports');
INSERT INTO public.categorias VALUES (6, 'Consolas');
INSERT INTO public.categorias VALUES (7, 'Periféricos Gamer');
INSERT INTO public.categorias VALUES (8, 'Suscripciones y Gift Cards');


--
-- TOC entry 5017 (class 0 OID 16395)
-- Dependencies: 221
-- Data for Name: productos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.productos VALUES (1, 'Overwatch 2', 'Shooter táctico por equipos basado en héroes.', 29990.00, 'assets/img/overwatch2.jpg', 1);
INSERT INTO public.productos VALUES (2, 'PUBG: BATTLEGROUNDS', 'Battle royale de supervivencia en mapas abiertos.', 19990.00, 'assets/img/pubg.jpg', 1);
INSERT INTO public.productos VALUES (3, 'Throne And Liberty', 'MMORPG multiplataforma de fantasía épica.', 39990.00, 'assets/img/throne_liberty.jpg', 2);
INSERT INTO public.productos VALUES (4, 'Neverwinter', 'MMORPG de acción 3D basado en Dungeons & Dragons.', 18990.00, 'assets/img/neverwinter.jpg', 2);
INSERT INTO public.productos VALUES (5, 'Elvenar', 'Juego de estrategia y construcción de ciudades.', 9990.00, 'assets/img/elvenar.jpg', 3);
INSERT INTO public.productos VALUES (6, 'Game Of Thrones Winter Is Coming', 'Estrategia en tiempo real ambientada en Westeros.', 14990.00, 'assets/img/got.jpg', 3);
INSERT INTO public.productos VALUES (7, 'Neverness to Everness', 'Acción estilo anime con exploración urbana.', 15990.00, 'assets/img/neverness.jpg', 4);
INSERT INTO public.productos VALUES (8, 'Brawlhalla', 'Combates de plataformas 2D multijugador.', 11990.00, 'assets/img/brawlhalla.jpg', 5);
INSERT INTO public.productos VALUES (9, 'Genshin Impact', 'RPG de acción en mundo abierto con estética anime.', 34990.00, 'assets/img/genshin.jpg', 4);
INSERT INTO public.productos VALUES (10, 'Rocket League', 'Fútbol arcade de alta velocidad con vehículos.', 17990.00, 'assets/img/rocket_league.jpg', 5);
INSERT INTO public.productos VALUES (11, 'World of Tanks', 'Combate táctico multijugador de vehículos blindados.', 24990.00, 'assets/img/world_of_tanks.jpg', 3);
INSERT INTO public.productos VALUES (12, 'Pes 6', 'Simula partidos de fútbol con tus equipos y jugadores favoritos con el recién introducido Modo Desafío Internacional.', 10000.00, 'assets/img/pes-6.jpg', 5);
INSERT INTO public.productos VALUES (13, 'PlayStation 5 Slim 1TB', 'Consola de última generación con unidad de disco y control DualSense.', 549990.00, 'assets/img/ps5-slim.jpg', 6);
INSERT INTO public.productos VALUES (14, 'Teclado Mecánico RGB 60%', 'Switches mecánicos táctiles, retroiluminación personalizable y cable trenzado.', 49990.00, 'assets/img/teclado-rgb.jpg', 7);
INSERT INTO public.productos VALUES (15, 'Control Inalámbrico Xbox Carbon Black', 'Mando ergonómico compatible con Xbox Series, PC y dispositivos móviles.', 59990.00, 'assets/img/control-xbox.jpg', 7);
INSERT INTO public.productos VALUES (16, 'Xbox Game Pass Ultimate 3 Meses', 'Acceso ilimitado a cientos de videojuegos en consola, PC y nube.', 29990.00, 'assets/img/game-pass-3m.jpg', 8);
INSERT INTO public.productos VALUES (17, 'Xbox Series X 1TB', 'Consola de alto rendimiento con resolución 4K nativa, 120 FPS y unidad de disco.', 529990.00, 'assets/img/xbox-series-x.jpg', 6);
INSERT INTO public.productos VALUES (18, 'Nintendo Switch Modelo OLED', 'Pantalla OLED vibrante de 7 pulgadas, soporte ancho ajustable y 64 GB de almacenamiento.', 349990.00, 'assets/img/nintendo-switch-oled.jpg', 6);
INSERT INTO public.productos VALUES (19, 'Valve Steam Deck OLED 512GB', 'Consola portátil para jugar tu biblioteca de PC en cualquier lugar con pantalla HDR.', 649990.00, 'assets/img/steam-deck-oled.jpg', 6);
INSERT INTO public.productos VALUES (20, 'Mouse Gamer Logitech G502 HERO', 'Sensor óptico de 25.600 DPI, 11 botones programables y sistema de pesas ajustables.', 44990.00, 'assets/img/mouse-logitech-g502.jpg', 7);
INSERT INTO public.productos VALUES (21, 'Audífonos HyperX Cloud II', 'Sonido envolvente virtual 7.1, almohadillas de espuma viscoelástica y micrófono desmontable.', 69990.00, 'assets/img/audifonos-hyperx.jpg', 7);
INSERT INTO public.productos VALUES (22, 'Monitor Gamer Curvo 24" 144Hz', 'Panel Full HD de 1ms de respuesta y tasa de refresco de 144Hz para juegos competitivos.', 149990.00, 'assets/img/monitor-gamer-144hz.jpg', 7);
INSERT INTO public.productos VALUES (23, 'PlayStation Plus Extra 12 Meses', 'Acceso al catálogo de cientos de juegos de PS4 y PS5, multijugador online y descuentos exclusivos.', 79990.00, 'assets/img/ps-plus-extra.jpg', 8);
INSERT INTO public.productos VALUES (24, 'Tarjeta de Regalo Steam $20.000 CLP', 'Saldo digital instantáneo para comprar videojuegos, DLC y software en la tienda de Steam.', 20000.00, 'assets/img/steam-giftcard-20.jpg', 8);
INSERT INTO public.productos VALUES (25, 'Nintendo Switch Online 12 Meses', 'Juego en línea, guardado de datos en la nube y catálogo clásico de NES, SNES y Game Boy.', 19990.00, 'assets/img/nintendo-online-12m.jpg', 8);
INSERT INTO public.productos VALUES (26, 'Suscripción EA Play 12 Meses (PC / Consola)', 'Acceso ilimitado a títulos de EA Sports FC, Battlefield, Need for Speed y pruebas anticipadas.', 29990.00, 'assets/img/ea-play-12m.jpg', 8);
INSERT INTO public.productos VALUES (27, 'Gift Card Riot Games 4280 RP / VP', 'Código digital canjeable por Riot Points o Valorant Points para aspectos y pases de batalla.', 32990.00, 'assets/img/riot-points-giftcard.jpg', 8);


--
-- TOC entry 5026 (class 0 OID 0)
-- Dependencies: 220
-- Name: categorias_categoria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorias_categoria_id_seq', 8, true);


--
-- TOC entry 5027 (class 0 OID 0)
-- Dependencies: 222
-- Name: productos_producto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.productos_producto_id_seq', 28, true);


--
-- TOC entry 4864 (class 2606 OID 16408)
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (categoria_id);


--
-- TOC entry 4866 (class 2606 OID 16410)
-- Name: productos productos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_pkey PRIMARY KEY (producto_id);


--
-- TOC entry 4867 (class 2606 OID 16411)
-- Name: productos fk_categoria; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT fk_categoria FOREIGN KEY (categoria_id) REFERENCES public.categorias(categoria_id);


-- Completed on 2026-11-23 12:03:18

--
-- PostgreSQL database dump complete
--

\unrestrict ZJhFtNnFMWE56ujQLuANJrcOlaXd2MECdYFAaPe3nAzaPWVGti5iImba4afbnlM

