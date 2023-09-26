const joi = require('joi')

const schemaUsuario = joi.object({
	data: joi.date().required().messages({
		'any.required': 'O campo data é obrigatório',
		'string.empty': 'O campo data é obrigatório',
        'date.base': 'O formato da data está errado deve ser MM/DD/YYYY ou MM-DD-YYYY'
	}),

	descricao: joi.string().required().messages({
		'any.required': 'O campo descricao é obrigatório',
		'string.empty': 'O campo descricao é obrigatório',
	}),

	subtipo: joi.number().required().messages({
		'any.required': 'O campo subtipo é obrigatório',
		'string.empty': 'O campo subtipo é obrigatório',
        'number.base': 'O campo subtipo precisa ser um número',
	}),

	valor: joi.number().positive().required().messages({
		'number.positive': 'O campo valor precisa ser um número positivo',
		'number.base': 'O campo valor precisa ser um número',
        'any.required': 'O campo valor é obrigatório',
	}),
})

module.exports = schemaUsuario