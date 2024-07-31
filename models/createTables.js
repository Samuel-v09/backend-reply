const pool = require('../config/db');

const criandoTabelasMotores = async () => {
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

module.exports = criandoTabelasMotores;