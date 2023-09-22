const knex = require("../conexao");
const { dataTratada } = require("../uteis/data");

const listagemParametrosTabela = async (req, res) => {
  try {
    const tipos = await knex("categorias");
    const sub_categorias = await knex("sub_categorias");

    const subtipos = sub_categorias.sort((a, b) =>
      a.descricao.localeCompare(b.descricao)
    );

    res.status(200).json({ tipos, subtipos });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro no servidor." });
  }
};

const cadastroFinanceiro = async (req, res) => {
  const { data, descricao, tipo, subtipo, valor } = req.body;

  const cadastroFinanceiro = {
    data,
    descricao,
    categoria_id: tipo,
    valor,
    usuario_id: req.usuario.id,
  };

  try {
    const [financeiro] = await knex("financeiro")
    .insert(cadastroFinanceiro)
    .returning("*");

    const categorias = await knex("financeiro")
      .join("categorias", "financeiro.categoria_id", "categorias.id")
      .where("categorias.id", tipo)
      .select("categorias.descricao as categoria")
      .first();

      const sub_categorias = await knex("financeiro")
      .join("sub_categorias", "financeiro.categoria_id", "sub_categorias.categoria_id")
      .where("sub_categorias.id", subtipo)
      .select("sub_categorias.descricao as sub_categoria")
      .first();

      financeiro.tipo = categorias.categoria;
      financeiro.subtipo = sub_categorias.sub_categoria;
  
  res.status(201).json(financeiro);
  
  } catch (error) {
    res.status(500).json({ mensagem: "Erro no servidor" });
  }
};

module.exports = {
  listagemParametrosTabela,
  cadastroFinanceiro,
};
