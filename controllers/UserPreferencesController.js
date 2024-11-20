const db = require('../db/database');

// Função para obter todas as preferências de um usuário específico
exports.getUserPreferences = (req, res) => {
  const { userId } = req.params;
  const sql = 'SELECT * FROM user_preferences WHERE userId = ?';
  
  // Usar db.all para retornar todas as preferências associadas ao userId
  db.all(sql, [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Nenhuma preferência encontrada para este usuário' });
    }
    res.json({
      message: 'Sucesso',
      data: rows
    });
  });
};

// Função para obter uma preferência específica pelo ID
exports.getUserPreferenceById = (req, res) => {
  const { id } = req.params;  // Pegando o ID da preferência dos parâmetros da URL
  const sql = 'SELECT * FROM user_preferences WHERE id = ?';
  
  // Usar db.get pois estamos buscando uma preferência específica (somente uma linha)
  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: 'Preferência não encontrada' });
    }
    res.json({
      message: 'Sucesso',
      data: row
    });
  });
};

// Função para criar ou inserir preferências de um usuário
exports.createUserPreferences = (req, res) => {
  const { userId, preferred_energy_type, preferred_hours } = req.body;
  const sql = 'INSERT INTO user_preferences (userId, preferred_energy_type, preferred_hours) VALUES (?, ?, ?)';
  const params = [userId, preferred_energy_type, preferred_hours];

  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      message: 'Preferências criadas com sucesso',
      data: { id: this.lastID, ...req.body }
    });
  });
};

// Função para atualizar uma preferência existente com base no ID
exports.updateUserPreferenceById = (req, res) => {
  const { id } = req.params;  // Pegando o ID da preferência dos parâmetros da URL
  const { preferred_energy_type, preferred_hours } = req.body;
  
  const sql = `
    UPDATE user_preferences
    SET preferred_energy_type = ?, preferred_hours = ?
    WHERE id = ?
  `;
  const params = [preferred_energy_type, preferred_hours, id];

  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Preferência não encontrada ou não modificada' });
    }
    res.json({
      message: 'Preferência atualizada com sucesso',
      data: { id, preferred_energy_type, preferred_hours }
    });
  });
};

// Função para deletar uma preferência com base no ID
exports.deleteUserPreferenceById = (req, res) => {
  const { id } = req.params;  // Pegando o ID da preferência dos parâmetros da URL
  const sql = 'DELETE FROM user_preferences WHERE id = ?';

  db.run(sql, [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Preferência não encontrada' });
    }
    res.json({
      message: 'Preferência deletada com sucesso'
    });
  });
};