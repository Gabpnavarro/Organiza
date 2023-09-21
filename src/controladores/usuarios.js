const bcrypt = require("bcrypt");
const pool = require("../conexao");
const jwt = require("jsonwebtoken");
const knex = require("knex")
require('dotenv').config();

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const novoUsuario = {
      nome,
      email,
      senha: await bcrypt.hash(senha, 10)
    };

    const [usuarioInserido] = await knex('usuarios')
      .insert(novoUsuario)
      .returning(['id', 'nome', 'email']); 

    return res.status(201).json(usuarioInserido);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}
const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [usuarioEncontrado] = await knex('usuarios')
      .where({ email })
      .select('*');

    if (!usuarioEncontrado) {
      return res
        .status(401)
        .json({ mensagem: "Usuário e/ou senha inválido(s)." });
    }

    const { senha: senhaUsuario, ...usuario } = usuarioEncontrado;

    const senhaValida = await bcrypt.compare(senha, senhaUsuario);

    if (!senhaValida) {
      return res
        .status(401)
        .json({ mensagem: "Usuário e/ou senha inválido(s)." });
    }
    
    const token = jwt.sign({ id: usuario.id }, process.env.JWT_PASS);

    return res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

module.exports = {
    cadastrarUsuario,
    login
}