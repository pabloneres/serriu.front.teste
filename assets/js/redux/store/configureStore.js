import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import {
	authReducer,
	clinicReducer,
	notificationReducer,
	schedulerReducer,
	settingsReducer
} from "./../reducers";

const isDebuggingInChrome = process.env.NODE_ENV === "development";

const persistConfig = {
	key: "root",
	storage: storage,
	whitelist: [
		"auth",
		"clinic",
		"notification",
		"agenda",
		"settings",
	],
};

const rootReducer = combineReducers({
	auth: authReducer,
	clinic: clinicReducer,
	notification: notificationReducer,
	agenda: schedulerReducer,
	settings: settingsReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleware = [thunk];

if (isDebuggingInChrome) {
	middleware.push(logger);
}

export const store = createStore(persistedReducer, applyMiddleware(...middleware));
export const persistor = persistStore(store);
