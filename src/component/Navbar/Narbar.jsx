import React from 'react';
import './Navbar.scss';
import { Search } from 'lucide-react';
import { Bell, ShoppingCart } from 'lucide-react'; // o usa íconos SVG propios
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar__container">
        {/* LOGO DE MERCADO LIBRE */}
        <div className="navbar__logo">
          <Link to={`/`}>
          <img
            src="https://http2.mlstatic.com/frontend-assets/ml-web-navigation/ui-navigation/6.6.130/mercadolibre/logo_large_plus@2x.webp"
            alt="Logo Mercado Libre"
          />
          </Link>
        </div>

        {/* BUSCADOR */}
        <div className="navbar__search">
          <input type="text" placeholder="Buscar productos, marcas y más..." />
          <button>
            <div className='navbar__search__divider'></div>
            <Search size={20} />
          </button>
        </div>

        {/* PUBLICIDAD */}
        <div className="navbar__publicity">
          <img 
            src="https://http2.mlstatic.com/D_NQ_724333-MLA84405973064_052025-OO.webp" 
            alt="Publicidad meli+" 
          />
        </div>

        {/* UBICACION */}
        <div className='navbar__ubication'> 
          <i class="fa-solid fa-location-dot" size={20}></i>
          <div>
            <div>Emanuel Chacon</div>
            <div>Calle 111 1473</div>
          </div>
        </div>

        {/* LINKS */}
        <div className='navbar__sections'>
          <ul className="navbar__sections__links">       
            <li><a href="#">Categorías</a></li>
            <li><a href="#">Ofertas</a></li>
            <li><a href="#">Cupones</a></li>
            <li><a href="#">Supermercado</a></li>
            <li><a href="#">Mercado Play</a>{/* Gratis */}</li>
            <li><a href="#">Vender</a></li>
            <li><a href="#">Ayuda</a></li>
          </ul>
        </div>

        {/* USUARIO */}
        <div className='navbar__user'>
          <div className='navbar__user__sections'>
            <div className='navbar__user__account'>
              <div className="navbar__user__profile">EC</div>
              <span className="navbar__user__name">emanuel</span>
            </div>
            <div className="navbar__user__link">Mis compras</div>
            <div className="navbar__user__link">Favoritos</div>
            <div className="navbar__user__icon">
              <Bell size={18}/>
              <span className="navbar__user__badge navbar__user__badge-notification">1</span>
            </div>
            <div className="navbar__user__icon">
              <ShoppingCart size={18}/>
              <span className="navbar__user__badge ">12</span>
            </div>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;