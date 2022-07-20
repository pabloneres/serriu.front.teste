import { api } from "./../../config/api";

const basePath = "auth";

/**
 * Login user
 *
 * @param {Object} data
 * @param {string} data.username
 * @param {string} data.password
 *
 * @returns {Promise<T>}
 */
export const login = (data) => {
	return api.post(`${basePath}/login`, {
		username   : data.username,
		password: data.password,
	});
};

/**
 * Logout logged user
 *
 * @returns {Promise<T>}
 */
export const logout = () => {
	return api.delete(`${basePath}/logout`);
};

/**
 * Password recovery
 *
 * @param {Object} options
 * @param {string} options.email
 *
 * @returns {Promise<T>}
 */
export const passwordRecovery = (options) => {
	return api.post(`${basePath}/password/recovery`, options);
};

/**
 * Get logged user data
 *
 * @returns {Promise<T>}
 */
export const getUserData = () => {
	return api.get(`profile`);
};

/**
 * Change user password
 *
 * @param {Object} data
 * @param {string} data.password
 * @param {string} data.password_new
 * @param {string} data.password_new_confirmation
 *
 * @returns {Promise<T>}
 */
export const changePassword = (data) => {
	return api.post(`${basePath}/change-password`, {
		password                 : data.password,
		password_new             : data.password_new,
		password_new_confirmation: data.password_new_confirmation,
	});
};

/**
 * Change user avatar
 *
 * @param {Object} data
 * @param {Object} data.avatar
 *
 * @returns {Promise<T>}
 */
export const changeAvatar = (data) => {
	const form = new FormData();
	form.append("avatar", data.avatar, data.avatar.name);

	return api.post(`${basePath}/change-avatar`, form);
};
