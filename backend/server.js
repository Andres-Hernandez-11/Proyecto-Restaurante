// server.js

// ... (importaciones y configuraciones iniciales - express, cors, prisma) ...
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

/*
===============================================
 ENDPOINTS PARA PLATOS (con Borrado Suave)
===============================================
*/

// GET /api/platos (Para el Mesero - Solo disponibles)
app.get('/api/platos', async (req, res) => {
  try {
    const platos = await prisma.plato.findMany({
      where: { disponible: true }, // <-- ¡LA MAGIA!
    });
    res.json(platos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los platos.' });
  }
});

// GET /api/admin/platos (Para el Admin - Todos)
app.get('/api/admin/platos', async (req, res) => {
  try {
    const platos = await prisma.plato.findMany(); // <-- Trae todos
    res.json(platos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los platos para admin.' });
  }
});

// POST (Crear) - Sin cambios
app.post('/api/platos', async (req, res) => {
  try {
    const nuevoPlato = await prisma.plato.create({
      data: req.body,
    });
    res.status(201).json(nuevoPlato);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el plato.' });
  }
});

// PUT (Actualizar / Desactivar / Reactivar)
app.put('/api/platos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const platoActualizado = await prisma.plato.update({
      where: { id: parseInt(id) },
      data: req.body, // Aquí vendrá { disponible: false }
    });
    res.json(platoActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el plato.' });
  }
});

// DELETE (Ya no lo usaremos, pero lo dejamos por si acaso)
app.delete('/api/platos/:id', async (req, res) => {
  // ... (código existente)
  try {
    const { id } = req.params;
    await prisma.plato.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al borrar el plato.' });
  }
});


/*
===============================================
 ENDPOINTS PARA MESAS (con Borrado Suave)
===============================================
*/

// GET /api/mesas (Para el Mesero - Solo disponibles)
app.get('/api/mesas', async (req, res) => {
  try {
    const mesas = await prisma.mesa.findMany({
      where: { disponible: true }, // <-- ¡LA MAGIA!
    });
    res.json(mesas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las mesas.' });
  }
});

// GET /api/admin/mesas (Para el Admin - Todas)
app.get('/api/admin/mesas', async (req, res) => {
  try {
    const mesas = await prisma.mesa.findMany(); // <-- Trae todas
    res.json(mesas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las mesas para admin.' });
  }
});

// POST (Crear) - Sin cambios
app.post('/api/mesas', async (req, res) => {
  // ... (código existente)
  try {
    const nuevaMesa = await prisma.mesa.create({
      data: req.body,
    });
    res.status(201).json(nuevaMesa);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la mesa.' });
  }
});

// PUT (Actualizar / Desactivar / Reactivar)
app.put('/api/mesas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const mesaActualizada = await prisma.mesa.update({
      where: { id: parseInt(id) },
      data: req.body, // Aquí vendrá { disponible: false } o { estado: "ocupada" }
    });
    res.json(mesaActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la mesa.' });
  }
});

// DELETE (Ya no lo usaremos)
app.delete('/api/mesas/:id', async (req, res) => {
  // ... (código existente)
  try {
    const { id } = req.params;
    await prisma.mesa.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al borrar la mesa.' });
  }
});

/*
===============================================
 ENDPOINTS PARA PEDIDOS (Sin cambios)
===============================================
*/
// ... (copia y pega tus endpoints GET y POST de pedidos existentes aquí) ...
app.get('/api/pedidos', async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: {
        mesa: true,
        detalles: {
          include: {
            plato: true
          }
        }
      }
    });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los pedidos.' });
  }
});

app.post('/api/pedidos', async (req, res) => {
  try {
    const datosPedido = req.body;
    
    const nuevoPedido = await prisma.pedido.create({
      data: {
        id_mesa: datosPedido.id_mesa,
        id_usuario: datosPedido.id_usuario,
        detalles: {
          create: datosPedido.detalles.map(detalle => ({
            id_plato: detalle.id_plato,
            cantidad: detalle.cantidad,
            observacion: detalle.observacion,
          })),
        },
      },
      include: {
        detalles: true,
      },
    });

    res.status(201).json(nuevoPedido);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el pedido.' });
  }
});


// 5. INICIAR EL SERVIDOR
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});