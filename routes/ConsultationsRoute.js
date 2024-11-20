const express = require('express');
const router = express.Router();
const consultationsController = require('../controllers/ConsultationsController');
const authMiddleware = require('../authMd/authToken');

// Rota para obter todas as consultas
router.get('/consultations', authMiddleware, consultationsController.getConsultations);

// Rota para criar uma nova consulta
router.post('/consultations', authMiddleware, consultationsController.createConsultation);

module.exports = router;