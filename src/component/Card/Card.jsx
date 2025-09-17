import "./Card.scss";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

const Card = ({prod, cardWidth}) => {
    console.log(prod)
  return (
    <Link to={`/products/${prod.id}`}
        className="card"
        key={prod.id}
        style={{ minWidth: `${cardWidth}px` }}
    >
        {/* Título superior */}
        {prod.titleFirst && (
            <p className="card__titleFirst">{prod.titleFirst}</p>
        )}

        {/* Imagen del producto */}
        {
        Array.isArray(prod.image) && prod.image.length === 3 ? (
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
        )
        }
    
    <div className="card__container">
        {/* Nombre del producto */}
        {prod.titleSecond && (
        <p className="card__name">{prod.titleSecond}</p>
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
            {prod.envio.time}
            </p>
        ) : null}

        {/* Sello FULL (si existe) */}
        {prod.envio?.time && prod.envio?.full && (
            <span className="card__full">⚡ FULL</span>
        )}

        </div>

        {
        prod.button && (
            <div href={prod.buttonLink} className="card__link">
            {prod.button}
            </div>
        )
        }
    </Link>
  )
}

export default Card;