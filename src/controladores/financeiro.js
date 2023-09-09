const pool = require('../conexao');
const {dataTratada} = require('../uteis/data');
const { descricaoCategoria } = require('../uteis/descricaoCategoria');

const cadastrarTransacao = async (req, res) => {
    const { descricao, valor, data, categoria_id } = req.body;
  
    try {
      const id = req.usuario.id;
  
      const queryTransacao = `
        insert into financeiro
        ( descricao, valor, data, usuario_id, categoria_id )
        values
        ($1, $2, $3, $4, $5) returning descricao, valor, data`;
  
      const transacaoCadastrada = await pool.query(queryTransacao, [
        descricao,
        valor,
        data,
        id,
        categoria_id,
      ]);

      const transacao = transacaoCadastrada.rows[0];

      const categoria_nome = await descricaoCategoria(req, res);

      transacao.categoria_nome = categoria_nome;

      transacao.data = await dataTratada(transacao.data)
  
      return res.status(201).json(transacao);
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
  };

  module.exports = {
    cadastrarTransacao,
  };