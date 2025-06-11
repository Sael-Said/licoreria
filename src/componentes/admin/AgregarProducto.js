// src/componentes/admin/AgregarProducto.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AgregarProducto.css";

const AgregarProducto = ({ onProductoAgregado }) => {
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    nombre_producto: "",
    descripcion: "",
    categoria: "",
    precio_compra: "",
    precio_venta: "",
    stock: "",
    stock_minimo: 5,
    fecha_vencimiento: "",
    imagen: null,
  });

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/categoria/", {
        headers: { Authorization: `Token ${token}` },
      });
      setCategorias(response.data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "imagen" && value !== null) {
        data.append(key, value);
      } else {
        data.append(key, value);
      }
    });
    try {
      await axios.post("http://localhost:8000/api/producto/", data, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      resetForm();
      if (onProductoAgregado) onProductoAgregado();
      alert("✅ Producto agregado correctamente.");
    } catch (error) {
      console.error("Error al guardar producto:", error);
      alert("❌ Error al guardar producto.");
    }
  };

  const resetForm = () => {
    setFormData({
      nombre_producto: "",
      descripcion: "",
      categoria: "",
      precio_compra: "",
      precio_venta: "",
      stock: "",
      stock_minimo: 5,
      fecha_vencimiento: "",
      imagen: null,
    });
  };

  return (
    <div className="agregar-producto-wrapper">
    <div className="agregar-producto-container">
      <h2>Nuevo Producto</h2>
      <form onSubmit={handleSubmit} className="agregar-producto-form">
        <label>Nombre del Producto:</label>
        <input type="text" name="nombre_producto" value={formData.nombre_producto} onChange={handleChange} required />

        <label>Descripción:</label>
        <input type="text" name="descripcion" value={formData.descripcion} onChange={handleChange} />

        <label>Categoría:</label>
        <select name="categoria" value={formData.categoria} onChange={handleChange} required>
          <option value="">Seleccione Categoría</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nombre_categoria}</option>
          ))}
        </select>

        <label>Precio de Compra (Bs):</label>
        <input type="number" name="precio_compra" value={formData.precio_compra} onChange={handleChange} required />

        <label>Precio de Venta (Bs):</label>
        <input type="number" name="precio_venta" value={formData.precio_venta} onChange={handleChange} required />

        <label>Stock Inicial:</label>
        <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />

        <label>Stock Mínimo:</label>
        <input type="number" name="stock_minimo" value={formData.stock_minimo} onChange={handleChange} />

        <label>Fecha de Vencimiento:</label>
        <input type="date" name="fecha_vencimiento" value={formData.fecha_vencimiento} onChange={handleChange} />

        <label>Imagen del Producto:</label>
        <input type="file" name="imagen" onChange={handleChange} />

        <button type="submit">Agregar Producto</button>
        <button type="button" onClick={resetForm}>Cancelar</button>
      </form>
    </div>
    </div>
  );
};

export default AgregarProducto;
