const pool = require('../config/db');

const coletarDadosMotores = async (req, res) => {
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
};

module.exports = {
    coletarDadosMotores
};
