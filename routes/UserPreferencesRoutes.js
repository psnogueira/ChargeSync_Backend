const express = require('express');
const router = express.Router();
const userPreferencesController = require('../controllers/UserPreferencesController');
const authMiddleware = require('../authMd/authToken');

// Rota para obter as preferências de um usuário específico
router.get('/users/:userId/preferences', authMiddleware, userPreferencesController.getUserPreferences);

// Rota para obter uma preferência específica pelo ID
router.get('/preferences/:id', authMiddleware, userPreferencesController.getUserPreferenceById);

// Rota para criar novas preferências de usuário
router.post('/users/:userId/preferences', authMiddleware, userPreferencesController.createUserPreferences);

// Atualiza uma preferência de usuário com base no ID da preferência
router.put('/preferences/:id', authMiddleware, userPreferencesController.updateUserPreferenceById);

// Deleta uma preferência de usuário com base no ID da preferência
router.delete('/preferences/:id', authMiddleware, userPreferencesController.deleteUserPreferenceById);

module.exports = router;