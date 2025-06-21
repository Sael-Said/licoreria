// src/componentes/usuario/RegistrarVenta.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./VentaPOS.css";
import NotaVentaPDF from "./NotaVentaPDF";

const RegistrarVenta = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [pagoCliente, setPagoCliente] = useState("");
  const [cliente, setCliente] = useState({ nombre: "", ci: "", direccion: "", telefono: "", email: "" });
  const [mensaje, setMensaje] = useState("");
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [ventaGuardada, setVentaGuardada] = useState(false);
  const [ventaId, setVentaId] = useState(null);
  const [fechaVenta, setFechaVenta] = useState("");
  const [cantidadProducto, setCantidadProducto] = useState(1);
  const [productosVenta, setProductosVenta] = useState([]);


  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:8000/api/producto/", {
      headers: { Authorization: `Token ${token}` },
    }).then(res => setProductos(res.data));
  }, []);

  const agregarProducto = (codigoODescripcion) => {
    const prod = productos.find((p) => p.nombre_producto.toLowerCase() === codigoODescripcion.toLowerCase());

    if (prod) {
      if (prod.activo === false) {
        setMensaje(`❌ El producto "${prod.nombre_producto}" está desactivado y no puede venderse.`);
        ocultarMensaje();
        return;
      }

      const existe = carrito.find((item) => item.id === prod.id);
      const cantidadTotal = (existe ? existe.cantidad : 0) + cantidadProducto;

      if (cantidadTotal > prod.stock) {
        setMensaje(`❌ Stock insuficiente. Solo hay ${prod.stock} unidades disponibles.`);
        ocultarMensaje();
        return;
      }

      if (existe) {
        setCarrito(carrito.map((item) => item.id === prod.id ? { ...item, cantidad: item.cantidad + cantidadProducto } : item));
      } else {
        setCarrito([...carrito, { ...prod, cantidad: cantidadProducto }]);
      }
    } else {
      setMensaje("❌ Producto no encontrado.");
      ocultarMensaje();
    }
    setBusqueda("");
  };

  const total = carrito.reduce((acc, prod) => acc + prod.precio_venta * prod.cantidad, 0);
  const cambio = pagoCliente ? (pagoCliente - total).toFixed(2) : 0;

  const guardarVenta = async () => {
    if (!pagoCliente || pagoCliente < total) {
      setMensaje("❌ El pago del cliente es insuficiente.");
      ocultarMensaje();
      return;
    }
    const token = localStorage.getItem("token");
    let clienteId = null;

    if (cliente.nombre || cliente.ci || cliente.direccion || cliente.telefono || cliente.email) {
      try {
        const clienteRes = await axios.post("http://localhost:8000/api/cliente/", {
          nombre: cliente.nombre,
          ci_nit: cliente.ci,
          direccion: cliente.direccion,
          telefono: cliente.telefono,
          email: cliente.email || null
        }, {
          headers: { Authorization: `Token ${token}` }
        });
        clienteId = clienteRes.data.id;
      } catch (error) {
        console.error("Error al registrar cliente:", error);
        setMensaje("❌ Error al guardar el cliente.");
        ocultarMensaje();
        return;
      }
    }

    try {
      const ventaRes = await axios.post("http://localhost:8000/api/venta/", {
        total,
        cliente: clienteId || null,
        tipo_pago: metodoPago,
      }, {
        headers: { Authorization: `Token ${token}` }
      });
      const nuevaVentaId = ventaRes.data.id;
      setVentaId(nuevaVentaId);
      setFechaVenta(ventaRes.data.fecha);

      for (const item of carrito) {
        await axios.post("http://localhost:8000/api/detalleventa/", {
          venta: nuevaVentaId,
          producto: item.id,
          cantidad: item.cantidad,
          precio_unitario: item.precio_venta,
          subtotal: item.precio_venta * item.cantidad
        }, {
          headers: { Authorization: `Token ${token}` }
        });
      }
      setVentaGuardada(true);
      setMensaje("✅ Venta registrada. Puedes generar la nota de venta.");
      setTimeout(() => {
        limpiarFormulario();
      }, 8000);
    } catch (error) {
      console.error("Error al guardar venta o detalles:", error);
      setMensaje("❌ Error al guardar la venta.");
    }
    ocultarMensaje();
  };

  const limpiarFormulario = () => {
    setCarrito([]);
    setCliente({ nombre: "", ci: "", direccion: "", telefono: "", email: "" });
    setPagoCliente("");
    setMetodoPago("efectivo");
    setVentaGuardada(false);
    setVentaId(null);
    setFechaVenta("");
  };

  const ocultarMensaje = () => {
    setTimeout(() => setMensaje(""), 4000);
  };

  const userNombre = localStorage.getItem("user_nombre");

  return (
    <div className="venta-pos-container">
      <h2>Registrar Venta</h2>
      {mensaje && (
        <div className={`mensaje ${mensaje.includes("❌") ? "error" : "exito"}`}>{mensaje}</div>
      )}
      <div className="venta-busqueda">
        <label>Producto:</label>
        <input
          type="text"
          list="sugerencias-productos"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Nombre del producto o código"
          onKeyDown={(e) => e.key === "Enter" && agregarProducto(busqueda)}
        />
        <label>Cantidad:</label>
        <input
          type="number"
          min="1"
          value={cantidadProducto}
          onChange={(e) => setCantidadProducto(parseInt(e.target.value) || 1)}
          placeholder="Cantidad"
          style={{ marginLeft: "10px" }}
        />
        <datalist id="sugerencias-productos">
          {productos
            .filter((p) =>
              p.nombre_producto.toLowerCase().includes(busqueda.toLowerCase())
            )
            .map((producto) => (
              <option key={producto.id} value={producto.nombre_producto} />
            ))}
        </datalist>

        <button onClick={() => agregarProducto(busqueda)}>Agregar</button>
        <button onClick={() => {
          if (window.confirm("¿Estás seguro de que deseas vaciar todos los productos de la venta?")) {setCarrito([]);}
}}
  style={{
    marginLeft: "10px",
    backgroundColor: "#dc3545",
    color: "white",
    padding: "9px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }}
>
  Cancelar
</button>

      </div>
      <table className="venta-tabla">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Importe</th>
          </tr>
        </thead>
        <tbody>
          {carrito.map((item, index) => (
            <tr key={index}>
              <td>{item.nombre_producto}</td>
              <td>{item.cantidad}</td>
              <td>{item.precio_venta} Bs</td>
              <td>{(item.precio_venta * item.cantidad).toFixed(2)} Bs</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="venta-total">
        <p><strong>Total: </strong>{total.toFixed(2)} Bs</p>
        <label>Pago del cliente: </label>
        <input
          type="number"
          placeholder="Pago del cliente"
          value={pagoCliente}
          onChange={(e) => setPagoCliente(e.target.value)}
        />
        <p><strong>Cambio: </strong>{cambio} Bs</p>
        <label>Método de Pago: </label>
        <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
          <option value="efectivo">Efectivo</option>
          <option value="qr">QR</option>
        </select>
      </div>
      <h1>Datos del cliente:</h1>
      <div className="venta-cliente">
        <label>Nombre y apellido:</label>
        <input type="text" placeholder="Nombre del cliente (opcional)" value={cliente.nombre} onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })} />
        <label>CI/NIT:</label>
        <input type="text" placeholder="CI/NIT (opcional)" value={cliente.ci} onChange={(e) => setCliente({ ...cliente, ci: e.target.value })} />
        <label>Dirección:</label>
        <input type="text" placeholder="Dirección (opcional)" value={cliente.direccion} onChange={(e) => setCliente({ ...cliente, direccion: e.target.value })} />
        <label>N° Teléfono:</label>
        <input type="text" placeholder="Teléfono (opcional)" value={cliente.telefono} onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })} />
        <label>Correo Electrónico:</label>
        <input type="email" placeholder="Email (opcional)" value={cliente.email} onChange={(e) => setCliente({ ...cliente, email: e.target.value })} />
      </div>
      <div className="venta-botones">
        <button onClick={guardarVenta} disabled={carrito.length === 0}>Guardar Venta</button>
        {ventaGuardada && (
          <NotaVentaPDF
            ventaId={ventaId}
            fechaVenta={fechaVenta}
            cliente={cliente}
            metodoPago={metodoPago}
            carrito={carrito}
            total={total}
            pagoCliente={pagoCliente}
            cambio={cambio}
            usuario={userNombre}
            onLimpiar={limpiarFormulario}
          />
        )}
      </div>
    </div>
  );
};

export default RegistrarVenta;
