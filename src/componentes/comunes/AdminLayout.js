// src/componentes/comunes/AdminLayout.js
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import Dashboard from "../admin/Dashboard";
import Productos from "../admin/Productos";
import Categorias from "../admin/Categorias";
import Usuarios from "../admin/Usuarios";
import VentasUsuario from "../admin/VentasUsuario";
import AgregarUsuario from "../admin/AgregarUsuario";
import AgregarAdministrador from "../admin/AgregarAdministrador";
import ListaUsuarios from "../admin/ListaUsuarios";
import ListaAdministradores from "../admin/ListaAdministradores";
import AgregarProveedor from "../admin/AgregarProveedor";
import ListaProveedores from "../admin/ListaProveedores";
import RegistrarCompras from "../admin/RegistrarCompras";
import ListaCompras from "../admin/ListaCompras";
import ReportesAdministradores from "../admin/ReportesAdministradores";
import ReporteCompras from "../admin/ReporteCompras";
import ReporteVentas from "../admin/ReporteVentas";
import AgregarProducto from "../admin/AgregarProducto";


import './AdminLayout.css';
import CuentasPorPagar from "../admin/CuentasPorPagar";

const AdminLayout = ({ setAuth }) => { // 👈 aceptar setAuth como prop
  const [sidebarOpen,] = useState(false);

  return (
    <div className="admin-layout">

      <Sidebar isOpen={sidebarOpen} setAuth={setAuth} /> {/* 👈 pasamos setAuth al Sidebar */}

      <div className="admin-content">
        <div className="admin-inner">
          <Routes>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="productos" element={<Productos />} />
            <Route path="agregar_productos" element={<AgregarProducto />} />
            <Route path="categorias" element={<Categorias />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="ventas-usuario" element={<VentasUsuario />} />
            <Route path="usuarios/agregar-usuario" element={<AgregarUsuario />} />
            <Route path="administradores/agregar-administrador" element={<AgregarAdministrador />} />
            <Route path="usuarios/listar-usuarios" element={<ListaUsuarios />} />
            <Route path="usuarios/listar-administradores" element={<ListaAdministradores />} />
            <Route path="agregar-proveedores" element={<AgregarProveedor />} />
            <Route path="listar-proveedores" element={<ListaProveedores />} />
            <Route path="registrar-compras" element={<RegistrarCompras />} />
            <Route path="listar-compras" element={<ListaCompras />} />
            <Route path="administradores/reportes-administrador" element={<ReportesAdministradores />} />
            <Route path="administradores/reportes-compras" element={<ReporteCompras />} />
            <Route path="administradores/reportes-ventas" element={<ReporteVentas />} />
            <Route path="cuentas-por-pagar" element={<CuentasPorPagar />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
