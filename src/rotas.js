const express = require('express');
const { cadastrarUsuario, login } = require('./controladores/usuarios');
const verificaLogin = require('./intermediarios/verificarLogin');
const { validarDados, validarEmailExistente, validarTransacao } = require('./intermediarios/validacoes');
const { listagemParametrosTabela, cadastroFinanceiro, listaFinancas } = require('./controladores/financeiro');
const validarCorpoRequisicao = require('./intermediarios/validacaoFinanceira');
const schemaFinanceiro = require('./validacoes/schemaFinanceiro');

const rotas = express();

rotas.post("/cadastrar", validarDados, validarEmailExistente,cadastrarUsuario);
rotas.post("/login", login);

rotas.get('/listagemparametrostabela', listagemParametrosTabela);

rotas.use(verificaLogin);

rotas.post('/cadastrofinanceiro', cadastroFinanceiro);
rotas.get('/listafinancas', listaFinancas);

module.exports = rotas;