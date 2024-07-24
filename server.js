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
                 Vibracao VARCHAR(4),
                 PicoMax NUMERIC(10, 2) NOT NULL,
                 DataHora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
             );
             
            
            CREATE TABLE IF NOT EXISTS Dados_Motor_02 (
                ID SERIAL PRIMARY KEY ,
                Motor VARCHAR(20),
                Temperatura NUMERIC (10, 2) NOT NULL,
                Frequencia NUMERIC (10, 2) NOT NULL,
                Corrente NUMERIC (10, 2) NOT NULL,
                Vibracao VARCHAR(10),
                PicoMax NUMERIC(10, 2) NOT NULL,
                DataHora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            ` 
        );
         console.log('Tabelas motores criadas com sucesso');
    } catch (err) {
        console.error('Erro ao criar tabelas motores ou tabelas já existentes :', err);
    } finally {
        //await pool.end();
        console.log('Conexão com Banco de Dados challenge_reply_db encerrada');
    }
};

criando_tabelas_motores();

// Rotas HTTP

app.post('/inserir_dados_motor_01', async (req, res) => {

    const dados_motor_01 = req.body;
    console.log('Dados do Motor 1 recebidos com Sucesso', dados_motor_01);
    const client = await pool.connect();
        
    try {
        
        console.log('Conectando ao Banco de Dados challenge_reply_db para inserir dados do motor 01');

        await client.query(
            `
            INSERT INTO Dados_Motor_01 (Motor, Temperatura, Frequencia, Corrente, Vibracao, PicoMax) VALUES ($1, $2, $3, $4, $5, $6)
            ` , [dados_motor_01.Motor, dados_motor_01.Temperatura, dados_motor_01.Frequencia, dados_motor_01.Corrente, dados_motor_01.Vibracao, dados_motor_01.PicoMax]
        );
        console.log('Dados do Motor 01 Inseridos com Sucesso no Banco de Dados');
        res.status(200).send('Dados do Motor 01 inseridos com sucesso.');
    } catch (err) {
        console.error('Erro ao inserir dados do motor 01.', err);
        res.status(500).send('Erro ao inserir dados do motor 01 no banco de dados challenge_reply_db.');
    } finally{
        client.release();
        console.log('Conexão com Banco de Dados challenge_reply_db liberada');
    }
});

app.get('/', (req, res) =>{
    res.send('Hello World');
});

app.listen(PORTA, () => {
     console.log(`Servidor conectado e rodando em http://localhost:${PORTA}`);
});














