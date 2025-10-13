// Configurable desde .env (Vite) o caé en localhost por defecto
const API_BASE = import.meta?.env?.VITE_API || process.env.API || "http://localhost:4000";

// Helper para querystrings: {q:"iphone", limit:10} => ?q=iphone&limit=10
function toQuery(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.append(k, v);
  });
  const s = qs.toString();
  return s ? `?${s}` : "";
}

// Wrapper fetch con manejo de errores HTTP y JSON
async function request(path, { params, signal } = {}) {
  const url = `${API_BASE}${path}${toQuery(params)}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    // lanza error con info útil
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} – ${text || url}`);
  }
  return res.json();
}

// --------- API pública ---------
export function productsList({ limit, skip, currency = "ARS", rate = 1300 } = {}, opts = {}) {
  // GET /products
  return request("/products", { params: { limit, skip, currency, rate }, signal: opts.signal });
}

export function productGetById(id, { currency = "ARS", rate = 1300 } = {}, opts = {}) {
  // GET /products/:id
  return request(`/products/${id}`, { params: { currency, rate }, signal: opts.signal });
}

export function productsSearch({ q, limit, skip, currency = "ARS", rate = 1300 } = {}, opts = {}) {
  // GET /search
  return request("/search", { params: { q, limit, skip, currency, rate }, signal: opts.signal });
}