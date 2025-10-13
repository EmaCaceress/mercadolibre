import "./Card.scss";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Star from "../Star/Star";

const Card = ({ prod, cardWidth, cardHeight }) => {
  return (
    <Link
      to={`/products/${prod.id}`}
      className="card"
      key={prod.id}
      style={{
        minWidth: `${cardWidth}px`,
        minHeight: `${cardHeight}px`,
        gridTemplateRows: cardHeight > 300 ? "270px auto" : "200 auto",
      }}
    >
      {/* Título superior */}
      {prod.titleFirst && (
        <p className="card__titleFirst">{prod.titleFirst}</p>
      )}

      {/* Imagen del producto */}
      {Array.isArray(prod.image) && prod.image.length === 3 ? (
        <div className="card__images">
          {prod.image.map((obj, index) => (
            <img
              key={index}
              className="card__image--cart"
              src={obj}
              alt={prod.title}
            />
          ))}
        </div>
      ) : (
        <div className="card__image">
          <img
            className="card__image--individual"
            src={prod.image}
            alt={prod.title}
          />
        </div>
      )}

      <div className="card__container">
        {/* Nombre del producto */}
        {prod.titleSecond && (
          <p className="card__name">{prod.titleSecond}</p>
        )}

        {Number(cardWidth) >= 200 && (
          <div>
            <p className="card__name--extra">{prod.brand}</p>
            <Star value={Math.round(prod.rating)} />
          </div>
        )}

        {/* Precio tachado (si existe) */}
        {prod.oldPrice && (
          <p className="card__old-price">
            ${prod.oldPrice.toLocaleString()}
          </p>
        )}

        {/* Precio actual con descuento (si existe) */}
        {prod.price && (
          <div className="card__containerPrice">
            <div className="card__price">
              ${prod.price.toLocaleString()}
            </div>
            {prod.discount && (
              <span className="card__discount">
                {prod.discount}
              </span>
            )}
          </div>
        )}

        {/* Cuotas disponibles (si existe)*/}
        {prod.cuotas && (
          <p className="card__cuotas">{prod.cuotas}</p>
        )}

        {/* Envío (si existe) */}
        {prod.envio ? (
          <p
            className={`card__envio ${
              prod.envio.time === "Llega gratis hoy" ? "hoy" : ""
            }`}
          >
            {Number(cardWidth) >= 200 ? prod.envio.time : "Envio gratis"}
          </p>
        ) : null}

        {/* Sello FULL (si existe) */}
        {prod.envio?.time && prod.envio?.full && (
          <span className="card__full">⚡ FULL</span>
        )}

        {/* COMPRA INTERNACIONAL */}
        {prod.international && (
          <p className="card__intl">COMPRA INTERNACIONAL</p>
        )}
      </div>

      {prod.button && (
        <div href={prod.buttonLink} className="card__link">
          {prod.button}
        </div>
      )}

      {/* OTRA OPCIÓN DE COMPRA */}
      {Number(cardWidth) >= 200 && prod.promoCuota && (
        <div className="card__alt-offer">
          <p className="card__alt-title">Otra opción de compra</p>

          <div className="card__alt-row">
            <span className="card__alt-price">
              ${Math.round(prod.promoCuota.price).toLocaleString("es-AR")}
            </span>
          </div>

          <p className="card__alt-cuotas">
            Mismo precio 3 cuotas de $
            {Math.round(prod.promoCuota.cuota).toLocaleString("es-AR")}
          </p>
        </div>
      )}
    </Link>
  );
};

export default Card;
