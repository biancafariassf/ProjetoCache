const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.post('/register', userController.registrarUsuario);


router.post('/login', userController.loginUsuario);

router.get('/address/:cep', userController.authoMiddleware, userController.getEnderecoByCEP);

module.exports = router;