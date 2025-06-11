// src/componentes/compras/AbonarPagoModal.js
import React, { useState } from "react";
import axios from "axios";
import "./AbonarPagoModal.css";

const AbonarPagoModal = ({ compra, onClose, onSuccess }) => {
  const [monto, setMonto] = useState("");
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const handlePago = async (e) => {
    e.preventDefault();
    setCargando(true);
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post("http://localhost:8000/api/pagocompra/", {
        compra: compra.id,
        monto_pagado: parseFloat(monto),
        metodo_pago: metodoPago,
      }, {
        headers: { Authorization: `Token ${token}` },
      });

      setMensaje("✅ Abono registrado correctamente.");
      setMonto("");

      // Delay para mostrar mensaje y luego ejecutar acciones
      setTimeout(() => {
        setMensaje("");
        setCargando(false);
        onSuccess();
        onClose();
      }, 1200);
    } catch (error) {
      console.error(error.response?.data || error.message);
      setMensaje("❌ Error al registrar el abono.");
      setCargando(false);
    }
  };

  const handleCancelar = () => {
    setMensaje("");
    setMonto("");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Abonar a Compra #{compra.id}</h3>
        <form onSubmit={handlePago}>
          <p>Total: <strong>{parseFloat(compra.total).toFixed(2)} Bs</strong></p>
          <p>Pagado: <strong>{(compra.total - compra.saldo_pendiente).toFixed(2)} Bs</strong></p>
          <p>Saldo Pendiente: <strong>{parseFloat(compra.saldo_pendiente).toFixed(2)} Bs</strong></p>

          <label>Monto a abonar:</label>
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            min="0.01"
            max={compra.saldo_pendiente}
            step="0.01"
            required
          />

          <label>Método de pago:</label>
          <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
            <option value="efectivo">Efectivo</option>
            <option value="qr">QR</option>
          </select>

          <div className="modal-actions">
            <button type="submit" disabled={cargando}>Registrar Abono</button>
            <button type="button" className="cancelar" onClick={handleCancelar}>Cancelar</button>
          </div>
        </form>
        {mensaje && <p style={{ marginTop: "10px" }}>{mensaje}</p>}
      </div>
    </div>
  );
};

export default AbonarPagoModal;
