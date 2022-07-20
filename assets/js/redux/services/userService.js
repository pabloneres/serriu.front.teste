import { api } from "./../../config/api";

const basePath = "users";

/**
 * Get all
 *
 * @param {Object} options
 * @param {number} [options.page]
 * @param {number} [options.limit]
 * @param {string} [options.search]
 * @param {string} [options.orderBy]
 *
 * @returns {Promise<T>}
 */
export const getAll = (options) => {
	const options_default = {};

	// Merge config
	options = Object.assign({}, options_default, options);

	let params    = [];
	let params_qs = "";

	if( options.hasOwnProperty("page") )
	{
		params.push(`page=${options.page}`);
	}

	if( options.hasOwnProperty("limit") )
	{
		params.push(`limit=${options.limit}`);
	}

	if( options.hasOwnProperty("search") )
	{
		params.push(`search=${options.search}`);
	}

	if( options.hasOwnProperty("orderBy") )
	{
		params.push(`orderBy=${options.orderBy}`);
	}

	if( params.length )
	{
		params_qs = `?${params.join("&")}`;
	}

	return api.get(`${basePath}${params_qs}`);
};

/**
 * Show
 *
 * @param {Object} options
 * @param {number} options.id
 *
 * @returns {Promise<T>}
 */
export const show = (options) => {
	return api.get(`${basePath}/${options.id}`);
};

/**
 * Create
 *
 * @param {Object} options
 * @param {string} options.first_name
 * @param {string} options.last_name
 * @param {string} options.email
 * @param {string} options.password
 * @param {string} options.password_confirmation
 * @param {boolean} [options.is_active]
 * @param {integer[]} options.roles
 *
 * @returns {Promise<T>}
 */
export const create = (options) => {
	return api.post(basePath, options);
};

/**
 * Edit
 *
 * @param {Object} options
 * @param {number} options.id
 * @param {boolean} [options.is_active]
 * @param {integer[]} [options.roles]
 *
 * @returns {Promise<T>}
 */
export const edit = (options) => {
	return api.post(`${basePath}/${options.id}`, options);
};

/**
 * Delete
 *
 * @param {Object} options
 * @param {number} options.id
 *
 * @returns {Promise<T>}
 */
export const destroy = (options) => {
	return api.delete(`${basePath}/${options.id}`);
};

/**
 * Export
 *
 * @param {Object} options
 * @param {string} [options.date_start]
 * @param {string} [options.date_end]
 *
 * @returns {Promise<T>}
 */
export const exportItens = (options) => {
	let params    = [];
	let params_qs = "";

	if( options.hasOwnProperty("date_start") )
	{
		params.push(`date_start=${options.date_start}`);
	}

	if( options.hasOwnProperty("date_end") )
	{
		params.push(`date_end=${options.date_end}`);
	}

	if( params.length )
	{
		params_qs = `?${params.join("&")}`;
	}

	return api.get(`${basePath}/export${params_qs}`);
};
