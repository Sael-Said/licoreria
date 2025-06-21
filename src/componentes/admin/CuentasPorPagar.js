// frontend/src/componentes/admin/CuentasPorPagar.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CuentasPorPagar.css";
import AbonarPagoModal from "./AbonarPagoModal";

const CuentasPorPagar = () => {
  const [comprasCredito, setComprasCredito] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const [comprasRes, proveedoresRes] = await Promise.all([
        axios.get("https://backend-licoreria-o6e2.onrender.com/api/compra/", {
          headers: { Authorization: `Token ${token}` },
        }),
        axios.get("https://backend-licoreria-o6e2.onrender.com/api/proveedor/", {
          headers: { Authorization: `Token ${token}` },
        }),
      ]);

      const comprasFiltradas = comprasRes.data.filter(
        (c) => c.tipo_pago === "credito"
      );

      setComprasCredito(comprasFiltradas);
      setProveedores(proveedoresRes.data);
    } catch (error) {
      console.error("Error al cargar cuentas por pagar:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getNombreProveedor = (id) => {
    const proveedor = proveedores.find((p) => p.id === id);
    return proveedor ? proveedor.nombre : "";
  };

  const abrirModalAbonar = (compra) => {
    setCompraSeleccionada(compra);
    setModalAbierto(true);
  };

  const cerrarModalAbonar = () => {
    setModalAbierto(false);
    setCompraSeleccionada(null);
    fetchData();
  };
const actualizarDatos = async () => {
  const token = localStorage.getItem("token");

  try {
    const comprasRes = await axios.get("https://backend-licoreria-o6e2.onrender.com/api/compra/", {
      headers: { Authorization: `Token ${token}` },
    });

    const comprasFiltradas = comprasRes.data.filter(
      (c) => c.tipo_pago === "credito"
    );
    setComprasCredito(comprasFiltradas);
  } catch (error) {
    console.error("Error al actualizar compras:", error);
  }
};

  return (
    <div className="cuentas-container">
      <h2>Cuentas por Pagar</h2>
      <table className="cuentas-tabla">
        <thead>
          <tr>
            <th>Proveedor</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Pagado</th>
            <th>Saldo Pendiente</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {comprasCredito.length === 0 ? (
            <tr>
              <td colSpan="7">No hay cuentas por pagar.</td>
            </tr>
          ) : (
            comprasCredito.map((compra) => (
              <tr key={compra.id}>
                <td>{getNombreProveedor(compra.proveedor)}</td>
                <td>{new Date(compra.fecha_compra).toLocaleDateString()}</td>
                <td>{parseFloat(compra.total).toFixed(2)} Bs</td>
                <td>{parseFloat(compra.total - compra.saldo_pendiente).toFixed(2)} Bs</td>
                <td>{parseFloat(compra.saldo_pendiente).toFixed(2)} Bs</td>
                <td>{compra.estado_pago}</td>
                <td>
                  {compra.saldo_pendiente > 0 && (
                    <button onClick={() => abrirModalAbonar(compra)}>Abonar</button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {modalAbierto && compraSeleccionada && (
        <AbonarPagoModal
  compra={compraSeleccionada}
  onClose={() => setModalAbierto(false)}
  onSuccess={() => actualizarDatos()} // Asegúrate de tener esta función definida
/>

      )}
    </div>
  );
};

export default CuentasPorPagar;
