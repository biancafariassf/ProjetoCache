const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { mysqlConnection } = require('../config/db');

const JWT_SECRET = 'jwt_secret';

const registrarUsuario = (req, res) => {
  const { nome, idade, sexo, cep, senha } = req.body; 

  bcrypt.hash(senha, 10, (err, hashedSenha) => {
    if (err) throw err;

    const query = 'INSERT INTO users (nome, idade, sexo, cep, senha) VALUES (?, ?, ?, ?, ?)';
    mysqlConnection.query(query, [nome, idade, sexo, cep, hashedSenha], (err, results) => {
      if (err) throw err;
      res.status(201).json({ id: results.insertId });
    });
  });
};

const loginUsuario = (req, res) => {
  const { nome, senha } = req.body;

  const query = 'SELECT * FROM users WHERE nome = ?';
  mysqlConnection.query(query, [nome], (err, results) => {
    if (err) throw err;
    if (results.length === 0) return res.status(401).json({ message: 'Usuario não encontrado!!' });

    const user = results[0];
    bcrypt.compare(senha, user.senha, (err, isMatch) => {
      if (err) throw err;
      if (!isMatch) return res.status(401).json({ message: 'Senha incorreta!!' });

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    });
  });
};

const authoMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'token não validado!' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Falha na autenticação do token!' });
    req.userId = decoded.id;
    next();
  });
};

const getEnderecoByCEP = async (req, res) => {
  const { cep } = req.params;

  mysqlConnection.query('SELECT * FROM cep_cache WHERE cep = ?', [cep], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Erro ao acessar o cache!' });

    if (results.length > 0) {
      return res.json(JSON.parse(results[0].endereco));
    }
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const endereco = response.data;

      mysqlConnection.query(
        'INSERT INTO cep_cache (cep, endereco) VALUES (?, ?) ON DUPLICATE KEY UPDATE endereco = ?, cached_at = NOW()',
        [cep, JSON.stringify(endereco), JSON.stringify(endereco)],
        (err) => {
          if (err) return res.status(500).json({ message: 'Erro ao atualizar o cache!' });
        }
      );

      res.json(endereco);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar endereço!' });
    }
  });
};

module.exports = { registrarUsuario, loginUsuario, authoMiddleware, getEnderecoByCEP };