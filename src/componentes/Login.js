// src/componentes/Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import fondoLogin from "./img/fondo1.jpg";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://backend-licoreria-o6e2.onrender.com/api/login/", {
        username,
        password,
      });

      const { token, user_id, username: userName, rol } = response.data;

      const authData = {
        token,
        user_id,
        username: userName,
        rol,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("authData", JSON.stringify(authData));
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("username", userName);
      localStorage.setItem("rol", rol);

      setAuth(authData);

      if (rol === "administrador") {
        navigate("/admin");
      } else {
        navigate("/usuario");
      }
    } catch (error) {
      if (error.response?.status === 403) {
        setErrorMessage("🚫 Tu cuenta ha sido desactivada. Contacta al administrador.");
      } else if (error.response?.status === 400) {
        setErrorMessage("🚫 Datos Incorrectos");
      } else {
        setErrorMessage("⚠️ Error en el servidor.");
      }
    }
  };

  return (
    <div
      className="login-background"
      style={{
        backgroundImage: `url(${fondoLogin})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <div className="login-container">
        <h2 className="login-title">Iniciar Sesión</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <div className="login-form-group">
            <label className="login-label">Nombre de Usuario</label>
            <input
              type="text"
              className="login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="login-form-group">
            <label className="login-label">Contraseña</label>
            <div style={{ position: "relative" }}>
              <input
                type={verPassword ? "text" : "password"}
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={() => setVerPassword(!verPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#555",
                }}
              >
                {verPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <button className="login-button" type="submit">Iniciar Sesión</button>
        </form>
        {errorMessage && <p className="login-error">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Login;
