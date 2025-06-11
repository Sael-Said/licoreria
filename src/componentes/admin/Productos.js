import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Productos.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import EditarProducto from "./EditarProducto";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [productoEditando, setProductoEditando] = useState(null);

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  const exportarExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(productos.map(prod => ({
      "Nombre del Producto": prod.nombre_producto,
      "Descripción": prod.descripcion,
      "Categoría ID": prod.categoria,
      "Precio Compra": prod.precio_compra,
      "Precio Venta": prod.precio_venta,
      "Stock": prod.stock,
      "Stock Mínimo": prod.stock_minimo,
      "Fecha Vencimiento": prod.fecha_vencimiento,
      "Imagen": prod.imagen ? prod.imagen : "Sin imagen",
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");
    XLSX.writeFile(workbook, "Productos.xlsx");
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Nombre", "Descripción", "Categoría ID", "Precio Compra",
      "Precio Venta", "Stock", "Stock Mínimo", "Fecha Vencimiento", "Imagen"
    ];
    const tableRows = productos.map(prod => [
      prod.nombre_producto,
      prod.descripcion,
      prod.categoria,
      `${prod.precio_compra} Bs`,
      `${prod.precio_venta} Bs`,
      prod.stock,
      prod.stock_minimo,
      prod.fecha_vencimiento ? prod.fecha_vencimiento : "Sin fecha",
      prod.imagen ? "Sí tiene imagen" : "Sin imagen"
    ]);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.text("Lista de Productos", 14, 15);
    doc.save("Productos.pdf");
  };

  const fetchProductos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/producto/", {
        headers: { Authorization: `Token ${token}` },
      });
      setProductos(response.data);
      const productosBajoStock = response.data.filter(p => p.stock < 10);
      if (productosBajoStock.length > 0) {
        const mensajeAlerta = productosBajoStock.map(p => `${p.nombre_producto}: ${p.stock} unidades`).join('\n');
        alert(`⚠️ Productos con bajo stock:\n${mensajeAlerta}`);
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

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

  const handleEdit = (producto) => {
    setProductoEditando(producto);
  };

  const cerrarModal = () => {
    setProductoEditando(null);
  };

  const desactivarProducto = async (id) => {
    const confirmar = window.confirm("¿Deseas desactivar este producto?");
    if (!confirmar) return;

    const token = localStorage.getItem("token");
    try {
      await axios.patch(`http://localhost:8000/api/producto/${id}/`, {
        activo: false
      }, {
        headers: { Authorization: `Token ${token}` },
      });
      fetchProductos();
    } catch (error) {
      console.error("Error al desactivar producto:", error);
    }
  };

  const activarProducto = async (id) => {
    const confirmar = window.confirm("¿Deseas activar este producto?");
    if (!confirmar) return;

    const token = localStorage.getItem("token");
    try {
      await axios.patch(`http://localhost:8000/api/producto/${id}/`, {
        activo: true
      }, {
        headers: { Authorization: `Token ${token}` },
      });
      fetchProductos();
    } catch (error) {
      console.error("Error al activar producto:", error);
    }
  };

  return (
    <div className="main-content-inner">
      <h1 className="productos-title">Gestión de Productos</h1>

      <div className="productos-actions">
        <button onClick={exportarExcel} className="productos-btn-excel">Exportar a Excel</button>
        <button onClick={exportarPDF} className="productos-btn-pdf">Exportar a PDF</button>
      </div>

      <table className="productos-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Precio Compra</th>
            <th>Precio Venta</th>
            <th>Stock</th>
            <th>Stock Mínimo</th>
            <th>Fecha Vencimiento</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(producto => {
            const categoriaEncontrada = categorias.find(cat => cat.id === producto.categoria);
            return (
              <tr key={producto.id} style={{ backgroundColor: producto.activo ? "white" : "#f0f0f0" }}>
                <td>{producto.nombre_producto}</td>
                <td>{producto.descripcion}</td>
                <td>{categoriaEncontrada ? categoriaEncontrada.nombre_categoria : "Sin Categoría"}</td>
                <td>{producto.precio_compra} Bs</td>
                <td>{producto.precio_venta} Bs</td>
                <td style={{
                  backgroundColor: producto.stock <= 5 ? '#dc3545' : producto.stock <= 10 ? '#ffc107' : 'transparent',
                  color: '#000',
                  textAlign: 'center'
                }}>{producto.stock}</td>
                <td>{producto.stock_minimo}</td>
                <td>{producto.fecha_vencimiento || "Sin fecha"}</td>
                <td>{producto.imagen ? <img src={producto.imagen} alt="Producto" style={{ width: "50px", height: "50px", objectFit: "cover" }} /> : "Sin imagen"}</td>
                <td>
                  <button className="productos-btn-small productos-btn-editar" onClick={() => handleEdit(producto)}>Editar</button>
                  {producto.activo ? (
                    <button className="productos-btn-small productos-btn-desactivar" onClick={() => desactivarProducto(producto.id)}>Desactivar</button>
                  ) : (
                    <button className="productos-btn-small productos-btn-activar" onClick={() => activarProducto(producto.id)}>Activar</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {productoEditando && (
        <EditarProducto
          producto={productoEditando}
          onClose={cerrarModal}
          onProductoActualizado={fetchProductos}
        />
      )}
    </div>
  );
};

export default Productos;
