// Main.jsx
import React, { useEffect, useRef, useState } from "react";
import "./Main.scss";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";

// Imágenes y datos del slider principal
const slider = [
  { title: "verde", image: "https://http2.mlstatic.com/D_NQ_628472-MLA86566475059_062025-OO.webp", link: "#" },
  { title: "gris", image: "https://http2.mlstatic.com/D_NQ_646804-MLA83988057536_052025-OO.webp", link: "#" },
  { title: "negro", image: "https://http2.mlstatic.com/D_NQ_851156-MLA86746968751_062025-OO.webp", link: "#" },
  { title: "purpura", image: "https://http2.mlstatic.com/D_NQ_811167-MLA86800184955_062025-OO.webp", link: "#" },
  { title: "grisoscuro", image: "https://http2.mlstatic.com/D_NQ_986440-MLA85786569016_062025-OO.webp", link: "#" },
];

// Tarjetas para el slider horizontal
const cards = [
  { title: "Llevate tu favorito", image: "https://http2.mlstatic.com/D_Q_NP_2X_831919-MLA80765379430_112024-AB.webp", link: "#", description: "hola" },
  { title: "Lo querés", image: "https://http2.mlstatic.com/D_Q_NP_2X_915234-MLA86560753553_062025-AB.webp", link: "#", description: "hola" },
  { title: "Porque te interesa", image: "https://http2.mlstatic.com/D_Q_NP_2X_656762-MLU76340412611_052024-AB.webp", link: "#", description: "hola" },
  { title: "Comprá tu carrito", image: [
      "https://http2.mlstatic.com/D_Q_NP_2X_666676-MLA84176700768_052025-AC.webp",
      "https://http2.mlstatic.com/D_Q_NP_2X_695854-MLA80072252980_102024-AC.webp",
      "https://http2.mlstatic.com/D_Q_NP_2X_842813-MLU75591979177_042024-AC.webp"
    ], link: "#", description: "hola" },
  { title: "visto recientemente", image: "https://http2.mlstatic.com/D_Q_NP_2X_649930-MLA84841576185_052025-AB.webp", link: "#", description: "hola" },
  { title: "Medios de pago", image: "https://http2.mlstatic.com/frontend-assets/homes-palpatine/dynamic-access-desktop/payment-methods.svg", link: "#", description: "hola" },
  { title: "Menos de $20.000", image: "https://http2.mlstatic.com/frontend-assets/homes-palpatine/dynamic-access-desktop/low-price-product.svg", link: "#", description: "hola" },
  { title: "Mas vendidos", image: "https://http2.mlstatic.com/frontend-assets/homes-palpatine/dynamic-access-desktop/top-sale.svg", link: "#", description: "hola" },
  { title: "Compra protegida", image: "https://http2.mlstatic.com/frontend-assets/homes-palpatine/dynamic-access-desktop/buy-protected.svg", link: "#", description: "hola" },
  { title: "Tiendas oficiales", image: "https://http2.mlstatic.com/frontend-assets/homes-palpatine/dynamic-access-desktop/store-official.svg", link: "#", description: "hola" },
  { title: "Nuestras categorias", image: "https://http2.mlstatic.com/frontend-assets/homes-palpatine/dynamic-access-desktop/categories.svg", link: "#", description: "hola" },
];

// Lista de productos recomendados
const products = [
  { id: 1, title: "Xiaomi Redmi 14c", price: 196900, discount: null, image: "https://http2.mlstatic.com/D_Q_NP_2X_784839-MLA86924328056_072025-T.webp", envio: "Llega gratis hoy", oldPrice: "226000"},
  { id: 2, title: "ZTE Blade A54", price: 139999, discount: "39% OFF", image: "https://http2.mlstatic.com/D_Q_NP_2X_784839-MLA86924328056_072025-T.webp", envio: "Llega gratis mañana"},
  { id: 3, title: "TCL 505", price: 159999, discount: "30% OFF", image: "https://http2.mlstatic.com/D_Q_NP_2X_784839-MLA86924328056_072025-T.webp", cuotas: "Cuota promocionada en 6 cuotas de $30000", },
  { id: 1, title: "Xiaomi Redmi 14c", price: 196900, discount: null, image: "https://http2.mlstatic.com/D_Q_NP_2X_784839-MLA86924328056_072025-T.webp", cuotas: "en 3 cuotas de $75499"},
  { id: 2, title: "ZTE Blade A54", price: 139999, discount: "39% OFF", image: "https://http2.mlstatic.com/D_Q_NP_2X_784839-MLA86924328056_072025-T.webp", full: 1, envio: "Envio gratis"},
  { id: 3, title: "TCL 505", price: 159999, discount: "30% OFF", image: "https://http2.mlstatic.com/D_Q_NP_2X_784839-MLA86924328056_072025-T.webp", },
];

const Main = () => {
  const cardWidth = 180;
  const cardGap = 20;
  const visibleAreaWidth = 1000;
  const cardsPerPage = Math.floor(visibleAreaWidth / (cardWidth + cardGap));
  const totalPages = Math.ceil(cards.length / cardsPerPage);

  const [currentPage, setCurrentPage] = useState(0);
  const [index, setIndex] = useState(0);
  const sliderRef = useRef(null);
  const totalSlides = slider.length;

  // Rotación automática del slider principal
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Lógica de transición suave y bucle del slider
  useEffect(() => {
    const sliderElement = sliderRef.current;
    sliderElement.style.transition = "transform 1s ease-in-out";
    sliderElement.style.transform = `translateX(-${(index % (totalSlides + 1)) * 100}vw)`;

    if (index === totalSlides) {
      setTimeout(() => {
        sliderElement.style.transition = "none";
        sliderElement.style.transform = `translateX(0)`;
        setIndex(0);
      }, 1100);
    }
  }, [index, totalSlides]);

  return (
    <main className="main">

      <div className="back"></div>

      {/* Slider principal de imágenes */}
      <section className="hero">
        <div className="hero__slider" ref={sliderRef}>
          {[...slider, ...slider].map((item, idx) => (
            <div className="hero__slide" key={idx} style={{ backgroundImage: `url(${item.image})` }} />
          ))}
        </div>
        <div className="hero__overlay"></div>
      </section>

      {/* Slider horizontal de tarjetas con flechas */}
      <section className="card-slider">
        <div className="card-slider__container">
          {currentPage > 0 && (
            <button
              className="card-slider__arrow card-slider__arrow--left"
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <FiChevronLeft />
            </button>
          )}

          <div
            className="card-slider__slider"
            style={{
              transform: `translateX(-${currentPage * (cardWidth + cardGap) * cardsPerPage}px)`,
              transition: 'transform 0.5s ease',
            }}
          >
            {cards.map((card, idx) => (
              <div className="card-slider__card" key={idx}>
                <h3 className="card-slider__title">{card.title}</h3>
                <img className="card-slider__image" src={Array.isArray(card.image) ? card.image[0] : card.image} alt={card.title} />
                <div className="card-slider__description">{card.description}</div>
              </div>
            ))}
          </div>

          {currentPage < totalPages - 1 && (
            <button
              className="card-slider__arrow card-slider__arrow--right"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <FiChevronRight />
            </button>
          )}
        </div>
      </section>

      {/* Productos sugeridos */}
      <section className="product-carousel">
        <div className="product-carousel__container">
          <h2 className="product-carousel__title">Inspirado en lo último que viste</h2>
          <div className="product-carousel__list">
            {products.map((prod) => (
              <div className="product-carousel__card" key={prod.id}>
                <img className="product-carousel__image" src={prod.image} alt={prod.title} />
                <p className="product-carousel__name">{prod.title}</p>
                <div>
                  {prod.oldPrice && (
                    <p className="product-carousel__old-price">${prod.oldPrice.toLocaleString()}</p>
                  )}

                  <div className="product-carousel__price">${prod.price.toLocaleString()}</div>

                  {prod.discount && (
                    <span className="product-carousel__discount">{prod.discount}</span>
                  )}

                  {prod.cuotas && (
                    <p className="product-carousel__cuotas">{prod.cuotas}</p>
                  )}

                  {
                    prod.envio == "llega gratis hoy" ? (
                      <div>
                        <p className="product-carousel__envio">{prod.envio}</p>
                      </div>
                      )
                      : (<p className="product-carousel__envio">{prod.envio}</p>)
                  }
                  {prod.full && (
                    <span className="product-carousel__full">⚡ FULL</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de beneficios Meli Plus */}
      <section className="meli-plus">
        <div className="meli-plus__container">
          <div className="meli-plus__header">
            <p className="meli-plus__suscripcion">
              <img src="https://http2.mlstatic.com/resources/frontend/statics/loyal/partners/meliplus/home/meliplus-outline-pill@3x.png" alt="" /> Suscribite desde $3.490/mes
            </p>
            <button className="meli-plus__button">Suscribirme a Meli+</button>
          </div>

          <div className="meli-plus__body">
            <h2 className="meli-plus__title">Ahorrá en tus envíos y compras</h2>

            <ul className="meli-plus__benefits">
              <li className="meli-plus__benefit">
                <div className="meli-plus__container-i">
                  <i class="fa-solid fa-truck"></i>
                </div>
                <p>Envíos gratis en millones de productos desde $15.000</p>
              </li>
              <li className="meli-plus__benefit">
                <div className="meli-plus__container-i">
                  <i class="fa-regular fa-credit-card"></i>
                </div>
                <p>3 cuotas extra sin interés</p>
              </li>
              <li className="meli-plus__benefit">
                <div className="meli-plus__container-i">
                  <i class="fa-solid fa-burger"></i>
                </div>
                <p>Envío gratis en tus pedidos de "Restaurantes" desde $4.000</p>
              </li>
            </ul>
          </div>
        </div>
      </section>


      {/* Sección de video de Mercado Play */}
      <section className="mercado-play">
        <div className="mercado-play__container">
          <img className="mercado-play__background" src="https://http2.mlstatic.com/D_NQ_803027-MLU74643615266_022024-OO.webp" alt="fondo de mercado play" />
          <div className="mercado-play__overlay">
            <img  className="mercado-play__badge" src="https://http2.mlstatic.com/storage/homes-korriban/assets/images/touchpoint_trailer/logo-mercado-play-v3.png" alt="Mercado Play" />
            <div>
              <h2 className="mercado-play__title">¡Series y películas también en TV!</h2>
              <span className="mercado-play__label">GRATIS</span>
            </div>
            <div className="mercado-play__button" >Ir a mercado play</div>
          </div>

          <div className="mercado-play__video">
            <video autoPlay muted loop>
              <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>


    </main>
  );
};

export default Main;
