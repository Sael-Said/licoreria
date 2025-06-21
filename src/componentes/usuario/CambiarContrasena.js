import React, { useState } from "react";
import axios from "axios";
import "./CambiarContrasena.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const CambiarContrasena = () => {
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
        "http://localhost:8000/auth/users/set_password/",
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

        if (data.new_password) {
          errores.push(...data.new_password);
        }

        if (data.detail) {
          errores.push(data.detail);
        }

        const mensajesTraducidos = errores.map(err => {
          if (err.includes("too similar")) return "❌ La contraseña es muy similar al nombre de usuario.";
          if (err.includes("too short")) return "❌ La contraseña es demasiado corta. Debe tener al menos 8 caracteres.";
          if (err.includes("too common")) return "❌ La contraseña es demasiado común. Usa una más segura.";
          return `❌ ${err}`;
        });

        setMensaje(mensajesTraducidos.join(" "));
      } else {
        setMensaje("❌ Error desconocido al cambiar la contraseña.");
      }
    }
  };

  return (
    <div className="cambiar-contrasena-container">
      <h2>Cambiar Contraseña</h2>
      <form className="cambiar-contrasena-form" onSubmit={handleSubmit}>
        <label>Contraseña actual</label>
        <div className="input-con-ojito">
          <input
            type={verActual ? "text" : "password"}
            value={actual}
            onChange={(e) => setActual(e.target.value)}
            required
          />
          <span onClick={() => setVerActual(!verActual)} className="ojito">
            {verActual ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <label>Nueva contraseña</label>
        <div className="input-con-ojito">
          <input
            type={verNueva ? "text" : "password"}
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
            required
          />
          <span onClick={() => setVerNueva(!verNueva)} className="ojito">
            {verNueva ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <label>Confirmar nueva contraseña</label>
        <div className="input-con-ojito">
          <input
            type={verConfirmar ? "text" : "password"}
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            required
          />
          <span onClick={() => setVerConfirmar(!verConfirmar)} className="ojito">
            {verConfirmar ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit">Cambiar Contraseña</button>
      </form>

      {mensaje && <div className="mensaje-error">{mensaje}</div>}
    </div>
  );
};

export default CambiarContrasena;
