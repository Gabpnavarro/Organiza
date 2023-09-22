const knex = require("../conexao");

const listagemParametrosTabela = async (req, res) => {
  try {
    const tipos = await knex("categorias");
    const subtipos = await knex("sub_categorias");
    res.status(200).json({ tipos, subtipos });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro no servidor." });
  }
};

module.exports = {
  listagemParametrosTabela,
};
