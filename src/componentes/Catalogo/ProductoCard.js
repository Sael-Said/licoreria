import React from "react";

const ProductoCard = ({ producto }) => {
  const numeroWhatsapp = "59171234567";
  const enviarMensaje = () => {
    const mensaje = `Hola, me interesa el producto "${producto.nombre_producto}".`;
    const url = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="producto-card">
  <img src={`https://backend-licoreria-o6e2.onrender.com${producto.imagen}`} alt={producto.nombre_producto} />
  <h3>{producto.nombre_producto}</h3>
  <p>{producto.descripcion}</p>
  <strong>{producto.precio_venta} Bs</strong>
  <button onClick={() => enviarMensaje(producto)} className="whatsapp-btn">
    Consultar por WhatsApp
  </button>
</div>

  );
};

export default ProductoCard;
