import React, { useEffect, useState } from "react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import "./SliderButton.scss"; // Estilos específicos del componente

/**
 * SliderButtons
 * Componente que renderiza un carrusel horizontal de productos con botones de navegación izquierda y derecha.
 *
 * Props:
 * - slider: Array con la información de cada tarjeta (producto)
 * - title: Texto opcional para mostrar como título del carrusel
 * - cardw: Ancho de cada tarjeta (en px)
 * - cardg: Separación entre tarjetas (en px)
 */
const SliderButtons = ({ slider, title, cardw, cardg }) => {
  // Estado para guardar el desplazamiento en píxeles del carrusel
  const [desplaceCards, setDesplaceCards] = useState(0);

  // Parámetros derivados de las props
  const cardWidth = cardw;  // Ancho de una tarjeta
  const cardGap = cardg;    // Espacio entre tarjetas

  // El ancho total visible (6 tarjetas en pantalla, se puede pasar como prop si es dinámico)
  const visibleAreaWidth = (cardWidth + cardGap) * 6;

  // Número de tarjetas que caben en una "página"
  const cardsPerPage = Math.floor(visibleAreaWidth / (cardWidth + cardGap));

  // Número total de páginas
  const totalPages = Math.ceil(slider.length / cardsPerPage);

  // Página actual del carrusel (0 = primera página)
  const [currentPage, setCurrentPage] = useState(0);

  /**
   * Función para ir a la página anterior
   */
  const onPrev = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  /**
   * Función para ir a la página siguiente
   */
  const onNext = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };

  /**
   * Efecto que recalcula el desplazamiento (en píxeles) cada vez que cambia la página actual.
   * 
   * Lógica:
   * - Si estamos en la última página y no hay suficientes elementos para llenar una página completa,
   *   desplazamos solo lo necesario para que los productos restantes se vean bien.
   * - En cualquier otro caso, desplazamos el ancho de una página multiplicado por la página actual.
   */
  useEffect(() => {
    const remainingCards = slider.length - currentPage * cardsPerPage;

    // Determina cuántas tarjetas desplazarse
    const displacementIndex =
      remainingCards < cardsPerPage
        ? slider.length - cardsPerPage
        : currentPage * cardsPerPage;

    // Convierte ese índice a píxeles
    setDesplaceCards((cardWidth + cardGap) * displacementIndex);

  }, [currentPage, slider.length, cardsPerPage, cardWidth, cardGap]);

  return (
    <>
      {/* Botón izquierdo (solo se muestra si no estamos en la primera página) */}
      {currentPage > 0 && (
        <button
          className="slider-button slider-button--left"
          onClick={onPrev}
        >
          <FiChevronLeft />
        </button>
      )}

      {/* Título opcional del carrusel */}
      {title && <h2 className="product-carousel__title">{title}</h2>}

      {/* Contenedor principal del carrusel */}
      <div className="product-carousel__containerList">
        <div
          className="product-carousel__list"
          style={{
            transform: `translateX(-${desplaceCards}px)`,
            transition: "transform 0.3s ease-in-out",
            display: "flex",
            gap: `${cardGap}px`,
          }}
        >
          {slider.map((prod) => (
            <div
              className="product-carousel__card"
              key={prod.id}
              style={{ minWidth: `${cardWidth}px` }}
            >
              {/* Título superior */}
              <p className="product-carousel__titleFirst">{prod.titleFirst}</p>

              {/* Imagen del producto */}
              
              
              {
                Array.isArray(prod.image) && prod.image.length === 3 ? (
                  <div className="product-carousel__images">
                    {prod.image.map((obj, index) => (
                      <img
                        key={index}
                        className="product-carousel__image--cart"
                        src={obj}
                        alt={prod.title}
                      />
                    ))}
                  </div>
                ) : (
                  <img
                    className="product-carousel__image"
                    src={prod.image}
                    alt={prod.title}
                  />
                )
              }
              {/* Nombre del producto */}
              <p className="product-carousel__name">{prod.titleSecond}</p>

              <div>
                {/* Precio tachado (si existe) */}
                {prod.oldPrice && (
                  <p className="product-carousel__old-price">
                    ${prod.oldPrice.toLocaleString()}
                  </p>
                )}

                {/* Precio actual con descuento (si existe) */}
                {prod.price && (
                  <div className="product-carousel__containerPrice">
                    <div className="product-carousel__price">
                      ${prod.price.toLocaleString()}
                    </div>
                    {prod.discount && (
                      <span className="product-carousel__discount">
                        {prod.discount}
                      </span>
                    )}
                  </div>
                )}

                {/* Cuotas disponibles (si existe)*/}
                {prod.cuotas && (
                  <p className="product-carousel__cuotas">{prod.cuotas}</p>
                )}

                {/* Envío (si existe)*/}
                {prod.envio === "llega gratis hoy" ? (
                  <div>
                    <p className="product-carousel__envio">{prod.envio}</p>
                  </div>
                ) : (
                  <p
                    className={`product-carousel__envio ${
                      prod.envio ? "hoy" : ""
                    }`}
                  >
                    {prod.envio}
                  </p>
                )}

                {/* Sello FULL (si existe)*/}
                {prod.full && (
                  <span className="product-carousel__full">⚡ FULL</span>
                )}
              </div>

              {
                prod.button && (
                  <a href={prod.buttonLink} className="product-carousel__link">
                    {prod.button}
                  </a>
                )
              }

            </div>
          ))}
        </div>
      </div>

      {/* Botón derecho (solo se muestra si no estamos en la última página) */}
      {currentPage < totalPages - 1 && (
        <button
          className="slider-button slider-button--right"
          onClick={onNext}
        >
          <FiChevronRight />
        </button>
      )}
    </>
  );
};

export default SliderButtons;
