import React, { useState } from "react";
import axios from "axios";
import "./FormularioUsuarios.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AgregarAdministrador = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    telefono: "",
    direccion: "",
    rol: "administrador",
  });

  const [mensaje, setMensaje] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false); // 👁️

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post("http://localhost:8000/api/usuario/", formData, {
        headers: { Authorization: `Token ${token}` },
      });

      setMensaje("✅ Administrador registrado con éxito");
      setFormData({
        username: "",
        email: "",
        password: "",
        telefono: "",
        direccion: "",
        rol: "administrador",
      });
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setMensaje(`❌ ${JSON.stringify(error.response?.data)}`);
    }
  };

  return (
    <div className="reporte-wrapper">
      <div className="formulario-container">
        <h2>Registrar Administrador</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Nombre de usuario" value={formData.username} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} required />
          
          <div className="input-con-ojito">
            <input
              type={mostrarContrasena ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span onClick={() => setMostrarContrasena(!mostrarContrasena)}>
              {mostrarContrasena ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <input type="text" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} required />
          <input type="text" name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleChange} required />
          <button type="submit">Registrar</button>
        </form>
        {mensaje && <p>{mensaje}</p>}
      </div>
    </div>
  );
};

export default AgregarAdministrador;
