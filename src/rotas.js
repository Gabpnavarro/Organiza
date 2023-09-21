const express = require('express');
const { cadastrarUsuario, login } = require('./controladores/usuarios');
const verificaLogin = require('./intermediarios/verificarLogin');
const { validarDados, validarEmailExistente, validarTransacao } = require('./intermediarios/validacoes');
const { cadastrarTransacao, listarFinanceiro } = require('./controladores/financeiro');

const rotas = express();

rotas.post("/cadastrar", validarDados, validarEmailExistente,cadastrarUsuario);
rotas.post("/login", login);

rotas.use(verificaLogin);

rotas.post("/transacao", validarTransacao, cadastrarTransacao);
rotas.get("/transacao", listarFinanceiro);

module.exports = rotas;