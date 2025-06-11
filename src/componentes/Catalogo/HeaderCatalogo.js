import React from "react";
import logo from "../img/logo_redimensionado.png";
import "./Catalogo.css";
import { useNavigate } from "react-router-dom";

const HeaderCatalogo = () => {

  const contactarPorWhatsApp = () => {
  const mensaje = "Quiero ser Proveedor de La Licorería El Parcero";
  const numero = "59175575589"; // ← tu número de WhatsApp
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
};

  return (
    <header className="catalogo-header">
      <div className="header-izquierda">
        <img src={logo} alt="Licorería El Parcero" className="logo-img" />
        <h1 className="titulo-header">Licorería El Parcero</h1>
      </div>
      <div className="header-derecha">
        <button className="btn-contacto" onClick={contactarPorWhatsApp}>
          📲 Te Gustaria ser Proveedor
        </button>
      </div>
    </header>
  );
};

export default HeaderCatalogo;
