const express = require('express');
const app = express();
const {Pool} = require('pg');
const PORTA = 3001;

require('dotenv').config();
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.ssl
});

const criando_tabelas_motores = async () => {
    try {
        await pool.connect();
        console.log('Conectando ao Banco de Dados challenge_reply_db');

        await pool.query(
            `
             CREATE TABLE IF NOT EXISTS Dados_Motor_01 (
                 ID SERIAL PRIMARY KEY ,
                 Motor VARCHAR(20),
                 Temperatura NUMERIC (10, 2) NOT NULL,
                 Frequencia NUMERIC (10, 2) NOT NULL,
                 Corrente NUMERIC (10, 2) NOT NULL,
                 Vibracao VARCHAR(4) NOT NULL,
                 PicoMax NUMERIC(10, 2) NOT NULL,
                 DataHora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
             );
             
            
            CREATE TABLE IF NOT EXISTS Dados_Motor_02 (
                Motor_ID INTEGER PRIMARY KEY ,
                Temperatura NUMERIC (4, 2) NOT NULL,
                Frequencia NUMERIC (4, 2) NOT NULL,
                Corrente NUMERIC (4, 2) NOT NULL,
                Vibracao VARCHAR(3) NOT NULL,
                PicoMax NUMERIC(4, 2) NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
           ` 

        );
         console.log('Tabelas motores criadas com sucesso');
    } catch (err) {
        console.error('Erro ao criar tabelas motores ou tabelas já existentes :', err);
    } finally {
        await pool.end();
        console.log('Conexão com Banco de Dados challenge_reply_db encerrada');
    }
};

criando_tabelas_motores();

app.get('/', (req, res) =>{
    res.send('Hello World');
});

app.listen(PORTA, () => {
     console.log(`Servidor conectado e rodando em http://localhost:${PORTA}`);
});














