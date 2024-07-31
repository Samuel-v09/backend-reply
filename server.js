const app = require('./app');
const criandoTabelasMotores = require('./models/createTables');
const PORTA = 3001;

criandoTabelasMotores();

app.listen(PORTA, () => {
    console.log(`Servidor conectado e rodando em http://localhost:${PORTA}`);
});

