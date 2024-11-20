const db = require('../db/database');

// Função para listar todas as sessões de recarga
exports.getCharges = (req, res) => {
  const sql = `
    SELECT charges.*, users.username, stations.name AS station_name
    FROM charges
    JOIN users ON charges.userId = users.id
    JOIN stations ON charges.stationId = stations.id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      message: 'Sucesso',
      data: rows
    });
  });
};

// Função para obter uma sessão de recarga específica pelo ID
exports.getChargeById = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT charges.*, users.username, stations.name AS station_name
    FROM charges
    JOIN users ON charges.userId = users.id
    JOIN stations ON charges.stationId = stations.id
    WHERE charges.id = ?
  `;
  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: 'Sessão de recarga não encontrada' });
    }
    res.json({
      message: 'Sucesso',
      data: row
    });
  });
};

// Função para obter todas as sessões de recarga de um usuário específico pelo ID do usuário
exports.getChargesByUserId = (req, res) => {
    const { userId } = req.params;
    const sql = `
      SELECT charges.*, users.username, stations.name AS station_name
      FROM charges
      JOIN users ON charges.userId = users.id
      JOIN stations ON charges.stationId = stations.id
      WHERE charges.userId = ?
    `;
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Nenhuma sessão de recarga encontrada para este usuário' });
      }
      res.json({
        message: 'Sucesso',
        data: rows
      });
    });
  };

// Função para criar uma nova sessão de recarga
exports.createCharge = (req, res) => {
  const { userId, stationId, start_time, status } = req.body;
  const sql = 'INSERT INTO charges (userId, stationId, start_time, status) VALUES (?, ?, ?, ?)';
  const params = [userId, stationId, start_time, status];

  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      message: 'Sessão de recarga criada com sucesso',
      data: { id: this.lastID, ...req.body }
    });
  });
};

// Função para atualizar uma sessão de recarga existente
exports.updateCharge = (req, res) => {
  const { id } = req.params;
  const { stationId, start_time, end_time, energy_used, status } = req.body;
  const sql = `
    UPDATE charges
    SET stationId = ?, start_time = ?, end_time = ?, energy_used = ?, status = ?
    WHERE id = ?
  `;
  const params = [stationId, start_time, end_time, energy_used, status, id];

  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Sessão de recarga não encontrada' });
    }
    res.json({
      message: 'Sessão de recarga atualizada com sucesso',
      data: req.body
    });
  });
};

// Função para deletar uma sessão de recarga
exports.deleteCharge = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM charges WHERE id = ?';

  db.run(sql, id, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Sessão de recarga não encontrada' });
    }
    res.json({
      message: 'Sessão de recarga deletada com sucesso'
    });
  });
};