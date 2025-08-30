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
  "Llega gratis hoy",
  null 
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
  const limit = Number(req.query.limit ?? 12);
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

      items.push({
        id: p.id,
        titleSecond: p.title, 
        oldPrice: (Math.round(((priceConv.value * p.discountPercentage)/100) + priceConv.value)), 
        price: priceConv.value,
        discount: Math.round(Math.random()) == 0 && p.discountPercentage ? `${Math.round(p.discountPercentage)}% OFF` : null,
        image: p.thumbnail,
        envio: envio ? {
          time: envio == 0 && getRandomEnvio(), 
          full: envio == 0 && Math.round(Math.random()) == 0 ? null : 1
        } : null,
        cuotas: cuota % 3 === 0  ? `Cuota promocionada en ${cuota} cuotas de $${Math.round(priceConv.value/cuota)}` : null,
        currency: "ARS",
        rating: p.rating,
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
    const priceFormatted =
      priceConv.currency === "ARS" ? formatCurrency(priceConv.value, "ARS") : `$${p.price}`;


    res.json({
      id: p.id,
      titleSecond: p.title, // Cambié 'title' por 'titleSecond'
      oldPrice: (Math.round(((priceConv.value * p.discountPercentage)/100) + priceConv.value)), // Si no existe 'oldPrice', le asigno null
      price: priceConv.value,
      discount: p.discountPercentage ? `${Math.round(p.discountPercentage)}% OFF` : null, // Formato de descuento
      image: p.thumbnail, // 'thumbnail' lo cambié por 'image'
      envio: p.shipping ? p.shipping.free_shipping ? "Llega gratis hoy" : "Llega gratis mañana" : null, // Ejemplo de asignación, si tienes un campo de 'envio' o algo similar
      cuotas: p.installments ? `Cuota promocionada en ${p.installments.quantity} cuotas de $${p.installments.amount}` : null, // Asignación para cuotas, si aplica
      currency: "ARS", // O cualquier otra moneda que manejes
      rating: p.rating, // Si tienes rating
      stock: p.stock, // Si tienes stock
      brand: p.brand, // Si tienes la marca
      category: categoryMap[p.category] || p.category, // Asignación de categoría
      images: p.images, // Si tienes más imágenes
    });
  } catch (e) {
    const status = e.response?.status || 500;
    console.error(e?.message || e);
    res.status(status).json({ error: "No se encontró el producto" });
  }
});

// ---------------------------------------------------
// Start
// ---------------------------------------------------
app.listen(PORT, () => console.log(`http://localhost:${PORT} listo ✅`));
