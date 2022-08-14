import { api } from "~/config/api";

export function index(auth, params) {
  return api.get(`${params}`)
}

export function show(auth, params, id) {
  return api.get(`${params}/${id}`);
}

export function store(auth, params, data) {
  return api.post(params, data);
}

export function update(auth, params, id, data) {
  return api.put(`${params}/${id}`, data);
}

export function destroy(auth, params, id) {
  // Authorization head should be fulfilled in interceptor.
  return api.delete(`${params}/${id}`);
}


export function auth(data) {
  return api.post('/sessions', data);
}

export async function profile(token) {
  // Authorization head should be fulfilled in interceptor.
  return api.get('/profile')
}