import React, { useState } from "react";
import ProductoCard from "./ProductoCard";

const CategoriaBloque = ({ categoria, productos }) => {
  const [pagina, setPagina] = useState(1);
  const productosPorPagina = 5;
  const totalPaginas = Math.ceil(productos.length / productosPorPagina);
  const inicio = (pagina - 1) * productosPorPagina;
  const productosPagina = productos.slice(inicio, inicio + productosPorPagina);

  const handlePrev = () => setPagina((p) => Math.max(p - 1, 1));
  const handleNext = () => setPagina((p) => Math.min(p + 1, totalPaginas));

  const placeholders = Array.from({
    length: Math.max(0, productosPorPagina - productosPagina.length),
  });

  return (
    <section className="categoria-bloque">
      <div className="categoria-header">
        <h3>{categoria.nombre_categoria}</h3>
        {totalPaginas > 1 && (
          <div className="flechas">
            <button onClick={handlePrev} disabled={pagina === 1}>⬅️</button>
            <button onClick={handleNext} disabled={pagina === totalPaginas}>➡️</button>
          </div>
        )}
      </div>

      <div className="categoria-grid">
        {productosPagina.map((prod) => (
          <ProductoCard key={prod.id} producto={prod} />
        ))}

        {/* Agregar tarjetas vacías si hay menos de 5 productos */}
        {placeholders.map((_, index) => (
          <div className="producto-card placeholder" key={`ph-${index}`}></div>
        ))}
      </div>
    </section>
  );
};

export default CategoriaBloque;
