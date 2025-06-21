import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ReporteAdministradores.css";

const ReportesAdministradores = () => {
  const [administradores, setAdministradores] = useState([]);
  const [compras, setCompras] = useState([]);
  const [busquedaAdmin, setBusquedaAdmin] = useState("");
  const [busquedaProveedor, setBusquedaProveedor] = useState("");
  const [busquedaFecha, setBusquedaFecha] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("https://backend-licoreria-o6e2.onrender.com/api/usuario/", {
      headers: { Authorization: `Token ${token}` },
    }).then(res => {
      const admins = res.data.filter(user => user.rol === "administrador");
      setAdministradores(admins);
    });

    axios.get("https://backend-licoreria-o6e2.onrender.com/api/compra/", {
      headers: { Authorization: `Token ${token}` },
    }).then(res => setCompras(res.data));
  }, []);

  const obtenerNombreAdmin = (id) => {
    const admin = administradores.find(a => a.id === id);
    return admin ? admin.username : "No registrado";
  };

  const comprasFiltradas = compras.filter((c) => {
    const admin = obtenerNombreAdmin(c.usuario).toLowerCase();
    const proveedor = (c.proveedor_nombre || "").toLowerCase();
    const fecha = new Date(c.fecha_compra).toLocaleDateString("es-BO");


    return (
      admin.includes(busquedaAdmin.toLowerCase()) &&
      proveedor.includes(busquedaProveedor.toLowerCase()) &&
      fecha.includes(busquedaFecha)
    );
  });

  return (
    <div className="reporte-wrapper">
    <div className="reporte-admin-container">
      <h2>Reporte de administradores</h2>

      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar por administrador"
          value={busquedaAdmin}
          onChange={(e) => setBusquedaAdmin(e.target.value)}
        />
        <input
          type="text"
          placeholder="Buscar por proveedor"
          value={busquedaProveedor}
          onChange={(e) => setBusquedaProveedor(e.target.value)}
        />
        <input
          type="date"
          value={busquedaFecha}
          onChange={(e) => setBusquedaFecha(e.target.value)}
        />
      </div>

      <table className="tabla-reporte-admin">
        <thead>
          <tr>
            <th>Administrador</th>
            <th>Proveedor</th>
            <th>Fecha</th>
            <th>Total (Bs)</th>
          </tr>
        </thead>
        <tbody>
          {comprasFiltradas.length === 0 ? (
            <tr>
              <td colSpan="4" className="mensaje-vacio">No se encontraron resultados.</td>
            </tr>
          ) : (
            comprasFiltradas.map((compra) => (
              <tr key={compra.id}>
                <td>{compra.usuario_nombre}</td>
                <td>{compra.proveedor_nombre || "No registrado"}</td>
                <td>{new Date(compra.fecha_compra).toLocaleString()}</td>
                <td>{parseFloat(compra.total).toFixed(2)} Bs</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default ReportesAdministradores;
