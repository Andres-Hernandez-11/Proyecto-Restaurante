// src/components/AdminDashboard.jsx

import React, { useState } from 'react';
import GestionPlatos from './GestionPlatos';
import GestionMesas from './GestionMesas'; 

function AdminDashboard() {
  const [adminView, setAdminView] = useState('platos'); // 'platos' o 'mesas'

  return (
    <div className="admin-panel">
      <h1 className="admin-title">Panel de Administración</h1>
      <p className="admin-description">
        Aquí puedes gestionar los datos maestros del restaurante.
      </p>

      <nav className="admin-nav">
        <button
          onClick={() => setAdminView('platos')}
          className={`admin-btn ${adminView === 'platos' ? 'active' : ''}`}
        >
          Gestionar Platos
        </button>
        <button
          onClick={() => setAdminView('mesas')}
          className={`admin-btn ${adminView === 'mesas' ? 'active' : ''}`}
        >
          Gestionar Mesas
        </button>
      </nav>

      <div className="admin-content">
        {adminView === 'platos' && <GestionPlatos />}
        {adminView === 'mesas' && <GestionMesas />}
      </div>
    </div>

  );
}

export default AdminDashboard;