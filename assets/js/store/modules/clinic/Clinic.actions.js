export function Store(data) {
	return {
		type   : 'STORE',
		payload: data
	}
}

export function Select(data) {
	return {
		type   : 'SELECT',
		payload: data
	}
}

export function INDEX_CLINICS(data) {
	return {
		type   : 'INDEX_CLINICS',
		payload: data
	}
}

export function ChangeConfig(data) {
	return {
		type   : 'CONFIG',
		payload: data
	}
}