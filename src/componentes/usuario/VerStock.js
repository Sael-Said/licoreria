// src/componentes/usuario/VerStock.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./VerStock.css";

const VerStock = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("https://backend-licoreria-o6e2.onrender.com/api/producto/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error al obtener productos:", err));
  }, []);

  return (
    <div className="stock-container">
      <h2>Inventario Disponible</h2>
      <table className="stock-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio de Venta</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.nombre_producto}</td>
              <td>{producto.categoria_nombre || "Sin categoria"}</td>
              <td>{parseFloat(producto.precio_venta).toFixed(2)} Bs</td>
              <td
            style={{
              backgroundColor:
                producto.stock <= 5 ? '#dc3545' :
                producto.stock <= 10 ? '#ffc107' : 'transparent',
              color: '#000',
              textAlign: 'center',
            }}
          >
            {producto.stock}
          </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VerStock;
