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

app.get('/', (req, res) =>{
    res.send('Hello World');
});

app.get('/ping', async (req, res) => {
    const result = await pool.query('SELECT NOW()')
    return res.json(result.rows[0]);
});

app.listen(PORTA, () => {
     console.log(`Servidor conectado e rodando em http://localhost:${PORTA}`);
});
