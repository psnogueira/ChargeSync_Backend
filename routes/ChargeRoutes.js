const express = require('express');
const router = express.Router();
const chargeController = require('../controllers/ChargeController');
const authMiddleware = require('../authMd/authToken');

// Rota para obter todas as sessões de recarga
router.get('/charges', authMiddleware, chargeController.getCharges);

// Rota para obter uma sessão de recarga específica pelo ID
router.get('/charges/:id', authMiddleware, chargeController.getChargeById);

// Rota para obter todas as sessões de recarga de um usuário específico
router.get('/users/:userId/charges', authMiddleware, chargeController.getChargesByUserId);

// Rota para criar uma nova sessão de recarga
router.post('/charges', authMiddleware, chargeController.createCharge);

// Rota para atualizar uma sessão de recarga existente
router.put('/charges/:id', authMiddleware, chargeController.updateCharge);

// Rota para deletar uma sessão de recarga
router.delete('/charges/:id', authMiddleware, chargeController.deleteCharge);

module.exports = router;