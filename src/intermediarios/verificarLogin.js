const jwt = require("jsonwebtoken");
const knex = require("../conexao");
require('dotenv').config();

const verificaLogin = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ mensagem: "Não autorizado" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { id } = jwt.verify(token, process.env.JWT_PASS);

    const usuarioEncontrado = await knex('usuarios')
      .where({ id })
      .first(); 

    if (!usuarioEncontrado) {
      return res.status(401).json({ mensagem: "Não autorizado" });
    }

    const { senha, ...usuario } = usuarioEncontrado;

    req.usuario = usuario;

    next();
  } catch (error) {
    return res.status(401).json({ mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado." });
  }
};

module.exports = verificaLogin;
