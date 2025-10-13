import React from "react";
import { useState } from "react";
import "./Footer.scss";

const Footer = () => {
  const [infoVisible, setInfoVisible] = useState(false);

  const toggleInfo = () => {
    setInfoVisible(!infoVisible);
  };

  return (
    <footer className="footer">
      {/* Primera fila de íconos e info */}
        <div className="benefits">

            <div className="benefits__benefit">
                <i className="fa-solid fa-credit-card"></i>
                <div className="benefits__text">
                <h3>Elegí cómo pagar</h3>
                <p>Podés pagar con tarjeta, débito, efectivo o con Cuotas sin Tarjeta.</p>
                <a href="#">Cómo pagar tus compras</a>
                </div>
            </div>

            <div className="benefits__divitions"/>

            <div className="benefits__benefit">
                <i className="fa-solid fa-box-archive"></i>
                <div className="benefits__text">
                <h3>Envío gratis desde $ 33.000</h3>
                <p>Solo por estar registrado en Mercado Libre tenés envíos gratis en miles de productos.</p>
                </div>
            </div>

            <div className="benefits__divitions"/>
            <div className="benefits__benefit">
                <i className="fa-solid fa-shield"></i>
                <div className="benefits__text">
                <h3>Seguridad, de principio a fin</h3>
                <p>¿No te gusta? ¡Devolvelo! En Mercado Libre, no hay nada que no puedas hacer, porque estás siempre protegido.</p>
                <a href="#">Cómo te protegemos</a>
                </div>
            </div>

        </div>


      {/* Segunda fila: enlaces legales y ayuda */}
      <div className="legal">
        <div className="legal__box">
          <h4>Botón de arrepentimiento</h4>
          <a href="#">Cancelar una compra</a>
          <a href="#">Cancelar una suscripción</a>
          <a href="#">Cancelar un seguro o garantía</a>
        </div>
        <div className="legal__box">
          <h4>Conocé las normas que aplican cuando compras</h4>
          <a href="#">Ver contratos de adhesión - Ley N.º 24.240 de Defensa del Consumidor</a>
        </div>
      </div>

      <div className="information">
        <div className="information__container">
          <div className={`information__title ${infoVisible ? "visible" : "hidden"}`} onClick={toggleInfo}>
            <h1>Mas informacion</h1>
            <i className={`fa-solid ${infoVisible ? "fa-arrow-down" : "fa-arrow-up"}`}></i>
          </div>
          <div className={`information__text ${infoVisible ? "visible" : "hidden"}`}>
            <div className="information__columns">
              <div className="information__column">
                <h4>Acerca de</h4>
                <ul>
                  <li><a href="#">Mercado Libre</a></li>
                  <li><a href="#">Investor relations</a></li>
                  <li><a href="#">Tendencias</a></li>
                  <li><a href="#">Sustentabilidad</a></li>
                  <li><a href="#">Blog</a></li>
                </ul>
              </div>

              <div className="information__column">
                <h4>Otros sitios</h4>
                <ul>
                  <li><a href="#">Developers</a></li>
                  <li><a href="#">Mercado Pago</a></li>
                  <li><a href="#">Mercado Shops</a></li>
                  <li><a href="#">Envíos</a></li>
                  <li><a href="#">Mercado Ads</a></li>
                </ul>
              </div>

              <div className="information__column">
                <h4>Ayuda</h4>
                <ul>
                  <li><a href="#">Comprar</a></li>
                  <li><a href="#">Vender</a></li>
                  <li><a href="#">Resolución de problemas</a></li>
                  <li><a href="#">Centro de seguridad</a></li>
                </ul>
              </div>

              <div className="information__column">
                <h4>Redes sociales</h4>
                <ul>
                  <li><a href="#">X</a></li>
                  <li><a href="#">Facebook</a></li>
                  <li><a href="#">Instagram</a></li>
                  <li><a href="#">YouTube</a></li>
                </ul>
              </div>

              <div className="information__column">
                <h4>Mi cuenta</h4>
                <ul>
                  <li><a href="#">Resumen</a></li>
                  <li><a href="#">Favoritos</a></li>
                  <li><a href="#">Vender</a></li>
                </ul>
              </div>

              <div className="information__column">
                <h4>Suscripciones</h4>
                <ul>
                  <li><a href="#">Meli+</a></li>
                  <li><a href="#">Disney+</a></li>
                  <li><a href="#">HBO Max</a></li>
                  <li><a href="#">Paramount+</a></li>
                  <li><a href="#">ViX Premium</a></li>
                  <li><a href="#">Universal+</a></li>
                </ul>
              </div>

              <div className="information__column">
                <h4>Temporadas</h4>
                <ul>
                  <li><a href="#">Hot Sale</a></li>
                  <li><a href="#">Cyber Monday</a></li>
                  <li><a href="#">Black Friday</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pie de página inferior */}
      <div className="footer__bottom">
        <ul>
          <li><a href="#">Trabajá con nosotros</a></li>
          <li><a href="#">Términos y condiciones</a></li>
          <li><a href="#">Promociones</a></li>
          <li><a href="#">Cómo cuidamos tu privacidad</a></li>
          <li><a href="#">Accesibilidad</a></li>
          <li><a href="#">Información al usuario financiero</a></li>
          <li><a href="#">Ayuda</a></li>
          <li><a href="#">Defensa del Consumidor</a></li>
          <li><a href="#">Información sobre seguros</a></li>
          <li><a href="#">Libro de quejas online</a></li>
        </ul>
        <p>
          Copyright © 1999-2025 MercadoLibre S.R.L. <br />
          Av. Caseros 3039, Piso 2, CP 1264, Parque Patricios, CABA
        </p>
      </div>
    </footer>
  );
};

export default Footer;
