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

pool.query(`
             CREATE TABLE sensores (
                 Coleta INTEGER PRIMARY KEY AUTOINCREMENT,
                 MotorID VARCHAR2(10) NOT NULL,
                 Temperatura NUMBER (4, 2) NOT NULL,
                 Frequencia NUMBER (4, 2) NOT NULL,
                 Corrente NUMBER (4, 2) NOT NULL,
                 Vibracao VARCHAR2(3) NOT NULL,
                 PicoMax NUMBER (4, 2) NOT NULL,
                 timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
             )
         ` , (err, res) => {
    if (err){
        console.error('Erro ao Criar Tabela no Banco de Dados', err);
    } else {
        console.log('Tabela Criada com Sucesso no Banco de Dados', res.rows);
    }
});

app.get('/', (req, res) =>{
    res.send('Hello World');
});

app.listen(PORTA, () => {
     console.log(`Servidor conectado e rodando em http://localhost:${PORTA}`);
});

// async function criando_or_verifca_tabela() {
//     let conexao;

//     try {
//         conexao = await oracledb.getConnection();

//         const verifica_tabela_existe_SQL = `
//             SELECT COUNT(*) AS count
//             FROM user_tables
//             WHERE table_name = 'Dados_Sensores'
//         `;

//         const result = await conexao.execute(verifica_tabela_existe_SQL);
//         const verifica_tabela_existe_node = result.rows[0][0] > 0;

//         if (!verifica_tabela_existe_node){
//             const criando_tabela_SQL = `
//             CREATE TABLE Dados_Sensores (
//                 Coleta INTEGER PRIMARY KEY AUTOINCREMENT,
//                 MotorID VARCHAR2(10) NOT NULL,
//                 Temperatura NUMBER (4, 2) NOT NULL,
//                 Frequencia NUMBER (4, 2) NOT NULL,
//                 Corrente NUMBER (4, 2) NOT NULL,
//                 Vibracao VARCHAR2(3) NOT NULL,
//                 PicoMax NUMBER (4, 2) NOT NULL,
//                 timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             )
//         `;
//         await conexao.execute(criando_tabela_SQL);
//         await conexao.commit();
//         console.log('Tabela Dados_Sensores foi Criada.');
//         }else {
//             console.log('Tabela Dados_Sensors já existente.');
//         }
//     } catch (err) {
//         console.error('Erro ao criar a tabela:', err);
//     } finally {
//         if (conexao) {
//             try {
//                 await conexao.close();
//             } catch (err) {
//                 console.error('Erro ao fechar a conexão:', err);
//             }
//         }
//     }
// }













