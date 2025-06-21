import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./ReporteVentas.css";

const ReporteVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [busquedaUsuario, setBusquedaUsuario] = useState("");
  const [busquedaProducto, setBusquedaProducto] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    Promise.all([
      axios.get("https://backend-licoreria-o6e2.onrender.com/api/usuario/", { headers: { Authorization: `Token ${token}` } }),
      axios.get("https://backend-licoreria-o6e2.onrender.com/api/cliente/", { headers: { Authorization: `Token ${token}` } }),
      axios.get("https://backend-licoreria-o6e2.onrender.com/api/venta/", { headers: { Authorization: `Token ${token}` } }),
      axios.get("https://backend-licoreria-o6e2.onrender.com/api/detalleventa/", { headers: { Authorization: `Token ${token}` } })
    ]).then(([usuariosRes, clientesRes, ventasRes, detallesRes]) => {
      setUsuarios(usuariosRes.data);
      setClientes(clientesRes.data);
      setVentas(ventasRes.data);
      setDetalles(detallesRes.data);
    });
  }, []);

  const obtenerUsuario = (id) => usuarios.find(u => u.id === id)?.username || "Sin registrar";
  const obtenerCliente = (id) => clientes.find(c => c.id === id)?.nombre || "Anonimo";
  const obtenerDetallesVenta = (ventaId) => detalles.filter(d => d.venta === ventaId);

  const ventasFiltradas = ventas.filter(v => {
  const fechaVentaISO = v.fecha.split('T')[0]; // Esto es seguro y exacto

if (fechaInicio && fechaVentaISO < fechaInicio) return false;
if (fechaFin && fechaVentaISO > fechaFin) return false;


  const usuarioNombre = obtenerUsuario(v.usuario).toLowerCase();
  if (!usuarioNombre.includes(busquedaUsuario.toLowerCase())) return false;

  const detallesVenta = obtenerDetallesVenta(v.id);
  if (busquedaProducto && !detallesVenta.some(d => d.producto_nombre.toLowerCase().includes(busquedaProducto.toLowerCase()))) {
    return false;
  }

  return true;
});


  const totalGeneral = ventasFiltradas.reduce((acc, venta) => {
    const detallesVenta = obtenerDetallesVenta(venta.id);
    const totalVenta = detallesVenta.reduce((sum, d) => sum + parseFloat(d.subtotal), 0);
    return acc + totalVenta;
  }, 0);

  const imprimirPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Ventas", 14, 10);
    const rows = [];

    ventasFiltradas.forEach(v => {
      const detallesVenta = obtenerDetallesVenta(v.id);
      const productos = detallesVenta.map(d => `${d.producto_nombre} (${d.cantidad} u)`).join(", ");
      const subtotal = detallesVenta.reduce((sum, d) => sum + parseFloat(d.subtotal), 0);

      rows.push([
        new Date(v.fecha).toLocaleDateString("es-BO"),
        obtenerUsuario(v.usuario),
        obtenerCliente(v.cliente),
        v.tipo_pago,
        productos,
        `${subtotal.toFixed(2)} Bs`
      ]);
    });

    autoTable(doc, {
      head: [["Fecha", "Usuario", "Cliente", "Pago", "Productos", "Total"]],
      body: rows
    });

    doc.text(`Total General: ${totalGeneral.toFixed(2)} Bs`, 14, doc.lastAutoTable.finalY + 10);
    doc.save("reporte_ventas.pdf");
  };

  return (
    <div className="reporte-admin-container">
      <h2>Reporte de Ventas</h2>

      <div className="filtros">
        <label>Desde: <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} /></label>
        <label>Hasta: <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} /></label>
        <input type="text" placeholder="Buscar por usuario" value={busquedaUsuario} onChange={e => setBusquedaUsuario(e.target.value)} />
        <input type="text" placeholder="Buscar por producto" value={busquedaProducto} onChange={e => setBusquedaProducto(e.target.value)} />
        <button onClick={imprimirPDF}>Imprimir PDF</button>
      </div>

      <table className="tabla-reporte-admin">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Usuario</th>
            <th>Cliente</th>
            <th>Pago</th>
            <th>Productos</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {ventasFiltradas.length === 0 ? (
            <tr><td colSpan="6">No se encontraron resultados.</td></tr>
          ) : (
            ventasFiltradas.map(v => {
              const detallesVenta = obtenerDetallesVenta(v.id);
              const productos = detallesVenta.map(d => `${d.producto_nombre} (${d.cantidad} u)`).join(", ");
              const total = detallesVenta.reduce((sum, d) => sum + parseFloat(d.subtotal), 0);

              return (
                <tr key={v.id}>
                  <td>{new Date(v.fecha).toLocaleDateString("es-BO")}</td>
                  <td>{obtenerUsuario(v.usuario)}</td>
                  <td>{obtenerCliente(v.cliente)}</td>
                  <td>{v.tipo_pago}</td>
                  <td>{productos}</td>
                  <td>{total.toFixed(2)} Bs</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <h3 style={{ marginTop: "20px", textAlign: "right" }}>Total General: {totalGeneral.toFixed(2)} Bs</h3>
    </div>
  );
};

export default ReporteVentas;
