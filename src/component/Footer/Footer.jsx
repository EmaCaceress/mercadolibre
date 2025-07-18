import React from "react";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Primera fila de íconos e info */}
        <div className="benefits">

            <div className="benefits__benefit">
                <img src="/icons/payment.svg" alt="Elegí cómo pagar" />
                <div className="benefits__text">
                <h3>Elegí cómo pagar</h3>
                <p>Podés pagar con tarjeta, débito, efectivo o con Cuotas sin Tarjeta.</p>
                <a href="#">Cómo pagar tus compras</a>
                </div>
            </div>

            <div className="benefits__divitions"/>

            <div className="benefits__benefit">
                <img src="/icons/shipping.svg" alt="Envío gratis desde $ 33.000" />
                <div className="benefits__text">
                <h3>Envío gratis desde $ 33.000</h3>
                <p>Solo por estar registrado en Mercado Libre tenés envíos gratis en miles de productos.</p>
                </div>
            </div>

            <div className="benefits__divitions"/>
            <div className="benefits__benefit">
                <img src="/icons/security.svg" alt="Seguridad de principio a fin" />
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

      {/* Logos y contacto */}
      <div className="footer__regulatory">
        <p>📧 ayuda@mercadolibre.com.ar</p>
        <div className="footer__logos">
          <img src="/logos/ssn.svg" alt="SSN" />
          <img src="/logos/usuarios-financieros.svg" alt="Usuarios Financieros" />
          <img src="/logos/datos.svg" alt="Datos QR" />
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
