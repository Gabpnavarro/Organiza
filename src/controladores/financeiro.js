const knex = require('knex'); 
const { dataTratada } = require("../uteis/data");
const { descricaoCategoria } = require("../uteis/descricaoCategoria");
const filtro = require("../uteis/filtroData");

const cadastrarTransacao = async (req, res) => {
  const { descricao, valor, data, categoria_id } = req.body;

  try {
    const id = req.usuario.id;

    const transacaoCadastrada = await knex('financeiro')
      .insert({
        descricao,
        valor,
        data,
        usuario_id: id,
        categoria_id,
      })
      .returning(['descricao', 'valor', 'data']);

    const transacao = transacaoCadastrada[0];

    const categoria_nome = await descricaoCategoria(req, res);

    transacao.categoria_nome = categoria_nome;

    transacao.data = await dataTratada(transacao.data);

    return res.status(201).json(transacao);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
};

const listarFinanceiro = async (req, res) => {
  try {
    const id = req.usuario.id;

    const todasTransacoes = await knex('financeiro')
      .where({ usuario_id: id });

    for (let i = 0; i < todasTransacoes.length; i++) {
      const transacao = todasTransacoes[i];

      const categoria_nome = await descricaoCategoria(req, res, transacao);

      transacao.categoria_nome = categoria_nome;
    }

    await filtro(req, res, todasTransacoes);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
};

module.exports = {
  cadastrarTransacao,
  listarFinanceiro
};
