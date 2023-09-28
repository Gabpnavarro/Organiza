const express = require('express');
const { cadastrarUsuario, login } = require('./controladores/usuarios');
const verificaLogin = require('./intermediarios/verificarLogin');
const { validarDados, validarEmailExistente } = require('./intermediarios/validacoes');
const { listagemParametrosTabela, cadastroFinanceiro, listaFinancas, atualizarFinancia, excluirFinancia } = require('./controladores/financeiro');
const validarCorpoRequisicao = require('./intermediarios/validarCorpoRequisicao');
const schemaCadastroFinanceiro = require('./validacoes/schemaCadastroFinanceiro');
const schemaAtualizarFinanceiro = require('./validacoes/schemaAtualizarFinanceiro');
const schemaExcluirFinanceiro = require('./validacoes/schemaExcluirFinanceiro');

const rotas = express();

rotas.post("/cadastrar", validarDados, validarEmailExistente, cadastrarUsuario);
rotas.post("/login", login);

rotas.get('/listagemparametrostabela', listagemParametrosTabela);

rotas.use(verificaLogin);

rotas.get('/listafinancas', listaFinancas);
rotas.post('/cadastrofinanceiro', validarCorpoRequisicao(schemaCadastroFinanceiro), cadastroFinanceiro);
rotas.put('/atualizarfinanceiro', validarCorpoRequisicao(schemaAtualizarFinanceiro), atualizarFinancia);
rotas.delete('/excluirfinanceiro', validarCorpoRequisicao(schemaExcluirFinanceiro), excluirFinancia);

module.exports = rotas;