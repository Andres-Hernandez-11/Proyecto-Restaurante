// src/components/PedidosEnCurso.jsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

function PedidosEnCurso() {
  const [pedidos, setPedidos] = useState([]);

  // 1. Función para obtener pedidos en curso
  const fetchPedidos = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/pedidos/en-curso`);
      setPedidos(res.data);
    } catch (error) {
      console.error('Error al obtener pedidos en curso:', error);
    }
  }, []);

  useEffect(() => {
    fetchPedidos(); // Llama al cargar

    const intervalo = setInterval(fetchPedidos, 10000); // refresca cada 10s
    return () => clearInterval(intervalo);
  }, [fetchPedidos]);

  // 2. Cambiar estado del pedido
  const handleChangeEstado = async (id, nuevoEstado) => {
    if (nuevoEstado === 'cancelado') {
      if (!window.confirm('¿Estás seguro de que quieres cancelar este pedido?')) {
        return;
      }
    }

    try {
      await axios.put(`${API_URL}/pedidos/${id}/estado`, { estado: nuevoEstado });
      fetchPedidos();
    } catch (error) {
      console.error(`Error al cambiar estado a ${nuevoEstado}:`, error);
      alert('Error al actualizar el pedido.');
    }
  };

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
              <p>
                <strong>Estado:</strong>{' '}
                <span className={`estado-pedido ${pedido.estado}`}>
                  {pedido.estado.toUpperCase()}
                </span>
              </p>
              <p><strong>Hora:</strong> {new Date(pedido.creado_at).toLocaleTimeString()}</p>
              <ul>
                {pedido.detalles.map((det) => (
                  <li key={det.id}>
                    🍽 {det.plato.nombre} — x{det.cantidad}
                    {det.observacion && <em> ({det.observacion})</em>}
                  </li>
                ))}
              </ul>
              
              <div className="pedido-acciones admin-buttons">
                {pedido.estado === 'nuevo' && (
                  <button 
                    onClick={() => handleChangeEstado(pedido.id, 'preparando')} 
                    className="btn-preparar"
                  >
                    Marcar como "Preparando"
                  </button>
                )}
                
                {pedido.estado === 'preparando' && (
                  <button 
                    onClick={() => handleChangeEstado(pedido.id, 'listo')} 
                    className="btn-listo"
                  >
                    Marcar como "Listo"
                  </button>
                )}

                {(pedido.estado === 'nuevo' || pedido.estado === 'preparando') && (
                  <button 
                    onClick={() => handleChangeEstado(pedido.id, 'cancelado')} 
                    className="btn-delete"
                  >
                    Cancelar Pedido
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PedidosEnCurso;
