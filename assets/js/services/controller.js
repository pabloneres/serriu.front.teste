import axios from 'axios'
import { api } from "../config/api"

const returnUrl = (params, query) => {
	if (!query) {
		return params;
	}
	if (query) {
		let filtro = new URLSearchParams(query).toString();
		return `${params}?${filtro}`;
	}
};

export function index_old(params, query, auth) {
	if (!auth) {
		return;
	}
	return api.get(returnUrl(params, query), {
		headers: {
			Authorization: "Bearer " + auth
		}
	});
}

export function index(params, query = undefined) {
	return api.get(returnUrl(params, query));
}

export function show(params, id, query) {
	return api.get(returnUrl(`${params}/${id}`, query));
}

export function store(params, data) {
	return api.post(params, data);
}

export function update(params, id, data) {
	return api.put(`${params}/${id}`, data);
}

export function destroy(params, id) {
	// Authorization head should be fulfilled in interceptor.
	return api.delete(`${params}/${id}`);
}

export function auth(data) {
	return api.post("/sessions", data, {});
}

export async function profile(token) {
	// Authorization head should be fulfilled in interceptor.
	return api.get("/profile", {
		headers: {
			Authorization: "Bearer " + token
		}
	});
}
