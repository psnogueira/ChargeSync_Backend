const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const consultationsRoute = require('./routes/ConsultationsRoute');

const stationRoutes = require('./routes/StationRoutes');
const chargeRoutes = require('./routes/ChargeRoutes');
const userPreferencesRoutes = require('./routes/UserPreferencesRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Usar as rotas de autenticação.
app.use('/api/auth', authRoutes);

// Usar a rota de consultas.
app.use('/api', consultationsRoute);

// Usar as rotas de estações.
app.use('/api', stationRoutes);

// Usar as rotas de sessões de recarga.
app.use('/api', chargeRoutes);

// Usar as rotas de preferências de usuário.
app.use('/api', userPreferencesRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});