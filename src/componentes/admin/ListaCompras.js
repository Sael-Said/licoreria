// src/componentes/admin/ListaCompras.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ListaCompras.css";

const ListaCompras = () => {
  const [compras, setCompras] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [busquedaProveedor, setBusquedaProveedor] = useState("");
  const [busquedaFecha, setBusquedaFecha] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    axios.get("http://localhost:8000/api/compra/", {
      headers: { Authorization: `Token ${token}` },
    }).then(res => {
      const comprasFiltradas = res.data.filter(c => String(c.usuario) === userId);
      setCompras(comprasFiltradas);
    });

    axios.get("http://localhost:8000/api/detallecompra/", {
      headers: { Authorization: `Token ${token}` },
    }).then(res => setDetalles(res.data));
  }, []);

  const obtenerDetalles = (compraId) => {
    return detalles.filter(d => d.compra === compraId);
  };

  const filtrarCompras = () => {
    return compras.filter(compra => {
      const coincideProveedor = compra.proveedor_nombre?.toLowerCase().includes(busquedaProveedor.toLowerCase());
      const coincideFecha = busquedaFecha ? new Date(compra.fecha).toLocaleDateString("en-CA") === busquedaFecha: true;

      return coincideProveedor && coincideFecha;
    });
  };

  return (
    <div className="reporte-wrapper">
    <div className="reporte-usuarios-container">
      <h2>Mis Compras</h2>

      <div className="filtros">
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

      <table className="reporte-tabla">
        <thead>
          <tr>
            <th>Proveedor</th>
            <th>Productos</th>
            <th>Fecha</th>
            <th>Total (Bs)</th>
          </tr>
        </thead>
        <tbody>
          {filtrarCompras().map((compra) => (
            <tr key={compra.id}>
              <td>{compra.proveedor_nombre || "No registrado"}</td>
              <td>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {obtenerDetalles(compra.id).map((detalle) => (
                    <li key={detalle.id}>{detalle.producto_nombre} (x{detalle.cantidad})</li>
                  ))}
                </ul>
              </td>
              <td>{new Date(compra.fecha_compra).toLocaleString()}</td>
              <td>{Number(compra.total).toFixed(2)} Bs</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default ListaCompras;
