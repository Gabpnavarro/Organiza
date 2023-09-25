const joi = require('joi');

const schemaFinanceiro = joi.object({
    data: joi.string().required(),
})

// validarCorpoRequisicao(schemaFinanceiro), 

module.exports = schemaFinanceiro