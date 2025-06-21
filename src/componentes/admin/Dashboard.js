import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const Dashboard = () => {
  const [totalVentas, setTotalVentas] = useState(0);
  const [productoMasVendido, setProductoMasVendido] = useState(null);
  const [productosBajoStock, setProductosBajoStock] = useState([]);
  const [ventasDiarias, setVentasDiarias] = useState([]);
  const [ventasSemanales, setVentasSemanales] = useState([]);
  const [ventasMensuales, setVentasMensuales] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchTotales = async () => {
      try {
        const ventasRes = await axios.get("https://backend-licoreria-o6e2.onrender.com/api/venta/", {
          headers: { Authorization: `Token ${token}` },
        });

        const total = ventasRes.data.reduce((sum, venta) => sum + parseFloat(venta.total), 0);
        setTotalVentas(total);

        const dias = {};
        const semanas = {};
        const meses = {};

        ventasRes.data.forEach((venta) => {
          const fechaObj = new Date(venta.fecha);
          const fecha = fechaObj.toLocaleDateString();
          dias[fecha] = (dias[fecha] || 0) + parseFloat(venta.total);

          const monday = new Date(fechaObj);
          monday.setDate(fechaObj.getDate() - ((fechaObj.getDay() + 6) % 7));
          const semanaKey = monday.toISOString().split("T")[0];
          semanas[semanaKey] = (semanas[semanaKey] || 0) + parseFloat(venta.total);

          const mesKey = `${fechaObj.getFullYear()}-${String(fechaObj.getMonth() + 1).padStart(2, "0")}-01`;
          meses[mesKey] = (meses[mesKey] || 0) + parseFloat(venta.total);
        });

        setVentasDiarias(Object.entries(dias).sort((a, b) => new Date(a[0]) - new Date(b[0])));
        setVentasSemanales(Object.entries(semanas).sort((a, b) => new Date(a[0]) - new Date(b[0])));
        setVentasMensuales(Object.entries(meses).sort((a, b) => new Date(a[0]) - new Date(b[0])));
      } catch (error) {
        console.error("Error al cargar ventas:", error);
      }
    };

    const fetchProductoMasVendido = async () => {
      try {
        const detallesRes = await axios.get("https://backend-licoreria-o6e2.onrender.com/api/detalleventa/", {
          headers: { Authorization: `Token ${token}` },
        });

        const contador = {};
        detallesRes.data.forEach((det) => {
          if (!contador[det.producto]) contador[det.producto] = 0;
          contador[det.producto] += det.cantidad;
        });

        let maxId = null;
        let maxCantidad = 0;
        for (const id in contador) {
          if (contador[id] > maxCantidad) {
            maxCantidad = contador[id];
            maxId = id;
          }
        }

        if (maxId) {
          const prodRes = await axios.get(`https://backend-licoreria-o6e2.onrender.com/api/producto/${maxId}/`, {
            headers: { Authorization: `Token ${token}` },
          });
          setProductoMasVendido({
            nombre: prodRes.data.nombre_producto,
            cantidad: maxCantidad,
          });
        }
      } catch (error) {
        console.error("Error al obtener producto más vendido:", error);
      }
    };

    const fetchStockBajo = async () => {
      try {
        const productosRes = await axios.get("https://backend-licoreria-o6e2.onrender.com/api/producto/", {
          headers: { Authorization: `Token ${token}` },
        });
        const bajos = productosRes.data.filter((p) => p.stock <= p.stock_minimo);
        setProductosBajoStock(bajos);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    fetchTotales();
    fetchProductoMasVendido();
    fetchStockBajo();
  }, []);

  const pieConfig = (label, labels, data, colors) => ({
    data: {
      labels,
      datasets: [
        {
          label,
          data,
          backgroundColor: colors,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
        title: { display: true, text: label },
      },
    },
  });

  return (
    <div className="main-content">
      <div className="dashboard-root">
        <div className="dashboard-container">
          <h1 className="dashboard-title">Dashboard del Administrador</h1>

          <div className="card-grid">
            <div className="card card-blue">
              <h2 className="card-title">Total Ventas</h2>
              <p className="card-value">{totalVentas.toFixed(2)} Bs</p>
            </div>

            {productoMasVendido && (
              <div className="card card-purple">
                <h2 className="card-title">Producto más vendido</h2>
                <p className="card-value">{productoMasVendido.nombre}</p>
                <p className="card-title">{productoMasVendido.cantidad} unidades</p>
              </div>
            )}

            <div className="card card-yellow">
              <h2 className="card-title">Productos con stock bajo</h2>
              <ul className="stock-list">
                {productosBajoStock.length === 0 ? (
                  <li>Todo en orden</li>
                ) : (
                  productosBajoStock.map((prod) => (
                    <li key={prod.id}>
                      {prod.nombre_producto} - {prod.stock} u.
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          {/* Gráficos Pie */}
          <div className="dashboard-chart">
            <Pie {...pieConfig(
              "Ventas por Día",
              ventasDiarias.map((v) => v[0]),
              ventasDiarias.map((v) => v[1]),
              ["#4A90E2", "#6CC1FF", "#A2D4FF", "#D0EAFF"]
            )} />
          </div>

          <div className="dashboard-chart">
            <Pie {...pieConfig(
              "Ventas por Semana",
              ventasSemanales.map((v) => v[0]),
              ventasSemanales.map((v) => v[1]),
              ["#50C878", "#72DB9B", "#9EF0B5", "#D1F9D5"]
            )} />
          </div>

          <div className="dashboard-chart">
            <Pie {...pieConfig(
              "Ventas por Mes",
              ventasMensuales.map((v) => v[0]),
              ventasMensuales.map((v) => v[1]),
              ["#FF8C42", "#FFAC6E", "#FFCDA1", "#FFE5CC"]
            )} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
