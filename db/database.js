const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./consultas.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

// Criar a tabela de usuários
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL
  )`);

  // Criar a tabela de consultas
  db.run(`CREATE TABLE IF NOT EXISTS consultations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    date TEXT NOT NULL,
    doctor TEXT NOT NULL,
    specialty TEXT NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
  )`);

  // Tabela de estações de recarga
  db.run(`CREATE TABLE IF NOT EXISTS stations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    energy_type TEXT NOT NULL,  -- renovável ou não renovável
    available INTEGER NOT NULL  -- 1 para disponível, 0 para ocupado
  )`);

  // Tabela de sessões de recarga (charges)
  db.run(`CREATE TABLE IF NOT EXISTS charges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    stationId INTEGER NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT,
    energy_used REAL,  -- Quantidade de energia consumida durante a sessão
    status TEXT NOT NULL,  -- Status da recarga (em andamento, concluída, etc.)
    progress REAL DEFAULT 0,  -- Progresso da recarga em porcentagem (0 a 100)
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (stationId) REFERENCES stations(id)
  )`);

  // Tabela de preferências de recarga do usuário
  db.run(`CREATE TABLE IF NOT EXISTS user_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    preferred_energy_type TEXT,  -- Preferência de tipo de energia (renovável, qualquer)
    preferred_hours TEXT,        -- Horários preferidos para recarga (ex: "noite, manhã")
    FOREIGN KEY (userId) REFERENCES users(id)
  )`);
});

module.exports = db;