const pool = require('../config/db');

const inserirDadosMotores = async (req, res) => {
    console.log('Dados Recebidos pelo Arduino', req.body);

    const dadosSensoresMotoresVar = req.body.dados_sensores_motores[0];

    if (!dadosSensoresMotoresVar) {
        return res.status(400).send('Dados dos sensores dos motores não recebidos.');
    }

    console.log('Dados dos motores recebidos com Sucesso', dadosSensoresMotoresVar);

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        console.log('Conectando ao Banco de Dados challenge_reply_db para inserir dados no Banco de Dados challenge_reply_db');

        const coletaResultado = await client.query(
            `INSERT INTO numero_coleta (DataHora) VALUES (CURRENT_TIMESTAMP) RETURNING ColetaID;`
        );
        const coletaID = coletaResultado.rows[0].coletaid;

        for (const [MotorID, dados] of Object.entries(dadosSensoresMotoresVar)) {
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
};

module.exports = {
    inserirDadosMotores
};