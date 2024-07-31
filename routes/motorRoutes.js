const express = require('express');
const router = express.Router();
const motorController_get = require('../controllers/get');
const motorController_post = require('../controllers/post');

router.post('/inserir_dados_motores', motorController_post.inserirDadosMotores);
router.get('/coletando_dados_motores/:coletaID', motorController_get.coletarDadosMotores);

module.exports = router;