const express = require('express');
const app = express();
const {Pool} = require('pg');
const PORTA = 3000;

require('dotenv').config();
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.ssl
});

pool.query('SELECT NOW()' , (err, res) => {
    if (err){
        console.error('Erro ao Conectar ao Banco de Dados PostgreSQL', err);
    } else {
        console.log('Conexão feita com sucesso ao Banco de Dados PostgreSQL', res.rows);
    }
});

app.get('/', (req, res) =>{
    res.send('Hello World');
});

app.listen(PORTA, () => {
     console.log(`Servidor conectado e rodando em http://localhost:${PORTA}`);
});


