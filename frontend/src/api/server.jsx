// Configurable desde .env (Vite) o caé en localhost por defecto
const API_BASE = "http://localhost:4000"; //import.meta?.env?.VITE_API || 

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
async function request(path, {params = {}} = 0) {
  console.log(path)
  const url = `${API_BASE}${path}${toQuery(params)}`;
  const res = await fetch(url);
  if (!res.ok) {
    // lanza error con info útil
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} – ${text || url}`);
  }
  return res.json();
}

// --------- API pública ---------
export function productsList({ limit, skip } = {}) {
  // GET /products
  return request("/products",  {params : { limit, skip}});
}

export function productGetById(id) {
  // GET /products/:id
  return request(`/products/${id}`);
}

export function productsSearch({q, limit, skip} = {}) {
  // GET /search
  return request("/search", {params : { q, limit, skip}});
}