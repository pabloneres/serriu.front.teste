export default function settings(state = {
	app_zapi_token_instance: "",
	app_zapi_user_token    : ""
}, action) {
	switch( action.type )
	{
		case "STORE":
			const data = {}
			action.payload.forEach(item => {
				data[item.setting_name] = item.value
			})
			return {...state, ...data}
		case "UPDATE":
			console.log(action.payload)
			return {...state, ...action.payload}
		default:
			return state;
	}
}
