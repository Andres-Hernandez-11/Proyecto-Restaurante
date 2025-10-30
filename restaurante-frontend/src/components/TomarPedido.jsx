// src/components/TomarPedido.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

function TomarPedido() {
  // Estados para guardar los datos de la API
  const [mesas, setMesas] = useState([]);
  const [platos, setPlatos] = useState([]);

  // Estados para manejar el pedido actual
  const [mesaSeleccionada, setMesaSeleccionada] = useState('');
  const [pedidoActual, setPedidoActual] = useState([]); // Este será nuestro "carrito"

  // useEffect para cargar mesas y platos cuando el componente se monte
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Hacemos las dos peticiones a la vez para más eficiencia
        const [resMesas, resPlatos] = await Promise.all([
          axios.get(`${API_URL}/mesas`),
          axios.get(`${API_URL}/platos`),
        ]);
        setMesas(resMesas.data);
        setPlatos(resPlatos.data);
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
      }
    };
    cargarDatos();
  }, []);

  // Función para añadir un plato al pedido actual
  const handleAgregarPlato = (plato) => {
    // Buscamos si el plato ya está en el pedido
    const platoExistente = pedidoActual.find(item => item.id_plato === plato.id);

    if (platoExistente) {
      // Si ya existe, solo aumentamos la cantidad
      setPedidoActual(pedidoActual.map(item => 
        item.id_plato === plato.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      // Si es nuevo, lo añadimos con cantidad 1
      setPedidoActual([...pedidoActual, { id_plato: plato.id, nombre: plato.nombre, cantidad: 1 }]);
    }
  };

  // Función para enviar el pedido al backend
  const handleEnviarPedido = async () => {
    if (!mesaSeleccionada || pedidoActual.length === 0) {
      alert('Por favor, selecciona una mesa y añade al menos un plato.');
      return;
    }

    // Creamos el objeto que nuestra API espera
    const nuevoPedido = {
      id_mesa: parseInt(mesaSeleccionada),
      detalles: pedidoActual.map(({ id_plato, cantidad }) => ({ id_plato, cantidad })),
    };

    try {
      await axios.post(`${API_URL}/pedidos`, nuevoPedido);
      alert('¡Pedido enviado a la cocina!');
      // Limpiamos el estado para un nuevo pedido
      setMesaSeleccionada('');
      setPedidoActual([]);
    } catch (error) {
      console.error('Error al enviar el pedido:', error);
      alert('Hubo un error al enviar el pedido.');
    }
  };

  return (
    <div>
      <h1>Tomar Nuevo Pedido</h1>

      {/* Selector de Mesa */}
      <div className="form-group">
        <label>Seleccionar Mesa:</label>
        <select value={mesaSeleccionada} onChange={(e) => setMesaSeleccionada(e.target.value)}>
          <option value="">-- Elige una mesa --</option>
          {mesas.map(mesa => (
            <option key={mesa.id} value={mesa.id}>{mesa.numero}</option>
          ))}
        </select>
      </div>

      <div className="container">
        {/* Lista de Platos Disponibles */}
        <div className="menu-disponible">
          <h2>Menú</h2>
          {platos.map(plato => (
            <div key={plato.id} className="plato-item">
              <span>{plato.nombre} - ${plato.precio}</span>
              <button onClick={() => handleAgregarPlato(plato)}>+</button>
            </div>
          ))}
        </div>

        {/* Resumen del Pedido Actual */}
        <div className="pedido-actual">
          <h2>Pedido Actual</h2>
          {pedidoActual.length === 0 ? (
            <p>Añade platos desde el menú.</p>
          ) : (
            <ul>
              {pedidoActual.map(item => (
                <li key={item.id_plato}>
                  {item.nombre} x {item.cantidad}
                </li>
              ))}
            </ul>
          )}
          <button onClick={handleEnviarPedido} disabled={!mesaSeleccionada || pedidoActual.length === 0}>
            Enviar Pedido a Cocina
          </button>
        </div>
      </div>
    </div>
  );
}

export default TomarPedido;