// src/App.jsx

import React, { useState } from 'react';
import TomarPedido from './components/TomarPedido';
import AdminDashboard from './components/AdminDashboard'; // <-- Lo crearemos
import './App.css';

function App() {
  // 1. Creamos un estado para saber qué página mostrar
  const [paginaActual, setPaginaActual] = useState('pedidos'); // 'pedidos' es la página por defecto

  return (
    <div className="App">
      {/* 2. Creamos la barra de navegación */}
      <nav className="main-nav">
        <button 
          onClick={() => setPaginaActual('pedidos')}
          className={paginaActual === 'pedidos' ? 'active' : ''}
        >
          Tomar Pedido (Mesero)
        </button>
        <button 
          onClick={() => setPaginaActual('admin')}
          className={paginaActual === 'admin' ? 'active' : ''}
        >
          Panel de Administración
        </button>
      </nav>

      {/* 3. Mostramos un componente u otro basado en el estado */}
      <main>
        {paginaActual === 'pedidos' && <TomarPedido />}
        {paginaActual === 'admin' && <AdminDashboard />}
      </main>
    </div>
  );
}

export default App;