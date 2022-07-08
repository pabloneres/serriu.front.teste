export default function clinic(state = {
	clinics       : [],
	selectedClinic: {}
}, action) {
	switch( action.type )
	{
		case "STORE":
			return {...state, clinics: action.payload}

		case "INDEX_CLINICS":
			return {...state, clinics: action.payload}

		case "SELECT":
			return {...state, selectedClinic: action.payload}

		case "CONFIG":
			return {...state, selectedClinic: {...state.selectedClinic, ...action.payload}}

		default:
			return state;
	}
}
