const knex = require("../conexao");
const { dataTratada } = require("../uteis/data");

const listagemParametrosTabela = async (req, res) => {
  try {


    const tipoEsubtipos = await knex("categorias")
    .select("categorias.id as tipo_id", "categorias.descricao as tipo_descricao")
    .leftJoin("sub_categorias", "categorias.id", "sub_categorias.categoria_id")
    .select("sub_categorias.id as subtipo_id", "sub_categorias.descricao as subtipo_descricao")
    .orderBy("categorias.descricao")
    .orderBy("sub_categorias.descricao");

    const tipoEsubtiposOrdenados = tipoEsubtipos.sort((a, b) =>
      a.subtipo_descricao.localeCompare(b.subtipo_descricao)
    );

    res.status(200).json(tipoEsubtiposOrdenados);
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
    .returning(["descricao","valor","data"]);

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

      financeiro.data = dataTratada(data);
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
