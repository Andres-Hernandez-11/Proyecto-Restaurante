// src/components/AdminDashboard.jsx

import React, { useState } from 'react';
import GestionPlatos from './GestionPlatos';
import GestionMesas from './GestionMesas'; 

function AdminDashboard() {
  const [adminView, setAdminView] = useState('platos'); // 'platos' o 'mesas'

  return (
    <div>
      <h1>Panel de Administración</h1>
      <p>Aquí puedes gestionar los datos maestros del restaurante.</p>
      
      {/* Navegación interna del admin */}
      <nav className="admin-nav">
        <button 
          onClick={() => setAdminView('platos')}
          className={adminView === 'platos' ? 'active' : ''}
        >
          Gestionar Platos
        </button>
        <button 
          onClick={() => setAdminView('mesas')}
          className={adminView === 'mesas' ? 'active' : ''}
        >
          Gestionar Mesas
        </button>
      </nav>

      {/* Contenido condicional */}
      {adminView === 'platos' && <GestionPlatos />}
      {adminView === 'mesas' && <GestionMesas />}
    </div>
  );
}

export default AdminDashboard;