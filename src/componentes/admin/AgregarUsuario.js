import React, { useState } from "react";
import axios from "axios";
import "./FormularioUsuarios.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AgregarUsuario = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    telefono: "",
    direccion: "",
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
      await axios.post(
        "https://backend-licoreria-o6e2.onrender.com/api/usuario/",
        {
          ...formData,
          rol: "usuario",
        },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      setMensaje("✅ Usuario registrado con éxito");
      setFormData({
        username: "",
        email: "",
        password: "",
        telefono: "",
        direccion: "",
      });
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      setMensaje("❌ Error al registrar usuario");
    }
  };

  return (
    <div className="formulario-wrapper">
      <div className="formulario-container">
        <h2>Registrar Usuario</h2>
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

export default AgregarUsuario;
