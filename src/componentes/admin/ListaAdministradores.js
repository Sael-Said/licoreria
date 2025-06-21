import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FormularioUsuarios.css";

const ListaAdministradores = () => {
  const [administradores, setAdministradores] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("https://backend-licoreria-o6e2.onrender.com/api/usuario/", {
          headers: { Authorization: `Token ${token}` },
        });
        const admins = response.data.filter(user => user.rol === "administrador");
        setAdministradores(admins);
      } catch (error) {
        console.error("Error al obtener administradores:", error);
      }
    };

    fetchAdmins();
  }, []);

  return (
    <div className="reporte-wrapper">

    <div className="formulario-container">
      <h2>Lista de Administradores</h2>
      {administradores.length === 0 ? (
        <p>No hay administradores registrados.</p>
      ) : (
        <ul>
          {administradores.map(user => (
            <li key={user.id} style={{ marginBottom: "1rem" }}>
              <strong>{user.username}</strong><br />
              Email: {user.email}<br />
              Teléfono: {user.telefono || "No registrado"}<br />
              Dirección: {user.direccion || "No registrada"}
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
  );
};

export default ListaAdministradores;
