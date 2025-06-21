import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./CambiarContrasena.css";

const CambiarContrasenaAdmin = () => {
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [verActual, setVerActual] = useState(false);
  const [verNueva, setVerNueva] = useState(false);
  const [verConfirmar, setVerConfirmar] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nueva !== confirmar) {
      setMensaje("❌ Las contraseñas nuevas no coinciden.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://backend-licoreria-o6e2.onrender.com/auth/users/set_password/",
        {
          current_password: actual,
          new_password: nueva,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      setMensaje("✅ Contraseña actualizada correctamente.");
      setActual("");
      setNueva("");
      setConfirmar("");
    } catch (error) {
      if (error.response && error.response.data) {
        const data = error.response.data;
        const errores = [];

        if (data.new_password) errores.push(...data.new_password);
        if (data.detail) errores.push(data.detail);

        const traducidos = errores.map(err => {
          if (err.includes("too similar")) return "❌ Muy similar al nombre de usuario.";
          if (err.includes("too short")) return "❌ Muy corta (mínimo 8 caracteres).";
          if (err.includes("too common")) return "❌ Muy común, usa una más segura.";
          return `❌ ${err}`;
        });

        setMensaje(traducidos.join(" "));
      } else {
        setMensaje("❌ Error al cambiar la contraseña.");
      }
    }
  };

  return (
    <div className="adminpass-wrapper">
      <div className="adminpass-box">
        <h2 className="adminpass-title">Cambiar Contraseña (Administrador)</h2>
        <form className="adminpass-form" onSubmit={handleSubmit}>
          <label className="adminpass-label">Contraseña actual</label>
          <div className="adminpass-input-group">
            <input
              type={verActual ? "text" : "password"}
              value={actual}
              onChange={(e) => setActual(e.target.value)}
              required
              className="adminpass-input"
            />
            <span onClick={() => setVerActual(!verActual)} className="adminpass-icon">
              {verActual ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <label className="adminpass-label">Nueva contraseña</label>
          <div className="adminpass-input-group">
            <input
              type={verNueva ? "text" : "password"}
              value={nueva}
              onChange={(e) => setNueva(e.target.value)}
              required
              className="adminpass-input"
            />
            <span onClick={() => setVerNueva(!verNueva)} className="adminpass-icon">
              {verNueva ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <label className="adminpass-label">Confirmar nueva contraseña</label>
          <div className="adminpass-input-group">
            <input
              type={verConfirmar ? "text" : "password"}
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              required
              className="adminpass-input"
            />
            <span onClick={() => setVerConfirmar(!verConfirmar)} className="adminpass-icon">
              {verConfirmar ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" className="adminpass-button">Cambiar Contraseña</button>
        </form>

        {mensaje && <div className="adminpass-msg">{mensaje}</div>}
      </div>
    </div>
  );
};

export default CambiarContrasenaAdmin;
