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

  // Filtros
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [ordenPrecio, setOrdenPrecio] = useState('');

  const categoriasDisponibles = ['Bebidas', 'Entradas', 'Platos fuertes', 'Postres'];

  useEffect(() => {
    cargarPlatos();
  }, []);

  const cargarPlatos = async () => {
    try {
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

  const handleToggleDisponibilidad = async (plato) => {
    const nuevoEstado = !plato.disponible; 
    const accion = nuevoEstado ? 'reactivar' : 'desactivar';

    if (window.confirm(`¿Estás seguro de que quieres ${accion} este plato?`)) {
      try {
        await axios.put(`${API_URL}/platos/${plato.id}`, { disponible: nuevoEstado });
        alert(`Plato ${accion}do con éxito`);
        cargarPlatos();
      } catch (error) {
        console.error(`Error al ${accion} el plato:`, error);
        alert(`Hubo un error al ${accion} el plato.`);
      }
    }
  };

  // --- Aplicar filtros y orden ---
  const platosFiltrados = platos
    .filter(p => 
      (!filtroCategoria || p.categoria === filtroCategoria) &&
      (!filtroNombre || p.nombre.toLowerCase().includes(filtroNombre.toLowerCase()))
    )
    .sort((a, b) => {
      if (ordenPrecio === 'asc') return a.precio - b.precio;
      if (ordenPrecio === 'desc') return b.precio - a.precio;
      return 0;
    });

  return (
    <div className="admin-section">
      <h2>Gestión de Platos</h2>

      {/* Formulario de creación/edición */}
      <form onSubmit={handleSubmit} className="admin-form">
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
        <label>
          Categoría:
          <select 
            value={categoria} 
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Seleccionar categoría</option>
            {categoriasDisponibles.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>
        <button type="submit">{isEditing ? 'Actualizar Plato' : 'Crear Plato'}</button>
        {isEditing && <button type="button" onClick={resetForm} className="btn-cancel">Cancelar</button>}
      </form>

      {/* FILTROS */}
      <div className="filtros-container">
        <h3 className="titulo-filtro">Filtrar Platos</h3>

        <div className="filtro-nombre">
          <input 
            type="text" 
            placeholder="Buscar por nombre..." 
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />
        </div>

        <div className="filtros-dobles">
          <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
            <option value="">Todas las categorías</option>
            {categoriasDisponibles.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select value={ordenPrecio} onChange={(e) => setOrdenPrecio(e.target.value)}>
            <option value="">Ordenar por precio</option>
            <option value="asc">Menor a mayor</option>
            <option value="desc">Mayor a menor</option>
          </select>
        </div>
      </div>

      {/* LISTA */}
      <h3>Lista de Platos</h3>
      <ul className="admin-list">
        {platosFiltrados.map(plato => (
          <li key={plato.id} className={!plato.disponible ? 'item-desactivado' : ''}>
            <span>
              {plato.nombre} - ${plato.precio} ({plato.categoria})
              {!plato.disponible && <strong> (Desactivado)</strong>}
            </span>
            <div className="admin-buttons">
              <button onClick={() => handleEdit(plato)} className="btn-edit">Editar</button>
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
