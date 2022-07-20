export default function notifications(state = {
	atividades: {
		novas           : 0,
		vencidas        : 0,
		vencidasPassadas: 0,
		total           : 0
	},
}, action) {
	switch( action.type )
	{
		case "UPDATE_NEWS_ATIVIDADES":
			return {...state, atividades: action.payload}
		default:
			return state;
	}
}
