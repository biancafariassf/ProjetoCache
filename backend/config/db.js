const mysql = require('mysql2');

const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'users_db'
});

mysqlConnection.connect(err => {
  if (err) throw err;
  console.log('Banco Conectado!!');
});

module.exports = { mysqlConnection };