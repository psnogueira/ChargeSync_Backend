const db = require('../db/database');

// Função para listar todas as estações
exports.getStations = (req, res) => {
  const sql = 'SELECT * FROM stations';
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

// Função para obter uma estação específica pelo ID
exports.getStationById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM stations WHERE id = ?';
  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: 'Estação não encontrada' });
    }
    res.json({
      message: 'Sucesso',
      data: row
    });
  });
};

// Função para criar uma nova estação
exports.createStation = (req, res) => {
  const { name, location, energy_type, available } = req.body;
  const sql = 'INSERT INTO stations (name, location, energy_type, available) VALUES (?, ?, ?, ?)';
  const params = [name, location, energy_type, available];
  
  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      message: 'Estação criada com sucesso',
      data: { id: this.lastID, ...req.body }
    });
  });
};

// Função para atualizar uma estação existente
exports.updateStation = (req, res) => {
  const { id } = req.params;
  const { name, location, energy_type, available } = req.body;
  const sql = 'UPDATE stations SET name = ?, location = ?, energy_type = ?, available = ? WHERE id = ?';
  const params = [name, location, energy_type, available, id];

  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Estação não encontrada' });
    }
    res.json({
      message: 'Estação atualizada com sucesso',
      data: req.body
    });
  });
};

// Função para deletar uma estação
exports.deleteStation = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM stations WHERE id = ?';

  db.run(sql, id, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Estação não encontrada' });
    }
    res.json({
      message: 'Estação deletada com sucesso'
    });
  });
};