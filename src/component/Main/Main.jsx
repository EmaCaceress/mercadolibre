// Main.jsx
import React, { useEffect, useRef, useState } from "react";
import "./Main.scss";
import SliderButtons from "../Botton/SliderButton";

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
  { id: 1, price: 139999, full: 1, envio: "Envio gratis", titleFirst: "Llevate tu favorito", image: "https://http2.mlstatic.com/D_Q_NP_2X_831919-MLA80765379430_112024-AB.webp", link: "#", description: "hola" },
  { id: 2, titleFirst: "Lo querés", oldPrice: 226000, price: 196900, envio: "Llega gratis hoy", image: "https://http2.mlstatic.com/D_Q_NP_2X_915234-MLA86560753553_062025-AB.webp", link: "#", description: "hola" },
  { id: 3, titleFirst: "Porque te interesa", oldPrice: 400000, price: 139999, discount: "39% OFF", image: "https://http2.mlstatic.com/D_Q_NP_2X_656762-MLU76340412611_052024-AB.webp", link: "#", description: "hola" },
  { id: 4, titleFirst: "Comprá tu carrito", image: [
      "https://http2.mlstatic.com/D_Q_NP_2X_666676-MLA84176700768_052025-AC.webp",
      "https://http2.mlstatic.com/D_Q_NP_2X_695854-MLA80072252980_102024-AC.webp",
      "https://http2.mlstatic.com/D_Q_NP_2X_842813-MLU75591979177_042024-AC.webp"
    ], link: "#", description: "hola", button:"Ir al carrito", buttonLink:"./" },
  { id: 5, titleFirst: "visto recientemente",cuotas: "Cuota promocionada en 6 cuotas de $30000", price: 196900, image: "https://http2.mlstatic.com/D_Q_NP_2X_649930-MLA84841576185_052025-AB.webp", link: "#" },
  { id: 6, titleFirst: "Medios de pago", button:"Conocer medios de pago", buttonLink:"./", image: "https://http2.mlstatic.com/frontend-assets/homes-palpatine/dynamic-access-desktop/payment-methods.svg", link: "#", titleSecond: "Paga tus compras de forma rapida y segura" },
  { id: 7, titleFirst: "Menos de $20.000", button:"Mostrar productos", buttonLink:"./", image: "https://http2.mlstatic.com/frontend-assets/homes-palpatine/dynamic-access-desktop/low-price-product.svg", link: "#", titleSecond: "Descrubri productos con precios bajos" },
  { id: 8, titleFirst: "Mas vendidos", button:"Ir a mas  vendidos", buttonLink:"./", image: "https://http2.mlstatic.com/frontend-assets/homes-palpatine/dynamic-access-desktop/top-sale.svg", link: "#", titleSecond: "Explora los productos que son tendencia" },
  { id: 9, titleFirst: "Compra protegida", button:"Como funciona", buttonLink:"./", image: "https://http2.mlstatic.com/frontend-assets/homes-palpatine/dynamic-access-desktop/buy-protected.svg", link: "#", titleSecond: "Podes devolver tu compra gratis" },
  { id: 10, titleFirst: "Tiendas oficiales", button:"Mostrar tiendas", buttonLink:"./", image: "https://http2.mlstatic.com/frontend-assets/homes-palpatine/dynamic-access-desktop/store-official.svg", link: "#", titleSecond: "Encontra tus marcas preferidas" },
  { id: 11, titleFirst: "Nuestras categorias", button:"Ir a categorias", buttonLink:"./", image: "https://http2.mlstatic.com/frontend-assets/homes-palpatine/dynamic-access-desktop/categories.svg", link: "#", titleSecond: "Encontra celulares, ropa, inmuebles y mas" },
];

// Lista de productos recomendados
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

const Main = () => {
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
            <div
              className="hero__slide"
              key={`${item.title}-${idx}`} // ahora la key es única
              style={{ backgroundImage: `url(${item.image})` }}
            />
          ))}
        </div>
        <div className="hero__overlay"></div>
      </section>

      {/* Slider horizontal de tarjetas con flechas */}
      <section className="card-slider">
        <div className="card-slider__container">
          <SliderButtons slider={cards} cardw={185} cardg={15}/>

          {/* <div
            className="card-slider__slider"
          >
            {cards.map((card, idx) => (
              <div className="card-slider__card" key={idx}>
                <h3 className="card-slider__title">{card.title}</h3>
                <img className="card-slider__image" src={Array.isArray(card.image) ? card.image[0] : card.image} alt={card.title} />
                <div className="card-slider__description">{card.description}</div>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* Productos sugeridos */}
      <section className="product-carousel">
        <div className="product-carousel__container">
          <SliderButtons slider={products} title={"Inspirado en lo último que viste"} cardw={170} cardg={20}/>
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
