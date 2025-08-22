require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();

const PORT = process.env.PORT || 4000;

// Variables para guardar tokens (en producción deberías usar DB)
let accessToken = null;
let refreshToken = null;
let tokenExpires = null;

// Ruta inicial
app.get("/", (req, res) => {
  res.send(`
    <h2>Servidor Express funcionando 🚀</h2>
    <a href="/login">🔑 Iniciar sesión con Mercado Libre</a>
  `);
});

// Ruta de login -> redirige al login de Mercado Libre
app.get("/login", (req, res) => {
  const authUrl = `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}`;
  res.redirect(authUrl);
});

// Callback de Mercado Libre
app.get("/auth/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("❌ No se recibió el code de autorización");
  }

  try {
    const response = await axios.post(
      "https://api.mercadolibre.com/oauth/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
        redirect_uri: process.env.REDIRECT_URI,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    // Guardamos tokens en memoria
    accessToken = response.data.access_token;
    refreshToken = response.data.refresh_token;
    tokenExpires = Date.now() + response.data.expires_in * 1000;

    res.send(`
      ✅ Autenticación exitosa!<br/>
      🔑 Access Token: ${accessToken}<br/>
      🔄 Refresh Token: ${refreshToken}<br/>
      ⏰ Expira en: ${response.data.expires_in} segundos<br/>
      <a href="/me">👉 Ver mis datos</a>
    `);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send("❌ Error al obtener el token");
  }
});

// Función para refrescar el token
async function refreshAccessToken() {
  try {
    const response = await axios.post(
      "https://api.mercadolibre.com/oauth/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        refresh_token: refreshToken,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    accessToken = response.data.access_token;
    refreshToken = response.data.refresh_token;
    tokenExpires = Date.now() + response.data.expires_in * 1000;

    console.log("🔄 Token refrescado correctamente");
  } catch (error) {
    console.error("❌ Error al refrescar token:", error.response?.data || error.message);
  }
}

// Middleware para asegurar token válido
async function ensureToken(req, res, next) {
  if (!accessToken) {
    return res.status(401).send("⚠️ No estás autenticado, hacé login en /login");
  }

  if (Date.now() > tokenExpires) {
    console.log("⏰ Token expirado, refrescando...");
    await refreshAccessToken();
  }

  next();
}

app.get("/health", (req, res) => {
    res.json({
      up: true,
      clientIdLoaded: !!process.env.CLIENT_ID,
      redirectUriLoaded: !!process.env.REDIRECT_URI,
    });
  });
  
// Ruta para obtener info del usuario logueado
app.get("/me", ensureToken, async (req, res) => {
  try {
    const response = await axios.get("https://api.mercadolibre.com/users/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json(error.response?.data || { error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
