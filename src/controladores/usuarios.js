const bcrypt = require("bcrypt");
const pool = require("../conexao");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const cadastrarUsuario = async (req,res) => {
    const {nome, email, senha} = req.body;

    try {
        const senhaCripto = await bcrypt.hash(senha, 10);
    
        const query = `
         insert into usuarios
         (nome, email, senha)
         values
         ($1, $2, $3) returning *`;
    
        const { rows } = await pool.query(query, [nome, email, senhaCripto]);
        const { senha: _, ...usuario } = rows[0];
    
        return res.status(201).json(usuario);
      } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
      }
}

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const { rows, rowCount } = await pool.query(
      "select * from usuarios where email = $1",
      [email]
    );

    if (rowCount === 0) {
      return res
        .status(401)
        .json({ mensagem: "Usuário e/ou senha inválido(s)." });
    }

    const { senha: senhaUsuario, ...usuario } = rows[0];

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
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

module.exports = {
    cadastrarUsuario,
    login
}