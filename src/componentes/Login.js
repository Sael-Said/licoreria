// src/componentes/Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

// Importa la imagen
import fondoLogin from "./img/fondo1.jpg";

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login/", {
        username,
        password
      });

      const { token, user_id, username: userName, rol } = response.data;

const authData = {
  token,
  user_id,
  username: userName,
  rol,
};

// Guarda el token por separado para facilitar su acceso
localStorage.setItem("token", token); // ✅ solución
localStorage.setItem("authData", JSON.stringify(authData));
localStorage.setItem("user_id", user_id); // 👈 esto es lo que usas en el resto del sistema
localStorage.setItem("username", userName);
localStorage.setItem("rol", rol);

setAuth(authData);

      
      setAuth({
        token,
        user_id,
        username: userName,
        rol,
      });

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
            <label className="login-label">Username</label>
            <input
              type="text"
              className="login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="login-form-group">
            <label className="login-label">Password</label>
            <input
              type="password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="login-button" type="submit">Login</button>
        </form>
        {errorMessage && <p className="login-error">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Login;
