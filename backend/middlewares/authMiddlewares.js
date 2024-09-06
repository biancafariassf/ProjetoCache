const jwt = require('jsonwebtoken');

const JWT_SECRET = 'jwt_secret';

const authoMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token não aprovado' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Falha na autenticação do token' });
    }

    req.userId = decoded.id;
    next();
  });
};

module.exports = authoMiddleware;