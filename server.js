const express = require('express');
const app = express();
const PORTA = 3000;

require('dotenv').config();
app.use(express.json());


const {Pool} = require ('pg')
const pool = new Pool({
    user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: process.env.port
});

pool.query('SELECT NOW()' , (err, res) => {
    if (err){
        console.error('Erro ao conectar ao Banco de Dados', err);
    } else {
        console.log('Conexão bem-sucedida:', res.rows);
    }

});



app.listen(PORTA, () => {
     console.log(`Servidor conectado e rodando em http://localhost:${PORTA}`);
});
