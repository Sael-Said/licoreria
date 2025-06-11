import React, { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import RegistrarVenta from "./usuario/RegistrarVenta";
import ReporteVentasUsuario from "./usuario/MisVentas";
import VerStockProductos from './usuario/VerStock';

import "./UsuarioPanel.css";

const username = localStorage.getItem("username") || "Usuario";

const UsuarioPanel = ({ setAuth }) => {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authData");
    setAuth({
      token: null,
      user_id: null,
      username: null,
      rol: null,
    });
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  return (
    <div className="usuario-panel-container">
      {/* Botón hamburguesa */}
      <button className="hamburger" onClick={toggleMenu}>
        ☰
      </button>

      <aside className={`usuario-sidebar ${menuAbierto ? "open" : ""}`}>
        <h2>👋 Bienvenido, {username}</h2>
        <nav>
          <ul>
            <li><Link to="/usuario/registrar-venta" onClick={toggleMenu}>Registrar Venta</Link></li>
            <li><Link to="/usuario/reportes" onClick={toggleMenu}>Mis Ventas</Link></li>
            <li><Link to="/usuario/stock" onClick={toggleMenu}>Stock de Productos</Link></li>
            <li>
  <button onClick={handleLogout} className="logout-button">
    <FaSignOutAlt style={{ marginRight: "8px" }} />
    Cerrar sesión
  </button>
</li>

          </ul>
        </nav>
      </aside>

      <main className="usuario-main">
        <Routes>
          <Route path="registrar-venta" element={<RegistrarVenta />} />
          <Route path="reportes" element={<ReporteVentasUsuario />} />
          <Route path="stock" element={<VerStockProductos />} />
          <Route path="*" element={<RegistrarVenta />} />
        </Routes>
      </main>
    </div>
  );
};

export default UsuarioPanel;
