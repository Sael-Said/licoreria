import React from "react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa6";
import "./Catalogo.css";

const FooterCatalogo = () => {
  return (
    <footer className="catalogo-footer">
      <p>📍 Av. Cardenal Julio Terrazas S/N, Vallegrande</p>
      <p>📞 Tel: 78945612 | ✉️ contacto@elparcero.com</p>
      
      <div className="footer-redes">
        <p>Síguenos en nuestras redes sociales:</p>
        <a
          href="https://facebook.com/elparcero" 
          target="_blank" 
          rel="noopener noreferrer"
          className="footer-icon facebook"
        >
          <FaFacebookF />
        </a>
        <a
          href="https://instagram.com/elparcero" 
          target="_blank" 
          rel="noopener noreferrer"
          className="footer-icon instagram"
        >
          <FaInstagram />
        </a>
        <a
          href="https://www.tiktok.com/@elparcero"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-icon tiktok"
        >
          <FaTiktok />
        </a>
      </div>

      <p>© 2025 Licorería El Parcero. Todos los derechos reservados.</p>
    </footer>
  );
};

export default FooterCatalogo;
