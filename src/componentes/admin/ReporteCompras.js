// src/componentes/admin/ReporteCompras.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ReporteCompras.css";

const ReporteCompras = () => {
  const [compras, setCompras] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [administradores, setAdministradores] = useState([]);
  const [filtros, setFiltros] = useState({
    fechaInicio: "",
    fechaFin: "",
    administrador: "",
    proveedor: "",
    producto: "",
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchDatos = async () => {
      try {
        const [usuariosRes, comprasRes, detallesRes] = await Promise.all([
          axios.get("http://localhost:8000/api/usuario/", {
            headers: { Authorization: `Token ${token}` },
          }),
          axios.get("http://localhost:8000/api/compra/", {
            headers: { Authorization: `Token ${token}` },
          }),
          axios.get("http://localhost:8000/api/detallecompra/", {
            headers: { Authorization: `Token ${token}` },
          }),
        ]);

        const admins = usuariosRes.data.filter((u) => u.rol === "administrador");
        setAdministradores(admins);
        setCompras(comprasRes.data);
        setDetalles(detallesRes.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchDatos();
  }, [token]);

  const obtenerDetallesCompra = (compraId) =>
    detalles.filter((detalle) => detalle.compra === compraId);

  const comprasFiltradas = compras.filter((compra) => {
    const fechaCompra = new Date(compra.fecha_compra);
    const { fechaInicio, fechaFin, administrador, proveedor, producto } = filtros;

    const coincideFecha =
      (!fechaInicio || fechaCompra >= new Date(fechaInicio)) &&
      (!fechaFin || fechaCompra <= new Date(fechaFin));

    const coincideAdmin = compra.usuario_nombre?.toLowerCase().includes(administrador.toLowerCase());
    const coincideProveedor = compra.proveedor_nombre?.toLowerCase().includes(proveedor.toLowerCase());

    const detallesCompra = obtenerDetallesCompra(compra.id);
    const coincideProducto = detallesCompra.some((d) =>
      d.producto_nombre?.toLowerCase().includes(producto.toLowerCase())
    );

    return coincideFecha && coincideAdmin && coincideProveedor && coincideProducto;
  });

  const totalFiltrado = comprasFiltradas.reduce((acc, compra) => acc + parseFloat(compra.total), 0);

  const imprimirReporte = () => window.print();

  return (
    <div className="reporte-compras-container">
      <h2>📋 Reporte de Compras</h2>

      <div className="reporte-filtros">
        <label>
          Desde:{" "}
          <input
            type="date"
            value={filtros.fechaInicio}
            onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })}
          />
        </label>
        <label>
          Hasta:{" "}
          <input
            type="date"
            value={filtros.fechaFin}
            onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })}
          />
        </label>
        <input
          type="text"
          placeholder="Buscar por administrador"
          value={filtros.administrador}
          onChange={(e) => setFiltros({ ...filtros, administrador: e.target.value })}
        />
        <input
          type="text"
          placeholder="Buscar por proveedor"
          value={filtros.proveedor}
          onChange={(e) => setFiltros({ ...filtros, proveedor: e.target.value })}
        />
        <input
          type="text"
          placeholder="Buscar por producto"
          value={filtros.producto}
          onChange={(e) => setFiltros({ ...filtros, producto: e.target.value })}
        />
        <button className="btn-imprimir" onClick={imprimirReporte}>
          🖨️ Imprimir Reporte
        </button>
      </div>

      <div className="reporte-scroll">
        <table className="tabla-reporte-compras">
          <thead>
            <tr>
              <th>Fecha Compra</th>
              <th>Administrador</th>
              <th>Proveedor</th>
              <th>Tipo Pago</th>
              <th>Total Pagado</th>
              <th>Producto</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Precio Compra</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {comprasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="12" className="mensaje-vacio">No se encontraron resultados.</td>
              </tr>
            ) : (
              comprasFiltradas.flatMap((compra) => {
                const detallesCompra = obtenerDetallesCompra(compra.id);
                return detallesCompra.map((detalle, i) => (
                  <tr key={`${compra.id}-${i}`}>
                    <td>{new Date(compra.fecha_compra).toLocaleDateString("es-BO")}</td>
                    <td>{compra.usuario_nombre}</td>
                    <td>{compra.proveedor_nombre || "No registrado"}</td>
                    <td>{compra.tipo_pago}</td>
                    <td>{parseFloat(compra.total).toFixed(2)} Bs</td>
                    <td>{detalle.producto_nombre}</td>
                    <td>{detalle.descripcion_producto}</td>
                    <td>{detalle.categoria_producto}</td>
                    <td>{detalle.precio_unitario} Bs</td>
                    <td>{detalle.cantidad}</td>
                    <td>{(detalle.precio_unitario * detalle.cantidad).toFixed(2)} Bs</td>
                  </tr>
                ));
              })
            )}
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: "right", marginTop: "20px", fontWeight: "bold", fontSize: "16px" }}>
        Total General: {totalFiltrado.toFixed(2)} Bs
      </div>
    </div>
  );
};

export default ReporteCompras;
