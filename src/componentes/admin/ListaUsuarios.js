import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FormularioUsuarios.css";

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("https://backend-licoreria-o6e2.onrender.com/api/usuario/", {
          headers: { Authorization: `Token ${token}` },
        });
        const soloUsuarios = response.data.filter(user => user.rol === "usuario");
        setUsuarios(soloUsuarios);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    fetchUsuarios();
  }, []);

  const handleToggleBloqueo = async (id, isActive) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(`https://backend-licoreria-o6e2.onrender.com/api/usuario/${id}/`, {
        is_active: !isActive
      }, {
        headers: { Authorization: `Token ${token}` }
      });
      setUsuarios(prev =>
        prev.map(user =>
          user.id === id ? { ...user, is_active: !isActive } : user
        )
      );
    } catch (error) {
      console.error("Error al cambiar estado del usuario:", error);
    }
  };

  return (
    <div className="reporte-wrapper">
      <div className="formulario-container">
        <h2>Lista de Usuarios</h2>
        {usuarios.length === 0 ? (
          <p>No hay usuarios registrados.</p>
        ) : (
          <ul>
            {usuarios.map(user => (
              <li key={user.id} style={{ marginBottom: "1rem" }}>
                <strong>{user.username}</strong><br />
                Email: {user.email}<br />
                Teléfono: {user.telefono || "No registrado"}<br />
                Dirección: {user.direccion || "No registrada"}<br />
                Estado:{" "}
                <span style={{ color: user.is_active ? "green" : "red" }}>
                  {user.is_active ? "Activo" : "Bloqueado"}
                </span><br />
                <button
                  onClick={() => handleToggleBloqueo(user.id, user.is_active)}
                  style={{
                    marginTop: "5px",
                    padding: "6px 12px",
                    backgroundColor: user.is_active ? "#dc3545" : "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  {user.is_active ? "Bloquear" : "Desbloquear"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ListaUsuarios;
