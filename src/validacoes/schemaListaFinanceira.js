const joi = require('joi')

const schemaListaFinanceira = joi.object({
	mes: joi.number().min(1).max(12).messages({
        'number.min': 'O campo mês deve receber no mínimoo o valor 1',
        'number.max': 'O campo mês deve receber no máximo o valor 12',
		'number.base': 'O campo mês deve ser um número',
	}),

    ano:joi.number().max(2023).messages({
        'number.max': 'O campo ano deve receber no máximo o valor 2023',
		'number.base': 'O campo ano deve ser um número',
	}),
})

module.exports = schemaListaFinanceira