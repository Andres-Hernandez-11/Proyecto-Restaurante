// src/components/GestionPlatos.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api'; 

function GestionPlatos() {
  const [platos, setPlatos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    cargarPlatos();
  }, []);

  const cargarPlatos = async () => {
    try {
      // ¡Cambiamos al nuevo endpoint de admin!
      const res = await axios.get(`${API_URL}/admin/platos`);
      setPlatos(res.data);
    } catch (error) {
      console.error("Error al cargar los platos:", error);
    }
  };

  const resetForm = () => {
    setNombre('');
    setPrecio('');
    setCategoria('');
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!nombre || !precio) {
      alert("El nombre y el precio son obligatorios.");
      return;
    }

    const platoData = { 
      nombre, 
      precio: parseFloat(precio),
      categoria 
    };

    try {
      if (isEditing) {
        await axios.put(`${API_URL}/platos/${editingId}`, platoData);
        alert('Plato actualizado con éxito!');
      } else {
        await axios.post(`${API_URL}/platos`, platoData);
        alert('Plato creado con éxito!');
      }
      resetForm();
      cargarPlatos();
    } catch (error) {
      console.error('Error al guardar el plato:', error);
    }
  };

  const handleEdit = (plato) => {
    setIsEditing(true);
    setEditingId(plato.id);
    setNombre(plato.nombre);
    setPrecio(plato.precio.toString());
    setCategoria(plato.categoria || '');
  };

  // --- ¡NUEVA FUNCIÓN DE BORRADO SUAVE! ---
  const handleToggleDisponibilidad = async (plato) => {
    const nuevoEstado = !plato.disponible; // Invierte el estado actual
    const accion = nuevoEstado ? 'reactivar' : 'desactivar';

    if (window.confirm(`¿Estás seguro de que quieres ${accion} este plato?`)) {
      try {
        await axios.put(`${API_URL}/platos/${plato.id}`, { disponible: nuevoEstado });
        alert(`Plato ${accion}do con éxito`);
        cargarPlatos(); // Recargamos la lista
      } catch (error) {
        console.error(`Error al ${accion} el plato:`, error);
        alert(`Hubo un error al ${accion} el plato.`);
      }
    }
  };

  return (
    <div className="admin-section">
      <h2>Gestión de Platos</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        {/* ... (el formulario no cambia) ... */}
        <h3>{isEditing ? 'Editar Plato' : 'Crear Nuevo Plato'}</h3>
        <input 
          type="text" 
          value={nombre} 
          onChange={(e) => setNombre(e.target.value)} 
          placeholder="Nombre del plato" 
        />
        <input 
          type="number" 
          value={precio} 
          onChange={(e) => setPrecio(e.target.value)} 
          placeholder="Precio" 
          step="0.01"
        />
        <input 
          type="text" 
          value={categoria} 
          onChange={(e) => setCategoria(e.target.value)} 
          placeholder="Categoría (ej: Bebidas)" 
        />
        <button type="submit">{isEditing ? 'Actualizar Plato' : 'Crear Plato'}</button>
        {isEditing && <button type="button" onClick={resetForm} className="btn-cancel">Cancelar</button>}
      </form>

      <h3>Lista de Platos</h3>
      <ul className="admin-list">
        {platos.map(plato => (
          // Añadimos una clase si el plato está desactivado
          <li key={plato.id} className={!plato.disponible ? 'item-desactivado' : ''}>
            <span>
              {plato.nombre} - ${plato.precio} 
              {!plato.disponible && <strong> (Desactivado)</strong>}
            </span>
            <div className="admin-buttons">
              <button onClick={() => handleEdit(plato)} className="btn-edit">Editar</button>
              {/* Cambiamos el botón de Borrar por uno de Activar/Desactivar */}
              <button 
                onClick={() => handleToggleDisponibilidad(plato)} 
                className={plato.disponible ? 'btn-delete' : 'btn-reactivar'}
              >
                {plato.disponible ? 'Desactivar' : 'Reactivar'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GestionPlatos;