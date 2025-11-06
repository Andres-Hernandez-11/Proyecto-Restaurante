// server.js



// 1. IMPORTACIONES
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

// 2. INICIALIZACIONES
const app = express();
const prisma = new PrismaClient();

// 3. MIDDLEWARE
app.use(cors()); // 
app.use(express.json());



// 4. ENDPOINTS DE LA API

/*
===============================================
ENDPOINTS PARA PLATOS
===============================================
*/

/**
 * Endpoint para OBTENER todos los platos (READ)
 * Ruta: GET /api/platos
 */
app.get('/api/platos', async (req, res) => {
  try {
    const platos = await prisma.plato.findMany();
    res.json(platos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los platos.' });
  }
});

/**
 * Endpoint para CREAR un nuevo plato (CREATE)
 * Ruta: POST /api/platos
 */
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

/*
===============================================
 ENDPOINTS PARA MESAS
===============================================
*/

/**
 * Endpoint para OBTENER todas las mesas
 * Ruta: GET /api/mesas
 */
app.get('/api/mesas', async (req, res) => {
  try {
    const mesas = await prisma.mesa.findMany();
    res.json(mesas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las mesas.' });
  }
});

/**
 * Endpoint para CREAR una nueva mesa
 * Ruta: POST /api/mesas
 */
app.post('/api/mesas', async (req, res) => {
  try {
    const nuevaMesa = await prisma.mesa.create({
      data: req.body, // Espera un JSON como { "numero": "Mesa 5" }
    });
    res.status(201).json(nuevaMesa);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la mesa.' });
  }
});


/*
===============================================
 ENDPOINTS PARA PEDIDOS
===============================================
*/

/**
 * Endpoint para OBTENER todos los pedidos con sus detalles
 * Ruta: GET /api/pedidos
 */
app.get('/api/pedidos', async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: {
        mesa: true,     // Incluye la información de la mesa asociada
        detalles: {     // Incluye los detalles del pedido
          include: {
            plato: true // Y dentro de cada detalle, incluye la info del plato
          }
        }
      }
    });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los pedidos.' });
  }
});

/**
 * Endpoint para CREAR un nuevo pedido
 * Ruta: POST /api/pedidos
 */
app.post('/api/pedidos', async (req, res) => {
  try {
    const datosPedido = req.body;
    
    // Prisma crea el pedido y sus detalles en una sola transacción
    const nuevoPedido = await prisma.pedido.create({
      data: {
        id_mesa: datosPedido.id_mesa,
        id_usuario: datosPedido.id_usuario, // Puede ser null si aún no hay login
        detalles: {
          create: datosPedido.detalles.map(detalle => ({
            id_plato: detalle.id_plato,
            cantidad: detalle.cantidad,
            observacion: detalle.observacion,
          })),
        },
      },
      include: {
        detalles: true, // Devuelve el pedido creado junto con sus detalles
      },
    });

    // ¡Aquí es donde ocurrirá la magia en el futuro!
    // TODO: Emitir evento por Socket.IO para notificar a la cocina
    // io.emit('order:new', nuevoPedido);

    res.status(201).json(nuevoPedido);
  } catch (error) {
    console.error(error); // Muestra el error detallado en la consola
    res.status(500).json({ error: 'Error al crear el pedido.' });
  }
});


// 5. INICIAR EL SERVIDOR
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});