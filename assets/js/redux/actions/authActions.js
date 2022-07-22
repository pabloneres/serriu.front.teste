import { apiUpdateAccessToken } from "./../../config/api";
import { authConstants } from "./../constants";
import { authService } from "./../services";

/**
 * Authenticate user
 *
 * @param {Object} data
 * @param {string} data.email
 * @param {string} data.password
 *
 * @returns {function(*)}
 */
export const login = (data) => {
	return (dispatch) => {
		dispatch(request());

		authService.login({
			username: data.username,
			password: data.password,
		})
		.then((response) => {
			const access_token = response.data.token;

			// Update access_token from api instance
			apiUpdateAccessToken(`Bearer ${access_token}`);

			// Get user data
			authService.getUserData().then((response) => {
				dispatch(success({
					access_token : access_token,
					id           : response.data.id,
					firstName    : response.data.firstName,
					lastName     : response.data.lastName,
					email        : response.data.email,
					avatar       : response.data.avatar,
					department_id: response.data.department_id,

					// roles       : response.data.data.roles.map((role) => {
					// 	return {
					// 		id  : role.id,
					// 		name: role.name,
					// 	}
					// }),
					// permissions : response.data.data.permissions,
				}));
			})
			.catch((data) => {
				dispatch(error(data));
			});
		})
		.catch((data) => {
			dispatch(error(data));
		});
	};

	function request() {
		return {
			type: authConstants.LOGIN_REQUEST,
		}
	}

	function success(data) {
		return {
			type: authConstants.LOGIN_SUCCESS,
			data: data,
		}
	}

	function error(error) {
		return {
			type: authConstants.LOGIN_ERROR,
			data: {
				error_type   : error.error_type,
				error_message: error.error_message,
				error_errors : error.error_errors,
			}
		}
	}
};

/**
 * Logout
 *
 * @returns {Function}
 */
export const logout = () => {
	return (dispatch) => {
		authService.logout().then((response) => {
		}).catch((data) => {
		});

		dispatch({
			type: authConstants.LOGOUT,
		});
	};
};

/**
 * Logout without request, only locally
 *
 * @returns {{type: string}}
 */
export const silentLogout = () => {
	return {
		type: authConstants.LOGOUT,
	}
};

/**
 * Refresh token
 *
 * @param access_token
 *
 * @returns {{type: string, data: {access_token: *}}}
 */
export const refreshToken = (access_token) => {
	return {
		type: authConstants.REFRESH_TOKEN,
		data: {
			access_token: access_token,
		}
	};
};

/**
 * Re-load user data from server
 *
 * @returns {function(*)}
 */
export const refreshUserData = () => {
	return (dispatch) => {
		dispatch(request());

		// Get user data
		authService.getUserData().then((response) => {
			dispatch(success({
				firstName    : response.data.firstName,
				lastName     : response.data.lastName,
				email        : response.data.email,
				avatar       : response.data.avatar,
				department_id: response.data.department_id,
				// roles      : response.data.roles.map((role) => {
				// 	return {
				// 		id  : role.id,
				// 		name: role.name,
				// 	}
				// }),
				// permissions: response.data.data.permissions,
			}));
		})
		.catch((data) => {
			dispatch(error(data));
		});
	};

	function request() {
		return {
			type: authConstants.USERDATA_REQUEST,
		}
	}

	function success(data) {
		return {
			type: authConstants.USERDATA_SUCCESS,
			data: data,
		}
	}

	function error(error) {
		return {
			type: authConstants.USERDATA_ERROR,
			data: {
				error_type   : error.error_type,
				error_message: error.error_message,
				error_errors : error.error_errors,
			}
		}
	}
};

/**
 * Update avatar
 *
 * @param avatar
 *
 * @returns {{type: string, data: {avatar: *}}}
 */
export const updateAvatar = (avatar) => {
	return {
		type: authConstants.UPDATE_AVATAR,
		data: {
			avatar: avatar,
		}
	};
};
