const express = require('express');
const app = express();

app.use(express.json());

const PORTA = 3000;


app.listen(PORTA, ()=>{
    console.log('Servidor Conectado na Porta ', PORTA);
})
