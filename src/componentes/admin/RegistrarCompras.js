import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RegistrarCompras.css";

const RegistrarCompras = () => {
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState("");
  const [tipoPago, setTipoPago] = useState("efectivo");
  const [abono, setAbono] = useState(""); // 👈 Nuevo estado
  const [fechaCompra, setFechaCompra] = useState("");
  const [detalleCompra, setDetalleCompra] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:8000/api/proveedor/", {
      headers: { Authorization: `Token ${token}` },
    }).then(res => setProveedores(res.data));

    axios.get("http://localhost:8000/api/producto/", {
      headers: { Authorization: `Token ${token}` },
    }).then(res => setProductos(res.data));
  }, []);

  const handleAgregarProducto = () => {
    setDetalleCompra([...detalleCompra, {
      producto: "",
      producto_nombre: "",
      cantidad: 1,
      precio_unitario: 0,
      subtotal: 0,
    }]);
  };

  const handleCambioDetalle = (index, field, value) => {
    const nuevoDetalle = [...detalleCompra];

    if (field === "producto_nombre") {
      const producto = productos.find(p => p.nombre_producto.toLowerCase() === value.toLowerCase());
      nuevoDetalle[index].producto_nombre = value;
      nuevoDetalle[index].producto = producto ? producto.id : "";
    } else {
      nuevoDetalle[index][field] = field === "cantidad" || field === "precio_unitario"
        ? parseFloat(value)
        : value;
    }

    if (nuevoDetalle[index].cantidad && nuevoDetalle[index].precio_unitario) {
      nuevoDetalle[index].subtotal = nuevoDetalle[index].cantidad * nuevoDetalle[index].precio_unitario;
    }

    setDetalleCompra(nuevoDetalle);
  };

  const calcularTotal = () => {
    return detalleCompra.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2);
  };

const handleQuitarProducto = (index) => {
  const nuevoDetalle = [...detalleCompra];
  nuevoDetalle.splice(index, 1); // elimina uno en la posición index
  setDetalleCompra(nuevoDetalle);
};

  const handleEnviarCompra = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");
    const total = calcularTotal();

    const compraData = {
      proveedor: proveedorSeleccionado,
      usuario: user_id,
      tipo_pago: tipoPago,
      fecha_compra: fechaCompra,
      total,
    };

    try {
      const compraRes = await axios.post("http://localhost:8000/api/compra/", compraData, {
        headers: { Authorization: `Token ${token}` },
      });

      const idCompra = compraRes.data.id;

      // Guardar detalles
      for (const detalle of detalleCompra) {
        await axios.post("http://localhost:8000/api/detallecompra/", {
          compra: idCompra,
          producto: detalle.producto,
          cantidad: detalle.cantidad,
          precio_unitario: detalle.precio_unitario,
          subtotal: detalle.subtotal,
        }, {
          headers: { Authorization: `Token ${token}` },
        });
      }

      // Guardar abono si aplica
      if (tipoPago === "credito" && parseFloat(abono) > 0) {
        await axios.post("http://localhost:8000/api/pagocompra/", {
          compra: idCompra,
          monto_pagado: parseFloat(abono),
          metodo_pago: "efectivo", // o podrías dejar que elija
        }, {
          headers: { Authorization: `Token ${token}` },
        });
      }

      setMensaje("✅ Compra registrada exitosamente.");
      setProveedorSeleccionado("");
      setDetalleCompra([]);
      setTipoPago("efectivo");
      setFechaCompra("");
      setAbono("");
    } catch (error) {
      console.error(error.response?.data || error.message);
      setMensaje("❌ Error al registrar la compra.");
    }
  };

  return (
    <div className="reporte-wrapper">
      <div className="formulario-container">
        <h2>Registrar Compra</h2>

        <form onSubmit={handleEnviarCompra}>
          <select
            value={proveedorSeleccionado}
            onChange={(e) => setProveedorSeleccionado(e.target.value)}
            required
          >
            <option value="">Seleccionar proveedor</option>
            {proveedores.map((prov) => (
              <option key={prov.id} value={prov.id}>{prov.nombre}</option>
            ))}
          </select>

          <select
            value={tipoPago}
            onChange={(e) => setTipoPago(e.target.value)}
            required
          >
            <option value="efectivo">Efectivo</option>
            <option value="qr">QR</option>
            <option value="credito">Crédito</option>
          </select>

          {tipoPago === "credito" && (
            <label>
              Abono al proveedor:
              <input
                type="number"
                min="0"
                step="0.01"
                value={abono}
                onChange={(e) => setAbono(e.target.value)}
                placeholder="Ej: 50.00"
              />
            </label>
          )}

          <label>
            Fecha de Compra:
            <input
              type="date"
              value={fechaCompra}
              onChange={(e) => setFechaCompra(e.target.value)}
              required
            />
          </label>

          {detalleCompra.map((item, idx) => (
            <div key={idx} className="grupo-producto">
              <label>
                Producto:
                <input
                  type="text"
                  list={`productos-${idx}`}
                  placeholder="Buscar producto"
                  value={item.producto_nombre}
                  onChange={(e) => handleCambioDetalle(idx, "producto_nombre", e.target.value)}
                  required
                />
                <datalist id={`productos-${idx}`}>
                  {productos.map((prod) => (
                    <option key={prod.id} value={prod.nombre_producto} />
                  ))}
                </datalist>
              </label>

              <label>
                Cantidad:
                <input
                  type="number"
                  min="1"
                  value={item.cantidad}
                  onChange={(e) => handleCambioDetalle(idx, "cantidad", e.target.value)}
                  required
                />
              </label>

              <label>
                Precio:
                <input
                  type="number"
                  step="0.01"
                  value={item.precio_unitario}
                  onChange={(e) => handleCambioDetalle(idx, "precio_unitario", e.target.value)}
                  required
                />
              </label>

              <div><strong>Subtotal:</strong> {item.subtotal.toFixed(2)} Bs</div>
              <button type="button" className="btn-quitar" onClick={() => handleQuitarProducto(idx)}>Quitar producto</button>
            </div>
            
          ))}

          <button
  type="button"
  className="btn-agregar"
  onClick={handleAgregarProducto}
>
  + Agregar producto
</button>

          <h3>Total: {calcularTotal()} Bs</h3>
          <button type="submit" className="btn-registrar">
  Registrar Compra
</button>
        </form>

        {mensaje && <p>{mensaje}</p>}
      </div>
    </div>
  );
};

export default RegistrarCompras;
