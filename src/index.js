const express = require('express');
const rotas = require('./rotas');
const cors = require('cors');

const PORT = process.env.PORT || 3000;

const app = express();

const allowedOrigins = ['http://localhost:3000'];
app.use(cors({
  origin: allowedOrigins,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  headers: 'Origin, X-Requested-With, Content-Type, Accept'
}));


app.use(express.json());
app.use(rotas);

app.listen(PORT, () => {
    console.log('Servidor na nuvem')
});