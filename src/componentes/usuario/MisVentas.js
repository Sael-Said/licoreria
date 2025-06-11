import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./MisVentas.css";

const MisVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [error, setError] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [limite, setLimite] = useState(100);

  useEffect(() => {
    const fetchDatos = async () => {
      const token = localStorage.getItem("token");
      const user_id = localStorage.getItem("user_id");
      try {
        const [ventasRes, detallesRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/venta/?usuario=${user_id}`, {
            headers: { Authorization: `Token ${token}` },
          }),
          axios.get(`http://localhost:8000/api/detalleventa/`, {
            headers: { Authorization: `Token ${token}` },
          }),
        ]);
        setVentas(ventasRes.data);
        setDetalles(detallesRes.data);
      } catch (err) {
        console.error("Error al obtener datos:", err);
        setError("No se pudieron cargar las ventas.");
      }
    };
    fetchDatos();
  }, []);

  const ventasFiltradas = ventas.filter((venta) => {
    const fecha = new Date(venta.fecha).toISOString().slice(0, 10);
    return (!fechaInicio || fecha >= fechaInicio) && (!fechaFin || fecha <= fechaFin);
  });

  const ventasPaginadas = fechaInicio || fechaFin ? ventasFiltradas : ventasFiltradas.slice(0, limite);

  const totalDelRango = ventasPaginadas.reduce(
    (acc, venta) => acc + parseFloat(venta.total),
    0
  ).toFixed(2);

  const obtenerProductos = (ventaId) => {
    return detalles
      .filter((d) => d.venta === ventaId)
      .map((d) => `${d.cantidad} x ${d.producto_nombre || "Producto"}`);
  };

  const exportarExcel = () => {
    const data = ventasPaginadas.map((v) => ({
      "ID Venta": v.id,
      "Fecha": new Date(v.fecha).toLocaleString(),
      "Total (Bs)": parseFloat(v.total).toFixed(2),
      "Cliente": v.cliente ? v.cliente.nombre : "Cliente no registrado",
      "Productos": obtenerProductos(v.id).join(", ")
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MisVentas");
    XLSX.writeFile(wb, "MisVentas.xlsx");
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Mis Ventas", 14, 10);

    autoTable(doc, {
      startY: 20,
      head: [["ID Venta", "Fecha", "Total (Bs)", "Cliente", "Productos"]],
      body: ventasPaginadas.map((v) => [
        v.id,
        new Date(v.fecha).toLocaleString(),
        parseFloat(v.total).toFixed(2),
        v.cliente ? v.cliente.nombre : "Cliente no registrado",
        obtenerProductos(v.id).join(", "),
      ]),
    });

    doc.save("MisVentas.pdf");
  };

  return (
    <div className="mis-ventas-container">
      <h2>Mis Ventas</h2>

      <div className="filtros">
        <label>Desde: </label>
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
        />
        <label>Hasta: </label>
        <input
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
        />
      </div>

      {error && <p className="error">{error}</p>}

      {ventasPaginadas.length === 0 ? (
        <p>No hay ventas registradas en este rango.</p>
      ) : (
        <>
          <table className="mis-ventas-tabla">
            <thead>
              <tr>
                <th>ID Venta</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Cliente</th>
                <th>Productos</th>
              </tr>
            </thead>
            <tbody>
              {ventasPaginadas.map((venta) => (
                <tr key={venta.id}>
                  <td>{venta.id}</td>
                  <td>{new Date(venta.fecha).toLocaleString()}</td>
                  <td>{parseFloat(venta.total).toFixed(2)} Bs</td>
                  <td>{venta.cliente ? venta.cliente.nombre : "Cliente no registrado"}</td>
                  <td>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {obtenerProductos(venta.id).map((prod, i) => (
                        <li key={i}>{prod}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p><strong>Total:</strong> {totalDelRango} Bs</p>

          <div className="botones-exportar">
            <button onClick={exportarExcel}>Exportar a Excel</button>
            <button onClick={exportarPDF}>Exportar a PDF</button>
          </div>

          {!fechaInicio && !fechaFin && ventasFiltradas.length > limite && (
            <div style={{ marginTop: "20px" }}>
              <button onClick={() => setLimite(limite + 100)} className="ver-mas-btn">
                Ver más ventas
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MisVentas;
