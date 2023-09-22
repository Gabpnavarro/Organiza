const express = require('express');
const { cadastrarUsuario, login } = require('./controladores/usuarios');
const verificaLogin = require('./intermediarios/verificarLogin');
const { validarDados, validarEmailExistente, validarTransacao } = require('./intermediarios/validacoes');
const { listagemParametrosTabela, cadastroFinanceiro } = require('./controladores/financeiro');

const rotas = express();

rotas.post("/cadastrar", validarDados, validarEmailExistente,cadastrarUsuario);
rotas.post("/login", login);

rotas.get('/listagemparametrostabela', listagemParametrosTabela);

rotas.use(verificaLogin);

rotas.post('/cadastrofinanceiro', cadastroFinanceiro);

module.exports = rotas;