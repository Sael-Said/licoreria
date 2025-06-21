import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FormularioUsuarios.css";

const ListaProveedores = () => {
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    const obtenerProveedores = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("https://backend-licoreria-o6e2.onrender.com/api/proveedor/", {
          headers: { Authorization: `Token ${token}` },
        });
        setProveedores(response.data);
      } catch (error) {
        console.error("Error al cargar proveedores:", error);
      }
    };
    obtenerProveedores();
  }, []);

  return (
    <div className="reporte-wrapper">
    <div className="formulario-container">
      <h2>Lista de Proveedores</h2>
      {proveedores.length === 0 ? (
        <p>No hay proveedores registrados.</p>
      ) : (
        <ul>
          {proveedores.map((prov) => (
            <li key={prov.id} style={{ marginBottom: "1rem" }}>
              <strong>{prov.nombre}</strong><br />
              Teléfono: {prov.telefono}<br />
              Email: {prov.email || "No registrado"}
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
  );
};

export default ListaProveedores;
