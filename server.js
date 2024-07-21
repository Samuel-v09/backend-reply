const express = require('express');
const app = express();
const PORTA = 3000;

app.use(express.json());

app.get('/', (req, res) =>{
    res.send('Hello World');
});

app.listen(PORTA, () => {
     console.log(`Servidor conectado e rodando em http://localhost:${PORTA}`);
});
