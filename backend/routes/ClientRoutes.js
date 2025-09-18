const express = require('express');
const router = express.Router();
const clientController = require('./controllers/ClientController');

// Create a new client
router.post('/', clientController.createClient);

// Get all clients
router.get('/', clientController.getAllClients);

// Update a client
router.put('/:id', clientController.updateClient);

// Delete a client
router.delete('/:id', clientController.deleteClient);

module.exports = router;