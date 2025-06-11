import React from "react";

const Paginacion = ({ paginaActual, totalPaginas, setPaginaActual }) => (
  <div className="paginacion">
    <button disabled={paginaActual === 1} onClick={() => setPaginaActual(p => p - 1)}>⬅️</button>
    <span>Página {paginaActual} de {totalPaginas}</span>
    <button disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual(p => p + 1)}>➡️</button>
  </div>
);

export default Paginacion;
