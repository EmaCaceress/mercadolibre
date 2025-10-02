import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./SearchPage.scss";
import Card from "../Card/Card";
import SliderButtons from "../SliderButton/SliderButton";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

// Base del backend (Express)
const API_BASE = "http://localhost:4000";


export default function SearchPage() {
  const params = useQuery();
  const q = params.get("q") || "";
  const page = Math.max(1, Number(params.get("page") || 1));
  const limit = 24;
  const skip = (page - 1) * limit;
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const pages = Math.ceil(total / limit);
  const [f, setF] = useState({
    arrivesToday: false,
    fullShipping: false,
    international: false,
    freeShipping: false,
    bestInstallments: false,
  });
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.items);
      })
      .catch(err => console.error("Error al traer productos:", err));


  }, [q, page]);

  useEffect(() => {
    setBrands([]);
    const uniqueBrands = [
      ...new Set(
        products
          .map(p => p.brand)                     // solo el valor
          .filter(b => b != null && b !== "")    // saca null/undefined/""
      )
    ];
    setBrands(uniqueBrands);
  }, [products, q]);
  useEffect(() => {console.log(q)}, [q]);
  useEffect(() => {setTotal(products.length)}, [products]);
  return (
    <div className="SearchPageGrid">
        {!loading ? (
          <div className="spg__container">
            {/* Slider de marcas */}
            <div className="spg__slider">
              <SliderButtons slider={brands} cardw={80} cardg={22.5} cardH={80}/>
            </div>
            {/* Lateral de filtros */}
            <aside className="spg__filters" aria-label="Filtros de búsqueda">
              
              {/* TITULO */}
              <header className="spg__header">
                <h1 className="spg__title">
                  {loading ? "Buscando..." : ` ${q}`}
                </h1>
                {!loading && <small className="spg__count"> {total} resultados</small>}
              </header>

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
              {products.length === 0 && (
                <div className="spg__empty">No encontramos resultados.</div>
              )}

              {products.length > 0 && (
                <div className="spg__grid">
                  {products.map((p) => (
                    <Card prod={p} cardWidth={"200"} cardHeight={"550"}/>
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
        )
        : (
          <div className="spg__loading">Cargando...</div>
        )}
    </div>
  );
}

