// src/components/TomarPedido.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function TomarPedido() {
  const [mesas, setMesas] = useState([]);
  const [platos, setPlatos] = useState([]);
  const [mesaSeleccionada, setMesaSeleccionada] = useState('');
  const [pedidoActual, setPedidoActual] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriasAbiertas, setCategoriasAbiertas] = useState({});

  useEffect(() => {
    const cargarDatos = async () => {
      try {
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

  const handleAgregarPlato = (plato) => {
    const platoExistente = pedidoActual.find(item => item.id_plato === plato.id);

    if (platoExistente) {
      setPedidoActual(pedidoActual.map(item => 
        item.id_plato === plato.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      setPedidoActual([...pedidoActual, { id_plato: plato.id, nombre: plato.nombre, cantidad: 1 }]);
    }
  };

  const handleEnviarPedido = async () => {
    if (!mesaSeleccionada || pedidoActual.length === 0) {
      alert('Por favor, selecciona una mesa y añade al menos un plato.');
      return;
    }

    const nuevoPedido = {
      id_mesa: parseInt(mesaSeleccionada),
      detalles: pedidoActual.map(({ id_plato, cantidad }) => ({ id_plato, cantidad })),
    };

    try {
      await axios.post(`${API_URL}/pedidos`, nuevoPedido);
      await axios.put(`${API_URL}/mesas/${mesaSeleccionada}`, { estado: "ocupada" });
      alert('¡Pedido enviado a la cocina!');
      setMesaSeleccionada('');
      setPedidoActual([]);
      window.location.reload();
    } catch (error) {
      console.error('Error al enviar el pedido:', error);
      alert('Hubo un error al enviar el pedido.');
    }
  };

  // --- Agrupar platos por categoría ---
  const categorias = platos.reduce((acc, plato) => {
    const cat = plato.categoria || 'Sin categoría';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(plato);
    return acc;
  }, {});

  // --- Filtro de búsqueda ---
  const platosFiltradosPorBusqueda = (lista) =>
    lista.filter((plato) =>
      plato.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

  // --- Toggle de categorías ---
  const toggleCategoria = (categoria) => {
    setCategoriasAbiertas(prev => ({
      ...prev,
      [categoria]: !prev[categoria]
    }));
  };

  return (
    <div className="tomar-pedido-container">
      <h1>Tomar Nuevo Pedido</h1>

      {/* Selector de Mesa */}
      <div className="form-group admin-panel">
        <label>Seleccionar Mesa:</label>
        <select
          value={mesaSeleccionada}
          onChange={(e) => setMesaSeleccionada(e.target.value)}
        >
          <option value="">-- Elige una mesa --</option>
          {mesas
            .filter((mesa) => mesa.estado?.toLowerCase() === "libre")
            .map((mesa) => (
              <option key={mesa.id} value={mesa.id}>
                Mesa {mesa.numero}
              </option>
            ))}
        </select>
      </div>

      {/* 🔍 Buscador */}
      <div className="buscador">
        <input
          type="text"
          placeholder="Buscar plato por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Menú agrupado por categorías */}
      <div className="menu-categorias">
        {Object.keys(categorias).map((categoria) => {
          const lista = platosFiltradosPorBusqueda(categorias[categoria]);
          if (lista.length === 0) return null; // no mostrar si no hay coincidencias

          return (
            <div key={categoria} className="categoria-bloque">
              <h3
                className="categoria-titulo"
                onClick={() => toggleCategoria(categoria)}
              >
                {categoria} {categoriasAbiertas[categoria] ? '▲' : '▼'}
              </h3>
              {categoriasAbiertas[categoria] && (
                <div className="categoria-contenido">
                  {lista.map((plato) => (
                    <div key={plato.id} className="plato-item">
                      <span>{plato.nombre} - ${plato.precio}</span>
                      <button onClick={() => handleAgregarPlato(plato)}>+</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pedido actual */}
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
        <button
          onClick={handleEnviarPedido}
          disabled={!mesaSeleccionada || pedidoActual.length === 0}
        >
          Enviar Pedido a Cocina
        </button>
      </div>
    </div>
  );
}

export default TomarPedido;