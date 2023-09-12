const { dataTratada, dataTratadaArray } = require("./data");

const filtro = async (req, res, todasTransacoes) => {
  const { data_inicio, data_final } = req.body;

  const filtrarDatas = data_inicio !== "" && data_final !== "";

  const categoria = req.query;

  const filtrarCategoria = Object.keys(categoria).length !== 0;

  if (filtrarDatas && filtrarCategoria) {
    const transacaoFiltrada = [];
    for (let i = 0; todasTransacoes.rows.length > i; i++) {
      if (
        dataTratada(todasTransacoes.rows[i].data) >= data_inicio &&
        dataTratada(todasTransacoes.rows[i].data) <= data_final
      ) {
        transacaoFiltrada.push(todasTransacoes.rows[i]);
      }
    }

    const transacaoCategorizada = [];

    for (let i = 0; categoria.filtro.length > i; i++) {
      const transacoesFiltradas = transacaoFiltrada.filter(
        (transacao) =>
          transacao.categoria_nome.toLowerCase() ==
          categoria.filtro[i].toLowerCase()
      );
      transacaoCategorizada.push(...transacoesFiltradas);
    }

    dataTratadaArray(transacaoCategorizada);

    return res.status(200).json(transacaoCategorizada);
  }

  if (filtrarDatas) {
    const transacaoFiltrada = [];
    for (let i = 0; todasTransacoes.rows.length > i; i++) {
      if (
        dataTratada(todasTransacoes.rows[i].data) >= data_inicio &&
        dataTratada(todasTransacoes.rows[i].data) <= data_final
      ) {
        transacaoFiltrada.push(todasTransacoes.rows[i]);
      }
    }
    dataTratadaArray(transacaoFiltrada);
    return res.status(200).json(transacaoFiltrada);
  }

  if (filtrarCategoria) {
    const transacaoFiltrada = [];

    for (let i = 0; categoria.filtro.length > i; i++) {
      const transacoesFiltradas = todasTransacoes.rows.filter(
        (transacao) =>
          transacao.categoria_nome.toLowerCase() ===
          categoria.filtro[i].toLowerCase()
      );

      transacaoFiltrada.push(...transacoesFiltradas);
    }

    return res.status(200).json(transacaoFiltrada);
  }
  dataTratadaArray(todasTransacoes.rows);
  return res.status(200).json(todasTransacoes.rows);
};

module.exports = filtro;
