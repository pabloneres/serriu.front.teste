import axios from 'axios'
import zapi from "./zapi";

const baseUrlAuth = (auth) => {
	return `https://api.z-api.io/instances/${auth?.app_zapi_token_instance}/token/${auth?.app_zapi_user_token}`
}

export function zapiStatus(auth) {
	return axios.get(baseUrlAuth(auth) + "/status")
}

export function zapiRestoreConnection() {
	return zapi.get("/restore-session")
}

export function zapiSendMessage(data) {
	return zapi.post("/send-text", data)
}

export function zapiGetChats() {
	return zapi.get("/chats?page=1&pageSize=300")
}

export function zapiGetMessages(number) {
	return zapi.get("/chat-messages/" + number)
}

export function zapiGetGroups() {
	return zapi.get("/group-metadata")
}

export function zapiDisconect() {
	return zapi.get("/disconnect")
}

export function zapiValidateNumber(phone) {
	return zapi.get("/phone-exists/" + phone)
}
