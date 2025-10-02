// index.js — versión completa con fixes (dotenv, traducción robusta, cache y secuencial)
// Ejecuta: node index.js
// Requisitos: Node 18+ (tiene fetch global). Si usás Node 16/14, instalá node-fetch y descomentá abajo.

const dotenv = require("dotenv");
const express = require("express");
const axios = require("axios");
const cors = require("cors");

dotenv.config();

// Si tu Node es < 18, descomenta esto y ejecutá: npm i node-fetch
// const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

const app = express();
app.use(cors());
app.use(express.json());

// ---------------------------------------------------
// Config
// ---------------------------------------------------
const PORT = process.env.PORT || 3000;
const BASE = "https://dummyjson.com";
const DEFAULT_USD_ARS = Number(process.env.USD_ARS || 1300);

const LT_URL = process.env.LIBRETRANSLATE_URL || "https://libretranslate.de/translate";
const LT_TIMEOUT_MS = Number(process.env.LT_TIMEOUT_MS || 8000);

// Cache simple en memoria para traducciones repetidas
const tCache = new Map();

// ---------------------------------------------------
// Helpers de precio
// ---------------------------------------------------

function convertPriceUSD(priceUSD, _currency, rate) {
  // Hoy forzamos salida en ARS, multiplicando por la tasa
  const value = priceUSD * rate;
  return {value, currency: "ARS" };
}

function formatCurrency(value, currency) {
  try {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: currency || "ARS",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return value; // fallback si Intl falla
  }
}

// ---------------------------------------------------
// Envio random
// ---------------------------------------------------
const envioOptions = [
  "Envio gratis",
  "Llega gratis mañana",
  "Llega gratis hoy"
];

function getRandomEnvio() {
  const randomIndex = Math.floor(Math.random() * envioOptions.length);
  return envioOptions[randomIndex];
}

// ---------------------------------------------------
// Mapa de categorías
// ---------------------------------------------------
const categoryMap = {
  smartphones: "celulares",
  laptops: "notebooks",
  fragrances: "fragancias",
  skincare: "cuidado de la piel",
  groceries: "almacén",
  "home-decoration": "decoración del hogar",
  furniture: "muebles",
  "mens-shirts": "camisas hombre",
  "mens-shoes": "calzado hombre",
  "mens-watches": "relojes hombre",
  "womens-dresses": "vestidos mujer",
  "womens-shoes": "calzado mujer",
  "womens-watches": "relojes mujer",
  "womens-bags": "bolsos mujer",
  "womens-jewellery": "joyería mujer",
  sunglasses: "gafas de sol",
  automotive: "automotor",
  motorcycle: "motos",
  lighting: "iluminación",
};

function itemsReturn (data, currency, rate) {

  const items = data.map(p => {
    const priceConv = convertPriceUSD(p.price, currency, rate);
    const cuota = Math.round(Math.random() * 12) ;
    const envio = Math.round(Math.random());
    const descuento = Math.round(Math.random());
    return {
      id: p.id,
      titleSecond: p.title,
      description: p.description,
      oldPrice: descuento == 0 ? (Math.round(((priceConv.value * p.discountPercentage)/100) + priceConv.value)) : null, 
      price: Math.round(priceConv.value),
      discount: descuento == 0 && p.discountPercentage ? `${Math.round(p.discountPercentage)}% OFF` : null,
      image: p.thumbnail,
      envio: envio == 1 ? {
        time: getRandomEnvio(), 
        full: envio == 0 && Math.round(Math.random()) == 0 ? null : 1
      } : null,
      cuotas: cuota % 3 === 0  && !envio && cuota !== 0 ? `Cuota promocionada en ${cuota} cuotas de $${Math.round(priceConv.value/cuota)}` : null,
      promoCuota: 100000,
      currency: "ARS",
      rating: p.rating,
      rewiews:p.reviews,
      stock: p.stock, 
      brand: p.brand, 
      category: categoryMap[p.category] || p.category,
      images: p.images, 
    };
  });
  return items;
}
// ---------------------------------------------------
// Rutas
// ---------------------------------------------------
app.get("/", (_req, res) => {
  res.send(`
    <html>
      <head><title>Mi página</title></head>
      <body>
        <h1>Hola desde Express 🚀</h1>
        <button onclick="window.location.href='/'"> Login automático </button>
        <button onclick="window.location.href='/products'"> Ir a los productos </button>
      </body>
    </html>
  `);
});

app.get("/products", async (req, res) => {
  const limit = Number(req.query.limit ?? 200);
  const skip = Number(req.query.skip ?? 0);
  const currency = (req.query.currency || "").toUpperCase();
  const rate = Number(req.query.rate || DEFAULT_USD_ARS);

  try {
    const { data } = await axios.get(`${BASE}/products`, { params: { limit, skip } });

    // Secuencial + cache de traducción para evitar rate limit y el error de HTML
    const items = [];
    for (const p of data.products) {
      const priceConv = convertPriceUSD(p.price, currency, rate);
      const cuota = Math.round(Math.random() * 12) ;
      const envio = Math.round(Math.random());
      const descuento = Math.round(Math.random());

      items.push({
        id: p.id,
        titleSecond: p.title, 
        description: p.description,
        oldPrice: descuento == 0 ? (Math.round(((priceConv.value * p.discountPercentage)/100) + priceConv.value)) : null, 
        price: Math.round(priceConv.value),
        discount: descuento == 0 && p.discountPercentage ? `${Math.round(p.discountPercentage)}% OFF` : null,
        image: p.thumbnail,
        envio: envio == 1 ? {
          time: getRandomEnvio(), 
          full: envio == 0 && Math.round(Math.random()) == 0 ? null : 1
        } : null,
        cuotas: cuota % 3 === 0  && !envio && cuota !== 0 ? `Cuota promocionada en ${cuota} cuotas de $${Math.round(priceConv.value/cuota)}` : null,
        currency: "ARS",
        rating: p.rating,
        rewiews:p.reviews,
        stock: p.stock, 
        brand: p.brand, 
        category: categoryMap[p.category] || p.category,
        images: p.images, 
      });
    }

    res.json({ total: data.total, limit: data.limit, skip: data.skip, items });
  } catch (e) {
    console.error(e?.message || e);
    res.status(500).json({ error: "No se pudieron obtener productos" });
  }
});

app.get("/products/:id", async (req, res) => {
  const currency = (req.query.currency || "").toUpperCase();
  const rate = Number(req.query.rate || DEFAULT_USD_ARS);

  try {
    const { data: p } = await axios.get(`${BASE}/products/${req.params.id}`);
    const priceConv = convertPriceUSD(p.price, currency, rate);
    const cuota = Math.round(Math.random() * 12) ;
    const envio = Math.round(Math.random());

    res.json({
      id: p.id,
      titleSecond: p.title, 
      description: p.description,
      oldPrice: (Math.round(((priceConv.value * p.discountPercentage)/100) + priceConv.value)), 
      price: Math.round(priceConv.value),
      discount: Math.round(Math.random()) == 0 && p.discountPercentage ? `${Math.round(p.discountPercentage)}% OFF` : null,
      image: p.thumbnail,
      envio: envio ? {
        time: getRandomEnvio(), 
        full: envio == 0 && Math.round(Math.random()) == 0 ? null : 1
      } : null,
        cuotas: cuota % 3 === 0 && cuota !== 0 ? `Cuota promocionada en ${cuota} cuotas de $${Math.round(priceConv.value/cuota)}` : null,
      currency: "ARS",
      rating: p.rating,
      rewiews:p.reviews,
      stock: p.stock, 
      brand: p.brand, 
      category: categoryMap[p.category] || p.category,
      images: p.images,
      });
  } catch (e) {
    const status = e.response?.status || 500;
    console.error(e?.message || e);
    res.status(status).json({ error: "No se encontró el producto" });
  }
});

// ---------------------------------------------------
// Search
// ---------------------------------------------------
// Normalizador para comparar sin acentos/mayúsculas
const norm = (s = "") =>
  String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();


app.get("/search", async (req, res) => {
  const q = req.query.q || "";
  const limit = Number(req.query.limit ?? 200);
  const skip  = Number(req.query.skip ?? 0);
  const currency = (req.query.currency || "").toUpperCase();
  const rate = Number(req.query.rate || DEFAULT_USD_ARS);

  console.log(`Buscando: ${q}, limit=${limit}, skip=${skip}, currency=${currency}, rate=${rate}`);

  try {
    let products = [];
    let total = 0;

    // 1) Búsqueda nativa de DummyJSON (title/description)
    const s1 = await axios.get(`${BASE}/products/search`, { params: { q, limit, skip } });

    if (s1.data.total > 0 || !q.trim()) {
      products = s1.data.products;
      total = s1.data.total;
      console.log(`Encontrados ${total} productos para "${q}" (texto libre)`);
    } else {
      // Traigo todo y filtro por brand (no uses el mismo limit/skip del query acá)
      const all = await axios.get(`${BASE}/products`, { params: { limit: 200, skip: 0 } });
    
      const qn = norm(q);
      const list = all.data?.products ?? [];
    
      // Filtrado robusto aunque haya productos sin brand
      const filtered = list.filter(p => norm(p.brand).includes(qn));
    
      total = filtered.length;
      products = filtered.slice(skip, skip + limit);
    
      console.log(`Encontrados ${total} productos para "${q}" (por brand)`);
    }    

    // 3) Map a tu formato (ajustá si tenés helpers como convertPriceUSD/formatCurrency)
    const items = itemsReturn(products, currency, rate);
    return res.json({ total, limit, skip, items });
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ error: "No se pudieron buscar productos" });
  }
});


// ---------------------------------------------------
// Start
// ---------------------------------------------------
app.listen(PORT, () => console.log(`http://localhost:${PORT} listo ✅`));
