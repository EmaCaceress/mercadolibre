import React, { useEffect, useMemo, useState } from "react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import "./SliderButton.scss";
import { Link } from "react-router-dom";
import Card from "../Card/Card";

/** Normaliza una marca a un dominio "probable" para Clearbit
 *  Ej: "Calvin Klein" -> "calvinklein.com"
 *      "Dolce & Gabbana" -> "dolceandgabbana.com"
 */
function brandToDomain(brand) {

  if (!brand) return null;
  const base = brand
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // sin acentos
    .toLowerCase().trim();
  const nospace = base.replace(/\s+/g, "");           // sin espacios
  const cleaned = nospace.replace(/[^a-z0-9-]/g, ""); // quita símbolos raros
  return cleaned ? `${cleaned}.com` : null;
}

/** Badge de texto circular (fallback si el logo falla) */
function BrandTextBadge({ text, size = 80 }) {
  const initials = useMemo(
    () => (text || "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0]?.toUpperCase())
      .join(""),
    [text]
  );
  return (
    <div
      className="brand-badge brand-badge--round brand-badge--fallback"
      style={{ width: `${size}px`, height: `${size}px`, lineHeight: `${size}px` }}
      title={text}
      aria-label={text}
    >
      {initials || text}
    </div>
  );
}

/** Logo con Clearbit + fallback a texto */
function BrandLogo({ brand, size = 80 }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    // cada vez que cambia la marca, limpiá el estado de error anterior
    setFailed(false);
  }, [brand]);
  const domain = useMemo(() => brandToDomain(brand), [brand]);
  if (!brand) return null;
  if (failed || !domain) {
    return <BrandTextBadge text={brand} size={size} />;
  }

  return (
    
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt={brand}
      style={{ width: `${size}px`, minWidth: `${size}px`, height: `${size}px`, objectFit: "contain" }}
      className="brand-badge brand-badge--round"
      onError={() => setFailed(true)}
      loading="lazy"
      referrerPolicy="no-referrer"
      title={domain}
    />
  );
}
  
/**
 * SliderButtons
 * - slider: array de productos o marcas (string)
 * - title: título opcional
 * - cardw: ancho tarjeta (px)
 * - cardg: gap (px)
 * - cardH: alto del carrusel (px)
 */
const SliderButtons = ({ slider, title, cardw, cardg, cardH, cant = 9}) => {
  const [desplaceCards, setDesplaceCards] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const cardWidth = cardw;
  const cardGap = cardg;
  const visibleAreaWidth = (cardWidth + cardGap) * cant; // area del contenedor
  const cardsPerPage = Math.floor(visibleAreaWidth / (cardWidth + cardGap)) || 1; // area de cada card con su gap
  const totalPages = Math.ceil((slider?.length || 0) / cardsPerPage); //total de paginas

  const onPrev = () => setCurrentPage(p => Math.max(p - 1, 0));
  const onNext = () => setCurrentPage(p => Math.min(p + 1, totalPages - 1));

  useEffect(() => {
    const remaining = slider.length - currentPage * cardsPerPage;
    const displacementIndex =
      remaining < cardsPerPage
        ? Math.max(slider.length - cardsPerPage, 0)
        : currentPage * cardsPerPage; 
    setDesplaceCards((cardWidth + cardGap) * displacementIndex);
  }, [currentPage, slider.length, cardsPerPage, cardWidth, cardGap]);

  useEffect(() => {
    setCurrentPage(0);
    setDesplaceCards(0);
  }, [slider]);
  
  return (
    <>
      {currentPage > 0 && (
        <button className="slider-button slider-button--left" onClick={onPrev} style={{
          ...(cardH < 100 && {
          background: "transparent",
          left: "-60px",
          boxShadow: "none"
        })}}>
          <FiChevronLeft />
        </button>
      )}

      {title && <h2 className="slider-button__title">{title}</h2>}

      <div className="slider-button__containerList">
        <div
          className="slider-button__list"
          style={{
            transform: `translateX(-${desplaceCards}px)`,
            transition: "transform 0.3s ease-in-out",
            display: "flex",
            gap: `${cardGap}px`,
            height: `${cardH}px`,
          }}
        >
          {slider.map((prod, idx) =>
            typeof prod === "object" && prod !== null ? (
              <Card key={idx} prod={prod} cardWidth={cardWidth} />
            ) : (
              <Link to={`/search?q=${encodeURIComponent(prod)}`} key={String(prod)}>
                <BrandLogo brand={String(prod)} size={cardWidth} />
              </Link>
            )
          )}
        </div>
      </div>

      {currentPage < totalPages - 1 && (
        <button className="slider-button slider-button--right" onClick={onNext} style={{
          ...(cardH < 100 && {
          background: "transparent",
          right: "-60px",
          boxShadow: "none"
        })}}>
          <FiChevronRight />
        </button>
      )}
    </>
  );
};

export default SliderButtons;
