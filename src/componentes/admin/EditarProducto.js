// src/componentes/admin/EditarProducto.js
import React, { useState, useEffect } from "react";
import "./AgregarProducto.css";
import axios from "axios";

const EditarProducto = ({ producto, onClose, onProductoActualizado }) => {
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

  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    if (producto) {
      setFormData({
        ...producto,
        imagen: null, // para no cargar imagen como string por defecto
      });
    }

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

    fetchCategorias();
  }, [producto]);

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

    // Enviamos todos los campos excepto la imagen si no fue cambiada
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "imagen") {
        if (value instanceof File) {
          data.append("imagen", value);
        }
      } else {
        data.append(key, value);
      }
    });

    try {
      await axios.put(`http://localhost:8000/api/producto/${producto.id}/`, data, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      onProductoActualizado();
      onClose();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      alert("❌ No se pudo actualizar el producto.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="agregar-producto-container">
        <h2>Editar Producto</h2>
        <form onSubmit={handleSubmit} className="agregar-producto-form">
          <label>Nombre del Producto:</label>
          <input type="text" name="nombre_producto" value={formData.nombre_producto} onChange={handleChange} />

          <label>Descripción:</label>
          <input type="text" name="descripcion" value={formData.descripcion} onChange={handleChange} />

          <label>Categoría:</label>
          <select name="categoria" value={formData.categoria} onChange={handleChange} required>
            <option value="">Seleccione Categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre_categoria}
              </option>
            ))}
          </select>

          <label>Precio Compra (Bs):</label>
          <input type="number" name="precio_compra" value={formData.precio_compra} onChange={handleChange} />

          <label>Precio Venta (Bs):</label>
          <input type="number" name="precio_venta" value={formData.precio_venta} onChange={handleChange} />

          <label>Stock:</label>
          <input type="number" name="stock" value={formData.stock} onChange={handleChange} />

          <label>Stock Mínimo:</label>
          <input type="number" name="stock_minimo" value={formData.stock_minimo} onChange={handleChange} />

          <label>Fecha de Vencimiento:</label>
          <input type="date" name="fecha_vencimiento" value={formData.fecha_vencimiento || ""} onChange={handleChange} />

          <label>Imagen:</label>
          <input type="file" name="imagen" onChange={handleChange} />

          <button type="submit">Guardar Cambios</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
};

export default EditarProducto;
