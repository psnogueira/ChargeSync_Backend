const jwt = require('jsonwebtoken');
const JWT_SECRET = 'seu-segredo-aqui';  // Deve ser o mesmo que você usou no auth.js

const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];  // O token está no formato "Bearer <token>"

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    // Coloca os dados decodificados do token no req.user
    req.user = decoded;
    next();
  });
};

module.exports = authToken;