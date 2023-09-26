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

    res.status(200).json({ tipo: tipos, subtipo: subtipos });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro no servidor." });
  }
};

const cadastroFinanceiro = async (req, res) => {
  const { data, descricao, subtipo, valor } = req.body;

  try {
    const [idSubtipo] = await knex("sub_categorias")
      .where("sub_categorias.descricao", subtipo)
      .select("sub_categorias.id");

    const cadastroFinanceiro = {
      data,
      descricao,
      sub_categoria_id: idSubtipo.id,
      valor,
      usuario_id: req.usuario.id,
    };

    const [financeiro] = await knex("financeiro")
      .insert(cadastroFinanceiro)
      .returning(["descricao", "valor", "data"]);

    const categorias = await knex("sub_categorias")
      .join("categorias", "sub_categorias.categoria_id", "categorias.id")
      .where("sub_categorias.id", idSubtipo.id)
      .select("categorias.descricao as tipo")
      .first();

    const sub_categorias = await knex("financeiro")
      .join(
        "sub_categorias",
        "financeiro.sub_categoria_id",
        "sub_categorias.id"
      )
      .where("sub_categorias.id", idSubtipo.id)
      .select("sub_categorias.descricao as subtipo")
      .first();

    financeiro.data = dataTratada(data);
    financeiro.tipo = categorias.tipo;
    financeiro.subtipo = sub_categorias.subtipo;

    res.status(201).json(financeiro);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro no servidor" });
  }
};

const listaFinancas = async (req, res) => {
  try {
    const lista = await knex("financeiro")
      .join(
        "sub_categorias",
        "financeiro.sub_categoria_id",
        "sub_categorias.id"
      )
      .join("categorias", "sub_categorias.categoria_id", "categorias.id")
      .where("usuario_id", req.usuario.id)
      .select(
        "financeiro.id",
        "financeiro.data",
        "financeiro.descricao",
        "categorias.descricao as tipo",
        "sub_categorias.descricao as subtipo",
        "financeiro.valor"
      )
      .orderBy("financeiro.id", "desc");

    lista.forEach((item) => {
      item.data = dataTratada(item.data);
    });

    res.status(200).json(lista);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro de servidor." });
  }
};

const atualizarFinancia = async (req, res) => {
  const { usuario } = req;
  const { id, data, descricao, tipo, subtipo, valor } = req.body;

  if (!id) {
    return res
      .status(400)
      .json({ mensagem: "Identifique qual financia deve ser atualizada." });
  }

  if (!data && !descricao && !tipo && !subtipo && !valor) {
    return res.status(400).json({
      mensagem: "Informe ao menos um campo para atualização do produto.",
    });
  }

  try {
    const financiaEncontrada = await knex("financiero")
      .where({
        id,
        usuario_id: usuario.id,
      })
      .first();

    if (!financiaEncontrada) {
      return res.status(404).json("Financia não encontrado");
    }
  } catch (error) {}
};

module.exports = {
  listagemParametrosTabela,
  cadastroFinanceiro,
  listaFinancas,
  atualizarFinancia,
};
