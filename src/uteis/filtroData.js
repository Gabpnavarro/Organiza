const { dataTratada } = require("./data");

const filtro = async (req, res, todasTransacoes) => {

    const { data_inicio, data_final } = req.body;

    const filtrarDatas = data_inicio !== "" && data_final !== "";

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
      return res.status(200).json(transacaoFiltrada);
    }

    return res.status(200).json(todasTransacoes.rows);
}

module.exports = filtro;
