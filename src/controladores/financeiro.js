const knex = require("../conexao");
const { dataTratada } = require("../uteis/data");

const listagemParametrosTabela = async (req, res) => {
  try {
    const tipos = await knex("categorias").select(
      "categorias.id",
      "categorias.descricao as tipo"
    );

    const tipoEsubtipos = await knex("sub_categorias")
      .join("categorias", "categorias.id", "sub_categorias.categoria_id")
      .select(
        "sub_categorias.id",
        "sub_categorias.descricao as subtipo",
        "categorias.descricao as tipo"
      );

    const subtipos = tipoEsubtipos.sort((a, b) =>
      a.subtipo.localeCompare(b.subtipo)
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
    sub_categoria_id: subtipo,
    valor,
    usuario_id: req.usuario.id,
  };

  try {
    const [financeiro] = await knex("financeiro")
      .insert(cadastroFinanceiro)
      .returning(["descricao", "valor", "data"]);

    const categorias = await knex("sub_categorias")
      .join("categorias", "sub_categorias.categoria_id", "categorias.id")
      .where("sub_categorias.id", subtipo)
      .select("categorias.descricao as tipo")
      .first();

    const sub_categorias = await knex("financeiro")
      .join(
        "sub_categorias",
        "financeiro.categoria_id",
        "sub_categorias.categoria_id"
      )
      .where("sub_categorias.id", subtipo)
      .select("sub_categorias.descricao as sub_categoria")
      .first();

    // financeiro.data = dataTratada(data);
    // financeiro.tipo = categorias;
    // financeiro.subtipo = sub_categorias;

    res
      .status(201).json(financeiro);
      // .json({ mensagem: "Cadastro financeiro feito com sucesso." });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro no servidor" });
  }
};

const listaFinancas = async (req, res) => {
  try {
    const lista = await knex("financeiro")
      .join("sub_categorias", "financeiro.sub_categoria_id", "sub_categorias.id")
      .join("categorias", "sub_categorias.categoria_id", "categorias.id")
      .where("usuario_id", req.usuario.id)
      .select( "financeiro.id", "financeiro.data", "financeiro.descricao", "categorias.descricao as tipo", "sub_categorias.descricao as subtipo", "financeiro.valor", );

    res.status(200).json(lista);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro de servidor." });
  }
};

module.exports = {
  listagemParametrosTabela,
  cadastroFinanceiro,
  listaFinancas,
};
