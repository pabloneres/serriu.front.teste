/**
 * Form validation language
 *
 * @returns {*}
 */
export function newFormValidationMessages() {
	return {
		default   : "Erro de validação no campo %s",
		required  : "%s é obrigatório",
		enum      : "%s deve ser dos %s",
		whitespace: "%s não pode ser vazio",
		date      : {
			format : "%s data %s é inválida para o formato %s",
			parse  : "%s data não pode ser analisada, %s é inválido ",
			invalid: "%s data %s é inválida",
		},
		types     : {
			string : "%s não é um %s",
			method : "%s não é um %s (função)",
			array  : "%s não é um %s",
			object : "%s não é um %s",
			number : "%s não é um %s",
			date   : "%s não é uma %s",
			boolean: "%s não é um %s",
			integer: "%s não é um %s",
			float  : "%s não é um %s",
			regexp : "%s não é um válido %s",
			email  : "%s não é um válido %s",
			url    : "%s não é um válido %s",
			hex    : "%s não é um válido %s",
		},
		string    : {
			len  : "%s deve ter exatamente %s caracteres",
			min  : "%s deve ter pelo menos %s caracteres",
			max  : "%s não pode ter mais de %s caracteres",
			range: "%s deve ter entre %s e %s caracteres",
		},
		number    : {
			len  : "%s deve ser igual %s",
			min  : "%s não pode ser menor que %s",
			max  : "%s não pode ser maior que %s",
			range: "%s deve estar entre %s e %s",
		},
		array     : {
			len  : "%s deve ter exatamente %s em comprimento",
			min  : "%s não pode ser menor que %s em comprimento",
			max  : "%s não pode ser maior que %s em comprimento",
			range: "%s deve estar entre %s e %s em comprimento",
		},
		pattern   : {
			mismatch: "%s valor %s não corresponde ao padrão %s",
		},
		clone() {
			const cloned = JSON.parse(JSON.stringify(this));
			cloned.clone = this.clone;
			return cloned;
		},
	};
}

export const FORM_VALIDATION_MESSAGES = newFormValidationMessages();
