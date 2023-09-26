const joi = require('joi')

const schemaAtualizarFinanceiro = joi.object({
	id: joi.number(),

	data: joi.date().iso().messages({
		'any.required': 'O campo data é obrigatório',
		'string.empty': 'O campo data é obrigatório',
		'date.format': 'O formato da data deve ser YYYY-MM-DD'
	}),

	descricao: joi.string().messages({
		'any.required': 'O campo descricao é obrigatório',
		'string.empty': 'O campo descricao é obrigatório',
	}),

	tipo: joi.string(),

	subtipo: joi.string().messages({
		'any.required': 'O campo subtipo é obrigatório',
		'string.empty': 'O campo subtipo é obrigatório',
        'string.base': 'O campo subtipo precisa ser escrito no formato de um nome',
	}),

	valor: joi.number().positive().messages({
		'number.positive': 'O campo valor precisa ser um número positivo',
		'number.base': 'O campo valor precisa ser um número',
        'any.required': 'O campo valor é obrigatório',
	}),
})

module.exports = schemaAtualizarFinanceiro