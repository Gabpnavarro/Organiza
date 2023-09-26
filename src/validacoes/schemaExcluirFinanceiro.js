const joi = require('joi')

const schemaExcluirFinanceiro = joi.object({
	id: joi.number().required().messages({
		'any.required': 'O campo id é obrigatório',
		'number.base': 'O campo id é obrigatório e deve ser um número',
	}),
})

module.exports = schemaExcluirFinanceiro