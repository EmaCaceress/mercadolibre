import express from "express";
import cors from "cors";
import helmet from "helmet";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(helmet());
app.use(express.json());

// CORS: permití tu localhost y luego el dominio de Vercel
const allowed = [
  "http://localhost:5173",
  process.env.FRONT_ORIGIN // ej: https://tu-app.vercel.app
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowed.includes(origin)) return cb(null, true);
    return cb(new Error("CORS blocked"));
  }
}));

// ---------------------------------------------------
// Config
// ---------------------------------------------------
const PORT = process.env.PORT || 3000;
const BASE = "https://dummyjson.com";
const DEFAULT_USD_ARS = Number(process.env.USD_ARS || 1300);

// Si en algún momento querés usar LibreTranslate (ya tenés las envs)
const LT_URL = process.env.LIBRETRANSLATE_URL || "https://libretranslate.de/translate";
const LT_TIMEOUT_MS = Number(process.env.LT_TIMEOUT_MS || 8000);

// Cache simple en memoria para traducciones repetidas
const tCache = new Map();

// ---------------------------------------------------
// Helpers generales
// ---------------------------------------------------
function convertPriceUSD(priceUSD, _currency, rate) {
  // Por ahora forzamos salida en ARS usando la tasa
  const value = priceUSD * rate;
  return { value, currency: "ARS" };
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

// Envío random (texto)
const envioOptions = ["Envio gratis", "Llega gratis mañana", "Llega gratis hoy"];
function getRandomEnvioText() {
  const i = Math.floor(Math.random() * envioOptions.length);
  return envioOptions[i];
}

// Normalizador para comparar sin acentos/mayúsculas
const norm = (s = "") =>
  String(s).toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").trim();

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
// 🔧 Build Item (UNIFICADO)
// ---------------------------------------------------
// Recibe un product de dummyjson y devuelve tu estructura final
function buildItem(p, { currency, rate }) {
  const priceConv = convertPriceUSD(p.price, currency, rate);

  // randoms coherentes
  const cuotasNum = Math.round(Math.random() * 12); // 0..12
  const envioOn = Math.round(Math.random()) === 1;  // true/false
  const hayDescuento = Math.round(Math.random()) === 0; // 50/50
  const international = Math.round(Math.random()) === 1; // true/false
  // Envío (si envioOn true, definimos objeto; si no, null)
  const envio = envioOn 
    ? {
        time: getRandomEnvioText(),
        // Antes esta lógica siempre terminaba en 1; ahora sí puede ser 1 o null
        full: Math.round(Math.random()) === 1 ? 1 : null,
      }
    : null;

  // Cuotas: mismas condiciones que tenías (divisible por 3, sin envío y > 0)
  const cuotas = cuotasNum % 3 === 0 && !envioOn && cuotasNum !== 0
    ? `Cuota promocionada en ${cuotasNum} cuotas de $${Math.round(
        priceConv.value / cuotasNum
      )}`
    : null;

  // Descuento: si “hayDescuento”, calculamos oldPrice y string de descuento
  const oldPrice = hayDescuento
    ? Math.round((priceConv.value * p.discountPercentage) / 100 + priceConv.value)
    : null;

  const discount = hayDescuento && p.discountPercentage
    ? `${Math.round(p.discountPercentage)}% OFF`
    : null;
  
  const promoCuota = !hayDescuento
    ? (() => {
      const price = priceConv.value * p.discountPercentage / 100 + priceConv.value;
      return { price, cuota: price / 3 };
    })()
    : null;

  return {
    id: p.id,
    titleSecond: p.title,
    description: p.description,
    oldPrice,
    price: Math.round(priceConv.value),
    discount,
    image: p.thumbnail,
    envio,
    cuotas,
    promoCuota: promoCuota,
    currency: "ARS",
    rating: p.rating,
    rewiews: p.reviews, // (mantengo tu key 'rewiews')
    stock: p.stock,
    brand: p.brand,
    category: categoryMap[p.category] || p.category,
    images: p.images,
    international,
  };
}

// Mapea una lista de productos usando el buildItem unificado
function itemsReturn(products = [], currency, rate) {
  return products.map((p) => buildItem(p, { currency, rate }));
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

// Listado
app.get("/products", async (req, res) => {
  const limit = Number(req.query.limit ?? 200);
  const skip = Number(req.query.skip ?? 0);
  const currency = (req.query.currency || "").toUpperCase();
  const rate = Number(req.query.rate || DEFAULT_USD_ARS);

  try {
    const { data } = await axios.get(`${BASE}/products`, { params: { limit, skip } });

    // ✅ ahora usamos el buildItem (vía itemsReturn)
    const items = itemsReturn(data.products, currency, rate);

    res.json({ total: data.total, limit: data.limit, skip: data.skip, items });
  } catch (e) {
    console.error(e?.message || e);
    res.status(500).json({ error: "No se pudieron obtener productos" });
  }
});

// Detalle
app.get("/products/:id", async (req, res) => {
  const currency = (req.query.currency || "").toUpperCase();
  const rate = Number(req.query.rate || DEFAULT_USD_ARS);

  try {
    const { data: p } = await axios.get(`${BASE}/products/${req.params.id}`);

    // ✅ reutilizamos la misma forma de construir el item
    const item = buildItem(p, { currency, rate });

    res.json(item);
  } catch (e) {
    const status = e.response?.status || 500;
    console.error(e?.message || e);
    res.status(status).json({ error: "No se encontró el producto" });
  }
});

// Búsqueda
app.get("/search", async (req, res) => {
  const q = req.query.q || "";
  const limit = Number(req.query.limit ?? 200);
  const skip = Number(req.query.skip ?? 0);
  const currency = (req.query.currency || "").toUpperCase();
  const rate = Number(req.query.rate || DEFAULT_USD_ARS);

  console.log(
    `Buscando: ${q}, limit=${limit}, skip=${skip}, currency=${currency}, rate=${rate}`
  );

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
      // 2) Si no hubo resultados, traemos un batch y filtramos por brand
      const all = await axios.get(`${BASE}/products`, { params: { limit: 200, skip: 0 } });

      const qn = norm(q);
      const list = all.data?.products ?? [];

      // Robusto ante productos sin brand
      const filtered = list.filter((p) => norm(p.brand).includes(qn));

      total = filtered.length;
      products = filtered.slice(skip, skip + limit);

      console.log(`Encontrados ${total} productos para "${q}" (por brand)`);
    }

    // 3) Map uniforme a tu formato
    const items = itemsReturn(products, currency, rate);
    return res.json({ total, limit, skip, items });
  } catch (e) {
    console.error(e?.message || e);
    return res.status(500).json({ error: "No se pudieron buscar productos" });
  }
});

// ---------------------------------------------------
// Start
// ---------------------------------------------------
app.listen(PORT, () => console.log(`http://localhost:${PORT} listo ✅`));