import React, { useState } from "react";
import axios from "axios";
import "./FormularioUsuarios.css";

const AgregarProveedor = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
  });
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post("https://backend-licoreria-o6e2.onrender.com/api/proveedor/", formData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setMensaje("✅ Proveedor registrado");
      setFormData({ nombre: "", telefono: "", email: "" });
    } catch (error) {
      console.error("Error al registrar proveedor:", error);
      setMensaje("❌ Error al registrar proveedor");
    }
  };

  return (
    <div className="reporte-wrapper">
    <div className="formulario-container">
      <h2>Agregar Proveedor</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
        <input type="text" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Correo (opcional)" value={formData.email} onChange={handleChange} />
        <button type="submit">Registrar</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
    </div>
  );
};

export default AgregarProveedor;
