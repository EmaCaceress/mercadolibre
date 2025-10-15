import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetail.scss";
import SliderButtons from "../SliderButton/SliderButton";
import Star from "../Star/Star";
import { productsList, productGetById} from "../../api/server";

const StarRow = ({ value = 0 }) => (
  <Star value={value}/> 
);

const ProductDetail = () => {
    const { id } = useParams(); 
    const [descOpen, setDescOpen] = useState(false);
    const [avg, setAvg] = useState(0);
    const [counts, setCounts] = useState({});
    const [total, setTotal] = useState(0);
    const [productId, setProductId] = useState(null);
    const [products, setProducts] = useState([]);
    const [imagen, setImagen] = useState(null); 

    useEffect(() => {    
        productGetById(id)
        .then(data => {
            setProductId(data);
            setImagen(data.images?.[0] ?? null);
        })
        .catch(err => {
            console.error("Error al traer el producto:", err);

        });
        productsList({ limit: 30 })
        .then(data => {
          setProducts(data.items)
        })
        .catch(err => console.error("Error al traer productos:", err));
    }, [id]);

    useEffect(() => {
      if (productId) {
        setImagen( productId.images?.[0] ?? null);
      }
    }, [productId]);

    useEffect(() => {
      const ratings = productId?.rewiews?.map(r => Number(r.rating)) ?? [];
      const totalAvg = ratings.reduce((acc, n) => acc + (Number.isFinite(n) ? n : 0), 0);
      const avgStars = ratings.length ? totalAvg / ratings.length : 0;
      const reviews = productId?.rewiews ?? [];
      const counts = reviews.reduce(
        (acc, { rating }) => {
          const r = Math.trunc(Number(rating));
          if (r >= 1 && r <= 5) {
            acc[r] = (acc[r] ?? 0) + 1;
          }
          return acc;
        },
        { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      );

      setCounts(counts);
      const totalList = Object.values(counts).reduce((a, b) => a + b, 0);

      setTotal(totalList)
      setAvg(Math.round(avgStars)+".0")
    },[productId])

    if (!productId) return <p>Cargando...</p>;  

    const onImageHover = (src) => {
      setImagen(src);
    }

    return (
    <section className="ProductDetail-section" key={id}>
      {/* Migas / enlaces superiores */}
      <div className="ProductDetail-link">
        <ul className="ProductDetail-link__list">
          <li>Volver</li>
          <li>Celulares y Teléfonos</li>
          <li>Smartwatches y Accesorios</li>
          <li>Smartwatches</li>
        </ul>

        <ul className="ProductDetail-link__list">
          <li>Vender uno igual</li>
          <li>Compartir</li>
        </ul>
      </div>

      <div className="ProductDetail-section__container">
        {/* ===================== MEDIA (galeria e imagen principal) ===================== */}
        <article className="ProductDetail-media">

          <div className="ProductDetail-media__carrousel">
              {productId.images.map((img,index) => (
               <div key={index} onClick={() => onImageHover(img)} className={`thumb ${imagen === img ? "thumb--active" : ""}`}>
                    <img src={img} alt="carrousel" />
                </div>
              ))}
          </div>

          <div>
            <img
              className="ProductDetail-media__img"
              src={imagen}
              alt={productId.titleSecond}
            />
          </div>
        </article>

        {/* ===================== BARRA DERECHA (detalle y pagos) ===================== */}
        <section className="ProductDetail-bar">
          <div
            className="ProductDetail-bar__container"
            style={{ top: "16px" }}
          >
            {/* ---- DETALLE DEL PRODUCTO ---- */}
            <section className="ProductDetail-detail">
              <div className="ProductDetail-detail__container">
                <div>
                  <div className="ProductDetail-detail__state">Nuevo | +100 vendidos</div>

                  <h1 className="ProductDetail-detail__title">
                    {productId.titleSecond}
                  </h1>

                  <div className="ProductDetail-detail__meta">
                    <div className="ProductDetail-detail__rating">
                      <StarRow value={avg} />
                      <span className="ProductDetail-detail__rating-text">{avg} ({total})</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="ProductDetail-detail__price">${productId.price.toLocaleString()}</div>
                  {
                    productId.cuotas && 
                    <div className="ProductDetail-detail__installments">
                    {productId.cuotas}
                    </div>
                  }

                  <div className="ProductDetail-detail__optionPrice">Ver los medios de pago</div>
                </div>
                
                {
                    productId.envio?.time && productId.envio?.full &&
                    <div className="ProductDetail-detail__send">
                        <div className="ProductDetail-detail__costSend">{productId.envio.time} {productId.envio.full == 1 && "⚡ FULL"}</div>
                        <div className="ProductDetail-detail__timeSend">
                        Comprando en los proximos <b>5 minutos</b>
                        </div>
                        <div className="ProductDetail-detail__optionSend">Más formas de entrega</div>
                    </div>
                }


                <div className="ProductDetail-detail__stock">
                  <div className="ProductDetail-detail__titleStock">Stock disponible</div>
                  <div className="ProductDetail-detail__selectStock">
                    Cantidad: <b>{productId.stock}</b>
                  </div>
                  <div className="ProductDetail-detail__amountStock">({productId.stock >= 10 ? "+10" : "-10"} disponibles)</div>
                </div>

                <div className="ProductDetail-detail__actions">
                  <button className="ProductDetail-detail__btn ProductDetail-detail__btn--buy">
                    Comprar ahora
                  </button>
                  <button className="ProductDetail-detail__btn ProductDetail-detail__btn--cart">
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </section>

            {/* ---- PAGOS ---- */}
            <section className="ProductDetail-payment">
              <div className="ProductDetail-payment__container">
                <h3 className="ProductDetail-payment__title">Medios de pago</h3>

                <div className="ProductDetail-payment__section">
                  <p className="ProductDetail-payment__subtitle">Cuotas sin Tarjeta</p>
                  <div className="ProductDetail-payment__logos">
                    <img
                      className="ProductDetail-payment__img"
                      src="https://http2.mlstatic.com/storage/logos-api-admin/f3e8e940-f549-11ef-bad6-e9962bcd76e5-m.svg"
                      alt="Mercado Pago"
                    />
                  </div>
                </div>

                <div className="ProductDetail-payment__section">
                  <p className="ProductDetail-payment__subtitle">Tarjetas de crédito</p>
                  <div className="ProductDetail-payment__logos">
                    <img
                      className="ProductDetail-payment__img"
                      src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                      alt="Visa"
                    />
                    <img
                      className="ProductDetail-payment__img"
                      src="https://http2.mlstatic.com/storage/logos-api-admin/b2c93a40-f3be-11eb-9984-b7076edb0bb7-m.svg"
                      alt="American Express"
                    />
                    <img
                      className="ProductDetail-payment__img"
                      src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                      alt="Mastercard"
                    />
                    <img
                      className="ProductDetail-payment__img"
                      src="https://http2.mlstatic.com/storage/logos-api-admin/d72276d0-0fda-11ec-8aae-e5acfdd60b03-m.svg"
                      alt="Naranja X"
                    />
                  </div>
                </div>

                <div className="ProductDetail-payment__section">
                  <p className="ProductDetail-payment__subtitle">Tarjetas de débito</p>
                  <div className="ProductDetail-payment__logos">
                    <img
                      className="ProductDetail-payment__img"
                      src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                      alt="Visa Débito"
                    />
                    <img
                      className="ProductDetail-payment__img"
                      src="https://http2.mlstatic.com/storage/logos-api-admin/93296a70-72fe-11f0-8778-e777036b3e93-m.svg"
                      alt="Maestro"
                    />
                    <img
                      className="ProductDetail-payment__img"
                      src="https://http2.mlstatic.com/storage/logos-api-admin/cb0af1c0-f3be-11eb-8e0d-6f4af49bf82e-m.svg"
                      alt="Cabal"
                    />
                    <img
                      className="ProductDetail-payment__img"
                      src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                      alt="Mastercard Débito"
                    />
                  </div>
                </div>

                <div className="ProductDetail-payment__section">
                  <p className="ProductDetail-payment__subtitle">Efectivo</p>
                  <div className="ProductDetail-payment__logos">
                    <img
                      className="ProductDetail-payment__img"
                      src="https://http2.mlstatic.com/storage/logos-api-admin/fec5f230-06ee-11ea-8e1e-273366cc763d-m.svg"
                      alt="Pago Fácil"
                    />
                    <img
                      className="ProductDetail-payment__img"
                      src="https://http2.mlstatic.com/storage/logos-api-admin/6d575650-dbc3-11ee-a55a-bbc538356ab8-m.svg"
                      alt="Rapipago"
                    />
                  </div>
                </div>

                <a href="#" className="ProductDetail-payment__link">
                  Conocé otros medios de pago
                </a>
              </div>
            </section>
          </div>
        </section>

        {/* DESCRIPCIÓN (2da imagen) */}
        {/* ===================== DESCRIPCION ===================== */}
        <section className="ProductDetail-description">
          <h2 className="ProductDetail-description__title">Descripción</h2>

          <div
            className={`ProductDetail-description__content ${
              descOpen ? "ProductDetail-description__content--open" : ""
            }`}
          >
            <p className="ProductDetail-description__p">{productId.brand}</p>

            <p className="ProductDetail-description__p">
              {productId.description}
            </p>

            <hr className="ProductDetail-description__divider" />

            <p className="ProductDetail-description__p">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti laborum illum dicta vel asperiores at, facilis ratione ullam distinctio placeat natus, provident, sed esse eligendi fugit repellat explicabo magnam laudantium.q
            </p>

            <p className="ProductDetail-description__p">
              <strong>Also: </strong> Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto deleniti culpa eos, velit numquam officiis tempore iure accusantium eum? Incidunt beatae consequuntur, perferendis id ut velit aut error veritatis vel. 
            </p>
          </div>

          <button
            className="ProductDetail-description__toggle"
            onClick={() => setDescOpen((v) => !v)}
            aria-expanded={descOpen}
          >
            {descOpen ? "Ver menos" : "Ver descripción completa"}
          </button>
        </section>

        {/* ===================== COMENTARIOS / REVIEWS ===================== */}
        <section className="ProductDetail-reviews">
          <div className="ProductDetail-reviews__header">
            <h2 className="ProductDetail-reviews__title">Opiniones destacadas</h2>
            <span className="ProductDetail-reviews__counter">{total} calificaciones</span>
          </div>

          <div className="ProductDetail-reviews__grid">
            {/* Resumen izquierda */}
            <aside className="ProductDetail-reviews__summary">
              <div className="ProductDetail-reviews__avg">
                <div className="ProductDetail-reviews__avg-score">{avg}</div>
                <StarRow value={avg} />
              </div>

              <ul className="ProductDetail-reviews__bars" aria-label="Distribución de calificaciones">
                {[5, 4, 3, 2, 1].map((n) => {
                  const pct = (counts[n] / total) * 100;
                  return (
                    <li key={n} className="ProductDetail-reviews__bar">
                      <span className="ProductDetail-reviews__bar-label">{n}★</span>
                      <span className="ProductDetail-reviews__bar-track">
                        <span className="ProductDetail-reviews__bar-fill" style={{ width: `${pct}%` }} />
                      </span>
                      <span className="ProductDetail-reviews__bar-count">{counts[n]}</span>
                    </li>
                  );
                })}
              </ul>

              <ul className="ProductDetail-reviews__traits">
                <li className="ProductDetail-reviews__trait">
                  <span>Relación precio-calidad</span>
                  <StarRow value={5} />
                </li>
                <li className="ProductDetail-reviews__trait">
                  <span>Fácil de consumir</span>
                  <StarRow value={5} />
                </li>
                <li className="ProductDetail-reviews__trait">
                  <span>Sabor agradable</span>
                  <StarRow value={4} />
                </li>
              </ul>
            </aside>

            {/* Lista de comentarios */}
            <div className="ProductDetail-reviews__list">
              {productId.rewiews?.map((r, index) => (
                <article key={index} className="ProductDetail-reviews__item">
                  <StarRow value={r.rating} />
                  <p className="ProductDetail-reviews__text">{r.comment}</p>
                  <div className="ProductDetail-reviews__meta">
                    <time className="ProductDetail-reviews__date">{r.date}</time>
                    <button className="ProductDetail-reviews__help">
                      ¿Te sirvió? <b>{r.helpful}</b>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ===================== RELACIONADOS (al cierre) ===================== */}
      <section className="ProductDetail-related">
        <div className="ProductDetail-related__container">
          <SliderButtons
            slider={products}
            title={"Quienes compraron este producto también compraron"}
            cardw={180}
            cardg={20}
          />
        </div>
      </section>
    </section>
  );
};

export default ProductDetail;
