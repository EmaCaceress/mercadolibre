import React, { useState, useEffect } from "react";
import "./ProductDetail.scss";
import SliderButtons from "../SliderButton/SliderButton";

const fakeReviews = [
  {
    id: 1,
    stars: 5,
    date: "03 mar. 2025",
    text:
      "Buena relación producto/calidad. Obviamente hay productos mejores, pero no en esta gama de precios. El mismo problema que todas las proteínas que he consumido, le cuesta disolverse.",
    helpful: 12,
  },
  { id: 2, stars: 5, date: "03 feb. 2025", text: "Excelente.", helpful: 7 },
  { id: 3, stars: 3, date: "01 nov. 2023", text: "Se hace grumo.", helpful: 3 },
];

const related = [
  { id: 1, title: "Vaso Shaker Flip 500 ml", price: 6160, img: "/images/shaker-1.png" },
  { id: 2, title: "Shaker Everlast Premium", price: 14240, img: "/images/shaker-2.png" },
  { id: 3, title: "Shaker Everlast Hermético", price: 13999, img: "/images/shaker-3.png" },
  { id: 4, title: "Shaker Everlast Anti Grumos", price: 16814, img: "/images/shaker-4.png" },
  { id: 5, title: "Vaso Shaker Flip 500 ml", price: 6545, img: "/images/shaker-5.png" },
];

const StarRow = ({ value = 0 }) => (
  <div className="ProductDetail-reviews__stars" aria-label={`Puntaje ${value} de 5`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={`ProductDetail-reviews__star ${i < value ? "ProductDetail-reviews__star--on" : ""}`}>★</span>
    ))}
  </div>
);

const products = [
    { id: 1, titleSecond: "Xiaomi Redmi 14c", oldPrice: 226000, price: 196900, discount: "39% OFF", image: "https://http2.mlstatic.com/D_Q_NP_2X_784839-MLA86924328056_072025-T.webp", envio: "Llega gratis hoy"},
    { id: 2, titleSecond: "ZTE Blade A54", price: 139999, image: "https://http2.mlstatic.com/D_Q_NP_2X_784839-MLA86924328056_072025-T.webp", envio: "Llega gratis mañana"},
    { id: 3, titleSecond: "TCL 505", oldPrice: 200000, price: 159999, discount: "30% OFF", image: "https://http2.mlstatic.com/D_Q_NP_2X_784839-MLA86924328056_072025-T.webp", cuotas: "Cuota promocionada en 6 cuotas de $30000", },
    { id: 4, titleSecond: "Xiaomi Redmi 14c", price: 196900, discount: null, image: "https://http2.mlstatic.com/D_Q_NP_2X_784839-MLA86924328056_072025-T.webp", cuotas: "en 3 cuotas de $75499"},
    { id: 5, titleSecond: "ZTE Blade A54", oldPrice: 400000, price: 139999, discount: "39% OFF", image: "https://http2.mlstatic.com/D_Q_NP_2X_784839-MLA86924328056_072025-T.webp", full: 1, envio: "Envio gratis"},
    { id: 6, titleSecond: "TCL 505", oldPrice: 200000, price: 159999, discount: "30% OFF", image: "https://http2.mlstatic.com/D_Q_NP_2X_784839-MLA86924328056_072025-T.webp", },
    { id: 7, titleSecond: "Xiaomi Redmi 14c", oldPrice: 226000, price: 196900, discount: "39% OFF", image: "https://http2.mlstatic.com/D_Q_NP_2X_784839-MLA86924328056_072025-T.webp", envio: "Llega gratis hoy"},
    { id: 8, titleSecond: "ZTE Blade A54", price: 139999, image: "https://http2.mlstatic.com/D_Q_NP_2X_784839-MLA86924328056_072025-T.webp", envio: "Llega gratis mañana"},
    { id: 9, titleSecond: "TCL 505", oldPrice: 200000, price: 159999, discount: "30% OFF", image: "https://http2.mlstatic.com/D_Q_NP_2X_784839-MLA86924328056_072025-T.webp", cuotas: "Cuota promocionada en 6 cuotas de $30000", },
    { id: 10, titleSecond: "Xiaomi Redmi 14c", price: 196900, discount: null, image: "https://http2.mlstatic.com/D_Q_NP_2X_784839-MLA86924328056_072025-T.webp", cuotas: "en 3 cuotas de $75499"},
    { id: 11, titleSecond: "ZTE Blade A54", oldPrice: 400000, price: 139999, discount: "39% OFF", image: "https://http2.mlstatic.com/D_Q_NP_2X_784839-MLA86924328056_072025-T.webp", full: 1, envio: "Envio gratis"},
    { id: 12, titleSecond: "TCL 505", oldPrice: 200000, price: 159999, discount: "30% OFF", image: "https://http2.mlstatic.com/D_Q_NP_2X_784839-MLA86924328056_072025-T.webp", },
  ];

const ProductDetail = () => {
  const [descOpen, setDescOpen] = useState(false);
  const avg = 4.8;
  const counts = { 5: 12, 4: 5, 3: 1, 2: 0, 1: 1 };
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const [desplaceY, setDesplaceY] = useState(0);

//   useEffect(() => {
//     const sidebar = document.querySelector(".ProductDetail-bar__container");
//     const container = document.querySelector(".ProductDetail-bar");

//     const onScroll = () => {
//         const sidebarRect = sidebar.getBoundingClientRect();
//         const containerRect = container.getBoundingClientRect();
//         const distance = window.innerHeight - containerRect.bottom;
//         const espaceBottom = containerRect.height - sidebarRect.height;
//         const desplace = distance + espaceBottom ;
//         if(espaceBottom >= desplace && desplace>= 0){
//             const desplaceIf = desplace;
//             console.log(desplaceIf)
//             setDesplaceY(desplaceIf)
//         }
//     }
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

  return (
    <section className="ProductDetail-section">
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

            {/* MEDIA */}
            <article className="ProductDetail-media">
                <div>
                    {/* carrousel de imagenes */}
                </div>
                <div>
                    <img
                        className="ProductDetail-media__img"
                        src="https://http2.mlstatic.com/D_NQ_NP_817142-MLA88702470518_072025-O.webp"
                        alt="Premium Whey Protein 1 Kg Star Nutrition Doy Pack"
                    />
                </div>
            </article>

            <section className="ProductDetail-bar">
                <div 
                className="ProductDetail-bar__container"
                style={
                    desplaceY <= 0 
                        && {top:"16px"}
                        // : {transform: `translateY(${desplaceY}px)`}
                }>
                    {/* DETALLE */}
                    <section className="ProductDetail-detail">
                        <div className="ProductDetail-detail__container">

                            <div>
                                <div className="ProductDetail-detail__state">Nuevo  |  +100 vendidos</div>
                                <h1 className="ProductDetail-detail__title">
                                    Premium Whey Protein 1 Kg Star Nutrition Doy Pack
                                </h1>
                                <div className="ProductDetail-detail__meta">
                                    <div className="ProductDetail-detail__rating">
                                    <StarRow value={5} />
                                    <span className="ProductDetail-detail__rating-text">{avg} (19)</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="ProductDetail-detail__price">$ 47.951</div>
                                <div className="ProductDetail-detail__installments">9 cuotas de $ 7.995,28 sin tarjeta</div>
                                <div className="ProductDetail-detail__optionPrice">Ver los medios de pago</div>
                            </div>

                            <div className="ProductDetail-detail__send">
                                <div className="ProductDetail-detail__costSend">Llega gratis hoy</div>
                                <div className="ProductDetail-detail__timeSend">Comprando en los proximos <b>5 minutos</b></div>
                                <div className="ProductDetail-detail__optionSend">Más formas de entrega</div>
                            </div>

                            <div className="ProductDetail-detail__stock">
                                <div className="ProductDetail-detail__titleStock">Stock disponible</div>
                                <div className="ProductDetail-detail__selectStock">Cantidad: <b>1 unidad</b></div>
                                <div className="ProductDetail-detail__amountStock">(+10 disponibles)</div>
                            </div>

                            <div className="ProductDetail-detail__actions">
                                <button className="ProductDetail-detail__btn ProductDetail-detail__btn--buy">Comprar ahora</button>
                                <button className="ProductDetail-detail__btn ProductDetail-detail__btn--cart">Agregar al carrito</button>
                            </div>
                        </div>
                    </section>

                    {/* DETALLE */}
                    <section className="ProductDetail-payment">
                        <div className="ProductDetail-payment__container">
                            <h3 className="ProductDetail-payment__title">Medios de pago</h3>

                            <div className="ProductDetail-payment__section">
                                <p className="ProductDetail-payment__subtitle">Cuotas sin Tarjeta</p>
                                <div className="ProductDetail-payment__logos">
                                <img className="ProductDetail-payment__img" src="https://http2.mlstatic.com/frontend-assets/mp-web-navigation/ui-navigation/5.23.1/mercadopago.svg" alt="Mercado Pago" />
                                </div>
                            </div>

                            <div className="ProductDetail-payment__section">
                                <p className="ProductDetail-payment__subtitle">Tarjetas de crédito</p>
                                <div className="ProductDetail-payment__logos">
                                <img className="ProductDetail-payment__img" src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" />
                                <img className="ProductDetail-payment__img" src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo_%282018%29.svg" alt="American Express" />
                                <img className="ProductDetail-payment__img" src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
                                <img className="ProductDetail-payment__img" src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Tarjeta_Naranja_logo.svg" alt="Naranja X" />
                                </div>
                            </div>

                            <div className="ProductDetail-payment__section">
                                <p className="ProductDetail-payment__subtitle">Tarjetas de débito</p>
                                <div className="ProductDetail-payment__logos">
                                <img className="ProductDetail-payment__img" src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa Débito" />
                                <img className="ProductDetail-payment__img" src="https://upload.wikimedia.org/wikipedia/commons/6/6b/Maestro_logo.svg" alt="Maestro" />
                                <img className="ProductDetail-payment__img" src="https://upload.wikimedia.org/wikipedia/commons/6/6a/Cabal_logo.svg" alt="Cabal" />
                                <img className="ProductDetail-payment__img" src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard Débito" />
                                </div>
                            </div>

                            <div className="ProductDetail-payment__section">
                                <p className="ProductDetail-payment__subtitle">Efectivo</p>
                                <div className="ProductDetail-payment__logos">
                                <img className="ProductDetail-payment__img" src="https://seeklogo.com/images/P/pago-facil-logo-9FDD4E2E04-seeklogo.com.png" alt="Pago Fácil" />
                                <img className="ProductDetail-payment__img" src="https://seeklogo.com/images/R/rapipago-logo-CC030FCD7A-seeklogo.com.png" alt="Rapipago" />
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
            <section className="ProductDetail-description">
                <h2 className="ProductDetail-description__title">Descripción</h2>
                <div className={`ProductDetail-description__content ${descOpen ? "ProductDetail-description__content--open" : ""}`}>
                <p className="ProductDetail-description__p">EL NOGAL SUPLEMENTOS</p>
                <p className="ProductDetail-description__p">
                    EL MEJOR PRECIO DE MERCADO LIBRE Y ZONA OESTE. LOCAL AL PÚBLICO EN CENTRO DE RAMOS MEJÍA.
                </p>
                <hr className="ProductDetail-description__divider" />
                <p className="ProductDetail-description__p">
                    Suplemento Dietario a base de Ultra Concentrado de proteínas de Suero Lácteo. Desarrollado
                    para satisfacer las necesidades de los atletas; contiene aminoácidos esenciales y no
                    esenciales para construir masa muscular luego del entrenamiento intenso.
                </p>
                <p className="ProductDetail-description__p">
                    <strong>Preparación:</strong> Diluir 1 medida colmada en 150 ProductDetail de agua o leche descremada.
                    Consumir 1 a 2 porciones diarias entre comidas.
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

            {/* COMENTARIOS (3ra imagen) */}
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
                    <StarRow value={5} />
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
                    {fakeReviews.map((r) => (
                    <article key={r.id} className="ProductDetail-reviews__item">
                        <StarRow value={r.stars} />
                        <p className="ProductDetail-reviews__text">{r.text}</p>
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
            {/* RELACIONADOS (al cierre) */}
            <section className="ProductDetail-related">
                <div className="ProductDetail-related__container">
                    <SliderButtons slider={products} title={"Quienes compraron este producto también compraron"} cardw={175} cardg={20}/>
                </div>
            </section>
    </section>
  );
}

export default ProductDetail;