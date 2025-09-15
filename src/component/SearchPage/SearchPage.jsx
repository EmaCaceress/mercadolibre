import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./SearchPage.scss";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const fmt = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

// Base del backend (Express)
const API_BASE = "http://localhost:4000";

function normalizeItem(p) {
  if (!p) return null;
  const price = Number(p.price_ars ?? p.price ?? 0);
  const title = p.titleSecond ?? p.title ?? "";
  const thumb = p.thumbnail || p.image || p.images?.[0] || "";
  const rating = Number(p.rating ?? 0);
  const free_shipping = Boolean(p.free_shipping || p.envio?.free || p.envio?.full);
  const discount = Number(p.discountPercentage ?? p.discount ?? 0);
  return {
    id: p.id,
    title,
    thumb,
    price,
    priceText: p.price_formatted || (price ? fmt.format(price) : ""),
    rating,
    free_shipping,
    discount,
  };
}

async function fetchSearchData(q, limit, skip) {
  // 1) Intento contra /search
  try {
    const r = await fetch(
      `${API_BASE}/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`
    );
    if (r.ok) {
      const data = await r.json(); // { total, products:[...] }
      const raw = data.products || data.items || data.results || [];
      return { total: data.total ?? raw.length, items: raw };
    }
  } catch (_) {}

  // 2) Fallback: /products y filtro en front
  const r2 = await fetch(`${API_BASE}/products?limit=${limit}&skip=${skip}`);
  const d2 = await r2.json(); // { total, items:[...] }
  const pool = d2.items || d2.products || [];
  const filtered = q
    ? pool.filter((p) => (p.title || "").toLowerCase().includes(q.toLowerCase()))
    : pool;
  return {
    total: q ? filtered.length : d2.total ?? filtered.length,
    items: filtered,
  };
}

export default function SearchPage() {
  const params = useQuery();
  const q = params.get("q") || "";
  const page = Math.max(1, Number(params.get("page") || 1));
  const limit = 24;
  const skip = (page - 1) * limit;

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  // Estado local para switches (decorativo por ahora)
  const [f, setF] = useState({
    arrivesToday: false,
    fullShipping: false,
    international: false,
    freeShipping: false,
    bestInstallments: false,
  });

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      const { total, items } = await fetchSearchData(q, limit, skip);
      if (!cancel) {
        setItems(items.map(normalizeItem).filter(Boolean));
        setTotal(total);
        setLoading(false);
        window.scrollTo(0, 0);
      }
    })().catch((e) => {
      if (!cancel) {
        console.error("Error en la búsqueda:", e?.message || e);
        setItems([]);
        setTotal(0);
        setLoading(false);
      }
    });
    return () => {
      cancel = true;
    };
  }, [q, page]);

  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="SearchPageGrid">
      <section className="spg__container">
        <header className="spg__header">
          <h1 className="spg__title">
            {loading ? "Buscando..." : ` ${q}`}

          </h1>
          {!loading && <small className="spg__count"> {total} resultados</small>}
          
        </header>

        {loading && <div className="spg__loading">Cargando…</div>}

        {!loading && (
          <div className="spg__content">
            {/* Lateral de filtros */}
            <aside className="spg__filters" aria-label="Filtros de búsqueda">

              <div className="filters__list">
                <div className="filterItem">
                  <div className="filterItem__text">
                    <span className="filterItem__title">Llega hoy</span>
                  </div>
                  <button
                    className={`switch ${f.arrivesToday ? "is-on" : ""}`}
                    role="switch"
                    aria-checked={f.arrivesToday}
                    onClick={() => setF({ ...f, arrivesToday: !f.arrivesToday })}
                  >
                    <span className="switch__knob" />
                  </button>
                </div>

                <div className="filterItem">
                  <div className="filterItem__text">
                    <span className="filterItem__title">
                      <strong className="tagFull">FULL</strong> te da envío gratis
                    </span>
                    <small className="filterItem__desc">En carritos desde $ 33.000</small>
                  </div>
                  <button
                    className={`switch ${f.fullShipping ? "is-on" : ""}`}
                    role="switch"
                    aria-checked={f.fullShipping}
                    onClick={() => setF({ ...f, fullShipping: !f.fullShipping })}
                  >
                    <span className="switch__knob" />
                  </button>
                </div>

                <div className="filterItem">
                  <div className="filterItem__text">
                    <span className="filterItem__title">
                      <strong className="tagIntl">Compra Internacional</strong>
                    </span>
                    <small className="filterItem__desc">
                      Miles de productos del mundo a tu casa
                    </small>
                  </div>
                  <button
                    className={`switch ${f.international ? "is-on" : ""}`}
                    role="switch"
                    aria-checked={f.international}
                    onClick={() => setF({ ...f, international: !f.international })}
                  >
                    <span className="switch__knob" />
                  </button>
                </div>

                <div className="filterItem">
                  <div className="filterItem__text">
                    <span className="filterItem__title">Envío gratis</span>
                  </div>
                  <button
                    className={`switch ${f.freeShipping ? "is-on" : ""}`}
                    role="switch"
                    aria-checked={f.freeShipping}
                    onClick={() => setF({ ...f, freeShipping: !f.freeShipping })}
                  >
                    <span className="switch__knob" />
                  </button>
                </div>

                <div className="filterItem">
                  <div className="filterItem__text">
                    <span className="filterItem__title">Mejor precio en cuotas</span>
                    <small className="filterItem__desc">
                      Al mismo precio o con bajo interés
                    </small>
                  </div>
                  <button
                    className={`switch ${f.bestInstallments ? "is-on" : ""}`}
                    role="switch"
                    aria-checked={f.bestInstallments}
                    onClick={() =>
                      setF({ ...f, bestInstallments: !f.bestInstallments })
                    }
                  >
                    <span className="switch__knob" />
                  </button>
                </div>
              </div>
            </aside>

            {/* Listado de productos */}
            <div className="spg__main">
              {items.length === 0 && (
                <div className="spg__empty">No encontramos resultados.</div>
              )}

              {items.length > 0 && (
                <div className="spg__grid">
                  {items.map((p) => (
                    <article key={p.id} className="card">
                      <Link to={`/products/${p.id}`} className="card__imgWrap">
                        <img src={p.thumb} alt={p.title} loading="lazy" />
                      </Link>

                      <div className="card__body">
                        <Link to={`/products/${p.id}`} className="card__title">
                          {p.title}
                        </Link>

                        <div className="card__priceRow">
                          <div className="card__price">{p.priceText}</div>
                          {p.discount > 0 && (
                            <span className="card__off">
                              {Math.round(p.discount)}% OFF
                            </span>
                          )}
                        </div>

                        {p.price > 0 && (
                          <div className="card__installments">
                            Mismo precio 3 cuotas de
                            {" "}
                            {fmt.format(Math.round(p.price / 3))}
                          </div>
                        )}

                        <div className="card__meta">
                          {p.rating > 0 && (
                            <span
                              className="card__stars"
                              aria-label={`Rating ${p.rating} de 5`}
                            >
                              {"★".repeat(Math.round(p.rating)).padEnd(5, "☆")}
                            </span>
                          )}
                          {p.free_shipping && (
                            <span className="card__ship">Envío gratis • FULL</span>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {pages > 1 && (
                <nav className="spg__pagination" aria-label="Paginación">
                  {Array.from({ length: pages }).map((_, i) => {
                    const n = i + 1;
                    const sp = new URLSearchParams(window.location.search);
                    sp.set("page", String(n));
                    return (
                      <Link
                        key={n}
                        to={`/search?${sp.toString()}`}
                        className={n === page ? "is-current" : ""}
                      >
                        {n}
                      </Link>
                    );
                  })}
                </nav>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

