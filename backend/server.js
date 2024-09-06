const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userController = require('./controllers/userController');
const authoMiddleware = require('./middlewares/authMiddlewares');

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.json());

app.post('/register', userController.registrarUsuario);
app.post('/login', userController.loginUsuario);


app.use(authoMiddleware); 

app.get('/address/:cep', userController.getEnderecoByCEP);

app.listen(port, () => {
  console.log(`servidor rodando no http://localhost:${port}`);
});