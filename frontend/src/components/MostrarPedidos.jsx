// src/components/PedidosEnCurso.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

function PedidosEnCurso() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await axios.get(`${API_URL}/pedidos/en-curso`);
        setPedidos(res.data);
      } catch (error) {
        console.error('Error al obtener pedidos en curso:', error);
      }
    };

    fetchPedidos();

    // Refrescamos cada 10 segundos automáticamente
    const intervalo = setInterval(fetchPedidos, 10000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="admin-panel">
      <h2>📦 Pedidos en curso</h2>

      {pedidos.length === 0 ? (
        <p>No hay pedidos en curso.</p>
      ) : (
        <div className="pedidos-lista">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="pedido-card">
              <h3>Mesa {pedido.mesa.numero}</h3>
              <p><strong>Estado:</strong> {pedido.estado}</p>
              <p><strong>Hora:</strong> {new Date(pedido.creado_at).toLocaleTimeString()}</p>
              <ul>
                {pedido.detalles.map((det) => (
                  <li key={det.id}>
                    🍽️ {det.plato.nombre} — x{det.cantidad}
                    {det.observacion && <em> ({det.observacion})</em>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PedidosEnCurso;
