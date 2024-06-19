const express = require('express');
const app = express();

app.use(express.json());

const PORTA = 3000;

app.get('/dado_temperatura', (req, res)=>{
    console.log('Requisição Temperatura realizada com Sucesso');
})











app.listen(PORTA, ()=>{
    console.log('Servidor Conectado na Porta ', PORTA);
})
