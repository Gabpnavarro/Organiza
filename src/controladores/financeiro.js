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
  const { dataInicial, dataFinal, mes, ano } = req.body;
console.log(ano,mes)
  const dataInicialPresente = req.body.hasOwnProperty("dataInicial");
  const dataFinalPresente = req.body.hasOwnProperty("dataFinal");
  const mesPresente = req.body.hasOwnProperty("mes");
  const anoPresente = req.body.hasOwnProperty("ano");

  try {
    if (dataInicial <= dataFinal && dataInicialPresente && dataFinalPresente) {
      const lista = await knex("financeiro")
        .join(
          "sub_categorias",
          "financeiro.sub_categoria_id",
          "sub_categorias.id"
        )
        .join("categorias", "sub_categorias.categoria_id", "categorias.id")
        .where("usuario_id", req.usuario.id)
        .whereBetween("financeiro.data", [dataInicial, dataFinal])
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

      return res.status(200).json(lista);
    }

    if (mesPresente && anoPresente) {
      const lista = await knex("financeiro")
        .where("usuario_id", req.usuario.id)
        .where(knex.raw("EXTRACT(MONTH FROM financeiro.data) = ?", [mes]))
        .where(knex.raw("EXTRACT(YEAR FROM financeiro.data) = ?", [ano]));

      lista.forEach((item) => {
        item.data = dataTratada(item.data);
      });

      return res.status(200).json(lista);
    }

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

    return res.status(200).json(lista);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro de servidor." });
  }
};

const atualizarFinancia = async (req, res) => {
  const { usuario } = req;
  const { id, data, descricao, subtipo, valor } = req.body;

  if (!id) {
    return res
      .status(400)
      .json({ mensagem: "Identifique qual financia deve ser atualizada." });
  }

  if (!data && !descricao && !subtipo && !valor) {
    return res.status(400).json({
      mensagem: "Informe ao menos um campo para atualização do produto.",
    });
  }

  try {
    const financiaEncontrada = await knex("financeiro")
      .where({
        id,
        usuario_id: usuario.id,
      })
      .first();

    if (!financiaEncontrada) {
      return res.status(404).json("Financia não encontrado");
    }

    const [idSubtipo] = await knex("sub_categorias")
      .where("sub_categorias.descricao", subtipo)
      .select("sub_categorias.id");

    if (!idSubtipo) {
      return res.status(400).json({ mensagem: "O subtipo não é existente." });
    }

    const body = {};

    if (data) {
      body.data = data;
    }

    if (descricao) {
      body.descricao = descricao;
    }

    if (subtipo) {
      body.sub_categoria_id = idSubtipo.id;
    }

    if (valor) {
      body.valor = valor;
    }

    const atualizaDado = await knex("financeiro")
      .where({
        id,
        usuario_id: usuario.id,
      })
      .update(body);

    if (!atualizaDado) {
      return res
        .status(500)
        .json({ mensagem: "A financia não foi atualizada" });
    }

    return res.status(200).json({ mensagem: "Financia atualizada" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
};

const excluirFinancia = async (req, res) => {
  const { usuario } = req;
  const { id } = req.body;

  try {
    const financiaEncontrada = await knex("financeiro")
      .where({ id, usuario_id: usuario.id })
      .first();

    if (!financiaEncontrada) {
      return res.status(404).json({ mensagem: "Financia não encontrada" });
    }

    const financiaExcluido = await knex("financeiro")
      .where({
        id,
        usuario_id: usuario.id,
      })
      .del();

    if (!financiaExcluido) {
      return res.status(400).json({ mensagem: "A financia não foi excluida" });
    }

    return res
      .status(200)
      .json({ mensagem: "Exclusão da financia feita com sucesso" });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  listagemParametrosTabela,
  cadastroFinanceiro,
  listaFinancas,
  atualizarFinancia,
  excluirFinancia,
};
