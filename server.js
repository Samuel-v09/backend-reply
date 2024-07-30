const express = require('express');
const app = express();
const { Pool } = require('pg');
const PORTA = 3001;

require('dotenv').config();
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.ssl === 'true' ? { rejectUnauthorized: false } : false
});

const criando_tabelas_motores = async () => {
    const client = await pool.connect();
    try {
        console.log('Conectando ao Banco de Dados challenge_reply_db');
        await client.query(
            `
            CREATE TABLE IF NOT EXISTS numero_coleta (
                ColetaID SERIAL PRIMARY KEY,
                DataHora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS dados_sensores_motores (
                ColetaID INT REFERENCES numero_coleta(ColetaID),
                MotorID VARCHAR(20),
                Temperatura NUMERIC (10, 2) NOT NULL,
                Frequencia NUMERIC (10, 2) NOT NULL,
                Corrente NUMERIC (10, 2) NOT NULL,
                Vibracao VARCHAR(10),
                PicoMax NUMERIC(10, 2) NOT NULL
            );
            `
        );
        console.log('Tabelas motores criadas com sucesso');
    } catch (err) {
        console.error('Erro ao criar tabelas motores ou tabelas já existentes :', err);
    } finally {
        client.release();
    }
};

criando_tabelas_motores();

app.post('/inserir_dados_motores', async (req, res) => {
    console.log('Corpo da requisição:', req.body);

    const dados_sensores_motores_var = req.body.dados_sensores_motores[0];

    if (!dados_sensores_motores_var) {
        return res.status(400).send('Dados dos sensores dos motores não encontrados no corpo da requisição.');
    }

    console.log('Dados dos motores recebidos com Sucesso', dados_sensores_motores_var);

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        console.log('Conectando ao Banco de Dados challenge_reply_db para inserir dados do motor 01');

        const coletaResultado = await client.query(
            `INSERT INTO numero_coleta (DataHora) VALUES (CURRENT_TIMESTAMP) RETURNING ColetaID;`
        );
        const coletaID = coletaResultado.rows[0].coletaid;  // Alteração para coletar corretamente o ID

        for (const [MotorID, dados] of Object.entries(dados_sensores_motores_var)) {
            await client.query(
                `INSERT INTO dados_sensores_motores (ColetaID, MotorID, Temperatura, Frequencia, Corrente, Vibracao, PicoMax) 
                VALUES ($1, $2, $3, $4, $5, $6, $7);`,
                [coletaID, MotorID, dados.Temperatura, dados.Frequencia, dados.Corrente, dados.Vibracao, dados.PicoMax]
            );
        }

        await client.query('COMMIT');
        console.log('Dados dos Sensores dos Motores Inseridos com Sucesso no Banco de Dados challenge_reply_db');
        res.status(200).send('Dados dos Sensores dos Motores inseridos com sucesso.');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Erro ao inserir Dados dos Sensores dos Motores no Banco de Dados challenge_reply_db', err);
        res.status(500).send('Erro ao inserir Dados dos Sensores dos Motores no Banco de Dados challenge_reply_db.');
    } finally {
        client.release();
        console.log('Conexão com Banco de Dados challenge_reply_db liberada');
    }
});

app.get('/coletando_dados_motores/:coletaID', async (req, res) => {
    const coletaID = parseInt(req.params.coletaID, 10);

    if (isNaN(coletaID)) {
        return res.status(400).send('ID da coleta inválido.');
    }

    let rows;
    const client = await pool.connect();
    try {
        console.log('Conectando ao Banco de Dados challenge_reply_db para coletar dados dos sensores dos motores');

        const consulta = await client.query(`
        SELECT
            c.ColetaID,
            c.DataHora,
            s.MotorID,
            s.Temperatura,
            s.Frequencia,
            s.Corrente,
            s.Vibracao,
            s.PicoMax
        FROM numero_coleta c
        JOIN dados_sensores_motores s ON c.ColetaID = s.ColetaID
        WHERE c.ColetaID = $1;`, [coletaID]
        );

        rows = consulta.rows;
        console.log('Dados dos Motores Coletados com Sucesso do banco de dados challenge_reply_db');
        res.status(200).json(rows);
    } catch (err) {
        console.error('Erro ao coletar dados dos Sensores dos motores no banco de dados challenge_reply_db', err);
        res.status(500).send('Erro ao Coletar dados dos Sensores dos Motores do banco de dados challenge_reply_db.');
    } finally {
        client.release();
        console.log('Conexão com Banco de Dados challenge_reply_db liberada');
    }
});

app.listen(PORTA, () => {
    console.log(`Servidor conectado e rodando em http://localhost:${PORTA}`);
});

// Tratamento de Erros e Fechamento do banco de dados
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado capturado pelo middleware!');
});

process.on('SIGTERM', () => {
    pool.end(() => {
        console.log('Pool de Conexões fechado Termino do processo');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    pool.end(() => {
        console.log('Pool de Conexões fechado Termino do processo efetuado pelo terminal');
        process.exit(0);
    });
});