import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import {
  FaBars, FaHome, FaBoxOpen, FaUser, FaShoppingCart,
  FaFileAlt, FaTruck, FaSignOutAlt, FaMoneyBillWave
} from "react-icons/fa";
import SidebarContext from "./SidebarContext";

const Sidebar = ({ children, setAuth }) => {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth > 768);
  const [openProductos, setOpenProductos] = useState(false);
  const [openUsuarios, setOpenUsuarios] = useState(false);
  const [openCompras, setOpenCompras] = useState(false);
  const [openReportes, setOpenReportes] = useState(false);
  const [openProveedores, setOpenProveedores] = useState(false);
  const [openCuentas, setOpenCuentas] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [menuOpen, setMenuOpen] = useState(window.innerWidth > 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setMenuOpen(!mobile);
      setIsCollapsed(mobile ? false : true);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setIsCollapsed(false);
  };

  const handleMouseEnter = () => {
    if (!isMobile) setIsCollapsed(false);
  };

  const handleMouseLeave = () => {
    if (!isMobile) setIsCollapsed(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("authData");
    if (setAuth) {
      setAuth({
        token: null,
        user_id: null,
        username: null,
        rol: null,
      });
    }
    navigate("/login");
  };

  return (
    <SidebarContext.Provider value={{ menuOpen, isCollapsed }}>
      {isMobile && (
        <button className="mobile-menu-button" onClick={toggleMenu}>
          <FaBars />
        </button>
      )}

      {isMobile && menuOpen && (
        <div className="sidebar-overlay open" onClick={toggleMenu}></div>
      )}

      {menuOpen && (
        <div
          className={`sidebar-container ${isCollapsed && !isMobile ? "collapsed" : ""} ${isMobile && menuOpen ? "open" : ""}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="sidebar-header">
            {(!isCollapsed || isMobile) && (
  <div className="sidebar-welcome">
    <FaUser className="sidebar-user-icon" />
    <span>Bienvenido, {localStorage.getItem("username") || "Admin"}</span>
  </div>
)}

          </div>

          <ul className="sidebar-menu">
            <li className="sidebar-item">
              <Link to="/admin" className="sidebar-link" onClick={() => isMobile && setMenuOpen(false)}>
                <FaHome className="sidebar-icon" />
                {!isCollapsed && "Dashboard"}
              </Link>
            </li>

            {/* Productos */}
            <li className="sidebar-item">
              <div className="sidebar-link" onClick={() => setOpenProductos(!openProductos)}>
                <FaBoxOpen className="sidebar-icon" />
                {!isCollapsed && "Productos"}
              </div>
              {openProductos && !isCollapsed && (
                <ul className="sidebar-submenu">
                  <li><Link to="/admin/productos" className="sidebar-sublink" onClick={() => isMobile && setMenuOpen(false)}>Inventario</Link></li>
                  <li><Link to="/admin/agregar_productos" className="sidebar-sublink" onClick={() => isMobile && setMenuOpen(false)}>Agregar Producto</Link></li>
                  <li><Link to="/admin/categorias" className="sidebar-sublink" onClick={() => isMobile && setMenuOpen(false)}>Lista de Categorías</Link></li>
                </ul>
              )}
            </li>

            {/* Usuarios */}
            <li className="sidebar-item">
              <div className="sidebar-link" onClick={() => setOpenUsuarios(!openUsuarios)}>
                <FaUser className="sidebar-icon" />
                {!isCollapsed && "Usuarios"}
              </div>
              {openUsuarios && !isCollapsed && (
                <ul className="sidebar-submenu">
                  <li><Link to="/admin/usuarios/agregar-usuario" className="sidebar-sublink" onClick={() => isMobile && setMenuOpen(false)}>Agregar Usuario</Link></li>
                  <li><Link to="/admin/administradores/agregar-administrador" className="sidebar-sublink" onClick={() => isMobile && setMenuOpen(false)}>Agregar Administrador</Link></li>
                  <li><Link to="/admin/usuarios/listar-usuarios" className="sidebar-sublink" onClick={() => isMobile && setMenuOpen(false)}>Lista de Usuario</Link></li>
                  <li><Link to="/admin/usuarios/listar-administradores" className="sidebar-sublink" onClick={() => isMobile && setMenuOpen(false)}>Lista de Administradores</Link></li>
                </ul>
              )}
            </li>

            {/* Compras */}
            <li className="sidebar-item">
              <div className="sidebar-link" onClick={() => setOpenCompras(!openCompras)}>
                <FaShoppingCart className="sidebar-icon" />
                {!isCollapsed && "Compras"}
              </div>
              {openCompras && !isCollapsed && (
                <ul className="sidebar-submenu">
                  <li><Link to="/admin/registrar-compras" className="sidebar-sublink" onClick={() => isMobile && setMenuOpen(false)}>Registrar Compras</Link></li>
                  <li><Link to="/admin/listar-compras" className="sidebar-sublink" onClick={() => isMobile && setMenuOpen(false)}>Lista de Compras</Link></li>
                </ul>
              )}
            </li>

            {/* Reportes */}
            <li className="sidebar-item">
              <div className="sidebar-link" onClick={() => setOpenReportes(!openReportes)}>
                <FaFileAlt className="sidebar-icon" />
                {!isCollapsed && "Reportes"}
              </div>
              {openReportes && !isCollapsed && (
                <ul className="sidebar-submenu">
                  <li><Link to="/admin/administradores/reportes-administrador" className="sidebar-sublink" onClick={() => isMobile && setMenuOpen(false)}>Reportes de Administradores</Link></li>
                  <li><Link to="/admin/administradores/reportes-compras" className="sidebar-sublink" onClick={() => isMobile && setMenuOpen(false)}>Reportes de Compras</Link></li>
                  <li><Link to="/admin/administradores/reportes-ventas" className="sidebar-sublink" onClick={() => isMobile && setMenuOpen(false)}>Reportes de Ventas</Link></li>
                </ul>
              )}
            </li>

            {/* Proveedores */}
            <li className="sidebar-item">
              <div className="sidebar-link" onClick={() => setOpenProveedores(!openProveedores)}>
                <FaTruck className="sidebar-icon" />
                {!isCollapsed && "Proveedores"}
              </div>
              {openProveedores && !isCollapsed && (
                <ul className="sidebar-submenu">
                  <li><Link to="/admin/listar-proveedores" className="sidebar-sublink" onClick={() => isMobile && setMenuOpen(false)}>Lista de Proveedores</Link></li>
                  <li><Link to="/admin/agregar-proveedores" className="sidebar-sublink" onClick={() => isMobile && setMenuOpen(false)}>Agregar Proveedores</Link></li>
                </ul>
              )}
            </li>

            {/* Cuentas por Pagar */}
            <li className="sidebar-item">
              <div className="sidebar-link" onClick={() => setOpenCuentas(!openCuentas)}>
                <FaMoneyBillWave className="sidebar-icon" />
                {!isCollapsed && "Cuentas por Pagar"}
              </div>
              {openCuentas && !isCollapsed && (
                <ul className="sidebar-submenu">
                  <li><Link to="/admin/cuentas-por-pagar" className="sidebar-sublink" onClick={() => isMobile && setMenuOpen(false)}>Ver Cuentas por Pagar</Link></li>
                </ul>
              )}
            </li>

            {/* Logout */}
            <li className="sidebar-item logout-item">
              <div className="sidebar-link" onClick={handleLogout}>
                <FaSignOutAlt className="sidebar-icon" />
                {!isCollapsed && "Cerrar Sesión"}
              </div>
            </li>
          </ul>
        </div>
      )}

      <div
        className="main-content"
        style={{
          marginLeft: isMobile ? (menuOpen ? "250px" : "0") : (isCollapsed ? "70px" : "250px"),
          padding: "20px",
          transition: "margin-left 0.3s ease",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
};

export default Sidebar;
