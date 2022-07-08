import axios from "axios";
import { store } from '~/store/index'

const api = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
	headers: {
		"Content-Type": "application/json",
		Authorization : `Bearer ${store.getState().auth.token}`,
	}
});

api.interceptors.response.use(
	function({data}) {
		return data;
	},
	function({response}) {
		return Promise.reject(response);
	}
);

export default api;
