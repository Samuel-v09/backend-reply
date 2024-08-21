const express = require('express');
const pool = require('./config/db');
const app = express();

app.use(express.json());

app.post('/inserir_dados_motores', async (req, res) => {
    const { Motor01, Motor02 } = req.body;

    const motores = [Motor01, Motor02];

    const client = await pool.connect();
    try {
        // Inserir uma nova coleta
        const insertColetaQuery = `
            INSERT INTO numero_coleta DEFAULT VALUES RETURNING ColetaID;
        `;
        const result = await client.query(insertColetaQuery);
        const coletaID = result.rows[0].coletaid;

        // Inserir dados dos motores
        const insertMotorDataQuery = `
            INSERT INTO dados_sensores_motores (ColetaID, MotorID, Temperatura, Frequencia, Corrente, Vibracao, PicoMax)
            VALUES ($1, $2, $3, $4, $5, $6, $7);
        `;
        for (const motor of motores) {
            await client.query(insertMotorDataQuery, [
                coletaID,
                motor.MotorID,
                motor.Temperatura,
                motor.Frequencia,
                motor.Corrente,
                motor.Vibracao,
                motor.PicoMax
            ]);
        }

        res.status(200).send('Dados inseridos com sucesso!');
    } catch (err) {
        console.error('Erro ao inserir dados dos motores:', err);
        res.status(500).send('Erro ao inserir dados dos motores');
    } finally {
        client.release();
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
