// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./componentes/Login";
import AdminLayout from "./componentes/comunes/AdminLayout";
import UsuarioPanel from "./componentes/UsuarioPanel";
import Catalogo from './componentes/Catalogo/Catalogo';

import SidebarContext from "./componentes/comunes/SidebarContext";

const App = () => {
  const [auth, setAuth] = useState({
    token: null,
    user_id: null,
    username: null,
    rol: null,
  });

  const [menuOpen, setMenuOpen] = useState(true);
  const [cargando, setCargando] = useState(true); // ✅ nuevo estado de carga

  useEffect(() => {
    const storedAuth = localStorage.getItem("authData");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
    setCargando(false); // ✅ terminamos de cargar
  }, []);

  if (cargando) return <div>Cargando...</div>; // ✅ evita mostrar rutas antes de tiempo

  return (
    <Router>
      <SidebarContext.Provider value={{ menuOpen, setMenuOpen }}>
        <Routes>
          {/* ✅ Ruta pública accesible siempre */}
          <Route path="/catalogo" element={<Catalogo />} />

          {/* No autenticado */}
          {!auth.token && (
            <>
              <Route path="/login" element={<Login setAuth={setAuth} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}

          {/* Administrador */}
          {auth.token && auth.rol === "administrador" && (
            <>
              <Route path="/admin/*" element={<AdminLayout setAuth={setAuth} />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </>
          )}

          {/* Usuario */}
          {auth.token && auth.rol === "usuario" && (
            <>
              <Route path="/usuario/*" element={<UsuarioPanel setAuth={setAuth} />} />
              <Route path="*" element={<Navigate to="/usuario/registrar-venta" replace />} />
            </>
          )}
        </Routes>
      </SidebarContext.Provider>
    </Router>
  );
};

export default App;
