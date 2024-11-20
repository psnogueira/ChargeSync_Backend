const db = require('../db/database');

exports.getConsultations = (req, res) => {
  const { role, id: userId } = req.user;

  let query = 'SELECT * FROM consultations';
  let params = [];

  if (role === 'user') {
    query += ' WHERE userId = ?';
    params.push(userId);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

exports.createConsultation = (req, res) => {
  const { userId, date, doctor, specialty, status } = req.body;
  db.run(`INSERT INTO consultations (userId, date, doctor, specialty, status) VALUES (?, ?, ?, ?, ?)`,
    [userId, date, doctor, specialty, status],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
};