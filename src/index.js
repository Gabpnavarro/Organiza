const express = require('express');
const rotas = require('./rotas');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(rotas);

app.listen(PORT, () => {
    console.log('Servidor na nuvem')
});