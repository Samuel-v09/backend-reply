const express = require('express');
const app = express();
const PORTA = 3000;
const oracledb = require('oracledb');

app.use(express.json());

const db_oracle_config ={
    user: 'Usuário',
    password: 'Senha',
    connectString: 'SID',
    poolMin : 10,
    poolMax: 10,
    queueTimeout: 60000   

};

async function conexao_pool () {
    try{
        await oracledb.createPool(db_oracle_config);
        console.log('Pool de Conexão com Banco de Dados feito com Sucesso');
    } catch (err) {
        console.error('Erro ao criar o pool de conexão com Banco de Dados', err);
        process.exit(1);
    }
}

async function criando_or_verifca_tabela() {
    let conexao;

    try {
        conexao = await oracledb.getConnection();

        const verifica_tabela_existe_SQL = `
            SELECT COUNT(*) AS count
            FROM user_tables
            WHERE table_name = 'Dados_Sensores'
        `;

        const result = await conexao.execute(verifica_tabela_existe_SQL);
        const verifica_tabela_existe_node = result.rows[0][0] > 0;

        if (!verifica_tabela_existe_node){
            const criando_tabela_SQL = `
            CREATE TABLE Dados_Sensores (
                Coleta INTEGER PRIMARY KEY AUTOINCREMENT,
                MotorID VARCHAR2(10) NOT NULL,
                Temperatura NUMBER (4, 2) NOT NULL,
                Frequencia NUMBER (4, 2) NOT NULL,
                Corrente NUMBER (4, 2) NOT NULL,
                Vibracao VARCHAR2(3) NOT NULL,
                PicoMax NUMBER (4, 2) NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            )
        `;
        await conexao.execute(criando_tabela_SQL);
        await conexao.commit();
        console.log('Tabela Dados_Sensores foi Criada.');
        }else {
            console.log('Tabela Dados_Sensors já existente.');
        }
    } catch (err) {
        console.error('Erro ao criar a tabela:', err);
    } finally {
        if (conexao) {
            try {
                await conexao.close();
            } catch (err) {
                console.error('Erro ao fechar a conexão:', err);
            }
        }
    }
}

// Chamando a Função de conexão pool e que cria a Tabela no Banco de Dados
conexao_pool()
    .then(() => criando_or_verifca_tabela())
    .catch(err => {    
         console.error('Erro ao executar a função criando_or_verifica_tabela:', err);
});

// Inserir Dados do arduino no banco de Dados
app.post('/inserir_dados_sensores', async (req, res)=>{
    const dados_sensores_arduino = req.body;
    console.log('Dados dos Sensores recebidos com Sucesso', dados_sensores_arduino);

    let conexao;

    try{
        conexao = await oracledb.getConnection(db_oracle_config);

        for (let sensor of dados_sensores_arduino) {
            const motorID = object.keys(sensor)[0];
            const{
                Temperatura,
                Frequencia,
                Corrente,
                Vibracao,
                PicoMax
            } = sensor[motorID];
        }
        const inserindo_dados_SQL = `
            INSERT INTO Dados_Sensores (MotorID, Temperatura, Frequencia, Corrente, Vibracao, PicoMax)
            VALUES (:MotorID, :Temperatura, :Frequencia, :Corrente, :Vibracao, :PicoMax)
        `;

        await conexao.execute(inserindo_dados_SQL, {MotorID: motorID, Temperatura, Frequencia, Corrente, Vibracao, PicoMax}, {autoCommit: true});
        console.log(`Dados do motor ${motorID} inseridos no banco de dados com sucesso`);
        res.send('dados recebidos e armazenados com sucesso');
    }catch (err) {
        console.error('Erro ao inserir dados no banco de dados no Banco', err);
        res.status(500).send('Erro ao processar os dados no Banco');
    } finally {
        if (conexao) {
            try {
                await conexao.close();
            } catch (err){
                console.error('Erro ao Fechar a conexão', err);
            }
        }
    }
});



app.listen(PORTA, () => {
    console.log(`Servidor conectado e rodando em http://localhost:${PORTA}`);
});
