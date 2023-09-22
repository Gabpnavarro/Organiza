const knex = require("../conexao");

const listagemParametrosTabela = async (req, res) => {
  try {
    const tipos = await knex("categorias");
    const sub_categorias = await knex("sub_categorias");

    const subtipos = sub_categorias.sort((a, b) => a.descricao.localeCompare(b.descricao));

    res.status(200).json({ tipos, subtipos});
  } catch (error) {
    res.status(500).json({ mensagem: "Erro no servidor." });
  }
};

module.exports = {
  listagemParametrosTabela,
};
