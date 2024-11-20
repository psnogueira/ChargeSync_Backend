const express = require('express');
const router = express.Router();
const stationController = require('../controllers/StationController');
const authMiddleware = require('../authMd/authToken');

// Rota para obter todas as estações
router.get('/stations', authMiddleware, stationController.getStations);

// Rota para obter uma estação específica pelo ID
router.get('/stations/:id', authMiddleware, stationController.getStationById);

// Rota para criar uma nova estação
router.post('/stations', authMiddleware, stationController.createStation);

// Rota para atualizar uma estação existente
router.put('/stations/:id', authMiddleware, stationController.updateStation);

// Rota para atualizar a disponibilidade de uma estação
router.put('/stations/:stationId/available', authMiddleware, stationController.updateStationAvailability);

// Rota para deletar uma estação
router.delete('/stations/:id', authMiddleware, stationController.deleteStation);

module.exports = router;