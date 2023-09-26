const express = require('express');
const { cadastrarUsuario, login } = require('./controladores/usuarios');
const verificaLogin = require('./intermediarios/verificarLogin');
const { validarDados, validarEmailExistente } = require('./intermediarios/validacoes');
const { listagemParametrosTabela, cadastroFinanceiro, listaFinancas, atualizarFinancia } = require('./controladores/financeiro');
const validarCorpoRequisicao = require('./intermediarios/validarCorpoRequisicao');
const schemaUsuario = require('./validacoes/schemaUsuario');

const rotas = express();

rotas.post("/cadastrar", validarDados, validarEmailExistente,cadastrarUsuario);
rotas.post("/login", login);

rotas.get('/listagemparametrostabela', listagemParametrosTabela);

rotas.use(verificaLogin);

rotas.get('/listafinancas', listaFinancas);
rotas.post('/cadastrofinanceiro', validarCorpoRequisicao(schemaUsuario) , cadastroFinanceiro);
rotas.put('/listafinancas', atualizarFinancia);

module.exports = rotas;