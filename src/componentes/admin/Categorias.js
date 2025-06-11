import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap
import "./Categorias.css";
import SidebarContext from "../comunes/SidebarContext";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [nombreCategoria, setNombreCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editingCategoriaId, setEditingCategoriaId] = useState(null);

  const { menuOpen } = useContext(SidebarContext);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/categoria/", {
        headers: { Authorization: `Token ${token}` },
      });
      setCategorias(response.data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const datos = {
      nombre_categoria: nombreCategoria,
      descripcion: descripcion,
    };

    try {
      if (editingCategoriaId) {
        await axios.put(`http://localhost:8000/api/categoria/${editingCategoriaId}/`, datos, {
          headers: { Authorization: `Token ${token}` },
        });
      } else {
        await axios.post("http://localhost:8000/api/categoria/", datos, {
          headers: { Authorization: `Token ${token}` },
        });
      }
      resetForm();
      fetchCategorias();
    } catch (error) {
      console.error("Error al guardar categoría:", error);
    }
  };

  const handleEdit = (categoria) => {
    setNombreCategoria(categoria.nombre_categoria);
    setDescripcion(categoria.descripcion);
    setEditingCategoriaId(categoria.id);
  };

  const handleDelete = async (id) => {
    const confirmar = window.confirm("¿Estás seguro que deseas eliminar esta categoría?");
    if (!confirmar) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8000/api/categoria/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      fetchCategorias();
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
    }
  };

  const resetForm = () => {
    setNombreCategoria("");
    setDescripcion("");
    setEditingCategoriaId(null);
  };

  return (
    <div className="categorias-wrapper">
      <div className="categorias-container">
        <h1 className="categorias-title">Gestión de Categorías</h1>

        <form onSubmit={handleSubmit} className="categorias-form">
          <input
            type="text"
            placeholder="Nombre de categoría"
            value={nombreCategoria}
            onChange={(e) => setNombreCategoria(e.target.value)}
            className="categorias-input"
            required
          />
          <input
            type="text"
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="categorias-input"
          />
          <button type="submit" className="categorias-btn">
            {editingCategoriaId ? "Actualizar" : "Agregar"}
          </button>
          {editingCategoriaId && (
            <button type="button" onClick={resetForm} className="categorias-btn-cancelar">
              Cancelar
            </button>
          )}
        </form>

        <table className="table table-bordered table-striped mt-4">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.id}</td>
                <td>{categoria.nombre_categoria}</td>
                <td>{categoria.descripcion}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => handleEdit(categoria)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(categoria.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categorias;
