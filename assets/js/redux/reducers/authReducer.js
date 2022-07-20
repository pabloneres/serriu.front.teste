import { REHYDRATE } from "redux-persist";
import { authConstants } from "./../constants";

const reducerKey = "auth";

const defaultState = {
	isAuthenticated  : false,
	isLoggingIn      : false,
	isLoadingUserData: false,
	loginError       : "",
	loginFieldErrors : "",
	access_token     : "",
	userData         : {
		id         : "",
		firstName : "",
		lastName  : "",
		email      : "",
		avatar     : "",
        department_id: "",
		roles      : [],
		permissions: [],
	},
};

export default function reducer(state = defaultState, action) {
    console.log(action)
	switch( action.type )
	{
		case REHYDRATE:
			let persistUpdate = {};

			if( action.payload && action.payload[reducerKey] )
			{
				const persistCache = action.payload[reducerKey];

				persistUpdate = {
					isAuthenticated: persistCache.isAuthenticated,
					access_token   : persistCache.access_token,
				};

				if( persistCache.userData )
				{
					persistUpdate.userData = {
						id         : persistCache.userData.id || defaultState.userData.id,
						firstName : persistCache.userData.firstName || defaultState.userData.firstName,
						lastName  : persistCache.userData.lastName || defaultState.userData.lastName,
						email      : persistCache.userData.email || defaultState.userData.email,
						avatar     : persistCache.userData.avatar || defaultState.userData.avatar,
						department_id     : persistCache.userData.department_id || defaultState.userData.department_id,
						roles      : persistCache.userData.roles || defaultState.userData.roles,
						permissions: persistCache.userData.permissions || defaultState.userData.permissions,
					}
				}
			}

			return Object.assign({}, state, persistUpdate);

		case authConstants.LOGIN_REQUEST:
			return Object.assign({}, state, {
				isLoggingIn     : true,
				isAuthenticated : false,
				loginError      : "",
				loginFieldErrors: "",
			});

		case authConstants.LOGIN_SUCCESS:
			return Object.assign({}, state, {
				isLoggingIn    : false,
				isAuthenticated: true,
				access_token   : `Bearer ${action.data.access_token}`,
				userData       : {
					...state.userData,
					id         : action.data.id,
					firstName : action.data.firstName,
					lastName  : action.data.lastName,
					email      : action.data.email,
					avatar     : action.data.avatar,
					department_id     : action.data.department_id,
					// roles      : action.data.roles,
					// permissions: action.data.permissions,
				}
			});

		case authConstants.LOGIN_ERROR:
			return Object.assign({}, state, {
				isLoggingIn     : false,
				loginError      : action.data.error_message,
				loginFieldErrors: action.data.error_errors,
			});

		case authConstants.LOGOUT:
			return Object.assign({}, state, defaultState);

		case authConstants.REFRESH_TOKEN:
			return Object.assign({}, state, {
				access_token: `Bearer ${action.data.access_token}`,
			});

		case authConstants.USERDATA_REQUEST:
			return Object.assign({}, state, {
				isLoadingUserData: true,
			});

		case authConstants.USERDATA_SUCCESS:
			return Object.assign({}, state, {
				isLoadingUserData: false,
				userData         : {
					...state.userData,
					firstName : action.data.firstName,
					lastName  : action.data.lastName,
					email      : action.data.email,
					avatar     : action.data.avatar,
					department_id     : action.data.department_id,
					roles      : action.data.roles,
					permissions: action.data.permissions,
				}
			});

		case authConstants.USERDATA_ERROR:
			return Object.assign({}, state, {
				isLoadingUserData: false,
			});

		case authConstants.UPDATE_AVATAR:
			return Object.assign({}, state, {
				userData: {
					...state.userData,
					avatar: action.data.avatar,
				},
			});

		default:
			return state;
	}
}
