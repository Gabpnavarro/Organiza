const knex = require("../conexao");

const descricaoCategoria = async (req, res, transacao) => {
  try {
    const queryCategoriaNome = "select descricao from categorias where id = :categoria_id";

    if (!transacao) {
      const { categoria_id } = req.body;

      const [categoria] = await knex.raw(queryCategoriaNome, { categoria_id });

      return categoria[0].descricao;
    } else {
      const [categoria] = await knex.raw(queryCategoriaNome, { categoria_id: transacao.categoria_id });

      return categoria[0].descricao;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
};

module.exports = { descricaoCategoria };
