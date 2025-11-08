// src/components/GestionMesas.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

function GestionMesas() {
  const [mesas, setMesas] = useState([]);
  const [numero, setNumero] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    cargarMesas();
  }, []);

  const cargarMesas = async () => {
    try {
      // ¡Cambiamos al nuevo endpoint de admin!
      const res = await axios.get(`${API_URL}/admin/mesas`);
      setMesas(res.data);
    } catch (error) {
      console.error("Error al cargar las mesas:", error);
    }
  };

  const resetForm = () => {
    setNumero('');
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!numero) return alert("El número o nombre de la mesa es obligatorio.");
    const data = { numero };
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/mesas/${editingId}`, data);
        alert('Mesa actualizada con éxito');
      } else {
        await axios.post(`${API_URL}/mesas`, data);
        alert('Mesa creada con éxito');
      }
      resetForm();
      cargarMesas();
    } catch (error) {
      console.error('Error al guardar la mesa:', error);
    }
  };

  const handleEdit = (mesa) => {
    setIsEditing(true);
    setEditingId(mesa.id);
    setNumero(mesa.numero);
  };

  const handleToggleEstado = async (mesa) => {
    const nuevoEstado = mesa.estado === 'libre' ? 'ocupada' : 'libre';
    try {
      await axios.put(`${API_URL}/mesas/${mesa.id}`, { estado: nuevoEstado });
      cargarMesas();
    } catch (error) {
      console.error('Error al cambiar el estado de la mesa:', error);
    }
  };

  // --- ¡NUEVA FUNCIÓN DE BORRADO SUAVE! ---
  const handleToggleDisponibilidad = async (mesa) => {
    const nuevoEstado = !mesa.disponible; // Invierte el estado
    const accion = nuevoEstado ? 'reactivar' : 'desactivar';

    if (window.confirm(`¿Estás seguro de que quieres ${accion} esta mesa?`)) {
      try {
        await axios.put(`${API_URL}/mesas/${mesa.id}`, { disponible: nuevoEstado });
        alert(`Mesa ${accion}da con éxito`);
        cargarMesas();
      } catch (error) {
        console.error(`Error al ${accion} la mesa:`, error);
      }
    }
  };

  return (
    <div className="admin-section">
      <h2>Gestión de Mesas</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        {/* ... (el formulario no cambia) ... */}
        <h3>{isEditing ? 'Editar Mesa' : 'Crear Nueva Mesa'}</h3>
        <input 
          type="text" 
          value={numero} 
          onChange={(e) => setNumero(e.target.value)} 
          placeholder="Nombre o número de la mesa" 
        />
        <button type="submit">{isEditing ? 'Actualizar' : 'Crear'}</button>
        {isEditing && <button type="button" onClick={resetForm} className="btn-cancel">Cancelar</button>}
      </form>

      <h3>Lista de Mesas</h3>
      <ul className="admin-list">
        {mesas.map(mesa => (
          <li key={mesa.id} className={!mesa.disponible ? 'item-desactivado' : ''}>
            <span>
              {mesa.numero} - <strong className={`estado ${mesa.estado}`}>{mesa.estado}</strong>
              {!mesa.disponible && <strong> (Desactivada)</strong>}
            </span>
            <div className="admin-buttons">
              <button onClick={() => handleToggleEstado(mesa)} className="btn-toggle">
                {mesa.estado === 'libre' ? 'Marcar Ocupada' : 'Marcar Libre'}
              </button>
              <button onClick={() => handleEdit(mesa)} className="btn-edit">Editar</button>
              {/* Cambiamos el botón de Borrar */}
              <button 
                onClick={() => handleToggleDisponibilidad(mesa)} 
                className={mesa.disponible ? 'btn-delete' : 'btn-reactivar'}
              >
                {mesa.disponible ? 'Desactivar' : 'Reactivar'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GestionMesas;