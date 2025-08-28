// index.js (resumen de cambios)
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 4000;
app.use(cors());
app.use(express.json());

const BASE = "https://dummyjson.com";

// Lee tasa por .env (opcional) o query
const DEFAULT_USD_ARS = Number(process.env.USD_ARS || 1300); // ajustá acá

function convertPriceUSD(priceUSD, currency, rate) {
  if (!currency || currency.toUpperCase() !== "ARS") {
    return { value: priceUSD, currency: "USD" };
  }
  const value = priceUSD * rate;
  return { value, currency: "ARS" };
}

function formatCurrency(value, currency) {
  try {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: currency || "ARS",
      maximumFractionDigits: 0
    }).format(value);
  } catch {
    return value; // fallback
  }
}

// Mapea categorías a español (simple)
const categoryMap = {
  "smartphones": "celulares",
  "laptops": "notebooks",
  "fragrances": "fragancias",
  "skincare": "cuidado de la piel",
  "groceries": "almacén",
  "home-decoration": "decoración del hogar",
  "furniture": "muebles",
  "mens-shirts": "camisas hombre",
  "mens-shoes": "calzado hombre",
  "mens-watches": "relojes hombre",
  "womens-dresses": "vestidos mujer",
  "womens-shoes": "calzado mujer",
  "womens-watches": "relojes mujer",
  "womens-bags": "bolsos mujer",
  "womens-jewellery": "joyería mujer",
  "sunglasses": "gafas de sol",
  "automotive": "automotor",
  "motorcycle": "motos",
  "lighting": "iluminación"
};

app.get("/products", async (req, res) => {
  const limit = Number(req.query.limit ?? 12);
  const skip  = Number(req.query.skip ?? 0);
  const currency = (req.query.currency || "").toUpperCase(); // "ARS" o vacío
  const rate = Number(req.query.rate || DEFAULT_USD_ARS);     // ej: 1150

  try {
    const { data } = await axios.get(`${BASE}/products`, { params: { limit, skip } });

    const items = data.products.map(p => {
      const priceConv = convertPriceUSD(p.price, currency, rate);
      const priceFormatted = priceConv.currency === "ARS"
        ? formatCurrency(priceConv.value, "ARS")
        : `$${p.price}`;

      return {
        id: p.id,
        title: p.title, // si querés, acá podés traducir o dejarlo así
        description: p.description,
        price: priceConv.value,
        price_formatted: priceFormatted,
        currency: priceConv.currency,
        discountPercentage: p.discountPercentage,
        rating: p.rating,
        stock: p.stock,
        brand: p.brand,
        category: categoryMap[p.category] || p.category,
        thumbnail: p.thumbnail,
        images: p.images
      };
    });

    res.json({ total: data.total, limit: data.limit, skip: data.skip, items });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: "No se pudieron obtener productos" });
  }
});

app.get("/products/:id", async (req, res) => {
  const currency = (req.query.currency || "").toUpperCase();
  const rate = Number(req.query.rate || DEFAULT_USD_ARS);

  try {
    const { data: p } = await axios.get(`${BASE}/products/${req.params.id}`);
    const priceConv = convertPriceUSD(p.price, currency, rate);
    const priceFormatted = priceConv.currency === "ARS"
      ? formatCurrency(priceConv.value, "ARS")
      : `$${p.price}`;

    res.json({
      id: p.id,
      title: p.title,
      description: p.description,
      price: priceConv.value,
      price_formatted: priceFormatted,
      currency: priceConv.currency,
      discountPercentage: p.discountPercentage,
      rating: p.rating,
      stock: p.stock,
      brand: p.brand,
      category: categoryMap[p.category] || p.category,
      thumbnail: p.thumbnail,
      images: p.images
    });
  } catch (e) {
    const status = e.response?.status || 500;
    res.status(status).json({ error: "No se encontró el producto" });
  }
});

app.listen(PORT, () => console.log(`http://localhost:${PORT} listo ✅`));