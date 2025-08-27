require("dotenv").config();
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const PORT = 4000;

// Variables de entorno (usa dotenv)
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI_NGROK;

let accessToken = null;
let refreshToken = null;
let tokenExpiry = null;

async function authMiddleware(req, res, next) {
  const ahora = Date.now() / 1000; // segundos

  // Si no hay token o está por expirar en menos de 1 minuto
  if (!accessToken || ahora > tokenExpiry - 60) {
    try {
      const response = await axios.post(
        "https://api.mercadolibre.com/oauth/token",
        new URLSearchParams({
          grant_type: "refresh_token",
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          refresh_token: refreshToken
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" }
        }
      );

      accessToken = response.data.access_token;
      refreshToken = response.data.refresh_token;
      tokenExpiry = (Date.now() / 1000) + response.data.expires_in;
      
      console.log("🔄 Token renovado automáticamente: ", accessToken);
    } catch (err) {
      console.error("Error al refrescar token:", err.response?.data || err.message);
      return res.status(401).json({ error: "Token inválido, vuelve a loguearte" });
    }
  }

  // Guardar el token en la request para que lo usen las rutas
  req.accessToken = accessToken;
  next();
}


app.use(bodyParser.json());

app.get("/", (req, res) => {
  console.log("Estas en el inicio");
  res.send(`
    <html>
      <head>
        <title>Mi página</title>
      </head>
      <body>
        <h1>Hola desde Express 🚀</h1>

        <!-- Botón para logearte automático -->
        <button onclick="window.location.href='/login'">
          Login automático
        </button>

        <!-- Botón para ir directo al producto -->
        <button onclick="window.location.href='/producto/MLA2013547858'">
          Ir al producto
        </button>
      </body>
    </html>
  `);
});

// Paso 1: Redirigir al login de Mercado Libre
app.get("/login", (req, res) => {
  console.log("Estas en el login");
  const authUrl = process.env.AUTENTICATION;
  res.redirect(authUrl);
});

// Paso 2: Callback que recibe el "code"
app.get("/auth/callback", async (req, res) => {
  console.log("Estas en la auth");
  const { code } = req.query;

  try {
    const response = await axios.post(
      "https://api.mercadolibre.com/oauth/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const data = response.data; // contiene access_token, refresh_token, etc.
    console.log("Token recibido:", data);
    accessToken = response.data.access_token;
    refreshToken = response.data.refresh_token;
    tokenExpiry = (Date.now() / 1000) + data.expires_in; // fecha exacta de vencimiento
    console.log("Expira en:", new Date(tokenExpiry * 1000).toLocaleString());

    res.redirect(`https://3734e531711b.ngrok-free.app/?token=${data.access_token}`);
  } catch (error) {
    console.error("Error al obtener el token:", error.response?.data || error.message);
    res.status(500).json({ error: "No se pudo obtener el token" });
  }
});

// PETICION DE PRODUCTOS
app.get("/producto/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(`https://api.mercadolibre.com/products/${id}/items`, {
      headers: {
        Authorization: `Bearer ${req.accessToken}`
      }
    });
    console.log(response.data);
    async function getItemData(item) {
      const { data } = await axios.get(
        `https://api.mercadolibre.com/products/${item.item_id}`, // OJO: acá es /items/, no /products/
        {
          headers: { Authorization: `Bearer ${req.accessToken}` }
        }
      );

      return {
        id: item.item_id,
        seller_id: item.seller_id,
        precio: item.price,
        category_id: item.category_id,
        detail: {
          name: data.title,
          status: data.status,
          pictures: data.pictures.map(picture => ({
            id: picture.id,
            url: picture.url,
            max_width: picture.max_size?.width, 
            min_width: picture.size
          }))
        }
      };
    }

    const items = await Promise.all(response.data.results.map(getItemData));

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: "Error al obtener el producto",
      detalle: error.response?.data || error.message
    });
  }  
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});