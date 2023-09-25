const validarCorpoRequisicao = joiSchema => (req, res, next) => {
    try {
        joiSchema.validateAsync(req.body);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message })
    }
    
    next()
}

module.exports = validarCorpoRequisicao