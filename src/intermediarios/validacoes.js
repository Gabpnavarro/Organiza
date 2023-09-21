const knex = require('knex'); 

const validarEmailExistente = async (req, res, next) => {
  try {
    const { email } = req.body;

    const usuarioExistente = await knex('usuarios')
      .where({ email })
      .first(); 

    if (usuarioExistente) {
      return res.status(400).json({
        mensagem: "Já existe usuário cadastrado com o e-mail informado.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }

  next();
};

const validarDados = async (req, res, next) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ mensagem: "Por favor preencha os campos obrigatórios" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
  next();
};

const validarTransacao = async (req, res, next) => {
  try {
    const { descricao, valor, data, categoria_id } = req.body;

    if (!descricao || !valor || !data || !categoria_id) {
      return res
        .status(400)
        .json({
          mensagem: "Todos os campos obrigatórios devem ser informados.",
        });
    }

    const categoriaExistente = await knex('categorias')
      .where({ id: categoria_id })
      .first(); 
    if (!categoriaExistente) {
      return res.status(400).json({ mensagem: "Categoria não encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
  next();
};

const validarIDTransacao = async (req, res, next) => {
  try {
    const idToken = req.usuario.id;

    const { id } = req.params;

    const transacaoExistente = await knex('financeiro')
      .where({ id })
      .first(); 

    if (!transacaoExistente) {
      return res.status(400).json({ mensagem: "Transação não encontrada." });
    }

    if (transacaoExistente.usuario_id !== idToken) {
      return res.status(400).json({ mensagem: "Não autorizado." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
  next();
};

module.exports = {
  validarEmailExistente,
  validarDados,
  validarTransacao,
  validarIDTransacao,
};
