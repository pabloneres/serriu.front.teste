import axios from "axios";
import { store } from '~/store/index'

const settings = store.getState().settings

const baseUrl = `https://api.z-api.io/instances/${settings?.app_zapi_token_instance}/token/${settings?.app_zapi_user_token}/`

const zapi = axios.create({
	baseURL: baseUrl,
	headers: {
		"Content-Type": "application/json",
	}
});

zapi.interceptors.response.use(
	function({data}) {
		return data;
	},
	function({response}) {
		console.log(response.data);
		return Promise.reject(response);
	}
);

export default zapi;
