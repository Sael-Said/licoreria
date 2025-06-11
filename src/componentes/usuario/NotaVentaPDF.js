// src/componentes/usuario/NotaVentaPDF.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../img/logo_redimensionado.png";

const NotaVentaPDF = ({ ventaId, fechaVenta, cliente, metodoPago, carrito, total, pagoCliente, cambio, onLimpiar }) => {
  const generar = async () => {
    // Tamaño personalizado tipo ticket: 80mm de ancho
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 200 + carrito.length * 10], // largo dinámico según productos
    });

    // Logo (esperar a que cargue)
    const img = new Image();
    img.src = logo;
    await new Promise(resolve => {
      img.onload = resolve;
    });

    doc.addImage(img, "PNG", 25, 5, 30, 15); // centrado aprox en 80mm

    // Título y datos de tienda
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("LICORERÍA EL PARCERO", 40, 25, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text("Av. Cardenal Julio Terrazas S/N", 40, 30, { align: "center" });
    doc.text("Vallegrande - Tel: 78945612", 40, 34, { align: "center" });
    doc.line(5, 37, 75, 37); // línea separadora

    // Datos de la venta
    const user = localStorage.getItem("username") || "(usuario)";
    doc.setFontSize(9);
    doc.text(`Venta N°: ${ventaId}`, 5, 42);
    doc.text(`Fecha: ${new Date(fechaVenta).toLocaleString()}`, 5, 46);
    doc.text(`Cajero: ${user}`, 5, 50);

    let y = 55;
    if (cliente.nombre) doc.text(`Cliente: ${cliente.nombre}`, 5, (y += 5));
    if (cliente.ci) doc.text(`CI/NIT: ${cliente.ci}`, 5, (y += 5));
    if (cliente.direccion) doc.text(`Dirección: ${cliente.direccion}`, 5, (y += 5));
    if (cliente.telefono) doc.text(`Teléfono: ${cliente.telefono}`, 5, (y += 5));
    if (cliente.email) doc.text(`Email: ${cliente.email}`, 5, (y += 5));
    doc.text(`Pago: ${metodoPago}`, 5, (y += 7));

    // Tabla con productos
    autoTable(doc, {
  startY: y + 3,
  head: [["Cant", "Producto", "Total"]],
  body: carrito.map(p => [
    p.cantidad.toString(),
    p.nombre_producto,
    (p.precio_venta * p.cantidad).toFixed(2)
  ]),
  theme: "plain",
  styles: {
    fontSize: 8,
    cellPadding: { top: 1, bottom: 1, left: 1, right: 1 },
    valign: "middle",
    overflow: "linebreak",
  },
  headStyles: {
    fontStyle: "bold",
    halign: "center",
    valign: "middle",
    fillColor: [240, 240, 240],
    textColor: 20,
  },
  columnStyles: {
    0: { cellWidth: 15, halign: "center" },  // Cant
    1: { cellWidth: 40, halign: "left" },    // Producto
    2: { cellWidth: 20, halign: "right" },   // Total
  },
  margin: { left: 5, right: 5 },
});


    const yFinal = doc.lastAutoTable.finalY;
    doc.setFontSize(10);
    doc.text(`TOTAL: Bs ${total.toFixed(2)}`, 5, yFinal + 8);
    doc.text(`Pagó: Bs ${parseFloat(pagoCliente).toFixed(2)}`, 5, yFinal + 13);
    doc.text(`Cambio: Bs ${parseFloat(cambio).toFixed(2)}`, 5, yFinal + 18);

    doc.setFontSize(9);
    doc.text("Gracias por tu compra", 40, yFinal + 26, { align: "center" });
    doc.line(5, yFinal + 22, 75, yFinal + 22);

    // Mostrar diálogo de impresión
    doc.autoPrint();
    window.open(doc.output("bloburl"));

    // Limpieza (opcional)
    onLimpiar();
  };

  return (
    <button onClick={generar}>
      🧾 Imprimir Nota de Venta
    </button>
  );
};

export default NotaVentaPDF;
