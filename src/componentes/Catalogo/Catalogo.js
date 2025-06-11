import React, { useEffect, useState } from "react";
import axios from "axios";
import HeaderCatalogo from "./HeaderCatalogo";
import FooterCatalogo from "./FooterCatalogo";
import CategoriaBloque from "./CategoriaBloque";
import "./Catalogo.css";

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/catalogo/")
      .then(res => setProductos(res.data))
      .catch(err => console.error("Error al cargar productos:", err));

    axios.get("http://localhost:8000/api/categoria/")
      .then(res => setCategorias(res.data))
      .catch(err => console.error("Error al cargar categorías:", err));
  }, []);

  return (
    <div className="catalogo-root">
      <HeaderCatalogo />
      <main className="catalogo-container">
  <h2 className="catalogo-titulo">Catálogo de Productos</h2>
  {categorias.map(cat => {
    const productosCat = productos.filter(p => p.categoria_nombre === cat.nombre_categoria);
    return (
      <CategoriaBloque key={cat.id} categoria={cat} productos={productosCat} />
    );
  })}

  {/* Espaciador para móviles cuando hay pocos productos */}
  {productos.length < 2 && (
    <div style={{ minHeight: '200px' }}></div>
  )}
</main>

      <FooterCatalogo />
    </div>
  );
};

export default Catalogo;
