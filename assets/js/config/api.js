import axios from "axios";
import { authConstants } from "~/redux/constants";
import { store } from "./../redux/store/configureStore";

import {
	API_URL,
	API_ERRO_TYPE_VALIDATION,
	API_ERRO_TYPE_API,
	API_ERRO_TYPE_SERVER,
	API_ERRO_TYPE_CONNECTION,
	API_ERRO_TYPE_OTHER,
	API_ERRO_TYPE_ACCESS_TOKEN,
	API_ERRO_TYPE_CANCEL,
	IS_DEBUG
} from "./general";

// -----------------------------------------------------------------------------
// General
// -----------------------------------------------------------------------------
export const API_HEADER_DEFAULT = {
	Accept: "application/json",
	"Content-Type": "application/json",
	Language: "pt",
};

// -----------------------------------------------------------------------------
// Instance
// -----------------------------------------------------------------------------
export const api = axios.create({
	baseURL: API_URL,
	timeout: 60 * 60 * 1000, // 60 minutes
	headers: API_HEADER_DEFAULT,
});

/**
 * Update acess token on default request
 *
 * @param access_token
 */
export const apiUpdateAccessToken = (access_token) => {
	access_token = access_token ? access_token : store.getState().auth.access_token;

	// Set access_token to instance
	api.defaults.headers.common["Authorization"] = access_token;
};

// -----------------------------------------------------------------------------
// Errors, Refresh token
// -----------------------------------------------------------------------------
api.interceptors.request.use((config) => {
	// Debug
	if (IS_DEBUG) {
		console.log("request", `${String(config.method).toUpperCase()} ${config.baseURL}${config.url}`);

		if (config.hasOwnProperty("data")) {
			console.log("request data", config.data);
		}
	}

	if (!config.headers.common["Authorization"]) {
		config.headers["Authorization"] = store.getState().auth.access_token;

		// Update access_token on instance
		apiUpdateAccessToken();
	}

	return config;
});

api.interceptors.response.use((response) => {
	if (IS_DEBUG) {
		console.log("response status", response.status);
		console.log("response headers", response.headers);
		console.log("response data", response.data);
	}

	return response;
}, (error) => {
	if (axios.isCancel(error)) {
		let errorReturn = {
			error: error,
			error_type: API_ERRO_TYPE_CANCEL,
			error_message: "Requisição cancelada.",
			error_errors: {},
		};

		errorReturn.toString = () => errorReturn.error_message;

		return Promise.reject(errorReturn);
	}

	const originalRequest = error.config;

	if (IS_DEBUG && error.response) {
		console.log("response status", error.response.status);
		console.log("response headers", error.response.headers);
		console.log("response data", error.response.data);
	}

	let is_logout_request = originalRequest && originalRequest.url.endsWith("auth/logout");
	let is_login_request = originalRequest && originalRequest.url.endsWith("auth/login");

	// Has response from server
	if (error.response) {
		// Invalid Token
		if (error.response.status === 401 && !is_logout_request && !is_login_request) {
			// Logout
			// Like authActions.silentLogout()
			store.dispatch({
				type: authConstants.LOGOUT,
			});

			let errorReturn = {
				error: error,
				error_type: API_ERRO_TYPE_ACCESS_TOKEN,
				error_message: "Você foi deslogado, por favor realize novamente o login.",
				error_errors: {},
			};

			errorReturn.toString = () => errorReturn.error_message;

			return Promise.reject(errorReturn);
		}
	}

	let errorReturn = {
		error: error,
		...getError(error),
	};

	errorReturn.toString = () => errorReturn.error_message;

	return Promise.reject(errorReturn);
});

/**
 * Get erro to response
 *
 * @param error
 * @returns {{error_type: string, error_message: string, error_errors}}
 */
export function getError(error) {
	let error_type = "";
	let error_message = "";
	let error_errors = {};

	// Has response from server
	if (error.response) {
		const { data } = error.response;

		// Key message on data
		if (data.hasOwnProperty("message")) {
			error_message = data.message;
		}

		// 401 with message
		if (error.response.status === 401) {
			error_type = API_ERRO_TYPE_OTHER;

			if (!error_message) {
				error_message = "Ocorreu um erro de autorização, por favor tente novamente.";
			}
		}
		// Form validation error
		else if (error.response.status === 422) {
			error_type = API_ERRO_TYPE_VALIDATION;

			// Get first validation error
			if (data.hasOwnProperty("errors")) {
				let data_errors = data.errors;

				// First error
				for (let key in data_errors) {
					if (data_errors.hasOwnProperty(key)) {
						error_message = data_errors[key][0];

						break;
					}
				}

				for (let key in data_errors) {
					if (data_errors.hasOwnProperty(key)) {
						error_errors[key] = data_errors[key][0];
					}
				}
			}
		}
		// Too Many Requests
		else if (error.response.status === 429) {
			error_type = API_ERRO_TYPE_SERVER;

			if (!error_message) {
				error_message = "Foi atingido o limite de requisições ao servidor, por favor tente novamente mais tarde.";
			}
		}
		// Internal server error
		else if (error.response.status === 500) {
			error_type = API_ERRO_TYPE_SERVER;

			if (!error_message) {
				error_message = "Ocorreu uma falha de comunicação com o servidor.";
			}
		}
		// Not found
		else if (error.response.status === 404) {
			error_type = API_ERRO_TYPE_OTHER;

			if (!error_message) {
				error_message = "A url acessada não existe.";
			}
		}
		// 400-499 with message
		else if (error.response.status > 400 && error.response.status < 499) {
			error_type = API_ERRO_TYPE_API;

			if (!error_message) {
				error_message = "Ocorreu um erro, por favor tente novamente.";
			}
		}
		else {
			error_type = API_ERRO_TYPE_OTHER;

			if (!error_message) {
				error_message = "Ocorreu um erro, por favor tente novamente.";
			}
		}
	}
	else {
		error_type = API_ERRO_TYPE_CONNECTION;
		error_message = "Falha de comunicação com o servidor, verifique sua conexão com a internet e tente novamente.";
	}

	return {
		error_type: error_type,
		error_message: error_message,
		error_errors: error_errors,
	};
}
