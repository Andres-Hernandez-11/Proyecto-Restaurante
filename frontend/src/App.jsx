// src/App.jsx

import React, { useState } from 'react';
import TomarPedido from './components/TomarPedido';
import AdminDashboard from './components/AdminDashboard';
import PedidosEnProceso from './components/MostrarPedidos'; 
import './App.css';

function App() {
  // Estado para controlar qué vista se muestra
  const [paginaActual, setPaginaActual] = useState('pedidos'); // Por defecto "Tomar Pedido"

  return (
    <div className="App">
      {/* 🧭 Barra de navegación principal */}
      <nav className="main-nav">
        <button
          onClick={() => setPaginaActual('pedidos')}
          className={paginaActual === 'pedidos' ? 'active' : ''}
        >
          Tomar Pedido (Mesero)
        </button>

        <button
          onClick={() => setPaginaActual('curso')}
          className={paginaActual === 'curso' ? 'active' : ''}
        >
          Pedidos en Curso
        </button>

        <button
          onClick={() => setPaginaActual('admin')}
          className={paginaActual === 'admin' ? 'active' : ''}
        >
          Panel de Administración
        </button>
      </nav>

      {/* 🔄 Render condicional de la vista activa */}
      <main>
        {paginaActual === 'pedidos' && <TomarPedido />}
        {paginaActual === 'curso' && <PedidosEnProceso />}
        {paginaActual === 'admin' && <AdminDashboard />}
      </main>
    </div>
  );
}

export default App;
